# contributing to SETU

hey thanks for wanting to help! here's how to get started

## quick start

1. fork this repo
2. clone your fork
3. install stuff: `npm install`  
4. make a branch: `git checkout -b fix/whatever`
5. do your thing
6. push and open a PR

## what we need help with

check the issues tab for stuff labeled `good first issue` or `help wanted`

some ideas:
- better telugu translations (current ones are google translate tier)
- offline sync improvements  
- test coverage (we have like none lol)
- accessibility improvements
- performance optimization
- bug fixes always welcome

## code style

we're pretty chill but:

- use typescript (no any types unless you have to)
- format with prettier (runs on save hopefully)  
- use functional components (no class components)
- keep components small (if it's 500 lines split it up)
- actually test your changes (manual testing is fine)

## commit messages

just use normal english, something like:

```
fix login redirect loop on mobile
add telugu translations for settings page  
improve urgency score calculation
```

no need for conventional commits or whatever unless you want to

## pull requests

- describe what you changed and why
- screenshots if it's UI stuff  
- mention which issue it fixes
- don't stress about it being perfect

i'll review and maybe ask for changes but no big deal

## testing

uh we should probably have tests but we don't really

just make sure:
- npm run dev works
- your change doesn't break login
- mobile viewport looks ok (360px)
- console has no new errors

if you wanna add actual tests that would be sick

## design system

we use material design 3 with specific colors:

- deep navy: #0D1B2A
- saffron gold: #F0A500  
- light bg: #F8F9FA

don't change these unless we're redesigning everything

8px border radius, 48px min tap targets on mobile

## database changes

if you need to change the schema:

1. test locally first (seriously)
2. write migration sql
3. update types  
4. test with existing data
5. document what changed

breaking changes need a good reason

## questions?

open an issue or discussion if you're not sure about something

or just try it and see what happens. that's what i do

## what not to do

- don't commit .env files (use .env.example)
- don't push to main directly
- don't break RLS policies (security first)  
- don't add huge dependencies for simple things
- don't delete the audit trail

## license

by contributing you agree to GPL v3 (same as the project)

basically means your code stays open source

## recognition  

contributors get listed in the readme and my eternal gratitude

that's it! ship it 🚀
