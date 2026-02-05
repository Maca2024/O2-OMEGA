import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  showLabel?: boolean;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#00D4AA',
  showLabel = false,
  height = 6,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress, animatedWidth]);

  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      {showLabel ? (
        <Text style={styles.label}>{percentage}%</Text>
      ) : null}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: color,
              shadowColor: color,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    color: '#8B95A5',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  track: {
    width: '100%',
    backgroundColor: 'rgba(22, 36, 71, 0.6)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
});
