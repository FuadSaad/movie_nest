<?php
// api/config.php

// Load environment variables from .env file
require_once __DIR__ . '/env_loader.php';
loadEnv();

// TMDB API configuration
define('TMDB_API_KEY', getenv('TMDB_API_KEY'));
define('TMDB_BASE', 'https://api.themoviedb.org/3');

// MongoDB configuration
define('MONGO_URI', getenv('MONGO_URI'));
define('MONGO_DB', getenv('MONGO_DB'));
define('MONGO_FAVORITES_COLLECTION', getenv('MONGO_FAVORITES_COLLECTION'));

// CORS headers for development (adjust in production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}
