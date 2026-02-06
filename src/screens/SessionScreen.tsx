// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Active Session Screen
// Full-screen immersive breathing experience with Breath Orb,
// phase indicators, timer, haptic sync, and real-time feedback
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BreathOrb } from '../components/BreathOrb';
import { SessionSummary } from '../components/SessionSummary';
import { getPatternById } from '../data/patterns';
import {
  EngineState,
  createInitialState,
  startSession,
  activateSession,
  pauseSession,
  resumeSession,
  tick,
  getCurrentPhase,
  getPhaseProgress,
  getSessionProgress,
  formatTime,
  formatPhaseTime,
  finishSession,
  completeFreeholdPhase,
} from '../engine/breathEngine';
import {
  triggerPhaseHaptic,
  triggerPhaseTransition,
  triggerSessionComplete,
} from '../engine/haptics';
import { useStore } from '../hooks/useStore';
import { Colors, CategoryColors, PhaseColors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { BreathPhase } from '../types/breathing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TICK_INTERVAL = 50; // 50ms = 20fps engine tick

export function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ patternId: string }>();
  const completeSessionStore = useStore((s) => s.completeSession);

  const pattern = getPatternById(params.patternId || 'coherent');
  const catColors = pattern ? CategoryColors[pattern.category] : CategoryColors.parasympathetic;

  const [engine, setEngine] = useState<EngineState>(createInitialState());
  const engineRef = useRef(engine);
  engineRef.current = engine;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPhaseRef = useRef<BreathPhase | null>(null);
  const prepCountdown = useSharedValue(3);

  // Start preparation countdown
  useEffect(() => {
    if (!pattern) return;
    const initial = startSession(pattern);
    setEngine(initial);

    // Preparation countdown: 3... 2... 1...
    let count = 3;
    const countInterval = setInterval(() => {
      count -= 1;
      prepCountdown.value = count;
      if (count <= 0) {
        clearInterval(countInterval);
        const activated = activateSession(initial);
        setEngine(activated);
      }
    }, 1000);

    return () => clearInterval(countInterval);
  }, [pattern?.id]);

  // Engine tick loop
  useEffect(() => {
    if (engine.sessionState !== 'active') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setEngine((prev) => {
        const next = tick(prev, TICK_INTERVAL);

        // Detect phase transitions
        const currentPhase = getCurrentPhase(next);
        if (currentPhase && currentPhase.phase !== lastPhaseRef.current) {
          lastPhaseRef.current = currentPhase.phase;
          triggerPhaseTransition();
        }

        // Haptic during active breathing
        if (currentPhase) {
          const progress = getPhaseProgress(next);
          if (Math.round(progress * 10) % 3 === 0) {
            triggerPhaseHaptic(currentPhase.phase);
          }
        }

        // Session complete
        if (next.sessionState === 'integrating') {
          triggerSessionComplete();
        }

        return next;
      });
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [engine.sessionState]);

  const handlePause = useCallback(() => {
    setEngine((prev) =>
      prev.sessionState === 'active' ? pauseSession(prev) : resumeSession(prev)
    );
  }, []);

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEngine((prev) => finishSession(prev));

    if (pattern) {
      completeSessionStore({
        id: Date.now().toString(),
        patternId: pattern.id,
        startedAt: Date.now() - engine.totalElapsedMs,
        completedAt: Date.now(),
        durationMs: engine.totalElapsedMs,
        roundsCompleted: engine.currentRound - 1,
      });
    }
  }, [engine.totalElapsedMs, engine.currentRound, pattern]);

  const handleFreeholdTap = useCallback(() => {
    setEngine((prev) => completeFreeholdPhase(prev));
  }, []);

  const handleDone = useCallback(() => {
    router.back();
  }, [router]);

  const handleRepeat = useCallback(() => {
    if (!pattern) return;
    lastPhaseRef.current = null;
    const initial = startSession(pattern);
    setEngine(initial);
    setTimeout(() => {
      setEngine((prev) => activateSession(prev));
    }, 1000);
  }, [pattern]);

  if (!pattern) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Pattern not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentPhase = getCurrentPhase(engine);
  const phaseProgress = getPhaseProgress(engine);
  const sessionProgress = getSessionProgress(engine);

  // Session complete — show summary
  if (engine.sessionState === 'complete' || engine.sessionState === 'integrating') {
    return (
      <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
        <StatusBar barStyle="light-content" />
        <SessionSummary
          pattern={pattern}
          durationMs={engine.totalElapsedMs}
          roundsCompleted={Math.max(engine.currentRound - 1, 1)}
          onDone={handleDone}
          onRepeat={handleRepeat}
        />
      </Animated.View>
    );
  }

  // Preparing countdown
  if (engine.sessionState === 'preparing') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" />
        <Animated.View entering={FadeIn} style={styles.prepContainer}>
          <Text style={styles.prepTitle}>Get Ready</Text>
          <Text style={styles.prepPattern}>{pattern.name}</Text>
          <BreathOrb
            phase={null}
            progress={0}
            intensity={0.2}
            category={pattern.category}
            isActive={false}
            size={180}
          />
          <Text style={styles.prepHint}>Find a comfortable position</Text>
          <Text style={styles.prepHint}>Close your eyes if you wish</Text>
        </Animated.View>
      </View>
    );
  }

  const phaseColor = currentPhase ? PhaseColors[currentPhase.phase] || catColors.primary : catColors.primary;
  const phaseDuration = currentPhase?.duration || 0;
  const remainingMs = phaseDuration > 0 ? phaseDuration - engine.phaseElapsedMs : engine.phaseElapsedMs;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Session progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${sessionProgress * 100}%`,
              backgroundColor: catColors.primary,
            },
          ]}
        />
      </View>

      {/* Top Info */}
      <View style={styles.topInfo}>
        <View style={styles.topLeft}>
          <Text style={styles.patternName}>{pattern.icon} {pattern.name}</Text>
          <Text style={styles.roundInfo}>
            {engine.totalRounds > 0
              ? `Round ${engine.currentRound} / ${engine.totalRounds}`
              : formatTime(engine.totalElapsedMs)}
          </Text>
        </View>
      </View>

      {/* Center: Breath Orb + Phase Info */}
      <View style={styles.centerArea}>
        <BreathOrb
          phase={currentPhase?.phase || null}
          progress={phaseProgress}
          intensity={currentPhase?.visualIntensity || 0.3}
          category={pattern.category}
          isActive={engine.sessionState === 'active'}
        />

        {/* Phase Label */}
        <Animated.View style={styles.phaseInfoContainer}>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>
            {currentPhase?.label || 'Breathe'}
          </Text>

          {/* Timer */}
          {phaseDuration > 0 ? (
            <Text style={styles.phaseTimer}>
              {formatPhaseTime(Math.max(remainingMs, 0))}
            </Text>
          ) : engine.isPhaseFreehold ? (
            <Text style={styles.phaseTimer}>
              {formatPhaseTime(engine.phaseElapsedMs)}
            </Text>
          ) : null}

          {/* Instruction */}
          <Text style={styles.phaseInstruction}>
            {currentPhase?.instruction || ''}
          </Text>
        </Animated.View>

        {/* Free hold tap target */}
        {engine.isPhaseFreehold && (
          <TouchableOpacity
            style={[styles.freeholdButton, { borderColor: phaseColor }]}
            onPress={handleFreeholdTap}
            activeOpacity={0.7}
          >
            <Text style={[styles.freeholdText, { color: phaseColor }]}>Tap to continue</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Controls */}
      <Animated.View style={styles.bottomControls} entering={SlideInDown.delay(300)}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleStop}
          activeOpacity={0.7}
        >
          <Text style={styles.controlIcon}>⏹</Text>
          <Text style={styles.controlLabel}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pauseButton, { borderColor: catColors.primary + '50' }]}
          onPress={handlePause}
          activeOpacity={0.7}
        >
          <Text style={styles.pauseIcon}>
            {engine.sessionState === 'paused' ? '▶' : '⏸'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {/* Future: settings */}}
          activeOpacity={0.7}
        >
          <Text style={styles.controlIcon}>🎵</Text>
          <Text style={styles.controlLabel}>Sound</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Paused overlay */}
      {engine.sessionState === 'paused' && (
        <Animated.View style={styles.pausedOverlay} entering={FadeIn}>
          <Text style={styles.pausedText}>PAUSED</Text>
          <Text style={styles.pausedHint}>Tap play to continue</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.deepCurrent,
    zIndex: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.huge + 10,
  },
  topLeft: {},
  patternName: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  roundInfo: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: 2,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseInfoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  phaseLabel: {
    fontSize: FontSize.h2,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  phaseTimer: {
    fontSize: FontSize.timer,
    fontWeight: '200',
    color: Colors.moonlight,
    marginTop: Spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  phaseInstruction: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    marginTop: Spacing.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  freeholdButton: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.round,
    borderWidth: 2,
  },
  freeholdText: {
    fontSize: FontSize.body,
    fontWeight: '700',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Spacing.huge,
    paddingHorizontal: Spacing.xl,
  },
  controlButton: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  controlIcon: {
    fontSize: 24,
  },
  controlLabel: {
    fontSize: 11,
    color: Colors.fogGrey,
    marginTop: Spacing.xs,
  },
  pauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.deepCurrent,
  },
  pauseIcon: {
    fontSize: 24,
    color: Colors.moonlight,
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 39, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  pausedText: {
    fontSize: FontSize.h1,
    fontWeight: '800',
    color: Colors.moonlight,
    letterSpacing: 8,
  },
  pausedHint: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.bodyLarge,
    color: Colors.moonlight,
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.deepCurrent,
    borderRadius: BorderRadius.xl,
  },
  backText: {
    fontSize: FontSize.body,
    color: Colors.bioluminescent,
    fontWeight: '600',
  },
  prepContainer: {
    alignItems: 'center',
  },
  prepTitle: {
    fontSize: FontSize.h2,
    fontWeight: '700',
    color: Colors.moonlight,
    marginBottom: Spacing.sm,
  },
  prepPattern: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    marginBottom: Spacing.xxxl,
  },
  prepHint: {
    fontSize: FontSize.body,
    color: Colors.fogGrey,
    marginTop: Spacing.md,
  },
});
