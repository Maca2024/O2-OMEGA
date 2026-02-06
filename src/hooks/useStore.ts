// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Global State Store (Zustand)
// Manages user profile, session history, and app state
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, SessionData, DailyStats, DifficultyLevel } from '../types/breathing';
import { getLevelFromXP } from '../data/achievements';

interface AppState {
  // User
  user: UserProfile;
  sessions: SessionData[];
  dailyStats: DailyStats[];

  // App state
  isLoading: boolean;
  onboardingComplete: boolean;

  // Actions
  initializeStore: () => Promise<void>;
  completeSession: (session: SessionData) => void;
  updateControlPause: (seconds: number) => void;
  addXP: (amount: number) => void;
  toggleFavorite: (patternId: string) => void;
  completeOnboarding: () => void;
  resetStore: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'local-user',
  displayName: 'Breather',
  level: 1,
  totalSessionsCompleted: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  xp: 0,
  unlockedPatterns: [],
  favoritePatterns: [],
  createdAt: Date.now(),
  onboardingComplete: false,
};

const STORE_KEY = 'pneuma-o2-store';

export const useStore = create<AppState>((set, get) => ({
  user: { ...DEFAULT_USER },
  sessions: [],
  dailyStats: [],
  isLoading: true,
  onboardingComplete: false,

  initializeStore: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          user: { ...DEFAULT_USER, ...data.user },
          sessions: data.sessions || [],
          dailyStats: data.dailyStats || [],
          onboardingComplete: data.user?.onboardingComplete || false,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  completeSession: (session: SessionData) => {
    const state = get();
    const durationMinutes = Math.round(session.durationMs / 60000);
    const newXP = Math.round(durationMinutes * 10); // 10 XP per minute

    const today = new Date().toISOString().split('T')[0];
    const lastSessionDate = state.user.lastSessionAt
      ? new Date(state.user.lastSessionAt).toISOString().split('T')[0]
      : null;

    // Calculate streak
    let newStreak = state.user.currentStreak;
    if (lastSessionDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastSessionDate === yesterday || lastSessionDate === null) {
        newStreak += 1;
      } else if (lastSessionDate !== today) {
        newStreak = 1;
      }
    }

    const updatedUser: UserProfile = {
      ...state.user,
      totalSessionsCompleted: state.user.totalSessionsCompleted + 1,
      totalMinutes: state.user.totalMinutes + durationMinutes,
      xp: state.user.xp + newXP,
      level: getLevelFromXP(state.user.xp + newXP).level as DifficultyLevel,
      currentStreak: newStreak,
      longestStreak: Math.max(state.user.longestStreak, newStreak),
      lastSessionAt: Date.now(),
    };

    // Update daily stats
    const existingDayIndex = state.dailyStats.findIndex((d) => d.date === today);
    const updatedDailyStats = [...state.dailyStats];
    if (existingDayIndex >= 0) {
      const existing = updatedDailyStats[existingDayIndex];
      updatedDailyStats[existingDayIndex] = {
        ...existing,
        sessionsCompleted: existing.sessionsCompleted + 1,
        totalMinutes: existing.totalMinutes + durationMinutes,
        patternsUsed: [...new Set([...existing.patternsUsed, session.patternId])],
      };
    } else {
      updatedDailyStats.push({
        date: today,
        sessionsCompleted: 1,
        totalMinutes: durationMinutes,
        avgMoodBefore: session.moodBefore || 3,
        avgMoodAfter: session.moodAfter || 3,
        patternsUsed: [session.patternId],
      });
    }

    const newState = {
      user: updatedUser,
      sessions: [...state.sessions, session],
      dailyStats: updatedDailyStats,
    };

    set(newState);
    persistStore(newState);
  },

  updateControlPause: (seconds: number) => {
    const state = get();
    const updatedUser = { ...state.user, controlPauseScore: seconds };
    set({ user: updatedUser });
    persistStore({ ...state, user: updatedUser });
  },

  addXP: (amount: number) => {
    const state = get();
    const newXP = state.user.xp + amount;
    const updatedUser = {
      ...state.user,
      xp: newXP,
      level: getLevelFromXP(newXP).level as DifficultyLevel,
    };
    set({ user: updatedUser });
    persistStore({ ...state, user: updatedUser });
  },

  toggleFavorite: (patternId: string) => {
    const state = get();
    const favorites = state.user.favoritePatterns.includes(patternId)
      ? state.user.favoritePatterns.filter((id) => id !== patternId)
      : [...state.user.favoritePatterns, patternId];
    const updatedUser = { ...state.user, favoritePatterns: favorites };
    set({ user: updatedUser });
    persistStore({ ...state, user: updatedUser });
  },

  completeOnboarding: () => {
    const state = get();
    const updatedUser = { ...state.user, onboardingComplete: true };
    set({ user: updatedUser, onboardingComplete: true });
    persistStore({ ...state, user: updatedUser });
  },

  resetStore: () => {
    set({ user: { ...DEFAULT_USER }, sessions: [], dailyStats: [] });
    AsyncStorage.removeItem(STORE_KEY);
  },
}));

async function persistStore(state: Partial<AppState>) {
  try {
    await AsyncStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        user: state.user,
        sessions: state.sessions,
        dailyStats: state.dailyStats,
      })
    );
  } catch {
    // Storage error — silently fail
  }
}
