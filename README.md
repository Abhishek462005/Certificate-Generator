# 🎓 Automatic Certificate Generator

**✅ READY TO USE** - A complete web application that generates professional certificates and sends them via email using Gmail SMTP.

![Certificate Generator](https://img.shields.io/badge/Status-Ready-brightgreen) ![Gmail](https://img.shields.io/badge/Email-Gmail_SMTP-red) ![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

## Features

- **Real-time Preview**: See your certificate update as you type
- **Professional Design**: Beautiful, print-ready certificate template
- **Email Integration**: Automatic email delivery using EmailJS
- **PDF Generation**: High-quality PDF certificates
- **Responsive Design**: Works on desktop and mobile devices
- **Download Option**: Download certificates directly to your device

## Files Structure

```
Certificate Generator/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── emailjs-setup.md    # EmailJS configuration guide
└── README.md           # This file
```

## 🚀 Quick Start (2 Steps)

### Step 1: Setup (One-time only)
1. **Double-click `start.bat`** - This will automatically:
   - Install dependencies
   - Set up configuration
   - Start the server

2. **Configure Gmail** (if first time):
   - Update `.env` file with your Gmail App Password
   - Follow the instructions shown in the terminal

### Step 2: Use the Application
1. **Open** `http://localhost:3000` in your browser
2. **Fill the form** with student details
3. **Click "Generate & Send Certificate"**
4. **Certificate sent!** Student receives PDF via email

## SMTP Setup (Required for Email Functionality)

To enable email sending, you need to set up the SMTP backend:

1. Install dependencies: `npm install`
2. Configure your email credentials in `.env` file
3. Follow the instructions in `smtp-setup.md`
4. Start the server: `npm start`
5. Open `http://localhost:3000` in your browser

## Usage

### For Students
1. Visit the certificate generator website at `http://localhost:3000`
2. Fill in your details:
   - Full Name
   - Email Address
   - Course Name
   - Completion Date
   - Instructor Name
3. Review the certificate preview
4. Click "Generate & Send Certificate"
5. Check your email for the certificate PDF

### For Administrators
- Customize the certificate template by editing the HTML/CSS
- Modify email templates in your EmailJS dashboard
- Add additional form fields as needed

## Customization

### Certificate Design
Edit the certificate template in `index.html` and styles in `styles.css`:
- Change colors, fonts, and layout
- Add logos or additional branding
- Modify the certificate text and structure

### Form Fields
Add or modify form fields by:
1. Adding HTML input elements
2. Updating the JavaScript to handle new fields
3. Modifying the certificate template to display new data

### Email Template
Customize the email content in your EmailJS dashboard:
- Change the subject line
- Modify the email body text
- Add additional template variables

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Dependencies

The application uses these external libraries (loaded via CDN):
- **EmailJS**: For sending emails
- **html2canvas**: For capturing certificate as image
- **jsPDF**: For generating PDF files

## Troubleshooting

### Email Not Sending
1. Check EmailJS configuration
2. Verify all IDs are correct in `script.js`
3. Check browser console for errors
4. Ensure email service is properly set up

### Certificate Not Generating
1. Check browser console for errors
2. Ensure all form fields are filled
3. Try refreshing the page

### Styling Issues
1. Clear browser cache
2. Check for CSS conflicts
3. Ensure all files are in the same directory

## Security Notes

- EmailJS credentials are visible in client-side code
- For production use, consider server-side email handling
- Validate all user inputs on both client and server side

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review EmailJS documentation
3. Check browser developer console for errors

## Future Enhancements

Potential improvements:
- Multiple certificate templates
- Bulk certificate generation
- Database integration for record keeping
- Advanced customization options
- Integration with learning management systems
