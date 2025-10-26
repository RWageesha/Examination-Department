<?php
/**
 * Settings API
 * Handles site settings CRUD operations
 */

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../lib/http.php';

// Only admins can manage settings
session_start();
if (!isset($_SESSION['admin_id'])) {
    http_response(401, ['error' => 'Unauthorized']);
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all settings or a specific setting
            if (isset($_GET['key'])) {
                getSetting($_GET['key']);
            } else {
                getAllSettings();
            }
            break;

        case 'POST':
        case 'PUT':
            // Update settings (batch update)
            updateSettings();
            break;

        default:
            http_response(405, ['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    error_log("Settings API error: " . $e->getMessage());
    http_response(500, ['error' => 'Internal server error: ' . $e->getMessage()]);
}

/**
 * Get all settings as key-value pairs
 */
function getAllSettings() {
    global $pdo;
    
    $stmt = $pdo->query("
        SELECT setting_key, setting_value, setting_type, description 
        FROM settings 
        ORDER BY setting_key
    ");
    
    $settings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $settings[$row['setting_key']] = [
            'value' => castSettingValue($row['setting_value'], $row['setting_type']),
            'type' => $row['setting_type'],
            'description' => $row['description']
        ];
    }
    
    http_response(200, [
        'success' => true,
        'settings' => $settings
    ]);
}

/**
 * Get a specific setting by key
 */
function getSetting($key) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        SELECT setting_key, setting_value, setting_type, description 
        FROM settings 
        WHERE setting_key = ?
    ");
    $stmt->execute([$key]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        http_response(404, ['error' => 'Setting not found']);
    }
    
    http_response(200, [
        'success' => true,
        'setting' => [
            'key' => $row['setting_key'],
            'value' => castSettingValue($row['setting_value'], $row['setting_type']),
            'type' => $row['setting_type'],
            'description' => $row['description']
        ]
    ]);
}

/**
 * Update multiple settings at once
 */
function updateSettings() {
    global $pdo;
    
    // Get JSON data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['settings'])) {
        http_response(400, ['error' => 'Invalid request data']);
    }
    
    $adminId = $_SESSION['admin_id'];
    $updatedCount = 0;
    
    $pdo->beginTransaction();
    
    try {
        $stmt = $pdo->prepare("
            UPDATE settings 
            SET setting_value = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE setting_key = ?
        ");
        
        foreach ($data['settings'] as $key => $value) {
            // Convert boolean values to string
            if (is_bool($value)) {
                $value = $value ? '1' : '0';
            }
            
            $stmt->execute([
                $value === null ? null : (string)$value,
                $adminId,
                $key
            ]);
            
            if ($stmt->rowCount() > 0) {
                $updatedCount++;
            }
        }
        
        $pdo->commit();
        
        http_response(200, [
            'success' => true,
            'message' => 'Settings updated successfully',
            'updated_count' => $updatedCount
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

/**
 * Cast setting value based on type
 */
function castSettingValue($value, $type) {
    if ($value === null) {
        return null;
    }
    
    switch ($type) {
        case 'number':
            return is_numeric($value) ? (int)$value : 0;
        case 'boolean':
            return (bool)$value || $value === '1' || $value === 'true';
        case 'json':
            return json_decode($value, true);
        default:
            return $value;
    }
}
