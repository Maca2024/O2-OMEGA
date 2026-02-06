// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Onboarding Flow
// Welcome, ANS education, first breath, and profile setup
// ═══════════════════════════════════════════════════════════════

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BreathOrb } from '../components/BreathOrb';
import { useStore } from '../hooks/useStore';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { triggerSelection } from '../engine/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visual: 'orb-calm' | 'orb-energy' | 'orb-transform' | 'welcome';
  color: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    title: 'PNEUMA O2',
    subtitle: 'Breathe Beyond',
    description:
      'The world\'s most advanced breathwork platform.\nFrom daily calm to consciousness expansion.',
    visual: 'welcome',
    color: Colors.bioluminescent,
  },
  {
    id: 'ans',
    title: 'Your Nervous System',
    subtitle: 'The Navigator',
    description:
      'Your breath is the bridge between body and consciousness. Pneuma O2 maps your autonomic nervous system in real-time and guides you to the state you need.',
    visual: 'orb-calm',
    color: Colors.ventral,
  },
  {
    id: 'spectrum',
    title: 'Full Spectrum',
    subtitle: '20+ Scientifically-Backed Patterns',
    description:
      'From calming Coherent Breathing to energizing Wim Hof, from clinical Buteyko to transformative DMT Activation Protocol. Every technique, one platform.',
    visual: 'orb-energy',
    color: Colors.sympatheticPrimary,
  },
  {
    id: 'safety',
    title: 'Progressive Access',
    subtitle: 'Safe Exploration',
    description:
      'Advanced techniques unlock as you build experience. 4 levels ensure you\'re always prepared for what comes next. Your safety is our foundation.',
    visual: 'orb-transform',
    color: Colors.neuralPurple,
  },
];

export function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      triggerSelection();
    } else {
      completeOnboarding();
    }
  };

  const skip = () => {
    completeOnboarding();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      {/* Visual */}
      <View style={styles.visualContainer}>
        {item.visual === 'welcome' ? (
          <Animated.View entering={FadeIn.duration(800)} style={styles.welcomeVisual}>
            <BreathOrb
              phase={null}
              progress={0}
              intensity={0.3}
              category="parasympathetic"
              isActive={false}
              size={200}
            />
          </Animated.View>
        ) : item.visual === 'orb-calm' ? (
          <BreathOrb
            phase="inhale"
            progress={0.5}
            intensity={0.5}
            category="parasympathetic"
            isActive={false}
            size={180}
          />
        ) : item.visual === 'orb-energy' ? (
          <BreathOrb
            phase="inhale"
            progress={0.7}
            intensity={0.7}
            category="sympathetic"
            isActive={false}
            size={180}
          />
        ) : (
          <BreathOrb
            phase="inhale"
            progress={0.9}
            intensity={0.9}
            category="transformative"
            isActive={false}
            size={180}
          />
        )}
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={[styles.slideTitle, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && {
                backgroundColor: SLIDES[currentIndex].color,
                width: 24,
              },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {currentIndex < SLIDES.length - 1 ? (
          <>
            <TouchableOpacity onPress={skip} style={styles.skipButton} activeOpacity={0.7}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goNext}
              style={[styles.nextButton, { backgroundColor: SLIDES[currentIndex].color }]}
              activeOpacity={0.7}
            >
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={goNext}
            style={[styles.startButton, { backgroundColor: SLIDES[currentIndex].color }]}
            activeOpacity={0.7}
          >
            <Text style={styles.startText}>Begin Your Journey</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  visualContainer: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeVisual: {
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.35,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  slideTitle: {
    fontSize: FontSize.h1,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: FontSize.bodyLarge,
    color: Colors.fogGrey,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    marginTop: Spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dimText,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.huge,
    gap: Spacing.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  skipText: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    fontWeight: '500',
  },
  nextButton: {
    flex: 2,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
  },
  nextText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.deepSpace,
  },
  startButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
  },
  startText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.deepSpace,
  },
});
