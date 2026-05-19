# Gamebreakers App — PROJECT.md

## What We're Building

A mobile-first web application for Game Breakers Academy (GBA) student-athletes and youth. The app serves as an all-in-one faith, fitness, and development hub — giving students tools to grow on and off the field.

**Org:** Game Breakers Academy (GBA)
**Lead:** Kevin Nickerson (kevin@gamebreakersacademy.org)
**Technical Organizer:** Paul Hudak (paul@thecooconsultant.com)
**GitHub:** pmhudak13/gamebreakers-app

## Core Features (MVP)

| Feature | Description |
|---------|-------------|
| Student-Tutor Connect | Students browse/match with tutors; request sessions |
| Workout Plans | Library of curated workout plans by sport/position |
| Bible Reader | Embedded Bible (scripture lookup + daily verse) |
| Devotionals | Daily and weekly faith-based devotionals for youth |
| Prayer Requests | Students submit prayer requests; community support |
| Resources Hub | Curated articles, videos, and tools for youth development |

## Tech Stack

- **Framework:** React Native + Expo SDK 51 — iOS, Android, and web from one codebase
- **Navigation:** Expo Router (file-based, tab navigation)
- **Backend:** Supabase (auth, PostgreSQL, real-time, storage — free tier)
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **Builds:** Expo EAS (App Store + Play Store pipeline)
- **Bible API:** API.Bible (free tier)
- **Auth:** Supabase Auth (email/password + magic link)
- **Session storage:** AsyncStorage (React Native session persistence)

> Note: Kevin may migrate to fully native (Kotlin/Swift) later. Keep business logic
> in `lib/` and `hooks/` separate from UI components to make future migration easier.

## Design Principles

- Mobile-first — students use phones, not desktops
- Faith-forward — Bible and devotionals are first-class citizens, not afterthoughts
- Simple and fast — student-athletes are busy; zero friction UX
- GBA brand colors: #01003b (navy), #a4a4a4 (gray), #ffffff (white)

## Constraints

- No paid third-party services in MVP (free tiers only)
- No native app store submission in Phase 1 (web-first)
- Keep dependencies lean — avoid over-engineering
- All content must be appropriate for high school students
- Supabase free tier: 500MB DB, 1GB storage, 50k MAU

## Value Proposition

Kevin's students need one place that meets them where they are — faith, fitness, academics, and community — without switching between 5 different apps. This is that place.
