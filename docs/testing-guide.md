# testing guide

we should probably have automated tests but we don't lol

here's how to manually test everything

## demo accounts

**school staff:**
- email: test@setu.local
- password: Test123!@#
- goes to /login

**rco official:**  
- email: same (test@setu.local)
- password: same
- goes to /rco/login

check seed.sql for more accounts

## test checklist

### authentication

- [ ] can login with correct credentials
- [ ] wrong password shows error
- [ ] wrong email shows error  
- [ ] logout works
- [ ] session persists on refresh
- [ ] can't access protected routes when logged out
- [ ] redirects to correct dashboard based on role

### school staff dashboard

- [ ] shows school name
- [ ] shows issue count cards
- [ ] cards show correct numbers
- [ ] "report new issue" button works
- [ ] can see issue list
- [ ] can click issue to see details
- [ ] bottom nav works
- [ ] language toggle works

### reporting an issue

- [ ] step 1: category selection works
- [ ] can go back/forward  
- [ ] step 2: description field works
- [ ] character count shows
- [ ] step 3: photo upload works
- [ ] voice note recording works
- [ ] can remove attachments
- [ ] step 4: review shows everything
- [ ] submit button works
- [ ] success animation plays
- [ ] redirects to dashboard

### issue detail (staff)

- [ ] shows all issue info
- [ ] shows status chip correctly  
- [ ] shows urgency badge
- [ ] shows escalation level
- [ ] shows timeline/audit log
- [ ] can edit within 2 hours
- [ ] can't edit after 2 hours
- [ ] back button works

### principal features

- [ ] all staff features work
- [ ] can see all school issues (not just own)
- [ ] can endorse issues
- [ ] endorsement adds to urgency
- [ ] endorsed badge shows

### RCO dashboard

- [ ] login works at /rco/login
- [ ] shows summary cards with counts
- [ ] shows urgency distribution chart  
- [ ] shows priority issue queue
- [ ] sidebar navigation works
- [ ] can switch between pages

### RCO issue queue

- [ ] shows issues from district
- [ ] sorts by priority (highest first)
- [ ] shows urgency badges correctly
- [ ] shows escalation chips
- [ ] filters work (status, category, urgency)
- [ ] search works
- [ ] pagination works (if lots of issues)
- [ ] can click issue for details

### RCO issue detail

- [ ] shows full issue information  
- [ ] shows school info
- [ ] shows reporter info
- [ ] shows complete timeline
- [ ] can update status
- [ ] can assign to someone
- [ ] can add internal notes
- [ ] status updates appear in timeline
- [ ] notifications sent on update

### RCO analytics

- [ ] charts load
- [ ] data looks correct
- [ ] can filter by date range
- [ ] can filter by school
- [ ] export button works (or shows coming soon)
- [ ] fullscreen chart modal works

### RCO school directory  

- [ ] shows all schools in district
- [ ] shows school stats
- [ ] search works
- [ ] can click school to see details
- [ ] school profile modal opens

### notifications

- [ ] shows notification list
- [ ] unread count is correct  
- [ ] can mark as read
- [ ] clicking notification goes to issue
- [ ] real-time updates work (test with 2 windows)

### settings

- [ ] profile info shows correctly
- [ ] can edit profile
- [ ] can change password
- [ ] language toggle works
- [ ] logout button works

## edge cases to test

### permissions
- [ ] staff can't see other schools' issues
- [ ] officials can't modify issues they shouldn't access
- [ ] can't bypass RLS by direct supabase queries

### timing
- [ ] 2-hour edit window enforced
- [ ] auto-escalation happens (run edge function manually)
- [ ] age factor increases urgency over time

### offline
- [ ] offline banner shows when no connection
- [ ] can still view cached data
- [ ] syncs when back online (maybe, this is iffy)

### mobile
- [ ] works on 360px viewport
- [ ] tap targets are 48px minimum  
- [ ] no horizontal scroll
- [ ] bottom nav doesn't overlap content
- [ ] modals/sheets work on mobile

### data validation
- [ ] can't submit empty description
- [ ] can't select 0 students affected
- [ ] required fields enforced
- [ ] file size limit enforced (10mb)
- [ ] file type restrictions work

### error states
- [ ] network errors show message
- [ ] database errors handled gracefully  
- [ ] loading states show
- [ ] empty states show when no data

## performance checks

- [ ] dashboard loads < 2 seconds
- [ ] images load reasonably fast
- [ ] no console errors
- [ ] no console warnings (ok maybe some)
- [ ] no memory leaks (check devtools)

## browser testing

test on:
- [ ] chrome (main target)
- [ ] firefox
- [ ] safari (if you have mac)
- [ ] chrome mobile (android)
- [ ] safari mobile (ios)

## database checks

use supabase dashboard:

- [ ] issues table populated correctly
- [ ] audit_log entries created on changes
- [ ] escalations table tracks level changes
- [ ] notifications created on updates
- [ ] RLS policies enforcing correctly
- [ ] no orphaned records

## things that are known to be broken

- [ ] offline sync is sketchy
- [ ] some telugu translations missing
- [ ] search could be better  
- [ ] no tests (ironic in a testing guide)
- [ ] performance could be optimized

## quick smoke test

if you're in a hurry just do this:

1. login as staff
2. create an issue
3. check it shows on dashboard
4. logout
5. login as rco
6. check issue appears in queue
7. update status
8. check notification appears

if that works, 80% of the app probably works

---

should really automate this but manual testing caught most bugs so far
