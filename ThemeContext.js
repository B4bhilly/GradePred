import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced theme definitions with more comprehensive color schemes
const themes = {
  light: {
    name: 'Light',
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    secondary: '#f59e0b',
    secondaryLight: '#fbbf24',
    secondaryDark: '#d97706',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    textPrimary: '#1f2937',
    textSecondary: '#4b5563',
    textTertiary: '#6b7280',
    success: '#10b981',
    successLight: '#34d399',
    successDark: '#059669',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    card: '#ffffff',
    cardSecondary: '#f8fafc',
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    switchTrack: '#e5e7eb',
    switchThumb: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    highlight: '#eff6ff',
    highlightSecondary: '#fef3c7',
  },
  
  dark: {
    name: 'Dark',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    secondary: '#fbbf24',
    secondaryLight: '#fcd34d',
    secondaryDark: '#f59e0b',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    success: '#22c55e',
    successLight: '#4ade80',
    successDark: '#16a34a',
    warning: '#fbbf24',
    warningLight: '#fcd34d',
    warningDark: '#f59e0b',
    error: '#f87171',
    errorLight: '#fca5a5',
    errorDark: '#ef4444',
    border: '#334155',
    borderLight: '#475569',
    card: '#1e293b',
    cardSecondary: '#334155',
    inputBackground: '#334155',
    inputBorder: '#475569',
    switchTrack: '#475569',
    switchThumb: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    highlight: '#1e3a8a',
    highlightSecondary: '#92400e',
  },
  
  blue: {
    name: 'Blue',
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    primaryDark: '#1e3a8a',
    secondary: '#0ea5e9',
    secondaryLight: '#38bdf8',
    secondaryDark: '#0284c7',
    background: '#f0f9ff',
    backgroundSecondary: '#e0f2fe',
    backgroundTertiary: '#bae6fd',
    textPrimary: '#0c4a6e',
    textSecondary: '#0369a1',
    textTertiary: '#0284c7',
    success: '#059669',
    successLight: '#10b981',
    successDark: '#047857',
    warning: '#d97706',
    warningLight: '#f59e0b',
    warningDark: '#b45309',
    error: '#dc2626',
    errorLight: '#ef4444',
    errorDark: '#b91c1c',
    border: '#bae6fd',
    borderLight: '#e0f2fe',
    card: '#ffffff',
    cardSecondary: '#f0f9ff',
    inputBackground: '#ffffff',
    inputBorder: '#bae6fd',
    switchTrack: '#bae6fd',
    switchThumb: '#ffffff',
    shadow: 'rgba(30, 64, 175, 0.1)',
    shadowDark: 'rgba(30, 64, 175, 0.2)',
    overlay: 'rgba(30, 64, 175, 0.5)',
    highlight: '#dbeafe',
    highlightSecondary: '#fef3c7',
  },
  
  green: {
    name: 'Green',
    primary: '#059669',
    primaryLight: '#10b981',
    primaryDark: '#047857',
    secondary: '#84cc16',
    secondaryLight: '#a3e635',
    secondaryDark: '#65a30d',
    background: '#f0fdf4',
    backgroundSecondary: '#dcfce7',
    backgroundTertiary: '#bbf7d0',
    textPrimary: '#064e3b',
    textSecondary: '#065f46',
    textTertiary: '#047857',
    success: '#16a34a',
    successLight: '#22c55e',
    successDark: '#15803d',
    warning: '#d97706',
    warningLight: '#f59e0b',
    warningDark: '#b45309',
    error: '#dc2626',
    errorLight: '#ef4444',
    errorDark: '#b91c1c',
    border: '#bbf7d0',
    borderLight: '#dcfce7',
    card: '#ffffff',
    cardSecondary: '#f0fdf4',
    inputBackground: '#ffffff',
    inputBorder: '#bbf7d0',
    switchTrack: '#bbf7d0',
    switchThumb: '#ffffff',
    shadow: 'rgba(5, 150, 105, 0.1)',
    shadowDark: 'rgba(5, 150, 105, 0.2)',
    overlay: 'rgba(5, 150, 105, 0.5)',
    highlight: '#dcfce7',
    highlightSecondary: '#fef3c7',
  },
  
  purple: {
    name: 'Purple',
    primary: '#7c3aed',
    primaryLight: '#a855f7',
    primaryDark: '#6d28d9',
    secondary: '#ec4899',
    secondaryLight: '#f472b6',
    secondaryDark: '#db2777',
    background: '#faf5ff',
    backgroundSecondary: '#f3e8ff',
    backgroundTertiary: '#e9d5ff',
    textPrimary: '#4c1d95',
    textSecondary: '#5b21b6',
    textTertiary: '#6d28d9',
    success: '#059669',
    successLight: '#10b981',
    successDark: '#047857',
    warning: '#d97706',
    warningLight: '#f59e0b',
    warningDark: '#b45309',
    error: '#dc2626',
    errorLight: '#ef4444',
    errorDark: '#b91c1c',
    border: '#e9d5ff',
    borderLight: '#f3e8ff',
    card: '#ffffff',
    cardSecondary: '#faf5ff',
    inputBackground: '#ffffff',
    inputBorder: '#e9d5ff',
    switchTrack: '#e9d5ff',
    switchThumb: '#ffffff',
    shadow: 'rgba(124, 58, 237, 0.1)',
    shadowDark: 'rgba(124, 58, 237, 0.2)',
    overlay: 'rgba(124, 58, 237, 0.5)',
    highlight: '#f3e8ff',
    highlightSecondary: '#fef3c7',
  }
};

// Theme context
const ThemeContext = createContext();

// Custom hook for theme
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
      colors: themes.light
    };
  }
  
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [colors, setColors] = useState(themes.light);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Load theme preference from storage on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update colors when theme changes
  useEffect(() => {
    const newColors = themes[currentTheme] || themes.light;
    setColors(newColors);
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [currentTheme, isInitialized]);

  // Load theme preference from AsyncStorage
  const loadThemePreference = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedSystemTheme = await AsyncStorage.getItem('systemTheme');
      
      if (savedSystemTheme === 'true') {
        setIsSystemTheme(true);
        // Use system theme if available
        const systemTheme = getSystemTheme();
        setCurrentTheme(systemTheme);
      } else if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
        setIsSystemTheme(false);
      } else {
        // Default to light theme
        setCurrentTheme('light');
        setIsSystemTheme(false);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to light theme
      setCurrentTheme('light');
      setIsSystemTheme(false);
    }
  }, []);

  // Get system theme (light/dark)
  const getSystemTheme = useCallback(() => {
    // This would need to be implemented with react-native-appearance
    // For now, we'll default to light
    return 'light';
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(async () => {
    try {
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setCurrentTheme(newTheme);
      setIsSystemTheme(false);
      await AsyncStorage.setItem('theme', newTheme);
      await AsyncStorage.setItem('systemTheme', 'false');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [currentTheme]);

  // Set specific theme
  const setTheme = useCallback(async (themeName) => {
    try {
      if (!themes[themeName]) {
        console.warn(`Theme "${themeName}" not found, using light theme`);
        themeName = 'light';
      }
      
      setCurrentTheme(themeName);
      setIsSystemTheme(false);
      await AsyncStorage.setItem('theme', themeName);
      await AsyncStorage.setItem('systemTheme', 'false');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  // Toggle system theme
  const toggleSystemTheme = useCallback(async () => {
    try {
      const newSystemTheme = !isSystemTheme;
      setIsSystemTheme(newSystemTheme);
      
      if (newSystemTheme) {
        const systemTheme = getSystemTheme();
        setCurrentTheme(systemTheme);
        await AsyncStorage.setItem('systemTheme', 'true');
      } else {
        await AsyncStorage.setItem('systemTheme', 'false');
      }
    } catch (error) {
      console.error('Error toggling system theme:', error);
    }
  }, [isSystemTheme, getSystemTheme]);

  // Get available themes
  const availableThemes = useMemo(() => {
    return Object.keys(themes).map(key => ({
      key,
      name: themes[key].name,
      isActive: key === currentTheme
    }));
  }, [currentTheme]);

  // Get theme info
  const getThemeInfo = useCallback(() => {
    return {
      current: currentTheme,
      name: themes[currentTheme]?.name || 'Light',
      isSystem: isSystemTheme,
      available: availableThemes
    };
  }, [currentTheme, isSystemTheme, availableThemes]);

  // Get color with fallback
  const getColor = useCallback((colorKey, fallback = '#000000') => {
    return colors[colorKey] || fallback;
  }, [colors]);

  // Get contrast color for text
  const getContrastColor = useCallback((backgroundColor) => {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }, []);

  // Check if current theme is dark
  const isDark = useMemo(() => {
    return currentTheme === 'dark';
  }, [currentTheme]);

  // Check if current theme is light
  const isLight = useMemo(() => {
    return currentTheme === 'light';
  }, [currentTheme]);

  const value = {
    // Theme state
    currentTheme,
    colors,
    isInitialized,
    isSystemTheme,
    isDark,
    isLight,
    
    // Theme actions
    toggleTheme,
    setTheme,
    toggleSystemTheme,
    
    // Theme utilities
    availableThemes,
    getThemeInfo,
    getColor,
    getContrastColor,
    
    // Legacy support
    isDarkMode: isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
