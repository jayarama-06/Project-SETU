# Database Schema
PostgreSQL 16. All tables use UUID primary keys.
## Tables
| Table | Purpose |
|-------|---------|
| states, regions, districts | Geographic hierarchy |
| schools | Each TGTWREIS institution |
| users | All accounts (staff, officials, admins) |
| sessions | JWT session store |
| issues | Core issue records (immutable after 2hr) |
| issue_attachments | Photos/docs attached to issues |
| issue_history | Append-only audit log — every action |
| comments | Discussion threads on issues |
| escalation_log | Every escalation event |
| notifications | Generated notification records |
| notification_queue | Outbound email delivery queue |
| priority_score_log | History of every score calculation |
| bypass_reports | Anonymous direct reports (encrypted) |
| recurrence_patterns | Category frequency per school |
| school_health_snapshots | Daily school health metrics |
| cron_job_log | Background job execution history |
Full column-level schema: see backend/src/db/migrations/
