// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Insights / Analytics Screen
// HRV trends, ANS balance, session history, progress tracking
// ═══════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useStore } from '../hooks/useStore';
import { StatsCard, StatRow } from '../components/StatsCard';
import { PolyvagalBar } from '../components/PolyvagalBar';
import { estimatePolyvagalState } from '../engine/polyvagal';
import { getPatternById, getCategoryIcon } from '../data/patterns';
import { formatTime } from '../engine/breathEngine';
import { Colors, CategoryColors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_MAX_WIDTH = SCREEN_WIDTH - Spacing.lg * 4 - 80;

export function InsightsScreen() {
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);
  const dailyStats = useStore((s) => s.dailyStats);
  const polyvagalReading = useMemo(() => estimatePolyvagalState(), []);

  // Session stats
  const totalSessions = user.totalSessionsCompleted;
  const totalMinutes = user.totalMinutes;
  const avgSessionMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Pattern usage breakdown
  const patternUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    sessions.forEach((s) => {
      usage[s.patternId] = (usage[s.patternId] || 0) + 1;
    });
    return Object.entries(usage)
      .map(([id, count]) => ({ pattern: getPatternById(id), count }))
      .filter((x) => x.pattern)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [sessions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    sessions.forEach((s) => {
      const pattern = getPatternById(s.patternId);
      if (pattern) {
        cats[pattern.category] = (cats[pattern.category] || 0) + 1;
      }
    });
    return Object.entries(cats)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [sessions, totalSessions]);

  // Weekly chart data
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);

    return days.map((day, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = dailyStats.find((d) => d.date === dateStr);
      return {
        day,
        minutes: dayStats?.totalMinutes || 0,
        sessions: dayStats?.sessionsCompleted || 0,
        isToday: date.toISOString().split('T')[0] === today.toISOString().split('T')[0],
      };
    });
  }, [dailyStats]);

  const maxWeeklyMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Your breathing journey</Text>
      </View>

      {/* ANS State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nervous System State</Text>
        <PolyvagalBar reading={polyvagalReading} />
        <Text style={styles.stateDescription}>{polyvagalReading.description}</Text>
      </View>

      {/* Overview Stats */}
      <StatRow>
        <StatsCard
          icon="⏱️"
          label="Total Time"
          value={totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h` : `${totalMinutes}m`}
          subtitle={totalMinutes >= 60 ? `${totalMinutes % 60}m` : 'of breathwork'}
          color={Colors.bioluminescent}
        />
        <StatsCard
          icon="📊"
          label="Avg Session"
          value={`${avgSessionMinutes}m`}
          subtitle="per session"
          color={Colors.neuralPurple}
        />
        <StatsCard
          icon="🎯"
          label="CP Score"
          value={user.controlPauseScore ? `${user.controlPauseScore}s` : '—'}
          subtitle="Buteyko"
          color={Colors.clinicalPrimary}
        />
      </StatRow>

      {/* Weekly Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekChart}>
          {weeklyData.map((day) => (
            <View key={day.day} style={styles.weekDay}>
              <View style={styles.weekBarContainer}>
                <View
                  style={[
                    styles.weekBar,
                    {
                      height: `${Math.max((day.minutes / maxWeeklyMinutes) * 100, 4)}%`,
                      backgroundColor: day.isToday
                        ? Colors.bioluminescent
                        : Colors.bioluminescent + '40',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.weekDayLabel,
                  day.isToday && { color: Colors.bioluminescent, fontWeight: '700' },
                ]}
              >
                {day.day}
              </Text>
              {day.minutes > 0 && (
                <Text style={styles.weekMinutes}>{day.minutes}m</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Balance</Text>
          {categoryBreakdown.map(({ category, count, percentage }) => {
            const catColors = CategoryColors[category];
            return (
              <View key={category} style={styles.catRow}>
                <Text style={styles.catIcon}>{getCategoryIcon(category)}</Text>
                <View style={styles.catInfo}>
                  <View style={styles.catHeader}>
                    <Text style={[styles.catName, { color: catColors?.primary }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Text style={styles.catPercentage}>{percentage}%</Text>
                  </View>
                  <View style={styles.catBarBg}>
                    <View
                      style={[
                        styles.catBarFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: catColors?.primary || Colors.bioluminescent,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Most Used Patterns */}
      {patternUsage.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Patterns</Text>
          {patternUsage.map(({ pattern, count }) => {
            if (!pattern) return null;
            const catColors = CategoryColors[pattern.category];
            const barWidth = (count / (patternUsage[0]?.count || 1)) * BAR_MAX_WIDTH;
            return (
              <View key={pattern.id} style={styles.topPatternRow}>
                <Text style={styles.topPatternIcon}>{pattern.icon}</Text>
                <View style={styles.topPatternInfo}>
                  <Text style={styles.topPatternName}>{pattern.name}</Text>
                  <View style={styles.topPatternBarBg}>
                    <View
                      style={[
                        styles.topPatternBarFill,
                        { width: barWidth, backgroundColor: catColors?.primary },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.topPatternCount}>{count}x</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptySubtext}>
            Complete your first session to see insights here
          </Text>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: '800',
    color: Colors.moonlight,
  },
  subtitle: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: Spacing.xs,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.bodyLarge,
    fontWeight: '700',
    color: Colors.moonlight,
    marginBottom: Spacing.md,
  },
  stateDescription: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    paddingHorizontal: Spacing.lg,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Weekly chart
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    height: 160,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: 20,
    marginBottom: Spacing.sm,
  },
  weekBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  weekDayLabel: {
    fontSize: 10,
    color: Colors.dimText,
    fontWeight: '500',
  },
  weekMinutes: {
    fontSize: 9,
    color: Colors.fogGrey,
    marginTop: 1,
  },

  // Category breakdown
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  catIcon: {
    fontSize: 18,
  },
  catInfo: {
    flex: 1,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: FontSize.caption,
    fontWeight: '600',
  },
  catPercentage: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
  },
  catBarBg: {
    height: 6,
    backgroundColor: Colors.deepCurrent,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Top patterns
  topPatternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  topPatternIcon: {
    fontSize: 22,
  },
  topPatternInfo: {
    flex: 1,
  },
  topPatternName: {
    fontSize: FontSize.caption,
    color: Colors.moonlight,
    fontWeight: '500',
    marginBottom: 4,
  },
  topPatternBarBg: {
    height: 6,
    backgroundColor: Colors.deepCurrent,
    borderRadius: 3,
    overflow: 'hidden',
  },
  topPatternBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  topPatternCount: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.huge,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.bodyLarge,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  emptySubtext: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  bottomSpacer: {
    height: 120,
  },
});
