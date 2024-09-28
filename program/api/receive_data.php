<?php

// Set response header to JSON
header('Content-Type: application/json');

// Get the input JSON data
$json = file_get_contents('php://input');

// Try to parse the JSON data
$data = json_decode($json, true);

// Check if the data is valid
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => json_last_error()]);
    exit;
}

// Check required fields
$required_fields = ['linkurl', 'eventType', 'data', 'ip', 'timestamp'];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing field: $field"]);
        exit;
    }
}

// Write the received JSON data to the log file
$log_file = '/var/www/roundcubemail/logs/js_event.log';
$log_entry = date('Y-m-d H:i:s') . " - " . $json . PHP_EOL;
file_put_contents($log_file, $log_entry, FILE_APPEND);

// Return success response
echo json_encode(['status' => 'success', 'message' => 'Data received successfully']);