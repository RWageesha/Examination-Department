<?php
require_once __DIR__ . '/../../lib/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  json_response(['error' => 'Method not allowed'], 405);
}

if (!isset($_SESSION['admin'])) {
  json_response(['error' => 'Unauthorized'], 401);
}

json_response(['ok' => true, 'admin' => $_SESSION['admin']]);
