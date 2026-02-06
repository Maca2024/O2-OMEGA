// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Profile / Journey Screen
// Level, XP, achievements, journal, settings
// ═══════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '../hooks/useStore';
import { getLevelFromXP, getUnlockedAchievements, ACHIEVEMENTS } from '../data/achievements';
import { Colors, CategoryColors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';

const LEVEL_INFO: Record<number, { title: string; color: string; description: string }> = {
  1: {
    title: 'Foundation',
    color: Colors.bioluminescent,
    description: 'Mastering the basics of conscious breathing',
  },
  2: {
    title: 'Activator',
    color: Colors.sympatheticPrimary,
    description: 'Exploring energizing and activating techniques',
  },
  3: {
    title: 'Explorer',
    color: Colors.clinicalPrimary,
    description: 'Deepening practice with advanced protocols',
  },
  4: {
    title: 'Transformer',
    color: Colors.transformativePrimary,
    description: 'Access to consciousness-expanding breathwork',
  },
};

export function ProfileScreen() {
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);

  const levelInfo = useMemo(() => getLevelFromXP(user.xp), [user.xp]);
  const currentLevelMeta = LEVEL_INFO[user.level] || LEVEL_INFO[1];
  const xpProgress = user.xp / levelInfo.nextLevelXP;

  const unlockedAchievements = useMemo(
    () =>
      getUnlockedAchievements(
        user.totalSessionsCompleted,
        user.totalMinutes,
        user.currentStreak,
        user.level,
        user.controlPauseScore || 0
      ),
    [user]
  );

  const lockedAchievements = useMemo(
    () => ACHIEVEMENTS.filter((a) => !unlockedAchievements.find((u) => u.id === a.id)),
    [unlockedAchievements]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Journey</Text>
      </View>

      {/* Level Card */}
      <View style={[styles.levelCard, { borderColor: currentLevelMeta.color + '30' }]}>
        <View style={styles.levelHeader}>
          <View style={[styles.levelCircle, { borderColor: currentLevelMeta.color }]}>
            <Text style={[styles.levelNumber, { color: currentLevelMeta.color }]}>
              {user.level}
            </Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={[styles.levelTitle, { color: currentLevelMeta.color }]}>
              {currentLevelMeta.title}
            </Text>
            <Text style={styles.levelDescription}>{currentLevelMeta.description}</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpText}>{user.xp} XP</Text>
            <Text style={styles.xpTarget}>{levelInfo.nextLevelXP} XP for next level</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View
              style={[
                styles.xpBarFill,
                {
                  width: `${Math.min(xpProgress * 100, 100)}%`,
                  backgroundColor: currentLevelMeta.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Progressive Access Preview */}
        <View style={styles.levelsPreview}>
          {[1, 2, 3, 4].map((level) => {
            const meta = LEVEL_INFO[level];
            const isUnlocked = user.level >= level;
            return (
              <View
                key={level}
                style={[
                  styles.levelDot,
                  {
                    backgroundColor: isUnlocked ? meta.color : Colors.deepCurrent,
                    borderColor: meta.color + '40',
                  },
                ]}
              >
                <Text style={[styles.levelDotText, { opacity: isUnlocked ? 1 : 0.3 }]}>
                  {level}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Journey Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <StatItem label="Sessions" value={`${user.totalSessionsCompleted}`} icon="🎯" />
          <StatItem label="Minutes" value={`${user.totalMinutes}`} icon="⏱️" />
          <StatItem label="Current Streak" value={`${user.currentStreak} days`} icon="🔥" />
          <StatItem label="Longest Streak" value={`${user.longestStreak} days`} icon="💫" />
          <StatItem label="Total XP" value={`${user.xp}`} icon="⭐" />
          <StatItem
            label="CP Score"
            value={user.controlPauseScore ? `${user.controlPauseScore}s` : 'Not tested'}
            icon="🫁"
          />
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </Text>

        {/* Unlocked */}
        {unlockedAchievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementRow}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDesc}>{achievement.description}</Text>
            </View>
            <Text style={styles.achievementXP}>+{achievement.xpReward} XP</Text>
          </View>
        ))}

        {/* Locked */}
        {lockedAchievements.slice(0, 5).map((achievement) => (
          <View key={achievement.id} style={[styles.achievementRow, styles.lockedAchievement]}>
            <Text style={[styles.achievementIcon, { opacity: 0.3 }]}>🔒</Text>
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { opacity: 0.4 }]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDesc, { opacity: 0.3 }]}>
                {achievement.description}
              </Text>
            </View>
            <Text style={[styles.achievementXP, { opacity: 0.3 }]}>
              +{achievement.xpReward} XP
            </Text>
          </View>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
          <Text style={styles.settingsIcon}>🔔</Text>
          <Text style={styles.settingsLabel}>Reminders</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
          <Text style={styles.settingsIcon}>📳</Text>
          <Text style={styles.settingsLabel}>Haptic Feedback</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
          <Text style={styles.settingsIcon}>🎵</Text>
          <Text style={styles.settingsLabel}>Audio & Soundscapes</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
          <Text style={styles.settingsIcon}>⌚</Text>
          <Text style={styles.settingsLabel}>Wearable Connections</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
          <Text style={styles.settingsIcon}>🔒</Text>
          <Text style={styles.settingsLabel}>Privacy & Data</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.versionSection}>
        <Text style={styles.appName}>PNEUMA O2</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.tagline}>Breathe Beyond</Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={statStyles.container}>
      <Text style={statStyles.icon}>{icon}</Text>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  container: {
    width: '30%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.moonlight,
  },
  label: {
    fontSize: 11,
    color: Colors.fogGrey,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: '800',
    color: Colors.moonlight,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.bodyLarge,
    fontWeight: '700',
    color: Colors.moonlight,
    marginBottom: Spacing.lg,
  },

  // Level card
  levelCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.deepCurrent + 'CC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  levelCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.deepSpace,
  },
  levelNumber: {
    fontSize: FontSize.h2,
    fontWeight: '800',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: FontSize.h3,
    fontWeight: '700',
  },
  levelDescription: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: 2,
  },
  xpSection: {
    marginTop: Spacing.lg,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  xpText: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  xpTarget: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
  },
  xpBarBg: {
    height: 6,
    backgroundColor: Colors.deepSpace,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelsPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  levelDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelDotText: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.moonlight,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Achievements
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.deepCurrent + '80',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  achievementDesc: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: 1,
  },
  achievementXP: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.solarGold,
  },

  // Settings
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.moonlight,
  },
  settingsArrow: {
    fontSize: 24,
    color: Colors.fogGrey,
  },

  // Version
  versionSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  appName: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.bioluminescent,
    letterSpacing: 4,
  },
  version: {
    fontSize: FontSize.caption,
    color: Colors.dimText,
    marginTop: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  bottomSpacer: {
    height: 120,
  },
});
