import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { typography, spacing, borderRadius } from '../../designSystem';
import { useTheme } from '../../ThemeContext';

const PrivacyScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    gradesVisible: false,
    analyticsVisible: true,
    locationVisible: false,
    searchable: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    biometricAuth: false,
    twoFactorAuth: false,
    sessionTimeout: true,
    autoLock: true,
  });
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const updatePrivacySetting = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSecuritySetting = (key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    Alert.alert('Change Password', 'Change password functionality would go here');
  };

  const handleDataExport = () => {
    Alert.alert('Export Data', 'Data export functionality would go here');
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Delete Data',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Privacy & Security</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Privacy Section */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Privacy Settings</Text>
          
          <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            {Object.entries(privacySettings).map(([key, value]) => (
              <View key={key} style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                <View style={styles.settingContent}>
                  <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
                    <Feather 
                      name={
                        key === 'profileVisible' ? 'eye' :
                        key === 'gradesVisible' ? 'book' :
                        key === 'analyticsVisible' ? 'bar-chart-2' :
                        key === 'locationVisible' ? 'map-pin' :
                        'search'
                      } 
                      size={20} 
                      color={themeColors.primary} 
                    />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                      {key === 'profileVisible' ? 'Profile Visibility' :
                       key === 'gradesVisible' ? 'Grades Privacy' :
                       key === 'analyticsVisible' ? 'Analytics Sharing' :
                       key === 'locationVisible' ? 'Location Sharing' :
                       'Searchable Profile'}
                    </Text>
                    <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                      {key === 'profileVisible' ? 'Make your profile visible to other users' :
                       key === 'gradesVisible' ? 'Allow others to see your grades' :
                       key === 'analyticsVisible' ? 'Share analytics data for research' :
                       key === 'locationVisible' ? 'Share your location with the app' :
                       'Allow others to find your profile'}
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: themeColors.switchTrack, true: themeColors.primaryLight }}
                  thumbColor={value ? themeColors.primary : themeColors.background}
                  onValueChange={(newValue) => updatePrivacySetting(key, newValue)}
                  value={value}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Security Section */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Security Settings</Text>
          
          <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            {Object.entries(securitySettings).map(([key, value]) => (
              <View key={key} style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                <View style={styles.settingContent}>
                  <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
                    <Feather 
                      name={
                        key === 'biometricAuth' ? 'fingerprint' :
                        key === 'twoFactorAuth' ? 'shield' :
                        key === 'sessionTimeout' ? 'clock' :
                        'lock'
                      } 
                      size={20} 
                      color={themeColors.primary} 
                    />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                      {key === 'biometricAuth' ? 'Biometric Authentication' :
                       key === 'twoFactorAuth' ? 'Two-Factor Authentication' :
                       key === 'sessionTimeout' ? 'Session Timeout' :
                       'Auto-Lock App'}
                    </Text>
                    <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                      {key === 'biometricAuth' ? 'Use fingerprint or face ID to unlock' :
                       key === 'twoFactorAuth' ? 'Add an extra layer of security' :
                       key === 'sessionTimeout' ? 'Automatically log out after inactivity' :
                       'Lock app when switching to other apps'}
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: themeColors.switchTrack, true: themeColors.primaryLight }}
                  thumbColor={value ? themeColors.primary : themeColors.background}
                  onValueChange={(newValue) => updateSecuritySetting(key, newValue)}
                  value={value}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Account Security Actions */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Account Security</Text>
          
          <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <TouchableOpacity 
              style={[styles.actionItem, { borderBottomColor: themeColors.border }]}
              onPress={handleChangePassword}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' + '20' }]}>
                <Feather name="key" size={24} color="#3B82F6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: themeColors.textPrimary }]}>Change Password</Text>
                <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                  Update your account password
                </Text>
              </View>
              <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionItem, { borderBottomColor: themeColors.border }]}
              onPress={handleDataExport}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10B981' + '20' }]}>
                <Feather name="download" size={24} color="#10B981" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: themeColors.textPrimary }]}>Export Data</Text>
                <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                  Download a copy of your data
                </Text>
              </View>
              <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionItem}
              onPress={handleDataDeletion}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EF4444' + '20' }]}>
                <Feather name="trash-2" size={24} color="#EF4444" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: '#EF4444' }]}>Delete All Data</Text>
                <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                  Permanently remove all your data
                </Text>
              </View>
              <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Policy & Terms */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Legal & Information</Text>
          
          <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <TouchableOpacity style={[styles.legalItem, { borderBottomColor: themeColors.border }]}>
              <View style={[styles.legalIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="file-text" size={20} color={themeColors.primary} />
              </View>
              <Text style={[styles.legalText, { color: themeColors.textPrimary }]}>Privacy Policy</Text>
              <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.legalItem, { borderBottomColor: themeColors.border }]}>
              <View style={[styles.legalIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="file-text" size={20} color={themeColors.primary} />
              </View>
              <Text style={[styles.legalText, { color: themeColors.textPrimary }]}>Terms of Service</Text>
              <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.legalItem}>
              <View style={[styles.legalIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="info" size={20} color={themeColors.primary} />
              </View>
              <Text style={[styles.legalText, { color: themeColors.textPrimary }]}>Data Usage Information</Text>
              <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
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
    flex: 1,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    textAlign: 'center',
    marginRight: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
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
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.sm,
    lineHeight: 18,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: typography.sm,
    lineHeight: 18,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  legalIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  legalText: {
    flex: 1,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
});
