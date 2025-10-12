# Testing Checklist - ServiceChargeWatch Phase 1 MVP

## Pre-Testing Setup

### 1. Supabase Configuration (Required)
- [ ] Enable Email Confirmation in Supabase Dashboard:
  - Navigate to Authentication > Providers > Email
  - Enable "Confirm email" option
  - Set Site URL to `http://localhost:3000`
  - Add Redirect URL: `http://localhost:3000/auth/callback`

### 2. Create Admin User
- [ ] Sign up for a regular user account
- [ ] Get the user_id from Supabase Dashboard (Authentication > Users)
- [ ] Insert admin record manually:
  ```sql
  INSERT INTO admin_users (user_id, role)
  VALUES ('your-user-id-here', 'admin');
  ```

---

## Test Flow 1: Public Access (No Authentication)

### Homepage Leaderboard
- [ ] Navigate to http://localhost:3000
- [ ] Verify hero section displays correctly
- [ ] Check stats cards show:
  - Top Paying Hotel (should show highest SC amount)
  - Average SC Amount
  - Total Hotels Tracked
- [ ] Verify leaderboard table displays:
  - Top 3 hotels have medals (🥇🥈🥉)
  - Rankings are sequential
  - Hotel names, atolls, types
  - USD, MVR, and Total amounts
  - All amounts are formatted correctly
- [ ] Test clicking on hotel names redirects to hotel profile

### Hotel Profile Pages
- [ ] Click on a hotel from the leaderboard
- [ ] Verify URL is /hotels/[hotel-id]
- [ ] Check stats dashboard displays:
  - Current Month SC
  - Average SC
  - Highest SC Record
  - Lowest SC Record
- [ ] Verify trend indicators show (↑ Up / ↓ Down / → Stable)
- [ ] Check SC trend chart:
  - Shows 12-month history
  - Lines for USD, MVR, and Total
  - X-axis shows months correctly
  - Y-axis has proper formatting
- [ ] Verify payment history list shows all records
- [ ] Test "Back to Leaderboard" button

---

## Test Flow 2: User Authentication

### Sign Up Flow
- [ ] Navigate to http://localhost:3000/auth/signup
- [ ] Try submitting empty form → should show validation errors
- [ ] Enter mismatched passwords → should show error
- [ ] Enter valid credentials:
  - Email: test@example.com
  - Password: TestPassword123!
  - Confirm Password: TestPassword123!
- [ ] Submit form
- [ ] Verify success screen appears with email verification message
- [ ] Check email inbox for verification link
- [ ] Click verification link
- [ ] Should redirect to /auth/callback then to homepage
- [ ] Verify user is now logged in

### Login Flow
- [ ] Navigate to http://localhost:3000/auth/login
- [ ] Try invalid credentials → should show error
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Should redirect to homepage (or redirectTo parameter if set)
- [ ] Verify user is logged in

### Logout Flow
- [ ] While logged in, navigate to /auth/logout
- [ ] Should sign out and redirect to homepage
- [ ] Verify user is logged out (no access to protected routes)

---

## Test Flow 3: Submission Form (Authenticated Users)

### Access Control
- [ ] While logged out, try to access /submit
- [ ] Should redirect to /auth/login with redirectTo=/submit
- [ ] Log in and verify redirect back to /submit

### Form Validation
- [ ] Try submitting empty form → should show validation errors
- [ ] Select a hotel from dropdown (should show all active hotels)
- [ ] Select month and year
- [ ] Enter invalid USD amount (negative or > 100000) → should show error
- [ ] Enter invalid MVR amount (negative or > 2000000) → should show error
- [ ] Leave position field empty → should show error

### Successful Submission
- [ ] Fill all required fields:
  - Hotel: Select any hotel
  - Month: Select any month
  - Year: Select 2025
  - USD Amount: 5000
  - MVR Amount: 77100 (optional)
  - Position: Server
- [ ] Upload a proof file (image or PDF, < 5MB)
- [ ] Submit form
- [ ] Verify success screen appears
- [ ] Auto-redirect to homepage after 3 seconds
- [ ] Check Supabase dashboard:
  - Submission should appear in `submissions` table with status 'pending'
  - Proof file should appear in `payslip-proofs` storage bucket

### File Upload Validation
- [ ] Try uploading file > 5MB → should show error
- [ ] Try uploading invalid file type → should show error
- [ ] Try submitting without proof (should work as it's optional)

---

## Test Flow 4: Admin Dashboard (Admin Users Only)

### Access Control
- [ ] While logged in as regular user, try to access /admin/dashboard
- [ ] Should redirect to homepage (no admin access)
- [ ] Log out and log in as admin user
- [ ] Navigate to /admin/dashboard
- [ ] Should successfully access dashboard

### Dashboard Overview
- [ ] Verify stats cards show:
  - Pending Review count
  - Approved count
  - Rejected count
- [ ] Verify verification queue shows pending submissions
- [ ] Check table displays:
  - Hotel name
  - Period (Month Year)
  - USD and MVR amounts
  - Submitter email
  - Position
  - Submitted date
  - Proof link (eye icon)

### Proof Review
- [ ] Click eye icon on a submission with proof
- [ ] Should open proof file in new tab
- [ ] Verify file is accessible

### Approve Submission
- [ ] Click "Approve" button on a submission
- [ ] Verify dialog opens with:
  - Title: "Approve Submission"
  - Hotel and period details
  - USD and MVR amounts in summary box
- [ ] Click "Confirm Approval"
- [ ] Verify processing state (loading spinner)
- [ ] Submission should disappear from queue
- [ ] Check Supabase dashboard:
  - Submission status should be 'approved'
  - New record should appear in `sc_records` table with verification_status='verified'
  - Record should show verified_by and verified_at
- [ ] Navigate to homepage
- [ ] Verify approved SC record appears in leaderboard
- [ ] Navigate to hotel profile
- [ ] Verify record appears in payment history and chart

### Reject Submission
- [ ] Click "Reject" button on a submission
- [ ] Verify dialog opens with rejection reason textarea
- [ ] Try clicking "Confirm Rejection" without reason → should be disabled
- [ ] Enter rejection reason: "Proof document is not clear"
- [ ] Click "Confirm Rejection"
- [ ] Verify processing state
- [ ] Submission should disappear from queue
- [ ] Check Supabase dashboard:
  - Submission status should be 'rejected'
  - rejection_reason field should contain the reason
  - reviewed_by and reviewed_at should be set

### Duplicate Month/Year Handling
- [ ] Create multiple submissions for same hotel, month, and year
- [ ] Approve first submission → should create new sc_record
- [ ] Approve second submission → should increment verification_count
- [ ] Check Supabase dashboard:
  - Only one sc_record should exist
  - verification_count should be 2
  - verified_at and verified_by should be updated

---

## Test Flow 5: Edge Cases & Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try submitting a form → should show error message
- [ ] Reconnect internet

### Invalid Routes
- [ ] Navigate to /hotels/invalid-uuid
- [ ] Should show appropriate error or redirect
- [ ] Navigate to /hotels/non-existent-uuid
- [ ] Should handle gracefully

### Concurrent Admin Reviews
- [ ] Open admin dashboard in two browser tabs
- [ ] Approve same submission in both tabs simultaneously
- [ ] Should handle gracefully (one succeeds, other shows error)

### Form State Persistence
- [ ] Start filling submission form
- [ ] Navigate away (without submitting)
- [ ] Return to /submit
- [ ] Form should be reset (no persistence expected in Phase 1)

### RLS Policy Testing
- [ ] While logged in, open browser dev tools
- [ ] Try to query admin_users table directly using Supabase client
- [ ] Should be blocked by RLS policy
- [ ] Try to insert sc_records directly
- [ ] Should be blocked (only admins can insert via API)

---

## Test Flow 6: Responsive Design

### Mobile View (< 640px)
- [ ] Open DevTools and set viewport to mobile
- [ ] Navigate through all pages
- [ ] Verify:
  - Navigation is accessible
  - Tables are scrollable or stack properly
  - Forms are usable
  - Charts resize appropriately
  - Dialogs fit viewport

### Tablet View (640px - 1024px)
- [ ] Set viewport to tablet size
- [ ] Verify layout adapts correctly
- [ ] Check grid layouts use proper columns

### Desktop View (> 1024px)
- [ ] Set viewport to desktop size
- [ ] Verify all elements use full available space
- [ ] Check maximum container widths

---

## Test Flow 7: Data Integrity

### Leaderboard Ranking Accuracy
- [ ] Verify ranking is based on total_usd (USD + MVR/15.42)
- [ ] Check that hotels with higher total_usd rank higher
- [ ] Verify current month filter works correctly

### SC Trend Chart Accuracy
- [ ] Compare chart data with payment history
- [ ] Verify USD, MVR, and Total values match
- [ ] Check that months are in correct order

### Stats Calculations
- [ ] Manually calculate average SC from hotel records
- [ ] Compare with displayed average on hotel profile
- [ ] Verify highest and lowest SC matches records

---

## Browser Compatibility Testing

### Chrome/Edge (Chromium)
- [ ] Test all flows in Chrome
- [ ] Verify all features work

### Firefox
- [ ] Test all flows in Firefox
- [ ] Check for any layout differences
- [ ] Verify file upload works

### Safari (if available)
- [ ] Test authentication flow
- [ ] Test submission form
- [ ] Check chart rendering

---

## Performance Testing

### Page Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Hotel profile loads in < 2 seconds
- [ ] Admin dashboard loads in < 3 seconds

### Database Query Optimization
- [ ] Check Network tab for duplicate queries
- [ ] Verify proper use of select() with joins
- [ ] Check for N+1 query issues

---

## Security Testing

### Authentication Protection
- [ ] Verify /submit requires authentication
- [ ] Verify /admin/dashboard requires admin role
- [ ] Check middleware redirects work correctly

### XSS Protection
- [ ] Try entering `<script>alert('XSS')</script>` in form fields
- [ ] Should be escaped/sanitized
- [ ] Check in rejection reason field

### File Upload Security
- [ ] Try uploading file with malicious extension (.exe, .sh)
- [ ] Should be blocked or sanitized
- [ ] Verify file size limits enforced

---

## Post-Testing Verification

### Database State
- [ ] Check all tables for data consistency
- [ ] Verify no orphaned records
- [ ] Check RLS policies are active

### Storage Bucket
- [ ] Verify uploaded files are accessible only to admins
- [ ] Check file naming convention
- [ ] Verify RLS policies on storage

### Error Logs
- [ ] Check browser console for errors
- [ ] Review server logs for any warnings
- [ ] Check Supabase logs for failed queries

---

## Known Limitations (Phase 1)

- No user profile management
- No email notifications for submission status
- No bulk approval/rejection
- No advanced filtering on admin dashboard
- No data export functionality
- No submission editing after creation
- No admin user management UI (manual SQL required)
- Email verification must be configured manually in Supabase
- No historical data comparison across hotels

---

## Summary Checklist

- [ ] All public pages accessible without authentication
- [ ] Authentication flows work correctly
- [ ] Submission form validates and saves data
- [ ] Admin dashboard shows pending submissions
- [ ] Approve/reject actions work and update database
- [ ] Leaderboard updates after approval
- [ ] Charts and stats display accurate data
- [ ] RLS policies protect sensitive data
- [ ] Responsive design works on all devices
- [ ] No critical errors in console

---

**Test Status:** ⏳ Ready for testing
**Last Updated:** 2025-10-11
**Phase:** 1 MVP
**Version:** 0.1.0
