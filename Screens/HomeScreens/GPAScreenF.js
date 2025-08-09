import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../designSystem';

const GPAScreenF = ({navigation}) => {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Ionicons name="calculator" size={24} color={colors.textPrimary} />
            <Text style={styles.headerTitle}>GPA Predictor</Text>
        </View>

        <View style={styles.content}>
            <Text style={styles.title}>Academic Data Input</Text>
            <Text style={styles.subtitle}>Enter your current academic information for prediction.</Text>
            
            <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Current GPA*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E.g. 3.2"
                        value={''}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Previous Semester GPA*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E.g. 3.0"
                        value={''}
                    />
                </View>
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Credit Hours This Semester*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E.g. 15"
                    value={''}
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Study Hours per Week*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E.g. 15"
                    value={''}
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Attendance Percentage</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E.g. 90"
                    value={''}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Predict GPA</Text>
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
        backgroundColor: colors.background,        
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing['3xl'],
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: typography['2xl'],
        fontWeight: typography.bold,
        color: colors.textPrimary,
        marginLeft: spacing.sm,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
        backgroundColor: colors.backgroundSecondary,
        margin: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.md,
    },
    title: {
        fontSize: typography['2xl'],
        fontWeight: typography.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.base,
        color: colors.textSecondary,
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
        color: colors.textPrimary,
        marginBottom: spacing.xs,
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
        marginBottom: spacing.md,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        width: '100%',
    },
    buttonText: {
        color: colors.background,
        fontWeight: typography.semibold,
        fontSize: typography.base,
    },
});