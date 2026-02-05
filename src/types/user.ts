import { AccessLevel } from './breath';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  createdAt: number;
  locale: 'nl' | 'en' | 'de' | 'fr' | 'es' | 'fi';
  accessLevel: AccessLevel;
  subscription: 'free' | 'premium' | 'transcend';
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: number;
  buteykoCPScore?: number;
  personalResonantFrequency?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalClearance: boolean;
  informedConsentSigned: boolean;
  onboardingCompleted: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  hapticEnabled: boolean;
  voiceGuidance: boolean;
  voiceGender: 'male' | 'female' | 'neutral';
  defaultSoundscape: string;
  biometricOverlay: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  darkMode: boolean;
  language: 'nl' | 'en';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  category: 'sessions' | 'streaks' | 'exploration' | 'mastery' | 'biometric';
  requirement: number;
  currentProgress: number;
}
