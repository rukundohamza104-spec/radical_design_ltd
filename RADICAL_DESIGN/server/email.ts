/**
 * Email Service for sending password reset links
 * 
 * Supports multiple email providers:
 * - Nodemailer (Gmail, Outlook, Custom SMTP)
 * - Resend.dev
 * - AWS SES
 * 
 * Configuration via environment variables
 */

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "console";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@radicaldesign.com";

/**
 * Send password reset OTP email
 */
export async function sendPasswordResetOTPEmail(
  toEmail: string,
  adminName: string,
  otpCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailContent = generateOTPEmailContent(adminName, otpCode);

    switch (EMAIL_PROVIDER) {
      case "nodemailer":
        return await sendViaNodemailer(toEmail, emailContent);
      case "resend":
        return await sendViaResend(toEmail, emailContent);
      case "console":
      default:
        return sendViaConsole(toEmail, emailContent);
    }
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: "Failed to send email",
    };
  }
}

/**
 * Generate OTP email content
 */
function generateOTPEmailContent(
  adminName: string,
  otpCode: string
): { subject: string; html: string; text: string } {
  const subject = "RADICAL DESIGN - Password Reset Verification Code";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
          .otp-section { background: white; padding: 30px; border: 2px dashed #d4af37; margin: 20px 0; text-align: center; border-radius: 8px; }
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #d4af37;
            letter-spacing: 10px;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
          }
          .otp-note { color: #666; font-size: 14px; margin-top: 15px; }
          .timer { background: #e8f4f8; padding: 15px; border-radius: 4px; margin: 20px 0; color: #0066cc; font-weight: bold; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px; color: #856404; font-size: 14px; margin: 20px 0; }
          @media (max-width: 600px) {
            .container { padding: 10px; }
            .header { padding: 20px; }
            .header h1 { font-size: 20px; }
            .content { padding: 20px; }
            .otp-code { font-size: 36px; letter-spacing: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RADICAL DESIGN Ltd</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${adminName},</div>

            <p>You requested to reset your admin account password. Use the verification code below to proceed:</p>

            <div class="otp-section">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code</p>
              <div class="otp-code">${otpCode}</div>
              <p class="otp-note">This code is valid for 10 minutes</p>
            </div>

            <div class="timer">
              <p style="margin: 0;">⏱️ This code expires in 10 minutes</p>
            </div>

            <div class="warning">
              <strong>Security Notice:</strong> Never share this code with anyone. RADICAL DESIGN staff will never ask for this code.
            </div>

            <p><strong>What to do next:</strong></p>
            <ol>
              <li>Go to the password reset page on our website</li>
              <li>Enter the verification code shown above</li>
              <li>Once verified, create your new password</li>
              <li>Your new password will be active immediately</li>
            </ol>

            <p><strong>Didn't request this?</strong></p>
            <p>If you didn't request a password reset, your account is safe. Just ignore this email. This code will expire automatically in 10 minutes.</p>

            <div class="footer">
              <p>This is an automated email from RADICAL DESIGN Ltd Admin Panel. Please do not reply directly to this email.</p>
              <p>&copy; ${new Date().getFullYear()} RADICAL DESIGN Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
RADICAL DESIGN Ltd - Password Reset Verification Code

Hi ${adminName},

You requested to reset your admin account password. Use the verification code below to proceed:

YOUR VERIFICATION CODE: ${otpCode}

This code is valid for 10 minutes.

WHAT TO DO NEXT:
1. Go to the password reset page on our website
2. Enter the verification code shown above
3. Once verified, create your new password
4. Your new password will be active immediately

SECURITY NOTICE:
Never share this code with anyone. RADICAL DESIGN staff will never ask for this code.

DIDN'T REQUEST THIS?
If you didn't request a password reset, your account is safe. Just ignore this email. This code will expire automatically in 10 minutes.

This is an automated email from RADICAL DESIGN Ltd Admin Panel.
© ${new Date().getFullYear()} RADICAL DESIGN Ltd. All rights reserved.
  `;

  return { subject, html, text };
}

/**
 * Generate HTML email content (legacy)
 */
function generateEmailContent(
  adminName: string,
  resetLink: string
): { subject: string; html: string; text: string } {
  const subject = "RADICAL DESIGN - Password Reset Request";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
          .reset-section { background: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
          .reset-button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
          .reset-link { word-break: break-all; color: #0066cc; font-size: 12px; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px; color: #856404; font-size: 14px; margin: 20px 0; }
          @media (max-width: 600px) {
            .container { padding: 10px; }
            .header { padding: 20px; }
            .header h1 { font-size: 20px; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RADICAL DESIGN Ltd</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${adminName},</div>
            
            <p>You requested a password reset for your admin account. Click the button below to create a new password:</p>
            
            <div class="reset-section">
              <p><strong>Password Reset Link:</strong></p>
              <a href="${resetLink}" class="reset-button">Reset Password</a>
              <p class="reset-link">Or copy this link: ${resetLink}</p>
            </div>
            
            <div class="warning">
              <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </div>
            
            <p><strong>Why we sent this:</strong></p>
            <ul>
              <li>A password reset was requested for your admin account</li>
              <li>This link is only valid for 1 hour</li>
              <li>If you didn't request this, your account is still secure</li>
            </ul>
            
            <p><strong>What to do:</strong></p>
            <ol>
              <li>Click the reset password button above</li>
              <li>Enter your new password (at least 6 characters)</li>
              <li>You'll be able to login with your new password</li>
            </ol>
            
            <div class="footer">
              <p>This is an automated email from RADICAL DESIGN Ltd Admin Panel. Please do not reply directly to this email.</p>
              <p>&copy; ${new Date().getFullYear()} RADICAL DESIGN Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
RADICAL DESIGN Ltd - Password Reset Request

Hi ${adminName},

You requested a password reset for your admin account. Visit the link below to create a new password:

${resetLink}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Security Note:
- A password reset was requested for your admin account
- This link is only valid for 1 hour
- If you didn't request this, your account is still secure

What to do:
1. Click the link above or copy it to your browser
2. Enter your new password (at least 6 characters)
3. You'll be able to login with your new password

This is an automated email from RADICAL DESIGN Ltd Admin Panel.
© ${new Date().getFullYear()} RADICAL DESIGN Ltd. All rights reserved.
  `;

  return { subject, html, text };
}

/**
 * Send via Nodemailer (Gmail, Outlook, or custom SMTP)
 */
async function sendViaNodemailer(
  toEmail: string,
  emailContent: { subject: string; html: string; text: string }
): Promise<{ success: boolean; error?: string }> {
  // This requires: npm install nodemailer
  // Set environment variables:
  // EMAIL_PROVIDER=nodemailer
  // EMAIL_FROM=your-email@gmail.com
  // EMAIL_SMTP_HOST=smtp.gmail.com
  // EMAIL_SMTP_PORT=587
  // EMAIL_SMTP_USER=your-email@gmail.com
  // EMAIL_SMTP_PASS=your-app-password

  try {
    // @ts-ignore - nodemailer is an optional dependency
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.default.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: parseInt(process.env.EMAIL_SMTP_PORT || "587"),
      secure: process.env.EMAIL_SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: toEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Nodemailer error:", error);
    return {
      success: false,
      error: "Failed to send email via Nodemailer. Make sure nodemailer is installed.",
    };
  }
}

/**
 * Send via Resend.dev
 */
async function sendViaResend(
  toEmail: string,
  emailContent: { subject: string; html: string; text: string }
): Promise<{ success: boolean; error?: string }> {
  // This requires: npm install resend
  // Set environment variable: RESEND_API_KEY

  try {
    // @ts-ignore - resend is an optional dependency
    const resendModule = await import("resend");
    const { Resend } = resendModule;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: toEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log("Email sent via Resend:", data.id);
    return { success: true };
  } catch (error) {
    console.error("Resend error:", error);
    return {
      success: false,
      error: "Failed to send email via Resend. Make sure resend is installed.",
    };
  }
}

/**
 * Send via Console (for development/testing)
 */
function sendViaConsole(
  toEmail: string,
  emailContent: { subject: string; html: string; text: string }
): { success: boolean; error?: string } {
  console.log("=".repeat(80));
  console.log("[EMAIL] Password Reset Email");
  console.log("=".repeat(80));
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${emailContent.subject}`);
  console.log(`From: ${EMAIL_FROM}`);
  console.log("-".repeat(80));
  console.log("HTML Content:");
  console.log(emailContent.html);
  console.log("-".repeat(80));
  console.log("Text Content:");
  console.log(emailContent.text);
  console.log("=".repeat(80));

  return { success: true };
}
