import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load stored credentials on app start
  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedAuth = await AsyncStorage.getItem('isAuthenticated');
        
        if (storedUser && storedAuth === 'true') {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading stored credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredCredentials();
  }, []);

  const login = async (username, password) => {
    try {
      // Don't change the global loading state during login attempts
      // setLoading(true);
      
      // Validate input
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      // Get stored credentials
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!storedCredentials) {
        throw new Error('No user account found. Please sign up first.');
      }
      
      const credentials = JSON.parse(storedCredentials);
      
      // Check if username exists
      if (!credentials[username]) {
        throw new Error('Username not found');
      }
      
      // Verify password
      if (credentials[username].password !== password) {
        throw new Error('Incorrect password');
      }
      
      // Login successful
        const userData = {
        username: username,
        email: credentials[username].email,
        id: credentials[username].id,
        createdAt: credentials[username].createdAt
      };
      
        setUser(userData);
        setIsAuthenticated(true);
      
      // Store user session
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      console.log('Login successful for user:', username);
      return { success: true, user: userData };
      
    } catch (error) {
      // Don't log the error here - let the calling component handle it
      throw error;
    }
    // Don't change loading state here
    // } finally {
    //   setLoading(false);
    // }
  };

  const signup = async (email, password, username) => {
    try {
      // Don't change the global loading state during signup attempts
      // setLoading(true);
      
      // Validate input
      if (!email || !password || !username) {
        throw new Error('All fields are required');
      }
      
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Check if username already exists
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      const credentials = storedCredentials ? JSON.parse(storedCredentials) : {};
      
      if (credentials[username]) {
        throw new Error('Username already exists');
      }
      
      // Create new user
      const newUser = {
        username: username,
        email: email,
        password: password,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Store user credentials
      credentials[username] = {
        email: email,
        password: password,
        id: newUser.id,
        createdAt: newUser.createdAt
      };
      
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
      
      // Auto-login after signup
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Store user session
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      console.log('Signup successful for user:', username);
      return { success: true, user: newUser };
      
    } catch (error) {
      // Don't log the error here - let the calling component handle it
      throw error;
    }
    // Don't change loading state here
    // } finally {
    //   setLoading(false);
    // }
  };

  const logout = async () => {
    try {
      console.log('Logout initiated - clearing user session...');
      
      // Don't change the global loading state during logout
      // setLoading(true);
      
      // Clear user session
      setUser(null);
      setIsAuthenticated(false);
      
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('isAuthenticated');
      
      console.log('Logout successful - user session cleared');
      return { success: true };
      
    } catch (error) {
      console.error('Logout error:', error);
      // Don't log the error here - let the calling component handle it
      throw error;
    }
    // Don't change loading state here
    // } finally {
    //   setLoading(false);
    // }
  };

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new Error('All fields are required');
      }
      
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }
      
      if (newPassword !== confirmNewPassword) {
        throw new Error('New passwords do not match');
      }
      
      // Get stored credentials
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      const credentials = JSON.parse(storedCredentials);
      
      // Verify current password
      if (credentials[user.username].password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      credentials[user.username].password = newPassword;
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
      
      console.log('Password changed successfully');
      return { success: true };
      
    } catch (error) {
      // Don't log the error here - let the calling component handle it
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      if (!password) {
        throw new Error('Password is required');
      }
      
      // Get stored credentials
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      const credentials = JSON.parse(storedCredentials);
      
      // Verify password
      if (credentials[user.username].password !== password) {
        throw new Error('Password is incorrect');
      }
      
      // Remove user credentials
      delete credentials[user.username];
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
      
      // Clear user session
        setUser(null);
        setIsAuthenticated(false);
      
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('isAuthenticated');
      
      console.log('Account deleted successfully');
      return { success: true };
      
    } catch (error) {
      // Don't log the error here - let the calling component handle it
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Get stored credentials
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      const credentials = JSON.parse(storedCredentials);
      
      // Update user credentials with new profile data
      if (credentials[user.username]) {
        credentials[user.username] = {
          ...credentials[user.username],
          ...profileData
        };
        await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
      }
      
      // Update current user state
      const updatedUser = {
        ...user,
        ...profileData
      };
      setUser(updatedUser);
      
      // Update stored user data
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      console.log('Profile updated successfully');
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const clearAuth = async () => {
    try {
      // Clear all user data and credentials
      await AsyncStorage.removeItem('userCredentials');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('isAuthenticated');
      
      // Clear user session
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('All data cleared and user logged out');
      return { success: true };
      
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    signup,
    logout,
    changePassword,
    deleteAccount,
    updateProfile,
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
