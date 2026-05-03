# StudyPact

A study accountability web app. Match with a random partner, commit to a task,
share screens, approve each other's completion, earn XP.

## Stack
- React + Vite + Tailwind
- Supabase (auth, postgres, realtime)
- WebRTC via `simple-peer` (screen share, signaled over Supabase Realtime broadcast)

## Local setup

1. Install deps:
   ```bash
   npm install
   ```

2. Create a Supabase project (free tier works).
   - In the SQL editor, paste the contents of `schema.sql` and run.
   - In **Database → Replication**, enable Realtime on the `sessions`,
     `messages`, `queue`, and `callouts` tables.
   - In **Project settings → API**, copy the project URL and anon key.

3. Set env vars:
   ```bash
   cp .env.example .env
   # then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open the app in two different browsers (or one regular + one incognito),
   sign up as two accounts, hit "Find a partner" on both — they'll match.

## Testing two users locally
- Use two profiles: normal + incognito, or two different browsers.
- Screen sharing requires a desktop browser with HTTPS (localhost counts).
- Signup with an `@something.edu` email to auto-verify a school.

## Project layout
```
src/
  components/         UI by feature (auth/session/matchmaking/profile/leaderboard)
  context/            AuthContext, SessionContext
  hooks/              useMatchmaking, useScreenShare
  lib/                supabase client, xp logic, webrtc helpers
  pages/              Home, Dashboard, Session, Profile, Leaderboard
schema.sql            DB schema + RLS policies
```

## MVP scope
Done:
- Signup/login (with auto .edu detection)
- Random matchmaking (prefers same school)
- Commit phase (task + duration)
- Realtime chat
- Callout button (5-minute cooldown, 3+ → XP penalty)
- Peer-to-peer screen share
- "I'm done" → partner approval flow
- XP awards on completion, streak tracking, levels
- Profile with badges + recent sessions
- Global + school leaderboards (weekly XP)

Not built (noted in the original plan as v2):
- Push notifications
- Full dispute resolution flow
- Mobile app
- More badges (School Rep in particular needs a top-3 query)

## Known limitations
- The matchmaking race (both clients creating a session) is mitigated by
  deterministic creator selection on user id; under high concurrency a proper
  server-side function would be safer.
- The "3+ callouts → -10 XP" rule fires per-callout once the threshold is hit
  — simple but can compound; tighten if you productionize.
- Completion XP is awarded client-side. A Supabase edge function or database
  trigger is the right production path; client code here guards with a
  conditional `update` to prevent double-awards.
