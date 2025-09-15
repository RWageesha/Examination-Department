<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/http.php';
require_once __DIR__ . '/../config.php';

global $ALLOWED_DOC_MIME;

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $stmt = db()->query('SELECT id, title, description, link_url, attachment_path, created_at FROM guidance ORDER BY id DESC');
  json_response(['items' => $stmt->fetchAll()]);
}

$admin = require_auth();

if ($method === 'POST') {
  $title = trim($_POST['title'] ?? '');
  $description = trim($_POST['description'] ?? '');
  $link_url = trim($_POST['link_url'] ?? '') ?: null;
  if ($title === '' || $description === '') {
    json_response(['error' => 'Missing required fields'], 422);
  }
  $attachment_path = null;
  if (!empty($_FILES['attachment']['name'])) {
    if ($_FILES['attachment']['size'] > MAX_UPLOAD_BYTES) json_response(['error' => 'File too large'], 413);
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES['attachment']['tmp_name']);
    finfo_close($finfo);
    if (!in_array($mime, $ALLOWED_DOC_MIME, true)) json_response(['error' => 'Invalid file type'], 415);
    $basename = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $_FILES['attachment']['name']);
    $dest = GUIDANCE_UPLOADS . '/' . $basename;
    if (!move_uploaded_file($_FILES['attachment']['tmp_name'], $dest)) json_response(['error' => 'Upload failed'], 500);
    $attachment_path = 'assets/uploads/guidance/' . $basename;
  }
  $stmt = db()->prepare('INSERT INTO guidance (title, description, link_url, attachment_path, created_by) VALUES (?,?,?,?,?)');
  $stmt->execute([$title, $description, $link_url, $attachment_path, $admin['id']]);
  json_response(['ok' => true, 'id' => db()->lastInsertId()], 201);
}

parse_str(file_get_contents('php://input'), $payload);

if ($method === 'PUT') {
  $id = (int)($payload['id'] ?? 0);
  $title = trim($payload['title'] ?? '');
  $description = trim($payload['description'] ?? '');
  $link_url = trim($payload['link_url'] ?? '') ?: null;
  if ($id <= 0 || $title === '' || $description === '') json_response(['error' => 'Invalid input'], 422);
  $stmt = db()->prepare('UPDATE guidance SET title=?, description=?, link_url=? WHERE id=?');
  $stmt->execute([$title, $description, $link_url, $id]);
  json_response(['ok' => true]);
}

if ($method === 'DELETE') {
  $id = (int)($payload['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'Invalid id'], 422);
  // Delete file if exists
  $stmt = db()->prepare('SELECT attachment_path FROM guidance WHERE id=?');
  $stmt->execute([$id]);
  $row = $stmt->fetch();
  if ($row && $row['attachment_path']) {
    $file = __DIR__ . '/../..' . '/' . $row['attachment_path'];
    if (is_file($file)) @unlink($file);
  }
  $stmt = db()->prepare('DELETE FROM guidance WHERE id=?');
  $stmt->execute([$id]);
  json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
