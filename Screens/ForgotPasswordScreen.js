import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
import { spacing, borderRadius, shadows } from '../components/designSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendVerificationEmail } from '../utils/emailService';

const ForgotPasswordScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState(route?.params?.username || '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('username'); // 'username', 'email', 'verification', 'newPassword', 'success'
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storedUserEmail, setStoredUserEmail] = useState('');
  
  const { colors } = useTheme();

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    
    try {
      // Get stored credentials to verify username exists
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) {
        Alert.alert(
          'No Accounts Found',
          'No user accounts found. Please sign up first.',
          [{ text: 'OK' }]
        );
        return;
      }

      const credentials = JSON.parse(storedCredentials);
      if (!credentials[username]) {
        Alert.alert(
          'Username Not Found',
          'The username you entered does not exist. Please check your username or sign up for a new account.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Store the user's email for verification
      setStoredUserEmail(credentials[username].email);
      
      // Move to email verification step
      setStep('email');

    } catch (error) {
      console.error('Username verification error:', error);
      Alert.alert(
        'Error',
        'An error occurred while processing your request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Check if email matches the stored email for this username
    if (email.toLowerCase() !== storedUserEmail.toLowerCase()) {
      Alert.alert(
        'Email Mismatch',
        'The email you entered does not match the email associated with this username. Please check your email and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    try {
      // Generate a verification PIN
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      
             // Send verification email via backend API
       await sendVerificationEmail(email, username, code);
       
       Alert.alert(
         'Verification PIN Sent',
         `A 6-digit verification PIN has been sent to ${email}. Please check your inbox.`,
         [
           { 
             text: 'OK', 
             onPress: () => setStep('verification')
           }
         ]
       );

    } catch (error) {
      console.error('Email verification error:', error);
      
      // Show more specific error messages
      let errorMessage = 'Failed to send verification PIN. Please try again.';
      
      if (error.message.includes('EmailJS not configured')) {
        errorMessage = 'EmailJS is not configured. Please check your configuration.';
      } else if (error.message.includes('Service not found')) {
        errorMessage = 'Email service not found. Please check your EmailJS service ID.';
      } else if (error.message.includes('Template not found')) {
        errorMessage = 'Email template not found. Please check your EmailJS template ID.';
      } else if (error.message.includes('Public key invalid')) {
        errorMessage = 'Invalid EmailJS public key. Please check your configuration.';
      }
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification PIN');
      return;
    }

    if (verificationCode !== generatedCode) {
      Alert.alert('Error', 'Invalid verification PIN. Please try again.');
      return;
    }

    // Move to new password step
    setStep('newPassword');
  };

  const handleNewPasswordSubmit = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    
    try {
      // Get stored credentials
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      const credentials = JSON.parse(storedCredentials);
      
      // Update the password
      credentials[username].password = newPassword;
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
      
      // Show success message
      Alert.alert(
        'Password Reset Successful',
        'Your password has been successfully reset. You can now log in with your new password.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setStep('success');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Error',
        'An error occurred while resetting your password. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderUsernameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Reset Your Password</Text>
      <Text style={styles.stepDescription}>
        Enter your username to begin the password reset process.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="black"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

             <TouchableOpacity
         style={[styles.submitButton, loading && styles.buttonDisabled]}
         onPress={handleUsernameSubmit}
         disabled={loading}
       >
         {loading ? (
           <ActivityIndicator color="white" />
         ) : (
           <Text style={styles.submitButtonText}>Continue</Text>
         )}
       </TouchableOpacity>

       
    </View>
  );

  const renderEmailStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Verify Your Email</Text>
      <Text style={styles.stepDescription}>
        Please enter the email address associated with your username. We'll send a verification PIN to this email.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="black"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleEmailSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Send Verification PIN</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Verification PIN</Text>
      <Text style={styles.stepDescription}>
        We've sent a 6-digit verification PIN to your email. Please enter it below to continue.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit PIN"
          placeholderTextColor="black"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleVerificationSubmit}
      >
        <Text style={styles.submitButtonText}>Verify PIN</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set New Password</Text>
      <Text style={styles.stepDescription}>
        Please enter your new password. Make sure it's at least 6 characters long.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="black"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          placeholderTextColor="black"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleNewPasswordSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color="#10b981" />
      </View>
      
      <Text style={styles.stepTitle}>Password Reset Successful!</Text>
      <Text style={styles.stepDescription}>
        Your password has been successfully reset. You can now log in with your new password.
      </Text>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.submitButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/doodle.jpg')}
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
            {/* Header with back button */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Forgot Password</Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {step === 'username' && renderUsernameStep()}
              {step === 'email' && renderEmailStep()}
              {step === 'verification' && renderVerificationStep()}
              {step === 'newPassword' && renderNewPasswordStep()}
              {step === 'success' && renderSuccessStep()}
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
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'lightgrey',
    opacity: 0.8,
    borderRadius: 10,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginVertical: spacing.xl,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.xl,
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
  submitButton: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    minHeight: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
     successIcon: {
     marginBottom: spacing.lg,
   },
   
 });

export default ForgotPasswordScreen;

