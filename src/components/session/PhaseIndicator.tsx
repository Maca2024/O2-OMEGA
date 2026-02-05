import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';

import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import type { BreathPhase } from '../../types/breath';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PhaseIndicatorProps {
  phase: BreathPhase;
  secondsRemaining: number;
  totalSeconds: number;
}

// ---------------------------------------------------------------------------
// Phase display mapping
// ---------------------------------------------------------------------------

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'INHALE',
  holdIn: 'HOLD',
  exhale: 'EXHALE',
  holdOut: 'HOLD',
  free: 'BREATHE',
};

const PHASE_INSTRUCTIONS: Record<BreathPhase, string> = {
  inhale: 'Breathe in slowly through your nose',
  holdIn: 'Gently hold your breath',
  exhale: 'Release slowly through your mouth',
  holdOut: 'Rest in the stillness',
  free: 'Follow your natural rhythm',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  phase,
  secondsRemaining,
  totalSeconds,
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fade transition when phase changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [phase, fadeAnim]);

  // Format seconds as integer countdown
  const displaySeconds = Math.max(0, Math.ceil(secondsRemaining));

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Phase name */}
      <Text style={styles.phaseLabel}>{PHASE_LABELS[phase]}</Text>

      {/* Countdown timer */}
      <Text style={styles.timer}>{displaySeconds}</Text>

      {/* Instruction text */}
      <Text style={styles.instruction}>{PHASE_INSTRUCTIONS[phase]}</Text>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  phaseLabel: {
    ...Typography.label,
    color: Colors.moonlight,
    fontSize: 14,
    letterSpacing: 4,
    marginBottom: 8,
  },
  timer: {
    ...Typography.timer,
    color: Colors.moonlight,
    marginBottom: 8,
  },
  instruction: {
    ...Typography.caption,
    color: Colors.fogGrey,
    textAlign: 'center',
    maxWidth: 240,
  },
});

export default PhaseIndicator;
