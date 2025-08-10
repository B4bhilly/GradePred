import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import MainStackNavigator from './Navigation/MainStackNavigation';
import { MLProvider } from './MLContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MLProvider>
          <AppContent />
        </MLProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { colors, isInitialized } = useTheme();
  
  // Show loading screen while theme is initializing
  if (!isInitialized) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#1f2937', fontSize: 18 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <MainStackNavigator />
    </SafeAreaView>
  );
};
