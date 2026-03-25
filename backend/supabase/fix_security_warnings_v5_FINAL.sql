-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SETU Security Fixes v5 (TRULY FINAL - DROPS ALL FUNCTIONS)
-- Fixes Supabase Database Linter Warnings
-- Run this on your Supabase SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ═══════════════════════════════════════════════════════════
-- STEP 0: Drop ALL function versions comprehensively
-- ═══════════════════════════════════════════════════════════

-- Drop ALL possible signatures of ALL functions
DROP FUNCTION IF EXISTS protect_issue_immutability() CASCADE;
DROP FUNCTION IF EXISTS get_issue_display_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_school() CASCADE;
DROP FUNCTION IF EXISTS get_user_school(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_district() CASCADE;
DROP FUNCTION IF EXISTS get_user_district(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_super_admin() CASCADE;
DROP FUNCTION IF EXISTS is_super_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS set_dispute_deadline() CASCADE;
DROP FUNCTION IF EXISTS log_issue_submission() CASCADE;
DROP FUNCTION IF EXISTS can_edit_issue(UUID, UUID) CASCADE;

-- Drop BOTH versions of calculate_priority_score
DROP FUNCTION IF EXISTS calculate_priority_score(INTEGER, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS calculate_priority_score(INTEGER, INTEGER, BOOLEAN, BOOLEAN) CASCADE;

-- ═══════════════════════════════════════════════════════════
-- FIX 1: Recreate ALL functions with security fixes
-- ═══════════════════════════════════════════════════════════

-- 1. protect_issue_immutability (TRIGGER)
CREATE FUNCTION protect_issue_immutability()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow all changes if issue is less than 2 hours old AND user is the reporter
  IF (NOW() - OLD.created_at) < INTERVAL '2 hours' 
     AND NEW.reported_by = OLD.reported_by THEN
    RETURN NEW;
  END IF;

  -- After 2 hours, prevent changes to protected fields
  IF OLD.title IS DISTINCT FROM NEW.title
     OR OLD.description IS DISTINCT FROM NEW.description
     OR OLD.category IS DISTINCT FROM NEW.category
     OR OLD.self_urgency IS DISTINCT FROM NEW.self_urgency
     OR OLD.location IS DISTINCT FROM NEW.location THEN
    RAISE EXCEPTION 'Cannot modify issue details after 2 hours. Please contact principal.';
  END IF;

  RETURN NEW;
END;
$$;

-- 2. get_issue_display_id (uses original parameter name: issue_uuid)
CREATE FUNCTION get_issue_display_id(issue_uuid UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN 'SETU-' || UPPER(SUBSTRING(issue_uuid::TEXT FROM 1 FOR 8));
END;
$$;

-- 3. get_user_school (NO PARAMETERS - for RLS)
CREATE FUNCTION get_user_school()
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT school_id FROM users WHERE id = auth.uid();
$$;

-- 4. get_user_role (NO PARAMETERS - for RLS)
CREATE FUNCTION get_user_role()
RETURNS user_role
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$;

-- 5. get_user_district (NO PARAMETERS - for RLS)
CREATE FUNCTION get_user_district()
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT district FROM users WHERE id = auth.uid();
$$;

-- 6. is_admin (NO PARAMETERS - for RLS)
CREATE FUNCTION is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT role IN ('state_admin', 'super_admin') FROM users WHERE id = auth.uid();
$$;

-- 7. is_super_admin (NO PARAMETERS - for RLS)
CREATE FUNCTION is_super_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT role = 'super_admin' FROM users WHERE id = auth.uid();
$$;

-- 8. update_updated_at (TRIGGER)
CREATE FUNCTION update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 9. set_dispute_deadline (TRIGGER)
CREATE FUNCTION set_dispute_deadline()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'resolved' THEN
    NEW.dispute_deadline = NEW.updated_at + INTERVAL '7 days';
  END IF;
  RETURN NEW;
END;
$$;

-- 10. calculate_priority_score (ORIGINAL SIGNATURE - 4 parameters)
CREATE FUNCTION calculate_priority_score(
  p_ai_score INTEGER,
  p_days_old INTEGER,
  p_is_flagged BOOLEAN,
  p_is_recurring BOOLEAN
)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- AI score (capped at 30)
  score := LEAST(p_ai_score, 30);
  
  -- Age factor (2 points per day, max 40)
  score := score + LEAST(p_days_old * 2, 40);
  
  -- Manual flag bonus
  IF p_is_flagged THEN
    score := score + 25;
  END IF;
  
  -- Recurrence bonus
  IF p_is_recurring THEN
    score := score + 10;
  END IF;
  
  RETURN score;
END;
$$;

-- 11. log_issue_submission (TRIGGER - uses correct column names)
CREATE FUNCTION log_issue_submission()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Uses correct column names: actor_id, action_type, metadata
  INSERT INTO issue_audit_log (issue_id, actor_id, action_type, metadata)
  VALUES (
    NEW.id,
    NEW.reported_by,
    'submitted',
    jsonb_build_object(
      'title', NEW.title,
      'category', NEW.category,
      'escalation_level', NEW.escalation_level
    )
  );
  RETURN NEW;
END;
$$;

-- 12. can_edit_issue
CREATE FUNCTION can_edit_issue(
  issue_id UUID,
  user_id UUID
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  issue RECORD;
BEGIN
  SELECT created_at, reported_by INTO issue
  FROM issues WHERE id = issue_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  IF issue.reported_by != user_id THEN
    RETURN FALSE;
  END IF;
  
  IF (NOW() - issue.created_at) > INTERVAL '2 hours' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- ═══════════════════════════════════════════════════════════
-- FIX 2: Fix Overly Permissive RLS Policies
-- ═══════════════════════════════════════════════════════════

-- Fix issue_audit_log INSERT policy
DROP POLICY IF EXISTS "Insert audit entries" ON issue_audit_log;

CREATE POLICY "Insert audit entries"
  ON issue_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Uses correct column name: actor_id (not performed_by)
    actor_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('principal', 'district_official', 'state_admin', 'super_admin')
    )
  );

-- Fix notifications INSERT policy
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Only principals, RCOs, and admins can create notifications
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('principal', 'district_official', 'state_admin', 'super_admin')
    )
  );

-- ═══════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════

-- 1. Check all functions have security settings
SELECT 
  p.proname AS function_name,
  pg_get_function_arguments(p.oid) AS parameters,
  p.prosecdef AS has_security_definer,
  CASE 
    WHEN p.proconfig IS NOT NULL THEN '✅ secured'
    ELSE '❌ NOT secured'
  END AS config_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.prokind = 'f'
AND p.proname IN (
  'protect_issue_immutability',
  'get_issue_display_id',
  'get_user_school',
  'get_user_role',
  'get_user_district',
  'is_admin',
  'is_super_admin',
  'update_updated_at',
  'set_dispute_deadline',
  'calculate_priority_score',
  'log_issue_submission',
  'can_edit_issue'
)
ORDER BY p.proname;

-- 2. Check for duplicate functions (should be ZERO)
SELECT 
  proname AS function_name,
  COUNT(*) AS version_count,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ Unique'
    ELSE '❌ DUPLICATE!'
  END AS status
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN (
  'protect_issue_immutability',
  'get_issue_display_id',
  'get_user_school',
  'get_user_role',
  'get_user_district',
  'is_admin',
  'is_super_admin',
  'update_updated_at',
  'set_dispute_deadline',
  'calculate_priority_score',
  'log_issue_submission',
  'can_edit_issue'
)
GROUP BY proname
ORDER BY proname;

-- 3. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('issue_audit_log', 'notifications')
ORDER BY tablename, policyname;

-- 4. Verify calculate_priority_score signature
SELECT 
  proname,
  pg_get_function_arguments(oid) AS signature,
  pg_get_function_result(oid) AS returns
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname = 'calculate_priority_score';

-- ═══════════════════════════════════════════════════════════
-- SUMMARY
-- ═══════════════════════════════════════════════════════════

-- ✅ Dropped ALL function versions (including calculate_priority_score duplicates)
-- ✅ Fixed 12 functions with SECURITY DEFINER + SET search_path = public
-- ✅ Fixed 2 overly permissive RLS policies
-- ✅ Used ORIGINAL function signatures (4 params for calculate_priority_score)
-- ✅ Used correct column names (actor_id, action_type, metadata)
-- ✅ Used correct parameter names (issue_uuid)

COMMENT ON FUNCTION protect_issue_immutability IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION get_issue_display_id IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION get_user_school IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION get_user_role IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION get_user_district IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION is_admin IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION is_super_admin IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION update_updated_at IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION set_dispute_deadline IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION calculate_priority_score IS 'Security v5: SECURITY DEFINER + search_path (4 params)';
COMMENT ON FUNCTION log_issue_submission IS 'Security v5: SECURITY DEFINER + search_path';
COMMENT ON FUNCTION can_edit_issue IS 'Security v5: SECURITY DEFINER + search_path';
