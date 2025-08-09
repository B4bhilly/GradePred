import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MainStackNavigator from './Navigation/MainStackNavigation';
import { MLProvider } from './MLContext';
import { AuthProvider } from './AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <MLProvider>
        <SafeAreaView style={styles.container}>
          <MainStackNavigator />
        </SafeAreaView>
      </MLProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
