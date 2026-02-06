// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Entry Point
// Routes to onboarding or main app based on state
// ═══════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useStore } from '../src/hooks/useStore';
import { Colors } from '../src/theme/colors';

export default function Index() {
  const isLoading = useStore((s) => s.isLoading);
  const onboardingComplete = useStore((s) => s.user.onboardingComplete);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.bioluminescent} />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.deepSpace,
  },
});
