<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/http.php';
require_once __DIR__ . '/../config.php';

global $ALLOWED_DOC_MIME;
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $cat = trim($_GET['category'] ?? '');
  if ($cat !== '') {
    $stmt = db()->prepare('SELECT d.id, d.title, d.description, d.file_path, d.link_url, c.slug as category FROM downloads_files d JOIN download_categories c ON c.id=d.category_id WHERE c.slug=? ORDER BY d.id DESC');
    $stmt->execute([$cat]);
  } else {
    $stmt = db()->query('SELECT d.id, d.title, d.description, d.file_path, d.link_url, c.slug as category FROM downloads_files d JOIN download_categories c ON c.id=d.category_id ORDER BY d.id DESC');
  }
  json_response(['items' => $stmt->fetchAll()]);
}

$admin = require_auth();

if ($method === 'POST') {
  $title = trim($_POST['title'] ?? '');
  $description = trim($_POST['description'] ?? '');
  $category_slug = trim($_POST['category'] ?? '');
  $link_url = trim($_POST['link_url'] ?? '') ?: null;
  if ($title === '' || $description === '' || $category_slug === '') json_response(['error' => 'Missing required fields'], 422);
  $cat = db()->prepare('SELECT id FROM download_categories WHERE slug=?');
  $cat->execute([$category_slug]);
  $catRow = $cat->fetch();
  if (!$catRow) json_response(['error' => 'Invalid category'], 422);
  $file_path = null;
  if (!empty($_FILES['file']['name'])) {
    if ($_FILES['file']['size'] > MAX_UPLOAD_BYTES) json_response(['error' => 'File too large'], 413);
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
    finfo_close($finfo);
    if (!in_array($mime, $ALLOWED_DOC_MIME, true)) json_response(['error' => 'Invalid file type'], 415);
    $basename = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $_FILES['file']['name']);
    $dest = DOWNLOADS_UPLOADS . '/' . $basename;
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $dest)) json_response(['error' => 'Upload failed'], 500);
    $file_path = 'assets/uploads/downloads/' . $basename;
  }
  if (!$file_path && !$link_url) json_response(['error' => 'Provide a file or a link'], 422);
  $stmt = db()->prepare('INSERT INTO downloads_files (category_id, title, description, file_path, link_url, created_by) VALUES (?,?,?,?,?,?)');
  $stmt->execute([$catRow['id'], $title, $description, $file_path, $link_url, $admin['id']]);
  json_response(['ok' => true, 'id' => db()->lastInsertId()], 201);
}

parse_str(file_get_contents('php://input'), $payload);

if ($method === 'DELETE') {
  $id = (int)($payload['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'Invalid id'], 422);
  $stmt = db()->prepare('SELECT file_path FROM downloads_files WHERE id=?');
  $stmt->execute([$id]);
  $row = $stmt->fetch();
  if ($row && $row['file_path']) {
    $file = __DIR__ . '/../..' . '/' . $row['file_path'];
    if (is_file($file)) @unlink($file);
  }
  $del = db()->prepare('DELETE FROM downloads_files WHERE id=?');
  $del->execute([$id]);
  json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
