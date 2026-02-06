// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Achievement System
// ═══════════════════════════════════════════════════════════════

import { Achievement } from '../types/breathing';

export const ACHIEVEMENTS: Achievement[] = [
  // Session milestones
  {
    id: 'first-breath',
    title: 'First Breath',
    description: 'Complete your first breathing session',
    icon: '🌱',
    xpReward: 50,
    condition: { type: 'sessions', threshold: 1 },
  },
  {
    id: 'ten-sessions',
    title: 'Dedicated Breather',
    description: 'Complete 10 breathing sessions',
    icon: '🌿',
    xpReward: 100,
    condition: { type: 'sessions', threshold: 10 },
  },
  {
    id: 'fifty-sessions',
    title: 'Breath Master',
    description: 'Complete 50 breathing sessions',
    icon: '🌳',
    xpReward: 250,
    condition: { type: 'sessions', threshold: 50 },
  },
  {
    id: 'hundred-sessions',
    title: 'Breath Sage',
    description: 'Complete 100 breathing sessions',
    icon: '🏔️',
    xpReward: 500,
    condition: { type: 'sessions', threshold: 100 },
  },

  // Time milestones
  {
    id: 'one-hour',
    title: 'Hour of Power',
    description: 'Accumulate 60 minutes of breathwork',
    icon: '⏰',
    xpReward: 100,
    condition: { type: 'minutes', threshold: 60 },
  },
  {
    id: 'ten-hours',
    title: 'Deep Diver',
    description: 'Accumulate 10 hours of breathwork',
    icon: '🐋',
    xpReward: 300,
    condition: { type: 'minutes', threshold: 600 },
  },
  {
    id: 'fifty-hours',
    title: 'Breath Alchemist',
    description: 'Accumulate 50 hours of breathwork',
    icon: '⚗️',
    xpReward: 1000,
    condition: { type: 'minutes', threshold: 3000 },
  },

  // Streak milestones
  {
    id: 'three-day-streak',
    title: 'Momentum',
    description: 'Maintain a 3-day breathing streak',
    icon: '🔥',
    xpReward: 75,
    condition: { type: 'streak', threshold: 3 },
  },
  {
    id: 'seven-day-streak',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day breathing streak',
    icon: '💫',
    xpReward: 150,
    condition: { type: 'streak', threshold: 7 },
  },
  {
    id: 'thirty-day-streak',
    title: 'Monthly Mastery',
    description: 'Maintain a 30-day breathing streak',
    icon: '🌟',
    xpReward: 500,
    condition: { type: 'streak', threshold: 30 },
  },

  // Level milestones
  {
    id: 'level-2',
    title: 'Activator Unlocked',
    description: 'Reach Level 2 — Activator',
    icon: '🟡',
    xpReward: 200,
    condition: { type: 'level', threshold: 2 },
  },
  {
    id: 'level-3',
    title: 'Explorer Unlocked',
    description: 'Reach Level 3 — Explorer',
    icon: '🔵',
    xpReward: 400,
    condition: { type: 'level', threshold: 3 },
  },
  {
    id: 'level-4',
    title: 'Transformer Unlocked',
    description: 'Reach Level 4 — Transformer',
    icon: '🟣',
    xpReward: 1000,
    condition: { type: 'level', threshold: 4 },
  },

  // Buteyko CP milestones
  {
    id: 'cp-20',
    title: 'CO₂ Tolerant',
    description: 'Achieve a Control Pause of 20 seconds',
    icon: '🫧',
    xpReward: 150,
    condition: { type: 'cp_score', threshold: 20 },
  },
  {
    id: 'cp-40',
    title: 'Breath Efficient',
    description: 'Achieve a Control Pause of 40 seconds',
    icon: '🌬️',
    xpReward: 300,
    condition: { type: 'cp_score', threshold: 40 },
  },
  {
    id: 'cp-60',
    title: 'Buteyko Master',
    description: 'Achieve a Control Pause of 60 seconds',
    icon: '👑',
    xpReward: 500,
    condition: { type: 'cp_score', threshold: 60 },
  },
];

export function getUnlockedAchievements(
  sessions: number,
  minutes: number,
  streak: number,
  level: number,
  cpScore: number
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => {
    switch (a.condition.type) {
      case 'sessions': return sessions >= a.condition.threshold;
      case 'minutes': return minutes >= a.condition.threshold;
      case 'streak': return streak >= a.condition.threshold;
      case 'level': return level >= a.condition.threshold;
      case 'cp_score': return cpScore >= a.condition.threshold;
      default: return false;
    }
  });
}

export function getLevelFromXP(xp: number): { level: number; title: string; nextLevelXP: number } {
  if (xp >= 5000) return { level: 4, title: 'Transformer', nextLevelXP: 10000 };
  if (xp >= 2000) return { level: 3, title: 'Explorer', nextLevelXP: 5000 };
  if (xp >= 500) return { level: 2, title: 'Activator', nextLevelXP: 2000 };
  return { level: 1, title: 'Foundation', nextLevelXP: 500 };
}
