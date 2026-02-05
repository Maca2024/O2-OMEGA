import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BiometricSnapshot {
  hrBefore: number;
  hrAfter: number;
  hrvBefore: number;
  hrvAfter: number;
}

interface SessionCompleteProps {
  durationSeconds: number;
  totalBreaths: number;
  completionRate: number; // 0-1
  biometrics?: BiometricSnapshot | null;
  onDone: (mood: number, journal: string) => void;
}

// ---------------------------------------------------------------------------
// Mood faces
// ---------------------------------------------------------------------------

const MOOD_FACES = [
  { emoji: '\uD83D\uDE23', label: 'Stressed' },
  { emoji: '\uD83D\uDE15', label: 'Uneasy' },
  { emoji: '\uD83D\uDE10', label: 'Neutral' },
  { emoji: '\uD83D\uDE0C', label: 'Calm' },
  { emoji: '\u2728', label: 'Blissful' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SessionComplete: React.FC<SessionCompleteProps> = ({
  durationSeconds,
  totalBreaths,
  completionRate,
  biometrics,
  onDone,
}) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState('');

  // Entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleDone = () => {
    onDone(selectedMood ?? 2, journalText);
  };

  const completionPercent = Math.round(completionRate * 100);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Heading */}
          <Text style={styles.heading}>Session Complete</Text>
          <View style={styles.divider} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatDuration(durationSeconds)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalBreaths}</Text>
              <Text style={styles.statLabel}>Breaths</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completionPercent}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>

          {/* Biometric before/after comparison */}
          {biometrics && (
            <View style={styles.biometricsCard}>
              <Text style={styles.sectionTitle}>Before / After</Text>
              <View style={styles.bioRow}>
                <Text style={styles.bioLabel}>Heart Rate</Text>
                <Text style={styles.bioValues}>
                  {biometrics.hrBefore} <Text style={styles.bioArrow}>{'\u2192'}</Text>{' '}
                  {biometrics.hrAfter} bpm
                </Text>
              </View>
              <View style={styles.bioRow}>
                <Text style={styles.bioLabel}>HRV</Text>
                <Text style={styles.bioValues}>
                  {biometrics.hrvBefore} <Text style={styles.bioArrow}>{'\u2192'}</Text>{' '}
                  {biometrics.hrvAfter} ms
                </Text>
              </View>
            </View>
          )}

          {/* Mood selector */}
          <Text style={styles.sectionTitle}>How do you feel?</Text>
          <View style={styles.moodRow}>
            {MOOD_FACES.map((face, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodButton,
                  selectedMood === index && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(index)}
                activeOpacity={0.7}
                accessibilityLabel={face.label}
                accessibilityRole="button"
              >
                <Text style={styles.moodEmoji}>{face.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === index && styles.moodLabelSelected,
                  ]}
                >
                  {face.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Journal input */}
          <Text style={styles.sectionTitle}>Reflections</Text>
          <TextInput
            style={styles.journalInput}
            placeholder="How was this session? Any thoughts or sensations..."
            placeholderTextColor={Colors.dimGrey}
            multiline
            value={journalText}
            onChangeText={setJournalText}
            textAlignVertical="top"
          />

          {/* Done button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            activeOpacity={0.8}
            accessibilityLabel="Done"
            accessibilityRole="button"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 39, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: Colors.deepCurrent,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  heading: {
    ...Typography.h2,
    color: Colors.moonlight,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: Colors.bioluminescent,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    borderRadius: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BorderRadius.md,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.moonlight,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    fontSize: 11,
  },
  statSeparator: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  biometricsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  bioLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
  },
  bioValues: {
    ...Typography.body,
    color: Colors.moonlight,
    fontSize: 14,
  },
  bioArrow: {
    color: Colors.bioluminescent,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.moonlight,
    marginBottom: Spacing.sm,
    fontSize: 14,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    flex: 1,
  },
  moodButtonSelected: {
    borderColor: Colors.bioluminescent,
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: Colors.fogGrey,
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: Colors.bioluminescent,
  },
  journalInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: Spacing.md,
    color: Colors.moonlight,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 88,
    marginBottom: Spacing.lg,
  },
  doneButton: {
    backgroundColor: Colors.bioluminescent,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    ...Typography.bodyBold,
    color: Colors.deepSpace,
    fontSize: 16,
  },
});

export default SessionComplete;
