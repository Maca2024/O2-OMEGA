// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Root Layout
// App-level provider, initializes store, handles onboarding
// ═══════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from '../src/hooks/useStore';
import { Colors } from '../src/theme/colors';

export default function RootLayout() {
  const initializeStore = useStore((s) => s.initializeStore);

  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor={Colors.deepSpace} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.deepSpace },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="session"
          options={{
            animation: 'fade_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.deepSpace,
  },
});
