import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Theme } from '../../theme';

// ---------------------------------------------------------------------------
// Demo Data
// ---------------------------------------------------------------------------

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Minutes practiced each day of the current week */
const WEEKLY_MINUTES = [12, 18, 0, 25, 15, 30, 8];
const WEEKLY_TOTAL = WEEKLY_MINUTES.reduce((sum, m) => sum + m, 0);
const MAX_WEEKLY = Math.max(...WEEKLY_MINUTES, 1);

/** Simulated HRV values (ms) for the past 7 days */
const HRV_VALUES = [42, 45, 43, 48, 47, 52, 54];
const CURRENT_HRV = HRV_VALUES[HRV_VALUES.length - 1];
const HRV_TREND_PERCENT = 12; // positive = improvement
const HRV_TREND_UP = HRV_TREND_PERCENT >= 0;

/** ANS / Polyvagal balance percentages */
const ANS_BALANCE = {
  ventral: 58,
  sympathetic: 28,
  dorsal: 14,
};

/** Recent session history */
const RECENT_SESSIONS = [
  {
    id: '1',
    pattern: 'Coherent Breathing',
    date: 'Today, 08:15',
    duration: '12 min',
    completion: 100,
    categoryColor: Colors.parasympatheticColor,
  },
  {
    id: '2',
    pattern: 'Wim Hof Method',
    date: 'Yesterday, 07:30',
    duration: '18 min',
    completion: 95,
    categoryColor: Colors.sympatheticColor,
  },
  {
    id: '3',
    pattern: 'Box Breathing',
    date: 'Jan 31, 19:00',
    duration: '10 min',
    completion: 100,
    categoryColor: Colors.parasympatheticColor,
  },
  {
    id: '4',
    pattern: 'Holotropic Breathwork',
    date: 'Jan 30, 16:45',
    duration: '25 min',
    completion: 88,
    categoryColor: Colors.transformativeColor,
  },
  {
    id: '5',
    pattern: 'Buteyko Reduced Breathing',
    date: 'Jan 29, 09:00',
    duration: '15 min',
    completion: 100,
    categoryColor: Colors.clinicalColor,
  },
];

/** Buteyko Control Pause demo data */
const CP_SCORE = 32; // seconds
const CP_TARGET = 60;
const CP_PREVIOUS = 28;

// ---------------------------------------------------------------------------
// Chart dimensions
// ---------------------------------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_PADDING = Spacing.lg * 2;
const BAR_CHART_HEIGHT = 140;
const HRV_CHART_HEIGHT = 120;
const HRV_CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING - Spacing.lg * 2;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const InsightsScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ---- Header ---- */}
      <Text style={styles.headerTitle}>Insights</Text>

      {/* ---- Weekly Overview Card ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Overview</Text>
        <Text style={styles.weeklyTotal}>
          {WEEKLY_TOTAL} <Text style={styles.weeklyTotalUnit}>min this week</Text>
        </Text>

        <View style={styles.barChart}>
          {WEEKLY_MINUTES.map((minutes, index) => {
            const barHeight =
              minutes > 0
                ? (minutes / MAX_WEEKLY) * (BAR_CHART_HEIGHT - 24)
                : 2;
            return (
              <View key={DAYS[index]} style={styles.barColumn}>
                <Text style={styles.barValue}>{minutes > 0 ? minutes : ''}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor:
                          minutes > 0
                            ? Colors.bioluminescent
                            : Colors.dimGrey,
                        opacity: minutes > 0 ? 1 : 0.3,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{DAYS[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ---- HRV Trend Card ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Heart Rate Variability</Text>
        <View style={styles.hrvHeader}>
          <Text style={styles.hrvCurrent}>{CURRENT_HRV} ms</Text>
          <Text
            style={[
              styles.hrvTrend,
              { color: HRV_TREND_UP ? Colors.bioluminescent : Colors.heartPink },
            ]}
          >
            {HRV_TREND_UP ? '↑' : '↓'} {Math.abs(HRV_TREND_PERCENT)}% vs last week
          </Text>
        </View>

        {/* Simple line chart with dots */}
        <View style={[styles.hrvChart, { height: HRV_CHART_HEIGHT }]}>
          {renderHRVChart()}
        </View>
        <View style={styles.hrvDayLabels}>
          {DAYS.map((day) => (
            <Text key={day} style={styles.hrvDayLabel}>
              {day}
            </Text>
          ))}
        </View>
      </View>

      {/* ---- ANS Balance Card ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nervous System Balance</Text>
        <Text style={styles.cardSubtitle}>Polyvagal state distribution</Text>

        <View style={styles.ansContainer}>
          {renderANSBar('Ventral', ANS_BALANCE.ventral, Colors.ventral)}
          {renderANSBar('Sympathetic', ANS_BALANCE.sympathetic, Colors.sympathetic)}
          {renderANSBar('Dorsal', ANS_BALANCE.dorsal, Colors.dorsal)}
        </View>
      </View>

      {/* ---- Session History ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Sessions</Text>

        {RECENT_SESSIONS.map((session) => (
          <View key={session.id} style={styles.sessionRow}>
            <View
              style={[
                styles.sessionIndicator,
                { backgroundColor: session.categoryColor },
              ]}
            />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionPattern}>{session.pattern}</Text>
              <Text style={styles.sessionMeta}>
                {session.date} · {session.duration}
              </Text>
            </View>
            <View style={styles.sessionCompletion}>
              <Text
                style={[
                  styles.sessionCompletionText,
                  {
                    color:
                      session.completion === 100
                        ? Colors.bioluminescent
                        : Colors.solarGold,
                  },
                ]}
              >
                {session.completion}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ---- Buteyko CP Tracker ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Control Pause Progress</Text>
        <Text style={styles.cardSubtitle}>Buteyko method benchmark</Text>

        <View style={styles.cpContainer}>
          <View style={styles.cpScoreContainer}>
            <Text style={styles.cpScore}>{CP_SCORE}</Text>
            <Text style={styles.cpScoreUnit}>seconds</Text>
          </View>

          <View style={styles.cpDetails}>
            <View style={styles.cpProgressBarTrack}>
              <View
                style={[
                  styles.cpProgressBarFill,
                  { width: `${Math.min((CP_SCORE / CP_TARGET) * 100, 100)}%` },
                ]}
              />
            </View>
            <View style={styles.cpLabels}>
              <Text style={styles.cpLabelText}>0s</Text>
              <Text style={styles.cpLabelText}>Target: {CP_TARGET}s</Text>
            </View>
            <Text style={styles.cpImprovement}>
              +{CP_SCORE - CP_PREVIOUS}s from last test
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom padding */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// HRV line chart renderer (absolute positioned dots + lines)
// ---------------------------------------------------------------------------

function renderHRVChart() {
  const minHRV = Math.min(...HRV_VALUES) - 5;
  const maxHRV = Math.max(...HRV_VALUES) + 5;
  const range = maxHRV - minHRV || 1;

  const dotSize = 8;
  const segmentWidth = HRV_CHART_WIDTH / (HRV_VALUES.length - 1);

  const points = HRV_VALUES.map((value, i) => ({
    x: i * segmentWidth,
    y: HRV_CHART_HEIGHT - ((value - minHRV) / range) * (HRV_CHART_HEIGHT - dotSize),
  }));

  const elements: React.ReactElement[] = [];

  // Draw connecting lines
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    elements.push(
      <View
        key={`line-${i}`}
        style={[
          styles.hrvLine,
          {
            left: points[i].x + dotSize / 2,
            top: points[i].y + dotSize / 2 - 1,
            width: length,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: 'left center',
          },
        ]}
      />,
    );
  }

  // Draw dots
  points.forEach((point, i) => {
    elements.push(
      <View
        key={`dot-${i}`}
        style={[
          styles.hrvDot,
          {
            left: point.x,
            top: point.y,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
          },
        ]}
      />,
    );
  });

  return elements;
}

// ---------------------------------------------------------------------------
// ANS balance bar renderer
// ---------------------------------------------------------------------------

function renderANSBar(label: string, percentage: number, color: string) {
  return (
    <View style={styles.ansRow} key={label}>
      <Text style={styles.ansLabel}>{label}</Text>
      <View style={styles.ansBarTrack}>
        <View
          style={[
            styles.ansBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={[styles.ansPercentage, { color }]}>{percentage}%</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.lg,
  },

  // Header
  headerTitle: {
    ...Typography.h1,
    color: Colors.moonlight,
    marginBottom: Spacing.lg,
  },

  // Card
  card: {
    backgroundColor: Colors.deepCurrent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Theme.cardShadow,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.moonlight,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginBottom: Spacing.md,
  },

  // Weekly Overview
  weeklyTotal: {
    ...Typography.h2,
    color: Colors.bioluminescent,
    marginBottom: Spacing.md,
  },
  weeklyTotalUnit: {
    ...Typography.body,
    color: Colors.fogGrey,
    fontWeight: '400',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: BAR_CHART_HEIGHT,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barValue: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginBottom: Spacing.xs,
    fontSize: 11,
  },
  barTrack: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: 20,
    borderRadius: BorderRadius.sm,
    minHeight: 2,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginTop: Spacing.xs,
    fontSize: 11,
  },

  // HRV Trend
  hrvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  hrvCurrent: {
    ...Typography.h2,
    color: Colors.moonlight,
  },
  hrvTrend: {
    ...Typography.bodyBold,
    fontSize: 14,
  },
  hrvChart: {
    position: 'relative',
    width: '100%',
    marginBottom: Spacing.xs,
  },
  hrvDot: {
    position: 'absolute',
    backgroundColor: Colors.neuralPurple,
    borderWidth: 2,
    borderColor: Colors.neuralPurpleLight,
  },
  hrvLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: Colors.neuralPurple,
    opacity: 0.6,
  },
  hrvDayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hrvDayLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    fontSize: 11,
  },

  // ANS Balance
  ansContainer: {
    gap: Spacing.md,
  },
  ansRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ansLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    width: 90,
    fontSize: 13,
  },
  ansBarTrack: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.midnightOcean,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginHorizontal: Spacing.sm,
  },
  ansBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  ansPercentage: {
    ...Typography.bodyBold,
    fontSize: 14,
    width: 42,
    textAlign: 'right',
  },

  // Session History
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dimGrey,
  },
  sessionIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionPattern: {
    ...Typography.bodyBold,
    color: Colors.moonlight,
    fontSize: 15,
  },
  sessionMeta: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginTop: 2,
  },
  sessionCompletion: {
    marginLeft: Spacing.sm,
  },
  sessionCompletionText: {
    ...Typography.bodyBold,
    fontSize: 14,
  },

  // Buteyko CP Tracker
  cpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cpScoreContainer: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  cpScore: {
    ...Typography.timerSmall,
    color: Colors.bioluminescent,
  },
  cpScoreUnit: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginTop: -2,
  },
  cpDetails: {
    flex: 1,
  },
  cpProgressBarTrack: {
    height: 10,
    backgroundColor: Colors.midnightOcean,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  cpProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.bioluminescent,
    borderRadius: BorderRadius.sm,
  },
  cpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cpLabelText: {
    ...Typography.caption,
    color: Colors.fogGrey,
    fontSize: 11,
  },
  cpImprovement: {
    ...Typography.caption,
    color: Colors.bioluminescent,
    marginTop: Spacing.xs,
  },

  // Spacing
  bottomSpacer: {
    height: Spacing.xxxl + Spacing.xl,
  },
});

export default InsightsScreen;
