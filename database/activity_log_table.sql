-- Activity Log table for tracking recent admin actions
-- Run this to add activity tracking functionality

USE `kdu_exam`;

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

-- Create a stored procedure to log activities
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS log_activity(
  IN p_admin_id INT,
  IN p_action_type VARCHAR(20),
  IN p_entity_type VARCHAR(20),
  IN p_entity_id INT,
  IN p_entity_title VARCHAR(200),
  IN p_description TEXT
)
BEGIN
  INSERT INTO activity_log (admin_id, action_type, entity_type, entity_id, entity_title, description)
  VALUES (p_admin_id, p_action_type, p_entity_type, p_entity_id, p_entity_title, p_description);
END //

DELIMITER ;
