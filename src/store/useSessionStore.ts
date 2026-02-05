import { create } from 'zustand';
import { BreathPhase, SessionState, PhaseConfig, SessionResult } from '../types/breath';

interface SessionStore {
  // Current session state
  sessionState: SessionState;
  currentPhase: BreathPhase;
  currentPhaseConfig: PhaseConfig | null;
  phaseProgress: number; // 0-1
  phaseRemaining: number; // ms
  currentRound: number;
  totalRounds: number | 'infinite';
  breathCount: number;
  sessionElapsed: number; // ms
  selectedPatternId: string | null;
  selectedDuration: number; // minutes

  // Results
  lastResult: SessionResult | null;

  // Actions
  setSessionState: (state: SessionState) => void;
  updatePhase: (phase: BreathPhase, config: PhaseConfig | null, progress: number, remaining: number) => void;
  setRound: (round: number, total: number | 'infinite') => void;
  setBreathCount: (count: number) => void;
  setSessionElapsed: (elapsed: number) => void;
  selectPattern: (patternId: string) => void;
  setDuration: (minutes: number) => void;
  setLastResult: (result: SessionResult) => void;
  reset: () => void;
}

const initialState = {
  sessionState: 'idle' as SessionState,
  currentPhase: 'inhale' as BreathPhase,
  currentPhaseConfig: null,
  phaseProgress: 0,
  phaseRemaining: 0,
  currentRound: 1,
  totalRounds: 1 as number | 'infinite',
  breathCount: 0,
  sessionElapsed: 0,
  selectedPatternId: null,
  selectedDuration: 5,
  lastResult: null,
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,

  setSessionState: (state) => set({ sessionState: state }),
  updatePhase: (phase, config, progress, remaining) => set({
    currentPhase: phase,
    currentPhaseConfig: config,
    phaseProgress: progress,
    phaseRemaining: remaining,
  }),
  setRound: (round, total) => set({ currentRound: round, totalRounds: total }),
  setBreathCount: (count) => set({ breathCount: count }),
  setSessionElapsed: (elapsed) => set({ sessionElapsed: elapsed }),
  selectPattern: (patternId) => set({ selectedPatternId: patternId }),
  setDuration: (minutes) => set({ selectedDuration: minutes }),
  setLastResult: (result) => set({ lastResult: result }),
  reset: () => set({ ...initialState }),
}));
