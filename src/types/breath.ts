export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'free';
export type SessionState = 'idle' | 'preparing' | 'active' | 'paused' | 'integrating' | 'reflecting' | 'complete';
export type PatternCategory = 'parasympathetic' | 'sympathetic' | 'clinical' | 'transformative';
export type AccessLevel = 1 | 2 | 3 | 4;
export type PolyvagalState = 'ventral' | 'sympathetic' | 'dorsal';

export interface PhaseConfig {
  phase: BreathPhase;
  duration: number;
  instruction: string;
  visualIntensity: number;
}

export interface BreathPattern {
  id: string;
  name: string;
  nameDutch: string;
  category: PatternCategory;
  phases: PhaseConfig[];
  rounds: number | 'infinite';
  requiredLevel: AccessLevel;
  description: string;
  descriptionDutch: string;
  scienceNote: string;
  bpm: number | null;
  durationRange: { min: number; max: number };
  difficulty: 1 | 2 | 3 | 4;
  tags: string[];
  safetyWarning?: string;
  biometricThresholds?: {
    maxHR: number;
    minSpO2: number;
  };
}

export interface SessionConfig {
  patternId: string;
  duration: number;
  rounds?: number;
  soundscape?: string;
  hapticEnabled: boolean;
  voiceGuidance: boolean;
  biometricOverlay: boolean;
}

export interface SessionResult {
  id: string;
  patternId: string;
  startedAt: number;
  completedAt: number;
  totalBreaths: number;
  avgBreathRate: number;
  completionRate: number;
  moodBefore?: number;
  moodAfter?: number;
  journalEntry?: string;
  biometrics?: SessionBiometrics;
}

export interface SessionBiometrics {
  avgHR: number;
  minHR: number;
  maxHR: number;
  avgHRV: number;
  startHRV: number;
  endHRV: number;
  avgSpO2: number;
  minSpO2: number;
  coherenceScore: number;
}
