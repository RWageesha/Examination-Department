# Database Setup Guide - KDU Examination Department

## 📋 Steps to Update Database Schema in phpMyAdmin

### Method 1: Import Entire Schema (Recommended for Fresh Setup)

1. **Open phpMyAdmin**
   - Open your browser and go to: `http://localhost/phpmyadmin`
   - Login with your MySQL credentials (default: username: `root`, password: empty)

2. **Import Schema File**
   - Click on **"Import"** tab in the top menu
   - Click **"Choose File"** button
   - Navigate to: `D:\Exam dept\Examination-Department\database\schema.sql`
   - Select the file and click **"Open"**
   - Scroll down and click **"Go"** button at the bottom
   - Wait for success message: "Import has been successfully finished"

3. **Verify Database Creation**
   - Look at the left sidebar - you should see `kdu_exam` database
   - Click on `kdu_exam` to expand it
   - You should see these tables:
     - ✓ admins
     - ✓ notices
     - ✓ guidance
     - ✓ download_categories
     - ✓ downloads_files
     - ✓ **images** (newly added for gallery)

---

### Method 2: Add Only the Images Table (If Database Already Exists)

If you already have the `kdu_exam` database and just need to add the images table:

1. **Open phpMyAdmin** → Navigate to `http://localhost/phpmyadmin`

2. **Select Database**
   - Click on `kdu_exam` database from the left sidebar

3. **Run SQL Query**
   - Click on the **"SQL"** tab at the top
   - Copy and paste this SQL code:

```sql
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
```

4. **Execute**
   - Click **"Go"** button
   - You should see: "Query executed successfully"

---

## 🖼️ Import Gallery Images from Folder

After creating the database/table, import existing images:

### Using Command Line (Easiest)

```powershell
# Navigate to project directory
cd "D:\Exam dept\Examination-Department"

# Run import script
& "C:\xampp\php\php.exe" backend/import_gallery_images.php
```

**What this does:**
- ✓ Scans `./assets/images/Image_gallery/` folder
- ✓ Copies all images to `./assets/uploads/images/`
- ✓ Adds database records for each image
- ✓ Makes images visible on gallery page

**Expected Output:**
```
Found 9 images to import.

✓ Imported: 1.jpg -> 1761494829_4335_1.jpg
✓ Imported: 2.jpg -> 1761494829_1852_2.jpg
...
=================================
Import complete!
Imported: 9
Skipped: 0
=================================
```

---

## 🔐 Create First Admin Account

If you don't have an admin account yet:

### Option 1: Use Signup Page (First Time Only)
1. Visit: `http://localhost:8080/admin/signup.html`
2. Fill in the form
3. Click "Create Account"
4. Login at: `http://localhost:8080/admin/login.html`

### Option 2: Manual Database Insert
1. Generate password hash: `http://localhost:8080/backend/tools/make_password_hash.php?pwd=Admin@123`
2. Copy the hash
3. In phpMyAdmin SQL tab:
```sql
INSERT INTO admins (name, email, username, password_hash, role) 
VALUES ('Super Admin', 'admin@kdu.ac.lk', 'admin', 'PASTE_HASH_HERE', 'super');
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Database `kdu_exam` exists in phpMyAdmin
- [ ] Table `images` exists with proper structure
- [ ] Import script ran successfully (9 images imported)
- [ ] Gallery page loads: `http://localhost:8080/gallery.html`
- [ ] Images visible on gallery page
- [ ] Admin panel accessible: `http://localhost:8080/admin/`
- [ ] Can upload new images via admin panel

---

## 🔧 Troubleshooting

### "Table 'kdu_exam.images' doesn't exist"
→ Run Method 2 SQL query above in phpMyAdmin SQL tab

### "Admin with ID 1 not found"
→ Create an admin account first (see section above)

### "No images found in folder"
→ Check that images exist in: `D:\Exam dept\Examination-Department\assets\images\Image_gallery\`

### Import script fails
→ Make sure MySQL is running in XAMPP Control Panel

---

## 📁 File Locations

- **Schema**: `database/schema.sql`
- **Import Script**: `backend/import_gallery_images.php`
- **Source Images**: `assets/images/Image_gallery/`
- **Uploaded Images**: `assets/uploads/images/`
- **Gallery Page**: `gallery.html`
- **Admin Panel**: `admin/index.html`

---

## 🚀 Quick Start Commands

```powershell
# Start MySQL (if not running)
# Use XAMPP Control Panel → Start MySQL

# Start PHP Server
cd "D:\Exam dept\Examination-Department"
& "C:\xampp\php\php.exe" -S localhost:8080

# Import images (run once)
& "C:\xampp\php\php.exe" backend/import_gallery_images.php

# Open in browser
start http://localhost:8080
start http://localhost:8080/gallery.html
start http://localhost:8080/admin/
```

---

**Need Help?** Check the terminal output for specific error messages.
