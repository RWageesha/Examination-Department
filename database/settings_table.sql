-- Settings table for KDU Examination Department
-- Run this to add settings functionality

USE `kdu_exam`;

-- Site settings table
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NULL,
  setting_type ENUM('text','number','boolean','url','json') NOT NULL DEFAULT 'text',
  description VARCHAR(255) NULL,
  updated_by INT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_admins FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
-- General Settings
('site_name', 'KDU Examination Department', 'text', 'Website name'),
('site_description', 'Official website of the Examination Department at General Sir John Kotelawala Defence University', 'text', 'Site description'),
('contact_email', 'exams@kdu.ac.lk', 'text', 'Contact email address'),
('contact_phone', '+94 11 263 8656', 'text', 'Contact phone number'),

-- Homepage Settings
('slider_autoplay', '1', 'boolean', 'Enable slider autoplay'),
('slider_delay', '5', 'number', 'Slider delay in seconds'),
('notices_display_count', '3', 'number', 'Number of notices to show on homepage'),
('featured_notice_id', NULL, 'number', 'ID of featured notice'),

-- Social Media Settings
('facebook_url', 'https://facebook.com/kdu', 'url', 'Facebook page URL'),
('twitter_url', 'https://twitter.com/kdu', 'url', 'Twitter profile URL'),
('linkedin_url', 'https://linkedin.com/company/kdu', 'url', 'LinkedIn company URL')

ON DUPLICATE KEY UPDATE 
  setting_value = VALUES(setting_value),
  description = VALUES(description);
