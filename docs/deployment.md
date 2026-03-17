# how to deploy this thing

quick guide for when i inevitably forget

## frontend (vercel or netlify)

### vercel (easier imo)

1. push to github
2. go to vercel.com
3. import repo
4. set env vars:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. deploy

that's literally it. vercel handles everything

### netlify 

same thing pretty much. maybe add `npm run build` as build command if it doesn't detect it

dist folder is the output

## backend (supabase)

already deployed at https://zdhbncdnsbdvkcyomvax.supabase.co

if you need to set up fresh:

1. create new supabase project
2. run schema.sql in sql editor
3. run rls_policies.sql  
4. run seed.sql for demo data
5. set up storage bucket:
   - name: issue-attachments
   - public: false (use signed urls)
   - max file size: 10mb
6. deploy edge functions:
   ```bash
   supabase functions deploy score-issue
   supabase functions deploy auto-escalate
   ```
7. set up cron for auto-escalate (every 6 hrs)

## environment variables

make a .env.local file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key
```

don't commit this. it's in .gitignore already

for prod deployment use the platform's env var settings (vercel dashboard, netlify settings, etc)

## custom domain (optional)

if you wanna use setu.gov.in or whatever:

1. add domain in vercel/netlify  
2. point DNS records:
   ```
   A record: @ -> vercel IP
   CNAME: www -> your-app.vercel.app
   ```
3. wait for SSL (like 5 mins)

## monitoring

supabase has built-in logs in the dashboard

for frontend errors maybe add sentry later idk

## rollback strategy

vercel keeps all deploys so you can instant rollback

supabase... be careful with migrations. test locally first

## performance 

- vercel edge network is fast af
- supabase is on aws mumbai region (chose that for india latency)
- cdn handles static assets

should be good for 1000s of concurrent users

## costs

- supabase: free tier is 500MB db, 1GB storage, 2GB bandwidth
- vercel: free tier is generous for this scale
- probably fine unless we hit 100k users lol

## checklist before production

- [ ] env vars set correctly
- [ ] RLS policies all enabled  
- [ ] seed data removed (or keep for demo?)
- [ ] edge functions deployed
- [ ] cron job running
- [ ] storage bucket configured
- [ ] test login works
- [ ] test creating issue works
- [ ] test escalation works
- [ ] mobile viewport tested
- [ ] desktop dashboard tested

## if shit breaks in prod

1. check vercel logs
2. check supabase logs  
3. check browser console
4. check network tab
5. cry
6. rollback deploy
7. fix locally
8. redeploy

## updates

just push to main branch and vercel auto-deploys

or disable auto-deploy and do manual if you want control

## backups

supabase does daily backups automatically on free tier

can restore from dashboard if needed

---

should probably automate more of this but works for now
