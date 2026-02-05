import { PolyvagalState } from './breath';

export interface BiometricState {
  heartRate: number;
  hrv: number;
  spo2: number;
  respiratoryRate: number;
  polyvagalState: PolyvagalState;
  coherenceScore: number;
  timestamp: number;
  source: 'apple_watch' | 'health_connect' | 'bluetooth' | 'simulated';
}

export interface BiometricHistory {
  date: string;
  avgHRV: number;
  avgRestingHR: number;
  avgSpO2: number;
  sleepQuality?: number;
  dominantState: PolyvagalState;
}

export type WearableType = 'apple_watch' | 'samsung_watch' | 'pixel_watch' | 'polar' | 'garmin' | 'oura' | 'whoop';

export interface WearableConnection {
  type: WearableType;
  connected: boolean;
  lastSync: number;
  capabilities: ('hr' | 'hrv' | 'spo2' | 'sleep' | 'respiratory')[];
}
