import { BreathPhase, SessionState, PhaseConfig, BreathPattern, SessionConfig, SessionResult } from '../types/breath';

export type BreathEngineCallback = {
  onPhaseChange: (phase: BreathPhase, config: PhaseConfig, phaseIndex: number) => void;
  onRoundChange: (round: number, totalRounds: number | 'infinite') => void;
  onSessionStateChange: (state: SessionState) => void;
  onTick: (progress: number, elapsed: number, phaseRemaining: number) => void;
  onBreathCount: (count: number) => void;
  onComplete: (result: SessionResult) => void;
};

export class BreathEngine {
  private pattern: BreathPattern | null = null;
  private config: SessionConfig | null = null;
  private callbacks: Partial<BreathEngineCallback> = {};

  private sessionState: SessionState = 'idle';
  private currentPhaseIndex: number = 0;
  private currentRound: number = 1;
  private breathCount: number = 0;

  private phaseStartTime: number = 0;
  private sessionStartTime: number = 0;
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private pausedAt: number = 0;
  private pausedElapsed: number = 0;

  private readonly TICK_RATE = 16; // ~60fps

  constructor(callbacks?: Partial<BreathEngineCallback>) {
    if (callbacks) this.callbacks = callbacks;
  }

  // Load a pattern and config
  load(pattern: BreathPattern, config: SessionConfig): void {
    this.pattern = pattern;
    this.config = config;
    this.reset();
  }

  // Start preparation phase
  prepare(): void {
    if (!this.pattern) throw new Error('No pattern loaded');
    this.setSessionState('preparing');
  }

  // Start active breathing
  start(): void {
    if (!this.pattern) throw new Error('No pattern loaded');
    this.sessionStartTime = Date.now();
    this.currentPhaseIndex = 0;
    this.currentRound = 1;
    this.breathCount = 0;
    this.setSessionState('active');
    this.startPhase();
  }

  pause(): void {
    if (this.sessionState !== 'active') return;
    this.pausedAt = Date.now();
    this.stopTicking();
    this.setSessionState('paused');
  }

  resume(): void {
    if (this.sessionState !== 'paused') return;
    this.pausedElapsed += Date.now() - this.pausedAt;
    this.setSessionState('active');
    this.startTicking();
  }

  stop(): void {
    this.stopTicking();
    this.setSessionState('integrating');
    // After integration, move to reflecting, then complete
    setTimeout(() => {
      this.setSessionState('reflecting');
    }, 2000);
  }

  complete(): void {
    this.stopTicking();
    const result = this.buildResult();
    this.setSessionState('complete');
    this.callbacks.onComplete?.(result);
  }

  // Emergency stop - immediate halt
  emergencyStop(): void {
    this.stopTicking();
    this.setSessionState('complete');
  }

  // Get current state for UI rendering
  getState() {
    const now = Date.now();
    const phase = this.pattern?.phases[this.currentPhaseIndex];
    const elapsed = phase ? now - this.phaseStartTime : 0;
    const duration = phase?.duration || 0;
    const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;

    return {
      sessionState: this.sessionState,
      phase: phase?.phase || 'free',
      phaseConfig: phase || null,
      phaseIndex: this.currentPhaseIndex,
      phaseProgress: progress,
      phaseElapsed: elapsed,
      phaseRemaining: Math.max(0, duration - elapsed),
      round: this.currentRound,
      totalRounds: this.pattern?.rounds || 1,
      breathCount: this.breathCount,
      sessionElapsed: this.sessionStartTime > 0 ? now - this.sessionStartTime - this.pausedElapsed : 0,
      patternName: this.pattern?.name || '',
    };
  }

  private startPhase(): void {
    if (!this.pattern) return;
    const phase = this.pattern.phases[this.currentPhaseIndex];
    if (!phase) return;

    this.phaseStartTime = Date.now();
    this.callbacks.onPhaseChange?.(phase.phase, phase, this.currentPhaseIndex);

    // Count breaths on inhale
    if (phase.phase === 'inhale') {
      this.breathCount++;
      this.callbacks.onBreathCount?.(this.breathCount);
    }

    this.startTicking();
  }

  private startTicking(): void {
    this.stopTicking();
    this.tickInterval = setInterval(() => this.tick(), this.TICK_RATE);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tick(): void {
    if (!this.pattern || this.sessionState !== 'active') return;

    const phase = this.pattern.phases[this.currentPhaseIndex];
    if (!phase) return;

    const now = Date.now();
    const elapsed = now - this.phaseStartTime;

    if (phase.duration > 0 && elapsed >= phase.duration) {
      this.advancePhase();
    } else {
      const progress = phase.duration > 0 ? Math.min(elapsed / phase.duration, 1) : 0;
      const remaining = Math.max(0, phase.duration - elapsed);
      this.callbacks.onTick?.(progress, elapsed, remaining);
    }

    // Check session time limit
    if (this.config) {
      const sessionElapsed = now - this.sessionStartTime - this.pausedElapsed;
      if (sessionElapsed >= this.config.duration * 60 * 1000) {
        this.stop();
      }
    }
  }

  private advancePhase(): void {
    if (!this.pattern) return;

    this.currentPhaseIndex++;

    if (this.currentPhaseIndex >= this.pattern.phases.length) {
      // End of round
      this.currentPhaseIndex = 0;

      if (this.pattern.rounds !== 'infinite') {
        if (this.currentRound >= this.pattern.rounds) {
          this.stop();
          return;
        }
        this.currentRound++;
      } else {
        this.currentRound++;
      }

      this.callbacks.onRoundChange?.(this.currentRound, this.pattern.rounds);
    }

    this.startPhase();
  }

  private setSessionState(state: SessionState): void {
    this.sessionState = state;
    this.callbacks.onSessionStateChange?.(state);
  }

  private buildResult(): SessionResult {
    const now = Date.now();
    return {
      id: `session_${this.sessionStartTime}`,
      patternId: this.pattern?.id || '',
      startedAt: this.sessionStartTime,
      completedAt: now,
      totalBreaths: this.breathCount,
      avgBreathRate: this.breathCount / ((now - this.sessionStartTime - this.pausedElapsed) / 60000),
      completionRate: this.calculateCompletionRate(),
    };
  }

  private calculateCompletionRate(): number {
    if (!this.pattern || !this.config) return 0;
    const targetDuration = this.config.duration * 60 * 1000;
    const actualDuration = Date.now() - this.sessionStartTime - this.pausedElapsed;
    return Math.min(actualDuration / targetDuration, 1);
  }

  private reset(): void {
    this.stopTicking();
    this.sessionState = 'idle';
    this.currentPhaseIndex = 0;
    this.currentRound = 1;
    this.breathCount = 0;
    this.phaseStartTime = 0;
    this.sessionStartTime = 0;
    this.pausedAt = 0;
    this.pausedElapsed = 0;
  }

  destroy(): void {
    this.stopTicking();
    this.callbacks = {};
    this.pattern = null;
    this.config = null;
  }
}
