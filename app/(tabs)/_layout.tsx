// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Tab Navigation Layout
// 5 tabs: Home, Discover, Breathe (CTA), Insights, Journey
// "Liquid Consciousness" themed tab bar
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme/colors';

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    home: '🏠',
    discover: '🔍',
    breathe: '🌬️',
    insights: '📊',
    journey: '👤',
  };

  return (
    <View style={[tabStyles.iconContainer, focused && tabStyles.iconFocused]}>
      <Text style={[tabStyles.icon, name === 'breathe' && focused && tabStyles.breatheIcon]}>
        {icons[name] || '●'}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  iconFocused: {},
  icon: {
    fontSize: 22,
  },
  breatheIcon: {
    fontSize: 28,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.midnightOcean,
          borderTopColor: Colors.cardBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: Colors.bioluminescent,
        tabBarInactiveTintColor: Colors.dimText,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="discover" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="breathe"
        options={{
          title: 'Breathe',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="breathe" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="insights" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="journey" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
