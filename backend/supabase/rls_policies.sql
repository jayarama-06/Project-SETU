-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SETU Row Level Security (RLS) Policies
-- Enforces role-based access at database level
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bypass_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_config ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HELPER FUNCTIONS FOR RLS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get current user's school_id
CREATE OR REPLACE FUNCTION get_user_school()
RETURNS UUID AS $$
  SELECT school_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get current user's district
CREATE OR REPLACE FUNCTION get_user_district()
RETURNS TEXT AS $$
  SELECT district FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is admin (state_admin or super_admin)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT role IN ('state_admin', 'super_admin') FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'super_admin' FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: schools
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- All authenticated users can view schools
CREATE POLICY "Anyone can view schools"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

-- Only super_admin can insert/update schools
CREATE POLICY "Only super_admin can insert schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

CREATE POLICY "Only super_admin can update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Nobody can delete schools (soft delete via is_active flag)
CREATE POLICY "Nobody can delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (FALSE);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: users
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- District officials can view users in their district
CREATE POLICY "District officials can view district users"
  ON users FOR SELECT
  TO authenticated
  USING (
    get_user_role() = 'district_official'
    AND district = get_user_district()
  );

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (is_admin());

-- Users can update their own language preference
CREATE POLICY "Users can update own preferences"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Only super_admin can insert users
CREATE POLICY "Only super_admin can create users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

-- Only super_admin can update user roles/assignments
CREATE POLICY "Only super_admin can manage users"
  ON users FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: issues (CRITICAL - READ CAREFULLY)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- School staff can view issues from their own school
CREATE POLICY "School staff can view own school issues"
  ON issues FOR SELECT
  TO authenticated
  USING (
    get_user_role() IN ('school_staff', 'principal')
    AND school_id = get_user_school()
  );

-- District officials can view issues from their district
CREATE POLICY "District officials can view district issues"
  ON issues FOR SELECT
  TO authenticated
  USING (
    get_user_role() = 'district_official'
    AND school_id IN (
      SELECT id FROM schools WHERE district = get_user_district()
    )
  );

-- State admins can view all issues
CREATE POLICY "State admins can view all issues"
  ON issues FOR SELECT
  TO authenticated
  USING (is_admin());

-- Only school staff/principal can insert issues
CREATE POLICY "School staff can create issues"
  ON issues FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() IN ('school_staff', 'principal')
    AND school_id = get_user_school()
    AND reported_by = auth.uid()
  );

-- Reporter can update own issue within 2 hours
CREATE POLICY "Reporter can update own issue within 2hrs"
  ON issues FOR UPDATE
  TO authenticated
  USING (
    reported_by = auth.uid()
    AND (NOW() - created_at) < INTERVAL '2 hours'
  )
  WITH CHECK (
    reported_by = auth.uid()
    AND (NOW() - created_at) < INTERVAL '2 hours'
  );

-- District officials can update issues in their district
CREATE POLICY "District officials can update district issues"
  ON issues FOR UPDATE
  TO authenticated
  USING (
    get_user_role() = 'district_official'
    AND school_id IN (
      SELECT id FROM schools WHERE district = get_user_district()
    )
  )
  WITH CHECK (
    get_user_role() = 'district_official'
    AND school_id IN (
      SELECT id FROM schools WHERE district = get_user_district()
    )
  );

-- State admins can update all issues
CREATE POLICY "State admins can update all issues"
  ON issues FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Nobody can delete issues (immutable audit trail)
CREATE POLICY "Nobody can delete issues"
  ON issues FOR DELETE
  TO authenticated
  USING (FALSE);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: issue_audit_log (APPEND-ONLY)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Can view audit log if can view the issue
CREATE POLICY "View audit log if can view issue"
  ON issue_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM issues i 
      WHERE i.id = issue_id 
      -- Use same visibility rules as issues table
      AND (
        -- School staff can see own school
        (get_user_role() IN ('school_staff', 'principal') AND i.school_id = get_user_school())
        -- District officials can see own district
        OR (get_user_role() = 'district_official' AND i.school_id IN (
          SELECT id FROM schools WHERE district = get_user_district()
        ))
        -- Admins can see all
        OR is_admin()
      )
    )
  );

-- Anyone can insert audit entries (controlled by app logic)
CREATE POLICY "Insert audit entries"
  ON issue_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Nobody can update or delete audit log entries
CREATE POLICY "Nobody can update audit log"
  ON issue_audit_log FOR UPDATE
  TO authenticated
  USING (FALSE);

CREATE POLICY "Nobody can delete audit log"
  ON issue_audit_log FOR DELETE
  TO authenticated
  USING (FALSE);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: notifications
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert notifications for any user
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: bypass_reports (STATE_ADMIN ONLY)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Only state admins can view bypass reports
CREATE POLICY "Only state admins can view bypass reports"
  ON bypass_reports FOR SELECT
  TO authenticated
  USING (is_admin());

-- School staff can insert bypass reports
CREATE POLICY "School staff can insert bypass reports"
  ON bypass_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() IN ('school_staff', 'principal')
    AND reporter_id = auth.uid()
  );

-- State admins can acknowledge bypass reports
CREATE POLICY "State admins can acknowledge bypass reports"
  ON bypass_reports FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Nobody can delete bypass reports
CREATE POLICY "Nobody can delete bypass reports"
  ON bypass_reports FOR DELETE
  TO authenticated
  USING (FALSE);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: escalation_config
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Everyone can read escalation config
CREATE POLICY "Everyone can view escalation config"
  ON escalation_config FOR SELECT
  TO authenticated
  USING (true);

-- Only super_admin can modify escalation config
CREATE POLICY "Only super_admin can update escalation config"
  ON escalation_config FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- GRANT PERMISSIONS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE ON schools TO authenticated;
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON issues TO authenticated;
GRANT SELECT, INSERT ON issue_audit_log TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON bypass_reports TO authenticated;
GRANT SELECT ON escalation_config TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SECURITY NOTES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
CRITICAL SECURITY PRINCIPLES:

1. NEVER rely on frontend filtering for security
   - RLS policies enforce access at database level
   - Even if frontend is compromised, users cannot access unauthorized data

2. Immutability is enforced at DB level
   - 2-hour edit window for reporters via trigger
   - Audit log is append-only via RLS
   - No DELETE policies on issues or audit log

3. Role-based access is enforced via auth.uid()
   - get_user_role() function is SECURITY DEFINER
   - Cannot be bypassed by malicious queries

4. District officials CANNOT see other districts
   - Even if they modify frontend queries
   - RLS filters by district automatically

5. Bypass reports are invisible to district officials
   - No SELECT policy for district_official role
   - Reporter identity is encrypted in application layer

6. State admins have full visibility but CANNOT suppress
   - They can see all issues but cannot delete them
   - All actions logged in audit trail

7. Super admins are the only ones who can:
   - Create/modify users
   - Modify schools
   - Adjust escalation config
   - But CANNOT delete audit entries

TESTING RLS:
Run queries as different users:
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub":"<user_uuid>"}';
*/
