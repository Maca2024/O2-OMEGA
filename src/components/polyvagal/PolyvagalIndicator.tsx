import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';

type PolyvagalState = 'ventral' | 'sympathetic' | 'dorsal';

interface PolyvagalIndicatorProps {
  state: PolyvagalState;
  animated?: boolean;
  style?: ViewStyle;
}

const ZONE_COLORS: Record<PolyvagalState, string> = {
  ventral: '#00D4AA',     // teal / bioluminescent
  sympathetic: '#FFD93D', // amber / solarGold
  dorsal: '#FF6B9D',      // rose / heartPink
};

const ZONE_LABELS: Record<PolyvagalState, string> = {
  ventral: 'Calm & Connected',
  sympathetic: 'Alert & Energized',
  dorsal: 'Rest & Restore',
};

// Dot position as a fraction of the bar width (center of each third)
const ZONE_POSITIONS: Record<PolyvagalState, number> = {
  ventral: 0.167,      // center of left third
  sympathetic: 0.5,    // center of middle third
  dorsal: 0.833,       // center of right third
};

export const PolyvagalIndicator: React.FC<PolyvagalIndicatorProps> = ({
  state,
  animated = true,
  style,
}) => {
  const dotPosition = useRef(new Animated.Value(ZONE_POSITIONS[state])).current;

  useEffect(() => {
    const targetPosition = ZONE_POSITIONS[state];

    if (animated) {
      Animated.spring(dotPosition, {
        toValue: targetPosition,
        tension: 40,
        friction: 8,
        useNativeDriver: false,
      }).start();
    } else {
      dotPosition.setValue(targetPosition);
    }
  }, [state, animated, dotPosition]);

  const activeColor = ZONE_COLORS[state];

  return (
    <View style={[styles.container, style]}>
      {/* Zone bar */}
      <View style={styles.barContainer}>
        <View style={[styles.zone, styles.zoneLeft, { backgroundColor: ZONE_COLORS.ventral }]} />
        <View style={[styles.zone, styles.zoneCenter, { backgroundColor: ZONE_COLORS.sympathetic }]} />
        <View style={[styles.zone, styles.zoneRight, { backgroundColor: ZONE_COLORS.dorsal }]} />

        {/* Glowing indicator dot */}
        <Animated.View
          style={[
            styles.dotOuter,
            {
              backgroundColor: `${activeColor}40`,
              left: dotPosition.interpolate({
                inputRange: [0, 1],
                outputRange: ['-6%', '94%'],
              }),
            },
          ]}
        >
          <View
            style={[
              styles.dotInner,
              {
                backgroundColor: activeColor,
                shadowColor: activeColor,
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* State label */}
      <Text style={[styles.label, { color: activeColor }]}>
        {ZONE_LABELS[state]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  barContainer: {
    width: '100%',
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  zone: {
    flex: 1,
    height: 8,
    opacity: 0.4,
  },
  zoneLeft: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  zoneCenter: {
    marginHorizontal: 2,
  },
  zoneRight: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  dotOuter: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
