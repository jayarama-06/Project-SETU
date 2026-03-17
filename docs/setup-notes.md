# setup notes

just keeping track of how things work so i don't forget lol

## getting started

so basically you need node 18+ and pnpm (or npm works fine too)

```bash
npm install
npm run dev
```

hits localhost:5173 and you're good

## supabase stuff

ok so the db is on supabase. url and key are in the env file (or hardcoded rn for demo, sue me)

tables:
- schools
- users  
- issues
- escalations
- audit_log
- notifications
- assignments

RLS is on so don't try to be sneaky lol. policies are pretty tight

## demo accounts

**school staff login:**
- test@setu.local / Test123!@#

**rco official login:**  
- go to /rco/login
- same creds work i think? check seed.sql

## if things break

1. check the console - supabase client logs everything
2. RLS policies might be blocking you
3. did you run the seed file?
4. clear localStorage and try again

## folders

- `/src/app/screens` - all the pages
- `/src/app/components` - reusable stuff
- `/src/lib` - supabase client setup
- `/supabase` - backend sql files

## colors we're using

- Deep Navy: #0D1B2A (main bg stuff)
- Saffron: #F0A500 (buttons, important things)  
- Light bg: #F8F9FA

don't change these unless you wanna redo everything

## escalation levels

L0 = just submitted
L1 = district saw it  
L2 = state is aware
L3 = escalated higher
L4 = oh shit mode

badges have colors based on level, check EscalationChip.tsx

## i18n 

english/telugu toggle. translations are in translations.ts but honestly we need to fill in more telugu strings

## mobile first

everything is 360px mobile viewport first. rco dashboard is desktop tho

## notes to self

- urgency score maxes at 140
- issues auto-escalate after certain time
- 2hr edit window then immutable
- offline mode kinda works but needs testing
- voice notes upload to supabase storage
- photos too

## todos eventually

- [ ] move env vars properly
- [ ] add more telugu translations  
- [ ] test offline sync better
- [ ] clean up console logs
- [ ] write actual tests lmao

that's it i think
