<?php
// Basic configuration for DB and uploads
// InfinityFree Database Credentials
define('DB_HOST', 'sql300.infinityfree.com');
define('DB_NAME', 'if0_40279726_kdu_exam');
define('DB_USER', 'if0_40279726');
define('DB_PASS', 'RsoqOYWcA1');

// Base path used by some pages (adjust if using Alias)
if (!defined('APP_BASE')) define('APP_BASE', '/');

// Upload directories (relative to project root)
define('UPLOADS_DIR', __DIR__ . '/../assets/uploads');
define('GUIDANCE_UPLOADS', UPLOADS_DIR . '/guidance');
define('DOWNLOADS_UPLOADS', UPLOADS_DIR . '/downloads');
define('GALLERY_UPLOADS', UPLOADS_DIR . '/images');

// Max upload size (20MB) - Increased for larger images
define('MAX_UPLOAD_BYTES', 20 * 1024 * 1024);

// Allowed MIME types for documents
$ALLOWED_DOC_MIME = [
  'application/pdf', 'image/png', 'image/jpeg',
];

// Ensure upload directories exist
@mkdir(UPLOADS_DIR, 0775, true);
@mkdir(GUIDANCE_UPLOADS, 0775, true);
@mkdir(DOWNLOADS_UPLOADS, 0775, true);
@mkdir(GALLERY_UPLOADS, 0775, true);

// Disable error display in production
ini_set('display_errors', 0);
error_reporting(0);