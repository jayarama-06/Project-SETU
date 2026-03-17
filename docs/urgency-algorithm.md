# urgency scoring explained

ok so the urgency score is probably the most important part of this whole thing. let me break down how it actually works

## the problem we're solving

without scoring, everything is equal priority. a broken chair gets same attention as a fire hazard. not good.

also, older issues get buried by new ones (starvation problem). we fix both

## the scoring (0-140 scale)

```
total = base_ai_score + age_bonus + stagnation_penalty + flags
```

### base AI score (max 30 pts)

this is the "smart" part:

**category weight** (10-30 pts)
- safety/security: 30
- water/sanitation: 25  
- infrastructure: 20
- food/nutrition: 25
- health/medical: 28
- academics: 15
- other: 10

basically life-threatening stuff scores higher duh

**student impact** (0-25 pts)
```
if students_affected < 50: +5
elif students_affected < 100: +10
elif students_affected < 200: +15  
else: +25
```

more kids affected = higher priority

**safety keywords** (+15 pts)
scans description for: injury, blood, fire, danger, urgent, emergency, broken glass, electrical, etc

if found = +15 instant boost

**evidence bonus** (0-10 pts)
- has photo: +5
- has voice note: +5  
- both: +10

proof makes it real

**principal endorsed** (+10 pts)
if principal clicks "this is serious" it matters

**recurrence** (+10 pts)  
same category issue in last 60 days from same school

so final AI score is capped at ~30ish points. might seem low but read on...

### age factor (0-40 pts, +2 per day)

this is the anti-starvation mechanism

day 1: +2
day 5: +10
day 10: +20
day 20: +40 (maxed)

so a 20-day old medium issue (70 base) becomes 110 priority

beats a fresh critical issue (30 base + 0 age = 30)

**this is intentional**

old issues never get buried

### stagnation bonus (0-20 pts)

how long stuck at current escalation level:
- 0-24hrs: 0  
- 24-48hrs: +5
- 48-72hrs: +10
- 72hrs+: +20

punishes officials who sit on things

### manual flags (+25 pts)

if an official manually flags "needs attention" it jumps the queue

### recurrence penalty (handled above)

repeat issues get automatic boost

## color coding

- 0-39: grey (low)
- 40-69: blue (medium)
- 70-99: amber (high)  
- 100-140: red + pulsing (critical)

## examples

**scenario 1: new minor issue**
- category: academics (15)
- students: 30 (+5)  
- no keywords (0)
- has photo (+5)
- age: day 1 (+2)
= 27 total (grey, low priority)

**scenario 2: week old water issue**  
- category: water (25)
- students: 150 (+15)
- keyword "broken" found (+15)
- photo + voice (+10)
- age: day 7 (+14)  
- stagnant 48hrs (+10)
= 89 total (amber, high priority)

**scenario 3: ancient issue**
- category: other (10)
- students: 20 (+5)
- no evidence (0)
- age: day 20 (+40)
= 55 total (blue, medium)

still gets seen because age factor

## edge cases

**anonymous bypass reports**
skip scoring, go straight to L4 (state admin)
encrypted, serious stuff only

**principal emergency escalation**  
+25 point boost instantly

**duplicate issues**
system should detect (we don't yet lol)
would merge or boost original

## recalculation

score is calculated:
1. on issue creation (edge function)
2. every 6 hours (auto-escalate cron)
3. when evidence added
4. when endorsed

stored in `urgency_score` column

## why cap AI at 30?

if AI could score 0-140, age wouldn't matter
new critical issue (140) would always beat old medium (70+20 age = 90)

by capping AI at 30, age has real weight

15-day old anything > brand new anything

forces attention to backlog

## tuning the algorithm

if too many false positives, adjust category weights
if starvation still happening, increase age factor
if nothing urgent enough, lower the caps

right now it's tuned based on... vibes? needs real data

## implementation

see `/supabase/functions/score-issue/index.ts`

it's a deno edge function that runs on issue insert/update

pretty fast, like 50-100ms usually

## future improvements

- ML model instead of keyword matching
- historical data to improve category weights  
- school-specific baselines (some schools have more issues)
- time-of-day factors (issues at night = more urgent?)
- weather integration (water issues during summer = more critical)

but this works for now

---

the key insight: age must eventually beat urgency or old issues die

that's the whole point of this system tbh
