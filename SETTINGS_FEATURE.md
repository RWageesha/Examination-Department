# Settings Feature - Implementation Guide

## Overview
The Settings feature allows administrators to manage site-wide configuration through the admin panel. All settings are stored in the database and loaded dynamically.

## Database Setup

### Table Structure
```sql
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NULL,
  setting_type ENUM('text','number','boolean','url','json') NOT NULL DEFAULT 'text',
  description VARCHAR(255) NULL,
  updated_by INT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### Installation
Run the SQL script to create the table and insert default values:
```bash
mysql -u root < database/settings_table.sql
```

Or via PowerShell:
```powershell
Get-Content "database/settings_table.sql" | C:\xampp\mysql\bin\mysql.exe -u root
```

## Available Settings

### General Settings
- **site_name** (text) - Website name
- **site_description** (text) - Site description
- **contact_email** (text) - Contact email address
- **contact_phone** (text) - Contact phone number

### Homepage Settings
- **slider_autoplay** (boolean) - Enable slider autoplay (1/0)
- **slider_delay** (number) - Slider delay in seconds
- **notices_display_count** (number) - Number of notices to show on homepage
- **featured_notice_id** (number) - ID of featured notice (nullable)

### Social Media Settings
- **facebook_url** (url) - Facebook page URL
- **twitter_url** (url) - Twitter profile URL
- **linkedin_url** (url) - LinkedIn company URL

## API Endpoints

### GET /backend/api/settings.php
Get all settings or a specific setting.

**Get all settings:**
```javascript
GET /backend/api/settings.php

Response:
{
  "success": true,
  "settings": {
    "site_name": {
      "value": "KDU Examination Department",
      "type": "text",
      "description": "Website name"
    },
    // ... other settings
  }
}
```

**Get specific setting:**
```javascript
GET /backend/api/settings.php?key=site_name

Response:
{
  "success": true,
  "setting": {
    "key": "site_name",
    "value": "KDU Examination Department",
    "type": "text",
    "description": "Website name"
  }
}
```

### POST/PUT /backend/api/settings.php
Update multiple settings at once.

**Request:**
```javascript
POST /backend/api/settings.php
Content-Type: application/json

{
  "settings": {
    "site_name": "New Site Name",
    "slider_autoplay": "1",
    "slider_delay": "7",
    "contact_email": "newemail@kdu.ac.lk"
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Settings updated successfully",
  "updated_count": 4
}
```

## Frontend Integration

### Admin Panel (admin/index.html)

The settings section includes three forms:
1. **General Settings Form** - Basic site information
2. **Homepage Settings Form** - Homepage behavior configuration
3. **Social Media Settings Form** - Social media links

### JavaScript Functions (assets/js/admin-panel.js)

#### Load Settings
```javascript
async function loadSettings()
```
- Fetches all settings from API
- Populates form fields with current values
- Loads notices into featured notice dropdown

#### Save Settings
```javascript
saveSettingsBtn.addEventListener('click', async function() {
  // Collects all form values
  // Sends to API
  // Shows success/error message
})
```

#### Populate Featured Notice Dropdown
```javascript
async function populateFeaturedNoticeDropdown(selectedId)
```
- Fetches active notices from database
- Dynamically populates dropdown with real notice titles
- Selects current featured notice

## Usage

### Admin Panel Access
1. Navigate to Settings section in admin panel
2. Modify any setting values
3. Click "Save Changes" button
4. All settings are saved to database in a single transaction

### Using Settings in Public Pages

To use settings on public pages (index.html, etc.), create a helper function:

**Example: Get settings for public page**
```php
// common/get_settings.php
<?php
require_once __DIR__ . '/../backend/db.php';

function getPublicSettings() {
    global $pdo;
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $settings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    return $settings;
}
```

**Usage in index.php:**
```php
<?php
require_once 'common/get_settings.php';
$settings = getPublicSettings();
?>

<title><?= htmlspecialchars($settings['site_name']) ?></title>
<meta name="description" content="<?= htmlspecialchars($settings['site_description']) ?>">
```

## Security Features

1. **Authentication Required** - Only logged-in admins can access settings API
2. **Transaction Safety** - All updates wrapped in database transaction
3. **Input Validation** - Type casting and validation on save
4. **Audit Trail** - Tracks who updated settings and when
5. **SQL Injection Protection** - Prepared statements used throughout

## Type Casting

Settings are automatically cast to appropriate types:

| Type | Cast Rule | Example |
|------|-----------|---------|
| text | String | "KDU Examination Department" |
| number | Integer | 5 → (int)5 |
| boolean | Boolean | "1" → true, "0" → false |
| url | String | "https://facebook.com/kdu" |
| json | Array | "{...}" → [...] |

## Adding New Settings

### 1. Add to Database
```sql
INSERT INTO settings (setting_key, setting_value, setting_type, description) 
VALUES ('new_setting_key', 'default_value', 'text', 'Description of setting');
```

### 2. Add to HTML Form
```html
<div class="form-group">
    <label for="newSetting">New Setting Label</label>
    <input type="text" id="newSetting" name="newSetting" value="">
</div>
```

### 3. Add to JavaScript Save Handler
```javascript
// In saveSettingsBtn click handler
const settings = {
    // ... existing settings
    new_setting_key: document.getElementById('newSetting')?.value || ''
};
```

### 4. Add to Load Handler
```javascript
// In loadSettings function
if (settings.new_setting_key) {
    document.getElementById('newSetting').value = settings.new_setting_key.value;
}
```

## Testing Checklist

✅ Settings load correctly on page load
✅ All form fields populate with database values
✅ Featured notice dropdown shows real notices from database
✅ Save button updates all settings
✅ Success message appears after save
✅ Changes persist after page reload
✅ Boolean values (checkboxes) work correctly
✅ Number inputs validate properly
✅ URL fields accept valid URLs
✅ Unauthorized users cannot access settings API

## Troubleshooting

### Settings not loading
- Check browser console for API errors
- Verify settings table exists: `SHOW TABLES LIKE 'settings'`
- Verify default data inserted: `SELECT COUNT(*) FROM settings`

### Save fails
- Check admin is logged in (session active)
- Verify JSON format in request
- Check MySQL error logs
- Ensure all foreign keys valid

### Featured notice dropdown empty
- Verify notices exist in database
- Check notices API is working
- Ensure notices have proper permissions

## Future Enhancements

1. **Settings Categories** - Group settings by category in UI
2. **Validation Rules** - Add min/max, regex validation
3. **File Upload Settings** - Allow logo, favicon uploads
4. **Settings Export/Import** - Backup/restore settings
5. **Settings History** - Track all changes with rollback
6. **Environment-specific Settings** - Dev/staging/production configs
7. **Cache Settings** - Add Redis/Memcached for performance

---
**Created:** October 2025  
**Status:** Production Ready ✅  
**Dependencies:** MySQL, PHP 7.4+, Session management
