# Vercel Environment Variables

Copy these exact values into your Vercel project settings.

## How to Add in Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables** section
3. For each variable below:
   - Click **"+ Add More"**
   - Enter the **Key** (left column)
   - Enter the **Value** (right column)
   - Select all environments: **Production**, **Preview**, and **Development**
4. Click **"Save"** after adding all variables
5. Click **"Deploy"** to deploy your project

---

## Environment Variables to Add:

### 1. Supabase URL
**Key:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**Value:**
```
https://hxqndjsxhalajlkiemwf.supabase.co
```

---

### 2. Supabase Anon Key
**Key:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cW5kanN4aGFsYWpsa2llbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODUwMzksImV4cCI6MjA3NTc2MTAzOX0.-yvpU9XNalVIBWdKzvkDE2CoqzoOK906pA2WvBwxLRo
```

---

### 3. Resend API Key
**Key:**
```
RESEND_API_KEY
```

**Value:**
```
re_ixTmUvq6_NDQeyquguRv4w6Q5ycKzyMpL
```

---

### 4. Resend From Email
**Key:**
```
RESEND_FROM_EMAIL
```

**Value:**
```
onboarding@resend.dev
```

---

### 5. App URL (Update After Deployment)
**Key:**
```
NEXT_PUBLIC_APP_URL
```

**Value (Temporary - Update after getting Vercel URL):**
```
https://service-charge-watch.vercel.app
```

**⚠️ Important:** After your first deployment, Vercel will give you a URL like `https://service-charge-watch-xxx.vercel.app`. Come back and update this variable with your actual Vercel URL.

---

## Quick Copy-Paste Format

If you prefer to paste all at once, here's the format for Vercel's bulk import:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hxqndjsxhalajlkiemwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cW5kanN4aGFsYWpsa2llbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODUwMzksImV4cCI6MjA3NTc2MTAzOX0.-yvpU9XNalVIBWdKzvkDE2CoqzoOK906pA2WvBwxLRo
RESEND_API_KEY=re_ixTmUvq6_NDQeyquguRv4w6Q5ycKzyMpL
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=https://service-charge-watch.vercel.app
```

---

## After Deployment Steps:

1. **Copy your Vercel deployment URL** (e.g., `https://service-charge-watch-xxx.vercel.app`)

2. **Update NEXT_PUBLIC_APP_URL**:
   - Go to Vercel → Project Settings → Environment Variables
   - Find `NEXT_PUBLIC_APP_URL`
   - Click Edit and update with your actual URL
   - Save and redeploy

3. **Update Supabase Redirect URLs**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project: **ServiceChargeWatch**
   - Navigate to: **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**:
     ```
     https://your-actual-vercel-url.vercel.app/**
     ```
   - Save changes

4. **Test your deployment**:
   - Visit your Vercel URL
   - Try signing up/logging in
   - Submit test data
   - Verify admin dashboard access

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Ensure all environment variables are set correctly
- Verify no typos in variable names or values

### Authentication Not Working
- Verify Supabase redirect URLs include your Vercel domain
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Clear browser cache and try incognito mode

### Emails Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for delivery logs
- Ensure `RESEND_FROM_EMAIL` is valid

---

## Security Notes

⚠️ **Important Security Information:**

- **Never commit these values to Git** (`.env*` files are already in `.gitignore`)
- The **Supabase Anon Key** is safe to expose publicly (it's for client-side use)
- The **Resend API Key** should be kept secure (only add to Vercel, not in client-side code)
- These environment variables are automatically encrypted and secured by Vercel

---

## Need Help?

Refer to these guides in your repository:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `EMAIL_SETUP.md` - Email configuration details
- `README.md` - Project overview and setup

---

**Generated:** October 12, 2025
**Project:** Service Charge Watch
**Version:** 1.0.0
