// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Polyvagal State Tracking
// Real-time autonomic nervous system state estimation
// ═══════════════════════════════════════════════════════════════

import { PolyvagalState, PatternCategory } from '../types/breathing';
import { Colors } from '../theme/colors';

export interface PolyvagalReading {
  state: PolyvagalState;
  confidence: number; // 0–1
  label: string;
  description: string;
  color: string;
  glowColor: string;
  position: number; // 0 (dorsal) to 1 (ventral)
}

/**
 * Estimate polyvagal state from available biometric data.
 * Without real HRV hardware, we estimate based on breathing pattern category
 * and session progress.
 */
export function estimatePolyvagalState(
  heartRate?: number,
  hrv?: number,
  currentCategory?: PatternCategory,
  sessionMinutes?: number
): PolyvagalReading {
  // If we have real biometric data
  if (heartRate && hrv) {
    if (hrv > 50 && heartRate < 70) {
      return createReading('ventral', 0.9);
    }
    if (hrv < 20 || heartRate > 100) {
      return createReading('sympathetic', 0.8);
    }
    if (hrv < 10 && heartRate < 55) {
      return createReading('dorsal', 0.7);
    }
    return createReading('ventral', 0.6);
  }

  // Estimate based on breathing category
  if (currentCategory) {
    switch (currentCategory) {
      case 'parasympathetic':
        return createReading('ventral', 0.7);
      case 'sympathetic':
        return createReading('sympathetic', 0.7);
      case 'clinical':
        return createReading('ventral', 0.6);
      case 'transformative':
        return createReading(
          sessionMinutes && sessionMinutes > 15 ? 'sympathetic' : 'ventral',
          0.5
        );
    }
  }

  // Default resting state
  return createReading('ventral', 0.5);
}

function createReading(state: PolyvagalState, confidence: number): PolyvagalReading {
  const stateInfo = POLYVAGAL_INFO[state];
  return {
    state,
    confidence,
    label: stateInfo.label,
    description: stateInfo.description,
    color: stateInfo.color,
    glowColor: stateInfo.glowColor,
    position: stateInfo.position,
  };
}

const POLYVAGAL_INFO: Record<
  PolyvagalState,
  {
    label: string;
    description: string;
    color: string;
    glowColor: string;
    position: number;
  }
> = {
  ventral: {
    label: 'Calm & Connected',
    description: 'Your ventral vagal system is active — safe, social, and creative.',
    color: Colors.ventral,
    glowColor: Colors.ventralGlow,
    position: 1.0,
  },
  sympathetic: {
    label: 'Alert & Energized',
    description: 'Your sympathetic system is active — alert, focused, ready for action.',
    color: Colors.sympatheticPrimary,
    glowColor: Colors.sympatheticGlow,
    position: 0.5,
  },
  dorsal: {
    label: 'Rest & Restore',
    description: 'Your dorsal vagal system is active — conserving energy, going inward.',
    color: Colors.dorsal,
    glowColor: Colors.dorsalGlow,
    position: 0.0,
  },
};

export function getStateRecommendation(state: PolyvagalState): string {
  switch (state) {
    case 'ventral':
      return 'You are in an optimal state. Maintain with Coherent Breathing or explore deeper practices.';
    case 'sympathetic':
      return 'High activation detected. Try Extended Exhale or Box Breathing to return to balance.';
    case 'dorsal':
      return 'Low energy state. Start with gentle Diaphragmatic Breathing to gently activate.';
  }
}
