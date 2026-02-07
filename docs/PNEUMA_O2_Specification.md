# Pneuma O2 -- Product Specification

**Version:** 1.0.0
**Status:** Active Development
**Platform:** iOS & Android (React Native / Expo)
**Bundle ID:** `com.pneuma.o2`

---

## 1. Product Vision

Pneuma O2 (renamed from PNEUMA) is the world's most advanced breathwork platform. It combines
22 scientifically-backed breathing patterns, real-time polyvagal state tracking, and a generative
"Liquid Consciousness" visual system into a single mobile experience.

The product spans the full breathwork spectrum: from clinically validated Buteyko protocols and
Navy SEAL box breathing, through ancient pranayama techniques, to transformative
consciousness-expansion practices like Holotropic Breathwork and the DMT Activation Protocol.

**Core philosophy:** Breathing is the only autonomic function that is also fully voluntary.
Pneuma O2 gives users precision control over their nervous system through guided breathwork,
progressive skill building, and real-time biometric feedback.

**Key differentiators:**
- 22 patterns across 4 scientific categories (parasympathetic, sympathetic, clinical, transformative)
- Real-time autonomic nervous system visualization via polyvagal state mapping
- Progressive Access System with medical safety gates
- Generative "Breath Orb" and Aurora background driven by live session data
- EU data-sovereign architecture (Supabase EU, Mistral AI Paris)
- Bilingual pattern library (English + Dutch)

---

## 2. Core Breathing Patterns

### 2.1 Parasympathetic -- Calming (Ventral Vagal)

| # | Pattern | Subtitle | Timing | BPM | Level | Difficulty |
|---|---------|----------|--------|-----|-------|------------|
| 1 | Coherent Breathing | Resonant Frequency | 5.5s in / 5.5s out | ~5.5 | 1 | 1/4 |
| 2 | 4-7-8 Breathing | Dr. Andrew Weil | 4s in / 7s hold / 8s out | ~3 | 1 | 1/4 |
| 3 | Box Breathing | Navy SEAL Technique | 4s in / 4s hold / 4s out / 4s hold | ~4 | 1 | 1/4 |
| 4 | Diaphragmatic Breathing | Belly Breathing | 4s in / 6s out | ~6 | 1 | 1/4 |
| 5 | Nadi Shodhana | Alternate Nostril | 4s L-in / 4s hold / 4s R-out / 4s R-in / 4s hold / 4s L-out | ~4 | 2 | 2/4 |
| 6 | Extended Exhale | 2:1 Ratio Breathing | 4s in / 8s out | ~5 | 1 | 1/4 |
| 7 | Physiological Sigh | Stanford Protocol | 2s in / 1.5s sip / 6s out | ~6 | 1 | 1/4 |
| 8 | Qi Gong Breathing | 4-4-6-2 Pattern | 4s in / 4s hold / 6s out / 2s hold | ~4 | 2 | 2/4 |

### 2.2 Sympathetic -- Activating (Fight or Flight)

| # | Pattern | Subtitle | Timing | BPM | Level | Difficulty |
|---|---------|----------|--------|-----|-------|------------|
| 9 | Breath of Fire | Kundalini Activation | 0.5s in / 0.5s out (rapid) | 60-120 | 2 | 2/4 |
| 10 | Wim Hof Method | The Iceman Protocol | 2s in / 1.5s out (30 rounds + hold) | variable | 3 | 3/4 |
| 11 | Bhastrika | Bellows Breath | 1s in / 1s out (rapid, forceful) | ~30 | 2 | 2/4 |
| 12 | Tummo Breathing | Inner Fire Meditation | 4s in / 5s hold / 4s out | variable | 3 | 3/4 |
| 13 | Lion's Breath | Simhasana Pranayama | 3s in / 3s out (open mouth) | variable | 1 | 1/4 |

### 2.3 Clinical -- Buteyko Protocol

| # | Pattern | Subtitle | Timing | BPM | Level | Difficulty |
|---|---------|----------|--------|-----|-------|------------|
| 14 | Buteyko Basic | Reduced Breathing | 3s in / 4s out / 3s pause | <6 | 1 | 1/4 |
| 15 | Control Pause Test | CP Measurement | Normal in / Normal out / Free hold (tap to stop) | N/A | 1 | 1/4 |
| 16 | Buteyko Sleep Protocol | Insomnia Relief | 3s in / 5s out / 3s rest | <6 | 1 | 1/4 |
| 17 | Buteyko Walking | Breath Hold Walking | 3s in / 3s out / Free hold (20-30 steps) | variable | 2 | 2/4 |

### 2.4 Transformative -- Consciousness Expansion

| # | Pattern | Subtitle | Timing | BPM | Level | Difficulty |
|---|---------|----------|--------|-----|-------|------------|
| 18 | Holotropic Breathwork | Stanislav Grof Protocol | 1.5s in / 1.5s out (connected, 30 min) | 20-30 | 4 | 3/4 |
| 19 | DMT Activation Protocol | THE BRIDGE | 1.5s in / 1.2s out (connected, 60 min) | variable | 4 | 4/4 |
| 20 | Shamanic Breathwork | Circular Breathing Journey | 2s in / 2s out (connected, 45 min) | variable | 4 | 3/4 |
| 21 | Rebirthing Breathwork | Connected Breath Release | 2.5s in / 2.5s out (connected, 45 min) | variable | 4 | 3/4 |

All transformative patterns are gated behind Level 4, tagged `locked`, and carry extensive
contraindication warnings. They require explicit consent before session start.

---

## 3. Design System -- "Liquid Consciousness"

### 3.1 Color Palette -- "Deep Ocean"

**Backgrounds:**

| Token | Hex | Usage |
|-------|-----|-------|
| `deepSpace` | `#0A0E27` | App background, splash screen |
| `midnightOcean` | `#0F1B3D` | Card backgrounds |
| `deepCurrent` | `#162447` | Elevated surfaces |
| `surfaceDark` | `#1A2550` | Active surface states |

**Accents:**

| Token | Hex | Usage |
|-------|-----|-------|
| `bioluminescent` | `#00D4AA` | Primary brand accent, parasympathetic |
| `neuralPurple` | `#7B68EE` | Transformative category, hold phases |
| `heartPink` | `#FF6B9D` | Dorsal vagal state |
| `solarGold` | `#FFD93D` | Sympathetic category, warnings |
| `amber` | `#FF8C42` | Sympathetic glow, energy |
| `clinicalPrimary` | `#4DA6FF` | Clinical category, exhale phases |

**Text:** `moonlight #E8F0FE` (primary), `fogGrey #8B95A5` (secondary), `dimText #5A6478` (tertiary).

**Category Colors:**

| Category | Primary | Background | Glow |
|----------|---------|------------|------|
| Parasympathetic | `#00D4AA` | `#0A2A2A` | `#00E5C4` |
| Sympathetic | `#FFD93D` | `#2A2A0A` | `#FF8C42` |
| Clinical | `#4DA6FF` | `#0A1A2A` | `#6BB8FF` |
| Transformative | `#7B68EE` | `#1A0A2A` | `#C084FC` |

**Breath Phase Colors:** Inhale `#00D4AA`, Hold In `#7B68EE`, Exhale `#4DA6FF`,
Hold Out `#FFD93D`, Free `#FF6B9D`.

### 3.2 The Breath Orb

The central visual element of every session. A multi-layered, bioluminescent entity that
breathes with the user -- not a simple expanding circle.

**Layer architecture (outside in):**
1. **Glow Ring** -- Outer halo, opacity driven by breath intensity, scales up to 1.6x
2. **Decorative Ring** -- Dashed border, continuous 30-second rotation
3. **Main Orb** -- Primary sphere, scales 0.7x (exhale) to 1.5x (peak inhale), category-colored
4. **Inner Shimmer** -- 65% of orb size, 2-second pulse cycle
5. **Core Light** -- 25% of orb size, brightest point

**Phase animations:**
- **Inhale:** Expand to 1.35-1.5x, glow rises to 0.7-1.0 (cubic ease-out)
- **Hold In:** Spring physics (damping 20, stiffness 80), glow holds at 0.8
- **Exhale:** Contract to 0.75x, glow fades to 0.15 (cubic ease-in)
- **Hold Out:** Settle to 0.7x, glow drops to 0.05
- **Idle:** Sine-wave breathing 0.95x-1.05x on a 3-second cycle

Base orb size: 55% of screen width, max 260pt.

### 3.3 Aurora Background

Living background that reflects the user's autonomic nervous system state. Two animated overlay
layers with independent pulse and drift animations.

| Polyvagal State | Pulse Speed | Colors | Feel |
|-----------------|-------------|--------|------|
| Ventral (Calm) | 6s cycle | Bioluminescent teal + Neural purple | Serene, oceanic |
| Sympathetic (Alert) | 4s cycle | Amber + Heart pink | Warm, energized |
| Dorsal (Rest) | 8s cycle | Fog grey + Dim text | Still, withdrawn |

---

## 4. Tech Stack

### 4.1 Core Framework

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React Native | 0.81.x |
| Platform | Expo | SDK 54 |
| Routing | expo-router | 6.x |
| Architecture | New Architecture (Fabric + TurboModules) | Enabled |
| Language | TypeScript | 5.9.x |

### 4.2 Animation & Interaction

| Library | Version | Purpose |
|---------|---------|---------|
| react-native-reanimated | 4.x (Reanimated 3 API) | 60fps UI-thread Breath Orb + Aurora |
| react-native-gesture-handler | 2.x | Touch handling |
| react-native-svg | 15.x | Progress rings, vector graphics |
| expo-haptics | 15.x | Phase-synchronized tactile feedback |
| expo-av | 16.x | Audio playback for guided sessions |
| expo-linear-gradient | 15.x | Gradient backgrounds |

### 4.3 State & Storage

| Library | Purpose |
|---------|---------|
| Zustand 5.x | Lightweight reactive store (profile, sessions, settings) |
| AsyncStorage | Local persistence, offline-first |

### 4.4 Backend (Planned)

| Service | Purpose |
|---------|---------|
| Supabase (EU region) | Auth, PostgreSQL, real-time sync, GDPR-native |
| Mistral AI (Paris) | AI breathwork coach, pattern recommendations |

### 4.5 Navigation Map

```
app/
  _layout.tsx            Root layout (fonts, store init)
  index.tsx              Entry / auth gate
  onboarding.tsx         First-run onboarding
  session.tsx            Full-screen breathing session
  (tabs)/
    index.tsx            Home -- daily greeting, quick start
    discover.tsx         Pattern library + category filters
    breathe.tsx          Quick-launch breathing
    insights.tsx         Stats, streaks, achievements
    journey.tsx          Profile, settings, level progress
```

---

## 5. Progressive Access System

### 5.1 Level Definitions

| Level | Title | XP Required | Patterns Unlocked | Description |
|-------|-------|-------------|-------------------|-------------|
| 1 | **Foundation** | 0 | 12 patterns | All parasympathetic basics, clinical basics, Lion's Breath |
| 2 | **Activator** | 500 | +4 patterns | Breath of Fire, Bhastrika, Nadi Shodhana, Qi Gong, Buteyko Walking |
| 3 | **Explorer** | 2,000 | +2 patterns | Wim Hof Method, Tummo |
| 4 | **Transformer** | 5,000 | +4 patterns | Holotropic, DMT Activation, Shamanic, Rebirthing |

### 5.2 XP Economy

- 10 XP per minute of completed breathwork
- Achievement bonuses: 50 to 1,000 XP per milestone
- Streak consistency rewards

### 5.3 Achievements (16 total)

| Category | Examples | XP Range |
|----------|---------|----------|
| Sessions | First Breath (1), Dedicated Breather (10), Breath Master (50), Breath Sage (100) | 50-500 |
| Time | Hour of Power (60m), Deep Diver (10h), Breath Alchemist (50h) | 100-1,000 |
| Streaks | Momentum (3d), Weekly Warrior (7d), Monthly Mastery (30d) | 75-500 |
| Levels | Activator (L2), Explorer (L3), Transformer (L4) | 200-1,000 |
| Buteyko CP | CO2 Tolerant (20s), Breath Efficient (40s), Buteyko Master (60s) | 150-500 |

---

## 6. Monetization

| Tier | Price | Access |
|------|-------|--------|
| **Free** | EUR 0 | Foundation patterns (Level 1), basic session tracking, 7-day history |
| **Premium** | EUR 9.99/mo | All 22 patterns (still level-gated), full history, AI coach, audio guides |
| **Transcend** | EUR 19.99/mo | Everything in Premium + ceremony mode, biometric integrations, community |

No ads. No data selling. Subscription-first with a genuinely useful free tier.

---

## 7. Safety Protocols

### 7.1 Medical Contraindications

Every pattern carries a `contraindications[]` array. The app enforces warnings before session start.

| Contraindication | Affected Patterns |
|-----------------|-------------------|
| Pregnancy | Breath of Fire, Wim Hof, Bhastrika, Tummo, all Transformative |
| Epilepsy | Breath of Fire, Wim Hof, Bhastrika, all Transformative |
| Cardiovascular disease | Wim Hof, Bhastrika, Tummo, all Transformative |
| Hypertension | Wim Hof, Tummo, DMT Activation |
| Psychosis history | All Transformative (Holotropic, DMT, Shamanic, Rebirthing) |
| Glaucoma | Holotropic, DMT Activation |
| Recent surgery | DMT Activation |
| Hernia | Breath of Fire |

### 7.2 Real-Time Polyvagal Monitoring

Continuous autonomic nervous system state estimation across three zones:

| State | Label | Biometric Indicators | Color |
|-------|-------|---------------------|-------|
| Ventral Vagal | Calm & Connected | HRV > 50ms, HR < 70bpm | `#00D4AA` |
| Sympathetic | Alert & Energized | HRV < 20ms or HR > 100bpm | `#FFD93D` |
| Dorsal Vagal | Rest & Restore | HRV < 10ms, HR < 55bpm | `#FF6B9D` |

Without biometric hardware, state is estimated from pattern category and session duration.

**Adaptive recommendations:**
- Ventral: "Optimal state. Maintain with Coherent Breathing or explore deeper practices."
- Sympathetic: "High activation. Try Extended Exhale or Box Breathing to return to balance."
- Dorsal: "Low energy. Start with gentle Diaphragmatic Breathing to activate."

### 7.3 Haptic Safety Feedback

| Event | Haptic Type | Purpose |
|-------|------------|---------|
| Inhale start | Light impact | Cue to breathe in |
| Hold phase | Medium impact | Confirm hold |
| Exhale start | Soft impact | Cue to release |
| Hold out | Silent | Reinforce stillness |
| Free hold | Warning notification | Alert for timed holds |
| Round complete | Success notification | Positive reinforcement |
| Session complete | Success + Heavy | Ceremony-like closure |
| Achievement | Success + 2x Heavy | Celebration |

### 7.4 Session State Machine

```
idle -> preparing -> active <-> paused -> integrating -> reflecting -> complete
```

- **Preparing:** Countdown, contraindication check, consent for advanced patterns
- **Active:** Engine running, haptics firing, orb animating
- **Paused:** Engine frozen, safe resume or exit
- **Integrating:** Post-breathwork stillness (critical for transformative patterns)
- **Reflecting:** Mood check (1-5), session notes, CP score recording
- **Complete:** Summary, XP award, achievement check

---

*Pneuma O2 -- Breathe Beyond*
