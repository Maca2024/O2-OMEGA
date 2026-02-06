// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Spacing & Typography Scale
// ═══════════════════════════════════════════════════════════════

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const FontSize = {
  caption: 13,
  body: 16,
  bodyLarge: 18,
  h3: 20,
  h2: 24,
  h1: 32,
  timer: 64,
  hero: 72,
} as const;

export const LineHeight = {
  caption: 18,
  body: 24,
  bodyLarge: 26,
  h3: 28,
  h2: 32,
  h1: 40,
  timer: 72,
  hero: 80,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};
