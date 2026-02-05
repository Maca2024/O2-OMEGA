import { create } from 'zustand';
import { SessionResult } from '../types/breath';
import { AIInsight, AIRecommendation, JournalEntry } from '../types/ai';

interface InsightsStore {
  // State
  sessions: SessionResult[];
  insights: AIInsight[];
  journalEntries: JournalEntry[];
  dailyRecommendation: AIRecommendation | null;

  // Actions
  addSession: (session: SessionResult) => void;
  addInsight: (insight: AIInsight) => void;
  dismissInsight: (insightId: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => void;
  setDailyRecommendation: (recommendation: AIRecommendation | null) => void;
  clearInsights: () => void;

  // Derived / Queries
  getSessionsByDate: (date: string) => SessionResult[];
  getSessionsByPattern: (patternId: string) => SessionResult[];
  getTotalMinutes: () => number;
  getTotalSessions: () => number;
  getCurrentStreak: () => number;
  getAverageMoodDelta: () => number | null;
  getRecentSessions: (count: number) => SessionResult[];
}

/**
 * Calculates the current consecutive-day streak from a list of sessions.
 * A streak day is any calendar date (UTC) on which at least one session was completed.
 * The streak counts backward from today; if there is no session today, it checks
 * whether yesterday had a session (allowing for "hasn't practiced yet today").
 */
function calculateStreak(sessions: SessionResult[]): number {
  if (sessions.length === 0) return 0;

  // Collect unique calendar dates (YYYY-MM-DD in UTC) with at least one session
  const sessionDates = new Set<string>();
  for (const s of sessions) {
    const date = new Date(s.completedAt).toISOString().split('T')[0];
    sessionDates.add(date);
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const MS_PER_DAY = 86_400_000;
  let streak = 0;
  let checkDate = new Date(today);

  // If no session today, allow checking from yesterday (grace period)
  if (!sessionDates.has(todayStr)) {
    checkDate = new Date(today.getTime() - MS_PER_DAY);
    if (!sessionDates.has(checkDate.toISOString().split('T')[0])) {
      return 0;
    }
  }

  // Count consecutive days backward
  while (sessionDates.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate = new Date(checkDate.getTime() - MS_PER_DAY);
  }

  return streak;
}

export const useInsightsStore = create<InsightsStore>((set, get) => ({
  sessions: [],
  insights: [],
  journalEntries: [],
  dailyRecommendation: null,

  addSession: (session) => set((state) => ({
    sessions: [...state.sessions, session],
  })),

  addInsight: (insight) => set((state) => ({
    insights: [...state.insights, insight],
  })),

  dismissInsight: (insightId) => set((state) => ({
    insights: state.insights.filter((i) => i.id !== insightId),
  })),

  addJournalEntry: (entry) => set((state) => ({
    journalEntries: [...state.journalEntries, entry],
  })),

  updateJournalEntry: (entryId, updates) => set((state) => ({
    journalEntries: state.journalEntries.map((e) =>
      e.id === entryId ? { ...e, ...updates } : e
    ),
  })),

  setDailyRecommendation: (recommendation) => set({ dailyRecommendation: recommendation }),

  clearInsights: () => set({ insights: [] }),

  getSessionsByDate: (date) => {
    return get().sessions.filter((s) => {
      const sessionDate = new Date(s.completedAt).toISOString().split('T')[0];
      return sessionDate === date;
    });
  },

  getSessionsByPattern: (patternId) => {
    return get().sessions.filter((s) => s.patternId === patternId);
  },

  getTotalMinutes: () => {
    return get().sessions.reduce((total, s) => {
      const durationMs = s.completedAt - s.startedAt;
      return total + durationMs / 60_000;
    }, 0);
  },

  getTotalSessions: () => {
    return get().sessions.length;
  },

  getCurrentStreak: () => {
    return calculateStreak(get().sessions);
  },

  getAverageMoodDelta: () => {
    const sessions = get().sessions.filter(
      (s) => s.moodBefore !== undefined && s.moodAfter !== undefined
    );
    if (sessions.length === 0) return null;
    const totalDelta = sessions.reduce(
      (sum, s) => sum + (s.moodAfter! - s.moodBefore!),
      0
    );
    return totalDelta / sessions.length;
  },

  getRecentSessions: (count) => {
    const sessions = get().sessions;
    return sessions
      .slice()
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, count);
  },
}));
