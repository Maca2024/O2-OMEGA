import { BiometricService } from '../BiometricService';
import { BiometricState } from '../../types/biometrics';
import { PolyvagalState } from '../../types/breath';

jest.useFakeTimers();

function makeBiometricState(overrides: Partial<BiometricState> = {}): BiometricState {
  return {
    heartRate: 70,
    hrv: 45,
    spo2: 98,
    respiratoryRate: 14,
    polyvagalState: 'ventral',
    coherenceScore: 60,
    timestamp: Date.now(),
    source: 'simulated',
    ...overrides,
  };
}

describe('BiometricService', () => {
  let service: BiometricService;

  beforeEach(() => {
    service = new BiometricService();
  });

  afterEach(() => {
    service.destroy();
    jest.clearAllTimers();
  });

  // ─── Polyvagal State Detection ──────────────────────────────────────

  describe('determinePolyvagalState', () => {
    it('should return ventral for high HRV and low HR (safe & social)', () => {
      // HRV > 40 and HR < 80
      expect(BiometricService.determinePolyvagalState(65, 55)).toBe('ventral');
      expect(BiometricService.determinePolyvagalState(70, 45)).toBe('ventral');
      expect(BiometricService.determinePolyvagalState(60, 60)).toBe('ventral');
    });

    it('should return sympathetic for high HR (fight/flight)', () => {
      // HR > 90 triggers sympathetic regardless of HRV
      expect(BiometricService.determinePolyvagalState(95, 35)).toBe('sympathetic');
      expect(BiometricService.determinePolyvagalState(110, 25)).toBe('sympathetic');
    });

    it('should return sympathetic for low HRV (fight/flight)', () => {
      // HRV < 30 triggers sympathetic (when not dorsal)
      expect(BiometricService.determinePolyvagalState(75, 20)).toBe('sympathetic');
      expect(BiometricService.determinePolyvagalState(80, 25)).toBe('sympathetic');
    });

    it('should return dorsal for very low HRV and very low HR (freeze)', () => {
      // HRV < 20 and HR < 55
      expect(BiometricService.determinePolyvagalState(50, 15)).toBe('dorsal');
      expect(BiometricService.determinePolyvagalState(45, 10)).toBe('dorsal');
    });

    it('should return ventral as the default for moderate values', () => {
      // Not matching sympathetic or dorsal thresholds: HRV >= 30, HR <= 90
      expect(BiometricService.determinePolyvagalState(75, 35)).toBe('ventral');
      expect(BiometricService.determinePolyvagalState(85, 38)).toBe('ventral');
    });

    it('should prioritize ventral check over dorsal for high HRV + low HR', () => {
      // HR < 55 but HRV > 40 should still be ventral (first rule wins)
      expect(BiometricService.determinePolyvagalState(50, 50)).toBe('ventral');
    });

    it('should classify dorsal only when HRV is genuinely low', () => {
      // HR < 55 and HRV < 20 => dorsal
      expect(BiometricService.determinePolyvagalState(54, 19)).toBe('dorsal');
      // HR < 55 but HRV >= 20 and < 30 => sympathetic (low HRV rule)
      expect(BiometricService.determinePolyvagalState(54, 25)).toBe('sympathetic');
    });
  });

  // ─── Coherence Calculation ──────────────────────────────────────────

  describe('calculateCoherence', () => {
    it('should return 50 for arrays with fewer than 3 values', () => {
      expect(BiometricService.calculateCoherence([])).toBe(50);
      expect(BiometricService.calculateCoherence([40])).toBe(50);
      expect(BiometricService.calculateCoherence([40, 42])).toBe(50);
    });

    it('should return high coherence (near 100) for uniform HRV values', () => {
      // All identical values => CV = 0 => coherence = 100
      const uniform = [50, 50, 50, 50, 50];
      expect(BiometricService.calculateCoherence(uniform)).toBe(100);
    });

    it('should return high coherence for very consistent HRV values', () => {
      const consistent = [49, 50, 51, 50, 49];
      const score = BiometricService.calculateCoherence(consistent);
      expect(score).toBeGreaterThanOrEqual(90);
    });

    it('should return low coherence for highly erratic HRV values', () => {
      const erratic = [10, 80, 15, 90, 5, 85];
      const score = BiometricService.calculateCoherence(erratic);
      expect(score).toBeLessThan(30);
    });

    it('should clamp the result between 0 and 100', () => {
      // Extremely erratic values that would push the score negative
      const extreme = [1, 100, 1, 100, 1];
      const score = BiometricService.calculateCoherence(extreme);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return a moderate score for moderately variable values', () => {
      const moderate = [40, 50, 45, 55, 42];
      const score = BiometricService.calculateCoherence(moderate);
      expect(score).toBeGreaterThan(30);
      expect(score).toBeLessThan(95);
    });
  });

  // ─── HRV Categorization ────────────────────────────────────────────

  describe('categorizeHRV', () => {
    it('should return "low" for HRV below 20 (stressed)', () => {
      expect(BiometricService.categorizeHRV(5)).toBe('low');
      expect(BiometricService.categorizeHRV(10)).toBe('low');
      expect(BiometricService.categorizeHRV(19)).toBe('low');
    });

    it('should return "normal" for HRV between 20 and 50 inclusive', () => {
      expect(BiometricService.categorizeHRV(20)).toBe('normal');
      expect(BiometricService.categorizeHRV(35)).toBe('normal');
      expect(BiometricService.categorizeHRV(50)).toBe('normal');
    });

    it('should return "high" for HRV above 50 (relaxed)', () => {
      expect(BiometricService.categorizeHRV(51)).toBe('high');
      expect(BiometricService.categorizeHRV(75)).toBe('high');
      expect(BiometricService.categorizeHRV(100)).toBe('high');
    });

    it('should handle boundary values correctly', () => {
      expect(BiometricService.categorizeHRV(19)).toBe('low');
      expect(BiometricService.categorizeHRV(20)).toBe('normal');
      expect(BiometricService.categorizeHRV(50)).toBe('normal');
      expect(BiometricService.categorizeHRV(51)).toBe('high');
    });
  });

  // ─── Resonant Frequency Detection ──────────────────────────────────

  describe('findResonantFrequency', () => {
    it('should return the BPM with the highest HRV', () => {
      const hrvAtBPMs: Record<number, number> = {
        4.0: 35,
        4.5: 42,
        5.0: 55,
        5.5: 68,
        6.0: 62,
        6.5: 48,
      };
      expect(BiometricService.findResonantFrequency(hrvAtBPMs)).toBe(5.5);
    });

    it('should return the first highest when multiple BPMs tie', () => {
      const hrvAtBPMs: Record<number, number> = {
        5.0: 50,
        5.5: 50,
        6.0: 40,
      };
      // Object.entries iteration order for numeric keys is ascending
      const result = BiometricService.findResonantFrequency(hrvAtBPMs);
      expect(result).toBe(5.0);
    });

    it('should return default 5.5 for empty input', () => {
      expect(BiometricService.findResonantFrequency({})).toBe(5.5);
    });

    it('should handle a single BPM entry', () => {
      const hrvAtBPMs: Record<number, number> = { 6.0: 70 };
      expect(BiometricService.findResonantFrequency(hrvAtBPMs)).toBe(6.0);
    });

    it('should correctly parse decimal BPM keys', () => {
      const hrvAtBPMs: Record<number, number> = {
        4.5: 30,
        5.25: 65,
        6.75: 45,
      };
      expect(BiometricService.findResonantFrequency(hrvAtBPMs)).toBe(5.25);
    });
  });

  // ─── Daily Summary Generation ──────────────────────────────────────

  describe('generateDailySummary', () => {
    it('should return zeroed summary for empty sessions array', () => {
      const summary = service.generateDailySummary([]);
      expect(summary.avgHRV).toBe(0);
      expect(summary.avgRestingHR).toBe(0);
      expect(summary.avgSpO2).toBe(0);
      expect(summary.dominantState).toBe('ventral');
      expect(summary.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should calculate correct averages from session data', () => {
      const sessions: BiometricState[] = [
        makeBiometricState({ heartRate: 70, hrv: 40, spo2: 97, polyvagalState: 'ventral' }),
        makeBiometricState({ heartRate: 80, hrv: 50, spo2: 99, polyvagalState: 'ventral' }),
        makeBiometricState({ heartRate: 60, hrv: 30, spo2: 98, polyvagalState: 'sympathetic' }),
      ];
      const summary = service.generateDailySummary(sessions);
      expect(summary.avgHRV).toBe(40);          // (40+50+30)/3 = 40
      expect(summary.avgRestingHR).toBe(70);     // (70+80+60)/3 = 70
      expect(summary.avgSpO2).toBe(98);           // (97+99+98)/3 = 98
    });

    it('should correctly identify dominant polyvagal state', () => {
      const sessions: BiometricState[] = [
        makeBiometricState({ polyvagalState: 'sympathetic' }),
        makeBiometricState({ polyvagalState: 'sympathetic' }),
        makeBiometricState({ polyvagalState: 'sympathetic' }),
        makeBiometricState({ polyvagalState: 'ventral' }),
        makeBiometricState({ polyvagalState: 'dorsal' }),
      ];
      const summary = service.generateDailySummary(sessions);
      expect(summary.dominantState).toBe('sympathetic');
    });

    it('should handle a single session correctly', () => {
      const sessions: BiometricState[] = [
        makeBiometricState({ heartRate: 72, hrv: 48, spo2: 98.5, polyvagalState: 'ventral' }),
      ];
      const summary = service.generateDailySummary(sessions);
      expect(summary.avgHRV).toBe(48);
      expect(summary.avgRestingHR).toBe(72);
      expect(summary.avgSpO2).toBe(98.5);
      expect(summary.dominantState).toBe('ventral');
    });

    it('should round HRV and HR to integers and SpO2 to one decimal', () => {
      const sessions: BiometricState[] = [
        makeBiometricState({ heartRate: 71, hrv: 41, spo2: 97.3 }),
        makeBiometricState({ heartRate: 72, hrv: 42, spo2: 97.8 }),
      ];
      const summary = service.generateDailySummary(sessions);
      // (71+72)/2 = 71.5 => 72 rounded
      expect(summary.avgRestingHR).toBe(72);
      // (41+42)/2 = 41.5 => 42 rounded
      expect(summary.avgHRV).toBe(42);
      // (97.3+97.8)/2 = 97.55 => 97.6 (one decimal)
      expect(summary.avgSpO2).toBe(97.6);
    });

    it('should include the current date in ISO format', () => {
      const summary = service.generateDailySummary([makeBiometricState()]);
      const today = new Date().toISOString().split('T')[0];
      expect(summary.date).toBe(today);
    });
  });

  // ─── Wearable Connection & Capabilities ─────────────────────────────

  describe('connectWearable', () => {
    it('should connect an Apple Watch with full capabilities', async () => {
      const conn = await service.connectWearable('apple_watch');
      expect(conn.type).toBe('apple_watch');
      expect(conn.connected).toBe(true);
      expect(conn.capabilities).toEqual(['hr', 'hrv', 'spo2', 'sleep', 'respiratory']);
      expect(conn.lastSync).toBeGreaterThan(0);
    });

    it('should connect a Samsung Watch with hr, hrv, spo2', async () => {
      const conn = await service.connectWearable('samsung_watch');
      expect(conn.capabilities).toEqual(['hr', 'hrv', 'spo2']);
    });

    it('should connect a Pixel Watch with hr only', async () => {
      const conn = await service.connectWearable('pixel_watch');
      expect(conn.capabilities).toEqual(['hr']);
    });

    it('should connect a Polar with hr and hrv', async () => {
      const conn = await service.connectWearable('polar');
      expect(conn.capabilities).toEqual(['hr', 'hrv']);
    });

    it('should connect a Garmin with hr, hrv, spo2, respiratory', async () => {
      const conn = await service.connectWearable('garmin');
      expect(conn.capabilities).toEqual(['hr', 'hrv', 'spo2', 'respiratory']);
    });

    it('should connect an Oura ring with hr, hrv, sleep, respiratory', async () => {
      const conn = await service.connectWearable('oura');
      expect(conn.capabilities).toEqual(['hr', 'hrv', 'sleep', 'respiratory']);
    });

    it('should connect a Whoop with hr, hrv, sleep, respiratory', async () => {
      const conn = await service.connectWearable('whoop');
      expect(conn.capabilities).toEqual(['hr', 'hrv', 'sleep', 'respiratory']);
    });

    it('should list all connected wearables', async () => {
      await service.connectWearable('apple_watch');
      await service.connectWearable('oura');
      const connected = service.getConnectedWearables();
      expect(connected).toHaveLength(2);
      expect(connected.map(c => c.type)).toContain('apple_watch');
      expect(connected.map(c => c.type)).toContain('oura');
    });

    it('should replace connection when same type is connected again', async () => {
      const first = await service.connectWearable('polar');
      const second = await service.connectWearable('polar');
      expect(service.getConnectedWearables()).toHaveLength(1);
      expect(second.lastSync).toBeGreaterThanOrEqual(first.lastSync);
    });

    it('should disconnect a wearable', async () => {
      await service.connectWearable('apple_watch');
      await service.connectWearable('garmin');
      expect(service.getConnectedWearables()).toHaveLength(2);

      await service.disconnectWearable('apple_watch');
      expect(service.getConnectedWearables()).toHaveLength(1);
      expect(service.getConnectedWearables()[0].type).toBe('garmin');
    });

    it('should handle disconnecting a non-connected wearable gracefully', async () => {
      await expect(service.disconnectWearable('polar')).resolves.toBeUndefined();
    });
  });

  // ─── Subscribe / Unsubscribe Lifecycle ──────────────────────────────

  describe('subscribe/unsubscribe', () => {
    it('should notify listeners when monitoring emits state', () => {
      const listener = jest.fn();
      service.subscribe(listener);
      service.startMonitoring();

      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          heartRate: expect.any(Number),
          hrv: expect.any(Number),
          spo2: expect.any(Number),
          respiratoryRate: expect.any(Number),
          polyvagalState: expect.any(String),
          coherenceScore: expect.any(Number),
          timestamp: expect.any(Number),
          source: 'simulated',
        })
      );
    });

    it('should support multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      service.subscribe(listener1);
      service.subscribe(listener2);
      service.startMonitoring();

      jest.advanceTimersByTime(1000);
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should stop notifying after unsubscribe', () => {
      const listener = jest.fn();
      const unsubscribe = service.subscribe(listener);
      service.startMonitoring();

      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      jest.advanceTimersByTime(3000);
      // Should still be 1 since we unsubscribed
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should return an unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = service.subscribe(listener);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should handle multiple subscribe/unsubscribe cycles', () => {
      const listener = jest.fn();
      const unsub1 = service.subscribe(listener);
      unsub1();
      const unsub2 = service.subscribe(listener);
      service.startMonitoring();

      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(1);

      unsub2();
      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should accumulate calls over multiple intervals', () => {
      const listener = jest.fn();
      service.subscribe(listener);
      service.startMonitoring();

      jest.advanceTimersByTime(5000);
      expect(listener).toHaveBeenCalledTimes(5);
    });
  });

  // ─── Monitoring Lifecycle ───────────────────────────────────────────

  describe('startMonitoring / stopMonitoring', () => {
    it('should update currentState when monitoring', () => {
      expect(service.getCurrentState()).toBeNull();
      service.startMonitoring();

      jest.advanceTimersByTime(1000);
      const state = service.getCurrentState();
      expect(state).not.toBeNull();
      expect(state!.heartRate).toBeGreaterThan(0);
      expect(state!.source).toBe('simulated');
    });

    it('should stop emitting after stopMonitoring', () => {
      const listener = jest.fn();
      service.subscribe(listener);
      service.startMonitoring();

      jest.advanceTimersByTime(2000);
      expect(listener).toHaveBeenCalledTimes(2);

      service.stopMonitoring();
      jest.advanceTimersByTime(5000);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should restart cleanly after stop and start', () => {
      const listener = jest.fn();
      service.subscribe(listener);

      service.startMonitoring();
      jest.advanceTimersByTime(2000);
      service.stopMonitoring();

      listener.mockClear();
      service.startMonitoring();
      jest.advanceTimersByTime(3000);
      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('should not create duplicate intervals on repeated startMonitoring', () => {
      const listener = jest.fn();
      service.subscribe(listener);

      service.startMonitoring();
      service.startMonitoring(); // Should clear the previous interval
      service.startMonitoring(); // Should clear the previous interval

      jest.advanceTimersByTime(3000);
      // Should be exactly 3 calls (1 per second), not 9
      expect(listener).toHaveBeenCalledTimes(3);
    });
  });

  // ─── Simulated State Validity ───────────────────────────────────────

  describe('simulated biometric state', () => {
    it('should produce physiologically plausible values', () => {
      service.startMonitoring();
      jest.advanceTimersByTime(1000);

      const state = service.getCurrentState()!;
      // Heart rate should be in realistic resting range
      expect(state.heartRate).toBeGreaterThanOrEqual(60);
      expect(state.heartRate).toBeLessThanOrEqual(76);
      // HRV should be in a reasonable range
      expect(state.hrv).toBeGreaterThanOrEqual(37);
      expect(state.hrv).toBeLessThanOrEqual(53);
      // SpO2 should be 97-99
      expect(state.spo2).toBeGreaterThanOrEqual(97);
      expect(state.spo2).toBeLessThanOrEqual(99);
      // Respiratory rate around 12-16
      expect(state.respiratoryRate).toBeGreaterThanOrEqual(12);
      expect(state.respiratoryRate).toBeLessThanOrEqual(16);
    });

    it('should include a valid polyvagal state', () => {
      service.startMonitoring();
      jest.advanceTimersByTime(1000);

      const state = service.getCurrentState()!;
      expect(['ventral', 'sympathetic', 'dorsal']).toContain(state.polyvagalState);
    });

    it('should include a timestamp close to now', () => {
      service.startMonitoring();
      jest.advanceTimersByTime(1000);

      const state = service.getCurrentState()!;
      expect(state.timestamp).toBeLessThanOrEqual(Date.now());
      expect(state.timestamp).toBeGreaterThan(Date.now() - 5000);
    });
  });

  // ─── Destroy / Cleanup ─────────────────────────────────────────────

  describe('destroy', () => {
    it('should stop monitoring and clear all state', () => {
      const listener = jest.fn();
      service.subscribe(listener);
      service.startMonitoring();

      jest.advanceTimersByTime(2000);
      expect(listener).toHaveBeenCalledTimes(2);

      service.destroy();
      jest.advanceTimersByTime(5000);
      // No additional calls after destroy
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should clear all wearable connections', async () => {
      await service.connectWearable('apple_watch');
      await service.connectWearable('oura');
      expect(service.getConnectedWearables()).toHaveLength(2);

      service.destroy();
      expect(service.getConnectedWearables()).toHaveLength(0);
    });
  });
});
