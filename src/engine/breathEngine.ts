// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Core Breath Engine
// State machine for managing breathing session phases
// ═══════════════════════════════════════════════════════════════

import { BreathPattern, BreathPhaseConfig, SessionState } from '../types/breathing';

export interface EngineState {
  sessionState: SessionState;
  currentPhaseIndex: number;
  currentRound: number;
  phaseElapsedMs: number;
  totalElapsedMs: number;
  isPhaseFreehold: boolean; // for CP test / variable holds
  pattern: BreathPattern | null;
  totalRounds: number;
  totalDurationMs: number;
}

export function createInitialState(): EngineState {
  return {
    sessionState: 'idle',
    currentPhaseIndex: 0,
    currentRound: 1,
    phaseElapsedMs: 0,
    totalElapsedMs: 0,
    isPhaseFreehold: false,
    pattern: null,
    totalRounds: 0,
    totalDurationMs: 0,
  };
}

export function getCurrentPhase(state: EngineState): BreathPhaseConfig | null {
  if (!state.pattern) return null;
  return state.pattern.phases[state.currentPhaseIndex] || null;
}

export function getPhaseProgress(state: EngineState): number {
  const phase = getCurrentPhase(state);
  if (!phase || phase.duration === 0) return 0;
  return Math.min(state.phaseElapsedMs / phase.duration, 1);
}

export function getSessionProgress(state: EngineState): number {
  if (state.totalRounds > 0) {
    const phasesPerRound = state.pattern?.phases.length || 1;
    const totalPhases = state.totalRounds * phasesPerRound;
    const completedPhases = (state.currentRound - 1) * phasesPerRound + state.currentPhaseIndex;
    const phaseProgress = getPhaseProgress(state);
    return (completedPhases + phaseProgress) / totalPhases;
  }
  if (state.totalDurationMs > 0) {
    return Math.min(state.totalElapsedMs / state.totalDurationMs, 1);
  }
  return 0;
}

export function tick(state: EngineState, deltaMs: number): EngineState {
  if (state.sessionState !== 'active' || !state.pattern) return state;

  const next = { ...state };
  next.phaseElapsedMs += deltaMs;
  next.totalElapsedMs += deltaMs;

  const currentPhase = getCurrentPhase(next);

  // Check if timed session is complete
  if (next.totalDurationMs > 0 && next.totalElapsedMs >= next.totalDurationMs) {
    next.sessionState = 'integrating';
    return next;
  }

  // Free hold phase (like CP test) — doesn't auto-advance
  if (currentPhase && currentPhase.duration === 0) {
    next.isPhaseFreehold = true;
    return next;
  }

  // Check if current phase is complete
  if (currentPhase && next.phaseElapsedMs >= currentPhase.duration) {
    next.phaseElapsedMs = next.phaseElapsedMs - currentPhase.duration;
    next.currentPhaseIndex += 1;

    // Check if round is complete
    if (next.currentPhaseIndex >= next.pattern!.phases.length) {
      next.currentPhaseIndex = 0;
      next.currentRound += 1;

      // Check if all rounds complete
      if (next.totalRounds > 0 && next.currentRound > next.totalRounds) {
        next.sessionState = 'integrating';
        return next;
      }
    }
  }

  return next;
}

export function startSession(
  pattern: BreathPattern,
  customRounds?: number,
  customDurationMs?: number
): EngineState {
  const rounds = customRounds ?? pattern.defaultRounds;
  const duration = customDurationMs ?? pattern.defaultDurationMs;

  return {
    sessionState: 'preparing',
    currentPhaseIndex: 0,
    currentRound: 1,
    phaseElapsedMs: 0,
    totalElapsedMs: 0,
    isPhaseFreehold: false,
    pattern,
    totalRounds: rounds,
    totalDurationMs: duration,
  };
}

export function activateSession(state: EngineState): EngineState {
  return { ...state, sessionState: 'active' };
}

export function pauseSession(state: EngineState): EngineState {
  return { ...state, sessionState: 'paused' };
}

export function resumeSession(state: EngineState): EngineState {
  return { ...state, sessionState: 'active' };
}

export function completeFreeholdPhase(state: EngineState): EngineState {
  if (!state.isPhaseFreehold || !state.pattern) return state;

  const next = { ...state };
  next.isPhaseFreehold = false;
  next.phaseElapsedMs = 0;
  next.currentPhaseIndex += 1;

  if (next.currentPhaseIndex >= next.pattern!.phases.length) {
    next.currentPhaseIndex = 0;
    next.currentRound += 1;
    if (next.totalRounds > 0 && next.currentRound > next.totalRounds) {
      next.sessionState = 'integrating';
    }
  }

  return next;
}

export function finishSession(state: EngineState): EngineState {
  return { ...state, sessionState: 'complete' };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatPhaseTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  return seconds.toString();
}
