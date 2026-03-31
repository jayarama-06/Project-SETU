# SETU — Smart Escalation & Tracking Utility

> *"A digital bridge between our schools and our officials."*


SETU is an open-source, AI-assisted grievance reporting and escalation management system built for [TGTWREIS](https://tgtwreis.telangana.gov.in) Gurukulam schools — government-run tribal welfare residential institutions in Telangana, India. It replaces a broken, paper-based communication chain with a structured, trackable digital platform so that no school-level issue is ever lost, buried, or forgotten.

Built as a FOSS Hack 2026 submission and grounded in real stakeholder field research with headmasters, teachers, wardens, and district officials across TGTWREIS institutions.

---

## Table of Contents

- [The Problem](#the-problem)
- [What SETU Does](#what-setu-does)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker](#running-with-docker)
  - [Manual Setup](#manual-setup)
- [Usage](#usage)
- [Priority & Escalation System](#priority--escalation-system)
- [Safeguards Against Misuse](#safeguards-against-misuse)
- [Project Structure](#project-structure)
- [Field Research](#field-research)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [About the Creator](#about-the-creator)

---

## The Problem

Gurukulam schools are residential institutions housing thousands of students from tribal and marginalized communities. When something goes wrong — a broken water pump, a damaged dormitory roof, an emergency fund request — the process of getting it resolved looks like this:

```
School fills paper form
  → Local officer
    → District office
      → Regional office
        → State (if it ever arrives)
          → Response travels back the same long chain
```

**Result:** Weeks become months. Papers get lost. No one knows where the report is. Students suffer the consequences.

SETU replaces this with:

```
School submits issue on SETU (2 minutes)
  → Right official notified immediately
    → School tracks status in real time
      → No action within defined window → automatic escalation
        → Every issue has a permanent digital record
```

---

## What SETU Does

| Without SETU | With SETU |
|---|---|
| Paper forms lost in transit | Every report has a permanent, tamper-proof digital record |
| No way to know if anyone read it | Real-time status tracking for every report |
| Urgency lost in transmission | AI-assisted urgency classification on submission |
| Issues resolve in months | Automated escalation ladder with defined SLA windows |
| No institutional overview | Per-school health profiles for officials |
| Officials can bury issues | Cross-hierarchy visibility — nothing hidden from higher authorities |

---

## Features

### Issue Reporting
School staff submit structured reports through a simple web form — category (water, electricity, infrastructure, safety, funds, other), free-text description, and photo attachments. Reports are immediately logged with a permanent, unique ID.

### AI-Assisted Urgency Classification
On submission, a keyword-based AI algorithm automatically assigns an urgency level (Critical / High / Medium / Low) and category tag. Safety-related keywords trigger immediate authority notification. All classifications are visible and manually overridable — no black box.

### Weighted Priority Dashboard
Officials see all issues ranked by a composite priority score — not AI classification alone. The score accounts for issue age, time stagnating at a stage, manual intervention flags, and recurrence. Older unresolved issues continuously accrue weight, so nothing is buried by a wave of new reports.

### Institutional Profiles
Each school has an auto-generated summary of open issues by category, historical resolution rates, and recurring problem patterns — a data-driven overview without waiting for manual inspections.

### Real-Time Status Tracking
School staff track every submitted issue exactly like tracking a courier — who saw it, when, and what action was taken. The feedback loop entirely absent in the paper-based system is now closed.

### Human-First Escalation Ladder
A five-stage escalation system (L0–L4) that always gives officials the first opportunity to act. Automated escalation is the last resort — only triggered after every human-opportunity stage has been attempted and failed.

### Role-Based Access Control
Three-tier role hierarchy: **School Staff** (reporters) → **District Officials** (reviewers) → **State Admins** (full access). JWT-based authentication. Full audit log of every action across all roles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) + TypeScript |
| UI Components | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 |
| Auth | JWT + bcrypt |
| Deployment | Docker + Docker Compose |

No proprietary APIs. No closed external services required to run SETU.

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) — recommended
- Or: Node.js v18+, PostgreSQL 16+

### Running with Docker

```bash
# 1. Clone the repository
git clone https://github.com/jayarama-06/Project-SETU.git
cd Project-SETU

# 2. Set up backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# 3. Start all services
docker-compose up --build
```

Services started:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

**Required environment variables (`backend/.env`):**

```env
DATABASE_URL=postgresql://setu_user:setu_dev_password@db:5432/setu
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

### Manual Setup

```bash
# Terminal 1 — Backend
cd backend
npm install
npx prisma migrate deploy
npm run dev          # http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev          # http://localhost:3000
```

---

## Usage

### School Staff — Submitting an Issue

1. Log in with your school credentials at `http://localhost:3000`
2. Click **Report New Issue** and select a category
3. Describe the problem and attach a photo if available
4. Submit — urgency is classified automatically and the right official is notified
5. Track your report's status anytime under **My Issues**

### District Officials — Reviewing Issues

1. Log in to the authority dashboard
2. Issues are ranked by composite priority — most critical and most overdue at the top
3. Acknowledge → Assign → Update Status → Resolve
4. Use **Flag for Urgent Intervention** to escalate any issue directly to state admins, with your name and reason permanently recorded

### State Admins — Full Oversight

- **Intervention Requested** panel: issues personally flagged by district officials
- **All Issues** view: full cross-school, cross-district visibility regardless of district-level actions
- **Official Accountability Dashboard**: response times, pending counts, escalation rates, and disputed resolutions per official

---

## Priority & Escalation System

### Weighted Priority Score

Issues are ranked by a composite score. All components are visible in the issue detail view — no black box.

| Signal | Max Points | How It Works |
|---|---|---|
| AI Urgency Classification | 30 pts | Critical=30, High=20, Medium=10, Low=5. Capped so AI alone never dominates. |
| Time in System (Age) | 40 pts | +2 pts per 24 hours unresolved. A 20-day-old issue always outranks a brand-new Critical. |
| Stage Stagnation | 20 pts | Points added for time stuck at the same status. Resets on change. |
| Manual Intervention Flag | 25 pts flat | Set by a district official. Immutable once applied. |
| Recurrence Bonus | 10 pts | +5 pts per recurrence if the same school reports the same category twice within 60 days. |
| Safety Keywords | 15 pts flat | Triggered when AI detects harm/danger/injury/missing language. |

**Anti-starvation guarantee:** Age and stagnation factors ensure no issue can be continuously displaced by newer arrivals. A neglected Medium issue will always trend above a fresh Critical over time.

### Escalation Ladder

| Stage | Trigger | Action |
|---|---|---|
| **L0 — Nudge 1** | Unacknowledged: 24h (Critical) / 48h (High) / 72h (Medium) | In-app + email reminder to assigned official |
| **L1 — Nudge 2** | Still unacknowledged 24h after L0 | Second notification with urgency context |
| **L2 — Peer Alert** | Still unacknowledged 24h after L1 | Supervisor notified; school advised to contact directly |
| **L3 — Human Escalation** | Still unacknowledged 48h after L2 | Escalation request surfaces to State Admin — human must act |
| **L4 — Auto Escalation** | State Admin has not acted on L3 within 48h | Issue pushed to full state-level queue; all state admins notified |

L4 triggers only if L0–L3 have all been attempted and failed. The complete nudge history is permanently logged — no official can claim they never received a notification.

---

## Safeguards Against Misuse

| Safeguard | What It Does |
|---|---|
| **Immutable Issue Record** | Original description, photos, and metadata are permanently locked. Officials may only append notes — never edit or delete originals. |
| **Mandatory Resolution Justification** | Every closure requires a written reason. Schools are notified and have 72 hours to dispute. Disputed issues are automatically re-opened. |
| **No Downgrade Without Audit** | District officials cannot reduce AI urgency classifications. Only state admins can, with a mandatory written reason visible to all parties. |
| **Cross-Hierarchy Visibility** | State admins see all issues at all levels, including those not yet manually escalated. |
| **Anonymous Bypass Report** | If a headmaster believes an issue is being suppressed at district level, they can submit a bypass report directly to state admins only. Reporter identity is not visible to district officials. |
| **Official Accountability Dashboard** | State admins see response time, pending count, escalation rate, and disputed resolutions per official — making patterns of inaction visible systemically. |

---

## Project Structure

```
Project-SETU/
├── frontend/               # Next.js + TypeScript frontend
│   ├── app/                # App router pages
│   ├── components/         # Reusable UI components
│   └── lib/                # API client, auth helpers
├── backend/                # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/      # Auth, role validation
│   │   ├── services/        # Business logic, AI classification
│   │   └── jobs/           # Scheduled escalation tasks
│   └── prisma/             # DB schema and migrations
├── docs/
│   └── field-research/     # Stakeholder interviews and questionnaires
├── docker-compose.yml      # 3-service stack: frontend, backend, db
├── .gitignore
└── LICENSE
```

---

## Field Research

SETU is not built on assumptions. The design is grounded in direct stakeholder research conducted with headmasters, teachers, wardens, and district officials across TGTWREIS Gurukulam institutions.

Research artifacts are in [`docs/field-research/`](https://github.com/jayarama-06/Project-SETU/tree/main/docs/field-research), including:

- **Interviewer Guide** — structured interview protocol used with headmasters and officials
- **Staff Questionnaire** — written survey distributed to school staff
- **Briefing Report** — plain-language SETU overview shared with stakeholders before interviews

---

## Roadmap

**MVP — Completed (FOSS Hack 2026, March 2026)**
- [x] Issue reporting with category and photo attachment
- [x] AI-assisted urgency classification
- [x] Weighted priority scoring with anti-starvation guarantee
- [x] Role-based access control (3-tier)
- [x] Real-time status tracking
- [x] Human-first escalation ladder (L0–L4)
- [x] Anti-manipulation safeguards
- [x] Docker-based deployment

**Pilot Phase — August–November 2026 (Millennium Fellowship)**
- [ ] Deploy in 3–6 TGTWREIS Gurukulam schools
- [ ] Track 20+ real institutional issues through the system
- [ ] Before/after staff interviews measuring response time improvement
- [ ] Offline-first PWA support for low-connectivity schools

**Phase 2**
- [ ] Telugu language localisation
- [ ] WhatsApp / Telegram bot for issue reporting
- [ ] Integration with TGTWREIS administrative systems
- [ ] Analytics and policy-maker reporting module

---

## Contributing

Contributions are welcome from developers, designers, translators, and researchers.

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/Project-SETU.git
cd Project-SETU
git checkout -b feature/your-feature-name
```

Please open an [issue](https://github.com/jayarama-06/Project-SETU/issues) before starting significant work. All commits should follow [Conventional Commits](https://www.conventionalcommits.org/).

**Priority contribution areas:**
- Telugu localisation (Phase 2)
- Offline / PWA support for rural connectivity
- Accessibility improvements (WCAG 2.1 AA)
- Mobile UI improvements for low-literacy users

---

## License

Released under the [MIT License](https://github.com/jayarama-06/Project-SETU/blob/main/LICENSE).

---

## About the Creator

**Akulapalli Jayaram** spent nearly eight years living and studying full-time in a TGTWREIS Gurukulam (TGTWURJC DVK). SETU is built from that lived experience — not from assumptions.

> *"I did not build SETU because I think the people in Gurukulam institutions are failing. I built it because I know they are not — and yet the system around them keeps failing them."*

**B.Tech Artificial Intelligence, SAI University, Chennai**
📧 a.jairam1206@gmail.com · 📞 +91 7569913305

---

*SETU — Smart Escalation & Tracking Utility | FOSS Hack 2026 | Millennium Fellowship 2026 | MIT License | SDG 4*
