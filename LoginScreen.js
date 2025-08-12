import React, { useState } from "react";
import {View, Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground,Image, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { typography, spacing, borderRadius, shadows } from './designSystem';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginScreen({navigation}) {
    const { login, loading } = useAuth();
    const { colors, isInitialized } = useTheme();
    
    // Safety check to ensure theme is ready
    if (!isInitialized || !colors) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
                <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
            </View>
        );
    }
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear email error when user types
        if (field === 'email') {
            setEmailError('');
        }
    };

    const handleNavigationToSignup = () => {
        navigation.navigate('SignUp');   
    };
    
    const handleLogin = async () => {
        // Clear previous errors
        setEmailError('');
        
        // Validation
        if (!formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            console.log('Login result success, attempting navigation to MainTab');
            console.log('Navigation object:', navigation);
            console.log('Available routes:', navigation.getState()?.routes?.map(r => r.name));
            // Add a small delay to ensure state is updated
            setTimeout(() => {
                console.log('Navigating to MainTab now');
                navigation.navigate('MainTab');
            }, 100);
        } else {
            Alert.alert('Login Failed', result.error);
        }
    };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
         <View style={styles.imageWrapper}>
              <Image
                  source={require('./assets/images/dark.png')}  // file extension is required
                  style={styles.image}
              />
          </View>

          <Text style={[styles.heading, { color: colors.textPrimary }]}>Welcome back</Text>

          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Email"
              style={[
                styles.input, 
                { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary },
                emailError ? styles.inputError : null
              ]}
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={[
                  styles.passwordInput, 
                  { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }
                ]}
                placeholderTextColor={colors.textSecondary}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity 
              onPress={handleLogin} 
              style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.background }]}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <Pressable onPress={handleNavigationToSignup}>
              <Text style={[styles.signupText, { color: colors.textSecondary }]}>
              Don't have an account? <Text style={[styles.signupLink, { color: colors.primary }]}>Sign up</Text>
              </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    padding: spacing.lg,
  },
  imageWrapper: {
    aspectRatio: 2 / 2,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  input: {
    borderRadius: borderRadius.lg,
    height: 56,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
  },
  passwordInput: {
    flex: 1,
    borderRadius: borderRadius.lg,
    height: 56,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    height: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  buttonWrapper: {
    marginVertical: spacing.lg,
    alignItems: "center",
  },
  button: {
    borderRadius: borderRadius.full,
    height: 48,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
  signupText: {
    textAlign: "center",
    fontSize: typography.sm,
    marginBottom: spacing.sm,
  },
  signupLink: {
    textDecorationLine: "underline",
  },
});
