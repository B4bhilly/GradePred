import { StyleSheet, View, Text, Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WelcomeScreen from '../Screens/WelcomeScreen';
import CalendarScreen from '../Screens/HistoryScreens/HistoryScreen';
import ProfileScreen from '../Screens/InsightsScreens/InsightsScreen'; 
import GradePredScreen from '../Screens/HomeScreens/GradePredScreen';
import { typography, spacing } from '../components/designSystem';
import { useTheme } from '../ThemeContext';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { colors: themeColors, isInitialized } = useTheme();
  const insets = useSafeAreaInsets();
  
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
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : spacing.sm,
          paddingTop: spacing.sm,
          height: Platform.OS === 'ios' ? 40 + insets.bottom : 60,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: typography.xs,
          fontWeight: typography.medium,
        },
      })}
    >
      <Tab.Screen name="Predict" component={GradePredScreen} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={CalendarScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Insights" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
