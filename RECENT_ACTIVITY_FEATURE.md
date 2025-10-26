# Recent Activity Feature - Implementation Guide

## Overview
The Recent Activity feature tracks all admin actions in the admin panel and displays them in real-time on the dashboard. This provides an audit trail and quick visibility into what's happening in the system.

## Features

### ✅ What's Tracked
- **Notices**: Create, update, delete
- **Guidance**: Create, update, delete
- **Downloads**: Create, delete
- **Images**: Upload, delete
- **Users**: Create, deactivate/delete
- **Settings**: Update site settings

### ✅ Activity Information Displayed
- Action type (create, update, delete, upload)
- Entity type (notice, guidance, download, image, user, setting)
- Entity title/name
- Admin who performed the action
- Time ago (e.g., "5 minutes ago", "2 hours ago")
- Action description

## Database Structure

### Activity Log Table
```sql
CREATE TABLE activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action_type ENUM('create','update','delete','upload') NOT NULL,
  entity_type ENUM('notice','guidance','download','image','user','setting') NOT NULL,
  entity_id INT NULL,
  entity_title VARCHAR(200) NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
)
```

### Installation
Run the SQL script to create the activity_log table:
```bash
mysql -u root < database/activity_log_table.sql
```

Or via PowerShell:
```powershell
Get-Content "database/activity_log_table.sql" | C:\xampp\mysql\bin\mysql.exe -u root
```

## API Endpoints

### GET /backend/api/activity.php
Get recent activities with optional limit parameter.

**Example Request:**
```javascript
GET /backend/api/activity.php?limit=10

Response:
{
  "success": true,
  "activities": [
    {
      "id": 45,
      "action": "create",
      "entity_type": "notice",
      "entity_id": 12,
      "entity_title": "Final Exam Schedule",
      "description": "Create Notice: \"Final Exam Schedule\"",
      "admin_name": "John Doe",
      "admin_username": "admin1",
      "created_at": "2025-10-27 14:30:00",
      "time_ago": "5 minutes ago"
    },
    // ... more activities
  ],
  "count": 10
}
```

**Query Parameters:**
- `limit` (optional) - Number of activities to return (default: 10, max: 50)

### POST /backend/api/activity.php
Log a new activity (called automatically by admin panel).

**Request:**
```javascript
POST /backend/api/activity.php
Content-Type: application/json

{
  "action_type": "create",
  "entity_type": "notice",
  "entity_id": 12,
  "entity_title": "Final Exam Schedule",
  "description": "Created new notice for upcoming exams"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Activity logged successfully",
  "activity_id": 45
}
```

## Frontend Integration

### Dashboard Display (admin/index.html)

The dashboard now includes a Recent Activity section:

```html
<div class="activity-section">
    <div class="section-header">
        <h3>Recent Activity</h3>
    </div>
    <ul class="activity-list" id="activityList">
        <!-- Populated dynamically -->
    </ul>
</div>
```

### JavaScript Functions (assets/js/admin-panel.js)

#### Load Recent Activities
```javascript
async function loadRecentActivities()
```
- Fetches latest 8 activities from API
- Displays with appropriate icons and colors
- Shows "time ago" format
- Auto-loads on page load

#### Log Activity
```javascript
async function logActivity(actionType, entityType, entityId, entityTitle, description)
```
- Logs activity to database
- Refreshes activity list automatically
- Called after successful CRUD operations

#### Activity Icons & Colors
| Action | Icon | Color |
|--------|------|-------|
| create | plus-circle | Green |
| update | edit | Blue |
| delete | trash-alt | Red |
| upload | upload | Purple |

## Automatic Activity Logging

All CRUD operations now automatically log activities:

### Notices
```javascript
// After creating notice
await logActivity('create', 'notice', result.id, title);

// After updating notice
await logActivity('update', 'notice', editingNoticeId, title);

// After deleting notice
await logActivity('delete', 'notice', id, noticeTitle);
```

### Guidance
```javascript
// After creating
await logActivity('create', 'guidance', result.id, title);

// After updating
await logActivity('update', 'guidance', editingGuidanceId, title);

// After deleting
await logActivity('delete', 'guidance', id, guidanceTitle);
```

### Downloads
```javascript
// After creating
await logActivity('create', 'download', result.id, title);

// After deleting
await logActivity('delete', 'download', id, downloadTitle);
```

### Images
```javascript
// After uploading
await logActivity('upload', 'image', result.id, title);

// After deleting
await logActivity('delete', 'image', id, imageTitle);
```

### Users
```javascript
// After creating
await logActivity('create', 'user', result.id, fullName);

// After deactivating
await logActivity('delete', 'user', id, userName);
```

### Settings
```javascript
// After saving settings
await logActivity('update', 'setting', null, 'Site Settings');
```

## Time Ago Calculation

The API automatically converts timestamps to human-readable format:

| Time Difference | Display |
|----------------|---------|
| < 1 minute | "Just now" |
| < 1 hour | "X minutes ago" |
| < 1 day | "X hours ago" |
| < 1 week | "X days ago" |
| > 1 week | "Oct 27, 2025" |

## Display Examples

### Dashboard Activity List
```
🟢 Create Notice: "Final Exam Schedule"
   5 minutes ago

🔵 Update Guidance: "Thesis Submission Guidelines"
   1 hour ago

🟣 Upload Image: "Campus Event Photo"
   2 hours ago

🔴 Delete Notice: "Old Announcement"
   Yesterday

🟢 Create User: "Sarah Johnson"
   Oct 26, 2025
```

## Security Features

1. **Authentication Required** - Only logged-in admins can view/log activities
2. **Cascade Delete** - Activities deleted when admin is deleted
3. **Audit Trail** - Cannot be modified after creation
4. **Admin Attribution** - Every activity linked to specific admin
5. **Timestamp Protection** - Created_at set automatically, cannot be changed

## Performance Considerations

1. **Indexed Columns**
   - `created_at DESC` for fast recent queries
   - `admin_id` for filtering by admin

2. **Limit Parameter**
   - Default: 10 activities
   - Maximum: 50 activities
   - Prevents excessive data loading

3. **Efficient Queries**
   - Single JOIN with admins table
   - ORDER BY optimized with index
   - LIMIT clause for pagination

## Monitoring & Reporting

### Common Queries

**Most Active Admin:**
```sql
SELECT 
    a.name,
    COUNT(*) as activity_count
FROM activity_log al
JOIN admins a ON al.admin_id = a.id
GROUP BY al.admin_id
ORDER BY activity_count DESC
LIMIT 10;
```

**Activities by Type:**
```sql
SELECT 
    action_type,
    entity_type,
    COUNT(*) as count
FROM activity_log
GROUP BY action_type, entity_type
ORDER BY count DESC;
```

**Recent Deletions:**
```sql
SELECT 
    entity_type,
    entity_title,
    a.name as admin_name,
    al.created_at
FROM activity_log al
JOIN admins a ON al.admin_id = a.id
WHERE action_type = 'delete'
ORDER BY al.created_at DESC
LIMIT 20;
```

**Today's Activity:**
```sql
SELECT COUNT(*) as activities_today
FROM activity_log
WHERE DATE(created_at) = CURDATE();
```

## Future Enhancements

1. **Activity Filtering**
   - Filter by action type
   - Filter by entity type
   - Filter by admin
   - Date range filtering

2. **Activity Details Modal**
   - Click activity to see full details
   - View complete description
   - See before/after values

3. **Activity Notifications**
   - Real-time notifications for important actions
   - Email digest of daily activities
   - Alert on critical deletions

4. **Activity Export**
   - Export to CSV
   - PDF reports
   - Excel worksheets

5. **Activity Analytics**
   - Charts showing activity trends
   - Peak activity times
   - Most modified entities

6. **Undo Functionality**
   - Ability to undo recent deletions
   - Restore from activity log
   - Version history

## Troubleshooting

### Activities not showing
1. Check browser console for API errors
2. Verify activity_log table exists
3. Check admin session is active
4. Verify database connection

### Activities not logging
1. Check API returns success
2. Verify admin_id in session
3. Check database permissions
4. Ensure CRUD operations complete successfully

### "Time ago" showing wrong times
1. Check server timezone settings
2. Verify MySQL timezone
3. Check created_at timestamps in database

---
**Created:** October 2025  
**Status:** Production Ready ✅  
**Dependencies:** MySQL, PHP 7.4+, Session management, Activity Log API
