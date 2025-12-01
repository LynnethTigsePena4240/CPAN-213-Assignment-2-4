import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  // Detect system theme
  const colorScheme = useColorScheme();

  return (
    // Main tab navigator configuration
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab, // Custom tab button with haptics
      }}>

      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Tasks tab */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />

      {/* Motivation tab */}
      <Tabs.Screen
        name="motivation"
        options={{
          title: 'Motivation',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="robot-happy" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
