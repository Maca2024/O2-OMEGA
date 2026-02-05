import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title, onPress, color = '#00D4AA', disabled = false, size = 'medium', style,
}) => {
  const heights = { small: 40, medium: 52, large: 64 };
  const fontSizes = { small: 14, medium: 16, large: 18 };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: color,
          height: heights[size],
          opacity: disabled ? 0.4 : 1,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 16,
          elevation: 8,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: fontSizes[size] }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    color: '#0A0E27',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
