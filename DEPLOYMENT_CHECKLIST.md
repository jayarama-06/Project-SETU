# ✅ SETU Deployment Checklist

**Use this checklist to ensure your SETU deployment is production-ready**

---

## 🔐 Security & Access Control

### Row Level Security (RLS)
- [ ] **RLS enabled on ALL 7 core tables** (run `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Verify in Table Editor: NO tables show "UNPROTECTED"
- [ ] Run RLS verification query:
  ```sql
  SELECT tablename, rowsecurity as rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('schools', 'users', 'issues', 'issue_audit_log', 'notifications', 'bypass_reports', 'escalation_config');
  ```
- [ ] All results should show `rls_enabled = true`

### RLS Policies
- [ ] Deployed `/supabase/rls_policies.sql` successfully
- [ ] Schools: District boundaries enforced
- [ ] Users: Self-update only (language preference)
- [ ] Issues: School staff see own school only
- [ ] Issues: District officials see own district only
- [ ] Issues: State admins see all
- [ ] Audit log: Append-only, no updates/deletes
- [ ] Bypass reports: Invisible to district officials

### Authentication
- [ ] Email provider enabled (Authentication → Providers)
- [ ] Test user created in auth.users
- [ ] Test user exists in public.users table
- [ ] User IDs match between auth.users and public.users
- [ ] Can log in with test credentials
- [ ] JWT tokens working (check browser DevTools → Application → Local Storage)

### Environment Variables
- [ ] `.env.local` created (NOT committed to git)
- [ ] `VITE_SUPABASE_URL` set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` set correctly
- [ ] ⚠️ **Service role key NEVER in frontend code**
- [ ] Dev server restarted after creating .env.local

---

## 🗄️ Database

### Schema Deployment
- [ ] `/supabase/schema.sql` executed successfully
- [ ] All 7 tables created: schools, users, issues, issue_audit_log, notifications, bypass_reports, escalation_config
- [ ] All ENUMs created: user_role, issue_category, self_urgency, issue_status, urgency_level, action_type, notification_type
- [ ] All indexes created (check with `\di` in psql or Database → Indexes)
- [ ] All triggers created: prevent_issue_deletion, prevent_audit_deletion, enforce_edit_window
- [ ] All functions created: get_issue_display_id, can_edit_issue, calculate_priority_score
- [ ] View created: issue_queue

### Test Data (Development Only)
- [ ] `/supabase/seed.sql` executed (skip in production!)
- [ ] 5 demo schools created
- [ ] 15 demo users created (various roles)
- [ ] 8 demo issues created
- [ ] Can query test data: `SELECT * FROM issues LIMIT 5;`

### Data Integrity
- [ ] Test 2-hour edit window:
  ```sql
  -- Try updating old issue (should fail)
  UPDATE issues SET title = 'Test' WHERE created_at < NOW() - INTERVAL '2 hours';
  ```
- [ ] Test audit log immutability:
  ```sql
  -- Try deleting audit log (should fail)
  DELETE FROM issue_audit_log WHERE id = 'any-id';
  ```
- [ ] Test escalation config:
  ```sql
  SELECT * FROM escalation_config ORDER BY escalation_level;
  -- Should return 5 rows (L0-L4)
  ```

---

## 📂 Storage

### Bucket Configuration
- [ ] Bucket `issue-attachments` created
- [ ] Bucket is **PRIVATE** (not public)
- [ ] File size limit: 5 MB
- [ ] Allowed MIME types: `image/*, audio/*`

### Storage Policies
- [ ] Upload policy created (INSERT for authenticated users)
- [ ] Read policy created (SELECT for authenticated users)
- [ ] Test file upload (try uploading an image via frontend)
- [ ] Test file access (ensure uploaded files are accessible)
- [ ] Verify policy SQL:
  ```sql
  SELECT * FROM pg_policies WHERE schemaname = 'storage';
  ```

---

## ⚡ Edge Functions (Optional - Advanced)

### score-issue Function
- [ ] Function code deployed: `supabase functions deploy score-issue`
- [ ] Webhook configured (Database → Webhooks)
  - Table: `issues`
  - Events: `INSERT`
  - URL: `https://your-project.supabase.co/functions/v1/score-issue`
  - Headers: `{"Authorization": "Bearer SERVICE_ROLE_KEY"}`
- [ ] Test webhook: Create new issue and verify `ai_urgency_score` is calculated
- [ ] Check function logs for errors

### auto-escalate Function
- [ ] Function code deployed: `supabase functions deploy auto-escalate`
- [ ] Cron job scheduled (via pg_cron):
  ```sql
  SELECT cron.schedule(
    'auto-escalate-issues',
    '0 */6 * * *',  -- Every 6 hours
    $$ ... $$
  );
  ```
- [ ] Verify cron job exists: `SELECT * FROM cron.job;`
- [ ] Check cron run history: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`
- [ ] Test manual run (call function via REST)

---

## 🌐 Frontend

### Connection Test
- [ ] Run `npm install` (dependencies installed)
- [ ] Run `npm run dev` (server starts)
- [ ] Open browser console (F12)
- [ ] See: `✅ Supabase client initialized successfully`
- [ ] No CORS errors in Network tab
- [ ] No 401/403 errors in Network tab

### Functionality Test
- [ ] Login works (test user can authenticate)
- [ ] Dashboard loads (shows issues list)
- [ ] Create issue works (new issue appears in database)
- [ ] View issue detail works (can see full issue info)
- [ ] Status updates work (can change issue status)
- [ ] File upload works (can attach photos)
- [ ] Real-time updates work (changes reflect immediately)
- [ ] Notifications work (alerts appear for actions)

### Browser Test
Run in these browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### Performance Test
- [ ] Page load time < 3 seconds
- [ ] Issue list renders smoothly (100+ issues)
- [ ] Search/filter is responsive
- [ ] No memory leaks (check DevTools → Memory)

---

## 🎯 Role-Based Access Test

### School Staff
- [ ] Can only see issues from their own school
- [ ] Can create new issues
- [ ] Can edit own issues (within 2 hours)
- [ ] Cannot edit other staff's issues
- [ ] Cannot delete issues
- [ ] Cannot see other schools' data

### Principal
- [ ] Can see all issues from their school
- [ ] Can endorse issues (+10 urgency points)
- [ ] Can add comments
- [ ] Cannot assign to district officials
- [ ] Cannot see other schools

### District Official
- [ ] Can see all issues in their district
- [ ] Can assign issues
- [ ] Can change status
- [ ] Cannot see bypass reports
- [ ] Cannot see other districts

### State Admin
- [ ] Can see ALL issues statewide
- [ ] Can see bypass reports
- [ ] Can manually adjust urgency scores
- [ ] Can flag critical issues
- [ ] Full dashboard access

---

## 🚀 Production Deployment

### Pre-Production
- [ ] All tests passed
- [ ] No console errors
- [ ] No security vulnerabilities (run `npm audit`)
- [ ] Environment set to `production` in .env.local
- [ ] Test data removed (run cleanup script)
- [ ] Real school data imported

### Build & Deploy
- [ ] Run `npm run build` (production build succeeds)
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy to hosting (Vercel/Netlify/etc.)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (HTTPS)

### Post-Deployment
- [ ] Production site loads correctly
- [ ] All API calls use production Supabase URL
- [ ] No hardcoded localhost references
- [ ] Analytics configured (optional)
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Backup strategy in place

---

## 📊 Monitoring & Alerts

### Supabase Dashboard
- [ ] Check Database → Logs (no critical errors)
- [ ] Check Auth → Logs (login activity normal)
- [ ] Check Storage → Usage (within limits)
- [ ] Check Edge Functions → Logs (no errors)
- [ ] Enable email alerts for critical events

### Performance Monitoring
- [ ] Database queries optimized (use EXPLAIN ANALYZE)
- [ ] Indexes used correctly (check query plans)
- [ ] Connection pooling enabled (PgBouncer)
- [ ] Slow query alerts configured

### Security Monitoring
- [ ] Failed login attempts tracked
- [ ] Suspicious activity alerts
- [ ] RLS policy violations logged
- [ ] Regular security audits scheduled

---

## 📝 Documentation

### User Documentation
- [ ] User manual created (for staff/principals)
- [ ] Admin guide created (for RCOs)
- [ ] FAQ document prepared
- [ ] Training materials ready
- [ ] Video tutorials recorded (optional)

### Technical Documentation
- [ ] README.md complete
- [ ] API documentation (if exposing APIs)
- [ ] Database schema documented
- [ ] Deployment guide finalized
- [ ] Troubleshooting guide available

### Legal & Compliance
- [ ] Privacy policy created
- [ ] Terms of service drafted
- [ ] Data retention policy defined
- [ ] GDPR compliance checked (if applicable)
- [ ] Accessibility compliance (WCAG 2.1)

---

## 🔄 Backup & Recovery

### Database Backups
- [ ] Automatic daily backups enabled (Supabase)
- [ ] Point-in-time recovery (PITR) enabled
- [ ] Backup retention policy: 7 days minimum
- [ ] Test restore from backup (verify integrity)

### Disaster Recovery Plan
- [ ] RTO (Recovery Time Objective) defined
- [ ] RPO (Recovery Point Objective) defined
- [ ] Recovery procedures documented
- [ ] Backup Supabase project (optional)

---

## 🎓 Training & Onboarding

### Staff Training
- [ ] School staff trained on mobile interface
- [ ] Principals trained on endorsement workflow
- [ ] District officials trained on dashboard
- [ ] State admins trained on full system

### Support
- [ ] Support email/phone set up
- [ ] Issue tracking system for bugs
- [ ] Escalation procedure for critical issues
- [ ] Regular office hours scheduled

---

## ✅ Final Checks

Before going live:

- [ ] **Security audit passed** (all RLS policies active)
- [ ] **Performance tested** (handles expected load)
- [ ] **User acceptance testing** (UAT) completed
- [ ] **Backup verified** (can restore from backup)
- [ ] **Monitoring active** (alerts configured)
- [ ] **Documentation complete** (guides available)
- [ ] **Training done** (users know how to use system)
- [ ] **Support ready** (team available for issues)

---

## 🎉 Launch Day

- [ ] Announce to all stakeholders
- [ ] Monitor closely for first 24 hours
- [ ] Be ready for quick fixes
- [ ] Gather user feedback
- [ ] Celebrate! 🎊

---

**Status: Ready for Production ✅**

*Last updated: March 15, 2026*  
*SETU - Smart Escalation & Tracking Utility*
