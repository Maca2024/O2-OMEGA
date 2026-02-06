// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Discover / Library Screen
// Browse all breathing patterns by category with search
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PatternCard } from '../components/PatternCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { PATTERNS, getCategoryLabel, getCategoryIcon } from '../data/patterns';
import { useStore } from '../hooks/useStore';
import { PatternCategory, BreathPattern } from '../types/breathing';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function DiscoverScreen() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatterns = useMemo(() => {
    let patterns = PATTERNS;

    if (selectedCategory !== 'all') {
      patterns = patterns.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      patterns = patterns.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.nameNL.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.tags.some((t) => t.includes(query))
      );
    }

    return patterns;
  }, [selectedCategory, searchQuery]);

  const renderPattern = ({ item }: { item: BreathPattern }) => {
    const isLocked = item.requiredLevel > user.level;
    const isFavorite = user.favoritePatterns.includes(item.id);

    return (
      <PatternCard
        pattern={item}
        onPress={() => {
          if (!isLocked) {
            router.push(`/session?patternId=${item.id}`);
          }
        }}
        isLocked={isLocked}
        isFavorite={isFavorite}
      />
    );
  };

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { all: PATTERNS.length };
    PATTERNS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>
          {PATTERNS.length} breathing patterns
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search patterns..."
          placeholderTextColor={Colors.dimText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* Category Tabs */}
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Category Info */}
      {selectedCategory !== 'all' && (
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>
            {getCategoryIcon(selectedCategory)}
          </Text>
          <Text style={styles.categoryLabel}>
            {getCategoryLabel(selectedCategory)}
          </Text>
          <Text style={styles.categoryCount}>
            {categoryCount[selectedCategory] || 0} patterns
          </Text>
        </View>
      )}

      {/* Pattern Grid */}
      <FlatList
        data={filteredPatterns}
        renderItem={renderPattern}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No patterns found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: '800',
    color: Colors.moonlight,
  },
  subtitle: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchInput: {
    backgroundColor: Colors.deepCurrent,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    fontSize: FontSize.body,
    color: Colors.moonlight,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  categoryCount: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
  },
  gridRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  gridContent: {
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.huge,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.bodyLarge,
    fontWeight: '600',
    color: Colors.moonlight,
  },
  emptySubtext: {
    fontSize: FontSize.caption,
    color: Colors.fogGrey,
    marginTop: Spacing.xs,
  },
});
