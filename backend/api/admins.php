<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/http.php';

$method = $_SERVER['REQUEST_METHOD'];

$admin = require_auth();
if ($admin['role'] !== 'super') {
  json_response(['error' => 'Forbidden'], 403);
}

if ($method === 'GET') {
  $stmt = db()->query('SELECT id, name, email, username, role, is_active, created_at FROM admins ORDER BY id ASC');
  json_response(['items' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
  // Create new admin profile
  $input = json_decode(file_get_contents('php://input'), true);
  $name = trim($input['name'] ?? '');
  $email = trim($input['email'] ?? '');
  $username = trim($input['username'] ?? '');
  $password = $input['password'] ?? '';
  $role = ($input['role'] ?? 'admin') === 'super' ? 'super' : 'admin';
  if ($name === '' || $email === '' || $password === '') {
    json_response(['error' => 'Missing required fields'], 422);
  }
  $hash = password_hash($password, PASSWORD_DEFAULT);
  try {
    $stmt = db()->prepare('INSERT INTO admins (name, email, username, password_hash, role) VALUES (?,?,?,?,?)');
    $stmt->execute([$name, $email, ($username !== '' ? $username : null), $hash, $role]);
  } catch (PDOException $e) {
    if ($e->getCode() === '23000') { // unique violation
      $msg = 'Email already exists';
      if (strpos($e->getMessage(), 'username') !== false) {
        $msg = 'Username already exists';
      }
      json_response(['error' => $msg], 409);
    }
    throw $e;
  }
  json_response(['ok' => true, 'id' => db()->lastInsertId()], 201);
}

if ($method === 'DELETE') {
  // Soft deactivate admin (except self)
  parse_str(file_get_contents('php://input'), $payload);
  $id = (int)($payload['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'Invalid id'], 422);
  if ($id === (int)$admin['id']) json_response(['error' => 'Cannot deactivate yourself'], 422);
  $stmt = db()->prepare('UPDATE admins SET is_active=0 WHERE id=?');
  $stmt->execute([$id]);
  json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
