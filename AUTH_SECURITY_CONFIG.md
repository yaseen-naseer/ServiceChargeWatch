# Supabase Auth Security Configuration Guide

**Generated:** 2025-10-12
**Project:** ServiceChargeWatch
**Status:** Configuration Required

---

## Overview

This guide documents the Supabase Auth security configurations that need to be enabled through the Supabase Dashboard. These settings cannot be configured via migrations or API calls and require manual dashboard access.

---

## 1. Leaked Password Protection

### Status: ⚠️ DISABLED (Needs Configuration)

### What It Does
Supabase Auth can check user passwords against the HaveIBeenPwned database to prevent users from using compromised passwords that have been exposed in data breaches.

### Why It's Important
- **Security**: Prevents users from using passwords that have been leaked in data breaches
- **Best Practice**: Industry-standard password security measure
- **User Protection**: Helps protect user accounts from credential stuffing attacks

### How to Enable

1. **Navigate to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/hxqndjsxhalajlkiemwf
   - Or use the project selector in Supabase Dashboard

2. **Access Auth Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Providers" tab
   - Select "Email" provider

3. **Enable Leaked Password Protection**
   - Find the "Password Security" section
   - Toggle ON "Check for leaked passwords"
   - Click "Save" to apply changes

4. **Verify Configuration**
   - Try signing up with a known leaked password (e.g., "password123")
   - Should see error: "This password has been found in a data breach"

### Reference Documentation
- https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- https://haveibeenpwned.com/Passwords

### Estimated Time
5-10 minutes

---

## 2. Multi-Factor Authentication (MFA)

### Status: ⚠️ INSUFFICIENT OPTIONS (Needs Configuration)

### What It Does
MFA adds an additional layer of security by requiring users to provide a second form of authentication beyond their password.

### Why It's Important
- **Enhanced Security**: Protects against password theft and phishing
- **Industry Standard**: Required for many compliance frameworks
- **Account Protection**: Significantly reduces risk of unauthorized access

### Available MFA Options

#### Option A: Time-based One-Time Password (TOTP)
**Best for:** Most users, works offline

**How to Enable:**
1. Navigate to: Authentication → Configuration → MFA
2. Enable "TOTP (Authenticator App)"
3. Configure settings:
   - Allow users to enroll in MFA: **Enabled**
   - Enforce MFA for all users: **Optional** (consider enabling later)
4. Save changes

**User Experience:**
- Users scan QR code with authenticator app (Google Authenticator, Authy, etc.)
- Enter 6-digit code on login
- Works offline

#### Option B: SMS-based MFA
**Best for:** Users without smartphones or technical expertise

**Requirements:**
- Twilio account (paid service)
- Phone number verification

**How to Enable:**
1. Navigate to: Authentication → Configuration → Phone Auth
2. Enable "Phone (SMS) provider"
3. Configure Twilio:
   - Twilio Account SID
   - Twilio Auth Token
   - Twilio Phone Number
4. Save changes

**Cost Consideration:**
- Twilio charges per SMS sent
- Estimate: $0.0079 per SMS in US
- Factor into operating costs

#### Option C: Email-based Verification Codes
**Best for:** Simpler implementation, no third-party costs

**How to Enable:**
1. Already enabled with email authentication
2. Can be enhanced with magic links
3. Configure in: Authentication → Email Templates

### Recommended Approach

**Phase 1: TOTP (Immediate)**
- Enable TOTP MFA
- Make it optional for users
- Encourage admins to enable MFA

**Phase 2: SMS (Future)**
- Add SMS MFA if budget allows
- Useful for users without smartphones
- Requires Twilio integration

**Phase 3: Enforcement (Production)**
- Require MFA for admin users
- Encourage MFA for all users
- Set up grace period for enrollment

### Implementation Steps

1. **Enable TOTP in Supabase Dashboard**
   ```
   Authentication → Configuration → MFA
   ✓ Enable TOTP
   ✓ Allow user enrollment
   ☐ Enforce for all users (not yet)
   ```

2. **Add MFA UI to Application** (Development Required)
   - Create MFA enrollment page: `/profile/security`
   - Add "Enable MFA" button
   - Implement QR code display
   - Add verification code input
   - Store MFA status in user metadata

3. **Update Authentication Flow** (Development Required)
   - Check if user has MFA enabled after login
   - Prompt for MFA code if enabled
   - Verify code before granting session
   - Handle MFA errors gracefully

4. **Test MFA Flow**
   - Test enrollment process
   - Test login with MFA
   - Test recovery codes
   - Test MFA disable flow

### Reference Documentation
- https://supabase.com/docs/guides/auth/auth-mfa
- https://supabase.com/docs/guides/auth/phone-login

### Estimated Time
- Dashboard configuration: 10 minutes
- UI implementation: 4-6 hours
- Testing: 1-2 hours

---

## 3. Additional Security Configurations

### Email Verification
**Status:** ✅ Enabled (Default)

**Current Configuration:**
- Users must verify email before login
- Verification email sent automatically
- Token expires after 24 hours

### Password Requirements
**Status:** ✅ Configured

**Current Settings:**
- Minimum length: 8 characters (default)
- No maximum length
- No character requirements (letters, numbers, symbols)

**Recommended Enhancements:**
1. Navigate to: Authentication → Policies
2. Consider adding:
   - Minimum 10 characters
   - Require uppercase + lowercase
   - Require numbers
   - Require special characters

### Rate Limiting
**Status:** ✅ Enabled (Default)

**Default Limits:**
- Login attempts: 5 per hour per IP
- Email sends: 4 per hour per user
- Password reset: 2 per hour per user

**Configuration:**
- Currently using Supabase defaults
- Can be adjusted in Dashboard if needed

### Session Management
**Status:** ✅ Configured

**Current Settings:**
- Session timeout: 1 week (default)
- Refresh token rotation: Enabled
- Secure cookies: Enabled (production only)

---

## Priority & Timeline

### Immediate (This Week)
1. ✅ **Enable Leaked Password Protection** (10 minutes)
   - No code changes required
   - Dashboard configuration only
   - Immediate security benefit

### Short-term (Next 2 Weeks)
2. ⏳ **Enable TOTP MFA** (5-8 hours total)
   - Dashboard configuration: 10 minutes
   - UI development: 4-6 hours
   - Testing: 1-2 hours

### Long-term (Next Month)
3. 📋 **SMS MFA (Optional)** (8-12 hours + Twilio costs)
   - Requires Twilio account setup
   - Additional UI development
   - Ongoing SMS costs

### Future Enhancements
4. 📋 **Enhanced Password Policies** (30 minutes)
   - Dashboard configuration
   - User communication

5. 📋 **Enforce MFA for Admins** (1 hour)
   - Middleware update
   - Admin notification

---

## Verification Checklist

After completing configurations:

- [ ] Leaked password protection enabled
- [ ] Test with known leaked password
- [ ] TOTP MFA enabled (if implemented)
- [ ] Test MFA enrollment flow (if implemented)
- [ ] Test MFA login flow (if implemented)
- [ ] Security advisors show no Auth warnings
- [ ] Document changes in changelog
- [ ] Update deployment documentation

---

## References

- **Supabase Auth Documentation**: https://supabase.com/docs/guides/auth
- **Password Security Guide**: https://supabase.com/docs/guides/auth/password-security
- **MFA Documentation**: https://supabase.com/docs/guides/auth/auth-mfa
- **Database Linter**: https://supabase.com/docs/guides/database/database-linter

---

## Support & Troubleshooting

### Common Issues

**Issue:** Can't access Supabase Dashboard
**Solution:** Verify you're logged in at https://supabase.com/dashboard

**Issue:** Changes not taking effect
**Solution:**
- Clear browser cache
- Restart dev server
- Check Supabase project is active

**Issue:** Users can't sign up after enabling leaked password protection
**Solution:**
- Normal behavior for compromised passwords
- Users should choose different password
- Communicate this requirement clearly

---

**Last Updated:** 2025-10-12
**Next Review:** After Auth configurations completed
**Owner:** Development Team
