-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SETU Database Schema
-- Smart Escalation & Tracking Utility for Tribal Welfare Schools
-- PostgreSQL Schema for Supabase
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data (future feature)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ENUMS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TYPE user_role AS ENUM (
  'school_staff',
  'principal',
  'district_official', 
  'state_admin',
  'super_admin'
);

CREATE TYPE issue_category AS ENUM (
  'water',
  'electricity',
  'building',
  'safety',
  'finance',
  'other'
);

CREATE TYPE self_urgency AS ENUM (
  'can_wait',
  'needs_attention',
  'urgent_now'
);

CREATE TYPE issue_status AS ENUM (
  'submitted',
  'acknowledged',
  'in_progress',
  'on_hold',
  'needs_info',
  'resolved',
  'dispute_filed',
  'closed'
);

CREATE TYPE urgency_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE action_type AS ENUM (
  'submitted',
  'acknowledged',
  'status_changed',
  'escalated',
  'flagged',
  'comment_added',
  'resolved',
  'disputed',
  'bypass_sent',
  'assignment_changed',
  'score_adjusted',
  'photo_added',
  'principal_endorsed'
);

CREATE TYPE notification_type AS ENUM (
  'acknowledged',
  'status_updated',
  'escalation_triggered',
  'resolution_disputed',
  'assignment',
  'comment_added',
  'system'
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: schools
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  udise_code TEXT UNIQUE NOT NULL, -- Government UDISE identifier
  district TEXT NOT NULL,
  region TEXT,
  principal_name TEXT,
  contact_phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  student_count INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8), -- For future map features
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_udise ON schools(udise_code);
CREATE INDEX idx_schools_active ON schools(is_active);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: users
-- Links to Supabase Auth (auth.users)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL, -- NULL for officials
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  district TEXT, -- For district officials - their jurisdiction
  designation TEXT, -- e.g., "Headmaster", "Warden", "District Welfare Officer"
  subject TEXT, -- For teachers
  language_pref TEXT DEFAULT 'en' CHECK (language_pref IN ('en', 'te')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_district ON users(district);
CREATE INDEX idx_users_active ON users(is_active);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: issues (CORE TABLE)
-- IMMUTABILITY RULE: title, description, category, photo_urls, created_at
-- can ONLY be edited within 2 hours of creation by the reporter
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Issue Content (Protected by 2hr edit window)
  title TEXT NOT NULL CHECK (char_length(title) >= 5),
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  category issue_category NOT NULL,
  
  -- Urgency Scoring
  self_urgency self_urgency NOT NULL,
  ai_urgency_score INTEGER DEFAULT 0 CHECK (ai_urgency_score BETWEEN 0 AND 140),
  urgency_label urgency_level DEFAULT 'low',
  
  -- Status & Escalation
  status issue_status DEFAULT 'submitted',
  escalation_level INTEGER DEFAULT 0 CHECK (escalation_level BETWEEN 0 AND 4),
  
  -- Flags
  is_urgent_flagged BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  is_principal_endorsed BOOLEAN DEFAULT FALSE,
  
  -- Media
  photo_urls TEXT[] DEFAULT '{}',
  voice_note_url TEXT,
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Resolution
  resolved_at TIMESTAMPTZ,
  dispute_deadline TIMESTAMPTZ, -- resolved_at + 72 hours
  closed_at TIMESTAMPTZ,
  
  -- Metadata
  students_affected INTEGER,
  location_within_school TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_action_at TIMESTAMPTZ DEFAULT NOW(), -- For stagnation detection
  acknowledged_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ
);

CREATE INDEX idx_issues_school ON issues(school_id);
CREATE INDEX idx_issues_reporter ON issues(reported_by);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_escalation ON issues(escalation_level);
CREATE INDEX idx_issues_urgency ON issues(ai_urgency_score DESC);
CREATE INDEX idx_issues_assigned ON issues(assigned_to);
CREATE INDEX idx_issues_created ON issues(created_at DESC);
CREATE INDEX idx_issues_urgent_flagged ON issues(is_urgent_flagged) WHERE is_urgent_flagged = TRUE;

-- Composite index for queue filtering
CREATE INDEX idx_issues_queue ON issues(status, escalation_level, ai_urgency_score DESC, created_at DESC);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: issue_audit_log (APPEND-ONLY, NEVER DELETED)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE issue_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE RESTRICT,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for system actions
  action_type action_type NOT NULL,
  old_value TEXT,
  new_value TEXT,
  note TEXT, -- Mandatory for certain actions (status changes, flags, etc.)
  metadata JSONB DEFAULT '{}', -- Extra data (e.g., escalation details, score breakdown)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_issue ON issue_audit_log(issue_id, created_at DESC);
CREATE INDEX idx_audit_actor ON issue_audit_log(actor_id);
CREATE INDEX idx_audit_action ON issue_audit_log(action_type);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: notifications
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT, -- Deep link to issue/screen
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_issue ON notifications(issue_id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: bypass_reports (STATE_ADMIN ONLY)
-- Anonymous escalation mechanism at L2+
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE bypass_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE RESTRICT,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Encrypted, not visible to district
  message TEXT NOT NULL CHECK (char_length(message) >= 20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ
);

CREATE INDEX idx_bypass_issue ON bypass_reports(issue_id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TABLE: escalation_config
-- Configurable escalation timers and thresholds
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE escalation_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level INTEGER NOT NULL UNIQUE CHECK (level BETWEEN 0 AND 4),
  name TEXT NOT NULL,
  trigger_hours INTEGER NOT NULL, -- Hours before auto-escalation
  notification_template TEXT,
  badge_color TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default escalation levels
INSERT INTO escalation_config (level, name, trigger_hours, badge_color) VALUES
  (0, 'Submitted', 24, '#9CA3AF'),
  (1, 'Acknowledged', 72, '#3B82F6'),
  (2, 'Awaiting Action', 72, '#F59E0B'),
  (3, 'State Attention', 48, '#F97316'),
  (4, 'Auto-Escalated', 0, '#EF4444');

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TRIGGERS: Auto-update timestamps
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TRIGGERS: Immutability Protection (2hr edit window)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION protect_issue_immutability()
RETURNS TRIGGER AS $$
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
     OR OLD.photo_urls IS DISTINCT FROM NEW.photo_urls THEN
    RAISE EXCEPTION 'Cannot modify issue content after 2 hours. All changes must be logged in audit trail.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_issue_immutability
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION protect_issue_immutability();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TRIGGERS: Auto-create audit log entry on issue INSERT
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION log_issue_submission()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO issue_audit_log (issue_id, actor_id, action_type, note)
  VALUES (NEW.id, NEW.reported_by, 'submitted', 'Issue created');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_log_issue_submission
  AFTER INSERT ON issues
  FOR EACH ROW
  EXECUTE FUNCTION log_issue_submission();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TRIGGERS: Auto-set dispute deadline when resolved
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION set_dispute_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
    NEW.dispute_deadline = NOW() + INTERVAL '72 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_set_dispute_deadline
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION set_dispute_deadline();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FUNCTIONS: Helper Functions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Get issue ID with SETU prefix
CREATE OR REPLACE FUNCTION get_issue_display_id(issue_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN 'SETU-' || UPPER(SUBSTRING(issue_uuid::TEXT FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Check if user can edit issue (within 2hr window)
CREATE OR REPLACE FUNCTION can_edit_issue(issue_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  issue RECORD;
BEGIN
  SELECT created_at, reported_by INTO issue
  FROM issues WHERE id = issue_id;
  
  RETURN (NOW() - issue.created_at) < INTERVAL '2 hours'
         AND issue.reported_by = user_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate composite priority score (used for sorting)
CREATE OR REPLACE FUNCTION calculate_priority_score(
  p_ai_score INTEGER,
  p_days_old INTEGER,
  p_is_flagged BOOLEAN,
  p_is_recurring BOOLEAN
)
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VIEWS: Convenience Views
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Issue queue with priority sorting
CREATE OR REPLACE VIEW issue_queue AS
SELECT 
  i.*,
  get_issue_display_id(i.id) AS display_id,
  s.name AS school_name,
  s.district AS school_district,
  u.full_name AS reporter_name,
  u.role AS reporter_role,
  a.full_name AS assigned_to_name,
  EXTRACT(DAY FROM NOW() - i.created_at)::INTEGER AS days_old,
  calculate_priority_score(
    i.ai_urgency_score,
    EXTRACT(DAY FROM NOW() - i.created_at)::INTEGER,
    i.is_urgent_flagged,
    i.is_recurring
  ) AS priority_score
FROM issues i
LEFT JOIN schools s ON i.school_id = s.id
LEFT JOIN users u ON i.reported_by = u.id
LEFT JOIN users a ON i.assigned_to = a.id
WHERE i.status NOT IN ('closed')
ORDER BY priority_score DESC, i.created_at DESC;

-- Comment: RLS policies will be added in a separate file
