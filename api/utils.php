<?php
// api/utils.php
require_once __DIR__ . '/config.php';

/**
 * Make a GET request to TMDB API
 * @param string $path API endpoint path
 * @param array $params Query parameters
 */
function tmdb_get($path, $params = [])
{
    $params['api_key'] = TMDB_API_KEY;
    $url = TMDB_BASE . $path . '?' . http_build_query($params);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    // Disable SSL verification for local development (fixes "unable to get local issuer certificate")
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $resp = curl_exec($ch);
    $err = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($resp === false) {
        http_response_code(500);
        echo json_encode(['error' => 'CURL Error: ' . $err]);
        exit;
    }

    if ($httpCode !== 200) {
        http_response_code($httpCode);
    }

    header('Content-Type: application/json');
    echo $resp;
    exit;
}

/**
 * Get MongoDB collection instance
 * @return MongoDB\Collection|null
 */
function get_mongo_collection()
{
    // Check if MongoDB extension is loaded
    if (!extension_loaded('mongodb')) {
        // Return null to indicate MongoDB is not available
        return null;
    }

    require_once __DIR__ . '/../vendor/autoload.php';

    try {
        // MongoDB connection with TLS/SSL options
        $client = new MongoDB\Client(MONGO_URI, [
            'tls' => true,
            'tlsAllowInvalidCertificates' => true, // For development only
            'tlsAllowInvalidHostnames' => true,    // For development only
            'serverSelectionTimeoutMS' => 5000,
            'connectTimeoutMS' => 10000,
            'retryWrites' => true,
            'retryReads' => true
        ]);

        // Test the connection
        $client->listDatabases();

        return $client->{MONGO_DB}->{MONGO_FAVORITES_COLLECTION};
    } catch (MongoDB\Driver\Exception\ConnectionTimeoutException $e) {
        error_log("MongoDB Connection Timeout: " . $e->getMessage());
        return null;
    } catch (MongoDB\Driver\Exception\ServerException $e) {
        error_log("MongoDB Server Error: " . $e->getMessage());
        return null;
    } catch (Exception $e) {
        error_log("MongoDB Error: " . $e->getMessage());
        // Return null on connection failure instead of crashing
        return null;
    }
}
