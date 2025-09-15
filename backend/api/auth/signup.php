<?php
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$username = trim($input['username'] ?? '');
$password = (string)($input['password'] ?? '');
$confirm = (string)($input['confirm'] ?? '');

if ($name === '' || $email === '' || $password === '' || $confirm === '') {
  json_response(['error' => 'All fields are required'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_response(['error' => 'Invalid email address'], 422);
}
if ($password !== $confirm) {
  json_response(['error' => 'Passwords do not match'], 422);
}
if (strlen($password) < 8) {
  json_response(['error' => 'Password must be at least 8 characters'], 422);
}

// Allow signup only if there are no admins yet
$count = (int)db()->query('SELECT COUNT(*) as c FROM admins')->fetchColumn();
if ($count > 0) {
  json_response(['error' => 'Signup disabled. Ask a Super Admin to create your account.'], 403);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
try {
  $stmt = db()->prepare('INSERT INTO admins (name, email, username, password_hash, role, is_active) VALUES (?,?,?,?,?,1)');
  $stmt->execute([$name, $email, ($username !== '' ? $username : null), $hash, 'super']);
  $id = (int)db()->lastInsertId();
} catch (PDOException $e) {
  if ($e->getCode() === '23000') {
    $msg = 'Email already exists';
    if (strpos($e->getMessage(), 'username') !== false) {
      $msg = 'Username already exists';
    }
    json_response(['error' => $msg], 409);
  }
  throw $e;
}

$_SESSION['admin'] = [ 'id' => $id, 'name' => $name, 'email' => $email, 'username' => ($username !== '' ? $username : null), 'role' => 'super' ];
json_response(['ok' => true, 'admin' => $_SESSION['admin']]);
