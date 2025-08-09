import React, { useState } from "react";
import {View, Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground,Image, Pressable, Alert, ActivityIndicator,} from "react-native";
import { colors, typography, spacing, borderRadius, shadows } from './designSystem';
import { useAuth } from './AuthContext';

export default function LoginScreen({navigation}) {
    const { login, loading } = useAuth();
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
    <View style={styles.container}>
      <View style={styles.content}>
       <View style={styles.imageWrapper}>
            <Image
                source={require('./assets/images/dark.png')}  // file extension is required
                style={styles.image}
            />
        </View>

        <Text style={styles.heading}>Welcome back</Text>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Email"
            style={styles.input}
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
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            onPress={handleLogin} 
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <Pressable onPress={handleNavigationToSignup}>
            <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
            </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    height: 56,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  buttonWrapper: {
    marginVertical: spacing.lg,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.primary,
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
    color: colors.background,
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
  signupText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginBottom: spacing.sm,
  },
  signupLink: {
    textDecorationLine: "underline",
    color: colors.primary,
  },
});
