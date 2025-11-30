// API Configuration - IMPORTANT!
// Since the PHP server runs with document root as 'public' (-t public)
// We need absolute URL to access /api folder which is outside /public
const API_BASE = '../api';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const trendingGrid = document.getElementById('trendingGrid');
const recommendGrid = document.getElementById('recommendGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Track favorited movies
const favoriteMovies = new Set();

// Filter State
const filterState = {
  genres: [],
  yearMin: null,
  yearMax: null,
  ratingMin: 0,
  ratingMax: 10,
  runtimeMin: 0,
  runtimeMax: 300,
  language: '',
  sortBy: 'popularity.desc'
};

// Filter UI Elements
const filterToggle = document.getElementById('filterToggle');
const filterPanel = document.getElementById('filterPanel');
const closeFilters = document.getElementById('closeFilters');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');
const ratingMinSlider = document.getElementById('ratingMin');
const ratingMaxSlider = document.getElementById('ratingMax');
const ratingMinDisplay = document.getElementById('ratingMinDisplay');
const ratingMaxDisplay = document.getElementById('ratingMaxDisplay');
const runtimeMinSlider = document.getElementById('runtimeMin');
const runtimeMaxSlider = document.getElementById('runtimeMax');
const runtimeMinDisplay = document.getElementById('runtimeMinDisplay');
const runtimeMaxDisplay = document.getElementById('runtimeMaxDisplay');
const yearMinInput = document.getElementById('yearMin');
const yearMaxInput = document.getElementById('yearMax');
const languageSelect = document.getElementById('languageSelect');
const sortSelect = document.getElementById('sortSelect');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeFilters();
  loadTrending();
  loadFavorites();
  setupSearch();
  setupFilterHandlers();
});

// Close modal handlers
closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

/* ===== API Helper Functions ===== */

async function apiGET(path) {
  try {
    const res = await fetch(`${API_BASE}/${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API GET Error:', error);
    return { results: [], error: error.message };
  }
}

async function apiPOST(path, body) {
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    // Parse JSON response regardless of status
    const data = await res.json();

    // If not OK, return the error data (don't throw)
    if (!res.ok) {
      return { error: data.error || `HTTP ${res.status}`, status: res.status };
    }

    return data;
  } catch (error) {
    console.error('API POST Error:', error);
    return { error: error.message };
  }
}

async function apiDELETE(path) {
  try {
    const res = await fetch(`${API_BASE}/${path}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API DELETE Error:', error);
    return { error: error.message };
  }
}

/* ===== UI Component Functions ===== */

function makeCard(movie, { showFav = true } = {}) {
  const card = document.createElement('div');
  card.className = 'card';

  // Poster
  const posterUrl = movie.poster_path ? IMAGE_BASE + movie.poster_path : '';
  const poster = document.createElement('div');
  poster.className = 'poster';
  if (posterUrl) {
    poster.style.backgroundImage = `url(${posterUrl})`;
  } else {
    poster.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    poster.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:48px;">🎬</div>';
  }

  // Title
  const title = document.createElement('h3');
  title.textContent = movie.title || movie.name || 'Untitled';

  // Meta info
  const meta = document.createElement('div');
  meta.className = 'meta';
  const rating = movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}` : '⭐ N/A';
  const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
  meta.textContent = `${rating}${year ? ' • ' + year : ''}`;

  // Actions
  const actions = document.createElement('div');
  actions.className = 'actions';

  // View Details button
  const viewBtn = document.createElement('button');
  viewBtn.className = 'btn secondary';
  viewBtn.textContent = 'Details';
  viewBtn.onclick = (e) => {
    e.stopPropagation();
    openDetails(movie.id);
  };
  actions.appendChild(viewBtn);

  // Add to Favorites button
  if (showFav) {
    const favBtn = document.createElement('button');
    favBtn.className = 'btn primary';
    const isFavorited = favoriteMovies.has(movie.id);

    if (isFavorited) {
      favBtn.innerHTML = '♥'; // Filled white heart
      favBtn.classList.add('favorited');
    } else {
      favBtn.innerHTML = '♡ Favorite'; // Outline heart + text
    }

    favBtn.onclick = async (e) => {
      e.stopPropagation();
      // Check current state dynamically
      const isNowFavorited = favoriteMovies.has(movie.id);

      if (isNowFavorited) {
        // Show confirmation to remove
        const result = await Swal.fire({
          title: 'Remove from Favorites?',
          text: 'This movie is already in your favorites. Do you want to remove it?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, Remove',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#ff6b6b',
          position: 'top-end',
          toast: true,
          timer: null,
          timerProgressBar: false
        });
        if (result.isConfirmed) {
          await removeFromFavorites(movie.id, favBtn);
        }
      } else {
        await addToFavorites(movie, favBtn);
      }
    };
    actions.appendChild(favBtn);
  }

  // Assemble card
  card.appendChild(poster);
  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

/* ===== Data Loading Functions ===== */

async function loadTrending() {
  trendingGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">Loading trending movies...</div>';

  const data = await apiGET('tmdb_proxy.php?mode=trending&type=movie&time_window=week');

  trendingGrid.innerHTML = '';

  if (data.results && data.results.length > 0) {
    data.results.slice(0, 24).forEach(movie => {
      trendingGrid.appendChild(makeCard(movie));
    });
  } else {
    trendingGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#ff6b6b; padding:40px;">⚠️ Backend not running. Start PHP server to load movies.<br><br>Run: <code style="background:#1a2332;padding:8px 12px;border-radius:6px;display:inline-block;margin-top:8px;">php -S localhost:8000</code><br>Then update API_BASE in app.js</div>';
  }
}

async function loadFavorites() {
  favoritesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">Loading favorites...</div>';

  const favs = await apiGET('favorites.php');

  favoritesGrid.innerHTML = '';

  // Update favoriteMovies Set
  favoriteMovies.clear();

  if (Array.isArray(favs) && favs.length > 0) {
    favs.forEach(fav => {
      const movie = fav.movie_data;
      favoriteMovies.add(movie.id); // Track this as favorited
      const card = makeCard(movie, { showFav: false });

      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn secondary';
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = async (e) => {
        e.stopPropagation();
        await removeFromFavorites(movie.id);
      };
      card.querySelector('.actions').appendChild(removeBtn);

      favoritesGrid.appendChild(card);
    });
  } else if (Array.isArray(favs) && favs.length === 0) {
    favoritesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">No favorite movies yet.<br>Click the ♡ button on any movie to add it here!</div>';
  } else {
    favoritesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#ff6b6b; padding:40px;">⚠️ Backend required for favorites feature.<br>Install PHP and run the server to use this feature.</div>';
  }

  // Update custom recommendations
  await loadRecommendationsFromFavorites();
}

async function addToFavorites(movie, buttonElement = null) {
  const payload = {
    movie_id: movie.id,
    movie_data: {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    }
  };

  const result = await apiPOST('favorites.php', payload);

  if (result.success) {
    // Update the button immediately
    if (buttonElement) {
      buttonElement.innerHTML = '♥'; // Filled white heart
      buttonElement.classList.add('favorited');
    }
    await loadFavorites();
    showAlert('Added to Favorites!', `"${movie.title || movie.name}" has been saved!`, 'success');
  } else if (result.status === 409 || (result.error && result.error.includes('already'))) {
    showAlert('Already in Favorites', 'This movie is already in your list.', 'info');
  } else {
    showAlert('Error', result.error || 'Favorites feature requires PHP backend.', 'error');
  }
}

/* ===== SweetAlert2 Notification System ===== */

function showAlert(title, message, type = 'info') {
  Swal.fire({
    title: title,
    text: message,
    icon: type,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}

async function removeFromFavorites(movieId, buttonElement = null) {
  const result = await apiDELETE(`favorites.php?movie_id=${movieId}`);

  if (result.success) {
    // Update the button immediately
    if (buttonElement) {
      buttonElement.innerHTML = '♡ Favorite'; // Outline heart + text
      buttonElement.classList.remove('favorited');
    }
    await loadFavorites();
    showAlert('Removed!', 'Movie removed from favorites.', 'success');
  } else {
    console.error('Failed to remove favorite:', result.error);
  }
}

/* ===== Movie Details Modal ===== */

async function openDetails(movieId) {
  modalBody.innerHTML = '<div style="text-align:center; padding:40px; color:#9aa4b2;">Loading movie details...</div>';
  modal.classList.remove('hidden');

  // Fetch movie details, reviews, and recommendations in parallel
  const [details, reviews, recs] = await Promise.all([
    apiGET(`tmdb_proxy.php?mode=movie&id=${movieId}`),
    apiGET(`tmdb_proxy.php?mode=reviews&id=${movieId}`),
    apiGET(`tmdb_proxy.php?mode=recommendations&id=${movieId}`)
  ]);

  renderModal(details, reviews, recs);
}

function renderModal(details, reviews, recs) {
  modalBody.innerHTML = '';

  // Check if backend is running
  if (details.error) {
    modalBody.innerHTML = '<div style="text-align:center; padding:40px; color:#ff6b6b;">⚠️ Backend not running. Start PHP server to view details.</div>';
    return;
  }

  // Title
  const title = document.createElement('h2');
  title.textContent = details.title || details.name || 'Untitled';

  // Meta info
  const info = document.createElement('p');
  info.className = 'meta';
  const releaseDate = details.release_date || '';
  const runtime = details.runtime ? `${details.runtime} min` : 'N/A';
  const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';
  const genres = details.genres ? details.genres.map(g => g.name).join(', ') : '';
  info.textContent = `${releaseDate} • ${runtime} • ⭐ ${rating}${genres ? ' • ' + genres : ''}`;

  // Overview
  const overview = document.createElement('p');
  overview.textContent = details.overview || 'No overview available.';
  overview.style.lineHeight = '1.7';

  // Favorite button
  const favBtn = document.createElement('button');
  favBtn.className = 'btn primary';
  favBtn.textContent = '♡ Add to Favorites';
  favBtn.style.marginBottom = '24px';
  favBtn.onclick = async () => {
    await addToFavorites(details);
  };

  modalBody.appendChild(title);
  modalBody.appendChild(info);
  modalBody.appendChild(overview);
  modalBody.appendChild(favBtn);

  // Reviews section
  if (reviews.results && reviews.results.length > 0) {
    const reviewSection = document.createElement('div');
    reviewSection.innerHTML = '<h3>Reviews</h3>';

    reviews.results.slice(0, 5).forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'card';
      reviewCard.style.padding = '16px';
      reviewCard.style.cursor = 'default';

      const author = document.createElement('strong');
      author.textContent = review.author;
      author.style.color = '#ff8787';

      const content = document.createElement('p');
      content.className = 'meta';
      content.style.marginTop = '8px';
      const truncated = review.content.length > 400
        ? review.content.slice(0, 400) + '...'
        : review.content;
      content.textContent = truncated;

      reviewCard.appendChild(author);
      reviewCard.appendChild(content);
      reviewSection.appendChild(reviewCard);
    });

    modalBody.appendChild(reviewSection);
  }

  // Recommendations section
  if (recs.results && recs.results.length > 0) {
    const recSection = document.createElement('div');
    recSection.innerHTML = '<h3>You Might Also Like</h3>';

    const recGrid = document.createElement('div');
    recGrid.className = 'grid';

    recs.results.slice(0, 8).forEach(movie => {
      recGrid.appendChild(makeCard(movie));
    });

    recSection.appendChild(recGrid);
    modalBody.appendChild(recSection);
  }
}

/* ===== Custom Recommendation System ===== */

async function loadRecommendationsFromFavorites() {
  recommendGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">Loading recommendations...</div>';

  const favs = await apiGET('favorites.php');

  // If backend error (not an array), show error
  if (!Array.isArray(favs)) {
    recommendGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#ff6b6b; padding:40px;">⚠️ Backend required for personalized recommendations.<br>Start PHP server and add some favorites!</div>';
    return;
  }

  // If no favorites, show specific message
  if (favs.length === 0) {
    recommendGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">Add movies to your favorites to get personalized recommendations!</div>';
    return;
  }

  // Fetch recommendations for each favorite (limit to first 5 for performance)
  const recLists = await Promise.all(
    favs.slice(0, 5).map(fav =>
      apiGET(`tmdb_proxy.php?mode=recommendations&id=${fav.movie_id}`)
    )
  );

  // Flatten and deduplicate
  const movieMap = new Map();
  recLists.forEach(recList => {
    if (recList.results) {
      recList.results.forEach(movie => {
        if (!movieMap.has(movie.id)) {
          movieMap.set(movie.id, movie);
        }
      });
    }
  });

  // Remove movies that are already in favorites
  favs.forEach(fav => movieMap.delete(fav.movie_id));

  // Sort by popularity and show top 12
  const recommendations = Array.from(movieMap.values())
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 12);

  recommendGrid.innerHTML = '';

  if (recommendations.length > 0) {
    recommendations.forEach(movie => {
      recommendGrid.appendChild(makeCard(movie));
    });
  } else {
    recommendGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">No recommendations available yet.</div>';
  }
}

/* ===== Search Functionality ===== */

function setupSearch() {
  const performSearch = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    trendingGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">Searching...</div>';

    const data = await apiGET(`tmdb_search.php?q=${encodeURIComponent(query)}`);

    trendingGrid.innerHTML = '';

    if (data.results && data.results.length > 0) {
      // Update section title temporarily
      const section = trendingGrid.closest('section');
      const originalTitle = section.querySelector('h2').textContent;
      section.querySelector('h2').textContent = `Search Results for "${query}"`;

      data.results.slice(0, 24).forEach(movie => {
        trendingGrid.appendChild(makeCard(movie));
      });

      // Add button to restore trending
      const resetBtn = document.createElement('button');
      resetBtn.className = 'btn secondary';
      resetBtn.textContent = '← Back to Trending';
      resetBtn.style.marginBottom = '16px';
      resetBtn.onclick = () => {
        section.querySelector('h2').textContent = originalTitle;
        searchInput.value = '';
        loadTrending();
      };
      section.insertBefore(resetBtn, trendingGrid);
    } else {
      trendingGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#ff6b6b; padding:40px;">⚠️ Backend not running or no results found.</div>';
    }
  };

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

/* ===== Filter System ===== */

async function initializeFilters() {
  // Load genres
  const genresData = await apiGET('filters.php?type=genres');
  if (genresData.genres) {
    const genreChips = document.getElementById('genreChips');
    genresData.genres.forEach(genre => {
      const chip = document.createElement('button');
      chip.className = 'genre-chip';
      chip.dataset.id = genre.id;
      chip.textContent = genre.name;
      chip.onclick = () => toggleGenre(genre.id, chip);
      genreChips.appendChild(chip);
    });
  }

  // Load languages
  const langsData = await apiGET('filters.php?type=languages');
  if (Array.isArray(langsData)) {
    langsData.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.iso_639_1;
      option.textContent = lang.english_name;
      languageSelect.appendChild(option);
    });
  }

  // Initialize year max to current year (2025)
  yearMaxInput.value = '2025';

  // Load filters from URL
  loadFiltersFromURL();
}

function setupFilterHandlers() {
  // Toggle filter panel
  filterToggle.addEventListener('click', () => {
    filterPanel.classList.toggle('active');
    document.body.classList.toggle('filters-open');
  });

  closeFilters.addEventListener('click', () => {
    filterPanel.classList.remove('active');
    document.body.classList.remove('filters-open');
  });

  // Rating sliders
  ratingMinSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (val > filterState.ratingMax) {
      e.target.value = filterState.ratingMax;
    } else {
      filterState.ratingMin = val;
      ratingMinDisplay.textContent = val;
    }
  });

  ratingMaxSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (val < filterState.ratingMin) {
      e.target.value = filterState.ratingMin;
    } else {
      filterState.ratingMax = val;
      ratingMaxDisplay.textContent = val;
    }
  });

  // Runtime sliders
  runtimeMinSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (val > filterState.runtimeMax) {
      e.target.value = filterState.runtimeMax;
    } else {
      filterState.runtimeMin = val;
      runtimeMinDisplay.textContent = val;
    }
  });

  runtimeMaxSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (val < filterState.runtimeMin) {
      e.target.value = filterState.runtimeMin;
    } else {
      filterState.runtimeMax = val;
      runtimeMaxDisplay.textContent = val;
    }
  });

  // Year inputs
  yearMinInput.addEventListener('change', (e) => {
    filterState.yearMin = e.target.value || null;
  });

  yearMaxInput.addEventListener('change', (e) => {
    filterState.yearMax = e.target.value || null;
  });

  // Language select
  languageSelect.addEventListener('change', (e) => {
    filterState.language = e.target.value;
  });

  // Sort select
  sortSelect.addEventListener('change', (e) => {
    filterState.sortBy = e.target.value;
  });

  // Apply filters
  applyFiltersBtn.addEventListener('click', applyFilters);

  // Clear filters
  clearFiltersBtn.addEventListener('click', clearFilters);
}

function toggleGenre(genreId, chipElement) {
  const index = filterState.genres.indexOf(genreId);
  if (index > -1) {
    filterState.genres.splice(index, 1);
    chipElement.classList.remove('active');
  } else {
    filterState.genres.push(genreId);
    chipElement.classList.add('active');
  }
}

async function applyFilters() {
  // Show loading state
  const btn = document.getElementById('applyFilters');
  const loader = btn.querySelector('.btn-loader');
  btn.classList.add('loading');
  btn.disabled = true;

  // Build query string
  const params = new URLSearchParams();
  params.set('mode', 'discover');

  if (filterState.genres.length > 0) {
    params.set('genre', filterState.genres.join(','));
  }
  if (filterState.yearMin) {
    params.set('year_min', filterState.yearMin);
  }
  if (filterState.yearMax) {
    params.set('year_max', filterState.yearMax);
  }
  if (filterState.ratingMin > 0) {
    params.set('rating_min', filterState.ratingMin);
  }
  if (filterState.ratingMax < 10) {
    params.set('rating_max', filterState.ratingMax);
  }
  if (filterState.runtimeMin > 0) {
    params.set('runtime_min', filterState.runtimeMin);
  }
  if (filterState.runtimeMax < 300) {
    params.set('runtime_max', filterState.runtimeMax);
  }
  if (filterState.language) {
    params.set('language', filterState.language);
  }
  params.set('sort_by', filterState.sortBy);

  // Update URL
  window.history.pushState({}, '', `?${params.toString()}`);

  // Fetch filtered movies
  trendingGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9aa4b2; padding:40px;">Finding movies...</div>';
  const data = await apiGET(`tmdb_proxy.php?${params.toString()}`);

  // Hide loading state
  btn.classList.remove('loading');
  btn.disabled = false;

  trendingGrid.innerHTML = '';
  const section = trendingGrid.closest('section');
  section.querySelector('h2').textContent = 'Filtered Results';

  if (data.results && data.results.length > 0) {
    data.results.forEach(movie => {
      trendingGrid.appendChild(makeCard(movie));
    });
  } else {
    trendingGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#ff6b6b; padding:40px;">No movies found with these filters. Try adjusting your criteria.</div>';
  }

  // Update active filter chips
  renderActiveFilters();

  // Close panel on mobile
  if (window.innerWidth <= 768) {
    filterPanel.classList.remove('active');
    filterToggle.setAttribute('aria-expanded', 'false');
  }
}

function clearFilters() {
  // Reset state
  filterState.genres = [];
  filterState.yearMin = null;
  filterState.yearMax = null;
  filterState.ratingMin = 0;
  filterState.ratingMax = 10;
  filterState.runtimeMin = 0;
  filterState.runtimeMax = 300;
  filterState.language = '';
  filterState.sortBy = 'popularity.desc';

  // Reset UI
  document.querySelectorAll('.genre-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  yearMinInput.value = '';
  yearMaxInput.value = '2025';
  ratingMinSlider.value = 0;
  ratingMaxSlider.value = 10;
  ratingMinDisplay.textContent = 0;
  ratingMaxDisplay.textContent = 10;
  runtimeMinSlider.value = 0;
  runtimeMaxSlider.value = 300;
  runtimeMinDisplay.textContent = 0;
  runtimeMaxDisplay.textContent = 300;
  languageSelect.value = '';
  sortSelect.value = 'popularity.desc';

  // Clear URL
  window.history.pushState({}, '', window.location.pathname);

  // Reload trending
  loadTrending();
  document.getElementById('activeFilters').innerHTML = '';
}

function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  container.innerHTML = '';

  // Genre chips
  filterState.genres.forEach(genreId => {
    const genreChip = document.querySelector(`[data-id="${genreId}"]`);
    if (genreChip) {
      const chip = createFilterChip(genreChip.textContent, () => {
        toggleGenre(genreId, genreChip);
        applyFilters();
      });
      container.appendChild(chip);
    }
  });

  // Year range
  if (filterState.yearMin || filterState.yearMax) {
    const yearText = `Year: ${filterState.yearMin || '?'} - ${filterState.yearMax || '?'}`;
    const chip = createFilterChip(yearText, () => {
      filterState.yearMin = null;
      filterState.yearMax = null;
      yearMinInput.value = '';
      yearMaxInput.value = '';
      applyFilters();
    });
    container.appendChild(chip);
  }

  // Rating
  if (filterState.ratingMin > 0 || filterState.ratingMax < 10) {
    const chip = createFilterChip(`Rating: ${filterState.ratingMin}-${filterState.ratingMax}`, () => {
      filterState.ratingMin = 0;
      filterState.ratingMax = 10;
      ratingMinSlider.value = 0;
      ratingMaxSlider.value = 10;
      ratingMinDisplay.textContent = 0;
      ratingMaxDisplay.textContent = 10;
      applyFilters();
    });
    container.appendChild(chip);
  }

  // Runtime
  if (filterState.runtimeMin > 0 || filterState.runtimeMax < 300) {
    const chip = createFilterChip(`Runtime: ${filterState.runtimeMin}-${filterState.runtimeMax} min`, () => {
      filterState.runtimeMin = 0;
      filterState.runtimeMax = 300;
      runtimeMinSlider.value = 0;
      runtimeMaxSlider.value = 300;
      runtimeMinDisplay.textContent = 0;
      runtimeMaxDisplay.textContent = 300;
      applyFilters();
    });
    container.appendChild(chip);
  }
}

function createFilterChip(text, onRemove) {
  const chip = document.createElement('div');
  chip.className = 'filter-chip';
  chip.innerHTML = `
    ${text}
    <button class="filter-chip-remove">✕</button>
  `;
  chip.querySelector('.filter-chip-remove').onclick = onRemove;
  return chip;
}

function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  // Load genre
  const genreParam = params.get('genre');
  if (genreParam) {
    filterState.genres = genreParam.split(',').map(Number);
    filterState.genres.forEach(id => {
      const chip = document.querySelector(`[data-id="${id}"]`);
      if (chip) chip.classList.add('active');
    });
  }

  // Load year
  if (params.has('year_min')) {
    filterState.yearMin = params.get('year_min');
    yearMinInput.value = filterState.yearMin;
  }
  if (params.has('year_max')) {
    filterState.yearMax = params.get('year_max');
    yearMaxInput.value = filterState.yearMax;
  }

  // Load rating
  if (params.has('rating_min')) {
    filterState.ratingMin = parseFloat(params.get('rating_min'));
    ratingMinSlider.value = filterState.ratingMin;
    ratingMinDisplay.textContent = filterState.ratingMin;
  }
  if (params.has('rating_max')) {
    filterState.ratingMax = parseFloat(params.get('rating_max'));
    ratingMaxSlider.value = filterState.ratingMax;
    ratingMaxDisplay.textContent = filterState.ratingMax;
  }

  // Load runtime
  if (params.has('runtime_min')) {
    filterState.runtimeMin = parseInt(params.get('runtime_min'));
    runtimeMinSlider.value = filterState.runtimeMin;
    runtimeMinDisplay.textContent = filterState.runtimeMin;
  }
  if (params.has('runtime_max')) {
    filterState.runtimeMax = parseInt(params.get('runtime_max'));
    runtimeMaxSlider.value = filterState.runtimeMax;
    runtimeMaxDisplay.textContent = filterState.runtimeMax;
  }

  // Load language
  if (params.has('language')) {
    filterState.language = params.get('language');
    languageSelect.value = filterState.language;
  }

  // Load sort
  if (params.has('sort_by')) {
    filterState.sortBy = params.get('sort_by');
    sortSelect.value = filterState.sortBy;
  }

  // If filters present in URL, apply them
  if (params.has('mode') && params.get('mode') === 'discover') {
    applyFilters();
  }
}
