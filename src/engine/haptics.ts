// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Haptic Feedback Engine
// Synchronized tactile feedback for breathing phases
// ═══════════════════════════════════════════════════════════════

import * as Haptics from 'expo-haptics';
import { BreathPhase } from '../types/breathing';

let lastHapticTime = 0;
const MIN_HAPTIC_INTERVAL = 200; // ms

export async function triggerPhaseHaptic(phase: BreathPhase): Promise<void> {
  const now = Date.now();
  if (now - lastHapticTime < MIN_HAPTIC_INTERVAL) return;
  lastHapticTime = now;

  try {
    switch (phase) {
      case 'inhale':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'holdIn':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'exhale':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        break;
      case 'holdOut':
        // Silence — no haptic
        break;
      case 'free':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  } catch {
    // Haptics not available on this device
  }
}

export async function triggerPhaseTransition(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Haptics not available
  }
}

export async function triggerRoundComplete(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics not available
  }
}

export async function triggerSessionComplete(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(async () => {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch { /* noop */ }
    }, 300);
  } catch {
    // Haptics not available
  }
}

export async function triggerAchievement(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(async () => {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch { /* noop */ }
    }, 200);
    setTimeout(async () => {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch { /* noop */ }
    }, 400);
  } catch {
    // Haptics not available
  }
}

export async function triggerSelection(): Promise<void> {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics not available
  }
}
