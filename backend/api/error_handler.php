<?php
/**
 * API Error Handler
 * Include this at the top of API files to handle errors gracefully
 */

// Prevent any output before JSON response
ob_start();

// Set JSON header early
header('Content-Type: application/json; charset=utf-8');

// Error handler that outputs JSON
function apiErrorHandler($errno, $errstr, $errfile, $errline) {
    // Don't output errors during production
    error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");
    
    // For development, you can uncomment this to see errors
    // ob_clean();
    // http_response_code(500);
    // echo json_encode(['error' => "Server error: $errstr"]);
    // exit;
}

// Exception handler that outputs JSON
function apiExceptionHandler($exception) {
    ob_clean();
    http_response_code(500);
    
    $error = [
        'error' => 'Internal server error',
        'message' => $exception->getMessage()
    ];
    
    // In development, add more details (remove in production)
    // $error['file'] = $exception->getFile();
    // $error['line'] = $exception->getLine();
    
    echo json_encode($error);
    exit;
}

// Shutdown handler to catch fatal errors
function apiShutdownHandler() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'error' => 'Fatal error occurred',
            'message' => $error['message']
        ]);
    }
}

// Set handlers
set_error_handler('apiErrorHandler');
set_exception_handler('apiExceptionHandler');
register_shutdown_function('apiShutdownHandler');

// Disable HTML error output
ini_set('display_errors', 0);
ini_set('html_errors', 0);
error_reporting(E_ALL);

// Function to send JSON response
function sendJson($data, $statusCode = 200) {
    ob_clean();
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Function to send error response
function sendError($message, $statusCode = 400) {
    sendJson(['error' => $message], $statusCode);
}
