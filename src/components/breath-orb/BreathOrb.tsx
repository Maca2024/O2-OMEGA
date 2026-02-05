import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Easing, Dimensions } from 'react-native';

import type { BreathPhase, PatternCategory } from '../../types/breath';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BreathOrbProps {
  phase: BreathPhase;
  progress: number; // 0-1
  phaseDuration: number; // ms
  category: PatternCategory;
  size?: number;
}

// ---------------------------------------------------------------------------
// Category color mapping
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<PatternCategory, { primary: string; secondary: string }> = {
  parasympathetic: { primary: '#00D4AA', secondary: '#00E5C4' },
  sympathetic: { primary: '#FFD93D', secondary: '#FF8C42' },
  clinical: { primary: '#4A9EFF', secondary: '#6CB4FF' },
  transformative: { primary: '#7B68EE', secondary: '#C084FC' },
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 8;
const CONTRACTED_SCALE = 0.6;
const EXPANDED_SCALE = 1.0;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_SIZE = Math.round(SCREEN_WIDTH * 0.6);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BreathOrb: React.FC<BreathOrbProps> = ({
  phase,
  progress,
  phaseDuration,
  category,
  size = DEFAULT_SIZE,
}) => {
  const colors = CATEGORY_COLORS[category];

  // ---- Animated values ----
  const scaleAnim = useRef(new Animated.Value(CONTRACTED_SCALE)).current;
  const shimmerAnim = useRef(new Animated.Value(1)).current;
  const particleAngle = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.2)).current;

  // Refs to track running animations so we can stop them cleanly
  const shimmerLoop = useRef<Animated.CompositeAnimation | null>(null);
  const particleLoop = useRef<Animated.CompositeAnimation | null>(null);

  // ------------------------------------------------------------------
  // Scale animation — drives the core "breathing" expansion / contraction
  // ------------------------------------------------------------------
  useEffect(() => {
    let toValue = CONTRACTED_SCALE;
    let easing: (value: number) => number = Easing.inOut(Easing.sin);

    switch (phase) {
      case 'inhale':
        toValue = EXPANDED_SCALE;
        easing = Easing.out(Easing.sin);
        break;
      case 'holdIn':
        toValue = EXPANDED_SCALE;
        break;
      case 'exhale':
        toValue = CONTRACTED_SCALE;
        easing = Easing.in(Easing.sin);
        break;
      case 'holdOut':
        toValue = CONTRACTED_SCALE;
        break;
      case 'free':
        toValue = 0.8;
        break;
    }

    const anim = Animated.timing(scaleAnim, {
      toValue,
      duration: phaseDuration,
      easing,
      useNativeDriver: true,
    });
    anim.start();

    return () => anim.stop();
  }, [phase, phaseDuration, scaleAnim]);

  // ------------------------------------------------------------------
  // Hold shimmer — subtle pulsing opacity during hold phases
  // ------------------------------------------------------------------
  useEffect(() => {
    if (shimmerLoop.current) {
      shimmerLoop.current.stop();
      shimmerLoop.current = null;
    }

    if (phase === 'holdIn' || phase === 'holdOut') {
      shimmerAnim.setValue(1);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 0.8,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 1.0,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      shimmerLoop.current = loop;
      loop.start();
    } else {
      shimmerAnim.setValue(1);
    }

    return () => {
      if (shimmerLoop.current) {
        shimmerLoop.current.stop();
        shimmerLoop.current = null;
      }
    };
  }, [phase, shimmerAnim]);

  // ------------------------------------------------------------------
  // Glow pulse — gentle outer-ring breathing independent of phase
  // ------------------------------------------------------------------
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.3,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.15,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glowPulse]);

  // ------------------------------------------------------------------
  // Particle ring rotation — speed varies by phase
  // ------------------------------------------------------------------
  useEffect(() => {
    if (particleLoop.current) {
      particleLoop.current.stop();
      particleLoop.current = null;
    }

    let speed = 12000; // default rotation period in ms
    switch (phase) {
      case 'inhale':
        speed = 8000;
        break;
      case 'exhale':
        speed = 14000;
        break;
      case 'holdIn':
      case 'holdOut':
        speed = 20000;
        break;
      case 'free':
        speed = 10000;
        break;
    }

    const loop = Animated.loop(
      Animated.timing(particleAngle, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    particleLoop.current = loop;
    loop.start();

    return () => {
      if (particleLoop.current) {
        particleLoop.current.stop();
        particleLoop.current = null;
      }
    };
  }, [phase, particleAngle]);

  // ------------------------------------------------------------------
  // Particle positions — 8 dots at varying orbit distances
  // ------------------------------------------------------------------
  const particles = useMemo(() => {
    const items: { baseAngle: number; orbitRadius: number; dotSize: number; opacity: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseAngle = (i / PARTICLE_COUNT) * 2 * Math.PI;
      // Vary the orbit radius between 0.56 and 0.72 of half-size
      const orbitRadius = (size / 2) * (0.56 + (i % 3) * 0.08);
      const dotSize = 3 + (i % 3);
      const opacity = 0.4 + (i % 3) * 0.2;
      items.push({ baseAngle, orbitRadius, dotSize, opacity });
    }
    return items;
  }, [size]);

  // ------------------------------------------------------------------
  // Derived animated transforms
  // ------------------------------------------------------------------
  const outerGlowScale = Animated.multiply(scaleAnim, 1.3);
  const middleGlowScale = Animated.multiply(scaleAnim, 1.15);

  const halfSize = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* ---- Outer glow ring ---- */}
      <Animated.View
        style={[
          styles.orbLayer,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            backgroundColor: colors.primary,
            opacity: glowPulse,
            transform: [{ scale: outerGlowScale }],
          },
        ]}
      />

      {/* ---- Middle glow ring ---- */}
      <Animated.View
        style={[
          styles.orbLayer,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            backgroundColor: colors.primary,
            opacity: Animated.multiply(shimmerAnim, 0.35),
            transform: [{ scale: middleGlowScale }],
          },
        ]}
      />

      {/* ---- Inner core ---- */}
      <Animated.View
        style={[
          styles.orbLayer,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            opacity: shimmerAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Radial gradient simulation via nested circles */}
        <View
          style={[
            styles.innerGradientOuter,
            {
              width: size,
              height: size,
              borderRadius: halfSize,
              backgroundColor: colors.primary,
            },
          ]}
        />
        <View
          style={[
            styles.innerGradientMiddle,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: (size * 0.7) / 2,
              backgroundColor: colors.secondary,
            },
          ]}
        />
        <View
          style={[
            styles.innerGradientCenter,
            {
              width: size * 0.35,
              height: size * 0.35,
              borderRadius: (size * 0.35) / 2,
              backgroundColor: '#FFFFFF',
            },
          ]}
        />
      </Animated.View>

      {/* ---- Particle ring ---- */}
      {particles.map((p, i) => {
        // Each particle rotates around the orb center
        const rotate = particleAngle.interpolate({
          inputRange: [0, 1],
          outputRange: [`${p.baseAngle}rad`, `${p.baseAngle + 2 * Math.PI}rad`],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particleWrapper,
              {
                width: size,
                height: size,
                transform: [{ rotate }],
              },
            ]}
          >
            <View
              style={[
                styles.particle,
                {
                  width: p.dotSize,
                  height: p.dotSize,
                  borderRadius: p.dotSize / 2,
                  backgroundColor: colors.secondary,
                  opacity: p.opacity,
                  // Position dot at the orbit radius from center
                  top: halfSize - p.orbitRadius - p.dotSize / 2,
                  left: halfSize - p.dotSize / 2,
                },
              ]}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGradientOuter: {
    position: 'absolute',
    opacity: 0.6,
  },
  innerGradientMiddle: {
    position: 'absolute',
    opacity: 0.45,
  },
  innerGradientCenter: {
    position: 'absolute',
    opacity: 0.15,
  },
  particleWrapper: {
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
  },
});

export default BreathOrb;
