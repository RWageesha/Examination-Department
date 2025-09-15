<?php
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$identifier = trim($input['identifier'] ?? $input['email'] ?? '');
$password = $input['password'] ?? '';

if ($identifier === '' || $password === '') {
  json_response(['error' => 'Email/Username and password are required'], 422);
}

// Determine whether identifier looks like an email; otherwise try username
if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
  $stmt = db()->prepare('SELECT id, name, email, username, password_hash, role, is_active FROM admins WHERE email = ? LIMIT 1');
  $stmt->execute([$identifier]);
} else {
  $stmt = db()->prepare('SELECT id, name, email, username, password_hash, role, is_active FROM admins WHERE username = ? LIMIT 1');
  $stmt->execute([$identifier]);
}
$admin = $stmt->fetch();

if (!$admin || !$admin['is_active'] || !password_verify($password, $admin['password_hash'])) {
  json_response(['error' => 'Invalid credentials'], 401);
}

$_SESSION['admin'] = [
  'id' => (int)$admin['id'],
  'name' => $admin['name'],
  'email' => $admin['email'],
  'username' => $admin['username'] ?? null,
  'role' => $admin['role'],
];

json_response(['ok' => true, 'admin' => $_SESSION['admin']]);
