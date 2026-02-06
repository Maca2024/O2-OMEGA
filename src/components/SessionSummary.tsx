// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Session Summary Card
// Post-session reflection and stats display
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BreathPattern } from '../types/breathing';
import { Colors, CategoryColors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { formatTime } from '../engine/breathEngine';

interface SessionSummaryProps {
  pattern: BreathPattern;
  durationMs: number;
  roundsCompleted: number;
  onDone: () => void;
  onRepeat: () => void;
}

export function SessionSummary({
  pattern,
  durationMs,
  roundsCompleted,
  onDone,
  onRepeat,
}: SessionSummaryProps) {
  const catColors = CategoryColors[pattern.category];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌟</Text>
      <Text style={styles.title}>Session Complete</Text>
      <Text style={styles.patternName}>{pattern.name}</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: catColors.primary }]}>
            {formatTime(durationMs)}
          </Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: catColors.primary }]}>
            {roundsCompleted}
          </Text>
          <Text style={styles.statLabel}>Rounds</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: catColors.primary }]}>
            +{Math.round(durationMs / 60000) * 10}
          </Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
      </View>

      <View style={styles.moodSection}>
        <Text style={styles.moodQuestion}>How do you feel?</Text>
        <View style={styles.moodRow}>
          {['😔', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
            <TouchableOpacity key={i} style={styles.moodButton} activeOpacity={0.7}>
              <Text style={styles.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.repeatButton, { borderColor: catColors.primary + '40' }]}
          onPress={onRepeat}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: catColors.primary }]}>Repeat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.doneButton, { backgroundColor: catColors.primary }]}
          onPress={onDone}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: Colors.deepSpace }]}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: '800',
    color: Colors.moonlight,
    marginBottom: Spacing.xs,
  },
  patternName: {
    fontSize: FontSize.bodyLarge,
    color: Colors.fogGrey,
    marginBottom: Spacing.xxxl,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.h2,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
  },
  moodSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  moodQuestion: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    marginBottom: Spacing.md,
  },
  moodRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  moodButton: {
    padding: Spacing.sm,
  },
  moodEmoji: {
    fontSize: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  repeatButton: {
    borderWidth: 1.5,
  },
  doneButton: {},
  buttonText: {
    fontSize: FontSize.body,
    fontWeight: '700',
  },
});
