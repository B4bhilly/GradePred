import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert, Linking } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { typography, spacing, borderRadius } from '../../components/designSystem';
import { useTheme } from '../../ThemeContext';

const RateScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRateApp = () => {
    if (rating === 0) {
      Alert.alert('Please Rate', 'Please select a rating before continuing');
      return;
    }

    if (rating >= 4) {
      // High rating - direct to app store
      Alert.alert(
        'Thank You!',
        'We\'re glad you love the app! Would you like to rate us on the App Store?',
        [
          { text: 'Not Now', style: 'cancel' },
          { 
            text: 'Rate Now', 
            onPress: () => {
              // Replace with actual app store URL
              Linking.openURL('https://apps.apple.com/app/your-app-id');
              setHasRated(true);
            }
          }
        ]
      );
    } else {
      // Low rating - show feedback option
      Alert.alert(
        'We\'re Sorry',
        'We\'d love to hear how we can improve. Would you like to send us feedback?',
        [
          { text: 'Not Now', style: 'cancel' },
          { 
            text: 'Send Feedback', 
            onPress: () => navigation.navigate('Feedback') 
          }
        ]
      );
    }
  };

  const handleShareApp = () => {
    // Implement share functionality
    Alert.alert('Share App', 'Share functionality would go here');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Rate App</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[styles.headerSection, { backgroundColor: themeColors.backgroundSecondary }]}>
          <View style={[styles.appIcon, { backgroundColor: themeColors.primary }]}>
            <Text style={[styles.appIconText, { color: themeColors.background }]}>GP</Text>
          </View>
          <Text style={[styles.appTitle, { color: themeColors.textPrimary }]}>Grade Predictor</Text>
          <Text style={[styles.appSubtitle, { color: themeColors.textSecondary }]}>
            Help us improve by rating your experience
          </Text>
        </View>

        {/* Rating Section */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>How would you rate your experience?</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starButton}
              >
                <AntDesign
                  name={star <= rating ? "star" : "staro"}
                  size={40}
                  color={star <= rating ? themeColors.warning : themeColors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.ratingText, { color: themeColors.textSecondary }]}>
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent!'}
          </Text>
        </View>

        {/* Rating Actions */}
        {rating > 0 && (
          <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
            <TouchableOpacity 
              style={[styles.rateButton, { backgroundColor: themeColors.primary }]}
              onPress={handleRateApp}
            >
              <Text style={[styles.rateButtonText, { color: themeColors.background }]}>
                {rating >= 4 ? 'Rate on App Store' : 'Submit Rating'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Additional Actions */}
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>More Ways to Support</Text>
          
          <TouchableOpacity 
            style={[styles.actionItem, { borderBottomColor: themeColors.border }]}
            onPress={handleShareApp}
          >
            <View style={[styles.actionIcon, { backgroundColor: themeColors.backgroundSecondary }]}>
              <AntDesign name="sharealt" size={24} color={themeColors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: themeColors.textPrimary }]}>Share with Friends</Text>
              <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                Help others discover Grade Predictor
              </Text>
            </View>
            <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionItem, { borderBottomColor: themeColors.border }]}
            onPress={() => navigation.navigate('Feedback')}
          >
            <View style={[styles.actionIcon, { backgroundColor: themeColors.backgroundSecondary }]}>
              <AntDesign name="message1" size={24} color={themeColors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: themeColors.textPrimary }]}>Send Feedback</Text>
              <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                Tell us how we can improve
              </Text>
            </View>
            <AntDesign name="arrowright" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Why Rate Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Why Rate Us?</Text>
          <View style={styles.benefitsList}>
            {[
              'Help us improve the app',
              'Support future development',
              'Share your experience with others',
              'Get early access to new features'
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <AntDesign name="check" size={16} color={themeColors.primary} />
                </View>
                <Text style={[styles.benefitText, { color: themeColors.textSecondary }]}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RateScreen;

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
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  starButton: {
    padding: spacing.sm,
  },
  ratingText: {
    fontSize: typography.lg,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  rateButton: {
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
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
});
