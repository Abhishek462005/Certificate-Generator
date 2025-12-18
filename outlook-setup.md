# 📧 Outlook SMTP Setup Guide

## Quick Setup for chhatbarabhishek4@outlook.com

### Step 1: Update .env file
```env
# SMTP Configuration for Outlook
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=chhatbarabhishek4@outlook.com
SMTP_PASS=your_actual_outlook_password

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration
FROM_EMAIL=chhatbarabhishek4@outlook.com
FROM_NAME=Certificate Generator Team
```

### Step 2: Password Options

**Option A: Use Regular Password**
- Simply use your regular Outlook login password
- Replace `your_actual_outlook_password` with your password

**Option B: Use App Password (More Secure)**
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Sign in with chhatbarabhishek4@outlook.com
3. Go to "Security" → "Advanced security options"
4. Under "App passwords", click "Create a new app password"
5. Name it "Certificate Generator"
6. Use the generated password in .env file

### Step 3: Test
1. Run `npm start`
2. Open `http://localhost:3000`
3. Fill form and test email sending

## Troubleshooting

- **Authentication Error**: Check email and password in .env
- **Connection Error**: Verify internet connection and SMTP settings
- **Port Error**: Kill existing processes or change port

## Outlook Limits
- Free Outlook.com: 300 emails per day
- Microsoft 365: Higher limits available
