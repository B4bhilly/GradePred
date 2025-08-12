import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { typography, spacing, borderRadius, shadows } from './designSystem';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

export default function SignUpScreen({navigation}) {
  const { signup, loading } = useAuth();
  const { colors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    
    // Clear errors when user types
    if (key === 'email') setEmailError('');
    if (key === 'password') setPasswordError('');
    if (key === 'confirmPassword') setConfirmPasswordError('');
  };

  const handleNavigationToLogin = () => {
    navigation.navigate('Login');   
  }

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Username validation
    if (!form.username.trim()) {
      Alert.alert('Error', 'Username is required');
      isValid = false;
    }
    
    // Email validation
    if (!form.email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(form.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Password validation
    if (!form.password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (form.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    } else if (getPasswordStrength(form.password) < 3) {
      setPasswordError('Password is too weak. Include uppercase, lowercase, numbers, and symbols');
      isValid = false;
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    const result = await signup(form.email, form.password, form.username);
    
    if (result.success) {
      console.log('Signup result success, attempting navigation to MainTab');
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        console.log('Navigating to MainTab now');
        navigation.navigate('MainTab');
      }, 100);
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };
  
  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength(form.password);
    if (strength >= 4) return colors.success;
    if (strength >= 3) return colors.warning;
    return colors.error;
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength(form.password);
    if (strength >= 4) return 'Strong';
    if (strength >= 3) return 'Good';
    if (strength >= 2) return 'Fair';
    return 'Weak';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Background image */}
          <ImageBackground
            source={require('./assets/images/dark1.png')}
            style={styles.banner}
            imageStyle={styles.bannerImage}
          />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Sign Up</Text>
          </View>

          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Username"
              style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }]}
              value={form.username}
              onChangeText={text => handleChange('username', text)}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              style={[
                styles.input, 
                { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary },
                emailError ? styles.inputError : null
              ]}
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={[
                  styles.passwordInput, 
                  { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary },
                  passwordError ? styles.inputError : null
                ]}
                value={form.password}
                onChangeText={text => handleChange('password', text)}
                placeholderTextColor={colors.textSecondary}
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
            {form.password ? (
              <View style={styles.passwordStrengthContainer}>
                <Text style={[styles.passwordStrengthText, { color: colors.textSecondary }]}>
                  Password strength: <Text style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthText()}</Text>
                </Text>
              </View>
            ) : null}
            {passwordError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                style={[
                  styles.passwordInput, 
                  { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary },
                  confirmPasswordError ? styles.inputError : null
                ]}
                value={form.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          {/* Sign Up Button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity 
              onPress={handleSignup} 
              style={[styles.primaryButton, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={[styles.primaryButtonText, { color: colors.background }]}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <Pressable onPress={handleNavigationToLogin}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account? <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  banner: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  header: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    textAlign: 'center',
    marginRight: spacing['2xl'], // space for the icon
  },
  inputWrapper: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  input: {
    height: 56,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
  },
  passwordInput: {
    flex: 1,
    height: 56,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
  },
  buttonWrapper: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: borderRadius.full,
    height: 48,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
  loginText: {
    textAlign: 'center',
    fontSize: typography.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  loginLink: {
    textDecorationLine: 'underline',
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
    justifyContent: 'space-between',
    height: 56,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  passwordStrengthContainer: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  passwordStrengthText: {
    fontSize: typography.xs,
  },
});
