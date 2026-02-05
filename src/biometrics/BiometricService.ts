import { BiometricState, BiometricHistory, WearableConnection, WearableType } from '../types/biometrics';
import { PolyvagalState } from '../types/breath';

export class BiometricService {
  private connections: Map<WearableType, WearableConnection> = new Map();
  private currentState: BiometricState | null = null;
  private listeners: Set<(state: BiometricState) => void> = new Set();
  private simulationInterval: ReturnType<typeof setInterval> | null = null;

  // Determine polyvagal state from HR and HRV
  static determinePolyvagalState(hr: number, hrv: number): PolyvagalState {
    // High HRV + low HR = ventral vagal (safe & social)
    // Low HRV + high HR = sympathetic (fight/flight)
    // Very low HRV + very low HR = dorsal vagal (freeze)
    if (hrv > 40 && hr < 80) return 'ventral';
    if (hrv < 20 && hr < 55) return 'dorsal';
    if (hrv < 30 || hr > 90) return 'sympathetic';
    return 'ventral';
  }

  // Calculate coherence score from HRV regularity
  static calculateCoherence(hrvValues: number[]): number {
    if (hrvValues.length < 3) return 50;
    const mean = hrvValues.reduce((a, b) => a + b, 0) / hrvValues.length;
    const variance = hrvValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / hrvValues.length;
    const cv = Math.sqrt(variance) / mean; // coefficient of variation
    // Lower CV = higher coherence
    return Math.max(0, Math.min(100, Math.round(100 - cv * 200)));
  }

  // Find personal resonant frequency by testing different BPMs
  static findResonantFrequency(hrvAtBPMs: Record<number, number>): number {
    // The BPM that produces highest HRV is the resonant frequency
    let bestBPM = 5.5;
    let bestHRV = 0;
    for (const [bpm, hrv] of Object.entries(hrvAtBPMs)) {
      if (hrv > bestHRV) {
        bestHRV = hrv;
        bestBPM = parseFloat(bpm);
      }
    }
    return bestBPM;
  }

  // Categorize HRV for adaptive breathing recommendations
  static categorizeHRV(hrv: number): 'low' | 'normal' | 'high' {
    if (hrv < 20) return 'low';      // stressed
    if (hrv > 50) return 'high';     // relaxed, ready for advanced
    return 'normal';
  }

  // Subscribe to biometric updates
  subscribe(listener: (state: BiometricState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Connect to a wearable device
  async connectWearable(type: WearableType): Promise<WearableConnection> {
    const capabilities = this.getCapabilities(type);
    const connection: WearableConnection = {
      type,
      connected: true,
      lastSync: Date.now(),
      capabilities,
    };
    this.connections.set(type, connection);
    return connection;
  }

  async disconnectWearable(type: WearableType): Promise<void> {
    this.connections.delete(type);
  }

  getConnectedWearables(): WearableConnection[] {
    return Array.from(this.connections.values());
  }

  // Start real-time monitoring (uses simulation for dev, real APIs in production)
  startMonitoring(): void {
    this.stopMonitoring();
    // Simulated biometric data for development
    this.simulationInterval = setInterval(() => {
      const state = this.generateSimulatedState();
      this.currentState = state;
      this.listeners.forEach(l => l(state));
    }, 1000);
  }

  stopMonitoring(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  getCurrentState(): BiometricState | null {
    return this.currentState;
  }

  // Generate daily history summary
  generateDailySummary(sessions: BiometricState[]): BiometricHistory {
    if (sessions.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        avgHRV: 0,
        avgRestingHR: 0,
        avgSpO2: 0,
        dominantState: 'ventral',
      };
    }
    const avgHRV = sessions.reduce((s, b) => s + b.hrv, 0) / sessions.length;
    const avgHR = sessions.reduce((s, b) => s + b.heartRate, 0) / sessions.length;
    const avgSpO2 = sessions.reduce((s, b) => s + b.spo2, 0) / sessions.length;

    // Count dominant state
    const stateCounts: Record<PolyvagalState, number> = { ventral: 0, sympathetic: 0, dorsal: 0 };
    sessions.forEach(s => stateCounts[s.polyvagalState]++);
    const dominantState = (Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0][0]) as PolyvagalState;

    return {
      date: new Date().toISOString().split('T')[0],
      avgHRV: Math.round(avgHRV),
      avgRestingHR: Math.round(avgHR),
      avgSpO2: Math.round(avgSpO2 * 10) / 10,
      dominantState,
    };
  }

  private getCapabilities(type: WearableType): ('hr' | 'hrv' | 'spo2' | 'sleep' | 'respiratory')[] {
    switch (type) {
      case 'apple_watch': return ['hr', 'hrv', 'spo2', 'sleep', 'respiratory'];
      case 'samsung_watch': return ['hr', 'hrv', 'spo2'];
      case 'pixel_watch': return ['hr'];
      case 'polar': return ['hr', 'hrv'];
      case 'garmin': return ['hr', 'hrv', 'spo2', 'respiratory'];
      case 'oura': return ['hr', 'hrv', 'sleep', 'respiratory'];
      case 'whoop': return ['hr', 'hrv', 'sleep', 'respiratory'];
      default: return ['hr'];
    }
  }

  private generateSimulatedState(): BiometricState {
    // Realistic resting state simulation with slight variation
    const baseHR = 68;
    const baseHRV = 45;
    const hr = baseHR + Math.round((Math.random() - 0.5) * 10);
    const hrv = baseHRV + Math.round((Math.random() - 0.5) * 15);
    const spo2 = 97 + Math.round(Math.random() * 2);
    const rr = 14 + Math.round((Math.random() - 0.5) * 4);

    return {
      heartRate: hr,
      hrv,
      spo2,
      respiratoryRate: rr,
      polyvagalState: BiometricService.determinePolyvagalState(hr, hrv),
      coherenceScore: 50 + Math.round((Math.random() - 0.5) * 30),
      timestamp: Date.now(),
      source: 'simulated',
    };
  }

  destroy(): void {
    this.stopMonitoring();
    this.listeners.clear();
    this.connections.clear();
  }
}
