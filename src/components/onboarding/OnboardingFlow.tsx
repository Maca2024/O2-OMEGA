import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
  Platform,
} from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────
const colors = {
  deepSpace: '#0A0E27',
  midnightOcean: '#0F1B3D',
  deepCurrent: '#162447',
  bioluminescent: '#00D4AA',
  bioluminescentLight: '#00E5C4',
  neuralPurple: '#7B68EE',
  heartPink: '#FF6B9D',
  solarGold: '#FFD93D',
  moonlight: '#E8F0FE',
  fogGrey: '#8B95A5',
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOTAL_PAGES = 5;

// ─── Props ───────────────────────────────────────────────────────────────────
interface OnboardingFlowProps {
  onComplete: () => void;
  onStartDemo?: () => void;
}

// ─── Breathing Circle Animation ──────────────────────────────────────────────
const BreathingCircle: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const breathCycle = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.35,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    breathCycle.start();
    return () => breathCycle.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.breathingCircleContainer}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.breathingGlowOuter,
          {
            transform: [{ scale: scaleAnim }],
            opacity: Animated.multiply(opacityAnim, new Animated.Value(0.15)),
          },
        ]}
      />
      {/* Mid glow ring */}
      <Animated.View
        style={[
          styles.breathingGlowMid,
          {
            transform: [{ scale: scaleAnim }],
            opacity: Animated.multiply(opacityAnim, new Animated.Value(0.3)),
          },
        ]}
      />
      {/* Core orb */}
      <Animated.View
        style={[
          styles.breathingCore,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
    </View>
  );
};

// ─── Polyvagal Circles ───────────────────────────────────────────────────────
const PolyvagalCircles: React.FC = () => {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.15,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      );

    createPulse(pulse1, 0).start();
    createPulse(pulse2, 600).start();
    createPulse(pulse3, 1200).start();

    return () => {
      pulse1.stopAnimation();
      pulse2.stopAnimation();
      pulse3.stopAnimation();
    };
  }, [pulse1, pulse2, pulse3]);

  return (
    <View style={styles.polyvagalContainer}>
      <Animated.View
        style={[
          styles.polyvagalCircle,
          styles.polyvagalVentral,
          { transform: [{ scale: pulse1 }] },
        ]}
      />
      <View style={styles.polyvagalConnector} />
      <Animated.View
        style={[
          styles.polyvagalCircle,
          styles.polyvagalSympathetic,
          { transform: [{ scale: pulse2 }] },
        ]}
      />
      <View style={styles.polyvagalConnector} />
      <Animated.View
        style={[
          styles.polyvagalCircle,
          styles.polyvagalDorsal,
          { transform: [{ scale: pulse3 }] },
        ]}
      />
    </View>
  );
};

// ─── Feature Card ────────────────────────────────────────────────────────────
interface FeatureCardProps {
  title: string;
  description: string;
  accentColor: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  accentColor,
  icon,
}) => (
  <View style={styles.featureCard}>
    <View style={[styles.featureIconContainer, { backgroundColor: accentColor + '20' }]}>
      <Text style={styles.featureIcon}>{icon}</Text>
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={[styles.featureTitle, { color: accentColor }]}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

// ─── Level Badge ─────────────────────────────────────────────────────────────
interface LevelBadgeProps {
  level: number;
  label: string;
  color: string;
  isLocked: boolean;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, label, color, isLocked }) => (
  <View style={[styles.levelBadge, isLocked && styles.levelBadgeLocked]}>
    <View style={[styles.levelBadgeIcon, { backgroundColor: isLocked ? colors.fogGrey + '30' : color + '25' }]}>
      <Text style={[styles.levelBadgeNumber, { color: isLocked ? colors.fogGrey : color }]}>
        {level}
      </Text>
    </View>
    <Text style={[styles.levelBadgeLabel, { color: isLocked ? colors.fogGrey : colors.moonlight }]}>
      {label}
    </Text>
    {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
  </View>
);

// ─── Dot Indicators ──────────────────────────────────────────────────────────
interface DotIndicatorsProps {
  currentPage: number;
  total: number;
}

const DotIndicators: React.FC<DotIndicatorsProps> = ({ currentPage, total }) => (
  <View style={styles.dotContainer}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor:
              index === currentPage ? colors.bioluminescent : colors.fogGrey + '50',
            width: index === currentPage ? 24 : 8,
          },
        ]}
      />
    ))}
  </View>
);

// ─── Main Onboarding Flow ────────────────────────────────────────────────────
const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onStartDemo }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);
      if (page !== currentPage && page >= 0 && page < TOTAL_PAGES) {
        setCurrentPage(page);
      }
    },
    [currentPage],
  );

  const goToPage = useCallback(
    (page: number) => {
      scrollViewRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
      setCurrentPage(page);
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    } else {
      onComplete();
    }
  }, [currentPage, goToPage, onComplete]);

  const handleSkip = useCallback(() => {
    goToPage(TOTAL_PAGES - 1);
  }, [goToPage]);

  // ─── Screen 1: Welcome ──────────────────────────────────────────────────
  const renderWelcome = () => (
    <View style={[styles.page, styles.welcomePage]}>
      <View style={styles.welcomeTopSection}>
        <BreathingCircle />
      </View>

      <View style={styles.welcomeTextSection}>
        <Text style={styles.welcomeTitle}>PNEUMA</Text>
        <Text style={styles.welcomeTagline}>Breathe Beyond</Text>
        <Text style={styles.welcomeSubtitle}>
          The world's most advanced breathwork platform
        </Text>
      </View>

      <View style={styles.welcomeBottomSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Screen 2: Your Nervous System ──────────────────────────────────────
  const renderNervousSystem = () => (
    <View style={[styles.page, styles.centeredPage]}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Your Nervous System Navigator</Text>
        <Text style={styles.screenSubtitle}>
          Understanding your body's built-in state system
        </Text>
      </View>

      <PolyvagalCircles />

      <View style={styles.stateListContainer}>
        <View style={styles.stateRow}>
          <View style={[styles.stateDot, { backgroundColor: colors.bioluminescent }]} />
          <View style={styles.stateTextBlock}>
            <Text style={styles.stateLabel}>Ventral Vagal</Text>
            <Text style={styles.stateDescription}>Calm, connected, creative</Text>
          </View>
        </View>

        <View style={styles.stateRow}>
          <View style={[styles.stateDot, { backgroundColor: colors.solarGold }]} />
          <View style={styles.stateTextBlock}>
            <Text style={styles.stateLabel}>Sympathetic</Text>
            <Text style={styles.stateDescription}>Alert, energized, focused</Text>
          </View>
        </View>

        <View style={styles.stateRow}>
          <View style={[styles.stateDot, { backgroundColor: colors.heartPink }]} />
          <View style={styles.stateTextBlock}>
            <Text style={styles.stateLabel}>Dorsal Vagal</Text>
            <Text style={styles.stateDescription}>Rest, restore, recover</Text>
          </View>
        </View>
      </View>

      <Text style={styles.nervousSystemFooter}>
        PNEUMA helps you navigate between these states with the power of breath
      </Text>
    </View>
  );

  // ─── Screen 3: How It Works ─────────────────────────────────────────────
  const renderHowItWorks = () => (
    <View style={[styles.page, styles.centeredPage]}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Science-Backed Breathing</Text>
        <Text style={styles.screenSubtitle}>
          Precision-engineered techniques guided by real-time data
        </Text>
      </View>

      <View style={styles.featureCardsContainer}>
        <FeatureCard
          icon="🌬️"
          title="20+ Techniques"
          description="From calming to transformative"
          accentColor={colors.bioluminescent}
        />
        <FeatureCard
          icon="📡"
          title="Real-time Biometrics"
          description="HRV, heart rate, SpO2 tracking"
          accentColor={colors.neuralPurple}
        />
        <FeatureCard
          icon="🧠"
          title="AI Personalization"
          description="Adapted to your nervous system"
          accentColor={colors.solarGold}
        />
      </View>
    </View>
  );

  // ─── Screen 4: Safety First ─────────────────────────────────────────────
  const renderSafety = () => (
    <View style={[styles.page, styles.centeredPage]}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Your Safety Matters</Text>
        <Text style={styles.screenSubtitle}>
          Advanced techniques unlock progressively as you build experience
        </Text>
      </View>

      <View style={styles.levelsContainer}>
        <LevelBadge level={1} label="Foundation" color={colors.bioluminescent} isLocked={false} />
        <LevelBadge level={2} label="Intermediate" color={colors.neuralPurple} isLocked={true} />
        <LevelBadge level={3} label="Advanced" color={colors.solarGold} isLocked={true} />
        <LevelBadge level={4} label="Master" color={colors.heartPink} isLocked={true} />
      </View>

      <View style={styles.safetyFooterContainer}>
        <View style={styles.safetyDivider} />
        <Text style={styles.safetyFooterText}>
          Start with foundation techniques, unlock more as you grow
        </Text>
      </View>
    </View>
  );

  // ─── Screen 5: First Breath ─────────────────────────────────────────────
  const renderFirstBreath = () => (
    <View style={[styles.page, styles.centeredPage]}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Take Your First Breath</Text>
        <Text style={styles.screenSubtitle}>
          Let's start with a simple breathing exercise
        </Text>
      </View>

      <View style={styles.firstBreathVisual}>
        <BreathingCircle />
      </View>

      <Text style={styles.firstBreathPrompt}>
        A 1-minute Coherent Breathing session to center yourself
      </Text>

      <View style={styles.firstBreathActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (onStartDemo) {
              onStartDemo();
            } else {
              onComplete();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Ready?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipToAppButton}
          onPress={onComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.skipToAppText}>Skip to app</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar hidden />

      {/* Skip button (visible on pages 1-3) */}
      {currentPage < TOTAL_PAGES - 1 && currentPage > 0 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Horizontal paging ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
      >
        {renderWelcome()}
        {renderNervousSystem()}
        {renderHowItWorks()}
        {renderSafety()}
        {renderFirstBreath()}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <DotIndicators currentPage={currentPage} total={TOTAL_PAGES} />

        {currentPage > 0 && currentPage < TOTAL_PAGES - 1 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}

        {currentPage === TOTAL_PAGES - 1 && (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.deepSpace,
  },
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 32,
  },
  centeredPage: {
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 140,
  },

  // ── Skip Button ─────────────────────────────────────────────────────────
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 24,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: colors.fogGrey,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // ── Bottom Controls ─────────────────────────────────────────────────────
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
    paddingHorizontal: 32,
    paddingTop: 16,
    alignItems: 'center',
    backgroundColor: colors.deepSpace + 'E0',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: colors.deepCurrent,
    borderWidth: 1,
    borderColor: colors.bioluminescent + '40',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 28,
    minWidth: 160,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.bioluminescent,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  getStartedButton: {
    backgroundColor: colors.bioluminescent,
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 28,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: colors.bioluminescent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  getStartedButtonText: {
    color: colors.deepSpace,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // ── Screen 1: Welcome ──────────────────────────────────────────────────
  welcomePage: {
    justifyContent: 'space-between',
    paddingTop: SCREEN_HEIGHT * 0.12,
    paddingBottom: 160,
  },
  welcomeTopSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTextSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.bioluminescent,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: colors.bioluminescent + '60',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  welcomeTagline: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.moonlight,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.fogGrey,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  welcomeBottomSection: {
    alignItems: 'center',
  },

  // ── Breathing Circle ───────────────────────────────────────────────────
  breathingCircleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingGlowOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.bioluminescent,
  },
  breathingGlowMid: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.bioluminescent,
  },
  breathingCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.bioluminescent,
    shadowColor: colors.bioluminescent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 12,
  },

  // ── Primary Button ─────────────────────────────────────────────────────
  primaryButton: {
    backgroundColor: colors.bioluminescent,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    minWidth: 240,
    alignItems: 'center',
    shadowColor: colors.bioluminescent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryButtonText: {
    color: colors.deepSpace,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // ── Screen Headers ─────────────────────────────────────────────────────
  screenHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.moonlight,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  screenSubtitle: {
    fontSize: 15,
    color: colors.fogGrey,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    letterSpacing: 0.2,
  },

  // ── Screen 2: Nervous System ───────────────────────────────────────────
  polyvagalContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  polyvagalCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  polyvagalVentral: {
    backgroundColor: colors.bioluminescent,
    shadowColor: colors.bioluminescent,
  },
  polyvagalSympathetic: {
    backgroundColor: colors.solarGold,
    shadowColor: colors.solarGold,
  },
  polyvagalDorsal: {
    backgroundColor: colors.heartPink,
    shadowColor: colors.heartPink,
  },
  polyvagalConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.fogGrey + '30',
  },
  stateListContainer: {
    marginBottom: 24,
    gap: 14,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.midnightOcean + '80',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.deepCurrent,
  },
  stateDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  stateTextBlock: {
    flex: 1,
  },
  stateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.moonlight,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  stateDescription: {
    fontSize: 14,
    color: colors.fogGrey,
    letterSpacing: 0.2,
  },
  nervousSystemFooter: {
    fontSize: 14,
    color: colors.bioluminescentLight,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 16,
    letterSpacing: 0.2,
  },

  // ── Screen 3: Feature Cards ────────────────────────────────────────────
  featureCardsContainer: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.midnightOcean + '90',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.deepCurrent,
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.fogGrey,
    lineHeight: 20,
    letterSpacing: 0.2,
  },

  // ── Screen 4: Safety / Levels ──────────────────────────────────────────
  levelsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.midnightOcean + '80',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.deepCurrent,
  },
  levelBadgeLocked: {
    opacity: 0.55,
  },
  levelBadgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelBadgeNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  levelBadgeLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.3,
  },
  lockIcon: {
    fontSize: 14,
    marginLeft: 8,
  },
  safetyFooterContainer: {
    alignItems: 'center',
  },
  safetyDivider: {
    width: 40,
    height: 2,
    backgroundColor: colors.bioluminescent + '30',
    borderRadius: 1,
    marginBottom: 16,
  },
  safetyFooterText: {
    fontSize: 14,
    color: colors.fogGrey,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },

  // ── Screen 5: First Breath ─────────────────────────────────────────────
  firstBreathVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    height: 200,
  },
  firstBreathPrompt: {
    fontSize: 15,
    color: colors.fogGrey,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 16,
    letterSpacing: 0.3,
  },
  firstBreathActions: {
    alignItems: 'center',
    gap: 20,
  },
  skipToAppButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipToAppText: {
    color: colors.fogGrey,
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationColor: colors.fogGrey + '60',
    letterSpacing: 0.3,
  },
});

export default OnboardingFlow;
