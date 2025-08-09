import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Feather } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows, sharedStyles } from '../../designSystem';
import { useAuth } from '../../AuthContext';

const WelcomeScreen = ({navigation}) => {
  const { user, refreshAuth } = useAuth();
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
      style={styles.container}
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
        <Text style={styles.headerTitle}>Grade Wizard</Text>
        <TouchableOpacity onPress={handleNavigaionToSettings} style={styles.settingsButton}>
          <Feather name="settings" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi, {user?.username || 'Student'}</Text>
        <Text style={styles.description}>Calculate your GPA and CWA with ease. Start by selecting a predictor below.</Text>

        <TouchableOpacity onPress={handleNavigationToGPA} style={styles.card}>
          <Text style={styles.cardTitle}>GPA Predictor</Text>
          <Text style={styles.cardSubtitle}>Calculate your Grade Point Average</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigationToCWA} style={[styles.card, styles.cardSecondary]}>
          <Text style={[styles.cardTitle, styles.cardTitleSecondary]}>CWA Predictor</Text>
          <Text style={[styles.cardSubtitle, styles.cardSubtitleSecondary]}>Calculate your Cumulative Weighted Average</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardSecondary: {
    backgroundColor: colors.secondary,
  },
  cardTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.background,
    marginBottom: spacing.xs,
  },
  cardTitleSecondary: {
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: typography.sm,
    color: colors.background,
    opacity: 0.9,
  },
  cardSubtitleSecondary: {
    color: colors.textSecondary,
  },
});
