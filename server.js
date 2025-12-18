const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// SMTP Configuration
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });
};

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Certificate Generator Server is running' });
});

// Send certificate email endpoint
app.post('/api/send-certificate', async (req, res) => {
    try {
        const {
            studentName,
            studentEmail,
            courseName,
            completionDate,
            instructorName,
            certificatePdf
        } = req.body;

        // Validate required fields
        if (!studentName || !studentEmail || !courseName || !completionDate || !instructorName || !certificatePdf) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(studentEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Create transporter
        const transporter = createTransporter();

        // Verify SMTP connection
        await transporter.verify();

        // Format completion date
        const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Convert base64 PDF to buffer
        const pdfBuffer = Buffer.from(certificatePdf.split(',')[1], 'base64');

        // Email options
        const mailOptions = {
            from: {
                name: process.env.FROM_NAME,
                address: process.env.FROM_EMAIL
            },
            to: studentEmail,
            subject: `🎓 Your Certificate is Ready - ${courseName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .certificate-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4facfe; }
                        .detail-row { margin: 10px 0; }
                        .label { font-weight: bold; color: #2c3e50; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        .congratulations { font-size: 18px; color: #2c3e50; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎓 Certificate Generator</h1>
                            <p>Your Achievement Certificate is Ready!</p>
                        </div>
                        <div class="content">
                            <div class="congratulations">
                                Dear <strong>${studentName}</strong>,
                            </div>
                            <p>Congratulations! Your certificate for completing "<strong>${courseName}</strong>" has been successfully generated and is attached to this email.</p>
                            
                            <div class="certificate-details">
                                <h3>📋 Certificate Details</h3>
                                <div class="detail-row">
                                    <span class="label">👤 Student Name:</span> ${studentName}
                                </div>
                                <div class="detail-row">
                                    <span class="label">📚 Course:</span> ${courseName}
                                </div>
                                <div class="detail-row">
                                    <span class="label">📅 Completion Date:</span> ${formattedDate}
                                </div>
                                <div class="detail-row">
                                    <span class="label">👨‍🏫 Instructor:</span> ${instructorName}
                                </div>
                            </div>
                            
                            <p>Your certificate is attached as a high-quality PDF file. You can download, print, or share it as needed.</p>
                            
                            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
                            
                            <div class="footer">
                                <p>Best regards,<br>
                                <strong>${process.env.FROM_NAME}</strong><br>
                                📧 ${process.env.FROM_EMAIL}</p>
                                <hr>
                                <p><em>This is an automated message from the Certificate Generator System.</em></p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);
        
        res.json({
            success: true,
            message: `Certificate sent successfully to ${studentEmail}`,
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        
        let errorMessage = 'Failed to send certificate email';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please check your email credentials.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Failed to connect to email server. Please check your internet connection.';
        } else if (error.responseCode === 550) {
            errorMessage = 'Invalid recipient email address.';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        
        res.json({
            success: true,
            message: 'SMTP configuration is valid'
        });
    } catch (error) {
        console.error('SMTP test failed:', error);
        res.status(500).json({
            success: false,
            message: 'SMTP configuration test failed',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server with port conflict handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Certificate Generator Server running on http://localhost:${PORT}`);
    console.log(`📧 SMTP configured for: ${process.env.SMTP_USER}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
    console.log('\n✅ Server started successfully! The certificate generator is ready to use.');
});

// Handle port already in use error
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use.`);
        console.log('\n🔧 Quick fix options:');
        console.log('1. Kill the process using the port:');
        console.log(`   netstat -ano | findstr :${PORT}`);
        console.log('   taskkill /PID [PID_NUMBER] /F');
        console.log('\n2. Or change the port in .env file (e.g., PORT=3001)');
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});

module.exports = app;
