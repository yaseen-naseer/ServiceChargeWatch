# Service Charge Watch - Vercel Deployment Guide

Complete guide for deploying Service Charge Watch to Vercel production environment.

## Prerequisites

Before deploying, ensure you have:

- ✅ Supabase project set up and configured
- ✅ All database migrations applied
- ✅ RLS policies configured and tested
- ✅ Resend account with API key
- ✅ Git repository with all code committed
- ✅ Vercel account (free tier is sufficient)

## Pre-Deployment Checklist

### 1. Database Readiness

Verify all migrations are applied:

```bash
# Check migration status in Supabase Dashboard
# Go to: Database → Migrations
```

Ensure these migrations exist:
- ✅ `create_tables_and_rls.sql` - Initial schema
- ✅ `add_updated_at_to_sc_records.sql` - Updated timestamp
- ✅ `fix_rls_performance_auth_uid.sql` - RLS optimization
- ✅ `add_foreign_key_indexes.sql` - Performance indexes
- ✅ `fix_function_security_search_path.sql` - Function security
- ✅ `allow_users_edit_own_pending_submissions.sql` - Edit permissions

### 2. Environment Variables Ready

Gather these from your Supabase project:

1. **Supabase URL**: `https://[project-ref].supabase.co`
   - Find at: Supabase Dashboard → Project Settings → API

2. **Supabase Anon Key**: `eyJ...` (long JWT token)
   - Find at: Supabase Dashboard → Project Settings → API

3. **Resend API Key**: `re_...`
   - Find at: Resend Dashboard → API Keys

4. **Production URL**: Will be `https://[your-project].vercel.app`
   - Or your custom domain

### 3. Code Verification

Run final checks:

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

### 4. Git Repository

Ensure all changes are committed:

```bash
git status
git add .
git commit -m "Production ready - all features complete"
git push origin master
```

## Deployment Steps

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard (Recommended)

#### 2.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your repository (GitHub/GitLab/Bitbucket)
5. Click **"Import"**

#### 2.2 Configure Project

Vercel will auto-detect Next.js. Verify settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

#### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[your-anon-key]

# Resend Email Configuration
RESEND_API_KEY=re_[your-api-key]
RESEND_FROM_EMAIL=onboarding@resend.dev

# App Configuration
NEXT_PUBLIC_APP_URL=https://[your-project].vercel.app
```

**Important**:
- Select **"Production"**, **"Preview"**, and **"Development"** for all variables
- Use different Supabase projects for production/preview if desired

#### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Vercel will provide a deployment URL

### Step 3: Deploy via Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Follow prompts to set up project and environment variables.

## Post-Deployment Configuration

### 1. Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL**:
```
https://[your-project].vercel.app
```

**Redirect URLs** (add these):
```
http://localhost:3000/**
https://[your-project].vercel.app/**
https://[your-custom-domain].com/**  (if using custom domain)
```

### 2. Test Authentication Flow

1. Visit your production site
2. Try signing up with a test email
3. Check email inbox for confirmation
4. Complete signup and login
5. Test password reset flow

### 3. Test Admin Access

1. Login as admin user
2. Navigate to `/admin/dashboard`
3. Test approving a submission
4. Verify email notification sent

### 4. Verify Email Sending

1. Submit test data via `/submit`
2. Approve as admin
3. Check email delivery in Resend Dashboard
4. Verify email formatting and links

## Custom Domain Setup (Optional)

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click **"Add Domain"**
3. Enter your domain: `servicechargewatch.com`
4. Click **"Add"**

### 2. Configure DNS

Add these DNS records at your domain registrar:

**For apex domain (servicechargewatch.com)**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Wait for DNS Propagation

- Usually takes 5-60 minutes
- Vercel will auto-provision SSL certificate
- Check status in Vercel dashboard

### 4. Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain:

```env
NEXT_PUBLIC_APP_URL=https://servicechargewatch.com
```

Redeploy to apply changes.

### 5. Update Supabase Redirect URLs

Add custom domain to Supabase redirect URLs:

```
https://servicechargewatch.com/**
```

## Resend Domain Setup (Recommended for Production)

For better email deliverability, verify your domain with Resend:

### 1. Add Domain in Resend

1. Go to Resend Dashboard → Domains
2. Click **"Add Domain"**
3. Enter your domain: `servicechargewatch.com`

### 2. Add DNS Records

Resend will provide DNS records to add:

**SPF Record**:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Records** (provided by Resend):
```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

**DMARC Record**:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@servicechargewatch.com
```

### 3. Verify Domain

1. Wait 15-30 minutes for DNS propagation
2. Click **"Verify"** in Resend Dashboard
3. Update environment variable:

```env
RESEND_FROM_EMAIL=noreply@servicechargewatch.com
```

4. Redeploy application

## Monitoring and Maintenance

### 1. Vercel Analytics

Enable Vercel Analytics for free:

1. Go to Project → Analytics
2. Click **"Enable Analytics"**
3. Add this to your app layout (if desired):

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Monitor Logs

View deployment and runtime logs:

1. Go to Project → Deployments
2. Click on latest deployment
3. View **"Build Logs"** and **"Function Logs"**

### 3. Monitor Email Delivery

Check Resend Dashboard:

1. View **"Logs"** for all sent emails
2. Monitor delivery status
3. Check bounce/spam rates

### 4. Monitor Database

Check Supabase Dashboard:

1. **Database → Activity**: Monitor query performance
2. **Auth → Users**: Track user signups
3. **Database → Advisors**: Check for security/performance issues

### 5. Set Up Uptime Monitoring (Optional)

Use free services like:

- **UptimeRobot**: https://uptimerobot.com
- **Better Uptime**: https://betteruptime.com
- **Freshping**: https://www.freshworks.com/website-monitoring

Monitor:
- Homepage: `https://[your-domain].com`
- API health: `https://[your-domain].com/api/health` (create if needed)

## Continuous Deployment

Vercel automatically deploys on git push:

### Production Deployments

```bash
# Merge to main/master branch
git checkout master
git pull
git merge feature-branch
git push origin master
```

Vercel will:
1. Auto-detect push to main branch
2. Run build
3. Deploy to production
4. Update your domain

### Preview Deployments

Every pull request gets a preview URL:

```bash
# Create feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Create PR on GitHub → Vercel creates preview deployment

## Rollback Procedure

If deployment has issues:

### Option 1: Via Vercel Dashboard

1. Go to Project → Deployments
2. Find last working deployment
3. Click **"⋮"** menu → **"Promote to Production"**

### Option 2: Via Git

```bash
# Revert to last working commit
git revert HEAD
git push origin master
```

Vercel will auto-deploy the reverted version.

## Performance Optimization

### 1. Edge Functions (If Needed)

For regions closer to users:

```typescript
// In route handler
export const runtime = 'edge'
export const preferredRegion = ['sin1', 'hkg1', 'bom1']
```

### 2. Image Optimization

Ensure using Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={100}
  priority={true}  // For above-the-fold images
/>
```

### 3. Enable Vercel Caching

Cache static assets:

```tsx
// In next.config.js (create if needed)
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Security Checklist

Before going fully public:

- ✅ All RLS policies tested
- ✅ Admin authentication working
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Environment variables secured
- ✅ No sensitive data in logs
- ✅ Rate limiting configured (Supabase auto-provides)
- ✅ Email verification required
- ✅ Password reset flow secure

## Troubleshooting

### Build Fails

**Error**: Module not found

```bash
# Clear cache and rebuild locally
rm -rf .next node_modules
npm install
npm run build
```

If successful locally, check Vercel logs for specific error.

**Error**: Environment variable undefined

- Verify all env vars are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Authentication Issues

**Error**: Users can't login after deployment

- Check Supabase redirect URLs include production domain
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check browser console for CORS errors

**Fix**:
1. Update Supabase redirect URLs
2. Clear browser cache
3. Try in incognito mode

### Email Not Sending

**Error**: Emails not arriving

- Check Resend API key is correct
- Verify `RESEND_FROM_EMAIL` is valid
- Check Resend dashboard for error logs
- Ensure email isn't in spam folder

**Fix**:
1. Verify domain with Resend (if using custom domain)
2. Check SPF/DKIM records
3. Test with different email provider (Gmail, Outlook)

### Database Connection Issues

**Error**: Can't connect to database

- Verify Supabase project is not paused
- Check connection string is correct
- Verify anon key is valid (not service role key for client-side)

**Fix**:
1. Go to Supabase Dashboard → Project Settings → API
2. Copy fresh anon key
3. Update in Vercel
4. Redeploy

## Cost Estimation

### Vercel Costs

**Hobby Plan (Free)**:
- 100GB bandwidth/month
- 100 build hours/month
- Unlimited deployments
- Suitable for: MVP, testing, low traffic

**Pro Plan ($20/month)**:
- 1TB bandwidth/month
- 400 build hours/month
- Team collaboration
- Suitable for: Production apps with moderate traffic

### Supabase Costs

**Free Plan**:
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth
- Suitable for: MVP, testing

**Pro Plan ($25/month)**:
- 8GB database
- 100GB file storage
- 100,000 monthly active users
- 250GB bandwidth
- Daily backups
- Suitable for: Production apps

### Resend Costs

**Free Plan**:
- 3,000 emails/month
- 100 emails/day
- Suitable for: Testing, low-volume apps

**Pro Plan (Starting at $20/month)**:
- 50,000 emails/month
- Custom sending domain
- Suitable for: Production apps

### Total Estimated Monthly Cost

**Startup (Free Tier)**:
- Vercel: $0
- Supabase: $0
- Resend: $0
- **Total: $0/month** (with usage limits)

**Production (Paid Tier)**:
- Vercel Pro: $20
- Supabase Pro: $25
- Resend Pro: $20
- **Total: $65/month**

## Support and Resources

### Official Documentation

- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs

### Community Support

- **Vercel Discord**: https://vercel.com/discord
- **Supabase Discord**: https://discord.supabase.com
- **Next.js Discussions**: https://github.com/vercel/next.js/discussions

### Getting Help

If you encounter issues:

1. Check deployment logs in Vercel dashboard
2. Review Supabase logs and advisors
3. Check Resend delivery logs
4. Search documentation and community forums
5. Create issue in project repository

## Conclusion

Your Service Charge Watch application is now deployed to production!

**Next Steps**:
1. Share URL with beta testers
2. Monitor usage and performance
3. Gather user feedback
4. Iterate on features
5. Scale infrastructure as needed

**Remember**: Start with free tiers and upgrade as your user base grows. Monitor usage closely to avoid unexpected charges.

---

**Deployment Date**: October 12, 2025
**Version**: 1.0.0 - Production Ready
**Status**: ✅ All systems operational
