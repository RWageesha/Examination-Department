<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/http.php';

// Fallback simple session start if session helper not present
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = db(); // Use db() function
} catch (Exception $e) {
    json_response(['error' => 'DB connection failed'], 500);
}

// Simple auth check for POST/DELETE
function check_admin_auth() {
    if (empty($_SESSION['admin_id']) && empty($_SESSION['admin'])) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    // Return admin_id from either session structure
    return $_SESSION['admin_id'] ?? $_SESSION['admin']['id'] ?? null;
}

switch ($method) {
    case 'GET':
        // Optional filters: category
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $sql = "SELECT i.id, i.title, i.category, i.description, i.file_path, i.created_at, a.email as created_by_email FROM images i JOIN admins a ON a.id = i.created_by";
        $params = [];
        if ($category) {
            $sql .= " WHERE i.category = ?";
            $params[] = $category;
        }
        $sql .= " ORDER BY i.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response(['data' => $rows]);
        break;
    case 'POST':
        $admin_id = check_admin_auth();
        if (empty($_FILES['image'])) {
            json_response(['error' => 'image file required'], 400);
        }
        $title = isset($_POST['title']) ? trim($_POST['title']) : '';
        if ($title === '') $title = 'Untitled';
        $category = isset($_POST['category']) ? $_POST['category'] : 'gallery';
        if (!in_array($category, ['slider','gallery','other'])) {
            $category = 'gallery';
        }
        $description = isset($_POST['description']) ? trim($_POST['description']) : null;

        $file = $_FILES['image'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            json_response(['error' => 'Upload failed'], 400);
        }
        if ($file['size'] > MAX_UPLOAD_BYTES) {
            json_response(['error' => 'File too large'], 400);
        }
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        $allowed = ['image/png','image/jpeg','image/gif','image/webp'];
        if (!in_array($mime, $allowed)) {
            json_response(['error' => 'Invalid image type'], 400);
        }
        $safeName = time() . '_' . preg_replace('/[^A-Za-z0-9_.-]/','_', strtolower($file['name']));
        $targetPath = GALLERY_UPLOADS . '/' . $safeName;
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            json_response(['error' => 'Failed to save file'], 500);
        }
        $relPath = 'assets/uploads/images/' . $safeName; // relative for front-end
        $stmt = $pdo->prepare("INSERT INTO images (title, category, description, file_path, created_by) VALUES (?,?,?,?,?)");
        $stmt->execute([$title, $category, $description, $relPath, $admin_id]);
        json_response(['message' => 'Image added']);
        break;
    case 'DELETE':
        check_admin_auth();
        parse_str(file_get_contents('php://input'), $delVars);
        $id = isset($delVars['id']) ? (int)$delVars['id'] : 0;
        if (!$id) json_response(['error' => 'Missing id'], 400);
        $stmt = $pdo->prepare("SELECT file_path FROM images WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) json_response(['error' => 'Not found'], 404);
        $pdo->prepare("DELETE FROM images WHERE id=?")->execute([$id]);
        // delete file
        $diskPath = __DIR__ . '/../../' . $row['file_path'];
        if (is_file($diskPath)) @unlink($diskPath);
        json_response(['message' => 'Deleted']);
        break;
    default:
        json_response(['error' => 'Method not allowed'], 405);
}
