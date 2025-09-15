<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/http.php';

$stmt = db()->query('SELECT slug, name FROM download_categories ORDER BY id ASC');
json_response(['items' => $stmt->fetchAll()]);
