# Gamebreakers App — ROADMAP.md

## Milestones

### v0.1 — Foundation & Auth
**Goal:** Working Next.js app on GitHub with Supabase auth, GBA branding, and nav shell.
**Status:** Not started

| Phase | Name | Status |
|-------|------|--------|
| 01 | Foundation & Setup | Not started |
| 02 | Auth & User Profiles | Not started |

---

### v0.2 — Content Core
**Goal:** Bible reader, devotionals, and workout plans functional.
**Status:** Not started

| Phase | Name | Status |
|-------|------|--------|
| 03 | Bible Reader & Devotionals | Not started |
| 04 | Workout Plans Library | Not started |

---

### v0.3 — Community Features
**Goal:** Prayer requests and resources hub live.
**Status:** Not started

| Phase | Name | Status |
|-------|------|--------|
| 05 | Prayer Requests | Not started |
| 06 | Resources Hub | Not started |

---

### v0.4 — Student-Tutor Connect
**Goal:** Tutor profiles, student matching, and session requests working.
**Status:** Not started

| Phase | Name | Status |
|-------|------|--------|
| 07 | Tutor Profiles & Listing | Not started |
| 08 | Student-Tutor Matching & Requests | Not started |

---

### v1.0 — Launch-Ready
**Goal:** Polish, admin panel, PWA install, deploy to production.
**Status:** Not started

| Phase | Name | Status |
|-------|------|--------|
| 09 | Admin & Content Management | Not started |
| 10 | PWA, Performance & Launch | Not started |

---

## Phase Details

### Phase 01 — Foundation & Setup
**Scope:** Initialize Next.js repo, configure Supabase project, set up Tailwind + shadcn/ui, apply GBA brand, create nav shell with all 6 feature routes stubbed.
**Deliverables:**
- GitHub repo: pmhudak13/gamebreakers-app
- Next.js 14 app with App Router
- Supabase project linked (env vars configured)
- Tailwind CSS + shadcn/ui installed
- GBA brand colors/fonts applied
- Mobile nav shell with 6 tabs: Home, Bible, Devotionals, Workouts, Prayer, Resources
- Deployed to Vercel (initial deploy)

### Phase 02 — Auth & User Profiles
**Scope:** Supabase Auth (email/password + magic link), student vs tutor role, user profile page.
**Deliverables:**
- Sign up / sign in / sign out flows
- User roles: student, tutor, admin
- Profile page (name, school, sport, grade)
- Protected routes

### Phase 03 — Bible Reader & Devotionals
**Scope:** Bible reading UI using API.Bible, daily verse widget, daily/weekly devotional content.
**Deliverables:**
- Bible search + browse (Old/New Testament)
- Daily verse on home screen
- Devotional cards (admin-created, stored in Supabase)

### Phase 04 — Workout Plans Library
**Scope:** Workout plan cards, filter by sport/difficulty, plan detail view.
**Deliverables:**
- Workout plan CRUD (admin creates)
- Browse/filter by sport, position, difficulty
- Plan detail: exercise list with reps/sets

### Phase 05 — Prayer Requests
**Scope:** Students post prayer requests, community views and "prays for" requests.
**Deliverables:**
- Submit prayer request form
- Feed of prayer requests (moderated)
- "Praying for you" reaction button
- Admin moderation panel

### Phase 06 — Resources Hub
**Scope:** Curated resource cards linking to articles, videos, tools.
**Deliverables:**
- Resource cards with category tags
- Filter by category (mental health, college, faith, fitness)
- Admin can add/edit resources

### Phase 07 — Tutor Profiles & Listing
**Scope:** Tutors create profiles, students browse tutor directory.
**Deliverables:**
- Tutor profile form (subject, availability, bio, photo)
- Tutor directory with search/filter

### Phase 08 — Student-Tutor Matching & Requests
**Scope:** Students send session requests to tutors, tutors accept/decline.
**Deliverables:**
- Session request flow
- Tutor inbox (accept/decline)
- Notification emails

### Phase 09 — Admin & Content Management
**Scope:** Admin dashboard for managing devotionals, resources, prayer moderation.
**Deliverables:**
- Admin-only routes
- Content CRUD interfaces

### Phase 10 — PWA, Performance & Launch
**Scope:** PWA manifest, service worker, performance audit, final deploy.
**Deliverables:**
- PWA installable on iOS/Android home screen
- Lighthouse score 90+
- Production Supabase project
- Custom domain (if available)
