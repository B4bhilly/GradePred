// Design System for GradePred App
export const colors = {
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
};

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
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const sharedStyles = {
  container: { flex: 1, backgroundColor: colors.background },
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
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  button: {
    backgroundColor: colors.primary,
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
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.base,
    backgroundColor: colors.background,
    minHeight: 48,
  },
  title: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
};

export const getGPAColor = (gpa) => {
  if (gpa >= 3.5) return colors.success;
  if (gpa >= 3.0) return colors.warning;
  if (gpa >= 2.5) return colors.secondary;
  return colors.error;
}; 