# little space 🌷

A private, calming wellness & stress-tracking space — built for one person, not a productivity dashboard.

## What this is

- **Today** — a greeting, a gentle message, today's snapshot, quick-log buttons
- **Calendar** — a month view with soft activity dots (never "good/bad day" scores)
- **Track** — stress check-ins, medication record-keeping, food logging, yoga/rest, daily reflections
- **Insights** — gentle, hedged observations ("seems", "may", "you might notice") — never diagnoses
- **For You ❤️** — an on-demand space for encouragement, by category, with favoriting

No streaks to punish, no "you failed" language, no calorie counting, no medication advice, no public profiles.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zustand (state) · Recharts (charts) · Framer Motion (motion) · Supabase (optional cloud backend)

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/today`.

**That's it.** The app works immediately with zero configuration: all data is stored locally in the browser (via `localStorage`, through the Zustand store in `lib/store.ts`), and it's pre-seeded with two weeks of realistic sample data so it doesn't feel empty on first open. Nothing leaves the device in this mode.

## Turning on real cloud sync + auth (optional)

Local mode is genuinely private (nothing ever leaves the browser) but it's single-device, and clearing browser data clears the app. If you'd like her data to sync across her phone and laptop, with proper login:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run `supabase/schema.sql` from this repo. It creates every table, enables **Row Level Security** on all of them, and adds policies so a user can only ever read or write their own rows.
3. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon key (Project Settings → API).
4. Add a sign-in flow (Supabase Auth supports email/password or magic links out of the box) and swap the calls in `lib/store.ts` for calls to `lib/supabase/client.ts`. The store is intentionally structured so each action (`addStressEntry`, `logMedication`, etc.) is a single, isolated function — a natural seam for this swap.

Until those env vars are set, `isSupabaseConfigured` in `lib/supabase/client.ts` is `false` and the app quietly stays in local mode — nothing breaks either way.

## Design notes

- Palette is a dusky rose / twilight lavender / warm peach system — deliberately avoids the near-black-and-neon or cream-and-terracotta looks that read as generic AI output. Stress colors run sage → peach → rose, never into alarm red.
- Type: Fraunces (a warm, soft display serif) for headings, Plus Jakarta Sans for everything else.
- The signature visual is the "breathing" ambient orb on Today and For You — a slow, six-second pulse meant to feel like a held breath, not a notification.
- Respects `prefers-reduced-motion`.

## Privacy

- All data is user-owned. In local mode it never leaves the device; in Supabase mode, Row Level Security guarantees one user can never read another's rows.
- Every entry, and all data at once, can be deleted from Settings.
- No public profiles, no leaderboards, no data shared with anyone.
- This app is not a substitute for professional medical or mental health care, and never offers medication or diagnostic advice — it only records what she chooses to log.

## Project structure

```
app/                 routes (today, calendar, track, insights, for-you, settings)
components/
  layout/             AppShell (nav)
  ui/                 Card, Button, Chip, Sheet, StressSlider
  track/              logging forms (stress, medication, food, yoga, reflection) + chart
  calendar/            day detail sheet
lib/
  store.ts            Zustand store — the whole local data layer
  types.ts            shared TypeScript types
  selectors.ts         derived/computed data helpers
  insights.ts          rule-based gentle insight generator
  messages.ts           encouragement copy library
  seed.ts               sample data generator
  supabase/             optional cloud client (browser + server)
supabase/schema.sql    Postgres schema + RLS policies
```
