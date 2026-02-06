// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — "Liquid Consciousness" Color System
// ═══════════════════════════════════════════════════════════════

export const Colors = {
  // Primary Palette — "Deep Ocean"
  deepSpace: '#0A0E27',
  midnightOcean: '#0F1B3D',
  deepCurrent: '#162447',
  surfaceDark: '#1A2550',

  // Accent Colors
  bioluminescent: '#00D4AA',
  bioluminescentLight: '#00E5C4',
  neuralPurple: '#7B68EE',
  neuralPurpleLight: '#A78BFA',
  heartPink: '#FF6B9D',
  solarGold: '#FFD93D',
  amber: '#FF8C42',

  // Text
  moonlight: '#E8F0FE',
  fogGrey: '#8B95A5',
  dimText: '#5A6478',

  // Polyvagal States
  ventral: '#00D4AA',
  ventralGlow: '#00E5C4',
  sympathetic: '#FFD93D',
  sympatheticGlow: '#FF8C42',
  dorsal: '#FF6B9D',
  dorsalGlow: '#FF4757',
  transformative: '#7B68EE',
  transformativeGlow: '#C084FC',

  // Categories
  parasympatheticPrimary: '#00D4AA',
  parasympatheticBg: '#0A2A2A',
  sympatheticPrimary: '#FFD93D',
  sympatheticBg: '#2A2A0A',
  clinicalPrimary: '#4DA6FF',
  clinicalBg: '#0A1A2A',
  transformativePrimary: '#7B68EE',
  transformativeBg: '#1A0A2A',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(10, 14, 39, 0.85)',
  overlayLight: 'rgba(10, 14, 39, 0.5)',
  cardBorder: 'rgba(0, 212, 170, 0.15)',
  success: '#00D4AA',
  warning: '#FFD93D',
  error: '#FF4757',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

// Category color mapping
export const CategoryColors: Record<string, { primary: string; bg: string; glow: string }> = {
  parasympathetic: {
    primary: Colors.parasympatheticPrimary,
    bg: Colors.parasympatheticBg,
    glow: Colors.ventralGlow,
  },
  sympathetic: {
    primary: Colors.sympatheticPrimary,
    bg: Colors.sympatheticBg,
    glow: Colors.sympatheticGlow,
  },
  clinical: {
    primary: Colors.clinicalPrimary,
    bg: Colors.clinicalBg,
    glow: '#6BB8FF',
  },
  transformative: {
    primary: Colors.transformativePrimary,
    bg: Colors.transformativeBg,
    glow: Colors.transformativeGlow,
  },
};

// Phase color mapping
export const PhaseColors: Record<string, string> = {
  inhale: '#00D4AA',
  holdIn: '#7B68EE',
  exhale: '#4DA6FF',
  holdOut: '#FFD93D',
  free: '#FF6B9D',
};
