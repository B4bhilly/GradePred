/**
 * MAIN APPLICATION ENTRY POINT
 * This file serves as the root component that sets up the entire app structure
 * and provides all necessary context providers to child components.
 */

import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import MainStackNavigator from './Navigation/MainStackNavigation';
import { MLProvider } from './MLContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './ThemeContext';

/**
 * ROOT APP COMPONENT
 * Wraps the entire application with all necessary context providers
 * in the correct order for proper state management and data flow.
 */
export default function App() {
  return (
    // Theme provider must be outermost to provide color schemes to all components
    <ThemeProvider>
      {/* Auth provider manages user authentication state and login/logout functionality */}
      <AuthProvider>
        {/* ML provider handles machine learning predictions and grade management */}
        <MLProvider>
          <AppContent />
        </MLProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * APP CONTENT COMPONENT
 * Handles the main app rendering logic, including loading states
 * and theme initialization before showing the main navigation.
 */
const AppContent = () => {
  // Get theme state and initialization status from ThemeContext
  const { colors, isInitialized } = useTheme();
  
  // Debug logging to track theme initialization
  console.log('AppContent - isInitialized:', isInitialized, 'colors:', colors);
  
  /**
   * LOADING STATE HANDLER
   * Shows a loading screen while the theme system is initializing
   * This prevents the app from rendering with undefined colors
   */
  if (!isInitialized) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#1f2937', fontSize: 18 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Debug logging when ready to render main navigation
  console.log('AppContent - rendering MainStackNavigator');
  
  /**
   * MAIN APP RENDER
   * Once theme is initialized, renders the main navigation stack
   * with proper background color from the theme system
   */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <MainStackNavigator />
    </SafeAreaView>
  );
};
