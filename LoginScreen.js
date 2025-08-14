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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { spacing, borderRadius, shadows } from './designSystem';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login } = useAuth();
  const { colors } = useTheme();

  // Clear all errors when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUsernameError('');
      setPasswordError('');
      setError('');
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    // Clear previous errors
    setUsernameError('');
    setPasswordError('');
    setError('');

    let hasValidationError = false;

    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      hasValidationError = true;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await login(username, password);
      
      // Check if login was successful
      if (result && result.success) {
        // Add delay to ensure state updates are processed
        setTimeout(() => {
          try {
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
      }
      
    } catch (error) {
      // Display the error message on the page
      setError(error.message);
      setLoading(false);
      return; // Don't proceed with navigation
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('SignUp');
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') {
      setUsername(value);
      setUsernameError(''); // Clear error when user types
    } else if (field === 'password') {
      setPassword(value);
      setPasswordError(''); // Clear error when user types
    }
  };

  return (
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to continue to GradePred</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                {/* <Text style={styles.label}>Username</Text> */}
                <TextInput
                  style={[
                    styles.input,
                    usernameError ? styles.inputError : null
                  ]}
                  placeholder="Username"
                  placeholderTextColor="black"
                  value={username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {usernameError ? (
                  <Text style={styles.errorText}>{usernameError}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                {/* <Text style={styles.label}>Password</Text> */}
                <View style={[
                  styles.passwordContainer,
                  passwordError ? styles.inputError : null
                ]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="black"
                    value={password}
                    onChangeText={(value) => handleInputChange('password', value)}
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
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* contains the styles for the error message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null} 

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Log In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleSignupPress}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
    marginTop: spacing.xl * 2,
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
    borderRadius: borderRadius.lg,
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
    width: '100%',
    borderRadius: borderRadius.lg,
    // paddingHorizontal: spacing.md,
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
    borderRadius: borderRadius.lg,
  },
  eyeIcon: {
    padding: spacing.sm,
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

export default LoginScreen;
