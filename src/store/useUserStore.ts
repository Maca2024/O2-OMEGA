import { create } from 'zustand';
import { AccessLevel } from '../types/breath';
import { UserProfile, UserPreferences, Achievement } from '../types/user';

// XP required per level: level N requires N * 100 XP
const XP_PER_LEVEL = 100;

interface UserStore {
  // State
  profile: UserProfile | null;
  isOnboarded: boolean;
  achievements: Achievement[];

  // Actions
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setAccessLevel: (level: AccessLevel) => void;
  completeOnboarding: () => void;
  updateCPScore: (score: number) => void;
  setPersonalResonantFrequency: (freq: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  addSession: (durationMinutes: number) => void;
  setEmergencyContact: (name: string, phone: string) => void;
  signInformedConsent: () => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isOnboarded: false,
  achievements: [],

  setProfile: (profile) => set({
    profile,
    isOnboarded: profile.onboardingCompleted,
  }),

  updatePreferences: (prefs) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, ...prefs },
      },
    };
  }),

  addXP: (amount) => set((state) => {
    if (!state.profile) return state;
    const newXP = state.profile.xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    return {
      profile: {
        ...state.profile,
        xp: newXP,
        level: newLevel,
      },
    };
  }),

  incrementStreak: () => set((state) => {
    if (!state.profile) return state;
    const newStreak = state.profile.currentStreak + 1;
    return {
      profile: {
        ...state.profile,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, state.profile.longestStreak),
      },
    };
  }),

  resetStreak: () => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        currentStreak: 0,
      },
    };
  }),

  setAccessLevel: (level) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        accessLevel: level,
      },
    };
  }),

  completeOnboarding: () => set((state) => {
    if (!state.profile) return state;
    return {
      isOnboarded: true,
      profile: {
        ...state.profile,
        onboardingCompleted: true,
      },
    };
  }),

  updateCPScore: (score) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        buteykoCPScore: score,
      },
    };
  }),

  setPersonalResonantFrequency: (freq) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        personalResonantFrequency: freq,
      },
    };
  }),

  unlockAchievement: (achievementId) => set((state) => ({
    achievements: state.achievements.map((a) =>
      a.id === achievementId
        ? { ...a, unlockedAt: Date.now(), currentProgress: a.requirement }
        : a
    ),
  })),

  updateAchievementProgress: (achievementId, progress) => set((state) => ({
    achievements: state.achievements.map((a) =>
      a.id === achievementId
        ? {
            ...a,
            currentProgress: progress,
            unlockedAt: progress >= a.requirement ? (a.unlockedAt ?? Date.now()) : a.unlockedAt,
          }
        : a
    ),
  })),

  addSession: (durationMinutes) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        totalSessions: state.profile.totalSessions + 1,
        totalMinutes: state.profile.totalMinutes + durationMinutes,
      },
    };
  }),

  setEmergencyContact: (name, phone) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        emergencyContactName: name,
        emergencyContactPhone: phone,
      },
    };
  }),

  signInformedConsent: () => set((state) => {
    if (!state.profile) return state;
    return {
      profile: {
        ...state.profile,
        informedConsentSigned: true,
      },
    };
  }),

  clearProfile: () => set({
    profile: null,
    isOnboarded: false,
    achievements: [],
  }),
}));
