<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/http.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $stmt = db()->query('SELECT id, title, description, noticed_date, link_url, created_at FROM notices ORDER BY noticed_date DESC, id DESC');
  json_response(['items' => $stmt->fetchAll()]);
}

$admin = require_auth();

if ($method === 'POST') {
  $title = trim($_POST['title'] ?? '');
  $description = trim($_POST['description'] ?? '');
  $noticed_date = trim($_POST['noticed_date'] ?? '');
  $link_url = trim($_POST['link_url'] ?? '') ?: null;
  if ($title === '' || $description === '' || $noticed_date === '') {
    json_response(['error' => 'Missing required fields'], 422);
  }
  $stmt = db()->prepare('INSERT INTO notices (title, description, noticed_date, link_url, created_by) VALUES (?,?,?,?,?)');
  $stmt->execute([$title, $description, $noticed_date, $link_url, $admin['id']]);
  json_response(['ok' => true, 'id' => db()->lastInsertId()], 201);
}

// PUT/DELETE payload handling
parse_str(file_get_contents('php://input'), $payload);

if ($method === 'PUT') {
  $id = (int)($payload['id'] ?? 0);
  $title = trim($payload['title'] ?? '');
  $description = trim($payload['description'] ?? '');
  $noticed_date = trim($payload['noticed_date'] ?? '');
  $link_url = trim($payload['link_url'] ?? '') ?: null;
  if ($id <= 0 || $title === '' || $description === '' || $noticed_date === '') {
    json_response(['error' => 'Invalid input'], 422);
  }
  $stmt = db()->prepare('UPDATE notices SET title=?, description=?, noticed_date=?, link_url=? WHERE id=?');
  $stmt->execute([$title, $description, $noticed_date, $link_url, $id]);
  json_response(['ok' => true]);
}

if ($method === 'DELETE') {
  $id = (int)($payload['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'Invalid id'], 422);
  $stmt = db()->prepare('DELETE FROM notices WHERE id=?');
  $stmt->execute([$id]);
  json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
