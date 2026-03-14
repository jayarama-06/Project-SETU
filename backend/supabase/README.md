# SETU Supabase Backend Setup

**Smart Escalation & Tracking Utility for Tribal Welfare Schools**  
Complete backend implementation using Supabase (PostgreSQL + Edge Functions)

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Row Level Security (RLS)](#row-level-security)
4. [Edge Functions](#edge-functions)
5. [Setup Instructions](#setup-instructions)
6. [Environment Variables](#environment-variables)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (PWA)                    │
│          (Mobile Staff Interface + Desktop RCO)             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Supabase Client SDK
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                  Supabase Platform                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (with RLS)                     │   │
│  │  - schools, users, issues, audit_log                │   │
│  │  - Role-based access enforcement                    │   │
│  │  - Immutability triggers & constraints              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Edge Functions (Deno)                              │   │
│  │  - score-issue: AI urgency scoring (0-140)          │   │
│  │  - auto-escalate: Time-based escalation (cron)      │   │
│  │  - send-notification: SMS via MSG91                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Storage Buckets                                    │   │
│  │  - issue-attachments: Photos & voice notes          │   │
│  │  - Signed URLs with expiry                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Realtime Subscriptions                             │   │
│  │  - Live dashboard updates                           │   │
│  │  - Issue status changes broadcast                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `schools` | School registry | UDISE code, district, contact info |
| `users` | User accounts & roles | Links to Supabase Auth, role-based |
| `issues` | Core issue tracking | **Immutable after 2hrs**, append-only audit |
| `issue_audit_log` | Complete audit trail | **NEVER deleted**, all actions logged |
| `notifications` | In-app notifications | User-specific, real-time |
| `bypass_reports` | Anonymous escalation | **State admin only**, encrypted reporter |
| `escalation_config` | Escalation timers | Configurable L0-L4 thresholds |

### Issue States

```
FLOW: submitted → acknowledged → in_progress → resolved → closed
                                        ↓
                                   dispute_filed
```

### Escalation Levels

| Level | Name | Trigger | Badge Color |
|-------|------|---------|-------------|
| L0 | Submitted | Initial state | Grey #9CA3AF |
| L1 | Acknowledged | Official viewed | Blue #3B82F6 |
| L2 | Awaiting Action | 72hrs no progress | Amber #F59E0B |
| L3 | State Attention | Escalated to state | Orange #F97316 |
| L4 | Auto-Escalated | All channels exhausted | Red #EF4444 |

---

## 🔒 Row Level Security (RLS)

### Access Control Matrix

| Role | Can View | Can Create | Can Update | Cannot Do |
|------|----------|------------|------------|-----------|
| **school_staff** | Own school issues | Issues for own school | Own issue (2hr window) | See other schools, delete anything |
| **principal** | Own school issues | Issues for own school | Own issue (2hr window) | See other schools, modify others' issues |
| **district_official** | District issues | ❌ | District issues (status, assign) | See other districts, delete, suppress |
| **state_admin** | All issues | ❌ | All issues (status, score, assign) | Delete issues/audit, hide from view |
| **super_admin** | Everything | Users, schools | Config, users, schools | Delete audit log |

### Critical RLS Principles

1. **Never rely on frontend filtering** - RLS enforces access at DB level
2. **Immutability enforced by triggers** - 2hr edit window for reporters
3. **Audit log is append-only** - No UPDATE/DELETE policies
4. **Bypass reports invisible to district** - State admins only
5. **District officials cannot cross boundaries** - Filtered by district column

---

## ⚡ Edge Functions

### 1. `score-issue`

**Trigger:** Database webhook on `issues.INSERT`  
**Purpose:** Calculate AI urgency score (0-140) when issue is created

**Algorithm:**
```typescript
Score Components:
1. Category Weight         (0-30 pts) - safety=30, water=25, etc.
2. Student Count          (0-25 pts) - More affected = higher
3. Safety Keywords        (15 pts)   - Flat bonus if detected
4. Evidence Provided      (0-10 pts) - Photo + voice note
5. Principal Endorsement  (10 pts)   - If endorsed by principal
6. Self-Urgency Multiplier (0.7-1.3) - User's assessment
7. Recurrence Bonus       (10 pts)   - Same category in 60 days

Final = min(30, sum) * multiplier  // AI capped at 30 pts max
```

**Urgency Levels:**
- 0-39: Low (Grey)
- 40-69: Medium (Blue)
- 70-99: High (Amber)
- 100-140: Critical (Red, pulsing)

### 2. `auto-escalate`

**Trigger:** Cron job every 6 hours  
**Purpose:** Auto-escalate stagnant issues per PRD Section 9.3

**Escalation Thresholds:**

| Transition | Critical | High | Medium/Low |
|------------|----------|------|------------|
| L0 → L1 | 24 hrs | 48 hrs | 72 hrs |
| L1 → L2 | 72 hrs | 72 hrs | 72 hrs |
| L2 → L3 | 72 hrs | 72 hrs | 72 hrs |
| L3 → L4 | 48 hrs | 48 hrs | 48 hrs |

**Process:**
1. Query all issues at each level
2. Calculate hours since `last_action_at`
3. If threshold exceeded → escalate + log + notify
4. L4 triggers critical notification to ALL state admins

### 3. `send-notification` (Future)

**Trigger:** Manual or automated events  
**Purpose:** Send SMS via MSG91 for critical notifications

---

## 🚀 Setup Instructions

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- [Deno](https://deno.land/) (for local Edge Function development)
- PostgreSQL client (optional, for direct DB access)

### Step 1: Create Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your project (or create new)
supabase link --project-ref your-project-ref

# Or create a new project
supabase projects create setu-production
```

### Step 2: Run Database Migrations

```bash
# Initialize Supabase
supabase init

# Run schema migration
supabase db push

# Apply schema.sql
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/schema.sql

# Apply RLS policies
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/rls_policies.sql
```

### Step 3: Deploy Edge Functions

```bash
# Deploy score-issue function
supabase functions deploy score-issue

# Deploy auto-escalate function
supabase functions deploy auto-escalate

# Set up cron job for auto-escalate (every 6 hours)
# In Supabase Dashboard → Database → Extensions → pg_cron
# Add this SQL:
SELECT cron.schedule(
  'auto-escalate-issues',
  '0 */6 * * *',  -- Every 6 hours
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/auto-escalate',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_CRON_SECRET"}'::jsonb
  ) AS request_id;
  $$
);
```

### Step 4: Configure Storage Buckets

```bash
# Create storage bucket for issue attachments
supabase storage create issue-attachments

# Set bucket policy (public read, authenticated write)
supabase storage update issue-attachments --public false
```

In Supabase Dashboard → Storage → issue-attachments → Policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'issue-attachments');

-- Allow users to read own school's attachments
CREATE POLICY "Users can view own school attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'issue-attachments'
  AND EXISTS (
    SELECT 1 FROM issues i
    WHERE i.id::text = (storage.foldername(name))[1]
    -- Apply same visibility rules as issues table
  )
);
```

### Step 5: Enable Realtime

```bash
# Enable realtime for tables
supabase realtime enable issues
supabase realtime enable notifications
supabase realtime enable issue_audit_log
```

In Supabase Dashboard → Database → Replication:
- Enable replication for: `issues`, `notifications`, `issue_audit_log`

---

## 🔐 Environment Variables

### Supabase Dashboard

Set these in: Project Settings → API

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  # Public anon key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Service role (KEEP SECRET!)
```

### Edge Functions Secrets

```bash
# Set secrets for Edge Functions
supabase secrets set CRON_SECRET=your-random-secret-here
supabase secrets set MSG91_API_KEY=your-msg91-key  # For SMS
```

### Frontend `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🧪 Testing

### Test RLS Policies

```sql
-- Test as school staff
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub":"<school_staff_uuid>"}';

-- Try to view other school's issues (should return 0 rows)
SELECT * FROM issues WHERE school_id != get_user_school();

-- Try to delete issue (should fail)
DELETE FROM issues WHERE id = 'some-uuid';
```

### Test Edge Functions Locally

```bash
# Serve functions locally
supabase functions serve score-issue --env-file .env

# Test with curl
curl -X POST http://localhost:54321/functions/v1/score-issue \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INSERT",
    "table": "issues",
    "record": {
      "id": "test-uuid",
      "category": "safety",
      "description": "Fire hazard - broken electrical wiring",
      "self_urgency": "urgent_now",
      "students_affected": 150
    }
  }'
```

### Seed Test Data

```sql
-- Insert test school
INSERT INTO schools (name, udise_code, district) VALUES
  ('TGTWREIS Gurukulam School', 'TG001234', 'Hyderabad');

-- Insert test users
INSERT INTO users (id, school_id, role, full_name, email) VALUES
  (gen_random_uuid(), <school_id>, 'school_staff', 'Test Teacher', 'teacher@test.com'),
  (gen_random_uuid(), NULL, 'district_official', 'Test Officer', 'officer@test.com');

-- Insert test issue
INSERT INTO issues (school_id, reported_by, title, description, category, self_urgency)
VALUES (
  <school_id>,
  <reporter_id>,
  'Water supply disrupted',
  'Main water tank has been empty for 3 days affecting 200 students',
  'water',
  'urgent_now'
);
```

---

## 📦 Deployment

### Production Checklist

- [ ] Enable SSL/HTTPS (automatic with Supabase)
- [ ] Set up custom domain (optional)
- [ ] Configure JWT expiry (default 1 hour)
- [ ] Enable email confirmations for new users
- [ ] Set up database backups (automatic with Supabase)
- [ ] Configure rate limiting on Edge Functions
- [ ] Enable audit logging in Supabase Dashboard
- [ ] Set up monitoring/alerts for critical functions
- [ ] Test all RLS policies with real user roles
- [ ] Verify cron job is running (check logs)

### Monitoring

**Check Edge Function Logs:**
```bash
supabase functions logs score-issue
supabase functions logs auto-escalate
```

**Check Database Health:**
- Dashboard → Database → Statistics
- Monitor connection pool usage
- Check query performance

**Check Realtime Connections:**
- Dashboard → Database → Realtime
- Monitor active subscriptions

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

---

## 🤝 Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Review RLS policies in Database → Authentication → Policies
3. Test Edge Functions locally before deploying
4. Verify environment variables are set correctly


