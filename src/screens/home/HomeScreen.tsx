import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Card } from '../../components/common/Card';
import { GlowButton } from '../../components/common/GlowButton';
import { StatBadge } from '../../components/common/StatBadge';

// ─── Design Tokens ───────────────────────────────────────────────────────────

const Colors = {
  deepSpace: '#0A0E27',
  midnightOcean: '#0F1B3D',
  deepCurrent: '#162447',
  bioluminescent: '#00D4AA',
  neuralPurple: '#7B68EE',
  heartPink: '#FF6B9D',
  solarGold: '#FFD93D',
  moonlight: '#E8F0FE',
  fogGrey: '#8B95A5',
} as const;

// ─── Category color mapping ─────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  parasympathetic: Colors.bioluminescent,
  sympathetic: Colors.solarGold,
  clinical: '#4A9EFF',
  transformative: Colors.neuralPurple,
  calming: Colors.bioluminescent,
  energizing: Colors.solarGold,
  focus: '#4A9EFF',
  recovery: Colors.heartPink,
};

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface PolyvagalState {
  current: 'ventral' | 'sympathetic' | 'dorsal';
  heartRate: number;
  hrv: number;
  /** 0 = fully dorsal, 0.5 = sympathetic center, 1 = fully ventral */
  position: number;
}

interface DailyRecommendation {
  patternName: string;
  category: string;
  reason: string;
  durationMinutes: number;
}

interface QuickStartPattern {
  id: string;
  name: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  durationRange: string;
}

interface RecentSession {
  patternName: string;
  durationMinutes: number;
  completionPercent: number;
  timestamp: string;
}

interface TodayStats {
  sessionsCount: number;
  minutesTotal: number;
  streakDays: number;
}

const MOCK_POLYVAGAL: PolyvagalState = {
  current: 'ventral',
  heartRate: 68,
  hrv: 54,
  position: 0.75,
};

const MOCK_RECOMMENDATION: DailyRecommendation = {
  patternName: 'Coherent Breathing',
  category: 'parasympathetic',
  reason: 'Your HRV is below baseline. A slow, rhythmic pattern will help restore autonomic balance.',
  durationMinutes: 10,
};

const MOCK_TODAY_STATS: TodayStats = {
  sessionsCount: 2,
  minutesTotal: 18,
  streakDays: 7,
};

const MOCK_QUICK_START: QuickStartPattern[] = [
  { id: '1', name: 'Box Breathing', category: 'calming', difficulty: 2, durationRange: '4 – 10 min' },
  { id: '2', name: '4-7-8 Relaxation', category: 'parasympathetic', difficulty: 1, durationRange: '5 – 12 min' },
  { id: '3', name: 'Wim Hof Method', category: 'energizing', difficulty: 4, durationRange: '10 – 20 min' },
  { id: '4', name: 'Nadi Shodhana', category: 'focus', difficulty: 3, durationRange: '8 – 15 min' },
];

const MOCK_RECENT_SESSION: RecentSession = {
  patternName: 'Box Breathing',
  durationMinutes: 8,
  completionPercent: 92,
  timestamp: 'Today, 7:32 AM',
};

// ─── Inline Components (not yet extracted) ───────────────────────────────────

// CategoryBadge ──────────────────────────────────────────────────────────────

interface CategoryBadgeProps {
  category: string;
  style?: ViewStyle;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, style }) => {
  const color = CATEGORY_COLORS[category] ?? Colors.fogGrey;
  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <View style={[inlineStyles.categoryBadge, { borderColor: color }, style]}>
      <View style={[inlineStyles.categoryDot, { backgroundColor: color }]} />
      <Text style={[inlineStyles.categoryLabel, { color }]}>{label}</Text>
    </View>
  );
};

// PolyvagalIndicator ─────────────────────────────────────────────────────────

interface PolyvagalIndicatorProps {
  state: PolyvagalState;
  style?: ViewStyle;
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  ventral: { label: 'Ventral Vagal', color: Colors.bioluminescent },
  sympathetic: { label: 'Sympathetic', color: Colors.solarGold },
  dorsal: { label: 'Dorsal Vagal', color: Colors.heartPink },
};

const PolyvagalIndicator: React.FC<PolyvagalIndicatorProps> = ({ state, style }) => {
  const stateInfo = STATE_LABELS[state.current];

  return (
    <View style={style}>
      {/* State label */}
      <View style={inlineStyles.pvStateRow}>
        <View style={[inlineStyles.pvStateDot, { backgroundColor: stateInfo.color }]} />
        <Text style={[inlineStyles.pvStateLabel, { color: stateInfo.color }]}>
          {stateInfo.label}
        </Text>
      </View>

      {/* Track */}
      <View style={inlineStyles.pvTrack}>
        {/* Gradient segments */}
        <View style={[inlineStyles.pvSegment, { backgroundColor: Colors.heartPink, opacity: 0.4 }]} />
        <View style={[inlineStyles.pvSegment, { backgroundColor: Colors.solarGold, opacity: 0.4 }]} />
        <View style={[inlineStyles.pvSegment, { backgroundColor: Colors.bioluminescent, opacity: 0.4 }]} />

        {/* Position thumb */}
        <View
          style={[
            inlineStyles.pvThumb,
            {
              left: `${state.position * 100}%` as unknown as number,
              backgroundColor: stateInfo.color,
              shadowColor: stateInfo.color,
            },
          ]}
        />
      </View>

      {/* Axis labels */}
      <View style={inlineStyles.pvAxisLabels}>
        <Text style={inlineStyles.pvAxisText}>Dorsal</Text>
        <Text style={inlineStyles.pvAxisText}>Sympathetic</Text>
        <Text style={inlineStyles.pvAxisText}>Ventral</Text>
      </View>
    </View>
  );
};

// ─── Difficulty stars helper ─────────────────────────────────────────────────

const DifficultyStars: React.FC<{ level: number }> = ({ level }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (i < level ? '\u2605' : '\u2606'));
  return (
    <Text style={inlineStyles.difficultyStars}>
      {stars.join('')}
    </Text>
  );
};

// ─── Time-based greeting ─────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

// ─── QuickStartCard ──────────────────────────────────────────────────────────

interface QuickStartCardProps {
  pattern: QuickStartPattern;
  onPress: (pattern: QuickStartPattern) => void;
}

const QuickStartCard: React.FC<QuickStartCardProps> = ({ pattern, onPress }) => {
  const categoryColor = CATEGORY_COLORS[pattern.category] ?? Colors.fogGrey;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(pattern)}
      style={inlineStyles.quickCardOuter}
    >
      <Card style={inlineStyles.quickCard}>
        {/* Category dot + name */}
        <View style={inlineStyles.quickCardHeader}>
          <View style={[inlineStyles.categoryDot, { backgroundColor: categoryColor }]} />
          <Text style={inlineStyles.quickCardCategory}>
            {pattern.category.charAt(0).toUpperCase() + pattern.category.slice(1)}
          </Text>
        </View>

        <Text style={inlineStyles.quickCardName} numberOfLines={1}>
          {pattern.name}
        </Text>

        {/* Difficulty */}
        <DifficultyStars level={pattern.difficulty} />

        {/* Duration */}
        <Text style={inlineStyles.quickCardDuration}>{pattern.durationRange}</Text>
      </Card>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HomeScreen ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export const HomeScreen: React.FC = () => {
  const greeting = useMemo(() => getGreeting(), []);

  // In a real app these would come from Redux / Context / hooks.
  const polyvagal = MOCK_POLYVAGAL;
  const recommendation = MOCK_RECOMMENDATION;
  const todayStats = MOCK_TODAY_STATS;
  const quickPatterns = MOCK_QUICK_START;
  const recentSession: RecentSession | null = MOCK_RECENT_SESSION;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleStartRecommended = () => {
    // eslint-disable-next-line no-console
    console.log('[HomeScreen] Start recommended session:', recommendation.patternName);
  };

  const handleQuickStart = (pattern: QuickStartPattern) => {
    // eslint-disable-next-line no-console
    console.log('[HomeScreen] Quick-start pattern:', pattern.name);
  };

  const handleRecentSessionPress = () => {
    // eslint-disable-next-line no-console
    console.log('[HomeScreen] View recent session:', recentSession?.patternName);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.logoText}>PNEUMA</Text>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>

        {/* ─── 2. Polyvagal State Card ────────────────────────────────── */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Autonomic State</Text>

          <PolyvagalIndicator state={polyvagal} style={styles.polyvagalIndicator} />

          {/* HR / HRV values */}
          <View style={styles.biometricRow}>
            <View style={styles.biometricItem}>
              <Text style={styles.biometricValue}>{polyvagal.heartRate}</Text>
              <Text style={styles.biometricLabel}>HR (bpm)</Text>
            </View>
            <View style={styles.biometricDivider} />
            <View style={styles.biometricItem}>
              <Text style={styles.biometricValue}>{polyvagal.hrv}</Text>
              <Text style={styles.biometricLabel}>HRV (ms)</Text>
            </View>
          </View>
        </Card>

        {/* ─── 3. Daily Recommendation Card ───────────────────────────── */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Daily Recommendation</Text>

          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationName}>{recommendation.patternName}</Text>
            <CategoryBadge category={recommendation.category} />
          </View>

          <Text style={styles.recommendationReason}>{recommendation.reason}</Text>

          <Text style={styles.recommendationDuration}>
            Suggested duration: {recommendation.durationMinutes} min
          </Text>

          <GlowButton
            title="Start Session"
            onPress={handleStartRecommended}
            color={Colors.bioluminescent}
            size="medium"
            style={styles.startButton}
          />
        </Card>

        {/* ─── 4. Today's Stats Row ───────────────────────────────────── */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Today</Text>
          <View style={styles.statsRow}>
            <StatBadge
              value={todayStats.sessionsCount}
              label="Sessions"
              icon="🧘"
              accentColor={Colors.bioluminescent}
              style={styles.statItem}
            />
            <StatBadge
              value={todayStats.minutesTotal}
              label="Minutes"
              icon="⏱"
              accentColor={Colors.neuralPurple}
              style={styles.statItem}
            />
            <StatBadge
              value={todayStats.streakDays}
              label="Day Streak"
              icon="🔥"
              accentColor={Colors.solarGold}
              style={styles.statItem}
            />
          </View>
        </Card>

        {/* ─── 5. Quick Start Section ─────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
        </View>

        <FlatList
          data={quickPatterns}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickStartList}
          renderItem={({ item }) => (
            <QuickStartCard pattern={item} onPress={handleQuickStart} />
          )}
        />

        {/* ─── 6. Recent Session ──────────────────────────────────────── */}
        {recentSession ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Session</Text>
            </View>

            <TouchableOpacity activeOpacity={0.75} onPress={handleRecentSessionPress}>
              <Card style={styles.sectionCard}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentPatternName}>{recentSession.patternName}</Text>
                  <Text style={styles.recentTimestamp}>{recentSession.timestamp}</Text>
                </View>

                <View style={styles.recentDetailsRow}>
                  <View style={styles.recentDetail}>
                    <Text style={styles.recentDetailValue}>{recentSession.durationMinutes} min</Text>
                    <Text style={styles.recentDetailLabel}>Duration</Text>
                  </View>
                  <View style={styles.recentDetail}>
                    <Text style={styles.recentDetailValue}>{recentSession.completionPercent}%</Text>
                    <Text style={styles.recentDetailLabel}>Completion</Text>
                  </View>
                </View>

                {/* Completion bar */}
                <View style={styles.completionTrack}>
                  <View
                    style={[
                      styles.completionFill,
                      { width: `${recentSession.completionPercent}%` as unknown as number },
                    ]}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          </>
        ) : null}

        {/* Bottom spacer for comfortable scrolling */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Styles ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    marginBottom: 28,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.bioluminescent,
    letterSpacing: 6,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.fogGrey,
    marginTop: 2,
  },

  // ── Shared card section ───────────────────────────────────────────────────
  sectionCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.fogGrey,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  // ── Polyvagal ─────────────────────────────────────────────────────────────
  polyvagalIndicator: {
    marginBottom: 18,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  biometricItem: {
    alignItems: 'center',
    flex: 1,
  },
  biometricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.moonlight,
  },
  biometricLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.fogGrey,
    marginTop: 2,
  },
  biometricDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(139, 149, 165, 0.25)',
  },

  // ── Recommendation ────────────────────────────────────────────────────────
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recommendationName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.moonlight,
    flexShrink: 1,
    marginRight: 12,
  },
  recommendationReason: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.fogGrey,
    lineHeight: 20,
    marginBottom: 10,
  },
  recommendationDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.bioluminescent,
    marginBottom: 16,
  },
  startButton: {
    marginTop: 4,
  },

  // ── Stats Row ─────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  statItem: {
    flex: 1,
  },

  // ── Quick Start ───────────────────────────────────────────────────────────
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  quickStartList: {
    paddingBottom: 8,
    paddingRight: 20,
  },

  // ── Recent Session ────────────────────────────────────────────────────────
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentPatternName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  recentTimestamp: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.fogGrey,
  },
  recentDetailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recentDetail: {
    marginRight: 32,
  },
  recentDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  recentDetailLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.fogGrey,
    marginTop: 2,
  },
  completionTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(139, 149, 165, 0.15)',
    overflow: 'hidden',
  },
  completionFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.bioluminescent,
  },

  // ── Bottom spacer ─────────────────────────────────────────────────────────
  bottomSpacer: {
    height: 40,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Inline-component styles ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const inlineStyles = StyleSheet.create({
  // ── CategoryBadge ─────────────────────────────────────────────────────────
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  // ── PolyvagalIndicator ────────────────────────────────────────────────────
  pvStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pvStateDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  pvStateLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  pvTrack: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  pvSegment: {
    flex: 1,
  },
  pvThumb: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: Colors.deepSpace,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,
  },
  pvAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  pvAxisText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.fogGrey,
    letterSpacing: 0.3,
  },

  // ── DifficultyStars ───────────────────────────────────────────────────────
  difficultyStars: {
    fontSize: 12,
    color: Colors.solarGold,
    letterSpacing: 2,
    marginTop: 6,
  },

  // ── QuickStartCard ────────────────────────────────────────────────────────
  quickCardOuter: {
    marginRight: 14,
  },
  quickCard: {
    width: 160,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  quickCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickCardCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.fogGrey,
    letterSpacing: 0.3,
  },
  quickCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.moonlight,
    marginBottom: 2,
  },
  quickCardDuration: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.fogGrey,
    marginTop: 6,
  },
});

export default HomeScreen;
