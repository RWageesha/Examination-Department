-- KDU Examination Department Backend Schema
-- Run this in phpMyAdmin or MySQL client

CREATE DATABASE IF NOT EXISTS `kdu_exam`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `kdu_exam`;

-- Admin accounts (super/admin)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NULL UNIQUE,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super','admin') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- In case the table already existed from a previous version, ensure username column exists
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS username VARCHAR(50) NULL UNIQUE AFTER name;

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  noticed_date DATE NOT NULL,
  link_url VARCHAR(500) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notices_admins FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Student Guidance
CREATE TABLE IF NOT EXISTS guidance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  link_url VARCHAR(500) NULL,
  attachment_path VARCHAR(500) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_guidance_admins FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Download categories
CREATE TABLE IF NOT EXISTS download_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Files available for download (either file or link)
CREATE TABLE IF NOT EXISTS downloads_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  file_path VARCHAR(500) NULL,
  link_url VARCHAR(500) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_downloads_category FOREIGN KEY (category_id) REFERENCES download_categories(id) ON DELETE CASCADE,
  CONSTRAINT fk_downloads_admins FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE RESTRICT,
  CONSTRAINT chk_downloads_file_or_link CHECK ((file_path IS NOT NULL) OR (link_url IS NOT NULL))
) ENGINE=InnoDB;

-- Seed categories
INSERT INTO download_categories (slug, name)
VALUES ('staff', 'For Staff'), ('students', 'For Students'), ('exam_hall_schedules', 'Exam Hall Schedules')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Image gallery table
CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category ENUM('slider','gallery','other') NOT NULL DEFAULT 'gallery',
  description VARCHAR(500) NULL,
  file_path VARCHAR(500) NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_images_admins FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Create a super admin after importing this file:
-- 1) Visit http://localhost/Examination-Department/backend/tools/make_password_hash.php?pwd=Admin@123
-- 2) Copy the result hash and run:
-- INSERT INTO admins (name, email, username, password_hash, role) VALUES
-- ('Super Admin', 'examinationdivision1@gmail.com', 'examinationdivision1', '<paste-hash-here>', 'super');

-- Note: Login supports either email or username. You can set username manually
-- when creating admins, or derive it from the email's local part.
