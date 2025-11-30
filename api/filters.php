<?php
// api/filters.php
// Endpoint to fetch filter metadata from TMDB
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$type = $_GET['type'] ?? '';

switch ($type) {
    case 'genres':
        // Get all movie genres
        tmdb_get('/genre/movie/list', []);
        break;

    case 'languages':
        // Get all languages
        tmdb_get('/configuration/languages', []);
        break;

    case 'certifications':
        // Get content certifications (US ratings)
        tmdb_get('/certification/movie/list', []);
        break;

    case 'countries':
        // Get all countries
        tmdb_get('/configuration/countries', []);
        break;

    default:
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid type. Use: genres, languages, certifications, countries']);
        break;
}
