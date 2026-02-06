// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — The Breath Orb
// Generative, organic, living visual element that breathes
// with the user. Not a simple expanding circle — a bioluminescent
// entity that responds to breath phase and intensity.
// ═══════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { BreathPhase, PatternCategory } from '../types/breathing';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ORB_BASE_SIZE = Math.min(SCREEN_WIDTH * 0.55, 260);

interface BreathOrbProps {
  phase: BreathPhase | null;
  progress: number; // 0–1 within current phase
  intensity: number; // 0–1 visual intensity
  category: PatternCategory;
  isActive: boolean;
  size?: number;
}

export function BreathOrb({
  phase,
  progress,
  intensity,
  category,
  isActive,
  size = ORB_BASE_SIZE,
}: BreathOrbProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.3);
  const innerPulse = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Ambient rotation
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Idle breathing animation
  useEffect(() => {
    if (!isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.95, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      return;
    }

    // Active phase animations
    switch (phase) {
      case 'inhale':
        scale.value = withTiming(1.35 + intensity * 0.15, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        glow.value = withTiming(0.7 + intensity * 0.3, { duration: 300 });
        break;
      case 'holdIn':
        scale.value = withSpring(1.3 + intensity * 0.1, { damping: 20, stiffness: 80 });
        glow.value = withTiming(0.8, { duration: 500 });
        break;
      case 'exhale':
        scale.value = withTiming(0.75, {
          duration: 200,
          easing: Easing.in(Easing.cubic),
        });
        glow.value = withTiming(0.15, { duration: 400 });
        break;
      case 'holdOut':
        scale.value = withTiming(0.7, { duration: 500, easing: Easing.inOut(Easing.sin) });
        glow.value = withTiming(0.05, { duration: 500 });
        break;
      case 'free':
        innerPulse.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 1000 }),
            withTiming(0.9, { duration: 1000 })
          ),
          -1,
          true
        );
        break;
    }
  }, [phase, isActive, intensity]);

  // Inner shimmer pulse
  useEffect(() => {
    innerPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.92, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const categoryColors = getCategoryGradient(category);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: interpolate(glow.value, [0, 1], [1, 1.6]) }],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerPulse.value }],
    opacity: interpolate(innerPulse.value, [0.9, 1.1], [0.6, 1]),
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    opacity: interpolate(glow.value, [0, 1], [0.1, 0.4]),
  }));

  return (
    <View style={[styles.container, { width: size * 1.8, height: size * 1.8 }]}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          glowStyle,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: size * 0.8,
            borderColor: categoryColors.glow,
          },
        ]}
      />

      {/* Rotating decorative ring */}
      <Animated.View
        style={[
          styles.decorativeRing,
          ringStyle,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 0.65,
            borderColor: categoryColors.accent,
          },
        ]}
      />

      {/* Main orb */}
      <Animated.View
        style={[
          styles.orb,
          orbStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: categoryColors.primary,
            shadowColor: categoryColors.glow,
          },
        ]}
      >
        {/* Inner shimmer */}
        <Animated.View
          style={[
            styles.innerOrb,
            innerStyle,
            {
              width: size * 0.65,
              height: size * 0.65,
              borderRadius: (size * 0.65) / 2,
              backgroundColor: categoryColors.inner,
            },
          ]}
        />

        {/* Core light */}
        <View
          style={[
            styles.coreLight,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              backgroundColor: categoryColors.core,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

function getCategoryGradient(category: PatternCategory) {
  switch (category) {
    case 'parasympathetic':
      return {
        primary: 'rgba(0, 212, 170, 0.25)',
        inner: 'rgba(0, 229, 196, 0.35)',
        core: 'rgba(0, 255, 220, 0.7)',
        glow: 'rgba(0, 212, 170, 0.3)',
        accent: 'rgba(0, 229, 196, 0.2)',
      };
    case 'sympathetic':
      return {
        primary: 'rgba(255, 217, 61, 0.25)',
        inner: 'rgba(255, 140, 66, 0.35)',
        core: 'rgba(255, 200, 80, 0.7)',
        glow: 'rgba(255, 217, 61, 0.3)',
        accent: 'rgba(255, 140, 66, 0.2)',
      };
    case 'clinical':
      return {
        primary: 'rgba(77, 166, 255, 0.25)',
        inner: 'rgba(107, 184, 255, 0.35)',
        core: 'rgba(140, 200, 255, 0.7)',
        glow: 'rgba(77, 166, 255, 0.3)',
        accent: 'rgba(107, 184, 255, 0.2)',
      };
    case 'transformative':
      return {
        primary: 'rgba(123, 104, 238, 0.25)',
        inner: 'rgba(167, 139, 250, 0.4)',
        core: 'rgba(192, 132, 252, 0.7)',
        glow: 'rgba(123, 104, 238, 0.3)',
        accent: 'rgba(192, 132, 252, 0.2)',
      };
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  decorativeRing: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  orb: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  innerOrb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coreLight: {
    position: 'absolute',
  },
});
