# 🚀 Deployment Checklist for InfinityFree

## Pre-Deployment (On Your Computer)

- [ ] Update `backend/config.php` with InfinityFree database credentials
- [ ] Test locally one more time to ensure everything works
- [ ] Backup your local database (export from phpMyAdmin)
- [ ] Remove any development files (test_*.php, *_local.php, etc.)

## InfinityFree Setup

### 1. Database Setup
- [ ] Log into InfinityFree Control Panel (vPanel)
- [ ] Go to "MySQL Databases"
- [ ] Note down these values:
  - [ ] MySQL Hostname: ________________
  - [ ] Database Name: ________________
  - [ ] Username: ________________
  - [ ] Password: ________________

### 2. Update Configuration
- [ ] Open `backend/config.php` in text editor
- [ ] Replace database credentials:
  ```php
  define('DB_HOST', 'sql###.infinityfree.com');  // Your actual host
  define('DB_NAME', 'epiz_########_kdu_exam');   // Your actual database name
  define('DB_USER', 'epiz_########');             // Your actual username
  define('DB_PASS', 'your_actual_password');      // Your actual password
  ```
- [ ] Update APP_BASE to `'/'`
- [ ] Set MAX_UPLOAD_BYTES to `10 * 1024 * 1024` (10MB limit)
- [ ] Disable error display:
  ```php
  // At the end of config.php:
  ini_set('display_errors', 0);
  error_reporting(0);
  ```
- [ ] Save the file

### 3. Import Database
- [ ] Open phpMyAdmin from InfinityFree control panel
- [ ] Select your database from left sidebar
- [ ] Click "Import" tab
- [ ] Import these files IN ORDER:
  - [ ] `database/schema.sql`
  - [ ] `database/settings_table.sql`
  - [ ] `database/activity_log_table.sql`
- [ ] Verify all tables are created (8 tables total)

### 4. Upload Files
- [ ] Open File Manager or connect via FTP
- [ ] Navigate to `htdocs` folder
- [ ] Upload ALL project files EXCEPT:
  - [ ] Do NOT upload: `.git`, `node_modules`, `.env`, `*.md` (optional)
- [ ] Verify this structure exists:
  ```
  htdocs/
  ├── .htaccess
  ├── index.html
  ├── admin/
  ├── assets/
  ├── backend/
  ├── common/
  ├── database/ (optional - can delete after import)
  └── degree_transcript/
  ```

### 5. Set Permissions
- [ ] In File Manager, right-click `assets/uploads`
- [ ] Set permissions to **755**
- [ ] Check "Apply to subdirectories"
- [ ] Click "Change Permissions"
- [ ] Verify these folders are writable:
  - [ ] `assets/uploads/`
  - [ ] `assets/uploads/guidance/`
  - [ ] `assets/uploads/downloads/`
  - [ ] `assets/uploads/images/`

### 6. Test Database Connection
- [ ] Upload `backend/test_connection.php`
- [ ] Visit: `https://yoursite.com/backend/test_connection.php`
- [ ] Check all tests pass:
  - [ ] ✓ Config file found and loaded
  - [ ] ✓ Database connected successfully
  - [ ] ✓ All 8 tables found
  - [ ] ✓ Upload directory writable
- [ ] **DELETE** `test_connection.php` after success

### 7. Create Admin Account
- [ ] Visit: `https://yoursite.com/admin/signup.html`
- [ ] Fill in admin details:
  - [ ] Username: ________________
  - [ ] Full Name: ________________
  - [ ] Email: ________________
  - [ ] Password: ________________ (write it down securely!)
- [ ] Submit form
- [ ] Verify success message appears

### 8. Test Login
- [ ] Visit: `https://yoursite.com/admin/login.html`
- [ ] Enter username/email and password
- [ ] Click "Login"
- [ ] Verify:
  - [ ] No error messages in browser console (F12)
  - [ ] Redirects to admin dashboard
  - [ ] Dashboard shows stats (0 or actual counts)
  - [ ] Sidebar navigation works

### 9. Test Main Website
- [ ] Visit: `https://yoursite.com/`
- [ ] Verify:
  - [ ] Homepage loads correctly
  - [ ] Images load (logo, slider if any)
  - [ ] No JavaScript errors in console
  - [ ] Links work properly

### 10. Test Admin Features
- [ ] **Notices:**
  - [ ] Create a test notice
  - [ ] Edit the notice
  - [ ] Delete the notice
- [ ] **Guidance:**
  - [ ] Add guidance item
  - [ ] Upload PDF/image
  - [ ] View on website
- [ ] **Downloads:**
  - [ ] Add download file
  - [ ] Verify it appears on downloads page
- [ ] **Images:**
  - [ ] Upload image to gallery
  - [ ] Verify it appears in gallery
- [ ] **Settings:**
  - [ ] Update site name
  - [ ] Save settings
  - [ ] Verify changes appear on website

### 11. Security Checklist
- [ ] DELETE `backend/test_connection.php`
- [ ] DELETE `backend/test_insert_activities.php`
- [ ] DELETE `backend/test_activity_api.php`
- [ ] Verify `.htaccess` file is in root directory
- [ ] Verify `backend/config.php` has `display_errors` set to 0
- [ ] Test that direct access to `.php` files in backend is blocked
- [ ] Change default admin password if using sample data

### 12. Performance Optimization
- [ ] Enable HTTPS (SSL) in InfinityFree if available
- [ ] Test page load speed
- [ ] Compress large images before uploading
- [ ] Enable gzip compression in `.htaccess`

## Troubleshooting

### If login shows "Unexpected end of JSON input":
1. [ ] Check browser Network tab (F12) for actual error
2. [ ] Visit `backend/api/auth/login.php` directly to see raw error
3. [ ] Verify database credentials in `config.php` are correct
4. [ ] Check phpMyAdmin to ensure `admins` table exists
5. [ ] Look at InfinityFree error logs in control panel

### If "Database connection failed":
1. [ ] Double-check DB_HOST is NOT `localhost`
2. [ ] Verify database name includes the `epiz_########` prefix
3. [ ] Test connection using `test_connection.php`
4. [ ] Check if database user has ALL privileges

### If uploads don't work:
1. [ ] Check folder permissions are 755 or 775
2. [ ] Verify file size is under 10MB (InfinityFree limit)
3. [ ] Check error logs for specific upload errors
4. [ ] Ensure `assets/uploads` folder exists

### If website shows blank page:
1. [ ] View page source (Ctrl+U) to check for PHP errors
2. [ ] Open browser console (F12) for JavaScript errors
3. [ ] Check if all CSS/JS files are loading (Network tab)
4. [ ] Verify file paths are correct (case-sensitive!)

## Post-Deployment

- [ ] Test website on different devices (mobile, tablet, desktop)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Set up regular database backups
- [ ] Monitor InfinityFree disk usage and bandwidth
- [ ] Add your domain name if you have one (in vPanel)

## Known InfinityFree Limitations

⚠️ **Important:** InfinityFree free hosting has these limitations:
- 10MB max file upload size
- Sessions may clear on server restart
- Some PHP functions may be disabled
- Slower performance compared to paid hosting
- Forced ads may appear (use ad-free option if available)
- Database connections limited (don't open too many)

## Need Better Hosting?

If InfinityFree doesn't work well, consider these alternatives:
- **000webhost**: Better performance, no ads
- **Railway.app**: $5 free credit monthly, excellent for PHP
- **Render.com**: Free tier with PostgreSQL
- **PlanetScale**: Free MySQL database (5GB)

---

**Status:** [ ] Deployment Complete ✅

**Website URL:** ___________________________________

**Admin Username:** ___________________________________

**Notes:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
