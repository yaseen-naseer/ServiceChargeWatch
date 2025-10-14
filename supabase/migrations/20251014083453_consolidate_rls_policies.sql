-- Consolidate RLS Policies for Performance
-- Issue: Multiple permissive policies for same role+action causes performance degradation
-- Solution: Combine overlapping policies into single policies with OR conditions

-- ============================================================================
-- exchange_rates TABLE
-- ============================================================================

-- Drop existing overlapping policies
DROP POLICY IF EXISTS "Admins can manage exchange rates" ON exchange_rates;
DROP POLICY IF EXISTS "Anyone can view exchange rates" ON exchange_rates;

-- Create consolidated policies
-- SELECT: Anyone can view (no need for separate admin check since true covers all)
CREATE POLICY "Anyone can view exchange rates"
ON exchange_rates FOR SELECT
TO public
USING (true);

-- INSERT, UPDATE, DELETE: Only admins
CREATE POLICY "Admins can manage exchange rates"
ON exchange_rates FOR ALL
TO public
USING (is_admin((SELECT auth.uid())))
WITH CHECK (is_admin((SELECT auth.uid())));

-- ============================================================================
-- submissions TABLE
-- ============================================================================

-- Drop existing overlapping SELECT policies
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON submissions;

-- Create consolidated SELECT policy
CREATE POLICY "Users can view own or admin can view all"
ON submissions FOR SELECT
TO public
USING (
  is_admin((SELECT auth.uid()))
  OR submitter_user_id = (SELECT auth.uid())
  OR submitter_email = (SELECT auth.email())
);

-- Drop existing overlapping UPDATE policies
DROP POLICY IF EXISTS "Admins can update submissions" ON submissions;
DROP POLICY IF EXISTS "Users can update own pending submissions" ON submissions;

-- Create consolidated UPDATE policy
CREATE POLICY "Admins can update all or users can update own pending"
ON submissions FOR UPDATE
TO public
USING (
  is_admin((SELECT auth.uid()))
  OR (submitter_user_id = (SELECT auth.uid()) AND status = 'pending')
)
WITH CHECK (
  is_admin((SELECT auth.uid()))
  OR (submitter_user_id = (SELECT auth.uid()) AND status = 'pending')
);

-- ============================================================================
-- NOTES
-- ============================================================================
-- This migration consolidates multiple permissive policies into single policies
-- Performance improvement: Instead of evaluating 2+ policies per query, now only 1
-- The OR conditions within a single policy are more efficient than multiple policies
