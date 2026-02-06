// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Core Type Definitions
// ═══════════════════════════════════════════════════════════════

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'free';

export type SessionState =
  | 'idle'
  | 'preparing'
  | 'active'
  | 'paused'
  | 'integrating'
  | 'reflecting'
  | 'complete';

export type PatternCategory =
  | 'parasympathetic'
  | 'sympathetic'
  | 'clinical'
  | 'transformative';

export type PolyvagalState = 'ventral' | 'sympathetic' | 'dorsal';

export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface BreathPhaseConfig {
  phase: BreathPhase;
  duration: number; // milliseconds, 0 = variable/free
  label: string;
  instruction: string;
  visualIntensity: number; // 0–1
}

export interface BreathPattern {
  id: string;
  name: string;
  nameNL: string;
  subtitle: string;
  category: PatternCategory;
  icon: string;
  description: string;
  descriptionNL: string;
  science: string;
  phases: BreathPhaseConfig[];
  defaultRounds: number; // 0 = infinite/timed
  defaultDurationMs: number;
  bpmRange: string;
  requiredLevel: DifficultyLevel;
  difficulty: string;
  tags: string[];
  contraindications: string[];
}

export interface SessionData {
  id: string;
  patternId: string;
  startedAt: number;
  completedAt?: number;
  durationMs: number;
  roundsCompleted: number;
  avgHeartRate?: number;
  hrvBefore?: number;
  hrvAfter?: number;
  moodBefore?: number; // 1-5
  moodAfter?: number; // 1-5
  notes?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  level: DifficultyLevel;
  totalSessionsCompleted: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  unlockedPatterns: string[];
  favoritePatterns: string[];
  createdAt: number;
  lastSessionAt?: number;
  onboardingComplete: boolean;
  controlPauseScore?: number; // Buteyko CP in seconds
  personalResonanceFreq?: number; // BPM for coherent breathing
}

export interface BiometricState {
  heartRate: number;
  hrv: number; // RMSSD ms
  spo2: number;
  respiratoryRate: number;
  polyvagalState: PolyvagalState;
  coherenceScore: number; // 0–100
  timestamp: number;
}

export interface DailyStats {
  date: string;
  sessionsCompleted: number;
  totalMinutes: number;
  avgMoodBefore: number;
  avgMoodAfter: number;
  patternsUsed: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: number;
  condition: {
    type: 'sessions' | 'minutes' | 'streak' | 'pattern' | 'level' | 'cp_score';
    threshold: number;
    patternId?: string;
  };
}
