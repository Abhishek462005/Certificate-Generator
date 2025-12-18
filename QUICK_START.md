# 🚀 QUICK START GUIDE

## ✅ Your Certificate Generator is Ready!

### 🎯 **INSTANT SETUP** (30 seconds)

1. **Double-click `start.bat`** 
   - This automatically handles everything!

2. **If first time using Outlook:**
   - The script will pause and ask you to update your Outlook password
   - Open `.env` file and replace `your_outlook_password_here` with your actual Outlook password
   - Press any key to continue

3. **Open your browser:**
   - Go to `http://localhost:3000`
   - Fill the form and test!

---

## 📧 **Outlook Password Setup**

**Simple Option:** Use your regular Outlook password
1. Open `.env` file
2. Replace `your_outlook_password_here` with your actual password
3. Save the file

**Secure Option:** Use App Password (recommended)
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Sign in with `chhatbarabhishek4@outlook.com`
3. Go to "Security" → "Advanced security options"
4. Create new app password for "Certificate Generator"
5. Use this password in `.env` file

---

## 🎓 **How to Use**

1. **Student fills form:**
   - Name, Email, Course, Date, Instructor

2. **Click "Generate & Send Certificate"**
   - PDF certificate is created
   - Email sent automatically to student

3. **Student receives:**
   - Professional email with certificate attached
   - High-quality PDF certificate

---

## ❌ **Troubleshooting**

- **Port 3000 in use?** → `start.bat` automatically fixes this
- **Server not starting?** → Run `npm install` then `npm start`
- **Email not sending?** → Check Gmail App Password in `.env` file
- **Certificate not generating?** → Check browser console for errors

---

## ✅ **All Done!**

Your certificate generator is now ready to use. Students can generate and receive certificates automatically via email using Gmail SMTP.

**Email configured for:** `chhatbarabhishek4@outlook.com`
