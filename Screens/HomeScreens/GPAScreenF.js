import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { typography, spacing, borderRadius, shadows } from '../../designSystem';
import { useTheme } from '../../ThemeContext';

const GPAScreenF = ({navigation}) => {
  const { colors, isInitialized } = useTheme();
  
  // Safety check to ensure colors are available
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Ionicons name="calculator" size={24} color={colors.textPrimary} />
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>GPA Predictor</Text>
        </View>

        <View style={[styles.content, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Academic Data Input</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your current academic information for prediction.</Text>
            
            <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Current GPA*</Text>
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                        placeholder="E.g. 3.2"
                        value={''}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Previous Semester GPA*</Text>
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                        placeholder="E.g. 3.0"
                        value={''}
                    />
                </View>
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Credit Hours This Semester*</Text>
                <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="E.g. 15"
                    value={''}
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Study Hours per Week*</Text>
                <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="E.g. 15"
                    value={''}
                    placeholderTextColor={colors.textSecondary}
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Attendance Percentage</Text>
                <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="E.g. 90"
                    value={''}
                    placeholderTextColor={colors.textSecondary}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.buttonText, { color: colors.background }]}>Predict GPA</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default GPAScreenF

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing['3xl'],
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerTitle: {
        fontSize: typography['2xl'],
        fontWeight: typography.bold,
        marginLeft: spacing.sm,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
        margin: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.md,
    },
    title: {
        fontSize: typography['2xl'],
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.base,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    inputGroup: {
        flex: 1,
        marginHorizontal: spacing.xs,
    },
    inputLabel: {
        fontSize: typography.sm,
        fontWeight: typography.medium,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.base,
        minHeight: 48,
        marginBottom: spacing.md,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        width: '100%',
    },
    buttonText: {
        fontWeight: typography.semibold,
        fontSize: typography.base,
    },
});