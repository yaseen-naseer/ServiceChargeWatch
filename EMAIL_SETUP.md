# Email Notifications Setup

This document explains how to set up email notifications for Service Charge Watch using Resend.

## Overview

The application sends automated email notifications to submitters when their submissions are:
- ✅ **Approved** - Notification with submission details and leaderboard link
- ❌ **Rejected** - Notification with rejection reason and resubmit link

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Navigate to the [API Keys](https://resend.com/api-keys) page
2. Click "Create API Key"
3. Give it a name (e.g., "Service Charge Watch - Production")
4. Copy the API key (it will only be shown once)

### 3. Configure Domain (Optional but Recommended)

For production use, you should verify your own domain:

1. Go to the [Domains](https://resend.com/domains) page
2. Click "Add Domain"
3. Enter your domain (e.g., `servicechargewatch.com`)
4. Follow the DNS configuration instructions
5. Wait for verification (usually takes a few minutes)

**Note:** For development, you can use the default `onboarding@resend.dev` sender, but it has limitations.

### 4. Add Environment Variables

Add the following to your `.env.local` file:

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Email sender address (use your verified domain)
RESEND_FROM_EMAIL=notifications@yourdomain.com

# Application URL for email links
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**For development:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Restart Your Development Server

```bash
npm run dev
```

## Email Templates

### Approval Email
- Modern gradient design matching the app
- Submission details (hotel, period, amounts)
- Direct link to view on leaderboard
- Encouraging message about transparency

### Rejection Email
- Clear feedback with rejection reason
- Submission details for reference
- Direct link to submit again
- Supportive messaging

## Features

- **Automatic Sending**: Emails are sent automatically when admins approve or reject submissions
- **Bulk Support**: Works with both single and bulk review actions
- **Graceful Failure**: If email service is not configured, the app continues to work (with console warnings)
- **HTML & Plain Text**: Both formats included for maximum compatibility
- **Responsive Design**: Emails look great on desktop and mobile

## Testing Emails

### Development Testing

1. Set up Resend with test API key
2. Use your own email address as the submitter
3. Submit a test entry
4. Approve or reject it from the admin dashboard
5. Check your inbox

### Production Testing

Before going live:
1. Test with a small group of users
2. Verify all email links work correctly
3. Check spam folder placement
4. Test both approval and rejection flows
5. Verify formatting on different email clients

## Monitoring

### Resend Dashboard

Monitor email delivery in the [Resend dashboard](https://resend.com/emails):
- View sent emails
- Check delivery status
- See open rates (if enabled)
- Debug failed deliveries

### Application Logs

Email sending is logged in the console:
- Success: `Approval email sent successfully`
- Failure: `Error sending approval email: [error message]`

## Rate Limits

Resend free tier includes:
- 100 emails per day
- 3,000 emails per month

For higher volumes, upgrade to a paid plan.

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Ensure `RESEND_API_KEY` is set correctly
2. **Check Console**: Look for error messages in server logs
3. **Verify Domain**: If using custom domain, ensure it's verified
4. **Check Rate Limits**: Ensure you haven't exceeded your plan limits

### Emails in Spam

1. **Verify Domain**: Use a verified custom domain (not onboarding@resend.dev)
2. **Add SPF/DKIM**: Follow Resend's DNS configuration instructions
3. **Test Content**: Avoid spam trigger words
4. **Warm Up Domain**: Start with lower volumes

### Wrong Sender Address

Ensure `RESEND_FROM_EMAIL` matches your verified domain:
```bash
# ✅ Correct (if yourdomain.com is verified)
RESEND_FROM_EMAIL=notifications@yourdomain.com

# ❌ Wrong (if yourdomain.com is not verified)
RESEND_FROM_EMAIL=notifications@yourdomain.com

# ✅ OK for development
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Future Enhancements

Potential improvements to email system:
- [ ] Email preferences (opt-in/opt-out)
- [ ] Digest emails (weekly summary)
- [ ] Admin notification emails
- [ ] Email templates customization UI
- [ ] Multi-language support
- [ ] Track email open rates

## Support

For Resend-specific issues:
- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)

For application-specific issues:
- Check server logs
- Review email template code in `/lib/email/`
