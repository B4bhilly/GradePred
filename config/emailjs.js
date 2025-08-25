/**
 * EMAILJS CONFIGURATION
 * This file contains EmailJS configuration for sending verification emails
 * 
 * IMPORTANT: Replace the placeholder values with your actual EmailJS credentials
 * You can get these from your EmailJS dashboard at https://dashboard.emailjs.com/
 */

export const EMAILJS_CONFIG = {
  // Your EmailJS service ID (e.g., 'gmail', 'outlook', or custom SMTP)
  SERVICE_ID: 'service_nxeloao',
  
  // Your EmailJS template ID (create this in EmailJS dashboard)
  TEMPLATE_ID: 'template_ks8ngwp',
  
  // Your EmailJS public key
  PUBLIC_KEY: '9riPpma_S36s84zV-',
  
  // Email template parameters (these will be replaced with actual values)
  DEFAULT_PARAMS: {
    app_name: 'Grade Predictor',
    company_name: 'Grade Predictor Team',
    support_email: 'support@gradepredictor.com'
  }
};

/**
 * EMAIL TEMPLATE VARIABLES
 * These are the variables that will be available in your EmailJS template
 * 
 * Available variables:
 * - {{to_email}} - Recipient's email address
 * - {{verification_code}} - 6-digit verification PIN
 * - {{username}} - User's username
 * - {{app_name}} - Application name
 * - {{company_name}} - Company name
 * - {{support_email}} - Support email address
 * - {{expiry_time}} - PIN expiry time (optional)
 */
