import { useCallback, useEffect, useRef, useState } from 'react';
import { BreathEngine, BreathEngineCallback } from '../engine';
import { BreathPattern, BreathPhase, PhaseConfig, SessionConfig, SessionResult, SessionState } from '../types/breath';

interface UseBreathSessionReturn {
  sessionState: SessionState;
  currentPhase: BreathPhase;
  currentPhaseConfig: PhaseConfig | null;
  phaseProgress: number;
  phaseRemaining: number;
  currentRound: number;
  totalRounds: number | 'infinite';
  breathCount: number;
  sessionElapsed: number;
  lastResult: SessionResult | null;

  load: (pattern: BreathPattern, config: SessionConfig) => void;
  prepare: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  complete: () => void;
  emergencyStop: () => void;
}

export function useBreathSession(): UseBreathSessionReturn {
  const engineRef = useRef<BreathEngine | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [currentPhaseConfig, setCurrentPhaseConfig] = useState<PhaseConfig | null>(null);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseRemaining, setPhaseRemaining] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState<number | 'infinite'>(1);
  const [breathCount, setBreathCount] = useState(0);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    const callbacks: Partial<BreathEngineCallback> = {
      onPhaseChange: (phase: BreathPhase, config: PhaseConfig) => {
        setCurrentPhase(phase);
        setCurrentPhaseConfig(config);
        setPhaseProgress(0);
        setPhaseRemaining(config.duration);
      },
      onRoundChange: (round: number, total: number | 'infinite') => {
        setCurrentRound(round);
        setTotalRounds(total);
      },
      onSessionStateChange: (state: SessionState) => {
        setSessionState(state);
      },
      onTick: (progress: number, _elapsed: number, remaining: number) => {
        setPhaseProgress(progress);
        setPhaseRemaining(remaining);
      },
      onBreathCount: (count: number) => {
        setBreathCount(count);
      },
      onComplete: (result: SessionResult) => {
        setLastResult(result);
      },
    };

    engineRef.current = new BreathEngine(callbacks);

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  // Update session elapsed on a separate interval
  useEffect(() => {
    if (sessionState !== 'active') return;
    const interval = setInterval(() => {
      const state = engineRef.current?.getState();
      if (state) {
        setSessionElapsed(state.sessionElapsed);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [sessionState]);

  const load = useCallback((pattern: BreathPattern, config: SessionConfig) => {
    engineRef.current?.load(pattern, config);
  }, []);

  const prepare = useCallback(() => engineRef.current?.prepare(), []);
  const start = useCallback(() => engineRef.current?.start(), []);
  const pause = useCallback(() => engineRef.current?.pause(), []);
  const resume = useCallback(() => engineRef.current?.resume(), []);
  const stop = useCallback(() => engineRef.current?.stop(), []);
  const complete = useCallback(() => engineRef.current?.complete(), []);
  const emergencyStop = useCallback(() => engineRef.current?.emergencyStop(), []);

  return {
    sessionState,
    currentPhase,
    currentPhaseConfig,
    phaseProgress,
    phaseRemaining,
    currentRound,
    totalRounds,
    breathCount,
    sessionElapsed,
    lastResult,
    load,
    prepare,
    start,
    pause,
    resume,
    stop,
    complete,
    emergencyStop,
  };
}
