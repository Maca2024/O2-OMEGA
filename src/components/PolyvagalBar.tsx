// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Polyvagal Status Bar
// Real-time nervous system state indicator
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PolyvagalReading } from '../engine/polyvagal';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';

interface PolyvagalBarProps {
  reading: PolyvagalReading;
  compact?: boolean;
}

export function PolyvagalBar({ reading, compact = false }: PolyvagalBarProps) {
  const indicatorPosition = useSharedValue(reading.position);

  React.useEffect(() => {
    indicatorPosition.value = withSpring(reading.position, {
      damping: 20,
      stiffness: 60,
    });
  }, [reading.position]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorPosition.value * 100}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    left: `${indicatorPosition.value * 100}%`,
    backgroundColor: reading.glowColor,
    opacity: withTiming(0.4, { duration: 500 }),
  }));

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.dot, { backgroundColor: reading.color }]} />
        <Text style={[styles.compactLabel, { color: reading.color }]}>
          {reading.label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.stateLabel, { color: reading.color }]}>
          {reading.label}
        </Text>
      </View>

      <View style={styles.barContainer}>
        {/* Track */}
        <View style={styles.track}>
          <View style={[styles.trackSection, { backgroundColor: Colors.dorsal + '40' }]} />
          <View
            style={[styles.trackSection, { backgroundColor: Colors.sympatheticPrimary + '40' }]}
          />
          <View style={[styles.trackSection, { backgroundColor: Colors.ventral + '40' }]} />
        </View>

        {/* Glow behind indicator */}
        <Animated.View style={[styles.indicatorGlow, glowStyle]} />

        {/* Position indicator */}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View style={[styles.indicatorDot, { backgroundColor: reading.color }]} />
        </Animated.View>
      </View>

      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Dorsal</Text>
        <Text style={styles.legendText}>Sympathetic</Text>
        <Text style={styles.legendText}>Ventral</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  stateLabel: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  barContainer: {
    height: 24,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackSection: {
    flex: 1,
  },
  indicatorGlow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -15,
    top: -3,
  },
  indicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    marginLeft: -8,
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.moonlight,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  legendText: {
    fontSize: 10,
    color: Colors.dimText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactLabel: {
    fontSize: FontSize.caption,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
