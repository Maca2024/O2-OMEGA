import { BreathEngine, BreathEngineCallback } from '../BreathEngine';
import { BreathPattern, SessionConfig, BreathPhase, SessionState, SessionResult } from '../../types/breath';

jest.useFakeTimers();

const testPattern: BreathPattern = {
  id: 'test-box',
  name: 'Test Box',
  nameDutch: 'Test Box',
  category: 'parasympathetic',
  phases: [
    { phase: 'inhale', duration: 1000, instruction: 'Breathe in', visualIntensity: 0.8 },
    { phase: 'holdIn', duration: 1000, instruction: 'Hold', visualIntensity: 1.0 },
    { phase: 'exhale', duration: 1000, instruction: 'Breathe out', visualIntensity: 0.6 },
    { phase: 'holdOut', duration: 1000, instruction: 'Hold', visualIntensity: 0.2 },
  ],
  rounds: 3,
  requiredLevel: 1,
  description: 'Test',
  descriptionDutch: 'Test',
  scienceNote: 'Test',
  bpm: 4,
  durationRange: { min: 1, max: 5 },
  difficulty: 1,
  tags: ['test'],
};

const testConfig: SessionConfig = {
  patternId: 'test-box',
  duration: 5, // 5 minutes
  hapticEnabled: false,
  voiceGuidance: false,
  biometricOverlay: false,
};

function createCallbackSpies(): { [K in keyof BreathEngineCallback]: jest.Mock } {
  return {
    onPhaseChange: jest.fn(),
    onRoundChange: jest.fn(),
    onSessionStateChange: jest.fn(),
    onTick: jest.fn(),
    onBreathCount: jest.fn(),
    onComplete: jest.fn(),
  };
}

describe('BreathEngine', () => {
  let engine: BreathEngine;
  let callbacks: ReturnType<typeof createCallbackSpies>;

  beforeEach(() => {
    callbacks = createCallbackSpies();
    engine = new BreathEngine(callbacks);
  });

  afterEach(() => {
    engine.destroy();
    jest.clearAllTimers();
  });

  describe('loading a pattern', () => {
    it('should load a pattern and config without error', () => {
      expect(() => engine.load(testPattern, testConfig)).not.toThrow();
    });

    it('should be in idle state after loading', () => {
      engine.load(testPattern, testConfig);
      const state = engine.getState();
      expect(state.sessionState).toBe('idle');
      expect(state.patternName).toBe('Test Box');
    });

    it('should reset state when loading a new pattern', () => {
      engine.load(testPattern, testConfig);
      engine.start();
      jest.advanceTimersByTime(2500);
      // Load again — should reset
      engine.load(testPattern, testConfig);
      const state = engine.getState();
      expect(state.sessionState).toBe('idle');
      expect(state.breathCount).toBe(0);
      expect(state.round).toBe(1);
    });

    it('should throw when preparing without a loaded pattern', () => {
      expect(() => engine.prepare()).toThrow('No pattern loaded');
    });

    it('should throw when starting without a loaded pattern', () => {
      expect(() => engine.start()).toThrow('No pattern loaded');
    });
  });

  describe('session state transitions', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should transition idle -> preparing', () => {
      engine.prepare();
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('preparing');
      expect(engine.getState().sessionState).toBe('preparing');
    });

    it('should transition to active on start', () => {
      engine.start();
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('active');
      expect(engine.getState().sessionState).toBe('active');
    });

    it('should transition active -> paused -> active', () => {
      engine.start();
      callbacks.onSessionStateChange.mockClear();

      engine.pause();
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('paused');
      expect(engine.getState().sessionState).toBe('paused');

      callbacks.onSessionStateChange.mockClear();
      engine.resume();
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('active');
      expect(engine.getState().sessionState).toBe('active');
    });

    it('should transition to integrating -> reflecting on stop', () => {
      engine.start();
      callbacks.onSessionStateChange.mockClear();

      engine.stop();
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('integrating');
      expect(engine.getState().sessionState).toBe('integrating');

      jest.advanceTimersByTime(2000);
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('reflecting');
      expect(engine.getState().sessionState).toBe('reflecting');
    });

    it('should transition to complete on complete()', () => {
      engine.start();
      jest.advanceTimersByTime(500);

      engine.complete();
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('complete');
      expect(engine.getState().sessionState).toBe('complete');
    });

    it('should follow full lifecycle: idle -> preparing -> active -> paused -> active -> integrating -> reflecting -> complete', () => {
      const stateLog: SessionState[] = [];
      callbacks.onSessionStateChange.mockImplementation((state: SessionState) => {
        stateLog.push(state);
      });

      engine.prepare();
      engine.start();
      engine.pause();
      engine.resume();
      engine.stop();
      jest.advanceTimersByTime(2000); // triggers reflecting
      engine.complete();

      expect(stateLog).toEqual([
        'preparing',
        'active',
        'paused',
        'active',
        'integrating',
        'reflecting',
        'complete',
      ]);
    });
  });

  describe('phase advancement', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should start on the first phase (inhale)', () => {
      engine.start();
      expect(callbacks.onPhaseChange).toHaveBeenCalledWith(
        'inhale',
        expect.objectContaining({ phase: 'inhale', duration: 1000 }),
        0
      );
    });

    it('should cycle through all four phases: inhale -> holdIn -> exhale -> holdOut', () => {
      engine.start();
      const phaseLog: BreathPhase[] = [];
      callbacks.onPhaseChange.mockImplementation((phase: BreathPhase) => {
        phaseLog.push(phase);
      });
      // The initial phase already fired before our mock override, so capture it manually
      phaseLog.push('inhale');

      // Use 1100ms per phase to account for 16ms tick granularity
      // (transitions happen at tick boundaries, e.g., 1008ms instead of 1000ms)
      jest.advanceTimersByTime(1100);
      jest.advanceTimersByTime(1100);
      jest.advanceTimersByTime(1100);

      expect(phaseLog).toEqual(['inhale', 'holdIn', 'exhale', 'holdOut']);
    });

    it('should return to inhale after holdOut (new round)', () => {
      engine.start();
      const phaseLog: BreathPhase[] = [];
      callbacks.onPhaseChange.mockImplementation((phase: BreathPhase) => {
        phaseLog.push(phase);
      });

      // Complete one full round (4 phases, with tick granularity margin)
      jest.advanceTimersByTime(4500);

      // After a full cycle, it should be back on inhale (round 2)
      expect(phaseLog).toContain('inhale');
      expect(phaseLog[phaseLog.length - 1]).toBe('inhale');
    });
  });

  describe('round counting', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should start at round 1', () => {
      engine.start();
      expect(engine.getState().round).toBe(1);
    });

    it('should advance to round 2 after completing all phases', () => {
      engine.start();
      // Complete round 1 with tick granularity margin (4 phases x ~1008ms each)
      jest.advanceTimersByTime(4500);
      expect(engine.getState().round).toBe(2);
      expect(callbacks.onRoundChange).toHaveBeenCalledWith(2, 3);
    });

    it('should advance to round 3 after two complete cycles', () => {
      engine.start();
      // Complete round 1 + round 2 with margin
      jest.advanceTimersByTime(9000);
      expect(engine.getState().round).toBe(3);
      expect(callbacks.onRoundChange).toHaveBeenCalledWith(3, 3);
    });

    it('should stop after completing all rounds', () => {
      engine.start();
      // Complete all 3 rounds with margin
      jest.advanceTimersByTime(13500);
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('integrating');
    });
  });

  describe('breath counting', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should count the first breath on start (inhale)', () => {
      engine.start();
      expect(callbacks.onBreathCount).toHaveBeenCalledWith(1);
      expect(engine.getState().breathCount).toBe(1);
    });

    it('should increment breath count on each inhale phase', () => {
      engine.start();
      // First inhale already counted (1)
      // Complete round 1 to get to second inhale (with tick granularity margin)
      jest.advanceTimersByTime(4500);
      expect(callbacks.onBreathCount).toHaveBeenCalledWith(2);

      // Complete round 2 to get to third inhale
      jest.advanceTimersByTime(4500);
      expect(callbacks.onBreathCount).toHaveBeenCalledWith(3);

      expect(engine.getState().breathCount).toBe(3);
    });

    it('should not increment breath count on non-inhale phases', () => {
      engine.start();
      const countAfterStart = callbacks.onBreathCount.mock.calls.length;

      // Advance to holdIn (1000ms)
      jest.advanceTimersByTime(1000);
      // Should still be the same count
      expect(callbacks.onBreathCount.mock.calls.length).toBe(countAfterStart);

      // Advance to exhale (another 1000ms)
      jest.advanceTimersByTime(1000);
      expect(callbacks.onBreathCount.mock.calls.length).toBe(countAfterStart);

      // Advance to holdOut (another 1000ms)
      jest.advanceTimersByTime(1000);
      expect(callbacks.onBreathCount.mock.calls.length).toBe(countAfterStart);
    });
  });

  describe('emergency stop', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should immediately set state to complete', () => {
      engine.start();
      engine.emergencyStop();
      expect(engine.getState().sessionState).toBe('complete');
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('complete');
    });

    it('should stop the tick interval', () => {
      engine.start();
      engine.emergencyStop();

      // Advancing timers should not trigger any more phase changes
      const phaseCallCount = callbacks.onPhaseChange.mock.calls.length;
      jest.advanceTimersByTime(10000);
      expect(callbacks.onPhaseChange.mock.calls.length).toBe(phaseCallCount);
    });

    it('should not fire onComplete callback (unlike complete())', () => {
      engine.start();
      engine.emergencyStop();
      expect(callbacks.onComplete).not.toHaveBeenCalled();
    });
  });

  describe('pause and resume', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should not advance phases while paused', () => {
      engine.start();
      // Advance 500ms into the first phase
      jest.advanceTimersByTime(500);

      engine.pause();
      const phaseCallCountAtPause = callbacks.onPhaseChange.mock.calls.length;

      // Advance a lot of time while paused
      jest.advanceTimersByTime(10000);

      // No new phase changes should have occurred
      expect(callbacks.onPhaseChange.mock.calls.length).toBe(phaseCallCountAtPause);
    });

    it('should resume and continue advancing phases', () => {
      engine.start();
      jest.advanceTimersByTime(500);

      engine.pause();
      jest.advanceTimersByTime(5000);

      engine.resume();
      // After resume, the tick interval restarts. The phase timer continues from where it was.
      // Since we were 500ms into a 1000ms phase, advancing another 1000ms should push past it.
      jest.advanceTimersByTime(1000);

      // We should have moved to at least the next phase
      const phaseChanges = callbacks.onPhaseChange.mock.calls;
      expect(phaseChanges.length).toBeGreaterThan(1);
    });

    it('should ignore pause when not active', () => {
      engine.start();
      engine.pause();
      const callCount = callbacks.onSessionStateChange.mock.calls.length;

      // Try to pause again while already paused
      engine.pause();
      expect(callbacks.onSessionStateChange.mock.calls.length).toBe(callCount);
    });

    it('should ignore resume when not paused', () => {
      engine.start();
      const callCount = callbacks.onSessionStateChange.mock.calls.length;

      // Try to resume while active
      engine.resume();
      expect(callbacks.onSessionStateChange.mock.calls.length).toBe(callCount);
    });
  });

  describe('completion callback with result', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should fire onComplete with a SessionResult', () => {
      engine.start();
      jest.advanceTimersByTime(4000); // one full round
      engine.complete();

      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
      const result: SessionResult = callbacks.onComplete.mock.calls[0][0];
      expect(result).toEqual(
        expect.objectContaining({
          patternId: 'test-box',
          totalBreaths: expect.any(Number),
          avgBreathRate: expect.any(Number),
          completionRate: expect.any(Number),
        })
      );
    });

    it('should include correct session timing in result', () => {
      engine.start();
      jest.advanceTimersByTime(8000); // two full rounds
      engine.complete();

      const result: SessionResult = callbacks.onComplete.mock.calls[0][0];
      expect(result.startedAt).toBeGreaterThan(0);
      expect(result.completedAt).toBeGreaterThanOrEqual(result.startedAt);
      expect(result.id).toMatch(/^session_\d+$/);
    });

    it('should report correct breath count in result', () => {
      engine.start();
      // Complete 2 full rounds = 2 inhales
      jest.advanceTimersByTime(8000);
      engine.complete();

      const result: SessionResult = callbacks.onComplete.mock.calls[0][0];
      // Started with 1 inhale at start, plus 1 inhale at round 2 = 2 + round 3 inhale = 3
      expect(result.totalBreaths).toBeGreaterThanOrEqual(2);
    });
  });

  describe('session time limit', () => {
    it('should stop the session when duration limit is reached', () => {
      // Use infinite rounds so the engine does not stop due to round completion
      const infinitePattern: BreathPattern = {
        ...testPattern,
        rounds: 'infinite',
      };
      const shortConfig: SessionConfig = {
        patternId: 'test-box',
        duration: 1, // 1 minute = 60000ms
        hapticEnabled: false,
        voiceGuidance: false,
        biometricOverlay: false,
      };

      engine.load(infinitePattern, shortConfig);
      engine.start();

      // Advance to just before the time limit
      jest.advanceTimersByTime(59000);
      // Should still be active since rounds are infinite and time limit not yet reached
      expect(engine.getState().sessionState).toBe('active');

      // Advance past the time limit
      jest.advanceTimersByTime(2000);
      expect(callbacks.onSessionStateChange).toHaveBeenCalledWith('integrating');
    });
  });

  describe('getState', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should return correct initial state', () => {
      const state = engine.getState();
      expect(state.sessionState).toBe('idle');
      expect(state.round).toBe(1);
      expect(state.breathCount).toBe(0);
      expect(state.patternName).toBe('Test Box');
    });

    it('should return correct state during active session', () => {
      engine.start();
      jest.advanceTimersByTime(500);
      const state = engine.getState();
      expect(state.sessionState).toBe('active');
      expect(state.phase).toBe('inhale');
      expect(state.breathCount).toBe(1);
      expect(state.sessionElapsed).toBeGreaterThan(0);
    });

    it('should report totalRounds from the pattern', () => {
      engine.start();
      const state = engine.getState();
      expect(state.totalRounds).toBe(3);
    });
  });

  describe('tick callback', () => {
    beforeEach(() => {
      engine.load(testPattern, testConfig);
    });

    it('should fire onTick with progress, elapsed, and remaining', () => {
      engine.start();
      jest.advanceTimersByTime(500);

      expect(callbacks.onTick).toHaveBeenCalled();
      const lastCall = callbacks.onTick.mock.calls[callbacks.onTick.mock.calls.length - 1];
      const [progress, elapsed, remaining] = lastCall;

      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(1);
      expect(elapsed).toBeGreaterThan(0);
      expect(remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe('destroy', () => {
    it('should clean up all resources', () => {
      engine.load(testPattern, testConfig);
      engine.start();
      engine.destroy();

      // After destroy, advancing timers should not cause issues
      jest.advanceTimersByTime(10000);
      // Callbacks should not have been called after destroy (callbacks cleared)
      const callsAfterDestroy = callbacks.onPhaseChange.mock.calls.length;
      jest.advanceTimersByTime(10000);
      // Since callbacks object reference was cleared inside the engine,
      // our external mocks should not receive new calls
      expect(callbacks.onPhaseChange.mock.calls.length).toBe(callsAfterDestroy);
    });
  });

  describe('constructor', () => {
    it('should work without callbacks', () => {
      const bareEngine = new BreathEngine();
      bareEngine.load(testPattern, testConfig);
      expect(() => bareEngine.start()).not.toThrow();
      jest.advanceTimersByTime(5000);
      bareEngine.destroy();
    });
  });
});
