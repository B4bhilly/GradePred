import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, Feather, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../designSystem';
import { useAuth } from '../../AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, clearAuth } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={toggleSwitch} style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Feather name="moon" size={20} color={colors.textPrimary} />
          </View>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isEnabled ? colors.background : colors.background}
            ios_backgroundColor={colors.border}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('About')}>
          <View style={styles.iconContainer}>
            <AntDesign name="infocirlceo" size={20} color={colors.textPrimary} />
          </View>
          <Text style={styles.settingLabel}>About App</Text>
          <AntDesign name="arrowright" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Feedback')}>
          <View style={styles.iconContainer}>
            <AntDesign name="questioncircleo" size={20} color={colors.textPrimary} />
          </View>
          <Text style={styles.settingLabel}>Feedback & Support</Text>
          <AntDesign name="arrowright" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Rate')}>
          <View style={styles.iconContainer}>
            <Feather name="star" size={20} color={colors.textPrimary} />
          </View>
          <Text style={styles.settingLabel}>Rate App</Text>
          <AntDesign name="arrowright" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Share')}>
          <View style={styles.iconContainer}>
            <SimpleLineIcons name="share-alt" size={20} color={colors.textPrimary} />
          </View>
          <Text style={styles.settingLabel}>Share App</Text>
          <AntDesign name="arrowright" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearDataButton} onPress={handleClearData}>
            <View style={styles.clearDataIconContainer}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </View>
            <Text style={styles.clearDataText}>Clear All Data</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInitial: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.background,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sm,
    color: colors.textSecondary,
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
    borderBottomColor: colors.border,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.textPrimary,
  },
  logoutSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoutText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.error,
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
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  clearDataText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.error,
  },
});
