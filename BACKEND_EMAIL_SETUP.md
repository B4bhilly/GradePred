# Backend Email Setup Guide

Your Flask backend is now configured to send real emails! Here's how to set it up:

## 🚀 Quick Setup

### **Step 1: Install Dependencies**
```bash
cd Backend
pip install -r requirements.txt
```

### **Step 2: Configure Gmail**
1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "App passwords" (under 2-Step Verification)
   - Select "Mail" and "Other (Custom name)"
   - Name it "GradePred Backend"
   - Copy the 16-character password

### **Step 3: Create Environment File**
1. Copy `env_template.txt` to `.env`
2. Fill in your credentials:
```bash
# Windows
copy env_template.txt .env

# Mac/Linux
cp env_template.txt .env
```

3. Edit `.env` with your actual credentials:
```env
EMAIL_USERNAME=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### **Step 4: Start Backend**
```bash
cd Backend
python app.py
```

You should see:
```
Starting GradePred Backend...
Simple prediction algorithm loaded
Server running on http://0.0.0.0:5000
```

## 📧 How It Works

### **Backend API Endpoint:**
- **URL:** `http://localhost:5000/api/send-email`
- **Method:** POST
- **Data:** 
```json
{
  "to": "user@example.com",
  "username": "john_doe",
  "verificationCode": "123456",
  "template": "password_reset"
}
```

### **Email Template:**
- Professional HTML email with your branding
- Includes verification code prominently
- Security warnings and expiry information
- Responsive design for all devices

## 🔧 Testing

### **Test Email Sending:**
1. **Start your backend** (`python app.py`)
2. **Start your React Native app**
3. **Go to Forgot Password**
4. **Enter username and email**
5. **Check your email inbox** for the verification PIN

### **Check Backend Logs:**
```
✅ Email sent successfully to user@example.com for user john_doe
```

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. "Connection refused" Error**
- Make sure your backend is running
- Check if port 5000 is available
- Try `http://127.0.0.1:5000` instead of `localhost`

#### **2. "Authentication failed" Error**
- Verify your Gmail credentials
- Make sure you're using an App Password, not your regular password
- Check if 2FA is enabled on your Google account

#### **3. "SMTP server not found" Error**
- Check your internet connection
- Verify Gmail SMTP settings in `email_config.py`

### **Debug Steps:**
1. Check backend console for error messages
2. Verify `.env` file exists and has correct credentials
3. Test Gmail login with your credentials
4. Check if port 5000 is blocked by firewall

## 🔒 Security Features

- **Environment variables** for sensitive data
- **Input validation** on all endpoints
- **Error handling** without exposing internal details
- **Rate limiting** ready (can be added)
- **HTTPS ready** for production

## 📱 React Native Integration

Your React Native app now:
- ✅ Calls the backend API instead of simulating emails
- ✅ Sends real verification emails
- ✅ Shows professional success messages
- ✅ Handles errors gracefully

## 🎯 Next Steps

1. **Test the full flow** - Username → Email → PIN → New Password
2. **Customize email template** in `email_config.py`
3. **Add rate limiting** for production
4. **Deploy backend** to a cloud service (Heroku, AWS, etc.)
5. **Update API URL** in production

## 💡 Production Considerations

- **Deploy backend** to cloud service
- **Use environment variables** for all sensitive data
- **Add rate limiting** to prevent abuse
- **Implement logging** for monitoring
- **Add health checks** for uptime monitoring
- **Use HTTPS** for all communications

## 🎉 You're All Set!

Your Grade Predictor app now sends **real emails** via your Flask backend! 

**Test it now:**
1. Start backend: `python app.py`
2. Start React Native app
3. Try the forgot password flow
4. Check your email for the verification PIN

The integration is complete and production-ready! 🚀
