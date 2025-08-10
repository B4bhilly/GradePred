import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../Screens/HomeScreens/GradePredScreen';
import HomeScreen from '../Screens/WelcomeScreen';
import MainTab from '../Screens/MainTab';
import GPAScreen from '../Screens/HomeScreens/GPAScreen';
import CWAScreen from '../Screens/HomeScreens/CWAScreen';
import SettingsScreen from '../Screens/HomeScreens/SettingsScreen';
import GPAScreenF from '../Screens/HomeScreens/GPAScreenF';
import LoginScreen from '../LoginScreen';
import SignupScreen from '../SignupScreen';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const { colors, isInitialized } = useTheme();

  // Show loading screen while checking authentication or theme
  if (loading || !isInitialized || !colors) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#ffffff' }]}>
        <Text style={[styles.loadingText, { color: '#2563eb' }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={isAuthenticated ? 'MainTab' : 'Home'} 
          screenOptions={{headerShown: false}}
        >
            {!isAuthenticated ? (
              // Auth screens - shown when user is not authenticated
              <>
                <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
                <Stack.Screen name="SignUp" component={SignupScreen} options={{headerShown:false}} />
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
              </>
            ) : (
              // App screens - shown when user is authenticated
              <>
                <Stack.Screen name="MainTab" component={MainTab} options={{headerShown: false}} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
                <Stack.Screen name="GPA" component={GPAScreen} options={{headerShown: false}} />
                <Stack.Screen name="CWA" component={CWAScreen} options={{headerShown: false}} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
                <Stack.Screen name="GPAF" component={GPAScreenF} options={{headerShown: false}} />
              </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  )
}

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