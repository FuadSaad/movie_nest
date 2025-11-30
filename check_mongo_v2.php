<?php
header('Content-Type: application/json');
echo json_encode([
    'mongodb_version' => phpversion('mongodb'),
    'openssl_version' => OPENSSL_VERSION_TEXT,
]);
