import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { typography, spacing, borderRadius } from '../../components/designSystem';
import { useTheme } from '../../ThemeContext';

const FeedbackScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: 'message1' },
    { id: 'bug', label: 'Bug Report', icon: 'bug' },
    { id: 'feature', label: 'Feature Request', icon: 'bulb1' },
    { id: 'support', label: 'Technical Support', icon: 'customerservice' },
  ];

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }
    
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted. We\'ll get back to you soon.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Feedback & Support</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="help-circle" size={24} color={themeColors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>FAQ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="book-open" size={24} color={themeColors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>User Guide</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: themeColors.backgroundSecondary }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Feather name="mail" size={24} color={themeColors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>Email Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback Type Selection */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Feedback Type</Text>
          <View style={styles.feedbackTypes}>
            {feedbackTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.feedbackType,
                  { 
                    backgroundColor: feedbackType === type.id ? themeColors.primaryLight : themeColors.backgroundSecondary,
                    borderColor: feedbackType === type.id ? themeColors.primary : themeColors.border
                  }
                ]}
                onPress={() => setFeedbackType(type.id)}
              >
                <AntDesign 
                  name={type.icon} 
                  size={20} 
                  color={feedbackType === type.id ? themeColors.primary : themeColors.textSecondary} 
                />
                <Text style={[
                  styles.feedbackTypeText, 
                  { color: feedbackType === type.id ? themeColors.primary : themeColors.textSecondary }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Contact Information (Optional)</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: themeColors.backgroundSecondary,
                borderColor: themeColors.border,
                color: themeColors.textPrimary
              }
            ]}
            placeholder="Your email address"
            placeholderTextColor={themeColors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Feedback Message */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Your Feedback</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: themeColors.backgroundSecondary,
                borderColor: themeColors.border,
                color: themeColors.textPrimary
              }
            ]}
            placeholder="Tell us what you think, report a bug, or request a feature..."
            placeholderTextColor={themeColors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: themeColors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitButtonText, { color: themeColors.background }]}>Submit Feedback</Text>
        </TouchableOpacity>

        {/* Support Info */}
        <View style={styles.supportInfo}>
          <Text style={[styles.supportInfoText, { color: themeColors.textSecondary }]}>
            Need immediate help? Contact us at support@gradepredictor.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

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
    flex: 0.8,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    textAlign: 'center',
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
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  feedbackTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  feedbackType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    minWidth: '45%',
  },
  feedbackTypeText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginLeft: spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.base,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    fontSize: typography.base,
  },
  submitButton: {
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  submitButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  supportInfo: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  supportInfoText: {
    fontSize: typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
