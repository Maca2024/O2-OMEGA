// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Home / Dashboard Screen
// The main landing screen with Breath Orb, ANS state,
// daily stats, quick-start, and AI recommendation
// ═══════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BreathOrb } from '../components/BreathOrb';
import { PolyvagalBar } from '../components/PolyvagalBar';
import { StatsCard, StatRow } from '../components/StatsCard';
import { PatternCard } from '../components/PatternCard';
import { estimatePolyvagalState } from '../engine/polyvagal';
import { useStore } from '../hooks/useStore';
import { PATTERNS } from '../data/patterns';
import { getLevelFromXP } from '../data/achievements';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { triggerSelection } from '../engine/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function HomeScreen() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);

  const polyvagalReading = useMemo(() => estimatePolyvagalState(), []);
  const levelInfo = useMemo(() => getLevelFromXP(user.xp), [user.xp]);
  const xpProgress = user.xp / levelInfo.nextLevelXP;

  // Smart recommendation based on time of day
  const recommendation = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 9) return PATTERNS.find((p) => p.id === 'coherent')!;
    if (hour < 12) return PATTERNS.find((p) => p.id === 'box-breathing')!;
    if (hour < 17) return PATTERNS.find((p) => p.id === 'breath-of-fire')!;
    if (hour < 20) return PATTERNS.find((p) => p.id === 'extended-exhale')!;
    return PATTERNS.find((p) => p.id === 'four-seven-eight')!;
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Night owl';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Time to unwind';
  };

  const recentPatterns = useMemo(() => {
    const recentIds = [...new Set(sessions.slice(-5).map((s) => s.patternId))];
    return recentIds
      .map((id) => PATTERNS.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 3) as typeof PATTERNS;
  }, [sessions]);

  const quickStartPatterns = useMemo(
    () => PATTERNS.filter((p) => ['coherent', 'box-breathing', 'four-seven-eight', 'physiological-sigh'].includes(p.id)),
    []
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{user.displayName}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>L{user.level}</Text>
          <Text style={styles.levelTitle}>{levelInfo.title}</Text>
        </View>
      </View>

      {/* Breath Orb (Idle) */}
      <View style={styles.orbSection}>
        <BreathOrb
          phase={null}
          progress={0}
          intensity={0.3}
          category="parasympathetic"
          isActive={false}
        />
      </View>

      {/* Polyvagal State */}
      <PolyvagalBar reading={polyvagalReading} />

      {/* XP Progress */}
      <View style={styles.xpContainer}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>
            {user.xp} / {levelInfo.nextLevelXP} XP
          </Text>
          <Text style={styles.xpLevel}>Level {user.level}</Text>
        </View>
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${Math.min(xpProgress * 100, 100)}%` }]} />
        </View>
      </View>

      {/* Today's Stats */}
      <StatRow>
        <StatsCard
          icon="🔥"
          label="Streak"
          value={`${user.currentStreak}`}
          subtitle="days"
          color={Colors.amber}
        />
        <StatsCard
          icon="⏱️"
          label="Total"
          value={`${user.totalMinutes}`}
          subtitle="minutes"
          color={Colors.bioluminescent}
        />
        <StatsCard
          icon="🎯"
          label="Sessions"
          value={`${user.totalSessionsCompleted}`}
          subtitle="completed"
          color={Colors.neuralPurple}
        />
      </StatRow>

      {/* AI Recommendation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <TouchableOpacity
          style={styles.recommendCard}
          onPress={() => {
            triggerSelection();
            router.push(`/session?patternId=${recommendation.id}`);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.recommendLeft}>
            <Text style={styles.recommendIcon}>{recommendation.icon}</Text>
            <View style={styles.recommendInfo}>
              <Text style={styles.recommendName}>{recommendation.name}</Text>
              <Text style={styles.recommendSub}>{recommendation.subtitle}</Text>
            </View>
          </View>
          <View style={styles.startBadge}>
            <Text style={styles.startText}>Start</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Start */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickStartRow}
        >
          {quickStartPatterns.map((pattern) => (
            <TouchableOpacity
              key={pattern.id}
              style={styles.quickStartItem}
              onPress={() => {
                triggerSelection();
                router.push(`/session?patternId=${pattern.id}`);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.quickStartIcon}>{pattern.icon}</Text>
              <Text style={styles.quickStartName} numberOfLines={1}>{pattern.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recently Used */}
      {recentPatterns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {recentPatterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              onPress={() => router.push(`/session?patternId=${pattern.id}`)}
              isFavorite={user.favoritePatterns.includes(pattern.id)}
              compact
            />
          ))}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: FontSize.h2,
    fontWeight: '800',
    color: Colors.moonlight,
    marginTop: 2,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: Colors.deepCurrent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.bioluminescent + '20',
  },
  levelNumber: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.bioluminescent,
  },
  levelTitle: {
    fontSize: 10,
    color: Colors.fogGrey,
  },
  orbSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  xpContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  xpLabel: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
  },
  xpLevel: {
    fontSize: FontSize.caption,
    color: Colors.bioluminescent,
    fontWeight: '600',
  },
  xpBarBg: {
    height: 4,
    backgroundColor: Colors.deepCurrent,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.bioluminescent,
    borderRadius: 2,
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
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.bioluminescent + '20',
    padding: Spacing.lg,
  },
  recommendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendIcon: {
    fontSize: 36,
    marginRight: Spacing.md,
  },
  recommendInfo: {
    flex: 1,
  },
  recommendName: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.moonlight,
  },
  recommendSub: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: 2,
  },
  startBadge: {
    backgroundColor: Colors.bioluminescent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  startText: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.deepSpace,
  },
  quickStartRow: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  quickStartItem: {
    width: 90,
    alignItems: 'center',
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  quickStartIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  quickStartName: {
    fontSize: 11,
    color: Colors.fogGrey,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});
