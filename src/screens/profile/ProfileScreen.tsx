import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Theme } from '../../theme';
import { AccessLevel } from '../../types/breath';

// ---------------------------------------------------------------------------
// Demo Data
// ---------------------------------------------------------------------------

const DEMO_USER = {
  initials: 'AV',
  displayName: 'Alex Vermeer',
  memberSince: 'October 2025',
  subscription: 'premium' as const,
  level: 2,
  levelName: 'Activator',
  xp: 2450,
  xpForNextLevel: 5000,
  totalSessions: 47,
  totalMinutes: 392,
  currentStreak: 12,
  longestStreak: 21,
  accessLevel: 2 as AccessLevel,
  buteykoCPScore: 32,
};

const LEVEL_NAMES: Record<number, string> = {
  1: 'Foundation',
  2: 'Activator',
  3: 'Explorer',
  4: 'Transformer',
};

const SUBSCRIPTION_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: Colors.fogGrey },
  premium: { label: 'Premium', color: Colors.solarGold },
  transcend: { label: 'Transcend', color: Colors.neuralPurple },
};

interface AchievementData {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

const ACHIEVEMENTS: AchievementData[] = [
  {
    id: 'first-breath',
    name: 'First Breath',
    icon: '\u{1F32C}',
    unlocked: true,
    description: 'Complete your first session',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    icon: '\u{1F525}',
    unlocked: true,
    description: '7-day streak',
  },
  {
    id: 'hour-of-power',
    name: 'Hour of Power',
    icon: '\u{26A1}',
    unlocked: true,
    description: '60 min total practice',
  },
  {
    id: 'pattern-explorer',
    name: 'Pattern Explorer',
    icon: '\u{1F9ED}',
    unlocked: true,
    description: 'Tried 5 different patterns',
  },
  {
    id: 'hrv-rising',
    name: 'HRV Rising',
    icon: '\u{1F4C8}',
    unlocked: false,
    description: 'HRV improved over 2 weeks',
  },
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    icon: '\u{1F30A}',
    unlocked: false,
    description: 'Complete an advanced session',
  },
];

/** Demo settings state */
const DEMO_SETTINGS = {
  hapticEnabled: true,
  voiceGuidance: true,
  language: 'EN' as 'NL' | 'EN',
};

const CONNECTED_WEARABLES = [
  { name: 'Apple Watch', connected: true },
  { name: 'Oura Ring', connected: false },
  { name: 'Garmin', connected: false },
];

/** Next-level requirements for progressive access */
const NEXT_LEVEL = 3 as AccessLevel;
const NEXT_LEVEL_REQUIREMENTS = [
  { label: '30 sessions completed', completed: true, current: 47, target: 30 },
  { label: '15 hours of practice', completed: true, current: 16, target: 15 },
  { label: 'Level 3 knowledge test', completed: false, current: 0, target: 1 },
];
const SESSIONS_FOR_NEXT = 0; // Already met

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ProfileScreen: React.FC = () => {
  const subBadge = SUBSCRIPTION_LABELS[DEMO_USER.subscription];
  const xpProgress = DEMO_USER.xp / DEMO_USER.xpForNextLevel;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ---- Profile Header ---- */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{DEMO_USER.initials}</Text>
          </View>
        </View>
        <Text style={styles.displayName}>{DEMO_USER.displayName}</Text>
        <Text style={styles.memberSince}>Member since {DEMO_USER.memberSince}</Text>
        <View style={[styles.subscriptionBadge, { borderColor: subBadge.color }]}>
          <Text style={[styles.subscriptionText, { color: subBadge.color }]}>
            {subBadge.label}
          </Text>
        </View>
      </View>

      {/* ---- Level & XP Card ---- */}
      <View style={styles.card}>
        <View style={styles.levelRow}>
          <Text style={styles.cardTitle}>Level {DEMO_USER.level}</Text>
          <Text style={styles.levelName}>{DEMO_USER.levelName}</Text>
        </View>
        <Text style={styles.xpText}>
          {DEMO_USER.xp.toLocaleString()} / {DEMO_USER.xpForNextLevel.toLocaleString()} XP
        </Text>
        <View style={styles.xpBarTrack}>
          <View
            style={[
              styles.xpBarFill,
              { width: `${Math.min(xpProgress * 100, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.xpHint}>
          {(DEMO_USER.xpForNextLevel - DEMO_USER.xp).toLocaleString()} XP to{' '}
          {LEVEL_NAMES[(DEMO_USER.level + 1) as number] ?? 'next level'}
        </Text>
      </View>

      {/* ---- Stats Grid 2x2 ---- */}
      <View style={styles.statsGrid}>
        {renderStatCell('Total Sessions', DEMO_USER.totalSessions.toString(), Colors.bioluminescent)}
        {renderStatCell('Total Minutes', DEMO_USER.totalMinutes.toString(), Colors.neuralPurple)}
        {renderStatCell('Current Streak', `${DEMO_USER.currentStreak} days`, Colors.solarGold)}
        {renderStatCell('Longest Streak', `${DEMO_USER.longestStreak} days`, Colors.heartPink)}
      </View>

      {/* ---- Achievements ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Achievements</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsRow}
          style={styles.achievementsScroll}
        >
          {ACHIEVEMENTS.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementBadge,
                achievement.unlocked
                  ? styles.achievementUnlocked
                  : styles.achievementLocked,
              ]}
            >
              <Text style={styles.achievementIcon}>
                {achievement.unlocked ? achievement.icon : '\u{1F512}'}
              </Text>
              <Text
                style={[
                  styles.achievementName,
                  {
                    color: achievement.unlocked
                      ? Colors.moonlight
                      : Colors.dimGrey,
                  },
                ]}
                numberOfLines={2}
              >
                {achievement.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ---- Settings ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>

        {/* Haptic Feedback */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Haptic Feedback</Text>
          <Switch
            value={DEMO_SETTINGS.hapticEnabled}
            onValueChange={() => {}}
            trackColor={{
              false: Colors.dimGrey,
              true: Colors.bioluminescent,
            }}
            thumbColor={Colors.moonlight}
          />
        </View>

        {/* Voice Guidance */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice Guidance</Text>
          <Switch
            value={DEMO_SETTINGS.voiceGuidance}
            onValueChange={() => {}}
            trackColor={{
              false: Colors.dimGrey,
              true: Colors.bioluminescent,
            }}
            thumbColor={Colors.moonlight}
          />
        </View>

        {/* Language Selector */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={styles.languageSelector}>
            {(['NL', 'EN'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageOption,
                  DEMO_SETTINGS.language === lang && styles.languageOptionActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.languageText,
                    DEMO_SETTINGS.language === lang && styles.languageTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Connected Wearables */}
        <Text style={styles.settingSectionLabel}>Connected Wearables</Text>
        {CONNECTED_WEARABLES.map((wearable) => (
          <View key={wearable.name} style={styles.wearableRow}>
            <Text style={styles.wearableName}>{wearable.name}</Text>
            <View
              style={[
                styles.wearableStatus,
                {
                  backgroundColor: wearable.connected
                    ? Colors.bioluminescent
                    : Colors.dimGrey,
                },
              ]}
            />
            <Text
              style={[
                styles.wearableStatusText,
                {
                  color: wearable.connected
                    ? Colors.bioluminescent
                    : Colors.fogGrey,
                },
              ]}
            >
              {wearable.connected ? 'Connected' : 'Not connected'}
            </Text>
          </View>
        ))}

        {/* Reminder Time */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Reminder Time</Text>
          <Text style={styles.settingValue}>08:00</Text>
        </View>

        {/* Separator */}
        <View style={styles.settingDivider} />

        {/* Links */}
        {['About PNEUMA', 'Privacy Policy', 'Terms of Service'].map((link) => (
          <TouchableOpacity key={link} style={styles.linkRow} activeOpacity={0.7}>
            <Text style={styles.linkText}>{link}</Text>
            <Text style={styles.linkArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ---- Progressive Access Status ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progressive Access</Text>
        <View style={styles.accessLevelRow}>
          <Text style={styles.accessCurrentLabel}>
            Current: Level {DEMO_USER.accessLevel} — {LEVEL_NAMES[DEMO_USER.accessLevel]}
          </Text>
        </View>
        <Text style={styles.accessNextLabel}>
          Requirements for Level {NEXT_LEVEL} ({LEVEL_NAMES[NEXT_LEVEL]}):
        </Text>

        {NEXT_LEVEL_REQUIREMENTS.map((req, index) => (
          <View key={index} style={styles.requirementRow}>
            <Text style={styles.requirementCheck}>
              {req.completed ? '\u2713' : '\u25CB'}
            </Text>
            <Text
              style={[
                styles.requirementText,
                {
                  color: req.completed ? Colors.bioluminescent : Colors.fogGrey,
                },
              ]}
            >
              {req.label}
            </Text>
          </View>
        ))}

        <View style={styles.accessActionContainer}>
          {SESSIONS_FOR_NEXT > 0 ? (
            <Text style={styles.accessActionText}>
              {SESSIONS_FOR_NEXT} more sessions needed
            </Text>
          ) : (
            <TouchableOpacity style={styles.accessActionButton} activeOpacity={0.7}>
              <Text style={styles.accessActionButtonText}>
                Take Knowledge Test
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom padding */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderStatCell(label: string, value: string, accentColor: string) {
  return (
    <View style={styles.statCell} key={label}>
      <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.lg,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.deepCurrent,
    borderWidth: 2,
    borderColor: Colors.bioluminescent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.glowShadow(Colors.bioluminescent),
  },
  avatarInitials: {
    ...Typography.h1,
    color: Colors.bioluminescent,
    fontSize: 30,
  },
  displayName: {
    ...Typography.h2,
    color: Colors.moonlight,
    marginBottom: Spacing.xs,
  },
  memberSince: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginBottom: Spacing.sm,
  },
  subscriptionBadge: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  subscriptionText: {
    ...Typography.label,
    fontSize: 11,
  },

  // Card
  card: {
    backgroundColor: Colors.deepCurrent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Theme.cardShadow,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.moonlight,
    marginBottom: Spacing.sm,
  },

  // Level & XP
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  levelName: {
    ...Typography.bodyBold,
    color: Colors.bioluminescent,
  },
  xpText: {
    ...Typography.body,
    color: Colors.fogGrey,
    marginBottom: Spacing.sm,
  },
  xpBarTrack: {
    height: 10,
    backgroundColor: Colors.midnightOcean,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.bioluminescent,
    borderRadius: BorderRadius.sm,
  },
  xpHint: {
    ...Typography.caption,
    color: Colors.fogGrey,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statCell: {
    width: '48%',
    backgroundColor: Colors.deepCurrent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    flexGrow: 1,
    ...Theme.cardShadow,
  },
  statValue: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    textAlign: 'center',
  },

  // Achievements
  achievementsScroll: {
    marginHorizontal: -Spacing.sm,
  },
  achievementsRow: {
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  achievementBadge: {
    width: 90,
    height: 100,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  achievementUnlocked: {
    backgroundColor: Colors.midnightOcean,
    borderWidth: 1,
    borderColor: Colors.solarGold,
    ...Theme.glowShadow(Colors.solarGold),
  },
  achievementLocked: {
    backgroundColor: Colors.midnightOcean,
    borderWidth: 1,
    borderColor: Colors.dimGrey,
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  achievementName: {
    ...Typography.caption,
    textAlign: 'center',
    fontSize: 11,
  },

  // Settings
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dimGrey,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.moonlight,
  },
  settingValue: {
    ...Typography.body,
    color: Colors.fogGrey,
  },
  settingSectionLabel: {
    ...Typography.label,
    color: Colors.fogGrey,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.dimGrey,
    marginVertical: Spacing.md,
  },

  // Language selector
  languageSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dimGrey,
  },
  languageOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.midnightOcean,
  },
  languageOptionActive: {
    backgroundColor: Colors.bioluminescent,
  },
  languageText: {
    ...Typography.bodyBold,
    color: Colors.fogGrey,
    fontSize: 13,
  },
  languageTextActive: {
    color: Colors.deepSpace,
  },

  // Wearables
  wearableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dimGrey,
  },
  wearableName: {
    ...Typography.body,
    color: Colors.moonlight,
    flex: 1,
  },
  wearableStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  wearableStatusText: {
    ...Typography.caption,
    fontSize: 12,
  },

  // Links
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dimGrey,
  },
  linkText: {
    ...Typography.body,
    color: Colors.fogGrey,
  },
  linkArrow: {
    ...Typography.h3,
    color: Colors.dimGrey,
  },

  // Progressive Access
  accessLevelRow: {
    marginBottom: Spacing.sm,
  },
  accessCurrentLabel: {
    ...Typography.bodyBold,
    color: Colors.bioluminescent,
  },
  accessNextLabel: {
    ...Typography.caption,
    color: Colors.fogGrey,
    marginBottom: Spacing.md,
    fontSize: 13,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requirementCheck: {
    fontSize: 16,
    color: Colors.bioluminescent,
    width: 24,
    textAlign: 'center',
    marginRight: Spacing.sm,
  },
  requirementText: {
    ...Typography.body,
    fontSize: 14,
  },
  accessActionContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  accessActionText: {
    ...Typography.bodyBold,
    color: Colors.fogGrey,
  },
  accessActionButton: {
    backgroundColor: Colors.bioluminescent,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
  },
  accessActionButtonText: {
    ...Typography.bodyBold,
    color: Colors.deepSpace,
    fontSize: 15,
  },

  // Spacing
  bottomSpacer: {
    height: Spacing.xxxl + Spacing.xl,
  },
});

export default ProfileScreen;
