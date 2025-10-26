<?php
/**
 * Activity Log API
 * Handles activity logging and retrieval
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

// Only admins can access activity logs
session_start();
if (!isset($_SESSION['admin']) || !isset($_SESSION['admin']['id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$adminId = $_SESSION['admin']['id'];

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get recent activities
            getRecentActivities();
            break;

        case 'POST':
            // Log a new activity
            logActivity();
            break;

        default:
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method not allowed']);
            exit;
    }
} catch (Exception $e) {
    error_log("Activity Log API error: " . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
    exit;
}

/**
 * Get recent activities
 */
function getRecentActivities() {
    $pdo = db();
    
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $limit = min($limit, 50); // Max 50 activities
    
    $stmt = $pdo->prepare("
        SELECT 
            al.id,
            al.action_type,
            al.entity_type,
            al.entity_id,
            al.entity_title,
            al.description,
            al.created_at,
            a.name as admin_name,
            a.username as admin_username
        FROM activity_log al
        JOIN admins a ON al.admin_id = a.id
        ORDER BY al.created_at DESC
        LIMIT ?
    ");
    
    $stmt->execute([$limit]);
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format activities for display
    $formatted = [];
    foreach ($activities as $activity) {
        $formatted[] = [
            'id' => (int)$activity['id'],
            'action' => $activity['action_type'],
            'entity_type' => $activity['entity_type'],
            'entity_id' => $activity['entity_id'] ? (int)$activity['entity_id'] : null,
            'entity_title' => $activity['entity_title'],
            'description' => $activity['description'] ?: generateDescription($activity),
            'admin_name' => $activity['admin_name'],
            'admin_username' => $activity['admin_username'],
            'created_at' => $activity['created_at'],
            'time_ago' => timeAgo($activity['created_at'])
        ];
    }
    
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'activities' => $formatted,
        'count' => count($formatted)
    ]);
    exit;
}

/**
 * Log a new activity
 */
function logActivity() {
    global $adminId;
    $pdo = db();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['action_type']) || !isset($data['entity_type'])) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Missing required fields: action_type, entity_type']);
        exit;
    }
    
    $actionType = $data['action_type'];
    $entityType = $data['entity_type'];
    $entityId = $data['entity_id'] ?? null;
    $entityTitle = $data['entity_title'] ?? null;
    $description = $data['description'] ?? null;
    
    // Validate action_type
    $validActions = ['create', 'update', 'delete', 'upload'];
    if (!in_array($actionType, $validActions)) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid action_type']);
        exit;
    }
    
    // Validate entity_type
    $validEntities = ['notice', 'guidance', 'download', 'image', 'user', 'setting'];
    if (!in_array($entityType, $validEntities)) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid entity_type']);
        exit;
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO activity_log 
        (admin_id, action_type, entity_type, entity_id, entity_title, description)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $adminId,
        $actionType,
        $entityType,
        $entityId,
        $entityTitle,
        $description
    ]);
    
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Activity logged successfully',
        'activity_id' => (int)$pdo->lastInsertId()
    ]);
    exit;
}

/**
 * Generate a description from activity data
 */
function generateDescription($activity) {
    $action = ucfirst($activity['action_type']);
    $entity = ucfirst($activity['entity_type']);
    $title = $activity['entity_title'] ? ": \"{$activity['entity_title']}\"" : '';
    
    return "{$action} {$entity}{$title}";
}

/**
 * Convert timestamp to human-readable "time ago" format
 */
function timeAgo($timestamp) {
    $time = strtotime($timestamp);
    $diff = time() - $time;
    
    if ($diff < 60) {
        return 'Just now';
    } elseif ($diff < 3600) {
        $mins = floor($diff / 60);
        return $mins . ' minute' . ($mins > 1 ? 's' : '') . ' ago';
    } elseif ($diff < 86400) {
        $hours = floor($diff / 3600);
        return $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ago';
    } elseif ($diff < 604800) {
        $days = floor($diff / 86400);
        return $days . ' day' . ($days > 1 ? 's' : '') . ' ago';
    } else {
        return date('M j, Y', $time);
    }
}
