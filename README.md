# Movie Recommender 🎬

A complete movie recommendation system with trending movies, detailed movie information, reviews, favorites management, and personalized recommendations powered by TMDB API and MongoDB.

## Features

- 📈 **Trending Movies** - Weekly trending movies from TMDB
- ⭐ **Movie Details** - Comprehensive information including cast, genres, runtime, and ratings
- 💬 **Reviews** - Read user reviews for any movie
- ❤️ **Favorites** - Save and manage your favorite movies (stored in MongoDB)
- 🎯 **Smart Recommendations** - Get personalized recommendations based on your favorites
- 🔍 **Search** - Find any movie by title

## Tech Stack

- **Frontend**: HTML, CSS (Dark Theme), Vanilla JavaScript
- **Backend**: PHP 8+
- **Database**: MongoDB (Atlas)
- **API**: TMDB (The Movie Database)

## Prerequisites

Before you begin, ensure you have:

1. **PHP 8 or higher** with the following:
   - `curl` extension enabled
   - `mongodb` extension installed (via PECL)
   
2. **Composer** - PHP dependency manager
   
3. **MongoDB** - Either:
   - MongoDB Atlas account (recommended, free tier available)
   - Local MongoDB installation
   
4. **TMDB API Key** - Free at https://developers.themoviedb.org/

## Installation

### 1. Install PHP MongoDB Extension

```bash
# Windows (via PECL)
pecl install mongodb

# Add to php.ini
extension=mongodb
```

Verify installation:
```bash
php -m | grep mongodb
```

### 2. Clone or Download Project

Place the project in your web server directory (e.g., `htdocs`, `www`, or custom location).

### 3. Install Composer Dependencies

```bash
cd e:\Project\Web\movie_recommendation
composer install
```

### 4. Configure API Settings

Edit `api/config.php` and update:

```php
// Add your TMDB API key
define('TMDB_API_KEY', 'your_actual_tmdb_api_key_here');

// Update MongoDB password in connection string
define('MONGO_URI', 'mongodb+srv://fuad:YOUR_PASSWORD@fuad.hnrcxlu.mongodb.net/?appName=fuad');
```

## Running the Application

### Option 1: PHP Built-in Server (Development)

From the project root directory:

```bash
php -S localhost:8000 -t public
```

Then open: `http://localhost:8000`

**Note**: With this method, API requests won't work directly. You'll need to either:
- Use full paths in `app.js` (e.g., `http://localhost:8000/api/...`)
- Or use Option 2 below

### Option 2: Apache/Nginx (Recommended)

Configure your web server to serve the `public/` folder as the document root, with the parent directory accessible for API calls.

**Apache Virtual Host Example**:
```apache
<VirtualHost *:80>
    ServerName movie-reco.local
    DocumentRoot "e:/Project/Web/movie_recommendation/public"
    
    <Directory "e:/Project/Web/movie_recommendation/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    Alias /api "e:/Project/Web/movie_recommendation/api"
    <Directory "e:/Project/Web/movie_recommendation/api">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Add to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1   movie-reco.local
```

Then access: `http://movie-reco.local`

## Testing

### Test API Endpoints

1. **Test TMDB Connection**:
   ```
   http://localhost/api/tmdb_proxy.php?mode=trending&type=movie&time_window=week
   ```
   Should return JSON with trending movies.

2. **Test MongoDB Connection**:
   ```
   http://localhost/api/favorites.php
   ```
   Should return empty array `[]` or existing favorites.

3. **Test Search**:
   ```
   http://localhost/api/tmdb_search.php?q=inception
   ```
   Should return search results.

## Project Structure

```
movie_recommendation/
├── public/              # Web root
│   ├── index.html      # Main SPA
│   ├── app.js          # Frontend logic
│   └── styles.css      # Styling
├── api/                # Backend endpoints
│   ├── config.php      # Configuration
│   ├── utils.php       # Helper functions
│   ├── tmdb_proxy.php  # TMDB API proxy
│   ├── tmdb_search.php # Search endpoint
│   └── favorites.php   # Favorites CRUD
├── vendor/             # Composer dependencies
├── composer.json       # PHP dependencies
└── README.md          # This file
```

## MongoDB Schema

Favorites are stored with this structure:

```javascript
{
  "_id": ObjectId("..."),
  "movie_id": 550,
  "movie_data": {
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/path.jpg",
    "vote_average": 8.4,
    "release_date": "1999-10-15"
  },
  "created_at": ISODate("2025-11-28T...")
}
```

## Troubleshooting

### "Failed to load trending movies"
- Check your TMDB API key in `api/config.php`
- Verify internet connection
- Check PHP error logs

### "MongoDB connection failed"
- Verify MongoDB extension is installed: `php -m | grep mongodb`
- Check connection string and password in `api/config.php`
- Ensure MongoDB Atlas IP whitelist includes your IP (or use `0.0.0.0/0` for testing)

### 404 errors on API calls
- Check web server configuration
- Verify `api/` folder is accessible
- Update `API_BASE` in `public/app.js` if needed

### CORS errors
- CORS headers are already set in `api/config.php`
- For production, update the `Access-Control-Allow-Origin` to your domain

## Future Enhancements

- User authentication (multi-user support)
- Movie ratings and personalized scoring
- Content-based filtering with genre similarity
- Watchlist functionality
- Movie trailers integration
- Advanced search filters (genre, year, rating)
- Caching for frequently accessed data

## License

This is a demonstration project. TMDB content is provided by The Movie Database (TMDB) and is subject to their terms of service.

## Credits

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Built as a full-stack demonstration project
