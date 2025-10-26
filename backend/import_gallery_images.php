<?php
/**
 * One-time script to import existing images from Image_gallery folder into the database
 * Run this script once via command line: php backend/import_gallery_images.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// You need to be logged in as an admin or provide an admin ID
// For import purposes, we'll use admin ID 1 (adjust if your first admin has a different ID)
$IMPORT_ADMIN_ID = 1;

try {
    $pdo = db(); // Use db() function instead of get_db()
    
    // Check if admin exists
    $stmt = $pdo->prepare("SELECT id FROM admins WHERE id = ? LIMIT 1");
    $stmt->execute([$IMPORT_ADMIN_ID]);
    if (!$stmt->fetch()) {
        die("Error: Admin with ID {$IMPORT_ADMIN_ID} not found. Please create an admin first or adjust IMPORT_ADMIN_ID.\n");
    }
    
    $sourceDir = __DIR__ . '/../assets/images/Image_gallery';
    $targetDir = __DIR__ . '/../assets/uploads/images';
    
    // Ensure target directory exists
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0775, true);
        echo "Created target directory: {$targetDir}\n";
    }
    
    // Get all image files
    $files = glob($sourceDir . '/*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}', GLOB_BRACE);
    
    if (empty($files)) {
        die("No images found in {$sourceDir}\n");
    }
    
    echo "Found " . count($files) . " images to import.\n\n";
    
    $imported = 0;
    $skipped = 0;
    
    foreach ($files as $filePath) {
        $filename = basename($filePath);
        $fileExt = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        // Generate unique filename
        $newFilename = time() . '_' . mt_rand(1000, 9999) . '_' . preg_replace('/[^A-Za-z0-9_.-]/', '_', strtolower($filename));
        $targetPath = $targetDir . '/' . $newFilename;
        $relPath = 'assets/uploads/images/' . $newFilename;
        
        // Copy file to uploads directory
        if (copy($filePath, $targetPath)) {
            // Insert into database
            $title = 'Gallery Image ' . pathinfo($filename, PATHINFO_FILENAME);
            $category = 'gallery'; // Default to gallery; change to 'slider' if you want them in slider
            $description = 'Imported from Image_gallery folder';
            
            try {
                $stmt = $pdo->prepare("INSERT INTO images (title, category, description, file_path, created_by) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$title, $category, $description, $relPath, $IMPORT_ADMIN_ID]);
                
                echo "✓ Imported: {$filename} -> {$newFilename}\n";
                $imported++;
            } catch (Exception $e) {
                echo "✗ Database error for {$filename}: " . $e->getMessage() . "\n";
                unlink($targetPath); // Clean up copied file
                $skipped++;
            }
        } else {
            echo "✗ Failed to copy {$filename}\n";
            $skipped++;
        }
        
        // Small delay to ensure unique timestamps
        usleep(100000); // 100ms
    }
    
    echo "\n=================================\n";
    echo "Import complete!\n";
    echo "Imported: {$imported}\n";
    echo "Skipped: {$skipped}\n";
    echo "=================================\n";
    echo "\nYou can now view the images at: http://localhost:8080/gallery.html\n";
    
} catch (Exception $e) {
    die("Error: " . $e->getMessage() . "\n");
}
