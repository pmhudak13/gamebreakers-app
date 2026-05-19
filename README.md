# Gamebreakers App

> Faith. Fitness. Future.

The all-in-one platform for Game Breakers Academy (GBA) student-athletes. One app for tutoring connections, workout plans, Bible reading, daily devotionals, prayer requests, and youth resources.

**Org:** Game Breakers Academy  
**Contact:** kevin@gamebreakersacademy.org  
**Technical Lead:** paul@thecooconsultant.com

---

## Features

| Feature | Description |
|---------|-------------|
| Student-Tutor Connect | Match with tutors, request sessions |
| Workout Plans | Curated plans by sport and position |
| Bible Reader | Scripture search + daily verse |
| Devotionals | Daily and weekly faith content |
| Prayer Requests | Submit and support community prayers |
| Resources Hub | Articles, videos, tools for youth development |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Bible API | API.Bible (free tier) |
| Hosting | Vercel |

## Getting Started

```bash
git clone https://github.com/pmhudak13/gamebreakers-app.git
cd gamebreakers-app
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
APP_BIBLE_API_KEY=your-api-bible-key
```

## Brand Colors

- Navy: `#01003b`
- Gray: `#a4a4a4`
- White: `#ffffff`

## Deployment

1. **Supabase:** Create a project at [supabase.com](https://supabase.com)
2. **Vercel:** Connect this repo at [vercel.com/new](https://vercel.com/new), add env vars

## License

Private — Game Breakers Academy. All rights reserved.
