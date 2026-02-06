// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Breathe Tab (Quick Start)
// Central breathing CTA — starts default pattern immediately
// ═══════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BreathOrb } from '../../src/components/BreathOrb';
import { AuroraBackground } from '../../src/components/AuroraBackground';
import { PATTERNS } from '../../src/data/patterns';
import { useStore } from '../../src/hooks/useStore';
import { Colors, CategoryColors } from '../../src/theme/colors';
import { Spacing, BorderRadius, FontSize } from '../../src/theme/spacing';
import { triggerSelection } from '../../src/engine/haptics';

export default function BreatheTab() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);

  // Favorite patterns or defaults
  const quickPatterns = useMemo(() => {
    if (user.favoritePatterns.length > 0) {
      return user.favoritePatterns
        .map((id) => PATTERNS.find((p) => p.id === id))
        .filter(Boolean)
        .slice(0, 6) as typeof PATTERNS;
    }
    return PATTERNS.filter((p) =>
      ['coherent', 'box-breathing', 'four-seven-eight', 'wim-hof', 'breath-of-fire', 'physiological-sigh'].includes(p.id)
    );
  }, [user.favoritePatterns]);

  const defaultPattern = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 10) return 'coherent';
    if (hour < 14) return 'box-breathing';
    if (hour < 18) return 'breath-of-fire';
    return 'four-seven-eight';
  }, []);

  const handleQuickStart = () => {
    triggerSelection();
    router.push(`/session?patternId=${defaultPattern}`);
  };

  return (
    <AuroraBackground state="ventral">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <BreathOrb
            phase={null}
            progress={0}
            intensity={0.4}
            category="parasympathetic"
            isActive={false}
            size={220}
          />
        </View>

        {/* Quick Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleQuickStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startText}>Start Breathing</Text>
          <Text style={styles.startSubtext}>
            {PATTERNS.find((p) => p.id === defaultPattern)?.name}
          </Text>
        </TouchableOpacity>

        {/* Duration Options */}
        <View style={styles.durationRow}>
          {[3, 5, 10, 15, 20].map((mins) => (
            <TouchableOpacity
              key={mins}
              style={[styles.durationChip, mins === 5 && styles.durationChipActive]}
              onPress={() => {
                triggerSelection();
                router.push(`/session?patternId=${defaultPattern}`);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.durationText,
                  mins === 5 && styles.durationTextActive,
                ]}
              >
                {mins}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pattern Quick Select */}
        <View style={styles.patternsSection}>
          <Text style={styles.sectionTitle}>Choose Pattern</Text>
          <View style={styles.patternGrid}>
            {quickPatterns.map((pattern) => {
              const catColors = CategoryColors[pattern.category];
              return (
                <TouchableOpacity
                  key={pattern.id}
                  style={[styles.patternChip, { borderColor: catColors.primary + '30' }]}
                  onPress={() => {
                    triggerSelection();
                    router.push(`/session?patternId=${pattern.id}`);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.patternIcon}>{pattern.icon}</Text>
                  <Text style={styles.patternName} numberOfLines={1}>
                    {pattern.name}
                  </Text>
                  <Text style={[styles.patternCategory, { color: catColors.primary }]}>
                    {pattern.difficulty}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  heroSection: {
    paddingTop: Spacing.huge + Spacing.xl,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: Colors.bioluminescent,
    paddingHorizontal: Spacing.huge,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    marginTop: Spacing.xl,
    shadowColor: Colors.bioluminescent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startText: {
    fontSize: FontSize.h3,
    fontWeight: '800',
    color: Colors.deepSpace,
  },
  startSubtext: {
    fontSize: FontSize.caption,
    color: Colors.deepSpace + 'AA',
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  durationChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  durationChipActive: {
    borderColor: Colors.bioluminescent + '50',
    backgroundColor: Colors.bioluminescent + '15',
  },
  durationText: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    fontWeight: '600',
  },
  durationTextActive: {
    color: Colors.bioluminescent,
  },
  patternsSection: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: FontSize.bodyLarge,
    fontWeight: '700',
    color: Colors.moonlight,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  patternChip: {
    width: '47%',
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  patternIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  patternName: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.moonlight,
    textAlign: 'center',
  },
  patternCategory: {
    fontSize: 11,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 120,
  },
});
