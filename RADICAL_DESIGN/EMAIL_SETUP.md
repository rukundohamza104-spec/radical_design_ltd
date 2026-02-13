# Email Setup Guide for Password Reset

This guide explains how to configure email sending for password reset functionality.

## Overview

The application supports multiple email providers. By default, it logs reset links to the console for development. To enable actual email sending, configure one of the supported providers.

## Supported Email Providers

### 1. Nodemailer (Recommended - Most Flexible)

Supports Gmail, Outlook, and any SMTP server.

#### Setup Steps:

1. Install Nodemailer:
```bash
npm install nodemailer
# or
pnpm add nodemailer
```

2. Add environment variables to `.env` file:
```env
EMAIL_PROVIDER=nodemailer
EMAIL_FROM=your-email@gmail.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password
```

#### For Gmail:
1. Enable 2-factor authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password as `EMAIL_SMTP_PASS`

#### For Other Email Services:
- **Outlook**: `smtp-mail.outlook.com` on port 587
- **SendGrid**: `smtp.sendgrid.net` on port 587
- **AWS SES**: Check AWS documentation for SMTP settings
- **Any SMTP Server**: Use your server's SMTP details

### 2. Resend (Modern, API-based)

Great for transactional emails with excellent deliverability.

#### Setup Steps:

1. Install Resend:
```bash
npm install resend
# or
pnpm add resend
```

2. Sign up at https://resend.com and get your API key

3. Add environment variables:
```env
EMAIL_PROVIDER=resend
EMAIL_FROM=noreply@radicaldesign.com
RESEND_API_KEY=your-api-key-here
```

### 3. Development Mode (Default)

For development and testing, emails are logged to the console.

```env
EMAIL_PROVIDER=console
```

## How It Works

When an admin requests a password reset:

1. A reset token is generated (valid for 1 hour)
2. A reset link is created with the token
3. The email is sent to the admin's email address (from admin settings)
4. Admin receives the email with a secure link to reset their password
5. Email includes:
   - Professional HTML-formatted template
   - Plain text version for compatibility
   - Security warnings
   - Instructions for password reset

## Email Template

The password reset email includes:

- **Header**: RADICAL DESIGN branding
- **Greeting**: Personalized message
- **Reset Button**: One-click reset link
- **Security Info**: Token expiration notice
- **Instructions**: Step-by-step reset process
- **Footer**: Company info and unsubscribe

## Testing Email Sending

### In Development:
1. Ensure `EMAIL_PROVIDER=console` or provider is not set
2. Request a password reset from `/admin/forgot-password`
3. Check the server console logs
4. The reset link will be displayed in console output

### With Nodemailer:
1. Configure SMTP settings in `.env`
2. Request a password reset
3. Check the email inbox (may take a few seconds)
4. Verify you received the email with the reset link

### With Resend:
1. Configure Resend API key
2. Request a password reset
3. Check the Resend dashboard for delivery status
4. Email will be delivered to admin email address

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**: Verify all EMAIL_* variables are set correctly
2. **Check Credentials**: Test SMTP credentials separately
3. **Check Firewall**: Ensure outbound SMTP connections are allowed
4. **Check Logs**: Review server logs for error messages

### Gmail Authentication Issues

If using Gmail:
1. Verify 2FA is enabled: https://myaccount.google.com/security
2. Generate new App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password (without spaces)
4. Clear any previous cached credentials

### Resend API Issues

1. Verify API key is correct: https://resend.com/api-keys
2. Check email domain verification in Resend dashboard
3. Ensure `EMAIL_FROM` matches verified domain

## Email Content Customization

To customize the email template, edit the `generateEmailContent()` function in `server/email.ts`:

```typescript
function generateEmailContent(
  adminName: string,
  resetLink: string
): { subject: string; html: string; text: string } {
  // Customize subject, HTML, and text here
}
```

## Security Best Practices

1. **Never commit credentials**: Use environment variables, never hardcode passwords
2. **Use App Passwords**: For Gmail, always use App Passwords, not your main password
3. **Token Expiration**: Reset tokens expire after 1 hour
4. **One-time Use**: Tokens can only be used once
5. **HTTPS Only**: Always use HTTPS in production

## Production Deployment

1. Set `NODE_ENV=production` to hide reset links from API responses
2. Use a professional email service (Resend, SendGrid, AWS SES)
3. Configure proper DNS records (SPF, DKIM, DMARC)
4. Monitor email delivery rates
5. Set up email templates for branding consistency

## Environment Variables Reference

```env
# Email Provider (console, nodemailer, resend)
EMAIL_PROVIDER=console

# From Address
EMAIL_FROM=noreply@radicaldesign.com

# Nodemailer Settings
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password

# Resend Settings
RESEND_API_KEY=your-api-key

# App URL (for reset links)
APP_URL=https://yoursite.com
```

## Support

For issues with email configuration:

1. Check the setup guide for your email provider
2. Review server logs for detailed error messages
3. Test credentials independently
4. Verify firewall and network settings
5. Contact your email service provider's support

---

**Last Updated**: February 2026
**Version**: 1.0
