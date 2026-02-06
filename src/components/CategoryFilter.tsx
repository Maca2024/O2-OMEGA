// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Category Filter Tabs
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PatternCategory } from '../types/breathing';
import { Colors, CategoryColors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { triggerSelection } from '../engine/haptics';

interface CategoryFilterProps {
  selected: PatternCategory | 'all';
  onSelect: (category: PatternCategory | 'all') => void;
}

const CATEGORIES: Array<{ key: PatternCategory | 'all'; label: string; icon: string }> = [
  { key: 'all', label: 'All', icon: '✦' },
  { key: 'parasympathetic', label: 'Calm', icon: '🟢' },
  { key: 'sympathetic', label: 'Energy', icon: '🟡' },
  { key: 'clinical', label: 'Clinical', icon: '🔵' },
  { key: 'transformative', label: 'Transform', icon: '🟣' },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat.key;
        const color =
          cat.key === 'all'
            ? Colors.bioluminescent
            : CategoryColors[cat.key]?.primary || Colors.bioluminescent;

        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.tab,
              isSelected && { backgroundColor: color + '20', borderColor: color + '40' },
            ]}
            onPress={() => {
              triggerSelection();
              onSelect(cat.key);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                isSelected && { color, fontWeight: '700' },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: Spacing.xs,
  },
  tabIcon: {
    fontSize: 12,
  },
  tabLabel: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    fontWeight: '500',
  },
});
