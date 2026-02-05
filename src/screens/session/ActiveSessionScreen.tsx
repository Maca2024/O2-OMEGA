import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';

import { BreathOrb } from '../../components/breath-orb';
import {
  PhaseIndicator,
  SessionControls,
  BiometricOverlay,
  SessionComplete,
} from '../../components/session';

import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import type { BreathPhase, PatternCategory } from '../../types/breath';

// ---------------------------------------------------------------------------
// Box Breathing pattern for demo
// ---------------------------------------------------------------------------

interface PhaseStep {
  phase: BreathPhase;
  duration: number; // seconds
  instruction: string;
}

const BOX_BREATHING: PhaseStep[] = [
  { phase: 'inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
  { phase: 'holdIn', duration: 4, instruction: 'Gently hold your breath' },
  { phase: 'exhale', duration: 4, instruction: 'Release slowly through your mouth' },
  { phase: 'holdOut', duration: 4, instruction: 'Rest in the stillness' },
];

const PATTERN_NAME = 'Box Breathing';
const PATTERN_CATEGORY: PatternCategory = 'parasympathetic';
const TOTAL_ROUNDS = 4;
const TICK_INTERVAL = 50; // ms — smooth progress updates

// ---------------------------------------------------------------------------
// Category badge color
// ---------------------------------------------------------------------------

const CATEGORY_BADGE_COLORS: Record<PatternCategory, string> = {
  parasympathetic: Colors.bioluminescent,
  sympathetic: Colors.solarGold,
  clinical: '#4A9EFF',
  transformative: Colors.neuralPurple,
};

const CATEGORY_LABELS: Record<PatternCategory, string> = {
  parasympathetic: 'CALM',
  sympathetic: 'ENERGIZE',
  clinical: 'CLINICAL',
  transformative: 'TRANSFORM',
};

// ---------------------------------------------------------------------------
// Screen dimensions
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ORB_SIZE = Math.round(SCREEN_WIDTH * 0.6);

// ---------------------------------------------------------------------------
// ActiveSessionScreen
// ---------------------------------------------------------------------------

const ActiveSessionScreen: React.FC = () => {
  // Session state
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [progress, setProgress] = useState(0); // 0-1 within current phase
  const [round, setRound] = useState(1);
  const [breathCount, setBreathCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Phase stepping
  const [phaseIndex, setPhaseIndex] = useState(0);
  const elapsedRef = useRef(0); // ms elapsed within current phase
  const sessionStartRef = useRef(Date.now());

  // Simulated biometrics
  const [simHR, setSimHR] = useState(72);
  const [simHRV, setSimHRV] = useState(42);
  const [simSpO2] = useState(98);
  const [showBiometrics] = useState(true);

  // ------------------------------------------------------------------
  // Current phase config
  // ------------------------------------------------------------------
  const currentStep = BOX_BREATHING[phaseIndex];
  const phaseDurationMs = currentStep.duration * 1000;

  // ------------------------------------------------------------------
  // Core timer loop
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isActive || isComplete) return;

    const interval = setInterval(() => {
      elapsedRef.current += TICK_INTERVAL;

      const newProgress = Math.min(elapsedRef.current / phaseDurationMs, 1);
      setProgress(newProgress);

      // Phase complete
      if (elapsedRef.current >= phaseDurationMs) {
        elapsedRef.current = 0;

        const nextIndex = phaseIndex + 1;

        if (nextIndex >= BOX_BREATHING.length) {
          // End of round
          const nextRound = round + 1;
          setBreathCount((prev) => prev + 1);

          if (nextRound > TOTAL_ROUNDS) {
            // Session complete
            setIsActive(false);
            setIsComplete(true);
            return;
          }

          setRound(nextRound);
          setPhaseIndex(0);
          setPhase(BOX_BREATHING[0].phase);
        } else {
          // Advance to next phase within round
          setPhaseIndex(nextIndex);
          setPhase(BOX_BREATHING[nextIndex].phase);

          // Count a breath at end of exhale
          if (BOX_BREATHING[phaseIndex].phase === 'exhale') {
            setBreathCount((prev) => prev + 1);
          }
        }

        setProgress(0);
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isActive, isComplete, phaseIndex, phaseDurationMs, round]);

  // ------------------------------------------------------------------
  // Simulate slowly shifting biometrics
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isActive || isComplete) return;

    const bioInterval = setInterval(() => {
      setSimHR((prev) => {
        const drift = (Math.random() - 0.55) * 2; // slight downward drift
        return Math.max(56, Math.min(90, Math.round(prev + drift)));
      });
      setSimHRV((prev) => {
        const drift = (Math.random() - 0.4) * 3; // slight upward drift
        return Math.max(20, Math.min(120, Math.round(prev + drift)));
      });
    }, 5000);

    return () => clearInterval(bioInterval);
  }, [isActive, isComplete]);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handlePauseResume = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const handleStop = useCallback(() => {
    setIsActive(false);
    setIsComplete(true);
  }, []);

  const handleSessionDone = useCallback((_mood: number, _journal: string) => {
    // In a real app this would persist the session result and navigate away.
    // For the demo we simply reset.
    setIsComplete(false);
    setIsActive(false);
  }, []);

  // ------------------------------------------------------------------
  // Derived values
  // ------------------------------------------------------------------
  const secondsRemaining =
    currentStep.duration - Math.floor(elapsedRef.current / 1000);

  const elapsedSessionSeconds = Math.floor(
    (Date.now() - sessionStartRef.current) / 1000,
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <View style={styles.screen}>
      <StatusBar hidden />

      {/* ---- Pattern header ---- */}
      <View style={styles.header}>
        <Text style={styles.patternName}>{PATTERN_NAME}</Text>
        <View
          style={[
            styles.categoryBadge,
            { borderColor: CATEGORY_BADGE_COLORS[PATTERN_CATEGORY] },
          ]}
        >
          <Text
            style={[
              styles.categoryBadgeText,
              { color: CATEGORY_BADGE_COLORS[PATTERN_CATEGORY] },
            ]}
          >
            {CATEGORY_LABELS[PATTERN_CATEGORY]}
          </Text>
        </View>
      </View>

      {/* ---- Central orb ---- */}
      <View style={styles.orbContainer}>
        <BreathOrb
          phase={phase}
          progress={progress}
          phaseDuration={phaseDurationMs}
          category={PATTERN_CATEGORY}
          size={ORB_SIZE}
        />
      </View>

      {/* ---- Phase indicator below orb ---- */}
      <View style={styles.phaseContainer}>
        <PhaseIndicator
          phase={phase}
          secondsRemaining={secondsRemaining}
          totalSeconds={currentStep.duration}
        />
      </View>

      {/* ---- Bottom controls ---- */}
      <View style={styles.controlsContainer}>
        <SessionControls
          isActive={isActive}
          round={round}
          totalRounds={TOTAL_ROUNDS}
          breathCount={breathCount}
          onPauseResume={handlePauseResume}
          onStop={handleStop}
        />
      </View>

      {/* ---- Biometric overlay ---- */}
      <BiometricOverlay
        heartRate={simHR}
        hrv={simHRV}
        spo2={simSpO2}
        visible={showBiometrics && isActive}
      />

      {/* ---- Session complete card ---- */}
      {isComplete && (
        <SessionComplete
          durationSeconds={elapsedSessionSeconds}
          totalBreaths={breathCount}
          completionRate={round > TOTAL_ROUNDS ? 1 : (round - 1) / TOTAL_ROUNDS}
          biometrics={{
            hrBefore: 72,
            hrAfter: simHR,
            hrvBefore: 42,
            hrvAfter: simHRV,
          }}
          onDone={handleSessionDone}
        />
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.sm,
  },
  patternName: {
    ...Typography.h3,
    color: Colors.moonlight,
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  categoryBadgeText: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 2,
  },
  orbContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseContainer: {
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
  controlsContainer: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
});

export default ActiveSessionScreen;
