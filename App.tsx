import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation';
import { OnboardingFlow } from './src/components/onboarding';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(true); // Set to false for first-time users

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0A0E27" />
        {isOnboarded ? (
          <AppNavigator />
        ) : (
          <OnboardingFlow onComplete={() => setIsOnboarded(true)} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
});
