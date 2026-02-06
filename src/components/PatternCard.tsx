// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Pattern Card Component
// Displays breathing pattern info with category-themed styling
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BreathPattern } from '../types/breathing';
import { Colors, CategoryColors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 3) / 2;

interface PatternCardProps {
  pattern: BreathPattern;
  onPress: () => void;
  isLocked?: boolean;
  isFavorite?: boolean;
  compact?: boolean;
}

export function PatternCard({
  pattern,
  onPress,
  isLocked = false,
  isFavorite = false,
  compact = false,
}: PatternCardProps) {
  const catColors = CategoryColors[pattern.category];

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { borderColor: catColors.primary + '30' }]}
        onPress={onPress}
        activeOpacity={isLocked ? 1 : 0.7}
      >
        <Text style={styles.compactIcon}>{pattern.icon}</Text>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>
            {pattern.name}
          </Text>
          <Text style={styles.compactSubtitle} numberOfLines={1}>
            {pattern.subtitle}
          </Text>
        </View>
        {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
        {isFavorite && !isLocked && <Text style={styles.favIcon}>♥</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: catColors.primary + '25',
          backgroundColor: Colors.deepCurrent + 'CC',
        },
      ]}
      onPress={onPress}
      activeOpacity={isLocked ? 1 : 0.7}
    >
      {isLocked && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedText}>🔒 Level {pattern.requiredLevel}</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <Text style={styles.icon}>{pattern.icon}</Text>
        {isFavorite && <Text style={styles.favBadge}>♥</Text>}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {pattern.name}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {pattern.subtitle}
      </Text>

      <View style={styles.metaRow}>
        <View style={[styles.badge, { backgroundColor: catColors.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: catColors.primary }]}>
            {pattern.difficulty}
          </Text>
        </View>
        <Text style={styles.bpm}>{pattern.bpmRange} bpm</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  favBadge: {
    fontSize: 16,
    color: Colors.heartPink,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.moonlight,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bpm: {
    fontSize: 11,
    color: Colors.fogGrey,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 39, 0.7)',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lockedText: {
    color: Colors.fogGrey,
    fontSize: FontSize.caption,
    fontWeight: '600',
  },
  lockIcon: {
    fontSize: 14,
    marginLeft: Spacing.sm,
  },

  // Compact styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    backgroundColor: Colors.deepCurrent + 'CC',
    marginBottom: Spacing.sm,
  },
  compactIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  compactSubtitle: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: 1,
  },
  favIcon: {
    fontSize: 14,
    color: Colors.heartPink,
    marginLeft: Spacing.sm,
  },
});
