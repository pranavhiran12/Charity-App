const nodemailer = require("nodemailer");



if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in .env file");
}

// ✅ Create transporter only once (reuse for both functions)
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Sends a simple text email
const sendEmail = async(to, subject, text) => {
    try {
        const mailOptions = {
            from: `"TwoPresents" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📨 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
    }
};

// ✅ Sends a verification email with clickable link
const sendVerificationEmail = async(email, token) => {
    try {
        const link = `http://localhost:5000/api/auth/verify/${token}`;
        const html = `
            <h3>Email Verification</h3>
            <p>Click the link below to verify your email:</p>
            <a href="${link}">${link}</a>
        `;

        await transporter.sendMail({
            from: `"TwoPresents" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html,
        });

        console.log(`📧 Verification email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending verification email:", error.message);
    }
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
};