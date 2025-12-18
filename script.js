// SMTP Backend Configuration
const API_BASE_URL = window.location.origin;

// Email Configuration
const EMAIL_CONFIG = {
    senderEmail: 'demo.certificate.generator@gmail.com',
    senderName: 'Certificate Generator Demo'
};

// Check server health on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        console.log('✅ Server status:', data.message);
        showStatus('✅ Server connected successfully!', 'success');
    } catch (error) {
        console.warn('❌ Server connection check failed:', error);
        showStatus('⚠️ Server not running. Please start the server using start.bat or npm start', 'error');
        
        // Disable the form if server is not running
        const form = document.getElementById('certificateForm');
        const generateBtn = document.getElementById('generateBtn');
        if (form && generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '❌ Server Not Running';
        }
    }
});

// DOM Elements
const form = document.getElementById('certificateForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const statusMessage = document.getElementById('statusMessage');

// Preview elements
const previewName = document.getElementById('previewName');
const previewCourse = document.getElementById('previewCourse');
const previewDate = document.getElementById('previewDate');
const previewInstructor = document.getElementById('previewInstructor');

// Form inputs
const studentNameInput = document.getElementById('studentName');
const studentEmailInput = document.getElementById('studentEmail');
const courseNameInput = document.getElementById('courseName');
const completionDateInput = document.getElementById('completionDate');
const instructorNameInput = document.getElementById('instructorName');

// Set default date to today
const today = new Date().toISOString().split('T')[0];
completionDateInput.value = today;

// Real-time preview updates
function updatePreview() {
    previewName.textContent = studentNameInput.value || '[Student Name]';
    previewCourse.textContent = courseNameInput.value || '[Course Name]';
    previewInstructor.textContent = instructorNameInput.value || '[Instructor Name]';
    
    if (completionDateInput.value) {
        const date = new Date(completionDateInput.value);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        previewDate.textContent = formattedDate;
    } else {
        previewDate.textContent = '[Date]';
    }
}

// Add event listeners for real-time preview
studentNameInput.addEventListener('input', updatePreview);
courseNameInput.addEventListener('input', updatePreview);
completionDateInput.addEventListener('input', updatePreview);
instructorNameInput.addEventListener('input', updatePreview);

// Initialize preview
updatePreview();

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
}

// Generate certificate as PDF
async function generateCertificatePDF() {
    const certificate = document.getElementById('certificatePreview');
    
    try {
        // Use html2canvas to capture the certificate
        const canvas = await html2canvas(certificate, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Return PDF as base64 string
        return pdf.output('datauristring');
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate certificate PDF');
    }
}

// Send email with certificate via SMTP backend
async function sendCertificateEmail(formData, pdfData) {
    const payload = {
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        courseName: formData.courseName,
        completionDate: formData.completionDate,
        instructorName: formData.instructorName,
        certificatePdf: pdfData
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/send-certificate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to send email');
        }
        
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('❌ Cannot connect to server. Please run start.bat or npm start to start the backend server.');
        }
        
        throw new Error(error.message || 'Failed to send certificate email');
    }
}

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    statusMessage.style.display = 'none';
    
    try {
        // Get form data
        const formData = {
            studentName: studentNameInput.value.trim(),
            studentEmail: studentEmailInput.value.trim(),
            courseName: courseNameInput.value.trim(),
            completionDate: completionDateInput.value,
            instructorName: instructorNameInput.value.trim()
        };
        
        // Enhanced validation
        const validationErrors = validateCertificateData(formData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join('. '));
        }
        
        showStatus('Generating certificate...', 'info');
        
        // Generate predefined certificate with student data
        generatePredefinedCertificate(formData);
        
        // Wait a moment for DOM to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate certificate PDF
        const pdfData = await generateCertificatePDF();
        
        showStatus('Sending certificate to email...', 'info');
        
        // Send email with certificate
        await sendCertificateEmail(formData, pdfData);
        
        // Show success message
        showStatus(
            `✅ Certificate generated and sent successfully to ${formData.studentEmail}!`,
            'success'
        );
        
        // Reset form
        form.reset();
        completionDateInput.value = today;
        updatePreview();
        
    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
});

// Generate predefined certificate template
function generatePredefinedCertificate(studentData) {
    const certificate = document.getElementById('certificatePreview');
    
    // Update certificate with student data
    document.getElementById('previewName').textContent = studentData.studentName;
    document.getElementById('previewCourse').textContent = studentData.courseName;
    document.getElementById('previewInstructor').textContent = studentData.instructorName;
    
    const completionDate = new Date(studentData.completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('previewDate').textContent = completionDate;
    
    return certificate;
}

// Enhanced certificate validation
function validateCertificateData(formData) {
    const errors = [];
    
    if (!formData.studentName || formData.studentName.trim().length < 2) {
        errors.push('Student name must be at least 2 characters long');
    }
    
    if (!formData.studentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.courseName || formData.courseName.trim().length < 3) {
        errors.push('Course name must be at least 3 characters long');
    }
    
    if (!formData.completionDate) {
        errors.push('Please select a completion date');
    } else {
        const selectedDate = new Date(formData.completionDate);
        const today = new Date();
        if (selectedDate > today) {
            errors.push('Completion date cannot be in the future');
        }
    }
    
    if (!formData.instructorName || formData.instructorName.trim().length < 2) {
        errors.push('Instructor name must be at least 2 characters long');
    }
    
    return errors;
}

// Download certificate as PDF (optional feature)
async function downloadCertificate() {
    try {
        const certificate = document.getElementById('certificatePreview');
        const canvas = await html2canvas(certificate, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        const studentName = studentNameInput.value || 'Certificate';
        pdf.save(`${studentName}_Certificate.pdf`);
        
    } catch (error) {
        console.error('Error downloading certificate:', error);
        showStatus('❌ Error downloading certificate. Please try again.', 'error');
    }
}

// Add download button functionality (you can add this button to HTML if needed)
function addDownloadButton() {
    const downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.textContent = '📥 Download Certificate';
    downloadBtn.style.marginTop = '10px';
    downloadBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    downloadBtn.onclick = downloadCertificate;
    
    const formSection = document.querySelector('.form-section');
    formSection.appendChild(downloadBtn);
}

// Initialize download button
document.addEventListener('DOMContentLoaded', () => {
    addDownloadButton();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!generateBtn.disabled) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Ctrl/Cmd + D to download certificate
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadCertificate();
    }
});
