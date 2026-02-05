import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';

// ---------------------------------------------------------------------------
// Theme constants (inlined from project theme for self-containment)
// ---------------------------------------------------------------------------

const Colors = {
  deepSpace: '#0A0E27',
  midnightOcean: '#0F1B3D',
  deepCurrent: '#162447',
  bioluminescent: '#00D4AA',
  neuralPurple: '#7B68EE',
  heartPink: '#FF6B9D',
  solarGold: '#FFD93D',
  moonlight: '#E8F0FE',
  fogGrey: '#8B95A5',
  clinicalBlue: '#4A9EFF',
  cardBorder: 'rgba(0, 212, 170, 0.15)',
} as const;

const CategoryColors: Record<PatternCategory, string> = {
  parasympathetic: '#00D4AA',
  sympathetic: '#FFD93D',
  clinical: '#4A9EFF',
  transformative: '#7B68EE',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PatternCategory = 'parasympathetic' | 'sympathetic' | 'clinical' | 'transformative';
type AccessLevel = 1 | 2 | 3 | 4;
type Difficulty = 1 | 2 | 3 | 4;

interface DemoPattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  difficulty: Difficulty;
  requiredLevel: AccessLevel;
  durationRange: { min: number; max: number };
  bpm: number | null;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Filter tab definition
// ---------------------------------------------------------------------------

interface FilterTab {
  key: 'all' | PatternCategory;
  label: string;
  color: string;
}

const FILTER_TABS: FilterTab[] = [
  { key: 'all', label: 'All', color: Colors.moonlight },
  { key: 'parasympathetic', label: 'Calm \u{1F7E2}', color: CategoryColors.parasympathetic },
  { key: 'sympathetic', label: 'Energy \u{1F7E1}', color: CategoryColors.sympathetic },
  { key: 'clinical', label: 'Clinical \u{1F535}', color: CategoryColors.clinical },
  { key: 'transformative', label: 'Transform \u{1F7E3}', color: CategoryColors.transformative },
];

// ---------------------------------------------------------------------------
// Demo pattern data (8 representative patterns across all categories)
// ---------------------------------------------------------------------------

const DEMO_PATTERNS: DemoPattern[] = [
  {
    id: 'coherent-breathing',
    name: 'Coherent Breathing',
    category: 'parasympathetic',
    description:
      'Equal-ratio breathing at ~5.5 breaths per minute for maximal HRV coherence.',
    difficulty: 1,
    requiredLevel: 1,
    durationRange: { min: 180, max: 1200 },
    bpm: 5.5,
    tags: ['beginner', 'hrv', 'coherence', 'sleep'],
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    category: 'parasympathetic',
    description:
      'Dr. Andrew Weil\'s relaxation technique for falling asleep and calming anxiety.',
    difficulty: 1,
    requiredLevel: 1,
    durationRange: { min: 60, max: 300 },
    bpm: 3,
    tags: ['beginner', 'sleep', 'anxiety'],
  },
  {
    id: 'breath-of-fire',
    name: 'Breath of Fire',
    category: 'sympathetic',
    description:
      'Rapid rhythmic diaphragmatic pumping from Kundalini yoga for energy and alertness.',
    difficulty: 2,
    requiredLevel: 2,
    durationRange: { min: 60, max: 300 },
    bpm: 60,
    tags: ['energy', 'kundalini', 'activating'],
  },
  {
    id: 'wim-hof-method',
    name: 'Wim Hof Method',
    category: 'sympathetic',
    description:
      '30 power breaths followed by retention. Shifts blood chemistry and autonomic state.',
    difficulty: 3,
    requiredLevel: 3,
    durationRange: { min: 300, max: 1800 },
    bpm: null,
    tags: ['advanced', 'immune', 'performance'],
  },
  {
    id: 'buteyko-basic',
    name: 'Buteyko Basic',
    category: 'clinical',
    description:
      'Reduce breathing volume to normalise CO2 levels and restore nasal breathing.',
    difficulty: 1,
    requiredLevel: 1,
    durationRange: { min: 300, max: 1200 },
    bpm: 5,
    tags: ['clinical', 'asthma', 'co2-tolerance'],
  },
  {
    id: 'buteyko-walk',
    name: 'Buteyko Walk',
    category: 'clinical',
    description:
      'Walk with held breath to build CO2 tolerance under mild metabolic demand.',
    difficulty: 2,
    requiredLevel: 2,
    durationRange: { min: 300, max: 900 },
    bpm: null,
    tags: ['clinical', 'walking', 'exercise'],
  },
  {
    id: 'holotropic-breathwork',
    name: 'Holotropic Breathwork',
    category: 'transformative',
    description:
      'Sustained connected breathing to access non-ordinary states of consciousness.',
    difficulty: 3,
    requiredLevel: 3,
    durationRange: { min: 1800, max: 10800 },
    bpm: 25,
    tags: ['transformative', 'connected', 'therapeutic'],
  },
  {
    id: 'dmt-activation',
    name: 'DMT Activation Protocol',
    category: 'transformative',
    description:
      'Advanced multi-phase protocol for endogenous neurochemical shifts. Max supervision.',
    difficulty: 4,
    requiredLevel: 4,
    durationRange: { min: 1200, max: 3600 },
    bpm: null,
    tags: ['transformative', 'advanced', 'visionary'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simulated current user level for demo purposes. */
const CURRENT_USER_LEVEL: AccessLevel = 2;

/** Render filled and empty stars for difficulty rating. */
function renderDifficultyStars(difficulty: Difficulty): string {
  const filled = '\u2605'; // ★
  const empty = '\u2606';  // ☆
  const maxStars = 4;
  return filled.repeat(difficulty) + empty.repeat(maxStars - difficulty);
}

/** Format seconds into a human-friendly duration string. */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

/** Build a concise duration range label. */
function durationLabel(range: { min: number; max: number }): string {
  return `${formatDuration(range.min)} - ${formatDuration(range.max)}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface PatternCardProps {
  pattern: DemoPattern;
  isLocked: boolean;
}

const PatternCard: React.FC<PatternCardProps> = React.memo(
  ({ pattern, isLocked }) => {
    const categoryColor = CategoryColors[pattern.category];

    return (
      <TouchableOpacity
        activeOpacity={isLocked ? 1 : 0.7}
        style={styles.cardContainer}
        accessibilityLabel={`${pattern.name}${isLocked ? ', locked' : ''}`}
        accessibilityRole="button"
      >
        <View style={styles.cardInner}>
          {/* Category color strip */}
          <View style={[styles.categoryStrip, { backgroundColor: categoryColor }]} />

          {/* Card content */}
          <View style={styles.cardContent}>
            {/* Top section: name */}
            <Text style={styles.patternName} numberOfLines={1}>
              {pattern.name}
            </Text>

            {/* Description */}
            <Text style={styles.patternDescription} numberOfLines={1}>
              {pattern.description}
            </Text>

            {/* Metadata row */}
            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: categoryColor }]}>
                {renderDifficultyStars(pattern.difficulty)}
              </Text>

              <View style={styles.metaDivider} />

              <Text style={styles.metaText}>
                {durationLabel(pattern.durationRange)}
              </Text>

              <View style={styles.metaDivider} />

              <Text style={styles.metaText}>
                {pattern.bpm !== null ? `${pattern.bpm} BPM` : 'Variable'}
              </Text>
            </View>
          </View>

          {/* Lock overlay */}
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>{'\u{1F512}'}</Text>
              <Text style={styles.lockText}>
                Level {pattern.requiredLevel} Required
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export const DiscoverScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | PatternCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived filtered list
  const filteredPatterns = useMemo(() => {
    let results = DEMO_PATTERNS;

    // Category filter
    if (activeFilter !== 'all') {
      results = results.filter((p) => p.category === activeFilter);
    }

    // Search filter (by name, case-insensitive)
    const query = searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      results = results.filter((p) => p.name.toLowerCase().includes(query));
    }

    return results;
  }, [activeFilter, searchQuery]);

  const patternCount = filteredPatterns.length;

  // Render functions
  const renderPatternCard = useCallback(
    ({ item }: ListRenderItemInfo<DemoPattern>) => {
      const isLocked = item.requiredLevel > CURRENT_USER_LEVEL;
      return <PatternCard pattern={item} isLocked={isLocked} />;
    },
    [],
  );

  const keyExtractor = useCallback((item: DemoPattern) => item.id, []);

  const renderListHeader = useCallback(
    () => (
      <View style={styles.listHeaderSpacer}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>{'\u{1F50D}'}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search patterns..."
            placeholderTextColor={Colors.fogGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clearIcon}>{'\u2715'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [searchQuery],
  );

  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{'\u{1F32C}\uFE0F'}</Text>
        <Text style={styles.emptyTitle}>No patterns found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filter.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.deepSpace} />

      {/* Header area */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.patternCount}>
          {patternCount} {patternCount === 1 ? 'pattern' : 'patterns'}
        </Text>

        {/* Category filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={styles.tabsScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                style={[
                  styles.tab,
                  isActive
                    ? { backgroundColor: tab.color }
                    : styles.tabInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive
                      ? styles.tabTextActive
                      : { color: Colors.fogGrey },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Pattern list */}
      <FlatList
        data={filteredPatterns}
        renderItem={renderPatternCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        initialNumToRender={8}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Screen
  screen: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },

  // Header
  headerContainer: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 8,
    backgroundColor: Colors.deepSpace,
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: Colors.moonlight,
  },
  patternCount: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.fogGrey,
    marginTop: 4,
  },

  // Category filter tabs
  tabsScroll: {
    marginTop: 20,
    marginBottom: 4,
  },
  tabsContent: {
    paddingRight: 24,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(139, 149, 165, 0.3)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: Colors.deepSpace,
  },

  // Search bar
  listHeaderSpacer: {
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 36, 71, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 149, 165, 0.2)',
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.moonlight,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.fogGrey,
    paddingLeft: 8,
  },

  // List
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 100,
  },

  // Pattern card
  cardContainer: {
    marginBottom: 14,
  },
  cardInner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(22, 36, 71, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryStrip: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardContent: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  patternName: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  patternDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.fogGrey,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: Colors.fogGrey,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(139, 149, 165, 0.3)',
    marginHorizontal: 10,
  },

  // Lock overlay
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    left: 4, // offset past the category strip
    backgroundColor: 'rgba(10, 14, 39, 0.78)',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  lockIcon: {
    fontSize: 18,
  },
  lockText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.fogGrey,
    letterSpacing: 0.3,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: Colors.moonlight,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.fogGrey,
  },
});
