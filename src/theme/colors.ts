export const Colors = {
  // Primary Palette - "Deep Ocean"
  deepSpace: '#0A0E27',
  midnightOcean: '#0F1B3D',
  deepCurrent: '#162447',

  // Accent Colors
  bioluminescent: '#00D4AA',
  bioluminescentLight: '#00E5C4',
  neuralPurple: '#7B68EE',
  neuralPurpleLight: '#A78BFA',
  heartPink: '#FF6B9D',
  solarGold: '#FFD93D',

  // Text
  moonlight: '#E8F0FE',
  fogGrey: '#8B95A5',
  dimGrey: '#4A5568',

  // Semantic - Polyvagal States
  ventral: '#00D4AA',
  ventralGlow: '#00E5C4',
  sympathetic: '#FFD93D',
  sympatheticGlow: '#FF8C42',
  dorsal: '#FF6B9D',
  dorsalGlow: '#FF4757',
  transformative: '#7B68EE',
  transformativeGlow: '#C084FC',
  clinical: '#4A9EFF',

  // Category colors
  parasympatheticColor: '#00D4AA',
  sympatheticColor: '#FFD93D',
  clinicalColor: '#4A9EFF',
  transformativeColor: '#7B68EE',

  // Utility
  success: '#00D4AA',
  warning: '#FFD93D',
  error: '#FF4757',
  overlay: 'rgba(10, 14, 39, 0.85)',
  cardBorder: 'rgba(0, 212, 170, 0.15)',

  // Gradients (as arrays for LinearGradient)
  gradientVentral: ['#00D4AA', '#00E5C4'],
  gradientSympathetic: ['#FFD93D', '#FF8C42'],
  gradientDorsal: ['#FF6B9D', '#FF4757'],
  gradientTransformative: ['#7B68EE', '#A78BFA', '#C084FC'],
  gradientBackground: ['#0A0E27', '#0F1B3D', '#162447'],
  gradientCard: ['rgba(22, 36, 71, 0.8)', 'rgba(15, 27, 61, 0.6)'],
} as const;
