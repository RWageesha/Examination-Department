<?php
/**
 * Test script for Activity API
 */

// Start session first
session_start();

// Set up a test admin session (simulating logged-in admin)
if (!isset($_SESSION['admin'])) {
    $_SESSION['admin'] = [
        'id' => 1,
        'username' => 'admin1',
        'name' => 'Test Admin',
        'email' => 'admin@test.com'
    ];
    echo "✓ Session created\n";
} else {
    echo "✓ Session already exists\n";
}

echo "Session data:\n";
print_r($_SESSION);
echo "\n";

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    echo "✓ Database connected\n";
    
    // Test query
    $stmt = $pdo->prepare("
        SELECT 
            al.*, 
            a.username as admin_name
        FROM activity_log al
        LEFT JOIN admins a ON al.admin_id = a.id
        ORDER BY al.created_at DESC
        LIMIT 5
    ");
    
    $stmt->execute();
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n✓ Found " . count($activities) . " activities\n\n";
    
    foreach ($activities as $activity) {
        echo "---\n";
        echo "ID: " . $activity['id'] . "\n";
        echo "Admin: " . $activity['admin_name'] . "\n";
        echo "Action: " . $activity['action_type'] . "\n";
        echo "Entity: " . $activity['entity_type'] . " #" . $activity['entity_id'] . "\n";
        echo "Title: " . $activity['entity_title'] . "\n";
        echo "Description: " . $activity['description'] . "\n";
        echo "Time: " . $activity['created_at'] . "\n";
    }
    
    echo "\n✓ Test completed successfully!\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
