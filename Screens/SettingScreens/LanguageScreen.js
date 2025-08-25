import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { typography, spacing, borderRadius } from '../../components/designSystem';
import { useTheme } from '../../ThemeContext';

const LanguageScreen = ({ navigation }) => {
  const { colors: themeColors, isInitialized } = useTheme();
  
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Language</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>
          Language selection screen coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LanguageScreen;

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  message: {
    fontSize: typography.lg,
    textAlign: 'center',
  },
});
