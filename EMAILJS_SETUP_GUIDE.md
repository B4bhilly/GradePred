# EmailJS Setup Guide for Grade Predictor

This guide will help you set up EmailJS to send real verification emails instead of showing PINs in alerts.

## 🚀 Quick Start

### 1. Install EmailJS Package
```bash
npm install @emailjs/browser
```

### 2. Sign Up for EmailJS
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Create a free account
3. Verify your email address

### 3. Configure Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook**
   - **Custom SMTP**
4. Follow the setup instructions for your chosen service
5. **Save your Service ID** (you'll need this)

### 4. Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">{{app_name}}</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Verification</h2>
            
            <p>Hello <strong>{{username}}</strong>,</p>
            
            <p>You requested a password reset for your {{app_name}} account. To continue with the password reset process, please use the verification code below:</p>
            
            <div style="background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h1 style="font-size: 32px; margin: 0; letter-spacing: 5px;">{{verification_code}}</h1>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
                <li>This code will expire in {{expiry_time}}</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Never share this code with anyone</li>
            </ul>
            
            <p>Enter this code in the app to continue with your password reset.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br>
                    <strong>{{company_name}}</strong><br>
                    Need help? Contact us at <a href="mailto:{{support_email}}">{{support_email}}</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

4. **Save your Template ID** (you'll need this)

### 5. Get Your Public Key
1. Go to **Account** → **API Keys** in your dashboard
2. Copy your **Public Key**

### 6. Update Configuration
1. Open `config/emailjs.js`
2. Replace the placeholder values:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',      // e.g., 'gmail'
  TEMPLATE_ID: 'your_actual_template_id',    // e.g., 'template_abc123'
  PUBLIC_KEY: 'your_actual_public_key',      // e.g., 'user_xyz789'
  
  DEFAULT_PARAMS: {
    app_name: 'Grade Predictor',
    company_name: 'Grade Predictor Team',
    support_email: 'support@gradepredictor.com'
  }
};
```

## 🔧 Testing Your Setup

### 1. Test Email Sending
1. Run your app
2. Go to Forgot Password
3. Enter a valid username and email
4. Check if you receive the verification email

### 2. Check Console Logs
Look for these messages in your console:
- ✅ "Email sent successfully: [response]"
- ❌ "Failed to send verification email: [error]"

## 🚨 Troubleshooting

### Common Issues:

#### 1. "EmailJS not configured" Error
- Check that all three values are set in `config/emailjs.js`
- Ensure you're not using placeholder values like 'YOUR_SERVICE_ID'

#### 2. "Service not found" Error
- Verify your Service ID is correct
- Make sure your email service is properly connected

#### 3. "Template not found" Error
- Check your Template ID is correct
- Ensure the template is published and active

#### 4. "Public key invalid" Error
- Verify your Public Key is correct
- Check if your account is active

### Debug Steps:
1. Check browser console for detailed error messages
2. Verify EmailJS credentials in dashboard
3. Test email service connection
4. Check template syntax and variables

## 📧 Email Template Variables

Your template can use these variables:
- `{{to_email}}` - Recipient's email
- `{{verification_code}}` - 6-digit PIN
- `{{username}}` - User's username
- `{{app_name}}` - App name
- `{{company_name}}` - Company name
- `{{support_email}}` - Support email
- `{{expiry_time}}` - PIN expiry time

## 🔒 Security Best Practices

1. **Rate Limiting**: Implement PIN request limits
2. **PIN Expiry**: Set reasonable expiration times
3. **Email Validation**: Verify email format and ownership
4. **Logging**: Monitor email sending for abuse
5. **Fallback**: Keep demo mode for development

## 💰 Pricing

- **Free Tier**: 200 emails/month
- **Paid Plans**: Start at $15/month for 1,000 emails
- **Enterprise**: Custom pricing for high volume

## 🎯 Next Steps

1. Install EmailJS package
2. Set up your email service
3. Create email template
4. Update configuration file
5. Test the integration
6. Deploy with real email functionality

## 📞 Support

- **EmailJS Docs**: [docs.emailjs.com](https://docs.emailjs.com/)
- **EmailJS Community**: [community.emailjs.com](https://community.emailjs.com/)
- **EmailJS Support**: support@emailjs.com

---

**Note**: This setup will work immediately after configuration. The app will automatically detect if EmailJS is configured and send real emails, or fall back to demo mode if not configured.
