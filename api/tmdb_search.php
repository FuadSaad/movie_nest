<?php
// api/tmdb_search.php
require_once __DIR__ . '/utils.php';

$q = $_GET['q'] ?? '';

if (!$q) {
    echo json_encode(['results' => []]);
    exit;
}

tmdb_get('/search/movie', [
    'query' => $q,
    'page' => 1,
    'include_adult' => false
]);
