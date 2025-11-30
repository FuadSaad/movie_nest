<?php
// api/tmdb_proxy.php
require_once __DIR__ . '/utils.php';

$mode = $_GET['mode'] ?? 'trending';

switch ($mode) {
    case 'trending':
        // Get trending movies
        // ?mode=trending&type=movie&time_window=week
        $type = $_GET['type'] ?? 'movie';
        $time_window = $_GET['time_window'] ?? 'week';
        tmdb_get("/trending/{$type}/{$time_window}", []);
        break;

    case 'movie':
        // Get movie details
        // ?mode=movie&id=123
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'missing movie id']);
            exit;
        }
        tmdb_get("/movie/{$id}", ['append_to_response' => 'credits,images']);
        break;

    case 'reviews':
        // Get movie reviews
        // ?mode=reviews&id=123
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'missing movie id']);
            exit;
        }
        tmdb_get("/movie/{$id}/reviews", ['page' => $_GET['page'] ?? 1]);
        break;

    case 'recommendations':
        // Get TMDB recommendations for a movie
        // ?mode=recommendations&id=123
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'missing movie id']);
            exit;
        }
        tmdb_get("/movie/{$id}/recommendations", ['page' => $_GET['page'] ?? 1]);
        break;

    case 'discover':
        // Advanced movie discovery with filters
        // ?mode=discover&genre=28,12&year_min=2020&year_max=2023&rating_min=7&sort_by=popularity.desc
        $params = [];

        // Genre filter (comma-separated IDs)
        if (!empty($_GET['genre'])) {
            $params['with_genres'] = $_GET['genre'];
        }

        // Year range
        if (!empty($_GET['year_min'])) {
            $params['primary_release_date.gte'] = $_GET['year_min'] . '-01-01';
        }
        if (!empty($_GET['year_max'])) {
            $params['primary_release_date.lte'] = $_GET['year_max'] . '-12-31';
        }

        // Rating range (0-10)
        if (isset($_GET['rating_min'])) {
            $params['vote_average.gte'] = floatval($_GET['rating_min']);
        }
        if (isset($_GET['rating_max'])) {
            $params['vote_average.lte'] = floatval($_GET['rating_max']);
        }

        // Minimum vote count to ensure quality ratings
        $params['vote_count.gte'] = intval($_GET['min_votes'] ?? 100);

        // Runtime range (minutes)
        if (!empty($_GET['runtime_min'])) {
            $params['with_runtime.gte'] = intval($_GET['runtime_min']);
        }
        if (!empty($_GET['runtime_max'])) {
            $params['with_runtime.lte'] = intval($_GET['runtime_max']);
        }

        // Language
        if (!empty($_GET['language'])) {
            $params['with_original_language'] = $_GET['language'];
        }

        // Sort by
        $params['sort_by'] = $_GET['sort_by'] ?? 'popularity.desc';

        // Pagination
        $params['page'] = intval($_GET['page'] ?? 1);

        // Region for release dates
        if (!empty($_GET['region'])) {
            $params['region'] = $_GET['region'];
        }

        tmdb_get('/discover/movie', $params);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'invalid mode']);
        break;
}
