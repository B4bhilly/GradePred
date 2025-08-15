import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { spacing, borderRadius, shadows } from './designSystem';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signup } = useAuth();
  const { colors } = useTheme();

  // Clear all errors when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUsernameError('');
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
      setError('');
    });

    return unsubscribe;
  }, [navigation]);

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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    
    // Clear errors when user types
    if (key === 'username') setUsernameError('');
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
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Username validation
    if (!form.username.trim()) {
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
    
    try {
      setLoading(true);
      const result = await signup(form.email, form.password, form.username);
      
      // Log successful account creation
      console.log('✅ Account Created Successfully!');
      console.log('👤 User Details:');
      console.log('   Username:', form.username);
      console.log('   Email:', form.email);
      console.log('   Account Created At:', new Date().toLocaleString());
      console.log('   Signup Result:', result);
      
      console.log('Signup result success, attempting navigation to MainTab');
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        try {
          console.log('Navigating to MainTab now');
          navigation.navigate('MainTab');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback: try to reset the navigation stack
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTab' }],
          });
        }
      }, 200);
      
    } catch (error) {
      console.error('❌ Signup Failed:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength(form.password);
    if (strength >= 4) return '#10b981';
    if (strength >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength(form.password);
    if (strength >= 4) return 'Strong';
    if (strength >= 3) return 'Good';
    if (strength >= 2) return 'Fair';
    return 'Weak';
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('./assets/images/doodle.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Centered Blurred Form Container */}
            <View style={styles.formContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started with GradePred</Text>
              </View>

              <View style={styles.form}>
                {/* Username Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      form.username.trim() === '' && (emailError || passwordError || confirmPasswordError) ? styles.inputError : null
                    ]}
                    placeholder="Username"
                    placeholderTextColor="black"
                    value={form.username}
                    onChangeText={(value) => handleChange('username', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {form.username.trim() === '' && (emailError || passwordError || confirmPasswordError) ? (
                    <Text style={styles.errorText}>Username is required</Text>
                  ) : null}
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      emailError ? styles.inputError : null
                    ]}
                    placeholder="Email"
                    placeholderTextColor="black"
                    value={form.email}
                    onChangeText={(value) => handleChange('email', value)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={[
                    styles.passwordContainer,
                    passwordError ? styles.inputError : null
                  ]}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Password"
                      placeholderTextColor="black"
                      value={form.password}
                      onChangeText={(value) => handleChange('password', value)}
                      secureTextEntry={!showPassword}
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
                      <Text style={styles.passwordStrengthText}>
                        Password strength: <Text style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthText()}</Text>
                      </Text>
                    </View>
                  ) : null}
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <View style={[
                    styles.passwordContainer,
                    confirmPasswordError ? styles.inputError : null
                  ]}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Confirm Password"
                      placeholderTextColor="black"
                      value={form.confirmPassword}
                      onChangeText={(value) => handleChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
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
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  ) : null}
                </View>

                {/* General Error Display */}
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.buttonDisabled]}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.loginButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleNavigationToLogin}>
                    <Text style={styles.signupLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl * 2, // Extra top padding for status bar
    paddingBottom: spacing.xl * 2, // Extra bottom padding for navigation
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'lightgrey',
    opacity: 0.8,
    borderRadius: 10,
    padding: spacing.xl,
    alignItems: 'center',
    // Blur effect and shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginVertical: spacing.xl, // Add vertical margin for better spacing
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
    marginTop: spacing.xl, // Reduced top margin since we have paddingTop in scrollContainer
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  form: {
    width: '100%',
    padding: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 50,
    backgroundColor: 'white',
    color: 'black',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
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
    fontSize: 12,
    color: 'black',
  },
  errorContainer: {
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  loginButton: {
    width: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    minHeight: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: 'black',
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
  },
});

export default SignupScreen;
