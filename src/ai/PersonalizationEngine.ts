import { AIRecommendation, AIInsight } from '../types/ai';
import { BreathPattern, PatternCategory, PolyvagalState } from '../types/breath';
import { SessionResult } from '../types/breath';
import { BiometricState } from '../types/biometrics';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export class PersonalizationEngine {

  // Determine time of day from current hour
  static getTimeOfDay(hour?: number): TimeOfDay {
    const h = hour ?? new Date().getHours();
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  }

  // Get pattern recommendation based on context
  static getRecommendation(
    patterns: BreathPattern[],
    context: {
      timeOfDay: TimeOfDay;
      currentBiometrics?: BiometricState | null;
      recentSessions: SessionResult[];
      userLevel: 1 | 2 | 3 | 4;
      buteykoCPScore?: number;
      goals?: string[];
    }
  ): AIRecommendation {
    const { timeOfDay, currentBiometrics, recentSessions, userLevel } = context;

    // Filter to accessible patterns
    const accessible = patterns.filter(p => p.requiredLevel <= userLevel);

    // Score each pattern based on context
    const scored = accessible.map(pattern => {
      let score = 0;
      let reason = '';

      // Time-based scoring
      if (timeOfDay === 'morning') {
        if (pattern.category === 'sympathetic') { score += 3; reason = 'Morning energy boost'; }
        else if (pattern.category === 'parasympathetic') { score += 2; reason = 'Calm morning start'; }
      } else if (timeOfDay === 'afternoon') {
        if (pattern.id === 'box-breathing' || pattern.id === 'coherent-breathing') { score += 3; reason = 'Afternoon focus reset'; }
        else if (pattern.category === 'sympathetic') { score += 2; reason = 'Afternoon energy'; }
      } else if (timeOfDay === 'evening') {
        if (pattern.category === 'parasympathetic') { score += 3; reason = 'Evening wind-down'; }
        if (pattern.id === '4-7-8') { score += 2; reason = 'Prepare for sleep'; }
      } else { // night
        if (pattern.id === '4-7-8' || pattern.id === 'buteyko-sleep') { score += 4; reason = 'Sleep preparation'; }
        else if (pattern.category === 'parasympathetic') { score += 2; reason = 'Nighttime relaxation'; }
      }

      // Biometric-based scoring
      if (currentBiometrics) {
        if (currentBiometrics.polyvagalState === 'sympathetic') {
          if (pattern.category === 'parasympathetic') { score += 3; reason = 'Your nervous system shows stress — calming recommended'; }
        } else if (currentBiometrics.polyvagalState === 'ventral') {
          if (pattern.category === 'sympathetic' || pattern.category === 'transformative') { score += 2; reason = 'You\'re calm and ready for activation'; }
        } else if (currentBiometrics.polyvagalState === 'dorsal') {
          if (pattern.id === 'diaphragmatic' || pattern.id === 'coherent-breathing') { score += 4; reason = 'Gentle activation to restore regulation'; }
        }

        // HRV-based
        if (currentBiometrics.hrv < 20 && pattern.category === 'parasympathetic') { score += 2; }
        if (currentBiometrics.hrv > 50 && pattern.requiredLevel >= 2) { score += 1; }
      }

      // Variety scoring - prefer patterns not done recently
      const recentPatternIds = recentSessions.slice(0, 5).map(s => s.patternId);
      if (!recentPatternIds.includes(pattern.id)) { score += 1; }

      // Beginner boost - recommend simpler patterns more for new users
      if (userLevel === 1 && pattern.difficulty === 1) { score += 1; }

      return { pattern, score, reason };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    const suggestedDuration = PersonalizationEngine.suggestDuration(best.pattern, timeOfDay);

    return {
      patternId: best.pattern.id,
      reason: best.reason || 'Recommended for you',
      confidence: Math.min(best.score / 10, 1),
      suggestedDuration,
      context: PersonalizationEngine.mapTimeToContext(timeOfDay, currentBiometrics?.polyvagalState),
    };
  }

  // Generate insights from session history
  static generateInsights(
    sessions: SessionResult[],
    hrvHistory: number[],
    buteykoCPHistory: number[],
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = Date.now();

    // HRV trend insight
    if (hrvHistory.length >= 7) {
      const recent = hrvHistory.slice(-7);
      const older = hrvHistory.slice(-14, -7);
      if (older.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;

        if (change > 5) {
          insights.push({
            id: `hrv_trend_${now}`,
            type: 'hrv_trend',
            title: 'HRV Improving',
            message: `Your HRV has improved by ${Math.round(change)}% over the past week. Your nervous system is becoming more resilient.`,
            timestamp: now,
            actionable: false,
          });
        } else if (change < -10) {
          insights.push({
            id: `hrv_decline_${now}`,
            type: 'warning',
            title: 'HRV Declining',
            message: `Your HRV has decreased by ${Math.round(Math.abs(change))}%. Consider more parasympathetic breathing sessions and quality rest.`,
            timestamp: now,
            actionable: true,
            action: { type: 'start_session', patternId: 'coherent-breathing' },
          });
        }
      }
    }

    // Session frequency insight
    const thisWeek = sessions.filter(s => now - s.startedAt < 7 * 24 * 3600 * 1000);
    if (thisWeek.length >= 5) {
      insights.push({
        id: `consistency_${now}`,
        type: 'milestone',
        title: 'Consistent Practice',
        message: `You've completed ${thisWeek.length} sessions this week. Consistency is the key to lasting nervous system changes.`,
        timestamp: now,
        actionable: false,
      });
    }

    // Buteyko CP progress
    if (buteykoCPHistory.length >= 2) {
      const latest = buteykoCPHistory[buteykoCPHistory.length - 1];
      const first = buteykoCPHistory[0];
      if (latest - first >= 10) {
        insights.push({
          id: `cp_progress_${now}`,
          type: 'progress',
          title: 'Control Pause Improved',
          message: `Your Buteyko Control Pause has improved from ${first}s to ${latest}s. This indicates improved CO₂ tolerance and breathing efficiency.`,
          timestamp: now,
          actionable: false,
        });
      }
    }

    // Total minutes milestone
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.completedAt - s.startedAt) / 60000, 0);
    const milestones = [60, 300, 600, 1500, 3000];
    for (const milestone of milestones) {
      if (totalMinutes >= milestone && totalMinutes < milestone * 1.1) {
        insights.push({
          id: `milestone_${milestone}_${now}`,
          type: 'milestone',
          title: `${milestone} Minutes Milestone!`,
          message: `You've completed ${Math.round(totalMinutes)} minutes of breathwork practice. Every breath counts.`,
          timestamp: now,
          actionable: false,
        });
        break;
      }
    }

    return insights;
  }

  // Generate coaching message based on context (would use Mistral AI in production)
  static generateCoachingMessage(
    timeOfDay: TimeOfDay,
    biometrics?: BiometricState | null,
    hrvBaseline?: number,
  ): string {
    if (biometrics && hrvBaseline) {
      const hrvDiff = biometrics.hrv - hrvBaseline;
      if (hrvDiff < -10) {
        return `Your HRV is ${Math.abs(Math.round(hrvDiff))}ms below your baseline. A Coherent Breathing session can help restore your nervous system balance.`;
      }
      if (biometrics.polyvagalState === 'sympathetic') {
        return 'Your heart rate suggests elevated stress. Extended exhale breathing activates your vagus nerve for rapid calming.';
      }
    }

    const messages: Record<TimeOfDay, string[]> = {
      morning: [
        'Good morning. Start your day with intentional breath to set the tone for your nervous system.',
        'A few minutes of coherent breathing can establish calm alertness for the day ahead.',
      ],
      afternoon: [
        'Midday is an ideal time to reset. Box Breathing can restore focus in just 5 minutes.',
        'Your afternoon breathing session helps prevent the cortisol buildup that disrupts evening rest.',
      ],
      evening: [
        'Evening is the time to downshift. Extended exhale breathing prepares your body for restorative sleep.',
        'Transition from your day with 4-7-8 breathing — four cycles is all you need.',
      ],
      night: [
        'Prepare for deep sleep with gentle Buteyko reduced breathing. Let each breath become softer.',
        'Night practice: breathe through your nose, focus on lengthening the exhale. Sleep will come naturally.',
      ],
    };

    const options = messages[timeOfDay];
    return options[Math.floor(Math.random() * options.length)];
  }

  static suggestDuration(pattern: BreathPattern, timeOfDay: TimeOfDay): number {
    const { min, max } = pattern.durationRange;
    if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
      return Math.min(min + 5, max); // shorter during busy hours
    }
    return Math.round((min + max) / 2); // medium for evening/night
  }

  static mapTimeToContext(
    timeOfDay: TimeOfDay,
    polyvagalState?: PolyvagalState,
  ): AIRecommendation['context'] {
    if (polyvagalState === 'sympathetic') return 'stress';
    if (polyvagalState === 'dorsal') return 'energy';
    switch (timeOfDay) {
      case 'morning': return 'morning';
      case 'afternoon': return 'afternoon';
      case 'evening': return 'evening';
      case 'night': return 'sleep';
    }
  }
}
