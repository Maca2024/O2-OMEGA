// ═══════════════════════════════════════════════════════════════
// PNEUMA O2 — Home Tab
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { AuroraBackground } from '../../src/components/AuroraBackground';
import { HomeScreen } from '../../src/screens/HomeScreen';

export default function HomeTab() {
  return (
    <AuroraBackground state="ventral">
      <HomeScreen />
    </AuroraBackground>
  );
}
