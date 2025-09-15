<?php
session_start();

function json_response($data = [], int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json');
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  echo json_encode($data);
  exit;
}

function require_auth(): array {
  if (!isset($_SESSION['admin'])) {
    json_response(['error' => 'Unauthorized'], 401);
  }
  return $_SESSION['admin'];
}
