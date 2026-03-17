# database security notes

keeping track of RLS policies bc there's like 50+ and i keep forgetting what they do

## what even is RLS

row level security = postgres checks permissions on EVERY query at the database level. not in code, in the actual db. pretty neat

so even if someone bypasses the frontend they still can't access shit they shouldn't

## our tables

### schools table
- anyone can read basic school info
- only admins can modify
- pretty straightforward

### users table  
- users can see their own profile
- rco officials can see users in their district
- state admins see everyone
- nobody can change their own role (nice try)

### issues table
**this one's complicated**

SELECT:
- staff can see issues from their school
- principals can see all issues from their school  
- district officials see their district
- state admins see everything

INSERT:
- any authenticated school staff can create
- needs valid school_id that matches their profile

UPDATE:
- creator can edit for 2hrs after creation
- after that it's immutable (enforced by trigger too)
- officials can update status/assignment but not description

DELETE:
- lol no. nobody deletes. audit trail is sacred

### audit_log table
- append only
- everyone can read their relevant logs
- insert happens via trigger automatically
- seriously don't try to delete from this

### escalations table
- tracks when issues get bumped up
- auto-inserted by the escalation function
- read access based on role
- no manual edits

### notifications table
- users see their own notifications
- insert via trigger when issue updates
- can mark as read but not delete

### assignments table
- officials see issues assigned to them
- their boss can assign/unassign
- no self-assignment (prevents cherry picking easy issues)

## policies that took forever to debug

1. **the cascade issue** - had to make sure when an issue updates it triggers audit log which triggers notification. took like 3 tries to get the policy order right

2. **2hr edit window** - both RLS policy AND trigger check this. belt and suspenders approach

3. **school_id matching** - staff can only create issues for their own school. had to join users table to check this

4. **role hierarchy** - state > district > school. policies check role enum value

## service role vs anon key

frontend uses ANON key (the long jwt token)
edge functions use SERVICE_ROLE key (never exposed)

anon key goes through RLS  
service role bypasses it (be careful)

## testing policies

```sql
-- switch to a test user
SET request.jwt.claims.sub = 'user-id-here';

-- try a query
SELECT * FROM issues;
```

if it returns wrong data = policy broken

## important reminders

- default deny (if no policy matches = access denied)
- policies are OR logic (any matching policy grants access)
- can't bypass with frontend tricks
- supabase dashboard bypasses RLS for admin convenience
- check the logs if queries fail mysteriously

## edge cases we handle

- anonymous bypass reports (encrypted, state admin only)
- principals endorsing issues (needs principal role check)
- officials from other districts (strict district_id matching)
- users changing schools mid-issue (original school_id stays)

## performance notes

policies run on every query so:
- indexed school_id, user_id, created_at
- avoid complex joins in policies where possible
- sometimes duplicated logic for speed (normalize later maybe)

## if you need to add a new policy

1. figure out WHO needs access
2. figure out WHAT they can do (select/insert/update/delete)
3. write the USING clause (when can they do it)
4. write the WITH CHECK clause (what values can they set)
5. test with actual user JWTs
6. document it here so we remember

## common mistakes

- forgetting to enable RLS on new tables (disaster)
- not handling NULL values in policies
- circular dependencies between policies
- forgetting service role vs anon distinction

ok i think that covers it. if policies break check rls_policies.sql line by line
