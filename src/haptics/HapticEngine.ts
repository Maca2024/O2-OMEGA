import { BreathPhase } from '../types/breath';

export interface HapticWave {
  type: 'continuous' | 'pulse' | 'impact' | 'off';
  intensity: number | { start: number; end: number };
  curve?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  interval?: number; // ms, for pulse type
  sharpness?: number; // 0-1, for impact type
}

export const HAPTIC_PATTERNS: Record<BreathPhase, HapticWave> = {
  inhale: {
    type: 'continuous',
    intensity: { start: 0.1, end: 0.6 },
    curve: 'easeInOut',
  },
  holdIn: {
    type: 'pulse',
    intensity: 0.3,
    interval: 1000,
  },
  exhale: {
    type: 'continuous',
    intensity: { start: 0.6, end: 0.05 },
    curve: 'easeOut',
  },
  holdOut: {
    type: 'off',
    intensity: 0,
  },
  free: {
    type: 'off',
    intensity: 0,
  },
};

export const HAPTIC_EVENTS = {
  achievement: { type: 'impact' as const, intensity: 0.8, sharpness: 0.5 },
  roundComplete: { type: 'impact' as const, intensity: 0.6, sharpness: 0.3 },
  sessionStart: { type: 'impact' as const, intensity: 0.5, sharpness: 0.7 },
  sessionEnd: { type: 'impact' as const, intensity: 0.4, sharpness: 0.2 },
  warning: { type: 'impact' as const, intensity: 1.0, sharpness: 1.0 },
};

export class HapticEngine {
  private enabled: boolean = true;
  private currentPhase: BreathPhase | null = null;
  private pulseInterval: ReturnType<typeof setInterval> | null = null;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stop();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Start haptic feedback for a breath phase
  startPhaseHaptic(phase: BreathPhase): void {
    if (!this.enabled) return;
    this.stop();
    this.currentPhase = phase;
    const pattern = HAPTIC_PATTERNS[phase];

    if (pattern.type === 'off') return;

    if (pattern.type === 'pulse' && pattern.interval) {
      this.pulseInterval = setInterval(() => {
        this.triggerImpact(typeof pattern.intensity === 'number' ? pattern.intensity : 0.3);
      }, pattern.interval);
    }
    // For continuous type, in production would use expo-haptics continuous feedback
  }

  // Trigger a one-shot haptic event
  triggerEvent(event: keyof typeof HAPTIC_EVENTS): void {
    if (!this.enabled) return;
    const config = HAPTIC_EVENTS[event];
    this.triggerImpact(typeof config.intensity === 'number' ? config.intensity : 0.5);
  }

  // Get interpolated intensity for continuous patterns (0-1 progress through phase)
  getIntensityAtProgress(phase: BreathPhase, progress: number): number {
    const pattern = HAPTIC_PATTERNS[phase];
    if (typeof pattern.intensity === 'number') return pattern.intensity;
    if (typeof pattern.intensity === 'object') {
      const { start, end } = pattern.intensity;
      // Apply curve
      let t = progress;
      if (pattern.curve === 'easeIn') t = t * t;
      else if (pattern.curve === 'easeOut') t = 1 - (1 - t) * (1 - t);
      else if (pattern.curve === 'easeInOut') t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      return start + (end - start) * t;
    }
    return 0;
  }

  private triggerImpact(_intensity: number): void {
    // In production: Haptics.impactAsync(mapIntensityToStyle(intensity))
  }

  stop(): void {
    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }
    this.currentPhase = null;
  }

  getCurrentPhase(): BreathPhase | null {
    return this.currentPhase;
  }

  destroy(): void {
    this.stop();
  }
}
