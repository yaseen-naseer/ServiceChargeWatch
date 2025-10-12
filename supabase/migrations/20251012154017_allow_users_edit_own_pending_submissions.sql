-- Allow users to update their own pending submissions
CREATE POLICY "Users can update own pending submissions"
ON submissions FOR UPDATE
TO public
USING (
  submitter_user_id = (SELECT auth.uid())
  AND status = 'pending'
)
WITH CHECK (
  submitter_user_id = (SELECT auth.uid())
  AND status = 'pending'
);

-- Allow users to delete their own pending submissions
CREATE POLICY "Users can delete own pending submissions"
ON submissions FOR DELETE
TO public
USING (
  submitter_user_id = (SELECT auth.uid())
  AND status = 'pending'
);
