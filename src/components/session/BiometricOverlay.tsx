import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BiometricOverlayProps {
  heartRate: number | null;
  hrv: number | null;
  spo2: number | null;
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BiometricOverlay: React.FC<BiometricOverlayProps> = ({
  heartRate,
  hrv,
  spo2,
  visible,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top-left: Heart Rate */}
      <View style={styles.topLeft}>
        <View style={styles.metricRow}>
          <View style={[styles.dot, { backgroundColor: Colors.heartPink }]} />
          <Text style={styles.metricLabel}>HR</Text>
        </View>
        <Text style={styles.metricValue}>
          {heartRate !== null ? `${heartRate}` : '--'}
          <Text style={styles.metricUnit}> bpm</Text>
        </Text>
      </View>

      {/* Top-right: HRV */}
      <View style={styles.topRight}>
        <View style={styles.metricRow}>
          <View style={[styles.dot, { backgroundColor: Colors.neuralPurple }]} />
          <Text style={styles.metricLabel}>HRV</Text>
        </View>
        <Text style={styles.metricValue}>
          {hrv !== null ? `${hrv}` : '--'}
          <Text style={styles.metricUnit}> ms</Text>
        </Text>
      </View>

      {/* Bottom-left: SpO2 */}
      <View style={styles.bottomLeft}>
        <View style={styles.metricRow}>
          <View style={[styles.dot, { backgroundColor: Colors.bioluminescent }]} />
          <Text style={styles.metricLabel}>SpO2</Text>
        </View>
        <Text style={styles.metricValue}>
          {spo2 !== null ? `${spo2}%` : '--%'}
        </Text>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  topLeft: {
    position: 'absolute',
    top: Spacing.xxl,
    left: Spacing.lg,
  },
  topRight: {
    position: 'absolute',
    top: Spacing.xxl,
    right: Spacing.lg,
    alignItems: 'flex-end',
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 160, // above session controls
    left: Spacing.lg,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.moonlight,
    opacity: 0.7,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.fogGrey,
  },
});

export default BiometricOverlay;
