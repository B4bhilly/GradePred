import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './WelcomeScreen';
import CalendarScreen from './HistoryScreens/HistoryScreen';
import ProfileScreen from './InsightsScreens/InsightsScreen'; 
import WelcomeScreen from './HomeScreens/GradePredScreen';
import { colors, typography, spacing } from '../designSystem';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
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
