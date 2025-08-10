// Design System for GradePred App
// Note: Colors are now managed through ThemeContext for dynamic theming
// These are kept for backward compatibility but should not be used in new code

// Light theme colors (default) - moved to ThemeContext
export const lightColors = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  secondary: '#f59e0b',
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  border: '#e5e7eb',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  card: '#ffffff',
  inputBackground: '#ffffff',
  switchTrack: '#e5e7eb',
  switchThumb: '#ffffff',
};

// Dark theme colors - moved to ThemeContext
export const darkColors = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  secondary: '#fbbf24',
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  success: '#22c55e',
  warning: '#fbbf24',
  error: '#f87171',
  border: '#334155',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  card: '#1e293b',
  inputBackground: '#334155',
  switchTrack: '#475569',
  switchThumb: '#3b82f6',
};

// Legacy colors export for backward compatibility
export const colors = lightColors;

export const typography = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 28, '4xl': 32,
  normal: '400', medium: '500', semibold: '600', bold: '700',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32,
};

export const borderRadius = {
  sm: 4, md: 8, lg: 12, xl: 16, full: 9999,
};

export const shadows = {
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const sharedStyles = {
  container: { flex: 1 },
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
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.base,
    minHeight: 48,
  },
  title: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
  },
  subtitle: {
    fontSize: typography.base,
    marginTop: spacing.xs,
  },
};

export const getGPAColor = (gpa, themeColors) => {
  if (gpa >= 3.5) return themeColors.success;
  if (gpa >= 3.0) return themeColors.warning;
  if (gpa >= 2.5) return themeColors.secondary;
  return themeColors.error;
}; 