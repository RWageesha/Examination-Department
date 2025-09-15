<?php
// Basic configuration for DB and uploads
define('DB_HOST', 'localhost');
define('DB_NAME', 'kdu_exam');
define('DB_USER', 'root');
define('DB_PASS', ''); // set your MySQL root password if any

// Base path used by some pages (adjust if using Alias)
if (!defined('APP_BASE')) define('APP_BASE', '/Examination-Department/');

// Upload directories (relative to project root)
define('UPLOADS_DIR', __DIR__ . '/../assets/uploads');
define('GUIDANCE_UPLOADS', UPLOADS_DIR . '/guidance');
define('DOWNLOADS_UPLOADS', UPLOADS_DIR . '/downloads');

// Max upload size (2MB)
define('MAX_UPLOAD_BYTES', 2 * 1024 * 1024);

// Allowed MIME types for documents
$ALLOWED_DOC_MIME = [
  'application/pdf', 'image/png', 'image/jpeg',
];

// Ensure upload directories exist
@mkdir(UPLOADS_DIR, 0775, true);
@mkdir(GUIDANCE_UPLOADS, 0775, true);
@mkdir(DOWNLOADS_UPLOADS, 0775, true);
