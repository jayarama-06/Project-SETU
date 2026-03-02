# API Endpoints
Base URL: /api
Auth: Bearer JWT required on all routes except /auth/login and
/auth/register
## Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /auth/register | Public | Create account |
| POST | /auth/login | Public | Get JWT token |
| POST | /auth/logout | Authenticated | Invalidate session |
## Issues
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /issues | school_staff, district_official, state_admin | List
issues |
| POST | /issues/create | school_staff | Submit new issue |
| GET | /issues/:id | All roles | Issue detail + history |
| PATCH | /issues/:id/status | district_official, state_admin | Update
status |
| PATCH | /issues/:id/flag | district_official | Apply intervention
flag |
| POST | /issues/:id/bypass | school_staff | Anonymous bypass report |
## Notifications
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /notifications | Authenticated | Get user notifications |
| PATCH | /notifications/:id/read | Authenticated | Mark as read |
