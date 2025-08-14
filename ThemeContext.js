/**
 * THEME CONTEXT SYSTEM
 * This file provides a comprehensive theming solution for the entire application.
 * It manages multiple color schemes, theme switching, persistence, and provides
 * consistent colors to all components throughout the app.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * THEME DEFINITIONS
 * Predefined color schemes for different visual themes.
 * Each theme includes comprehensive color palettes for all UI elements.
 */
const themes = {
  /**
   * LIGHT THEME
   * Clean, bright color scheme suitable for daytime use and accessibility
   */
  light: {
    name: 'Light',
    primary: '#2563eb',           // Main brand color for buttons and links
    primaryLight: '#3b82f6',      // Lighter variant for hover states
    primaryDark: '#1d4ed8',       // Darker variant for pressed states
    secondary: '#f59e0b',         // Secondary brand color for accents
    secondaryLight: '#fbbf24',    // Lighter secondary variant
    secondaryDark: '#d97706',     // Darker secondary variant
    background: '#ffffff',        // Main app background
    backgroundSecondary: '#f8fafc', // Secondary background for cards
    backgroundTertiary: '#f1f5f9',  // Tertiary background for sections
    surface: '#ffffff',            // Surface color for elevated elements
    textPrimary: '#1f2937',       // Primary text color
    textSecondary: '#4b5563',     // Secondary text color for subtitles
    textTertiary: '#6b7280',      // Tertiary text color for captions
    success: '#10b981',           // Success state color
    successLight: '#34d399',      // Light success variant
    successDark: '#059669',       // Dark success variant
    warning: '#f59e0b',           // Warning state color
    warningLight: '#fbbf24',      // Light warning variant
    warningDark: '#d97706',       // Dark warning variant
    error: '#ef4444',             // Error state color
    errorLight: '#f87171',        // Light error variant
    errorDark: '#dc2626',         // Dark error variant
    border: '#e5e7eb',            // Border color for inputs and cards
    borderLight: '#f3f4f6',       // Light border for subtle separators
    card: '#ffffff',              // Card background color
    cardSecondary: '#f8fafc',     // Secondary card background
    inputBackground: '#ffffff',    // Input field background
    inputBorder: '#d1d5db',       // Input border color
    switchTrack: '#e5e7eb',       // Switch component track color
    switchThumb: '#ffffff',       // Switch component thumb color
    shadow: 'rgba(0, 0, 0, 0.1)', // Default shadow color
    shadowDark: 'rgba(0, 0, 0, 0.2)', // Darker shadow for emphasis
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay color for modals
    highlight: '#eff6ff',         // Highlight color for selections
    highlightSecondary: '#fef3c7', // Secondary highlight color
  },
  
  /**
   * DARK THEME
   * Dark color scheme for low-light environments and user preference
   */
  dark: {
    name: 'Dark',
    primary: '#3b82f6',           // Adjusted primary for dark backgrounds
    primaryLight: '#60a5fa',      // Lighter primary variant
    primaryDark: '#2563eb',       // Darker primary variant
    secondary: '#fbbf24',         // Adjusted secondary for dark backgrounds
    secondaryLight: '#fcd34d',    // Lighter secondary variant
    secondaryDark: '#f59e0b',     // Darker secondary variant
    background: '#0f172a',        // Dark main background
    backgroundSecondary: '#1e293b', // Dark secondary background
    backgroundTertiary: '#334155',  // Dark tertiary background
    surface: '#1e293b',            // Dark surface color
    textPrimary: '#f8fafc',       // Light text for dark backgrounds
    textSecondary: '#cbd5e1',     // Secondary light text
    textTertiary: '#94a3b8',      // Tertiary light text
    success: '#22c55e',           // Adjusted success for dark theme
    successLight: '#4ade80',      // Light success variant
    successDark: '#16a34a',       // Dark success variant
    warning: '#fbbf24',           // Adjusted warning for dark theme
    warningLight: '#fcd34d',      // Light warning variant
    warningDark: '#f59e0b',       // Dark warning variant
    error: '#f87171',             // Adjusted error for dark theme
    errorLight: '#fca5a5',        // Light error variant
    errorDark: '#ef4444',         // Dark error variant
    border: '#334155',            // Dark border color
    borderLight: '#475569',       // Light dark border
    card: '#1e293b',              // Dark card background
    cardSecondary: '#334155',     // Dark secondary card
    inputBackground: '#334155',    // Dark input background
    inputBorder: '#475569',       // Dark input border
    switchTrack: '#475569',       // Dark switch track
    switchThumb: '#3b82f6',       // Dark switch thumb
    shadow: 'rgba(0, 0, 0, 0.3)', // Dark theme shadow
    shadowDark: 'rgba(0, 0, 0, 0.5)', // Dark theme dark shadow
    overlay: 'rgba(0, 0, 0, 0.7)', // Dark theme overlay
    highlight: '#1e3a8a',         // Dark theme highlight
    highlightSecondary: '#92400e', // Dark theme secondary highlight
  },
  
  /**
   * BLUE THEME
   * Blue-tinted color scheme for a professional, corporate look
   */
  blue: {
    name: 'Blue',
    primary: '#1e40af',           // Deep blue primary
    primaryLight: '#3b82f6',      // Lighter blue variant
    primaryDark: '#1e3a8a',       // Darker blue variant
    secondary: '#0ea5e9',         // Sky blue secondary
    secondaryLight: '#38bdf8',    // Light sky blue
    secondaryDark: '#0284c7',     // Dark sky blue
    background: '#f0f9ff',        // Very light blue background
    backgroundSecondary: '#e0f2fe', // Light blue secondary background
    backgroundTertiary: '#bae6fd',  // Medium light blue background
    surface: '#ffffff',            // White surface
    textPrimary: '#0c4a6e',       // Dark blue text
    textSecondary: '#0369a1',     // Medium blue text
    textTertiary: '#0284c7',      // Light blue text
    success: '#059669',            // Green success
    successLight: '#10b981',       // Light green success
    successDark: '#047857',        // Dark green success
    warning: '#d97706',            // Orange warning
    warningLight: '#f59e0b',       // Light orange warning
    warningDark: '#b45309',        // Dark orange warning
    error: '#dc2626',              // Red error
    errorLight: '#ef4444',         // Light red error
    errorDark: '#b91c1c',          // Dark red error
    border: '#bae6fd',             // Light blue border
    borderLight: '#e0f2fe',        // Very light blue border
    card: '#ffffff',               // White card
    cardSecondary: '#f0f9ff',      // Light blue card
    inputBackground: '#ffffff',     // White input background
    inputBorder: '#bae6fd',        // Light blue input border
    switchTrack: '#bae6fd',        // Light blue switch track
    switchThumb: '#ffffff',        // White switch thumb
    shadow: 'rgba(30, 64, 175, 0.1)', // Blue-tinted shadow
    shadowDark: 'rgba(30, 64, 175, 0.2)', // Blue-tinted dark shadow
    overlay: 'rgba(30, 64, 175, 0.5)', // Blue-tinted overlay
    highlight: '#dbeafe',          // Light blue highlight
    highlightSecondary: '#fef3c7', // Yellow highlight
  },
  
  /**
   * GREEN THEME
   * Green-tinted color scheme for nature, growth, and eco-friendly apps
   */
  green: {
    name: 'Green',
    primary: '#059669',            // Deep green primary
    primaryLight: '#10b981',       // Lighter green variant
    primaryDark: '#047857',        // Darker green variant
    secondary: '#84cc16',          // Lime green secondary
    secondaryLight: '#a3e635',     // Light lime green
    secondaryDark: '#65a30d',      // Dark lime green
    background: '#f0fdf4',         // Very light green background
    backgroundSecondary: '#dcfce7', // Light green secondary background
    backgroundTertiary: '#bbf7d0',  // Medium light green background
    surface: '#ffffff',             // White surface
    textPrimary: '#064e3b',        // Dark green text
    textSecondary: '#065f46',      // Medium green text
    textTertiary: '#047857',       // Light green text
    success: '#16a34a',            // Green success
    successLight: '#22c55e',       // Light green success
    successDark: '#15803d',        // Dark green success
    warning: '#d97706',            // Orange warning
    warningLight: '#f59e0b',       // Light orange warning
    warningDark: '#b45309',        // Dark orange warning
    error: '#dc2626',              // Red error
    errorLight: '#ef4444',         // Light red error
    errorDark: '#b91c1c',          // Dark red error
    border: '#bbf7d0',             // Light green border
    borderLight: '#dcfce7',        // Very light green border
    card: '#ffffff',               // White card
    cardSecondary: '#f0fdf4',      // Light green card
    inputBackground: '#ffffff',     // White input background
    inputBorder: '#bbf7d0',        // Light green input border
    switchTrack: '#bbf7d0',        // Light green switch track
    switchThumb: '#ffffff',        // White switch thumb
    shadow: 'rgba(5, 150, 105, 0.1)', // Green-tinted shadow
    shadowDark: 'rgba(5, 150, 105, 0.2)', // Green-tinted dark shadow
    overlay: 'rgba(5, 150, 105, 0.5)', // Green-tinted overlay
    highlight: '#dcfce7',          // Light green highlight
    highlightSecondary: '#fef3c7', // Yellow highlight
  },
  
  /**
   * PURPLE THEME
   * Purple-tinted color scheme for creative, artistic, and luxury apps
   */
  purple: {
    name: 'Purple',
    primary: '#7c3aed',            // Deep purple primary
    primaryLight: '#a855f7',       // Lighter purple variant
    primaryDark: '#6d28d9',        // Darker purple variant
    secondary: '#ec4899',          // Pink secondary
    secondaryLight: '#f472b6',     // Light pink
    secondaryDark: '#db2777',      // Dark pink
    background: '#faf5ff',         // Very light purple background
    backgroundSecondary: '#f3e8ff', // Light purple secondary background
    backgroundTertiary: '#e9d5ff',  // Medium light purple background
    surface: '#ffffff',             // White surface
    textPrimary: '#4c1d95',        // Dark purple text
    textSecondary: '#5b21b6',      // Medium purple text
    textTertiary: '#6d28d9',       // Light purple text
    success: '#059669',             // Green success
    successLight: '#10b981',        // Light green success
    successDark: '#047857',         // Dark green success
    warning: '#d97706',             // Orange warning
    warningLight: '#f59e0b',        // Light orange warning
    warningDark: '#b45309',         // Dark orange warning
    error: '#dc2626',               // Red error
    errorLight: '#ef4444',          // Light red error
    errorDark: '#b91c1c',           // Dark red error
    border: '#e9d5ff',              // Light purple border
    borderLight: '#f3e8ff',         // Very light purple border
    card: '#ffffff',                // White card
    cardSecondary: '#faf5ff',       // Light purple card
    inputBackground: '#ffffff',      // White input background
    inputBorder: '#e9d5ff',         // Light purple input border
    switchTrack: '#e9d5ff',         // Light purple switch track
    switchThumb: '#ffffff',         // White switch thumb
    shadow: 'rgba(124, 58, 237, 0.1)', // Purple-tinted shadow
    shadowDark: 'rgba(124, 58, 237, 0.2)', // Purple-tinted dark shadow
    overlay: 'rgba(124, 58, 237, 0.5)', // Purple-tinted overlay
    highlight: '#f3e8ff',           // Light purple highlight
    highlightSecondary: '#fef3c7',  // Yellow highlight
  }
};

/**
 * THEME CONTEXT CREATION
 * Creates a React context for sharing theme data across components
 */
const ThemeContext = createContext();

/**
 * USE THEME HOOK
 * Custom hook that provides access to theme context with safety checks
 * and fallback colors if the theme system isn't fully initialized
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  /**
   * SAFETY CHECK WITH FALLBACK
   * Ensures colors are always available, falls back to light theme if not
   * This prevents crashes during theme initialization
   */
  if (!context.colors) {
    console.warn('Theme colors not initialized, using fallback colors');
    return {
      ...context,
      colors: themes.light
    };
  }
  
  return context;
};

/**
 * THEME PROVIDER COMPONENT
 * Main provider that manages theme state, persistence, and provides
 * theme data to all child components in the app
 */
export const ThemeProvider = ({ children }) => {
  // Theme state management
  const [currentTheme, setCurrentTheme] = useState('light');        // Current active theme
  const [colors, setColors] = useState(themes.light);              // Current theme colors
  const [isInitialized, setIsInitialized] = useState(false);       // Theme system ready flag
  const [isSystemTheme, setIsSystemTheme] = useState(false);       // System theme preference flag

  /**
   * INITIALIZATION EFFECT
   * Loads saved theme preference from storage when the app starts
   */
  useEffect(() => {
    loadThemePreference();
  }, []);

  /**
   * THEME CHANGE EFFECT
   * Updates colors when theme changes and marks system as initialized
   */
  useEffect(() => {
    const newColors = themes[currentTheme] || themes.light;
    setColors(newColors);
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [currentTheme, isInitialized]);

  /**
   * LOAD THEME PREFERENCE
   * Retrieves saved theme settings from AsyncStorage
   * Handles system theme preference and fallback to default
   */
  const loadThemePreference = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedSystemTheme = await AsyncStorage.getItem('systemTheme');
      
      if (savedSystemTheme === 'true') {
        // Use system theme if user has enabled it
        setIsSystemTheme(true);
        const systemTheme = getSystemTheme();
        setCurrentTheme(systemTheme);
      } else if (savedTheme && themes[savedTheme]) {
        // Use saved user preference
        setCurrentTheme(savedTheme);
        setIsSystemTheme(false);
      } else {
        // Default to light theme if no preference saved
        setCurrentTheme('light');
        setIsSystemTheme(false);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to light theme on error
      setCurrentTheme('light');
      setIsSystemTheme(false);
    }
  }, []);

  /**
   * GET SYSTEM THEME
   * Determines the system's current theme preference
   * Note: Would need react-native-appearance for full implementation
   */
  const getSystemTheme = useCallback(() => {
    // This would need to be implemented with react-native-appearance
    // For now, we'll default to light
    return 'light';
  }, []);

  /**
   * TOGGLE THEME
   * Switches between light and dark themes
   * Saves preference to storage and disables system theme
   */
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

  /**
   * SET SPECIFIC THEME
   * Sets a specific theme by name with validation
   * Saves preference and disables system theme
   */
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

  /**
   * TOGGLE SYSTEM THEME
   * Enables/disables automatic theme switching based on system preference
   */
  const toggleSystemTheme = useCallback(async () => {
    try {
      const newSystemTheme = !isSystemTheme;
      setIsSystemTheme(newSystemTheme);
      
      if (newSystemTheme) {
        // Enable system theme and use current system preference
        const systemTheme = getSystemTheme();
        setCurrentTheme(systemTheme);
        await AsyncStorage.setItem('systemTheme', 'true');
      } else {
        // Disable system theme
        await AsyncStorage.setItem('systemTheme', 'false');
      }
    } catch (error) {
      console.error('Error toggling system theme:', error);
    }
  }, [isSystemTheme, getSystemTheme]);

  /**
   * GET AVAILABLE THEMES
   * Returns list of all available themes with active state
   */
  const availableThemes = useMemo(() => {
    return Object.keys(themes).map(key => ({
      key,
      name: themes[key].name,
      isActive: key === currentTheme
    }));
  }, [currentTheme]);

  /**
   * GET THEME INFO
   * Returns comprehensive information about current theme state
   */
  const getThemeInfo = useCallback(() => {
    return {
      current: currentTheme,
      name: themes[currentTheme]?.name || 'Light',
      isSystem: isSystemTheme,
      available: availableThemes
    };
  }, [currentTheme, isSystemTheme, availableThemes]);

  /**
   * GET COLOR WITH FALLBACK
   * Safely retrieves a color value with fallback if not found
   */
  const getColor = useCallback((colorKey, fallback = '#000000') => {
    return colors[colorKey] || fallback;
  }, [colors]);

  /**
   * GET CONTRAST COLOR
   * Calculates appropriate text color for a given background
   * Uses simple brightness calculation for accessibility
   */
  const getContrastColor = useCallback((backgroundColor) => {
    // Simple contrast calculation based on brightness
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }, []);

  /**
   * THEME TYPE CHECKS
   * Convenience methods to check current theme type
   */
  const isDark = useMemo(() => currentTheme === 'dark', [currentTheme]);
  const isLight = useMemo(() => currentTheme === 'light', [currentTheme]);

  /**
   * CONTEXT VALUE
   * All theme data and functions provided to consuming components
   */
  const value = {
    // Theme state
    currentTheme,        // Current theme name
    colors,              // Current theme color palette
    isInitialized,       // Theme system ready flag
    isSystemTheme,       // System theme enabled flag
    isDark,             // Dark theme check
    isLight,            // Light theme check
    
    // Theme actions
    toggleTheme,         // Switch between light/dark
    setTheme,            // Set specific theme
    toggleSystemTheme,   // Enable/disable system theme
    
    // Theme utilities
    availableThemes,     // List of all themes
    getThemeInfo,        // Comprehensive theme info
    getColor,            // Safe color retrieval
    getContrastColor,    // Contrast calculation
    
    // Legacy support
    isDarkMode: isDark,  // Backward compatibility
  };

  /**
   * PROVIDER RENDER
   * Wraps children with theme context
   */
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
