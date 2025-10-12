# Admin Panel Access Guide

This guide explains how to access and use the admin panel in Service Charge Watch.

## How to Access the Admin Panel

### Step 1: Create Your First Admin User

Since this is a new installation, you'll need to manually create your first admin user in the Supabase database.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Navigate to **Table Editor** in the left sidebar
3. Click on the `admin_users` table
4. Click **Insert row** or **Insert** button
5. Fill in the fields:
   - `user_id`: Copy your user ID from the `auth.users` table (after signing up)
   - `email`: Your email address
   - `role`: `admin`
   - Leave `created_at` empty (will auto-fill)
6. Click **Save**

#### Option B: Using SQL Editor

1. First, sign up for an account at http://localhost:3000/auth/signup
2. Go to your Supabase project dashboard
3. Navigate to **SQL Editor** in the left sidebar
4. Run this query (replace with your email):

```sql
-- Find your user_id
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Insert into admin_users table (replace USER_ID with the id from above)
INSERT INTO admin_users (user_id, email, role)
VALUES ('USER_ID_FROM_ABOVE', 'your-email@example.com', 'admin');
```

### Step 2: Access the Admin Panel

1. **Log in** to your account at http://localhost:3000/auth/login
2. Once logged in, you'll see an **"Admin"** button in the navigation header
3. Click **Admin** to access the admin dashboard at `/admin/dashboard`

## Admin Panel Features

### 1. Admin Dashboard (`/admin/dashboard`)

**What you can do:**
- View pending submissions
- See approval/rejection statistics
- Review and verify service charge submissions
- Approve or reject submissions individually
- Bulk approve/reject multiple submissions
- Export data to CSV

**Key Features:**
- 📊 Real-time stats (Pending, Approved, Rejected)
- ✅ One-click approval
- ❌ Rejection with reason
- 📦 Bulk actions for efficiency
- 📥 Export submissions, SC records, and hotels data

### 2. Admin User Management (`/admin/users`)

**What you can do:**
- View all admin users
- Add new admin users
- Remove admin access
- See when admins were added

**Key Features:**
- 🛡️ Secure admin management
- ✉️ Add admins by email (they must sign up first)
- 🔒 Cannot remove yourself or the last admin
- 📋 View admin activity timestamps

## Navigation Structure

When logged in as an admin, your navigation will show:

```
Home | About | My Submissions | Admin | Submit SC Data
```

- **Home**: Public leaderboard
- **About**: Platform information
- **My Submissions**: Your submission history
- **Admin**: Admin dashboard (only visible to admins)
- **Submit SC Data**: Submit new service charge data

## Admin Dashboard Workflow

### Reviewing Submissions

1. Navigate to `/admin/dashboard`
2. View the **Pending Submissions** table
3. For each submission, you can:
   - **View Proof**: Click the eye icon to see uploaded documentation
   - **Approve**: Creates a verified record and sends approval email
   - **Reject**: Marks as rejected and sends rejection email with reason

### Bulk Operations

1. Select multiple submissions using checkboxes
2. Click **Approve [X]** or **Reject [X]** in the header
3. For rejections, enter a reason that applies to all
4. Confirm the action
5. Email notifications will be sent to all submitters

### Exporting Data

1. Click the **Export Data** dropdown in the header
2. Choose what to export:
   - **All Submissions**: Export all submissions (pending, approved, rejected)
   - **Pending Submissions**: Export only pending submissions
   - **SC Records**: Export verified service charge records
   - **Hotels**: Export hotel directory
3. Data downloads as CSV file

## Managing Admin Users

### Adding a New Admin

1. Navigate to `/admin/users`
2. Click **Add Admin** button
3. Enter the user's email address
   - **Important**: User must have already signed up for an account
4. Click **Add Admin**
5. The user will immediately have admin access

### Removing Admin Access

1. Navigate to `/admin/users`
2. Find the user you want to remove
3. Click **Remove** button
4. Confirm the action
5. **Note**: You cannot remove yourself or the last admin

## Security Features

### Built-in Protections

- ✅ Authentication required for all admin pages
- ✅ Admin role verification on every request
- ✅ Cannot remove yourself (prevents lockout)
- ✅ Cannot remove the last admin (maintains access)
- ✅ Email validation before adding admins
- ✅ User must exist before being granted admin access

### Best Practices

1. **Only grant admin access to trusted users**
   - Admins can approve/reject submissions
   - Admins can export all data
   - Admins can manage other admins

2. **Keep admin list up to date**
   - Remove admin access when no longer needed
   - Regularly review the admin list

3. **Use rejection reasons wisely**
   - Be specific and helpful
   - Provide guidance for resubmission
   - Maintain professional tone

## Email Notifications

Admins' actions trigger automatic email notifications:

### Approval Emails
- Sent when submission is approved
- Includes submission details
- Link to view on public leaderboard
- Encourages continued contribution

### Rejection Emails
- Sent when submission is rejected
- Includes rejection reason
- Link to submit again
- Supportive messaging

**Note**: Email notifications require Resend configuration. See `EMAIL_SETUP.md` for details.

## Troubleshooting

### "Admin" Link Not Showing

**Possible causes:**
1. You're not logged in → Log in at `/auth/login`
2. Your account is not in the `admin_users` table → Add yourself (see Step 1)
3. Browser cache → Clear cache and refresh

**How to check:**
1. Go to Supabase Dashboard
2. Navigate to Table Editor → `admin_users`
3. Look for your email in the table
4. If not there, add yourself using the instructions in Step 1

### Cannot Access Admin Dashboard

**Error**: "Forbidden" or redirected to homepage

**Solution:**
- Verify you're logged in
- Check if your user_id exists in `admin_users` table
- Ensure your session is valid (try logging out and back in)

### "User Not Found" When Adding Admin

**This means:** The email you entered doesn't have an account yet

**Solution:**
1. Tell the user to sign up first at `/auth/signup`
2. Wait for them to complete registration
3. Then add them as admin using their registered email

## Quick Reference

### URLs
- Admin Dashboard: http://localhost:3000/admin/dashboard
- Admin Users: http://localhost:3000/admin/users
- Login: http://localhost:3000/auth/login
- Signup: http://localhost:3000/auth/signup

### Database Tables
- `admin_users`: Stores admin user information
- `submissions`: Service charge submissions pending review
- `sc_records`: Verified service charge records
- `hotels`: Hotel directory

### Key Features
- Individual approve/reject
- Bulk operations
- Email notifications
- CSV export
- Admin user management
- Proof document viewing

## Next Steps

After setting up your first admin:

1. ✅ Test the approval workflow
2. ✅ Configure email notifications (see `EMAIL_SETUP.md`)
3. ✅ Add additional admin users if needed
4. ✅ Review the existing submissions
5. ✅ Export data to verify everything works

## Support

For issues or questions:
- Check the application logs in your terminal
- Review Supabase logs in the dashboard
- Verify database table structures
- Check email configuration (if emails not sending)

---

**Remember**: The admin panel is powerful. Only grant access to trusted users and review the audit trail regularly.
