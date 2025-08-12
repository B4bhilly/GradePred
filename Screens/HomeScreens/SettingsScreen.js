import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { typography, spacing, borderRadius } from '../../designSystem';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, clearAuth } = useAuth();
  const { isDarkMode, toggleTheme, colors: themeColors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all your data and log you out. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: clearAuth,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Settings</Text>
      </View>

      {/* User Info Section */}
      <View style={[styles.userSection, { borderBottomColor: themeColors.border }]}>
        <View style={[styles.userAvatar, { backgroundColor: themeColors.primary }]}>
          <Text style={[styles.userInitial, { color: themeColors.background }]}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: themeColors.textPrimary }]}>{user?.username || 'User'}</Text>
          <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Dark Mode Toggle */}
        <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <Feather 
              name={isDarkMode ? "sun" : "moon"} 
              size={20} 
              color={isDarkMode ? themeColors.warning : themeColors.textPrimary} 
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Text>
            <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
              {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: themeColors.switchTrack, true: themeColors.primaryLight }}
            thumbColor={isDarkMode ? themeColors.switchThumb : themeColors.background}
            ios_backgroundColor={themeColors.switchTrack}
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]} onPress={() => navigation.navigate('About')}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <AntDesign name="infocirlceo" size={20} color={themeColors.textPrimary} />
          </View>
          <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>About App</Text>
          <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]} onPress={() => navigation.navigate('Feedback')}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <AntDesign name="questioncircleo" size={20} color={themeColors.textPrimary} />
          </View>
          <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>Feedback & Support</Text>
          <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]} onPress={() => navigation.navigate('Rate')}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <Feather name="star" size={20} color={themeColors.textPrimary} />
          </View>
          <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>Rate App</Text>
          <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]} onPress={() => navigation.navigate('Share')}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <SimpleLineIcons name="share-alt" size={20} color={themeColors.textPrimary} />
          </View>
          <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>Share App</Text>
          <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        {/* Logout Section */}
        <View style={[styles.logoutSection, { borderTopColor: themeColors.border }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={[styles.logoutIconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
              <Ionicons name="log-out-outline" size={20} color={themeColors.error} />
            </View>
            <Text style={[styles.logoutText, { color: themeColors.error }]}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearDataButton} onPress={handleClearData}>
            <View style={[styles.clearDataIconContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
              <Ionicons name="trash-outline" size={20} color={themeColors.error} />
            </View>
            <Text style={[styles.clearDataText, { color: themeColors.error }]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  headerTitle: {
    flex: 0.8,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInitial: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.sm,
    fontWeight: typography.normal,
  },
  logoutSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  logoutIconContainer: {
    height: 40,
    width: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoutText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  clearDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  clearDataIconContainer: {
    height: 40,
    width: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  clearDataText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
});
