# common issues and how to fix them

stuff that keeps breaking and how i fixed it last time

## "supabaseUrl is required"

this one was annoying. happens when env vars aren't loading

**fix:**
1. check you have .env.local file (not .env)
2. check vite is reading VITE_ prefix vars
3. restart dev server (vite caches sometimes)
4. or just hardcode them in supabase.ts for testing (not for prod tho)

## login works but redirects to 404

probably react router acting up

**fix:**
- check routes.tsx has the path
- check the redirect logic in Login.tsx
- clear localStorage and try again
- check role matches the route (rco vs school staff)

## "row level security policy violation"

means RLS is blocking the query (good actually)

**fix:**
1. check you're logged in  
2. check your user role matches what the policy expects
3. look at rls_policies.sql for that table
4. check the console for which table/operation failed
5. might need to update the policy if it's too strict

## images/photos not uploading

storage bucket issue probably

**fix:**
- check storage bucket exists (issue-attachments)
- check storage policies allow insert
- check file size < 10mb
- check file type is allowed (jpg, png, webp)
- network tab shows the actual error usually

## urgency score is wrong/weird

algorithm might need tuning or bug in calculation

**fix:**
- check calculateUrgencyScore.ts logic
- check the edge function score-issue
- console.log the inputs and see what's off
- might just be the weights need adjusting

## auto-escalation not happening

cron job probably not running

**fix:**
- check supabase dashboard > edge functions > cron
- check auto-escalate function logs
- might need to manually trigger it for testing
- check escalation time thresholds in the function

## mobile layout broken on real phone

works on chrome devtools but not actual device

**fix:**
- check viewport meta tag in index.html
- check for any hardcoded pixel widths
- test on actual 360px not just in devtools
- might be font scaling or browser chrome throwing it off

## telugu text looks weird

font loading issue or encoding

**fix:**  
- check fonts.css has noto sans telugu
- check font is actually loading (network tab)
- might need to add font-display: swap
- check file is saved as utf-8

## "cannot read property of undefined"

classic react error, some state is undefined when it shouldn't be

**fix:**
- add optional chaining `data?.property`
- add loading state
- add null checks  
- console.log before the error line to see what's undefined

## session expires immediately

auth config issue

**fix:**
- check supabase.ts auth config
- check persistSession is true
- check localStorage isn't blocked
- might need to refresh token manually

## build fails on vercel

works locally but not in prod

**fix:**
- check node version matches (usually node 18)
- check all imports are correct case (vercel is case sensitive)
- check no console.logs that reference window before it exists
- check build locally with `npm run build`

## data not updating in realtime

websocket subscription issue

**fix:**
- check realtime is enabled in supabase project
- check subscription code is correct
- check RLS allows reading the updates
- might need to refresh the page to reconnect

## too many re-renders

infinite loop in useEffect probably

**fix:**
- check useEffect dependencies
- might be setting state in render
- might be missing dependency array
- add a guard condition

## typescript errors everywhere after update

types got out of sync

**fix:**
- check supabase types are generated
- npm install to update types
- might need to regenerate database types
- worst case restart typescript server in editor

## performance is slow

too many queries or renders

**fix:**
- check network tab for duplicate requests
- use react devtools profiler
- might need to memoize components
- might need to debounce inputs
- check if doing expensive calculations in render

---

when in doubt: 
1. check console
2. check network  
3. check supabase logs
4. google the error
5. ask someone
6. cry a little
7. fix it
8. document it here so we don't forget
