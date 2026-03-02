# Background Jobs
All jobs run via node-cron on the same server as the application.
## Job 1 — Priority Score Recalculator
- Schedule: Every 6 hours (0:00, 6:00, 12:00, 18:00 IST)
- Action: Recomputes composite priority score for all open issues
- Failure: Logs to cron_job_log, next run retries
## Job 2 — Escalation Ladder Monitor
- Schedule: Every 1 hour
- Action: Checks if any issue has crossed time threshold for next
escalation level
- Idempotent: Checks escalation_log before creating a new escalation
event
## Job 3 — Notification Queue Worker
- Schedule: Every 5 minutes
- Action: Sends pending emails via Nodemailer/SMTP
- Retry: Up to 3 attempts before marking failed
## Job 4 — Recurrence Pattern Analyser
- Schedule: Daily at 2:00 AM IST
- Action: Counts issues per category per school in last 60 days
## Job 5 — Institutional Health Snapshot
- Schedule: Daily at 3:00 AM IST
- Action: Computes health score for each school, writes daily snapshot
row
