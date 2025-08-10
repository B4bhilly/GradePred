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
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { typography, spacing, borderRadius, shadows } from './designSystem';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleNavigationToLogin = () => {
    navigation.navigate('Login');   
  }

  const handleSignup = async () => {
    const result = await signup(
      form.username, 
      form.email, 
      form.password, 
      form.confirmPassword
    );
    
    if (result.success) {
      navigation.navigate('MainTab');
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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

      {/* Input Fields */}
      {['username', 'email', 'password', 'confirmPassword'].map(key => (
        <View key={key} style={styles.inputWrapper}>
          <TextInput
            placeholder={key === 'confirmPassword' ? 'Confirm Password' : key.charAt(0).toUpperCase() + key.slice(1)}
            secureTextEntry={key.includes('password')}
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }]}
            value={form[key]}
            onChangeText={text => handleChange(key, text)}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize={key === 'email' ? 'none' : 'words'}
            keyboardType={key === 'email' ? 'email-address' : 'default'}
          />
        </View>
      ))}

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

      {/* Google Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={[styles.googleButton, { backgroundColor: colors.backgroundSecondary }]}>
          <AntDesign name="google" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Pressable onPress={handleNavigationToLogin}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? Sign In</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  googleButton: {
    borderRadius: borderRadius.full,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  footerText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: typography.sm,
    paddingTop: spacing.md,
  },
});
