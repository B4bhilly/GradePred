import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { typography, spacing, borderRadius } from '../../designSystem';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');

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

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'user',
          iconType: 'Feather',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          action: 'navigate',
          screen: 'ProfileEdit',
          color: '#3B82F6'
        },
        {
          icon: 'shield',
          iconType: 'Feather',
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          action: 'navigate',
          screen: 'Privacy',
          color: '#10B981'
        },
        {
          icon: 'bell',
          iconType: 'Feather',
          title: 'Notifications',
          subtitle: 'Customize your notifications',
          action: 'navigate',
          screen: 'Notifications',
          color: '#F59E0B'
        }
      ]
    },
    {
      title: 'App',
      items: [
        {
          icon: 'moon',
          iconType: 'Feather',
          title: 'Dark Mode',
          subtitle: isDarkMode ? 'Light theme' : 'Dark theme',
          action: 'toggle',
          value: isDarkMode,
          onToggle: toggleTheme,
          color: isDarkMode ? '#F59E0B' : '#6B7280'
        },
        {
          icon: 'language',
          iconType: 'Feather',
          title: 'Language',
          subtitle: 'English (US)',
          action: 'navigate',
          screen: 'Language',
          color: '#8B5CF6'
        },
        {
          icon: 'smartphone',
          iconType: 'Feather',
          title: 'App Version',
          subtitle: '1.0.0',
          action: 'none',
          color: '#6B7280'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'infocirlceo',
          iconType: 'AntDesign',
          title: 'About App',
          subtitle: 'Learn more about Grade Predictor',
          action: 'navigate',
          screen: 'About',
          color: '#3B82F6'
        },
        {
          icon: 'questioncircleo',
          iconType: 'AntDesign',
          title: 'Feedback & Support',
          subtitle: 'Get help and send feedback',
          action: 'navigate',
          screen: 'Feedback',
          color: '#10B981'
        },
        {
          icon: 'star',
          iconType: 'Feather',
          title: 'Rate App',
          subtitle: 'Rate us on the App Store',
          action: 'navigate',
          screen: 'Rate',
          color: '#F59E0B'
        },
        {
          icon: 'share-alt',
          iconType: 'SimpleLineIcons',
          title: 'Share App',
          subtitle: 'Share with friends and family',
          action: 'navigate',
          screen: 'Share',
          color: '#8B5CF6'
        }
      ]
    }
  ];

  const renderIcon = (icon, iconType, color) => {
    const iconProps = { size: 20, color: color };
    
    switch (iconType) {
      case 'Feather':
        return <Feather name={icon} {...iconProps} />;
      case 'AntDesign':
        return <AntDesign name={icon} {...iconProps} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={icon} {...iconProps} />;
      case 'Ionicons':
        return <Ionicons name={icon} {...iconProps} />;
      default:
        return <Feather name={icon} {...iconProps} />;
    }
  };

  const handleItemPress = (item) => {
    if (item.action === 'navigate' && item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
          Customize your experience
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced User Profile Section */}
        <View style={[styles.userSection, { backgroundColor: themeColors.backgroundSecondary }]}>
          <TouchableOpacity 
            style={styles.userProfileContainer}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <View style={[styles.userAvatar, { backgroundColor: themeColors.primary }]}>
              <Text style={[styles.userInitial, { color: themeColors.background }]}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: themeColors.textPrimary }]}>
                {user?.username || 'User'}
              </Text>
              <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>
                {user?.email || 'user@example.com'}
              </Text>
              <View style={styles.editProfileButton}>
                <Text style={[styles.editProfileText, { color: themeColors.primary }]}>
                  Edit Profile
                </Text>
                <AntDesign name="arrowright" size={16} color={themeColors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              {section.title}
            </Text>
            
            <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && { 
                      borderBottomColor: themeColors.border,
                      borderBottomWidth: 1 
                    }
                  ]}
                  onPress={() => handleItemPress(item)}
                  disabled={item.action === 'none'}
                >
                  <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                    {renderIcon(item.icon, item.iconType, item.color)}
                  </View>
                  
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: themeColors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>

                  {item.action === 'toggle' ? (
                    <Switch
                      trackColor={{ false: themeColors.switchTrack, true: item.color + '40' }}
                      thumbColor={item.value ? item.color : themeColors.background}
                      ios_backgroundColor={themeColors.switchTrack}
                      onValueChange={item.onToggle}
                      value={item.value}
                    />
                  ) : item.action !== 'none' ? (
                    <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              { icon: 'download', title: 'Export Data', color: '#10B981' },
              { icon: 'upload', title: 'Import Data', color: '#3B82F6' },
              { icon: 'refresh-cw', title: 'Sync', color: '#F59E0B' },
              { icon: 'help-circle', title: 'Help', color: '#8B5CF6' }
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Feather name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Account Actions</Text>
          
          <View style={[styles.accountActionsContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <TouchableOpacity 
              style={[styles.accountAction, { borderBottomColor: themeColors.border }]} 
              onPress={handleLogout}
            >
              <View style={[styles.accountActionIcon, { backgroundColor: '#EF4444' + '20' }]}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              </View>
              <View style={styles.accountActionContent}>
                <Text style={[styles.accountActionTitle, { color: themeColors.textPrimary }]}>Logout</Text>
                <Text style={[styles.accountActionSubtitle, { color: themeColors.textSecondary }]}>
                  Sign out of your account
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.accountAction} 
              onPress={handleClearData}
            >
              <View style={[styles.accountActionIcon, { backgroundColor: '#EF4444' + '20' }]}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <View style={styles.accountActionContent}>
                <Text style={[styles.accountActionTitle, { color: '#EF4444' }]}>Delete Account</Text>
                <Text style={[styles.accountActionSubtitle, { color: themeColors.textSecondary }]}>
                  Permanently delete your account and data
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Grade Predictor v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Made with ❤️ for students
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.base,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  userSection: {
    marginVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  userInitial: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.base,
    marginBottom: spacing.sm,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginRight: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  sectionContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: typography.sm,
    lineHeight: 18,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    width: (width - spacing.lg * 3) / 2,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  accountActionsContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  accountActionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  accountActionContent: {
    flex: 1,
  },
  accountActionTitle: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  accountActionSubtitle: {
    fontSize: typography.sm,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
