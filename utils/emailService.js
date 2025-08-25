/**
 * EMAIL SERVICE UTILITIES
 * This file provides utility functions for sending emails via EmailJS
 */

/**
 * Send verification PIN email via backend API
 * @param {string} email - Recipient's email address
 * @param {string} username - User's username
 * @param {string} verificationCode - 6-digit verification PIN
 * @returns {Promise<boolean>} - Success status
 */
export const sendVerificationEmail = async (email, username, verificationCode) => {
  try {
    console.log('📧 Sending email via backend API...');
    console.log('To:', email);
    console.log('Username:', username);
    console.log('Verification Code:', verificationCode);
    
    // Call your Flask backend API
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        username: username,
        verificationCode: verificationCode,
        template: 'password_reset'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }
    
    const result = await response.json();
    console.log('✅ Email sent successfully via backend:', result);
    return true;

  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
