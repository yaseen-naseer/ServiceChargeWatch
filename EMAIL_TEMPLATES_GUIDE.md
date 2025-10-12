# Email Templates Guide

This guide explains how to customize email templates for authentication flows in Service Charge Watch.

## Available Email Templates

We've created professional, branded email templates for:

1. **Password Reset** - `getPasswordResetEmail()`
2. **Welcome Email** - `getWelcomeEmail()`
3. **Submission Approved** - `getSubmissionApprovedEmail()` ✅ Already implemented
4. **Submission Rejected** - `getSubmissionRejectedEmail()` ✅ Already implemented

All templates are located in `lib/email/templates.tsx`.

## Supabase Auth Email Configuration

Supabase handles authentication emails automatically (signup confirmation, password reset, magic links). To customize these templates:

### Step 1: Access Email Templates in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Customize Auth Email Templates

Supabase provides these default templates that you can customize:

#### Confirm Signup Template

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

**Recommended Customization:**
Use our `getWelcomeEmail()` template styling. In the Supabase template editor:

```html
<p>Welcome to Service Charge Watch!</p>
<p>Click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>
```

#### Magic Link Template

```html
<h2>Magic Link</h2>

<p>Follow this link to login:</p>
<p><a href="{{ .ConfirmationURL }}">Log In</a></p>
```

#### Change Email Address Template

```html
<h2>Confirm Change of Email</h2>

<p>Follow this link to confirm the update of your email from {{ .Email }} to {{ .NewEmail }}:</p>
<p><a href="{{ .ConfirmationURL }}">Change Email</a></p>
```

#### Reset Password Template

```html
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

**Recommended Customization:**
Use our `getPasswordResetEmail()` template styling. However, note that Supabase's template editor uses Go templating and doesn't support the full HTML we've designed.

### Step 3: Alternative - Use Supabase Email Redirects

Instead of customizing Supabase's built-in templates, you can:

1. Keep Supabase templates minimal
2. Redirect to custom pages in your app
3. Send custom emails from your app after the redirect

**Example Flow:**
1. User requests password reset
2. Supabase sends basic email with link
3. Link redirects to `/auth/reset-password?token=xxx`
4. Your app sends a custom branded email using Resend with our templates

### Step 4: Configure Email Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

```
Site URL: https://your-domain.com
Redirect URLs:
  - http://localhost:3000/**
  - https://your-domain.com/**
```

## Using Custom Templates with Resend

For transactional emails (not auth), use our Resend integration:

### Password Reset Email

```typescript
import { getPasswordResetEmail } from '@/lib/email/templates'
import { sendEmail } from '@/lib/email/send'

await sendEmail({
  to: user.email,
  ...getPasswordResetEmail({
    resetLink: resetUrl,
    userEmail: user.email,
  })
})
```

### Welcome Email

```typescript
import { getWelcomeEmail } from '@/lib/email/templates'
import { sendEmail } from '@/lib/email/send'

await sendEmail({
  to: user.email,
  ...getWelcomeEmail({
    userEmail: user.email,
    confirmLink: confirmationUrl, // optional
  })
})
```

## Email Template Best Practices

### Design Principles

1. **Mobile-First**: All templates are responsive and work on mobile devices
2. **Brand Consistency**: Uses Service Charge Watch colors (blue gradient)
3. **Clear CTAs**: Prominent buttons for main actions
4. **Security Notes**: Clear expiry times and security warnings
5. **Plain Text Fallback**: Every template includes a text-only version

### Security Considerations

1. **Link Expiry**: Password reset links expire in 1 hour (Supabase default)
2. **One-Time Use**: Links can only be used once
3. **Email Verification**: Users must verify email before accessing features
4. **Rate Limiting**: Supabase provides built-in rate limiting for auth emails

### Testing Email Templates

#### Local Testing with Resend

1. Resend provides a test mode for development
2. Emails sent to test addresses appear in Resend dashboard
3. Use your own email for testing

```typescript
// Test password reset email
const testEmail = await sendEmail({
  to: 'your-test-email@example.com',
  ...getPasswordResetEmail({
    resetLink: 'http://localhost:3000/auth/reset-password?token=test',
    userEmail: 'test@example.com',
  })
})
```

#### Preview Email Templates

You can preview templates in your browser:

```typescript
// In a test route or component
import { getPasswordResetEmail } from '@/lib/email/templates'

const preview = getPasswordResetEmail({
  resetLink: 'http://localhost:3000/auth/reset-password?token=preview',
  userEmail: 'preview@example.com',
})

// Render preview.html in an iframe or new window
```

## Environment Variables

Required for custom email sending:

```bash
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev  # or your verified domain

# App URL for email links
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

## Email Deliverability

### Resend Setup

1. Sign up at [Resend.com](https://resend.com)
2. Verify your sending domain (improves deliverability)
3. Add API key to `.env.local`

### Domain Verification (Production)

For best deliverability, verify your domain:

1. In Resend Dashboard → Domains
2. Add your domain (e.g., servicechargewatch.com)
3. Add DNS records (SPF, DKIM, DMARC)
4. Wait for verification (usually < 1 hour)
5. Update `RESEND_FROM_EMAIL` to use your domain

```bash
RESEND_FROM_EMAIL=noreply@servicechargewatch.com
```

## Troubleshooting

### Emails Not Sending

1. Check Resend API key is set correctly
2. Verify email addresses are valid
3. Check Resend dashboard for errors
4. Ensure rate limits aren't exceeded

### Styling Issues

1. Email clients have limited CSS support
2. Use inline styles (already done in templates)
3. Test in multiple email clients
4. Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com) for testing

### Links Not Working

1. Verify `NEXT_PUBLIC_APP_URL` is set correctly
2. Check link format in email template
3. Ensure middleware is configured properly
4. Test links in both development and production

## Future Enhancements

Potential email templates to add:

1. **Admin Notifications** - Alert admins of new submissions
2. **Weekly Digest** - Summary of new data for subscribers
3. **Account Deleted** - Confirmation email
4. **Data Export Ready** - When user requests data export
5. **Security Alerts** - Suspicious login attempts

## Support

For issues with email delivery or customization:

1. Check Resend dashboard for delivery status
2. Review Supabase auth logs
3. Test with different email providers (Gmail, Outlook, etc.)
4. Contact support if issues persist
