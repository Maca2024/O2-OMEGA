import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/home';
import { DiscoverScreen } from '../screens/discover';
import { ActiveSessionScreen } from '../screens/session';
import { InsightsScreen } from '../screens/insights';
import { ProfileScreen } from '../screens/profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '⌂',
  Discover: '◎',
  Breathe: '◉',
  Insights: '◈',
  Journey: '◇',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0E27',
          borderTopColor: 'rgba(0, 212, 170, 0.1)',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: '#8B95A5',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
        },
        tabBarIcon: ({ focused }) => (
          <Text style={{
            fontSize: 20,
            color: focused ? '#00D4AA' : '#8B95A5',
          }}>
            {TAB_ICONS[route.name] || '○'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name="Breathe" component={ActiveSessionScreen} options={{ tabBarLabel: 'Breathe' }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ tabBarLabel: 'Insights' }} />
      <Tab.Screen name="Journey" component={ProfileScreen} options={{ tabBarLabel: 'Journey' }} />
    </Tab.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Session"
          component={ActiveSessionScreen}
          options={{ presentation: 'fullScreenModal', animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
