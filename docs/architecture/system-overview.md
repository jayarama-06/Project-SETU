# System Architecture Overview
## Pattern: Structured Monolith
SETU is built as a structured monolith for the beta phase.
Frontend, backend, and background jobs deploy together on one server.
## Three Layers
1. **Presentation** — Next.js 14 (React, SSR)
2. **Application** — Node.js + Express (REST API, business logic)
3. **Data** — PostgreSQL 16 (primary store)
## Background Jobs
Five scheduled jobs run via node-cron:
- Priority score recalculator (every 6 hours)
- Escalation ladder monitor (every 1 hour)
- Notification queue worker (every 5 minutes)
- Recurrence pattern analyser (daily 2am)
- School health snapshot (daily 3am)
See [background-jobs.md](background-jobs.md) for details.
