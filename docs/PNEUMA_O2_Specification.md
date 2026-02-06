# Pneuma O2 — Product Specification

**Version:** 1.0 | **Date:** February 2026
**Platform:** Mobile-First (iOS + Android) with Web Companion

> *"Adem is de brug tussen lichaam en bewustzijn"*

---

## 1. Product Vision

Pneuma O2 is the world's most advanced breathwork platform — the first to cover the full spectrum from clinical Buteyko to transformative DMT Activation Protocol in a single app with real-time biometric feedback, polyvagal state tracking, and AI personalization.

**Target Market:** $1.1B → $2.5B (12.8% CAGR) breathwork/meditation market.

**Key Differentiators:**
- 20+ scientifically-backed breathing patterns across 4 categories
- Real-time autonomic nervous system visualization (polyvagal mapping)
- Progressive Access System with medical safeguards
- "Liquid Consciousness" generative visual design
- EU data sovereign architecture

---

## 2. Breathing Pattern Library (20+ Patterns)

### Parasympathetic (Calming)
| Pattern | Timing | Level |
|---------|--------|-------|
| Coherent Breathing | 5.5s in : 5.5s out | 1 |
| 4-7-8 (Dr. Weil) | 4s : 7s hold : 8s out | 1 |
| Box Breathing (Navy SEAL) | 4:4:4:4 | 1 |
| Diaphragmatic | 4s in : 6s out | 1 |
| Nadi Shodhana | 4:4:4:4 alternating | 2 |
| Extended Exhale | 4s in : 8s out | 1 |
| Physiological Sigh | 2x inhale + 6s out | 1 |
| Qi Gong | 4:4:6:2 | 2 |

### Sympathetic (Activating)
| Pattern | Timing | Level |
|---------|--------|-------|
| Breath of Fire (Kapalabhati) | 60-120 bpm rapid | 2 |
| Wim Hof Method | 30x power + retention | 3 |
| Bhastrika | 30 bpm rapid equal | 2 |
| Tummo (Inner Fire) | 4:5:4 + visualization | 3 |
| Lion's Breath | deep + explosive out | 1 |

### Clinical (Buteyko)
| Pattern | Timing | Level |
|---------|--------|-------|
| Buteyko Basic | reduced breathing | 1 |
| Control Pause Test | hold measurement | 1 |
| Buteyko Sleep | gentle reduced + scan | 1 |
| Buteyko Walking | hold + walk 20-30 steps | 2 |

### Transformative (Consciousness Expansion)
| Pattern | Timing | Level |
|---------|--------|-------|
| Holotropic Breathwork | 20-30 bpm connected | 4 |
| DMT Activation "THE BRIDGE" | 5-phase journey | 4 |
| Shamanic Breathwork | circular + music | 4 |
| Rebirthing | connected + surrender | 4 |

---

## 3. Design System — "Liquid Consciousness"

### Color Palette (Deep Ocean)
- `#0A0E27` Deep Space (background)
- `#0F1B3D` Midnight Ocean (surfaces)
- `#00D4AA` Bioluminescent (primary accent)
- `#7B68EE` Neural Purple (secondary)
- `#FF6B9D` Heart Pink (HR data)
- `#FFD93D` Solar Gold (achievements)

### Polyvagal State Colors
- Ventral Vagal: `#00D4AA` teal (calm, connected)
- Sympathetic: `#FFD93D → #FF8C42` amber (alert, energized)
- Dorsal Vagal: `#FF6B9D → #FF4757` rose (rest, restore)
- Transformative: `#7B68EE → #C084FC` purple spectrum

### Core Visual Elements
1. **Breath Orb** — Generative, organic bioluminescent entity (not a simple circle)
2. **Polyvagal Status Bar** — Real-time ANS state position indicator
3. **Nervous System Aurora** — Living background reflecting autonomic state
4. **Phase-synced haptics** — Tactile feedback matching breath rhythm

---

## 4. Technical Architecture

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React Native + Expo SDK 54 | Cross-platform, native performance |
| Animation | Reanimated 3 + Skia | 60fps GPU-accelerated visuals |
| State | Zustand + React Query | Lightweight, TypeScript-native |
| Backend | Supabase (EU region) | PostgreSQL, auth, edge functions |
| AI Engine | Mistral AI (Paris) | EU-based, GDPR-compliant |
| Audio | expo-av + custom DSP | Low-latency, haptic sync |
| Haptics | expo-haptics | Breath-synced feedback |
| Analytics | PostHog (EU-hosted) | GDPR-compliant tracking |
| Hosting | Hetzner Cloud (Helsinki) | EU data sovereignty |
| Payments | RevenueCat | Cross-platform subscriptions |

---

## 5. Progressive Access System

| Level | Title | Requirements | Unlocks |
|-------|-------|-------------|---------|
| 1 | Foundation | Onboarding complete | All parasympathetic, basic Buteyko |
| 2 | Activator | 10 sessions + 3 hours | Breath of Fire, Bhastrika, Wim Hof Lite |
| 3 | Explorer | 30 sessions + 15 hours | Full Wim Hof, Advanced Buteyko, 30+ min sessions |
| 4 | Transformer | 50+ hours + qualifications | Holotropic, DMT Protocol, Shamanic, Rebirthing |

**Level 4 Requirements:** Knowledge test, medical questionnaire, informed consent, emergency contact.

---

## 6. Monetization

| Tier | Price | Features |
|------|-------|---------|
| Free | €0 | 5 patterns, 3 sessions/week, basic timer |
| Premium | €9.99/month | All 20+ patterns, unlimited, HRV, AI coach |
| Transcend | €19.99/month | Transformative protocols, group sessions, therapist mode |

**Revenue Target:** ARR €576K (Y1) → €10.1M (Y3)

---

## 7. Safety Protocols

### Medical Contraindications (Block Level 4)
Epilepsy, cardiovascular disease, recent stroke/MI, uncontrolled hypertension, pregnancy, psychotic history, uncontrolled asthma, glaucoma, recent surgery.

### Real-time Monitoring
- HR > 180 bpm for 30s → gentle alert + shift to coherent breathing
- SpO₂ < 85% for 60s → immediate stop + normal breathing prompt
- Emergency button → session stop + grounding + 112/911 option
- 5-minute check-ins during Level 4 sessions

---

*Pneuma O2 — Breathe Beyond*
*© 2026 Aetherlink AI Consultancy*
