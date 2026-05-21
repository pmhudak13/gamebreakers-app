# Gamebreakers App — STATE.md

## Current Position

Milestone: v0.1 Foundation & Auth — COMPLETE ✓
Milestone: v0.2 Bible & Workouts — COMPLETE ✓
Milestone: v0.3 Community Features — COMPLETE ✓
Milestone: v0.4 Tutor Matching — COMPLETE ✓
Milestone: v1.0 Launch — COMPLETE ✓
Phase: 10 of 10 (PWA + Launch) — COMPLETE ✓
Last activity: 2026-05-21 — Phase 10 complete. App is v1.0.0, ready for EAS build.

Progress:
- Milestone v0.1: [██████████] 100% ✓  (Phase 01 Foundation + Phase 02 Auth)
- Milestone v0.2: [██████████] 100% ✓  (Phase 03 Bible ✓, Phase 04 Devotionals ✓)
- Milestone v0.3: [██████████] 100% ✓  (Phase 05 Prayer ✓, Phase 06 Resources ✓)
- Milestone v0.4: [██████████] 100% ✓  (Phase 07 Tutor Profiles ✓, Phase 08 Matching ✓)
- Milestone v1.0: [██████████] 100% ✓  (Phase 09 Admin ✓, Phase 10 PWA + Launch ✓)

## Phases Complete

```
Phase 01  Foundation & Setup   ✓
Phase 02  Auth & User Profiles ✓
Phase 03  Bible Reader         ✓
Phase 04  Devotionals          ✓
Phase 05  Prayer Requests      ✓
Phase 06  Resources Hub        ✓
Phase 07  Tutor Profiles       ✓
Phase 08  Tutor Matching       ✓
Phase 09  Admin Dashboard      ✓
Phase 10  PWA + Launch         ✓  ← ALL PHASES COMPLETE
```

🎉 v1.0.0 — All 10 phases complete.

## Session Continuity

Last session: 2026-05-21
Next action: Run EAS setup (eas login → eas init), set EAS secrets, run npm run build:prod
Resume file: .paul/phases/10-pwa-launch/10-01-PLAN.md (pre-launch checklist)

## Outstanding Manual Steps

1. Run `supabase/migrations/001_profiles.sql` in Supabase SQL editor (if not done)
2. Enable Email auth in Supabase dashboard (Auth → Providers → Email) (if not done)
3. Add `EXPO_PUBLIC_BIBLE_API_KEY` to `.env.local` (get free key at scripture.api.bible)
4. Run `supabase/migrations/002_devotionals.sql` in Supabase SQL editor (includes seed data)
5. Run `supabase/migrations/003_prayer_requests.sql` in Supabase SQL editor ✓ Done
6. Run `supabase/migrations/004_resources.sql` in Supabase SQL editor ✓ Done
7. Run `supabase/migrations/005_tutors.sql` in Supabase SQL editor ✓ Done
8. Run `supabase/migrations/006_tutor_requests.sql` in Supabase SQL editor ✓ Done
9. **Run `supabase/migrations/007_admin_role.sql` in Supabase SQL editor** ← new
10. **To grant admin access**: update a profile row — `UPDATE profiles SET role = 'admin' WHERE id = '<user-id>';`

## Decisions

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| D-01 | React Native + Expo (not Next.js) | Needed for real iOS + Android native apps, not just web | 2026-05-19 |
| D-02 | Supabase for backend | Auth + DB + real-time + storage all free tier | 2026-05-19 |
| D-03 | NativeWind v4 (not shadcn) | Tailwind for React Native; shadcn is web-only | 2026-05-19 |
| D-04 | API.Bible for scripture | Free tier, comprehensive, well-documented | 2026-05-19 |
| D-05 | Expo EAS for builds | Managed build service for App Store / Play Store | 2026-05-19 |
| D-06 | Fully native (Kotlin/Swift) deferred | Kevin may switch later; keep business logic in lib/ for portability | 2026-05-19 |
| D-07 | KJV as default Bible translation | Free, no licensing issues, widely recognized | 2026-05-19 |
| D-08 | Admin as pushed screen (not tab) | 8 tabs already; admin is low-frequency; accessed from Profile | 2026-05-19 |

## Known Issues

None.
