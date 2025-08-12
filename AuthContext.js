import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

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

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        // Ensure we're not authenticated if no user data
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, assume not authenticated
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Enhanced validation
      if (!email || !password) {
        throw new Error('Please enter email and password');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Simulate API call - replace with actual authentication
      // In a real app, you would make an API call to your backend
      if (email && password) {
        const userData = {
          id: Date.now(),
          email: email.toLowerCase().trim(),
          username: email.split('@')[0],
          createdAt: new Date().toISOString(),
          authMethod: 'email',
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        console.log('Login successful, user authenticated:', userData);
        return { success: true };
      } else {
        throw new Error('Please enter email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, username) => {
    try {
      setLoading(true);
      
      // Enhanced validation
      if (!email || !password || !username) {
        throw new Error('Please fill in all fields');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }
      
      // Check if user already exists (in a real app, check against backend)
      const existingUser = await AsyncStorage.getItem('user');
      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);
        if (parsedUser.email.toLowerCase() === email.toLowerCase()) {
          throw new Error('User with this email already exists');
        }
      }
      
      // Create new user
      const userData = {
        id: Date.now(),
        username: username.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        authMethod: 'email',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Signup successful, user authenticated:', userData);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear user data from storage
      await AsyncStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      setLoading(true);
      
      // Clear all auth-related data
      await AsyncStorage.multiRemove(['user', 'authToken', 'refreshToken']);
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Clear auth error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would refresh the auth token here
      // For now, we'll just check if the user is still valid
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return { success: false, error: 'No valid session found' };
      }
    } catch (error) {
      console.error('Refresh auth error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    clearAuth,
    refreshAuth,
    isValidEmail,
    getPasswordStrength,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
