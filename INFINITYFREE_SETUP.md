# InfinityFree Hosting Setup Guide

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Get Your Database Credentials

1. Log into your InfinityFree control panel (vPanel or cPanel)
2. Navigate to **MySQL Databases**
3. You should see your database details:
   - **MySQL Hostname**: `sql###.infinityfree.com` (or `sql###.epizy.com`)
   - **Database Name**: `epiz_########_something`
   - **Username**: `epiz_########`
   - **Password**: Your database password

### Step 2: Update Configuration File

1. Open `backend/config.php` in a text editor
2. Replace the database credentials with your InfinityFree details:

```php
define('DB_HOST', 'sql###.infinityfree.com');  // Your MySQL hostname
define('DB_NAME', 'epiz_########_kdu_exam');   // Your database name
define('DB_USER', 'epiz_########');             // Your database username
define('DB_PASS', 'your_database_password');    // Your database password
```

3. Also update the APP_BASE if needed:
```php
if (!defined('APP_BASE')) define('APP_BASE', '/');
```

### Step 3: Import Database Tables

1. In InfinityFree control panel, go to **phpMyAdmin**
2. Select your database from the left sidebar
3. Click on **Import** tab
4. Upload and execute these SQL files **IN ORDER**:
   - `database/schema.sql` (main tables)
   - `database/settings_table.sql` (settings)
   - `database/activity_log_table.sql` (activity tracking)

### Step 4: Upload Files to Server

1. Use **File Manager** or **FTP** (FileZilla recommended)
2. Upload ALL project files to `htdocs` or `public_html` folder
3. Ensure this directory structure:
```
htdocs/
├── index.html
├── admin/
│   ├── index.html
│   ├── login.html
│   └── signup.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/ (must be writable)
├── backend/
│   ├── config.php
│   ├── db.php
│   ├── api/
│   └── ...
└── database/
```

### Step 5: Set File Permissions

1. Go to **File Manager**
2. Right-click on `assets/uploads` folder
3. Set permissions to **755** or **775**
4. Do the same for subfolders: `guidance`, `downloads`, `images`

### Step 6: Test Database Connection

1. Upload `backend/test_connection.php` to your server
2. Visit: `https://yoursite.com/backend/test_connection.php`
3. It will show detailed diagnostics
4. Fix any errors it reports
5. **DELETE** `test_connection.php` after successful test (security!)

### Step 7: Create Admin User

Option A - Via Signup Page:
1. Visit: `https://yoursite.com/admin/signup.html`
2. Fill in the form and create your admin account

Option B - Via phpMyAdmin:
```sql
INSERT INTO admins (username, name, email, password, role) 
VALUES (
  'admin', 
  'Administrator', 
  'admin@yourdomain.com', 
  '$2y$10$YourPasswordHash',  -- Use backend/tools/make_password_hash.php to generate
  'administrator'
);
```

### Step 8: Test Login

1. Visit: `https://yoursite.com/admin/login.html`
2. Log in with your credentials
3. Check that dashboard loads correctly

---

## ⚠️ Common InfinityFree Issues & Solutions

### Issue 1: "Unexpected end of JSON input"
**Cause:** PHP errors are being output before JSON, breaking the response.

**Solutions:**
- Check `backend/config.php` has correct database credentials
- Disable error display in production:
  ```php
  error_reporting(0);
  ini_set('display_errors', 0);
  ```
- Check PHP error logs in control panel
- Use `test_connection.php` to diagnose

### Issue 2: Database Connection Failed
**Cause:** Wrong credentials or database not created.

**Solutions:**
- Verify DB_HOST is `sql###.infinityfree.com` (not `localhost`)
- Ensure database exists in control panel
- Check username/password are correct
- Make sure database user has ALL privileges

### Issue 3: 403 Forbidden or 404 Errors
**Cause:** Incorrect file paths or .htaccess issues.

**Solutions:**
- Ensure all files are in `htdocs` or `public_html`
- Check file permissions (644 for files, 755 for folders)
- Create `.htaccess` if needed (see below)

### Issue 4: Images/Uploads Not Working
**Cause:** Directory permissions or path issues.

**Solutions:**
- Set `assets/uploads` to 755 or 775 permissions
- Check file upload limits (InfinityFree has 10MB limit)
- Verify paths in `config.php` are correct

### Issue 5: Session Issues / Auto Logout
**Cause:** InfinityFree's session handling.

**Solutions:**
- Ensure `session_start()` is at the top of API files
- Check for output before `session_start()`
- Sessions may clear on server restart (free hosting limitation)

---

## 📋 Recommended .htaccess File

Create this file in your root directory (`htdocs/.htaccess`):

```apache
# Enable rewrite engine
RewriteEngine On

# Force HTTPS (if you have SSL)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Protect sensitive files
<FilesMatch "(config\.php|db\.php|\.sql)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Increase upload limit (if allowed)
php_value upload_max_filesize 10M
php_value post_max_size 10M
```

---

## 🌐 Alternative Free Hosting Options (Better Than InfinityFree)

### 1. **000webhost** (Recommended)
- **Pros:** Better performance, 300MB storage, 3GB bandwidth, MySQL database
- **Cons:** Ads on free plan, limited support
- **URL:** https://www.000webhost.com/
- **Best for:** Testing and small projects

### 2. **Vercel** (Best for Frontend)
- **Pros:** Excellent performance, free SSL, GitHub integration, serverless functions
- **Cons:** Not ideal for PHP (requires API routes in Node.js)
- **URL:** https://vercel.com/
- **Best for:** If you migrate to Node.js/Next.js backend

### 3. **Railway** (Best Overall for Free Tier)
- **Pros:** $5 free credit monthly, supports PHP, MySQL, PostgreSQL, excellent performance
- **Cons:** Credit runs out fast with heavy usage
- **URL:** https://railway.app/
- **Best for:** Development and medium-traffic sites

### 4. **Render** (Good Free Tier)
- **Pros:** Free PostgreSQL, static sites, cron jobs, auto-deploy from Git
- **Cons:** Spins down after inactivity (slow first load)
- **URL:** https://render.com/
- **Best for:** Modern full-stack apps

### 5. **PlanetScale** (Database Only - FREE MySQL)
- **Pros:** 5GB storage, 1 billion row reads/month, excellent performance
- **Cons:** Database only (host frontend elsewhere)
- **URL:** https://planetscale.com/
- **Best for:** Production-grade free MySQL database

### 6. **Netlify** (Frontend Only)
- **Pros:** Fast CDN, 100GB bandwidth, continuous deployment
- **Cons:** No PHP support (need serverless functions)
- **URL:** https://www.netlify.com/
- **Best for:** Static sites with serverless backend

---

## 💡 Recommended Approach for Production

### Option 1: Keep PHP Stack (Current Architecture)
**Host on:** Railway or Render
- Upload your PHP files
- Create MySQL database
- Update config.php with new credentials
- Much better performance than InfinityFree

### Option 2: Migrate to Modern Stack (Future Proof)
**Tech Stack:** Next.js + Vercel + PlanetScale
- Frontend: Next.js on Vercel (free, fast CDN)
- Backend: Next.js API Routes (serverless)
- Database: PlanetScale (free 5GB MySQL)
- **Benefit:** Unlimited scalability, better performance, industry-standard

---

## 🔧 Quick Fix for InfinityFree

If you want to fix InfinityFree issues quickly:

1. **Update config.php** with InfinityFree database credentials
2. **Run test_connection.php** to verify connection
3. **Import all SQL files** in phpMyAdmin
4. **Set upload folder permissions** to 755
5. **Create admin user** via signup page
6. **Test login** - should work now

If still having issues, InfinityFree may be blocking certain PHP functions. Consider migrating to a better host.

---

## 📞 Need Help?

Common debug steps:
1. Check browser console (F12) for JavaScript errors
2. Check Network tab to see which API calls are failing
3. Look at the Response tab to see actual error messages
4. Use `test_connection.php` for database diagnostics
5. Check InfinityFree control panel error logs

Good luck with your deployment! 🚀
