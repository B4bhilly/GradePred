import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { typography, spacing, borderRadius } from '../../designSystem';
import { useTheme } from '../../ThemeContext';

const AboutScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>About App</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo Section */}
        <View style={[styles.logoSection, { backgroundColor: themeColors.backgroundSecondary }]}>
          <View style={[styles.appLogo, { backgroundColor: themeColors.primary }]}>
            <Text style={[styles.appLogoText, { color: themeColors.background }]}>GP</Text>
          </View>
          <Text style={[styles.appName, { color: themeColors.textPrimary }]}>Grade Predictor</Text>
          <Text style={[styles.appVersion, { color: themeColors.textSecondary }]}>Version 1.0.0</Text>
        </View>

        {/* App Description */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>About</Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            Grade Predictor is an intelligent app that helps students predict their academic performance 
            using machine learning algorithms. Get insights into your grades and make informed decisions 
            about your academic journey.
          </Text>
        </View>

        {/* Features */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Features</Text>
          <View style={styles.featureList}>
            {[
              'AI-powered grade prediction',
              'Comprehensive academic insights',
              'Performance analytics',
              'Personalized recommendations',
              'Dark/Light theme support'
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <AntDesign name="check" size={16} color={themeColors.primary} />
                </View>
                <Text style={[styles.featureText, { color: themeColors.textSecondary }]}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact & Links */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Contact & Links</Text>
          
          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: themeColors.border }]}
            onPress={() => openLink('mailto:support@gradepredictor.com')}
          >
            <View style={[styles.linkIcon, { backgroundColor: themeColors.backgroundSecondary }]}>
              <AntDesign name="mail" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={[styles.linkTitle, { color: themeColors.textPrimary }]}>Email Support</Text>
              <Text style={[styles.linkSubtitle, { color: themeColors.textSecondary }]}>support@gradepredictor.com</Text>
            </View>
            <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: themeColors.border }]}
            onPress={() => openLink('https://gradepredictor.com')}
          >
            <View style={[styles.linkIcon, { backgroundColor: themeColors.backgroundSecondary }]}>
              <AntDesign name="globe" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={[styles.linkTitle, { color: themeColors.textPrimary }]}>Website</Text>
              <Text style={[styles.linkSubtitle, { color: themeColors.textSecondary }]}>gradepredictor.com</Text>
            </View>
            <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Legal</Text>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={[styles.legalText, { color: themeColors.textSecondary }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={[styles.legalText, { color: themeColors.textSecondary }]}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

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
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appLogoText: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
  },
  appName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: typography.sm,
    opacity: 0.8,
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
  description: {
    fontSize: typography.base,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  featureList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: typography.base,
    flex: 1,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  linkSubtitle: {
    fontSize: typography.sm,
  },
  legalLink: {
    paddingVertical: spacing.sm,
  },
  legalText: {
    fontSize: typography.base,
    textDecorationLine: 'underline',
  },
});
