<?php
/**
 * Test script to insert sample activities into activity_log
 * Run this once to populate some test data
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo = db();

// Get the first admin ID
$stmt = $pdo->query("SELECT id FROM admins LIMIT 1");
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {
    die("No admin found. Please create an admin first.\n");
}

$adminId = $admin['id'];

// Sample activities
$activities = [
    ['create', 'notice', null, 'Welcome to Examination Department', 'Created initial welcome notice'],
    ['upload', 'image', null, 'Campus Building', 'Uploaded campus building image'],
    ['create', 'guidance', null, 'Exam Guidelines', 'Created exam guidelines document'],
    ['update', 'setting', null, 'Site Settings', 'Updated site configuration'],
    ['create', 'notice', null, 'Exam Schedule Released', 'Published new examination schedule'],
];

$stmt = $pdo->prepare("
    INSERT INTO activity_log 
    (admin_id, action_type, entity_type, entity_id, entity_title, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? MINUTE))
");

$minutesAgo = 0;
foreach ($activities as $activity) {
    $stmt->execute([
        $adminId,
        $activity[0], // action_type
        $activity[1], // entity_type
        $activity[2], // entity_id
        $activity[3], // entity_title
        $activity[4], // description
        $minutesAgo
    ]);
    $minutesAgo += 15; // Each activity 15 minutes older than the previous
}

echo "Successfully inserted " . count($activities) . " sample activities!\n";
echo "You can now view them in the admin dashboard.\n";
