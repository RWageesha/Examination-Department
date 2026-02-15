-- Activity Log table for tracking recent admin actions
-- Run this to add activity tracking functionality
-- Simplified version for InfinityFree hosting (no stored procedures)

USE `if0_40279726_kdu_exam`;

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action_type ENUM('create','update','delete','upload') NOT NULL,
  entity_type ENUM('notice','guidance','download','image','user','setting') NOT NULL,
  entity_id INT NULL,
  entity_title VARCHAR(200) NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_admins FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_created_at (created_at DESC),
  INDEX idx_admin_id (admin_id)
) ENGINE=InnoDB;

-- Note: Stored procedures are not supported on InfinityFree free hosting
-- Activity logging is handled directly via PHP in backend/api/activity.php
