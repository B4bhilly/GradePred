import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Light theme colors
const lightColors = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  secondary: '#f59e0b',
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  border: '#e5e7eb',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  card: '#ffffff',
  inputBackground: '#ffffff',
  switchTrack: '#e5e7eb',
  switchThumb: '#ffffff',
};

// Dark theme colors
const darkColors = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  secondary: '#fbbf24',
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  success: '#22c55e',
  warning: '#fbbf24',
  error: '#f87171',
  border: '#334155',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  card: '#1e293b',
  inputBackground: '#334155',
  switchTrack: '#475569',
  switchThumb: '#3b82f6',
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Ensure colors are always available, fallback to light theme if not
  if (!context.colors) {
    console.warn('Theme colors not initialized, using fallback colors');
    return {
      ...context,
      colors: lightColors
    };
  }
  
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colors, setColors] = useState(lightColors);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme preference from storage on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update colors when theme changes
  useEffect(() => {
    setColors(isDarkMode ? darkColors : lightColors);
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isDarkMode, isInitialized]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    colors,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
