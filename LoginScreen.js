import React, { useState } from "react";
import {View, Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground,Image, Pressable, Alert, ActivityIndicator,} from "react-native";
import { typography, spacing, borderRadius, shadows } from './designSystem';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNavigationToSignup = () => {
        navigation.navigate('SignUp');   
    };
    
    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            navigation.navigate('MainTab');
        } else {
            Alert.alert('Login Failed', result.error);
        }
    };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }]}
            placeholderTextColor={colors.textSecondary}
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }]}
            placeholderTextColor={colors.textSecondary}
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            autoCapitalize="none"
          />
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
