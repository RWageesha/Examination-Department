<?php
/**
 * Configuration for InfinityFree Hosting
 * 
 * INSTRUCTIONS:
 * 1. Rename this file to config.php after updating the values below
 * 2. Get your database credentials from InfinityFree control panel (MySQL Databases section)
 * 3. Update DB_HOST, DB_NAME, DB_USER, and DB_PASS with your actual values
 * 
 * InfinityFree database details format:
 * - Host: usually sql###.infinityfree.com (or sql###.epizy.com)
 * - Database name: epiz_########_dbname
 * - Username: epiz_########
 * - Password: your database password
 */

// Database Configuration for InfinityFree
define('DB_HOST', 'sql300.infinityfree.com');  // CHANGE THIS - e.g., sql200.infinityfree.com
define('DB_NAME', 'if0_40279726_XXX');   // CHANGE THIS - your database name from control panel
define('DB_USER', 'if0_40279726');             // CHANGE THIS - your database username
define('DB_PASS', 'RsoqOYWcA1');    // CHANGE THIS - your database password

// Base path - InfinityFree uses public_html as root, so usually just '/'
if (!defined('APP_BASE')) define('APP_BASE', '/');

// Upload directories (relative to project root)
define('UPLOADS_DIR', __DIR__ . '/../assets/uploads');
define('GUIDANCE_UPLOADS', UPLOADS_DIR . '/guidance');
define('DOWNLOADS_UPLOADS', UPLOADS_DIR . '/downloads');
define('GALLERY_UPLOADS', UPLOADS_DIR . '/images');

// Max upload size - InfinityFree has a 10MB limit
define('MAX_UPLOAD_BYTES', 10 * 1024 * 1024);

// Allowed MIME types for documents
$ALLOWED_DOC_MIME = [
  'application/pdf', 'image/png', 'image/jpeg',
];

// Ensure upload directories exist
@mkdir(UPLOADS_DIR, 0755, true);
@mkdir(GUIDANCE_UPLOADS, 0755, true);
@mkdir(DOWNLOADS_UPLOADS, 0755, true);
@mkdir(GALLERY_UPLOADS, 0755, true);

// Enable error reporting during setup (DISABLE in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
