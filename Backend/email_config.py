"""
Email Configuration for GradePred Backend
Configure your email settings here
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Email Configuration
EMAIL_CONFIG = {
    # Gmail SMTP Settings (recommended for testing)
    'MAIL_SERVER': 'smtp.gmail.com',
    'MAIL_PORT': 587,
    'MAIL_USE_TLS': True,
    'MAIL_USE_SSL': False,
    
    # Your email credentials (set these in .env file)
    'MAIL_USERNAME': os.getenv('EMAIL_USERNAME', 'your-email@gmail.com'),
    'MAIL_PASSWORD': os.getenv('EMAIL_PASSWORD', 'your-app-password'),
    
    # Email settings
    'MAIL_DEFAULT_SENDER': os.getenv('EMAIL_USERNAME', 'your-email@gmail.com'),
    'MAIL_MAX_EMAILS': 100,
    'MAIL_ASCII_ATTACHMENTS': False,
    
    # App settings
    'APP_NAME': 'Grade Predictor',
    'COMPANY_NAME': 'Grade Predictor Team',
    'SUPPORT_EMAIL': 'support@gradepredictor.com'
}

# Email Templates
EMAIL_TEMPLATES = {
    'password_reset': {
        'subject': 'Password Reset Verification - Grade Predictor',
        'html_template': '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Password Reset Verification</title>
            <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Grade Predictor</h1>
                </div>
                
                <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 22px;">Password Reset Verification</h2>
                    
                    <p style="margin-bottom: 15px;">Hello <strong>{username}</strong>,</p>
                    
                    <p style="margin-bottom: 20px;">You requested a password reset for your Grade Predictor account. To continue with the password reset process, please use the verification code below:</p>
                    
                    <div style="background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                        <h1 style="font-size: 32px; margin: 0; letter-spacing: 5px; font-weight: bold;">{verification_code}</h1>
                    </div>
                    
                    <p style="margin-bottom: 15px;"><strong>Important:</strong></p>
                    <ul style="margin-bottom: 20px; padding-left: 20px;">
                        <li>This code will expire in 10 minutes</li>
                        <li>If you didn't request this password reset, please ignore this email</li>
                        <li>Never share this code with anyone</li>
                    </ul>
                    
                    <p style="margin-bottom: 0;">Enter this code in the app to continue with your password reset.</p>
                </div>
                
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        Best regards,<br>
                        <strong>Grade Predictor Team</strong><br>
                        Need help? Contact us at <a href="mailto:support@gradepredictor.com" style="color: #2563eb;">support@gradepredictor.com</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        '''
    }
}

def get_email_config():
    """Get email configuration"""
    return EMAIL_CONFIG

def get_email_template(template_name):
    """Get email template by name"""
    return EMAIL_TEMPLATES.get(template_name, {})
