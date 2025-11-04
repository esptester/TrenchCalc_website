# AWS Cognito Admin User Pool Setup Guide

## Overview

**Separate User Pool for Developer/Admin Access**

This guide sets up a **separate** Cognito User Pool specifically for developer/admin access to the annotation tool. This is **completely separate** from your TrenchCalc app User Pool.

**Why Separate Pools?**
- ✅ **Security isolation** - Admin access separate from user access
- ✅ **Different policies** - Admin-specific MFA, password policies
- ✅ **Easier management** - Add/remove admins without affecting app users
- ✅ **Audit separation** - Clear separation of admin vs user activities

---

## Step 1: Create Admin User Pool (AWS Console)

### 1.1 Navigate to Cognito

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Select region: **ap-southeast-2** (Sydney) or your preferred region
3. Navigate to **Amazon Cognito** service
4. Click **User pools** in the left sidebar

### 1.2 Create New User Pool

1. Click **Create user pool** button (top right)
2. **Configure sign-in experience:**
   - **Sign-in options:** Check ✅ **Email**
   - Uncheck all other options (username, phone)
   - Click **Next**

3. **Configure security requirements:**
   - **Password policy:** Choose **Cognito default** (recommended)
     - Minimum length: 8 characters
     - Contains at least 1 number, uppercase, lowercase, special character
   - **MFA:** Select **Required** (recommended for admins)
   - **MFA methods:** 
     - ✅ Enable **TOTP (Software token)** (Google Authenticator, Authy)
     - ❌ Disable SMS (to avoid SMS costs)
   - Click **Next**

4. **Configure sign-up experience:**
   - **Self-service sign-up:** ❌ **Disable** (admins added manually)
   - **Cognito-assisted verification:** ✅ **Enable**
   - **Verification method:** **Email**
   - Click **Next**

5. **Configure message delivery:**
   - **Email provider:** Choose **Send email with Cognito**
   - (You can configure SES later if needed)
   - Click **Next**

6. **Integrate your app:**
   - **User pool name:** `engsite-admin-pool` (or your preferred name)
   - **Tags:** Optional (can add later)
   - Click **Next**

7. **Review and create:**
   - Review all settings
   - Click **Create user pool**

---

## Step 2: Create App Client (Web Admin Client)

### 2.1 Navigate to App Integration

1. After user pool is created, click on your new pool name
2. Go to **App integration** tab (left sidebar)
3. Click **Create app client** button

### 2.2 Configure App Client

**Basic Information:**
- **App client name:** `WebAdminClient` (or your preferred name)
- **Client secret:** ❌ **UNCHECK** "Generate client secret"
  - ⚠️ **IMPORTANT:** Web browsers cannot use client secrets!
  - Only server-side apps use client secrets

**Authentication flows:**
- ✅ Enable **ALLOW_USER_PASSWORD_AUTH**
  - This allows email/password authentication
- ✅ Enable **ALLOW_REFRESH_TOKEN_AUTH**
  - This allows token refresh
- ❌ Disable all other flows (not needed)

Click **Create app client**

### 2.3 Copy App Client ID

After creation:
1. Note the **Client ID** (starts with alphanumeric characters)
2. Copy it - you'll need it for `cognito-config.js`

**Example Client ID:** `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

---

## Step 3: Configure User Pool Settings

### 3.1 Set Password Policy (Optional - Already Set)

If you want stricter passwords for admins:

1. Go to **Policies** tab
2. **Password policy:**
   - Minimum length: **12** (recommended for admins)
   - Must contain: numbers, uppercase, lowercase, special characters
   - Save changes

### 3.2 Enable MFA (Already Set to Required)

1. Go to **Sign-in experience** tab
2. **Multi-factor authentication:**
   - Mode: **Required** ✅
   - MFA methods: **TOTP** ✅

### 3.3 Set User Pool Domain (Optional - For Custom Login UI)

If you want a custom login domain:

1. Go to **App integration** tab
2. Scroll to **Domain**
3. Click **Create Cognito domain** or **Use your domain**
4. For now, **skip this** (we'll use hosted UI in JavaScript)

---

## Step 4: Create Admin Users

### 4.1 Add First Admin User

1. Go to **Users** tab
2. Click **Create user** button

**User Details:**
- **Username:** Enter email (e.g., `admin@engsitetools.com`)
- **Email:** Same email
- **Email verified:** ✅ **Mark as verified** (since you're creating it)
- **Temporary password:** Check ✅ **Send an invitation email** (recommended)
  - OR enter a temporary password (user must change on first login)
- Click **Create user**

### 4.2 User Must Complete Setup

1. User receives email invitation (if sent) OR
2. User logs in with temporary password
3. **First login:** User must change password
4. **MFA setup:** User must set up TOTP (Google Authenticator/Authy)
   - Scan QR code with authenticator app
   - Enter 6-digit code to verify

### 4.3 Add More Admin Users

Repeat Step 4.1 for each admin/developer who needs access.

---

## Step 5: Update Website Configuration

### 5.1 Get User Pool ID

1. In AWS Console, go to your User Pool
2. **General settings** tab
3. Copy the **User pool ID** (format: `ap-southeast-2_XXXXXXXXX`)

**Example User Pool ID:** `ap-southeast-2_aLYok8BLT`

### 5.2 Update cognito-config.js

**File:** `cognito-config.js`

**Update these values:**

```javascript
window.ENGSITE_COGNITO_CONFIG = {
  // Admin User Pool ID (separate from TrenchCalc app User Pool)
  userPoolId: "ap-southeast-2_XXXXXXXXX",  // Your Admin User Pool ID
  
  // Admin App Client ID (WebAdminClient)
  clientId: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",  // Your Client ID
  
  // AWS Region
  region: "ap-southeast-2",  // Your region
};
```

---

## Step 6: Test Login

### 6.1 Test in Browser

1. Open `login.html` in browser
2. Enter admin email and password
3. If MFA is enabled, you'll be prompted for TOTP code
4. After successful login, you should be redirected to `lidar-annotation.html`

### 6.2 Verify Token Storage

Open browser DevTools Console:
```javascript
// Check if token is stored
localStorage.getItem('cognito_token')
sessionStorage.getItem('anno_auth')
```

---

## Security Best Practices

### ✅ DO:

- **Use separate User Pool** - Keep admin access isolated from app users ✅
- **Require MFA** - Mandatory for all admin users ✅
- **Strong passwords** - 12+ characters, complex rules ✅
- **No self-signup** - Only manual admin creation ✅
- **Regular audits** - Review admin users monthly
- **Use HTTPS** - Always encrypt traffic
- **Token expiration** - Set reasonable session timeouts

### ❌ DON'T:

- ❌ Share User Pool with app users
- ❌ Enable self-service sign-up for admins
- ❌ Skip MFA for admin accounts
- ❌ Use weak passwords
- ❌ Store tokens in URL query params
- ❌ Commit User Pool IDs to public repos

---

## User Pool Comparison

| Feature | TrenchCalc App Pool | Admin Pool |
|---------|---------------------|------------|
| **Purpose** | App users (customers) | Developers/admins |
| **Sign-up** | Self-service | Manual only |
| **MFA** | Optional | Required |
| **Password Policy** | Standard (8 chars) | Stricter (12+ chars) |
| **Users** | Many (customers) | Few (developers) |
| **Usage** | Mobile app | Website tool |

---

## Troubleshooting

### Issue: "User does not exist"
**Solution:** Create user in AWS Console > Cognito > User Pools > Users

### Issue: "Password not accepted"
**Solution:** 
- User must change temporary password on first login
- Check password policy requirements

### Issue: "MFA required but not set up"
**Solution:**
- User must complete MFA setup on first login
- Guide them to scan QR code with authenticator app

### Issue: "Invalid client ID"
**Solution:**
- Verify Client ID in `cognito-config.js`
- Ensure app client has **NO client secret** (unchecked)

### Issue: "CORS errors"
**Solution:**
- Add your domain to Cognito User Pool > App integration > Hosted UI > Allowed callback URLs
- Format: `https://engsitetools.com/login.html`

---

## Cost

**AWS Cognito Pricing:**
- **First 50,000 MAU:** FREE
- **After 50,000:** $0.0055 per MAU

**For admin pool (few users):**
- **Cost:** $0 (well within free tier)
- **TOTP MFA:** FREE
- **SMS MFA:** Charges apply (avoid by using TOTP only)

---

## Next Steps

1. ✅ Create Admin User Pool
2. ✅ Create App Client (no secret)
3. ✅ Create admin users
4. ✅ Update `cognito-config.js`
5. ✅ Test login
6. ✅ Add auth check to `lidar-annotation.html`

---

## Summary

You now have:
- ✅ **Separate Admin User Pool** (isolated from app users)
- ✅ **Secure authentication** (MFA required)
- ✅ **Admin-only access** (manual user creation)
- ✅ **Web integration** (ready for annotation tool)

**Security Level:** High ✅

