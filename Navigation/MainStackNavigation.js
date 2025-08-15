import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../Screens/HomeScreens/GradePredScreen';
import HomeScreen from '../Screens/WelcomeScreen';
import MainTabNavigator from '../Screens/MainTab';
import GPAScreen from '../Screens/HomeScreens/GPAScreen';
import CWAScreen from '../Screens/HomeScreens/CWAScreen';
import SettingsScreen from '../Screens/SettingScreens/SettingsScreen';
import AboutScreen from '../Screens/SettingScreens/AboutScreen';
import FeedbackScreen from '../Screens/SettingScreens/FeedbackScreen';
import RateScreen from '../Screens/SettingScreens/RateScreen';
import ShareScreen from '../Screens/SettingScreens/ShareScreen';
import ProfileEditScreen from '../Screens/SettingScreens/ProfileEditScreen';
import PrivacyScreen from '../Screens/SettingScreens/PrivacyScreen';
import NotificationsScreen from '../Screens/SettingScreens/NotificationsScreen';
import LanguageScreen from '../Screens/SettingScreens/LanguageScreen';
// import GPAScreenF from '../Screens/HomeScreens/GPAScreenF';
import HistoryScreen from '../Screens/HistoryScreens/HistoryScreen';
import LoginScreen from '../LoginScreen';
import SignupScreen from '../SignupScreen';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

const Stack = createNativeStackNavigator();

// Component to handle authentication navigation
const AuthNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const { colors, isInitialized } = useTheme();

  console.log('AuthNavigator - isAuthenticated:', isAuthenticated, 'loading:', loading, 'isInitialized:', isInitialized);
  console.log('AuthNavigator - Current stack:', isAuthenticated ? 'Authenticated' : 'Unauthenticated');

  // Show loading screen while checking authentication or theme
  if (loading || !isInitialized || !colors) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#ffffff' }]}>
        <Text style={[styles.loadingText, { color: '#2563eb' }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{headerShown: false}}
    >
      {isAuthenticated ? (
        // Authenticated stack
        <>
          <Stack.Screen name="MainTab" component={MainTabNavigator} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="GPA" component={GPAScreen} />
          <Stack.Screen name="CWA" component={CWAScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="Rate" component={RateScreen} />
          <Stack.Screen name="Share" component={ShareScreen} />
          <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </>
      ) : (
        // Unauthenticated stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const MainStackNavigator = () => {
  const { colors, isInitialized } = useTheme();

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default MainStackNavigator

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
})