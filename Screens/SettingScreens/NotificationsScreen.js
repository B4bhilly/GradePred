import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { typography, spacing, borderRadius } from '../../components/designSystem';
import { useTheme } from '../../ThemeContext';

const NotificationsScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    gradeUpdates: true,
    assignmentReminders: true,
    studyReminders: true,
    insights: false,
    appUpdates: true,
    marketing: false,
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  });
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const updateNotificationSetting = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateQuietHours = (key, value) => {
    setQuietHours(prev => ({ ...prev, [key]: value }));
  };

  const notificationCategories = [
    {
      title: 'Academic',
      items: [
        { key: 'gradeUpdates', label: 'Grade Updates', description: 'Get notified when grades are posted', icon: 'book' },
        { key: 'assignmentReminders', label: 'Assignment Reminders', description: 'Reminders for upcoming deadlines', icon: 'calendar' },
        { key: 'studyReminders', label: 'Study Reminders', description: 'Daily study session reminders', icon: 'clock' },
      ]
    },
    {
      title: 'App & Insights',
      items: [
        { key: 'insights', label: 'Academic Insights', description: 'Weekly performance insights', icon: 'trending-up' },
        { key: 'appUpdates', label: 'App Updates', description: 'New features and improvements', icon: 'smartphone' },
      ]
    },
    {
      title: 'Communication',
      items: [
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications on your device', icon: 'bell' },
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email', icon: 'mail' },
        { key: 'marketing', label: 'Marketing & News', description: 'Updates about new features and tips', icon: 'megaphone' },
      ]
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Notifications</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}
              onPress={() => {
                const allEnabled = Object.values(notificationSettings).every(v => v);
                const newSettings = Object.keys(notificationSettings).reduce((acc, key) => {
                  acc[key] = !allEnabled;
                  return acc;
                }, {});
                setNotificationSettings(newSettings);
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="check-square" size={24} color={themeColors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>
                {Object.values(notificationSettings).every(v => v) ? 'Disable All' : 'Enable All'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}
              onPress={() => updateQuietHours('enabled', !quietHours.enabled)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: quietHours.enabled ? themeColors.primaryLight : themeColors.backgroundSecondary }]}>
                <Feather name="moon" size={24} color={quietHours.enabled ? themeColors.primary : themeColors.textSecondary} />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>
                Quiet Hours
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Categories */}
        {notificationCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={[styles.section, { borderBottomColor: themeColors.border }]}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              {category.title}
            </Text>
            
            <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
              {category.items.map((item, itemIndex) => (
                <View key={item.key} style={[
                  styles.settingItem,
                  itemIndex < category.items.length - 1 && { 
                    borderBottomColor: themeColors.border,
                    borderBottomWidth: 1 
                  }
                ]}>
                  <View style={styles.settingContent}>
                    <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
                      <Feather name={item.icon} size={20} color={themeColors.primary} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    trackColor={{ false: themeColors.switchTrack, true: themeColors.primaryLight }}
                    thumbColor={notificationSettings[item.key] ? themeColors.primary : themeColors.background}
                    onValueChange={(value) => updateNotificationSetting(item.key, value)}
                    value={notificationSettings[item.key]}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Quiet Hours Settings */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Quiet Hours</Text>
          
          <View style={[styles.sectionContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <Feather name="moon" size={20} color={themeColors.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                    Enable Quiet Hours
                  </Text>
                  <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                    Mute notifications during specified hours
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: themeColors.switchTrack, true: themeColors.primaryLight }}
                thumbColor={quietHours.enabled ? themeColors.primary : themeColors.background}
                onValueChange={(value) => updateQuietHours('enabled', value)}
                value={quietHours.enabled}
              />
            </View>

            {quietHours.enabled && (
              <>
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingContent}>
                    <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
                      <Feather name="sunset" size={20} color={themeColors.primary} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                        Start Time
                      </Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                        {quietHours.startTime}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.timeButton}>
                    <Text style={[styles.timeButtonText, { color: themeColors.primary }]}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
                      <Feather name="sunrise" size={20} color={themeColors.primary} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                        End Time
                      </Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                        {quietHours.endTime}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.timeButton}>
                    <Text style={[styles.timeButtonText, { color: themeColors.primary }]}>Change</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Notification Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Preview</Text>
          
          <View style={[styles.previewContainer, { backgroundColor: themeColors.backgroundSecondary }]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewIcon, { backgroundColor: themeColors.primary }]}>
                <Feather name="bell" size={20} color={themeColors.background} />
              </View>
              <View style={styles.previewContent}>
                <Text style={[styles.previewTitle, { color: themeColors.textPrimary }]}>
                  Grade Update Available
                </Text>
                <Text style={[styles.previewMessage, { color: themeColors.textSecondary }]}>
                  Your Math 101 assignment grade has been posted
                </Text>
                <Text style={[styles.previewTime, { color: themeColors.textSecondary }]}>
                  Just now
                </Text>
              </View>
            </View>
            <Text style={[styles.previewNote, { color: themeColors.textSecondary }]}>
              This is how your notifications will appear
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

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
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
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
  timeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  previewContainer: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  previewMessage: {
    fontSize: typography.sm,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  previewTime: {
    fontSize: typography.xs,
    opacity: 0.8,
  },
  previewNote: {
    fontSize: typography.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
