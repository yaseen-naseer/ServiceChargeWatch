# Comprehensive TODO List - ServiceChargeWatch

**Generated:** 2025-10-12
**Current Phase:** Phase 1 Complete → Phase 2 Planning
**Status:** Production-Ready with Improvements Needed

---

## Executive Summary

**What's Working:**
- ✅ Complete Phase 1 MVP functionality
- ✅ Authentication system (login, signup, email verification)
- ✅ Public leaderboard with 8 hotels and 25 SC records
- ✅ Hotel profile pages with charts and statistics
- ✅ Submission form with file uploads
- ✅ Admin dashboard with approval/reject workflow
- ✅ Admin user management system
- ✅ Export functionality (CSV)
- ✅ Row Level Security policies active
- ✅ Responsive UI with shadcn/ui components

**What Needs Attention:**
- ⚠️ Email notifications not configured (RESEND_API_KEY missing)
- ⚠️ 13 RLS performance warnings (auth.uid() re-evaluation)
- ⚠️ 3 missing foreign key indexes
- ⚠️ 2 function security warnings
- ⚠️ 4 Supabase Auth security improvements
- 📋 Multiple Phase 2 features pending

---

## Priority 1: Critical Issues (Fix Before Production)

### 1.1 Email Notifications Setup
**Status:** ❌ Not Configured
**Impact:** High - Users don't receive approval/rejection notifications
**Reference:** `EMAIL_SETUP.md`

**Tasks:**
- [ ] Create Resend account at [resend.com](https://resend.com)
- [ ] Get API key from Resend dashboard
- [ ] Add to `.env.local`:
  ```bash
  RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
  RESEND_FROM_EMAIL=notifications@yourdomain.com  # or onboarding@resend.dev for dev
  ```
- [ ] Verify domain in Resend (for production)
- [ ] Test approval email
- [ ] Test rejection email
- [ ] Restart dev server

**Files Affected:**
- `.env.local`
- `lib/email/resend.ts` (already configured with fallback)
- `lib/email/send.ts` (already handles missing API key gracefully)

**Estimated Time:** 30 minutes

---

### 1.2 Database Performance Optimizations

#### 1.2.1 Fix RLS Performance Issues
**Status:** ⚠️ 13 Warnings
**Impact:** High - Performance degradation at scale
**Reference:** [Supabase RLS Performance Docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)

**Issue:** RLS policies re-evaluate `auth.uid()` for every row

**Solution:** Wrap `auth.uid()` in SELECT subquery

**Example Fix:**
```sql
-- BEFORE (slow)
CREATE POLICY "Admins can insert hotels"
ON hotels FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

-- AFTER (fast)
CREATE POLICY "Admins can insert hotels"
ON hotels FOR INSERT
TO authenticated
WITH CHECK (is_admin((SELECT auth.uid())));
```

**Affected Tables:**
- [ ] `hotels` (3 policies: insert, update, delete)
- [ ] `sc_records` (3 policies: insert, update, delete)
- [ ] `submissions` (4 policies: insert, view own, view all, update)
- [ ] `exchange_rates` (1 policy: manage)
- [ ] `admin_users` (1 policy: read own record)

**Tasks:**
- [ ] Create migration: `fix_rls_performance.sql`
- [ ] Update all policies to use `(SELECT auth.uid())`
- [ ] Test policies still work correctly
- [ ] Run advisor again to verify fix

**Estimated Time:** 1 hour

---

#### 1.2.2 Add Missing Foreign Key Indexes
**Status:** ⚠️ 3 Missing Indexes
**Impact:** Medium - Slower joins and lookups

**Missing Indexes:**
- [ ] `sc_records.verified_by` → `auth.users.id`
- [ ] `submissions.reviewed_by` → `auth.users.id`
- [ ] `submissions.submitter_user_id` → `auth.users.id`

**Migration SQL:**
```sql
-- Add indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_sc_records_verified_by ON sc_records(verified_by);
CREATE INDEX IF NOT EXISTS idx_submissions_reviewed_by ON submissions(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_submissions_submitter_user_id ON submissions(submitter_user_id);
```

**Tasks:**
- [ ] Create migration: `add_foreign_key_indexes.sql`
- [ ] Apply migration to database
- [ ] Verify indexes created

**Estimated Time:** 15 minutes

---

#### 1.2.3 Fix Function Security Warnings
**Status:** ⚠️ 2 Warnings
**Impact:** Low - Security best practice

**Functions Affected:**
- `public.handle_updated_at`
- `public.is_admin`

**Issue:** Functions have mutable search_path

**Solution:** Set search_path explicitly

**Migration SQL:**
```sql
-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
  );
END;
$$;
```

**Tasks:**
- [ ] Create migration: `fix_function_security.sql`
- [ ] Apply migration
- [ ] Verify functions work correctly

**Estimated Time:** 15 minutes

---

### 1.3 Supabase Auth Security Improvements

#### 1.3.1 Enable Leaked Password Protection
**Status:** ❌ Disabled
**Impact:** Medium - Users can use compromised passwords
**Reference:** [Supabase Password Security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

**Tasks:**
- [ ] Go to Supabase Dashboard
- [ ] Navigate to Authentication → Providers → Email
- [ ] Enable "Check for leaked passwords"
- [ ] Test with known leaked password
- [ ] Document configuration

**Estimated Time:** 10 minutes

---

#### 1.3.2 Configure MFA Options
**Status:** ❌ Not Configured
**Impact:** Low - Additional security layer missing
**Reference:** [Supabase MFA Docs](https://supabase.com/docs/guides/auth/auth-mfa)

**Tasks:**
- [ ] Go to Supabase Dashboard
- [ ] Navigate to Authentication → Providers → Phone
- [ ] Enable Phone (SMS) provider
- [ ] Configure Twilio integration
- [ ] Test MFA flow
- [ ] Add MFA UI to application (Phase 2)

**Estimated Time:** 2 hours (including UI implementation)

---

## Priority 2: Phase 2 Features (Enhancement)

### 2.1 User Experience Improvements

#### 2.1.1 Add Pagination for Large Datasets
**Status:** 📋 Not Implemented
**Impact:** Medium - Performance issues with 100+ records
**Reference:** `PROJECT_PLAN.md` - Phase 1 Known Limitations

**Implementation:**
- [ ] Add pagination to leaderboard table
- [ ] Add pagination to admin dashboard
- [ ] Add pagination to submissions history
- [ ] Implement "Load More" or page numbers
- [ ] Add page size selector (10, 20, 50, 100)

**Files to Create/Modify:**
- `components/leaderboard/leaderboard-client.tsx`
- `components/admin/verification-queue.tsx`
- `components/submissions/submission-history.tsx`
- `lib/utils.ts` (pagination helpers)

**Estimated Time:** 3 hours

---

#### 2.1.2 Implement Search Functionality
**Status:** 📋 Not Implemented
**Impact:** Medium - Hard to find specific hotels

**Implementation:**
- [ ] Add search bar to homepage leaderboard
- [ ] Full-text search on hotel names
- [ ] Filter by atoll dropdown
- [ ] Filter by type dropdown
- [ ] Implement debounced search (300ms)
- [ ] Show "No results" state

**Files to Modify:**
- `components/leaderboard/leaderboard-client.tsx`
- `app/page.tsx` (add search params to URL)

**Estimated Time:** 2 hours

---

#### 2.1.3 Add User Profile Management
**Status:** 📋 Not Implemented
**Impact:** Low - Users can't manage their account

**Features:**
- [ ] Profile page at `/profile`
- [ ] Display user info (email, joined date)
- [ ] Change password functionality
- [ ] Delete account option
- [ ] View submission statistics
- [ ] Email notification preferences

**Files to Create:**
- `app/profile/page.tsx`
- `components/profile/profile-form.tsx`
- `app/api/profile/route.ts`

**Estimated Time:** 4 hours

---

#### 2.1.4 Implement Submission Editing
**Status:** 📋 Not Implemented
**Impact:** Medium - Users can't fix mistakes

**Features:**
- [ ] Edit button on submission history
- [ ] Pre-fill form with existing data
- [ ] Allow editing only pending submissions
- [ ] Update proof file option
- [ ] Admin notification of edited submission

**Files to Modify:**
- `components/submissions/submission-history.tsx`
- `app/api/submissions/[id]/route.ts` (new)
- Database: Add `edited_at` column to submissions

**Estimated Time:** 3 hours

---

### 2.2 Admin Dashboard Enhancements

#### 2.2.1 Advanced Filtering
**Status:** 📋 Not Implemented
**Impact:** Medium - Hard to find specific submissions

**Features:**
- [ ] Filter by status (pending, approved, rejected)
- [ ] Filter by hotel
- [ ] Filter by date range
- [ ] Filter by submitter email
- [ ] Sort by any column
- [ ] Save filter presets

**Files to Modify:**
- `components/admin/verification-queue.tsx`
- `app/admin/dashboard/page.tsx`

**Estimated Time:** 3 hours

---

#### 2.2.2 Bulk Operations UI Improvements
**Status:** ✅ Implemented, Needs Polish
**Impact:** Low

**Improvements:**
- [ ] Show selected count in real-time
- [ ] Select all checkbox
- [ ] Deselect all button
- [ ] Bulk actions toolbar (fixed at bottom)
- [ ] Confirmation with summary
- [ ] Progress indicator for bulk operations

**Files to Modify:**
- `components/admin/verification-queue.tsx`

**Estimated Time:** 2 hours

---

### 2.3 Data Visualization & Analytics

#### 2.3.1 Hotel Comparison Feature
**Status:** 📋 Not Implemented
**Impact:** Medium - Users can't compare hotels

**Features:**
- [ ] Compare page at `/compare`
- [ ] Select 2-3 hotels to compare
- [ ] Side-by-side charts
- [ ] Comparison table
- [ ] Share comparison link

**Files to Create:**
- `app/compare/page.tsx`
- `components/charts/comparison-chart.tsx`

**Estimated Time:** 4 hours

---

#### 2.3.2 Advanced Analytics Dashboard
**Status:** 📋 Not Implemented
**Impact:** Low - Nice to have for admins

**Features:**
- [ ] Industry trends chart
- [ ] Submission patterns (by day/week)
- [ ] Top contributing users
- [ ] Average approval time
- [ ] Rejection reasons breakdown
- [ ] Export analytics data

**Files to Create:**
- `app/admin/analytics/page.tsx`
- `components/admin/analytics-charts.tsx`

**Estimated Time:** 6 hours

---

### 2.4 Mobile & Responsive Improvements

#### 2.4.1 Mobile UX Enhancements
**Status:** ⚠️ Partially Complete
**Impact:** High - Many users on mobile

**Improvements:**
- [ ] Optimize table scrolling on mobile
- [ ] Bottom navigation for mobile
- [ ] Swipe gestures for charts
- [ ] Mobile-optimized forms
- [ ] Touch-friendly buttons (min 44px)
- [ ] Test on real devices (iOS, Android)

**Files to Modify:**
- All component files
- `app/globals.css`

**Estimated Time:** 4 hours

---

#### 2.4.2 Progressive Web App (PWA)
**Status:** 📋 Not Implemented
**Impact:** Low - Nice to have

**Features:**
- [ ] Add manifest.json
- [ ] Service worker for offline support
- [ ] Install prompt
- [ ] Push notifications (future)
- [ ] Offline indicators

**Files to Create:**
- `public/manifest.json`
- `public/sw.js`
- `app/layout.tsx` (add PWA meta tags)

**Estimated Time:** 3 hours

---

## Priority 3: Production Deployment

### 3.1 Deployment Setup

#### 3.1.1 Vercel Deployment
**Status:** 📋 Not Deployed
**Impact:** High - Needed for public access

**Tasks:**
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Deploy to production
- [ ] Test production build
- [ ] Set up preview deployments

**Estimated Time:** 1 hour

---

#### 3.1.2 Custom Domain Configuration
**Status:** 📋 Not Configured
**Impact:** Medium - Professional appearance

**Tasks:**
- [ ] Purchase domain (e.g., servicechargewatch.mv)
- [ ] Add domain to Vercel
- [ ] Configure DNS records
- [ ] Enable SSL certificate (automatic)
- [ ] Test custom domain
- [ ] Update Supabase redirect URLs

**Estimated Time:** 1 hour

---

### 3.2 Production Checklist

#### 3.2.1 Security Audit
**Tasks:**
- [ ] Review all RLS policies
- [ ] Test unauthorized access attempts
- [ ] Verify file upload security
- [ ] Check for exposed secrets
- [ ] Enable rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CSP headers

**Estimated Time:** 2 hours

---

#### 3.2.2 Performance Optimization
**Tasks:**
- [ ] Run Lighthouse audit
- [ ] Optimize images (convert to WebP)
- [ ] Implement lazy loading
- [ ] Add caching headers
- [ ] Enable Vercel Analytics
- [ ] Set up performance monitoring

**Estimated Time:** 2 hours

---

#### 3.2.3 Run Full Testing Checklist
**Reference:** `TESTING_CHECKLIST.md`

**Tasks:**
- [ ] Complete all 7 test flows
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Security testing
- [ ] Performance testing
- [ ] Data integrity verification

**Estimated Time:** 4 hours

---

## Priority 4: Documentation & Polish

### 4.1 API Documentation
**Status:** 📋 Not Created
**Impact:** Low - Needed for third-party integrations

**Tasks:**
- [ ] Document all API endpoints
- [ ] Add request/response examples
- [ ] Create Postman collection
- [ ] Document authentication
- [ ] Add rate limiting info
- [ ] Create API keys management (future)

**Estimated Time:** 3 hours

---

### 4.2 User Documentation
**Tasks:**
- [ ] Create comprehensive FAQ
- [ ] Add video tutorials
- [ ] Create submission guidelines
- [ ] Add admin user guide
- [ ] Create troubleshooting guide

**Estimated Time:** 4 hours

---

## Summary & Recommendations

### Immediate Actions (This Week)
1. ✅ **Configure email notifications** (30 min)
2. ✅ **Fix RLS performance** (1 hour)
3. ✅ **Add missing indexes** (15 min)
4. ✅ **Fix function security** (15 min)
5. ✅ **Enable password protection** (10 min)

**Total Time:** ~2 hours 10 minutes

### Short-Term Goals (Next 2 Weeks)
1. Implement pagination
2. Add search functionality
3. Complete testing checklist
4. Deploy to production
5. Configure custom domain

**Total Time:** ~12 hours

### Long-Term Goals (Next Month)
1. Implement all Phase 2 features
2. Add MFA authentication
3. Create mobile app (optional)
4. Build API for third parties

**Total Time:** ~40 hours

---

## Progress Tracking

**Phase 1 MVP:** ✅ 100% Complete (24/24 tasks)
**Priority 1 (Critical):** ⏳ 0% Complete (0/9 tasks)
**Priority 2 (Enhancement):** ⏳ 0% Complete (0/11 tasks)
**Priority 3 (Deployment):** ⏳ 0% Complete (0/5 tasks)
**Priority 4 (Documentation):** ⏳ 0% Complete (0/2 tasks)

**Overall Progress:** Phase 1 Complete, Phase 2 Ready to Start

---

## References

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Complete project plan
- [TECHSTACK.md](./TECHSTACK.md) - Technology stack details
- [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md) - Phase 1 completion status
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Comprehensive testing guide
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Email configuration guide
- [ADMIN_ACCESS_GUIDE.md](./ADMIN_ACCESS_GUIDE.md) - Admin panel guide

---

**Last Updated:** 2025-10-12
**Next Review:** After completing Priority 1 tasks
**Version:** 1.0
