-- Fix exchange_rates RLS policies
-- Issue: "FOR ALL" policy includes SELECT, causing overlap with SELECT-only policy
-- Solution: Split admin policy into separate INSERT, UPDATE, DELETE policies

-- Drop the problematic "FOR ALL" policy
DROP POLICY IF EXISTS "Admins can manage exchange rates" ON exchange_rates;

-- Create separate policies for INSERT, UPDATE, DELETE (not SELECT)
CREATE POLICY "Admins can insert exchange rates"
ON exchange_rates FOR INSERT
TO public
WITH CHECK (is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can update exchange rates"
ON exchange_rates FOR UPDATE
TO public
USING (is_admin((SELECT auth.uid())))
WITH CHECK (is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can delete exchange rates"
ON exchange_rates FOR DELETE
TO public
USING (is_admin((SELECT auth.uid())));

-- Note: "Anyone can view exchange rates" SELECT policy remains unchanged
-- This eliminates the overlap and resolves the performance warning
