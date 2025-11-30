<?php
header('Content-Type: application/json');
echo json_encode([
    'curl.cainfo' => ini_get('curl.cainfo'),
    'openssl.cafile' => ini_get('openssl.cafile'),
    'openssl.capath' => ini_get('openssl.capath'),
    'default_cert_file' => openssl_get_cert_locations()['default_cert_file'],
]);
