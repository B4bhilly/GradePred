import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert, Share } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { typography, spacing, borderRadius } from '../../designSystem';
import { useTheme } from '../../ThemeContext';

const ShareScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const shareOptions = [
    {
      id: 'social',
      title: 'Social Media',
      subtitle: 'Share on your favorite platforms',
      icon: 'sharealt',
      color: '#1DA1F2',
      platforms: ['Twitter', 'Facebook', 'Instagram', 'LinkedIn']
    },
    {
      id: 'messaging',
      title: 'Messaging Apps',
      subtitle: 'Send to friends and family',
      icon: 'message1',
      color: '#25D366',
      platforms: ['WhatsApp', 'Telegram', 'iMessage', 'SMS']
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'Share via email',
      icon: 'mail',
      color: '#EA4335',
      platforms: ['Gmail', 'Outlook', 'Apple Mail']
    },
    {
      id: 'copy',
      title: 'Copy Link',
      subtitle: 'Copy app link to clipboard',
      icon: 'copy1',
      color: '#6B7280',
      platforms: ['Clipboard']
    }
  ];

  const handleShare = async (option) => {
    const shareMessage = `Check out Grade Predictor - an amazing app that helps students predict their academic performance using AI! 📚✨\n\nDownload now: https://gradepredictor.com`;
    
    try {
      if (option.id === 'copy') {
        // Implement clipboard functionality
        Alert.alert('Link Copied!', 'App link has been copied to your clipboard');
      } else {
        await Share.share({
          message: shareMessage,
          title: 'Grade Predictor',
          url: 'https://gradepredictor.com'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleQuickShare = (platform) => {
    const shareMessage = `Check out Grade Predictor! 📚✨\n\nDownload now: https://gradepredictor.com`;
    
    // This would integrate with specific platform APIs
    Alert.alert('Share', `Sharing to ${platform}...`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Share App</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[styles.headerSection, { backgroundColor: themeColors.backgroundSecondary }]}>
          <View style={[styles.appIcon, { backgroundColor: themeColors.primary }]}>
            <Text style={[styles.appIconText, { color: themeColors.background }]}>GP</Text>
          </View>
          <Text style={[styles.appTitle, { color: themeColors.textPrimary }]}>Grade Predictor</Text>
          <Text style={[styles.appSubtitle, { color: themeColors.textSecondary }]}>
            Help others discover this amazing app
          </Text>
        </View>

        {/* Quick Share Section */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Quick Share</Text>
          <View style={styles.quickShareGrid}>
            {['WhatsApp', 'Twitter', 'Facebook', 'Email'].map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[styles.quickShareButton, { backgroundColor: themeColors.backgroundSecondary }]}
                onPress={() => handleQuickShare(platform)}
              >
                <View style={[styles.quickShareIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <AntDesign 
                    name={
                      platform === 'WhatsApp' ? 'message1' :
                      platform === 'Twitter' ? 'twitter' :
                      platform === 'Facebook' ? 'facebook-square' :
                      'mail'
                    } 
                    size={24} 
                    color={themeColors.primary} 
                  />
                </View>
                <Text style={[styles.quickShareText, { color: themeColors.textPrimary }]}>{platform}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Share Options */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Share Options</Text>
          <View style={styles.shareOptions}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.shareOption, { borderBottomColor: themeColors.border }]}
                onPress={() => handleShare(option)}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: option.color + '20' }]}>
                  <AntDesign name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.shareOptionContent}>
                  <Text style={[styles.shareOptionTitle, { color: themeColors.textPrimary }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.shareOptionSubtitle, { color: themeColors.textSecondary }]}>
                    {option.subtitle}
                  </Text>
                  <View style={styles.platformsList}>
                    {option.platforms.map((platform, index) => (
                      <View key={index} style={[styles.platformTag, { backgroundColor: themeColors.backgroundSecondary }]}>
                        <Text style={[styles.platformTagText, { color: themeColors.textSecondary }]}>
                          {platform}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Why Share Section */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Why Share?</Text>
          <View style={styles.benefitsList}>
            {[
              'Help fellow students succeed',
              'Support app development',
              'Build a learning community',
              'Get exclusive features'
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <AntDesign name="heart" size={16} color={themeColors.primary} />
                </View>
                <Text style={[styles.benefitText, { color: themeColors.textSecondary }]}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Share Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Share Stats</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: themeColors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: themeColors.primary }]}>1,234</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Downloads</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: themeColors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: themeColors.primary }]}>567</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Shares</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: themeColors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: themeColors.primary }]}>89</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Reviews</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShareScreen;

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
  headerSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appIconText: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
  },
  appTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    fontSize: typography.base,
    textAlign: 'center',
    lineHeight: 20,
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
  quickShareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickShareButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  quickShareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickShareText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  shareOptions: {
    gap: spacing.md,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  shareOptionContent: {
    flex: 1,
  },
  shareOptionTitle: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  shareOptionSubtitle: {
    fontSize: typography.sm,
    marginBottom: spacing.sm,
  },
  platformsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  platformTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  platformTagText: {
    fontSize: typography.xs,
  },
  benefitsList: {
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  benefitText: {
    fontSize: typography.base,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  statNumber: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sm,
    textAlign: 'center',
  },
});
