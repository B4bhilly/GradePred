import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Switch } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { typography, spacing, borderRadius } from '../../designSystem';
import { useTheme } from '../../ThemeContext';
import { useAuth } from '../../AuthContext';

const ProfileEditScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    studentId: user?.studentId || '',
    university: user?.university || '',
    major: user?.major || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    grades: true,
    insights: false,
    updates: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    gradesVisible: false,
    analyticsVisible: true,
  });
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const handleSave = () => {
    // Validate form data
    if (!formData.username.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Username and email are required');
      return;
    }

    // Update profile
    updateProfile(formData);
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNotificationSetting = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const updatePrivacySetting = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: themeColors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={[styles.profileSection, { backgroundColor: themeColors.backgroundSecondary }]}>
          <TouchableOpacity style={styles.profilePictureContainer}>
            <View style={[styles.profilePicture, { backgroundColor: themeColors.primary }]}>
              <Text style={[styles.profileInitial, { color: themeColors.background }]}>
                {formData.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={[styles.editIconContainer, { backgroundColor: themeColors.primary }]}>
              <Feather name="camera" size={16} color={themeColors.background} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileSubtitle, { color: themeColors.textSecondary }]}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Personal Information */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Username</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: themeColors.backgroundSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary
                }
              ]}
              value={formData.username}
              onChangeText={(value) => updateFormData('username', value)}
              placeholder="Enter username"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: themeColors.backgroundSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary
                }
              ]}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter email"
              placeholderTextColor={themeColors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>First Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: themeColors.backgroundSecondary,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary
                  }
                ]}
                value={formData.firstName}
                onChangeText={(value) => updateFormData('firstName', value)}
                placeholder="First name"
                placeholderTextColor={themeColors.textSecondary}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.sm }]}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Last Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: themeColors.backgroundSecondary,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary
                  }
                ]}
                value={formData.lastName}
                onChangeText={(value) => updateFormData('lastName', value)}
                placeholder="Last name"
                placeholderTextColor={themeColors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Academic Information */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Academic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Student ID</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: themeColors.backgroundSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary
                }
              ]}
              value={formData.studentId}
              onChangeText={(value) => updateFormData('studentId', value)}
              placeholder="Enter student ID"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>University</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: themeColors.backgroundSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary
                }
              ]}
              value={formData.university}
              onChangeText={(value) => updateFormData('university', value)}
              placeholder="Enter university name"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Major</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: themeColors.backgroundSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary
                }
              ]}
              value={formData.major}
              onChangeText={(value) => updateFormData('major', value)}
              placeholder="Enter major/field of study"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Notifications</Text>
          
          {Object.entries(notifications).map(([key, value]) => (
            <View key={key} style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: themeColors.backgroundSecondary }]}>
                  <Feather 
                    name={
                      key === 'email' ? 'mail' :
                      key === 'push' ? 'bell' :
                      key === 'grades' ? 'book' :
                      key === 'insights' ? 'trending-up' :
                      'download'
                    } 
                    size={20} 
                    color={themeColors.primary} 
                  />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                  </Text>
                  <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                    Receive {key} notifications
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: themeColors.switchTrack, true: themeColors.primaryLight }}
                thumbColor={value ? themeColors.primary : themeColors.background}
                onValueChange={(newValue) => updateNotificationSetting(key, newValue)}
                value={value}
              />
            </View>
          ))}
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Privacy</Text>
          
          {Object.entries(privacy).map(([key, value]) => (
            <View key={key} style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: themeColors.backgroundSecondary }]}>
                  <Feather 
                    name={
                      key === 'profileVisible' ? 'eye' :
                      key === 'gradesVisible' ? 'lock' :
                      'bar-chart-2'
                    } 
                    size={20} 
                    color={themeColors.primary} 
                  />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                    {key === 'profileVisible' ? 'Profile Visibility' :
                     key === 'gradesVisible' ? 'Grades Privacy' :
                     'Analytics Sharing'}
                  </Text>
                  <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
                    {key === 'profileVisible' ? 'Make profile visible to others' :
                     key === 'gradesVisible' ? 'Share grades with other users' :
                     'Share analytics data for research'}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

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
  },
  saveButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileSubtitle: {
    fontSize: typography.sm,
    textAlign: 'center',
  },
  section: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.base,
  },
  row: {
    flexDirection: 'row',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
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
  },
});
