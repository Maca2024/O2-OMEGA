// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Stats Card Component
// Displays key metrics in beautiful card layout
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
}

export function StatsCard({
  icon,
  label,
  value,
  subtitle,
  color = Colors.bioluminescent,
}: StatsCardProps) {
  return (
    <View style={[styles.card, { borderColor: color + '20' }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

interface StatRowProps {
  children: React.ReactNode;
}

export function StatRow({ children }: StatRowProps) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: FontSize.h2,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: Colors.dimText,
    marginTop: 2,
    textAlign: 'center',
  },
});
