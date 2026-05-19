# Gamebreakers App

> Faith. Fitness. Future.

The all-in-one platform for Game Breakers Academy (GBA) student-athletes. One codebase — iOS, Android, and web — for tutoring connections, workout plans, Bible reading, daily devotionals, prayer requests, and youth resources.

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
| Framework | React Native + Expo SDK 51 |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind for RN) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Bible API | API.Bible (free tier) |
| Builds | Expo EAS (App Store + Play Store) |

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only) or [Expo Go](https://expo.dev/go) app
- Android: Android Studio or [Expo Go](https://expo.dev/go) app

### Setup

```bash
git clone https://github.com/pmhudak13/gamebreakers-app.git
cd gamebreakers-app
npm install
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
npm start
```

Then press:
- `i` to open iOS simulator
- `a` to open Android emulator  
- `w` to open in web browser
- Scan QR code with Expo Go on your phone

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_BIBLE_API_KEY=your-api-bible-key
```

## Project Structure

```
gamebreakers-app/
├── app/
│   ├── _layout.tsx          # Root layout
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar (GBA navy, 6 tabs)
│       ├── index.tsx        # Home screen
│       ├── bible.tsx        # Bible reader
│       ├── devotionals.tsx  # Devotionals
│       ├── workouts.tsx     # Workout plans
│       ├── prayer.tsx       # Prayer requests
│       └── resources.tsx    # Resources hub
├── lib/
│   └── supabase.ts          # Supabase client
└── .paul/                   # Project planning framework
```

## Deployment

- **Development:** `npm start` + Expo Go app
- **iOS App Store:** `eas build --platform ios` (requires Apple Developer account, $99/yr)
- **Google Play:** `eas build --platform android` (requires Google Play account, $25 one-time)
- **Web:** `eas build --platform web` or Vercel

## Brand Colors

- Navy: `#01003b`
- Gray: `#a4a4a4`
- White: `#ffffff`

## License

Private — Game Breakers Academy. All rights reserved.
