<?php
// api/favorites.php
require_once __DIR__ . '/utils.php';

$collection = get_mongo_collection();

// If MongoDB is not available, return empty list for GET or error for others
if ($collection === null) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode([]);
        exit;
    } else {
        http_response_code(503);
        echo json_encode(['error' => 'Database unavailable (MongoDB extension missing)']);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // GET all favorites, sorted by creation date (newest first)
    try {
        $cursor = $collection->find([], ['sort' => ['created_at' => -1]]);
        $result = iterator_to_array($cursor);

        // Convert BSON ObjectId to string for JSON encoding
        $output = array_map(function ($doc) {
            $doc['_id'] = (string) $doc['_id'];
            return $doc;
        }, $result);

        header('Content-Type: application/json');
        echo json_encode(array_values($output));
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch favorites: ' . $e->getMessage()]);
        exit;
    }
}

if ($method === 'POST') {
    // Add a movie to favorites
    // Expects JSON body with: { movie_id, movie_data }
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['movie_id']) || empty($body['movie_data'])) {
        http_response_code(400);
        echo json_encode(['error' => 'movie_id and movie_data required']);
        exit;
    }

    try {
        // Check if already exists
        $existing = $collection->findOne(['movie_id' => intval($body['movie_id'])]);
        if ($existing) {
            http_response_code(409);
            echo json_encode(['error' => 'Movie already in favorites']);
            exit;
        }

        // Insert new favorite
        $insert = [
            'movie_id' => intval($body['movie_id']),
            'movie_data' => $body['movie_data'],
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ];

        $res = $collection->insertOne($insert);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'insertedId' => (string) $res->getInsertedId()
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add favorite: ' . $e->getMessage()]);
        exit;
    }
}

if ($method === 'DELETE') {
    // Remove a movie from favorites
    // ?movie_id=123
    $movie_id = intval($_GET['movie_id'] ?? 0);

    if (!$movie_id) {
        http_response_code(400);
        echo json_encode(['error' => 'movie_id parameter required']);
        exit;
    }

    try {
        $res = $collection->deleteOne(['movie_id' => $movie_id]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'deletedCount' => $res->getDeletedCount()
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete favorite: ' . $e->getMessage()]);
        exit;
    }
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
