// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Nervous System Aurora Background
// Living background that reflects the autonomic nervous system
// ═══════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { PolyvagalState } from '../types/breathing';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface AuroraBackgroundProps {
  state?: PolyvagalState;
  children: React.ReactNode;
}

export function AuroraBackground({ state = 'ventral', children }: AuroraBackgroundProps) {
  const pulse = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    const speed = state === 'sympathetic' ? 4000 : state === 'dorsal' ? 8000 : 6000;

    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: speed, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: speed, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: speed * 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: speed * 2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [state]);

  const auroraLayer1 = useAnimatedStyle(() => {
    const colors: Record<PolyvagalState, [string, string]> = {
      ventral: [Colors.bioluminescent + '10', Colors.bioluminescent + '05'],
      sympathetic: [Colors.amber + '12', Colors.sympatheticPrimary + '08'],
      dorsal: [Colors.fogGrey + '08', Colors.dimText + '05'],
    };
    const [colorA, colorB] = colors[state];

    return {
      backgroundColor: interpolateColor(pulse.value, [0, 1], [colorA, colorB]),
      transform: [
        { translateY: drift.value * 20 - 10 },
        { scale: 1 + pulse.value * 0.05 },
      ],
    };
  });

  const auroraLayer2 = useAnimatedStyle(() => {
    const colors: Record<PolyvagalState, [string, string]> = {
      ventral: [Colors.neuralPurple + '08', Colors.bioluminescent + '04'],
      sympathetic: [Colors.heartPink + '06', Colors.amber + '04'],
      dorsal: [Colors.dimText + '06', Colors.fogGrey + '03'],
    };
    const [colorA, colorB] = colors[state];

    return {
      backgroundColor: interpolateColor(pulse.value, [0, 1], [colorB, colorA]),
      transform: [
        { translateX: drift.value * 15 - 7 },
        { scale: 1 + (1 - pulse.value) * 0.03 },
      ],
    };
  });

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[styles.auroraLayer, styles.layer1, auroraLayer1]} />
      <Animated.View style={[styles.auroraLayer, styles.layer2, auroraLayer2]} />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  auroraLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  layer1: {
    top: -height * 0.1,
  },
  layer2: {
    top: height * 0.3,
  },
});
