import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Feather } from "@expo/vector-icons";
import { typography, spacing, borderRadius, shadows, sharedStyles } from '../../designSystem';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../ThemeContext';

const WelcomeScreen = ({navigation}) => {
  const { user, refreshAuth } = useAuth();
  const { colors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigationToGPA = () => {
    navigation.navigate('GPA');
  };

  const handleNavigationToCWA = () => {
    navigation.navigate('CWA');
  };

  const handleNavigaionToSettings = () => {
    navigation.navigate('Settings');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAuth();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Grade Wizard</Text>
        <TouchableOpacity onPress={handleNavigaionToSettings} style={styles.settingsButton}>
          <Feather name="settings" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.greeting, { color: colors.textPrimary }]}>Hi, {user?.username || 'Student'}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>Calculate your GPA and CWA with ease. Start by selecting a predictor below.</Text>

        <TouchableOpacity onPress={handleNavigationToGPA} style={[styles.card, { backgroundColor: colors.primary }]}>
          <Text style={[styles.cardTitle, { color: colors.background }]}>GPA Predictor</Text>
          <Text style={[styles.cardSubtitle, { color: colors.background }]}>Calculate your Grade Point Average</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigationToCWA} style={[styles.card, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>CWA Predictor</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Calculate your Cumulative Weighted Average</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  settingsButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography['4xl'],
    fontWeight: typography.bold,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.base,
    marginBottom: spacing['2xl'],
    lineHeight: 24,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardSecondary: {
    // backgroundColor will be applied dynamically
  },
  cardTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  cardTitleSecondary: {
    // color will be applied dynamically
  },
  cardSubtitle: {
    fontSize: typography.sm,
    opacity: 0.9,
  },
  cardSubtitleSecondary: {
    // color will be applied dynamically
  },
});
