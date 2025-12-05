<?php
// api/favorites_data_api.php
// MongoDB Data API version for hosting providers without MongoDB PHP extension
// Use this for InfinityFree or similar hosts

require_once __DIR__ . '/env_loader.php';
loadEnv();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// MongoDB Data API configuration
$MONGO_DATA_API_URL = getenv('MONGO_DATA_API_URL'); // https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1
$MONGO_DATA_API_KEY = getenv('MONGO_DATA_API_KEY');
$MONGO_CLUSTER = getenv('MONGO_CLUSTER') ?: 'fuad'; // Default cluster name
$MONGO_DB = getenv('MONGO_DB');
$MONGO_COLLECTION = getenv('MONGO_FAVORITES_COLLECTION');

/**
 * Call MongoDB Data API
 * @param string $action - find, findOne, insertOne, deleteOne, etc.
 * @param array $data - Additional data for the API call
 * @return array Response from MongoDB Data API
 */
function callMongoDataAPI($action, $data = [])
{
    global $MONGO_DATA_API_URL, $MONGO_DATA_API_KEY, $MONGO_DB, $MONGO_COLLECTION, $MONGO_CLUSTER;

    $endpoint = $MONGO_DATA_API_URL . '/action/' . $action;

    $payload = [
        'dataSource' => $MONGO_CLUSTER,
        'database' => $MONGO_DB,
        'collection' => $MONGO_COLLECTION
    ];

    $payload = array_merge($payload, $data);

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'api-key: ' . $MONGO_DATA_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For some hosting providers

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['error' => 'CURL error: ' . $curlError];
    }

    if ($httpCode !== 200 && $httpCode !== 201) {
        return ['error' => 'MongoDB API error', 'code' => $httpCode, 'response' => $response];
    }

    return json_decode($response, true);
}

// Handle GET - Get all favorites
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = callMongoDataAPI('find', [
        'filter' => (object) [] // Empty filter to get all documents
    ]);

    if (isset($result['error'])) {
        http_response_code(500);
        echo json_encode($result);
        exit;
    }

    echo json_encode($result['documents'] ?? []);
    exit;
}

// Handle POST - Add favorite
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['movie_id']) || !isset($input['movie_data'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input', 'required' => ['movie_id', 'movie_data']]);
        exit;
    }

    // First check if movie already exists
    $existingResult = callMongoDataAPI('findOne', [
        'filter' => ['movie_id' => (int) $input['movie_id']]
    ]);

    if (isset($existingResult['document']) && $existingResult['document']) {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'Movie already in favorites', 'movie_id' => $input['movie_id']]);
        exit;
    }

    $document = [
        'movie_id' => (int) $input['movie_id'],
        'movie_data' => $input['movie_data'],
        'created_at' => date('c')
    ];

    $result = callMongoDataAPI('insertOne', [
        'document' => $document
    ]);

    if (isset($result['error'])) {
        http_response_code(500);
        echo json_encode($result);
        exit;
    }

    echo json_encode([
        'success' => true,
        'insertedId' => $result['insertedId'] ?? null,
        'message' => 'Movie added to favorites'
    ]);
    exit;
}

// Handle DELETE - Remove favorite
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $movieId = isset($_GET['movie_id']) ? (int) $_GET['movie_id'] : null;

    if (!$movieId) {
        http_response_code(400);
        echo json_encode(['error' => 'Movie ID required']);
        exit;
    }

    $result = callMongoDataAPI('deleteOne', [
        'filter' => ['movie_id' => $movieId]
    ]);

    if (isset($result['error'])) {
        http_response_code(500);
        echo json_encode($result);
        exit;
    }

    echo json_encode([
        'success' => true,
        'deletedCount' => $result['deletedCount'] ?? 0,
        'message' => 'Movie removed from favorites'
    ]);
    exit;
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
