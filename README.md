# PNEUMA O2

**Breathe Beyond** — The world's most advanced breathwork platform.

From daily calm to consciousness expansion. 20+ scientifically-backed breathing patterns covering the full spectrum from clinical Buteyko to transformative DMT Activation Protocol.

## Features

- **20+ Breathing Patterns** — Coherent, Box, 4-7-8, Wim Hof, Buteyko, Holotropic, DMT Protocol, and more
- **Liquid Consciousness Design** — Bioluminescent UI with generative Breath Orb visualization
- **Polyvagal State Tracking** — Real-time autonomic nervous system mapping
- **Progressive Access System** — 4 safety levels for responsible breathwork progression
- **Haptic Feedback Engine** — Synchronized tactile guidance for each breath phase
- **AI-Ready Architecture** — Designed for Mistral AI personalization (EU-hosted)
- **Full Analytics** — Session history, weekly trends, category balance, XP & achievements
- **EU Data Sovereign** — GDPR-native, designed for EU-first hosting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript (strict) |
| Animation | React Native Reanimated 3 |
| Navigation | Expo Router |
| State | Zustand + AsyncStorage |
| Haptics | expo-haptics |
| Audio | expo-av |

## Getting Started

```bash
npm install
npx expo start
```

## Project Structure

```
src/
  engine/       — Breath engine, haptics, polyvagal state
  theme/        — Liquid Consciousness color system, spacing
  components/   — BreathOrb, PatternCard, PolyvagalBar, Aurora
  screens/      — Home, Discover, Session, Insights, Profile
  data/         — 20+ pattern configs, achievements
  hooks/        — Zustand store
  types/        — TypeScript type definitions
app/
  (tabs)/       — Tab navigation (Home, Discover, Breathe, Insights, Journey)
  session.tsx   — Full-screen immersive breathing session
  onboarding.tsx — Onboarding flow
docs/
  PNEUMA_App_Specification.md — Full product specification
```

## License

GPL-3.0
