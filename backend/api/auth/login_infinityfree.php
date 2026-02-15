<?php
/**
 * Admin Login API - InfinityFree Compatible Version
 * Improved error handling for production hosting
 */

// Start output buffering and set headers early
ob_start();
header('Content-Type: application/json; charset=utf-8');

// Disable error display (errors will be logged instead)
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    // Include required files
    require_once __DIR__ . '/../../db.php';
    require_once __DIR__ . '/../../lib/http.php';

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        ob_clean();
        json_response(['error' => 'Method not allowed'], 405);
    }

    // Get input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        ob_clean();
        json_response(['error' => 'Invalid JSON input'], 400);
    }

    $identifier = trim($input['identifier'] ?? $input['email'] ?? '');
    $password = $input['password'] ?? '';

    // Validate input
    if ($identifier === '' || $password === '') {
        ob_clean();
        json_response(['error' => 'Email/Username and password are required'], 422);
    }

    // Get database connection
    $pdo = db();
    
    // Determine whether identifier looks like an email; otherwise try username
    if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
        $stmt = $pdo->prepare('SELECT id, name, email, username, password_hash, role, is_active FROM admins WHERE email = ? LIMIT 1');
    } else {
        $stmt = $pdo->prepare('SELECT id, name, email, username, password_hash, role, is_active FROM admins WHERE username = ? LIMIT 1');
    }
    
    $stmt->execute([$identifier]);
    $admin = $stmt->fetch();

    // Check credentials
    if (!$admin || !$admin['is_active'] || !password_verify($password, $admin['password_hash'])) {
        ob_clean();
        json_response(['error' => 'Invalid credentials'], 401);
    }

    // Start session
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Store admin info in session
    $_SESSION['admin'] = [
        'id' => $admin['id'],
        'name' => $admin['name'],
        'email' => $admin['email'],
        'username' => $admin['username'],
        'role' => $admin['role']
    ];

    // Clear output buffer and send success response
    ob_clean();
    json_response([
        'success' => true,
        'admin' => [
            'id' => $admin['id'],
            'name' => $admin['name'],
            'email' => $admin['email'],
            'username' => $admin['username'],
            'role' => $admin['role']
        ]
    ], 200);
    
} catch (PDOException $e) {
    // Database error
    error_log("Login DB Error: " . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode(['error' => 'Database error occurred']);
    exit;
    
} catch (Exception $e) {
    // General error
    error_log("Login Error: " . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode(['error' => 'Server error occurred']);
    exit;
}
