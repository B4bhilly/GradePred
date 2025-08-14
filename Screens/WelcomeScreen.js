import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { typography, spacing, borderRadius, shadows } from '../designSystem';
import { useTheme } from '../ThemeContext';

const HomeScreen = ({navigation}) => {
  const { colors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

    const handleNavigationToSignup = () => {
        navigation.navigate('SignUp');   
    };

    const handleNavigationToLogin = () => {
        navigation.navigate('Login');   
    };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary, colors.textPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
            <View style={[styles.content, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Grade Predictor</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Predict your academic future.</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
                        onPress={handleNavigationToSignup}
                    >
                        <Text style={[styles.primaryButtonText, { color: colors.background }]}>Get Started</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.secondaryButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} 
                        onPress={handleNavigationToLogin}
                    >
                        <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Log In</Text>
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
        textAlign: "center",
        paddingBottom: spacing.md,
    },
    subtitle: {
        fontSize: typography.lg,
        textAlign: "center",
        marginBottom: spacing['2xl'],
    },
    buttonContainer: {
        width: '100%',
        gap: spacing.md,
    },
    primaryButton: {
        borderRadius: borderRadius.full,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        ...shadows.md,
    },
    primaryButtonText: {
        fontSize: typography.lg,
        fontWeight: typography.bold,
    },
    secondaryButton: {
        borderRadius: borderRadius.full,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    secondaryButtonText: {
        fontSize: typography.lg,
        fontWeight: typography.semibold,
    },
})