<?php
header('Content-Type: text/plain');
$pwd = $_GET['pwd'] ?? '';
if ($pwd === '') {
  echo "Usage: ?pwd=YourPassword\n";
  exit;
}
echo password_hash($pwd, PASSWORD_DEFAULT) . "\n";
