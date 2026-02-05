import { BreathPhase } from '../types/breath';

export type SoundscapeId =
  | 'ocean_deep' | 'forest_rain' | 'fireplace' | 'arctic_wind'
  | 'cosmic_drift' | 'tribal_drums' | 'resonance_432hz'
  | 'singing_bowls' | 'silence';

export type BinauralPreset = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

export interface AudioLayer {
  id: string;
  type: 'voice' | 'cue' | 'soundscape' | 'binaural';
  volume: number; // 0-1
  isPlaying: boolean;
}

export const SOUNDSCAPES: Record<SoundscapeId, { name: string; nameDutch: string; category: string; icon: string }> = {
  ocean_deep: { name: 'Ocean Deep', nameDutch: 'Diepe Oceaan', category: 'parasympathetic', icon: '🌊' },
  forest_rain: { name: 'Forest Rain', nameDutch: 'Bosregen', category: 'grounding', icon: '🌲' },
  fireplace: { name: 'Fireplace Crackle', nameDutch: 'Haardvuur', category: 'warmth', icon: '🔥' },
  arctic_wind: { name: 'Arctic Wind', nameDutch: 'Arctische Wind', category: 'sympathetic', icon: '❄️' },
  cosmic_drift: { name: 'Cosmic Drift', nameDutch: 'Kosmische Drift', category: 'transformative', icon: '🌌' },
  tribal_drums: { name: 'Tribal Drums', nameDutch: 'Tribale Trommels', category: 'transformative', icon: '🥁' },
  resonance_432hz: { name: '432Hz Resonance', nameDutch: '432Hz Resonantie', category: 'coherent', icon: '🎵' },
  singing_bowls: { name: 'Singing Bowls', nameDutch: 'Klankschalen', category: 'meditation', icon: '🧘' },
  silence: { name: 'Pure Silence', nameDutch: 'Pure Stilte', category: 'any', icon: '🤫' },
};

export const BINAURAL_PRESETS: Record<BinauralPreset, { name: string; frequencyRange: string; description: string }> = {
  delta: { name: 'Delta', frequencyRange: '0.5-4Hz', description: 'Deep sleep, recovery' },
  theta: { name: 'Theta', frequencyRange: '4-8Hz', description: 'Meditation, creativity' },
  alpha: { name: 'Alpha', frequencyRange: '8-13Hz', description: 'Relaxed focus' },
  beta: { name: 'Beta', frequencyRange: '13-30Hz', description: 'Alert focus' },
  gamma: { name: 'Gamma', frequencyRange: '30-100Hz', description: 'Peak awareness' },
};

export class AudioEngine {
  private layers: Map<string, AudioLayer> = new Map();
  private masterVolume: number = 1.0;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    this.isInitialized = true;
    // In production, would preload audio assets via expo-av
  }

  // Play a breath phase cue (rising tone for inhale, bell for hold, whoosh for exhale)
  async playBreathCue(phase: BreathPhase): Promise<void> {
    const layer: AudioLayer = {
      id: `cue_${phase}`,
      type: 'cue',
      volume: 0.6,
      isPlaying: true,
    };
    this.layers.set(layer.id, layer);
  }

  // Start a soundscape loop
  async startSoundscape(id: SoundscapeId, volume: number = 0.4): Promise<void> {
    const layer: AudioLayer = {
      id: `soundscape_${id}`,
      type: 'soundscape',
      volume,
      isPlaying: true,
    };
    this.layers.set(layer.id, layer);
  }

  // Stop a soundscape
  async stopSoundscape(id: SoundscapeId): Promise<void> {
    this.layers.delete(`soundscape_${id}`);
  }

  // Play voice guidance
  async playVoiceGuidance(instruction: string, _locale: string = 'en'): Promise<void> {
    const layer: AudioLayer = {
      id: 'voice',
      type: 'voice',
      volume: 0.8,
      isPlaying: true,
    };
    this.layers.set(layer.id, layer);
  }

  // Start binaural beat
  async startBinaural(preset: BinauralPreset, volume: number = 0.3): Promise<void> {
    const layer: AudioLayer = {
      id: `binaural_${preset}`,
      type: 'binaural',
      volume,
      isPlaying: true,
    };
    this.layers.set(layer.id, layer);
  }

  stopBinaural(preset: BinauralPreset): void {
    this.layers.delete(`binaural_${preset}`);
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setLayerVolume(layerId: string, volume: number): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getActiveLayers(): AudioLayer[] {
    return Array.from(this.layers.values());
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async stopAll(): Promise<void> {
    this.layers.clear();
  }

  async destroy(): Promise<void> {
    await this.stopAll();
    this.isInitialized = false;
  }
}
