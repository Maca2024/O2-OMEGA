import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CategoryBadgeProps {
  name: string;
  color: string;
  icon?: string;
  style?: ViewStyle;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  name,
  color,
  icon,
  style,
}) => {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}33` }, // 20% opacity hex
        style,
      ]}
    >
      {icon ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : null}
      <Text style={[styles.text, { color }]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
