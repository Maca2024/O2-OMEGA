import { create } from 'zustand';
import { PolyvagalState } from '../types/breath';
import { BiometricState, BiometricHistory, WearableConnection, WearableType } from '../types/biometrics';

interface BiometricStore {
  // State
  currentBiometrics: BiometricState | null;
  history: BiometricHistory[];
  connectedWearables: WearableConnection[];
  isMonitoring: boolean;

  // Actions
  updateBiometrics: (biometrics: BiometricState) => void;
  addHistory: (entry: BiometricHistory) => void;
  connectWearable: (wearable: WearableConnection) => void;
  disconnectWearable: (type: WearableType) => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  clearBiometrics: () => void;

  // Derived
  getPolyvagalState: () => PolyvagalState;
}

/**
 * Derives polyvagal state from heart rate and HRV values.
 *
 * Ventral vagal (safe/social): Low HR + High HRV indicates parasympathetic dominance,
 *   the body is calm and socially engaged.
 * Sympathetic (fight/flight): High HR + Low HRV indicates sympathetic activation,
 *   the body is mobilized for action.
 * Dorsal vagal (freeze/shutdown): Low HR + Low HRV indicates dorsal vagal collapse,
 *   a state of immobilization or shutdown.
 */
function derivePolyvagalState(hr: number, hrv: number): PolyvagalState {
  // Thresholds based on clinical breathwork research:
  // HR > 100 bpm with low HRV suggests sympathetic activation
  // HR <= 100 bpm with HRV >= 40ms suggests ventral vagal (calm, regulated)
  // HR <= 100 bpm with HRV < 20ms suggests dorsal vagal (shutdown/freeze)
  if (hr > 100 && hrv < 40) {
    return 'sympathetic';
  }
  if (hrv >= 40) {
    return 'ventral';
  }
  if (hrv < 20) {
    return 'dorsal';
  }
  // Moderate HRV (20-39) with normal HR: lean toward ventral
  return 'ventral';
}

export const useBiometricStore = create<BiometricStore>((set, get) => ({
  currentBiometrics: null,
  history: [],
  connectedWearables: [],
  isMonitoring: false,

  updateBiometrics: (biometrics) => set({
    currentBiometrics: {
      ...biometrics,
      polyvagalState: derivePolyvagalState(biometrics.heartRate, biometrics.hrv),
    },
  }),

  addHistory: (entry) => set((state) => ({
    history: [...state.history, entry],
  })),

  connectWearable: (wearable) => set((state) => {
    // Replace existing connection of the same type, or add new
    const existing = state.connectedWearables.findIndex((w) => w.type === wearable.type);
    if (existing >= 0) {
      const updated = [...state.connectedWearables];
      updated[existing] = wearable;
      return { connectedWearables: updated };
    }
    return { connectedWearables: [...state.connectedWearables, wearable] };
  }),

  disconnectWearable: (type) => set((state) => ({
    connectedWearables: state.connectedWearables.map((w) =>
      w.type === type ? { ...w, connected: false } : w
    ),
  })),

  startMonitoring: () => set({ isMonitoring: true }),

  stopMonitoring: () => set({ isMonitoring: false }),

  clearBiometrics: () => set({
    currentBiometrics: null,
    isMonitoring: false,
  }),

  getPolyvagalState: () => {
    const biometrics = get().currentBiometrics;
    if (!biometrics) return 'ventral';
    return derivePolyvagalState(biometrics.heartRate, biometrics.hrv);
  },
}));
