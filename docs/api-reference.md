# api reference (kinda)

not really a REST api but here's how to interact with the database

## authentication

using supabase auth with email/password

```typescript
// login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@setu.local',
  password: 'Test123!@#'
})

// logout
await supabase.auth.signOut()

// get current user
const { data: { user } } = await supabase.auth.getUser()
```

## tables

### schools

```typescript
// get all schools
const { data } = await supabase
  .from('schools')
  .select('*')

// get specific school  
const { data } = await supabase
  .from('schools')
  .select('*')
  .eq('id', schoolId)
  .single()
```

### users

```typescript
// get current user profile
const { data } = await supabase
  .from('users')
  .select('*, schools(*)')
  .eq('id', userId)
  .single()

// RLS handles permissions automatically
```

### issues

this is the main one

```typescript
// create issue
const { data } = await supabase
  .from('issues')
  .insert({
    school_id: schoolId,
    category: 'water',
    description: 'tap broken in hostel',
    students_affected: 150,
    urgency_level: 'high',
    reported_by: userId
  })

// get issues for school
const { data } = await supabase
  .from('issues')
  .select(`
    *,
    schools(name, district),
    users!reported_by(name)
  `)
  .eq('school_id', schoolId)
  .order('created_at', { ascending: false })

// update status (officials only)
const { data } = await supabase
  .from('issues')
  .update({ 
    status: 'in_progress',
    assigned_to: officialId 
  })
  .eq('id', issueId)

// search issues
const { data } = await supabase
  .from('issues')
  .select('*')
  .ilike('description', '%water%')
  .gte('urgency_score', 70)
```

### escalations

auto-populated mostly but you can read

```typescript
// get escalation history for issue
const { data } = await supabase
  .from('escalations')
  .select('*')
  .eq('issue_id', issueId)
  .order('escalated_at', { ascending: true })
```

### audit_log

append only, read for timeline

```typescript
// get audit trail  
const { data } = await supabase
  .from('audit_log')
  .select('*, users(name)')
  .eq('issue_id', issueId)
  .order('timestamp', { ascending: true })
```

### notifications

```typescript
// get my notifications
const { data } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

// mark as read
await supabase
  .from('notifications')
  .update({ read: true })
  .eq('id', notificationId)
```

## realtime subscriptions

```typescript
// subscribe to new issues
const subscription = supabase
  .channel('issues')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'issues' },
    (payload) => {
      console.log('new issue:', payload.new)
    }
  )
  .subscribe()

// unsubscribe when done
subscription.unsubscribe()
```

## storage (photos/audio)

```typescript
// upload file
const file = event.target.files[0]
const { data, error } = await supabase.storage
  .from('issue-attachments')
  .upload(`${issueId}/${file.name}`, file)

// get signed url (valid 1 hour)
const { data } = await supabase.storage
  .from('issue-attachments')
  .createSignedUrl(filePath, 3600)

// download file
const { data, error } = await supabase.storage
  .from('issue-attachments')
  .download(filePath)
```

## edge functions

these run server-side

### score-issue

triggered automatically on issue insert
calculates urgency score

```typescript
// you don't call this directly
// happens via database trigger
```

### auto-escalate  

runs every 6 hours via cron
escalates stagnant issues

```typescript
// also automatic
// but you can invoke manually for testing:
await supabase.functions.invoke('auto-escalate')
```

## common queries

**dashboard stats:**
```typescript
const { count: total } = await supabase
  .from('issues')
  .select('*', { count: 'exact', head: true })
  .eq('school_id', schoolId)

const { count: pending } = await supabase
  .from('issues')
  .select('*', { count: 'exact', head: true })
  .eq('school_id', schoolId)
  .eq('status', 'submitted')
```

**filters:**
```typescript
// by status
.eq('status', 'in_progress')

// by category  
.eq('category', 'water')

// by urgency
.gte('urgency_score', 70)

// by date range
.gte('created_at', '2026-01-01')
.lte('created_at', '2026-03-31')

// combine filters
.eq('school_id', schoolId)
.eq('status', 'submitted')
.order('urgency_score', { ascending: false })
```

## error handling

```typescript
const { data, error } = await supabase
  .from('issues')
  .select('*')

if (error) {
  console.error('query failed:', error.message)
  // check if RLS policy violation
  if (error.code === '42501') {
    // permission denied
  }
}
```

## rate limits

supabase free tier:
- 500MB database
- 1GB storage  
- 2GB bandwidth/month
- 50k monthly active users

should be fine for pilot

## notes

- all timestamps are UTC
- RLS enforces permissions automatically
- use .single() when expecting one row
- use .maybeSingle() when might be zero or one
- always check for errors
- relationships use foreign keys
- cascade deletes are disabled (audit trail)

this isn't comprehensive but covers like 90% of what you need
