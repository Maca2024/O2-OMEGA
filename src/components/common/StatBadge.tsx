import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatBadgeProps {
  value: string | number;
  label: string;
  icon?: string;
  accentColor?: string;
  style?: ViewStyle;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  value,
  label,
  icon,
  accentColor,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : null}
      <Text
        style={[
          styles.value,
          accentColor ? { color: accentColor } : undefined,
        ]}
      >
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E8F0FE',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 12,
    color: '#8B95A5',
    marginTop: 2,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
