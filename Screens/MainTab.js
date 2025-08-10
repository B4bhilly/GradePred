import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './WelcomeScreen';
import CalendarScreen from './HistoryScreens/HistoryScreen';
import ProfileScreen from './InsightsScreens/InsightsScreen'; 
import WelcomeScreen from './HomeScreens/GradePredScreen';
import { typography, spacing } from '../designSystem';
import { useTheme } from '../ThemeContext';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { colors: themeColors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Predict') {
            return <Feather name="book-open" size={size} color={color} />;
          } else if (route.name === 'History') {
            return <FontAwesome6 name="clock-rotate-left" size={size} color={color} />;
          } else if (route.name === 'Insights') {
            return <MaterialIcons name="insights" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopWidth: 1,
          borderTopColor: themeColors.border,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.xs,
          fontWeight: typography.medium,
        },
      })}
    >
      <Tab.Screen name="Predict" component={WelcomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={CalendarScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Insights" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
