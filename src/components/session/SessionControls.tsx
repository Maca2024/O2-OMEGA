import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SessionControlsProps {
  isActive: boolean;
  round: number;
  totalRounds: number;
  breathCount: number;
  onPauseResume: () => void;
  onStop: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SessionControls: React.FC<SessionControlsProps> = ({
  isActive,
  round,
  totalRounds,
  breathCount,
  onPauseResume,
  onStop,
}) => {
  return (
    <View style={styles.container}>
      {/* Round & breath info */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Round {round} of {totalRounds}
        </Text>
        <View style={styles.infoDot} />
        <Text style={styles.infoText}>
          {breathCount} {breathCount === 1 ? 'breath' : 'breaths'}
        </Text>
      </View>

      {/* Control buttons */}
      <View style={styles.controlsRow}>
        {/* Stop button — smaller, subtle */}
        <TouchableOpacity
          style={styles.stopButton}
          onPress={onStop}
          activeOpacity={0.7}
          accessibilityLabel="Stop session"
          accessibilityRole="button"
        >
          <View style={styles.stopIcon} />
        </TouchableOpacity>

        {/* Pause / Resume — primary circle */}
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={onPauseResume}
          activeOpacity={0.7}
          accessibilityLabel={isActive ? 'Pause session' : 'Resume session'}
          accessibilityRole="button"
        >
          {isActive ? (
            // Pause icon — two vertical bars
            <View style={styles.pauseIconContainer}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            // Play icon — triangle
            <View style={styles.playIcon} />
          )}
        </TouchableOpacity>

        {/* Spacer to keep pause button centered */}
        <View style={styles.stopButton} />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.fogGrey,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.fogGrey,
    marginHorizontal: Spacing.sm,
    opacity: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xl,
  },
  pauseIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pauseBar: {
    width: 5,
    height: 22,
    borderRadius: 2,
    backgroundColor: Colors.moonlight,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: Colors.moonlight,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4, // visual centering
  },
  stopButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 75, 87, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 87, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIcon: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
});

export default SessionControls;
