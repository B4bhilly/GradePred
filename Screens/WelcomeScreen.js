import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../designSystem';

const HomeScreen = ({navigation}) => {

    const handleNavigationToSignup = () => {
        navigation.navigate('SignUp');   
    };

    const handleNavigationToLogin = () => {
        navigation.navigate('Login');   
    };

  return (
    <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.textPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Grade Predictor</Text>
                <Text style={styles.subtitle}>Predict your academic future.</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={handleNavigationToSignup}
                    >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.secondaryButton} 
                        onPress={handleNavigationToLogin}
                    >
                        <Text style={styles.secondaryButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.background,
        flex: 1,
        alignItems: "center",
    },
    gradient: {
        width: "100%",
        height: "100%",
    },
    content: {
        height: "100%",
        width: "100%",
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
    },
    title: {
        fontSize: typography['3xl'],
        fontWeight: typography.bold,
        color: colors.textPrimary,
        textAlign: "center",
        paddingBottom: spacing.md,
    },
    subtitle: {
        fontSize: typography.lg,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: spacing['2xl'],
    },
    buttonContainer: {
        width: '100%',
        gap: spacing.md,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        ...shadows.md,
    },
    primaryButtonText: {
        color: colors.background,
        fontSize: typography.lg,
        fontWeight: typography.bold,
    },
    secondaryButton: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.full,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },
    secondaryButtonText: {
        color: colors.textPrimary,
        fontSize: typography.lg,
        fontWeight: typography.semibold,
    },
})