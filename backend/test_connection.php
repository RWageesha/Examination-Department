<?php
/**
 * Database Connection Test Tool
 * Upload this file to your InfinityFree hosting to diagnose connection issues
 * Access it via: https://yoursite.com/backend/test_connection.php
 * 
 * DELETE THIS FILE after fixing the issue for security!
 */

// Enable error display temporarily
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Database Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; margin: 10px 0; border-radius: 5px; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h1 { color: #333; }
        h2 { color: #666; margin-top: 30px; }
    </style>
</head>
<body>
    <h1>🔍 KDU Exam Department - Database Connection Test</h1>
    
    <?php
    echo '<div class="info"><strong>Server Info:</strong><br>';
    echo 'PHP Version: ' . phpversion() . '<br>';
    echo 'Server Software: ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . '<br>';
    echo 'Document Root: ' . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . '<br>';
    echo 'Script Path: ' . __FILE__;
    echo '</div>';
    
    // Check if config file exists
    $configFile = __DIR__ . '/config.php';
    if (!file_exists($configFile)) {
        echo '<div class="error"><strong>❌ Config Error:</strong><br>';
        echo 'config.php not found at: ' . $configFile . '<br><br>';
        echo '<strong>Action Required:</strong><br>';
        echo '1. Rename <code>config.infinityfree.php</code> to <code>config.php</code><br>';
        echo '2. Update database credentials inside config.php';
        echo '</div>';
        exit;
    }
    
    echo '<div class="success">✓ config.php found</div>';
    
    // Load config
    try {
        require_once $configFile;
        echo '<div class="success">✓ config.php loaded successfully</div>';
        
        echo '<div class="info"><strong>Current Configuration:</strong><br>';
        echo 'DB_HOST: ' . DB_HOST . '<br>';
        echo 'DB_NAME: ' . DB_NAME . '<br>';
        echo 'DB_USER: ' . DB_USER . '<br>';
        echo 'DB_PASS: ' . (DB_PASS ? str_repeat('*', strlen(DB_PASS)) : '(empty)');
        echo '</div>';
        
        // Check if using default localhost values
        if (DB_HOST === 'localhost' && DB_USER === 'root') {
            echo '<div class="warning"><strong>⚠️ Warning:</strong><br>';
            echo 'You are still using localhost configuration!<br><br>';
            echo '<strong>For InfinityFree hosting, update config.php with:</strong><br>';
            echo '• DB_HOST: Your MySQL host (e.g., sql###.infinityfree.com)<br>';
            echo '• DB_NAME: Your database name (e.g., epiz_########_kdu_exam)<br>';
            echo '• DB_USER: Your database username (e.g., epiz_########)<br>';
            echo '• DB_PASS: Your database password';
            echo '</div>';
        }
        
    } catch (Exception $e) {
        echo '<div class="error"><strong>❌ Config Load Error:</strong><br>' . $e->getMessage() . '</div>';
        exit;
    }
    
    // Test database connection
    echo '<h2>Testing Database Connection...</h2>';
    
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        echo '<div class="success"><strong>✓ Database Connected Successfully!</strong></div>';
        
        // Test database tables
        echo '<h2>Checking Database Tables...</h2>';
        
        $tables = ['admins', 'notices', 'guidance', 'downloads_files', 'download_categories', 'images', 'settings', 'activity_log'];
        $foundTables = [];
        $missingTables = [];
        
        foreach ($tables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                $foundTables[] = $table;
            } else {
                $missingTables[] = $table;
            }
        }
        
        if (!empty($foundTables)) {
            echo '<div class="success"><strong>✓ Found Tables (' . count($foundTables) . '):</strong><br>';
            echo implode(', ', $foundTables);
            echo '</div>';
        }
        
        if (!empty($missingTables)) {
            echo '<div class="error"><strong>❌ Missing Tables (' . count($missingTables) . '):</strong><br>';
            echo implode(', ', $missingTables);
            echo '<br><br><strong>Action Required:</strong><br>';
            echo 'Import the database schema files from the /database folder into your MySQL database via phpMyAdmin.';
            echo '</div>';
        }
        
        // Test admin login
        if (in_array('admins', $foundTables)) {
            echo '<h2>Checking Admin Users...</h2>';
            $stmt = $pdo->query("SELECT id, username, email, role FROM admins LIMIT 5");
            $admins = $stmt->fetchAll();
            
            if ($admins) {
                echo '<div class="success"><strong>✓ Found ' . count($admins) . ' admin user(s):</strong><br>';
                echo '<pre>';
                foreach ($admins as $admin) {
                    echo 'ID: ' . $admin['id'] . ' | Username: ' . $admin['username'] . ' | Email: ' . $admin['email'] . ' | Role: ' . ($admin['role'] ?? 'N/A') . "\n";
                }
                echo '</pre></div>';
            } else {
                echo '<div class="warning"><strong>⚠️ No admin users found!</strong><br>';
                echo 'You need to create an admin user. Use the signup page or insert directly into database.';
                echo '</div>';
            }
        }
        
        // Check file permissions
        echo '<h2>Checking File Permissions...</h2>';
        $uploadDir = __DIR__ . '/../assets/uploads';
        
        if (is_dir($uploadDir)) {
            if (is_writable($uploadDir)) {
                echo '<div class="success">✓ Upload directory is writable: ' . $uploadDir . '</div>';
            } else {
                echo '<div class="error">❌ Upload directory is NOT writable: ' . $uploadDir . '<br>';
                echo 'Set permissions to 755 or 775 via FTP/File Manager</div>';
            }
        } else {
            echo '<div class="warning">⚠️ Upload directory does not exist: ' . $uploadDir . '<br>';
            echo 'It will be created automatically when needed.</div>';
        }
        
        echo '<h2>Summary</h2>';
        echo '<div class="success"><strong>✓ All Tests Passed!</strong><br>';
        echo 'Your database connection is working correctly.<br><br>';
        echo '<strong>⚠️ IMPORTANT:</strong> Delete this test file (test_connection.php) for security!';
        echo '</div>';
        
    } catch (PDOException $e) {
        echo '<div class="error"><strong>❌ Database Connection Failed!</strong><br><br>';
        echo '<strong>Error:</strong> ' . htmlspecialchars($e->getMessage()) . '<br><br>';
        
        echo '<strong>Common Issues & Solutions:</strong><br>';
        echo '1. <strong>Wrong credentials:</strong> Double-check DB_HOST, DB_NAME, DB_USER, DB_PASS in config.php<br>';
        echo '2. <strong>Database not created:</strong> Create database in InfinityFree control panel first<br>';
        echo '3. <strong>Host address:</strong> InfinityFree uses sql###.infinityfree.com or sql###.epizy.com<br>';
        echo '4. <strong>Remote access:</strong> InfinityFree blocks remote MySQL connections (must use their host)<br>';
        echo '5. <strong>User permissions:</strong> Ensure database user has full permissions on the database';
        echo '</div>';
        
        echo '<div class="info"><strong>How to Fix:</strong><br>';
        echo '1. Log into InfinityFree control panel<br>';
        echo '2. Go to "MySQL Databases"<br>';
        echo '3. Copy the exact values for: hostname, database name, username<br>';
        echo '4. Update backend/config.php with these exact values<br>';
        echo '5. Refresh this page to test again';
        echo '</div>';
    }
    ?>
    
    <hr style="margin: 40px 0;">
    <p style="color: #666; font-size: 14px;">
        <strong>Next Steps:</strong><br>
        1. If all tests pass, delete this file for security<br>
        2. Import database/schema.sql into your database via phpMyAdmin<br>
        3. Try logging into the admin panel
    </p>
</body>
</html>
