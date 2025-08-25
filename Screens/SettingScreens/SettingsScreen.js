import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { typography, spacing, borderRadius } from '../../components/designSystem';
import { useAuth } from '../../components/AuthContext';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const { user, logout, clearAuth } = useAuth();
  const { isDarkMode, toggleTheme, colors: themeColors, isInitialized } = useTheme();
  
  // Language handling
  const [currentLanguage, setCurrentLanguage] = useState('English (US)');
  
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
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all your data and log you out. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Data', style: 'destructive', onPress: clearAuth }
      ]
    );
  };

  // Language handling
  const handleLanguageChange = () => {
    Alert.alert(
      'Language',
      'Select your preferred language',
      [
        { text: 'English (US)', onPress: () => setCurrentLanguage('English (US)') },
        { text: 'Spanish', onPress: () => setCurrentLanguage('Spanish') },
        { text: 'French', onPress: () => setCurrentLanguage('French') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // App rating handling
  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Would you like to rate Grade Predictor?',
      [
        { text: 'Rate Now', onPress: () => {
          Alert.alert('Thank You!', 'Rating feature will be implemented soon.');
        }},
        { text: 'Maybe Later', style: 'cancel' }
      ]
    );
  };

  // Share app handling
  const handleShareApp = () => {
    Alert.alert(
      'Share App',
      'Share Grade Predictor with friends and family',
      [
        { text: 'Share', onPress: () => {
          Alert.alert('Share', 'Share feature will be implemented soon.');
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Export data handling
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your data to a file',
      [
        { text: 'Export', onPress: () => {
          Alert.alert('Export', 'Export feature will be implemented soon.');
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Import data handling
  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Import data from a file',
      [
        { text: 'Import', onPress: () => {
          Alert.alert('Import', 'Import feature will be implemented soon.');
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Sync handling
  const handleSync = () => {
    Alert.alert(
      'Sync',
      'Sync your data with the cloud',
      [
        { text: 'Sync Now', onPress: () => {
          Alert.alert('Sync', 'Sync feature will be implemented soon.');
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Help handling
  const handleHelp = () => {
    Alert.alert(
      'Help',
      'Get help and support',
      [
        { text: 'View Help', onPress: () => {
          Alert.alert('Help', 'Help feature will be implemented soon.');
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
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
          iconType: 'FontAwesome5',
          title: 'Language',
          subtitle: currentLanguage,
          action: 'custom',
          onPress: handleLanguageChange,
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
          icon: 'info-circle',
          iconType: 'AntDesign',
          title: 'About App',
          subtitle: 'Learn more about Grade Predictor',
          action: 'navigate',
          screen: 'About',
          color: '#3B82F6'
        },
        {
          icon: 'feedback',
          iconType: 'MaterialIcons',
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
          action: 'custom',
          onPress: handleRateApp,
          color: '#F59E0B'
        },
        {
          icon: 'share-variant',
          iconType: 'MaterialCommunityIcons',
          title: 'Share App',
          subtitle: 'Share with friends and family',
          action: 'custom',
          onPress: handleShareApp,
          color: '#8B5CF6'
        }
      ]
    }
  ];

  const renderIcon = (icon, iconType, color) => {
    const iconProps = { size: 20, color: color || '#6B7280' };
    
    switch (iconType) {
      case 'Feather':
        return <Feather name={icon} {...iconProps} />;
      case 'AntDesign':
        return <AntDesign name={icon} {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon} {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={icon} {...iconProps} />;
      case 'Ionicons':
        return <Ionicons name={icon} {...iconProps} />;
      default:
        return <Feather name={icon} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon} {...iconProps} />;
    }
  };

  const handleItemPress = (item) => {
    if (item.action === 'navigate' && item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action === 'custom' && item.onPress) {
      item.onPress();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Simple Header */}
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={[styles.userSection, { backgroundColor: themeColors.backgroundSecondary }]}>
          <TouchableOpacity 
            style={styles.userProfileContainer}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <View style={[styles.userAvatar, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.userInitial}>
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
                <Text style={[styles.editProfileText, { color: themeColors.primary }]}>Edit Profile</Text>
                <AntDesign name="arrowright" size={16} color={themeColors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{section.title}</Text>
            
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
                    <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.settingSubtitle, { color: themeColors.textSecondary }]}>{item.subtitle}</Text>
                  </View>

                  {item.action === 'toggle' ? (
                    <Switch
                      trackColor={{ false: themeColors.border, true: item.color + '40' }}
                      thumbColor={item.value ? item.color : themeColors.background}
                      ios_backgroundColor={themeColors.border}
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
              { icon: 'download', title: 'Export Data', color: '#10B981', onPress: handleExportData },
              { icon: 'upload', title: 'Import Data', color: '#3B82F6', onPress: handleImportData },
              { icon: 'refresh-cw', title: 'Sync', color: '#F59E0B', onPress: handleSync },
              { icon: 'help-circle', title: 'Help', color: '#8B5CF6', onPress: handleHelp }
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Feather name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>{action.title}</Text>
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
                <Text style={[styles.accountActionSubtitle, { color: themeColors.textSecondary }]}>Sign out of your account</Text>
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
                <Text style={[styles.accountActionSubtitle, { color: themeColors.textSecondary }]}>Permanently delete your account and data</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>Grade Predictor</Text>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>Made with ❤️ for students</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['1xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    textAlign: 'center',
    right : 20,
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
    color: '#ffffff',
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
