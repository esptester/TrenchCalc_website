# How to Add Admin Users to Cognito User Pool

## Quick Steps (AWS Console)

### Method 1: Create User with Email Invitation (RECOMMENDED)

**Best for:** Setting up users who can receive emails

1. **Navigate to User Pool:**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - **Amazon Cognito** → **User pools**
   - Click on your admin pool (e.g., `engsite-admin-pool`)

2. **Go to Users Tab:**
   - Click **Users** in the left sidebar
   - Click **Create user** button (top right)

3. **Fill User Details:**
   - **Username:** Enter their email address (e.g., `developer@engsitetools.com`)
   - **Email address:** Same email address
   - **Email verified:** ✅ **Check this box** (skip email verification)
   - **Temporary password:** ✅ **Check "Send an invitation email to the new user"**
     - This sends them a temporary password via email
   - **Mark email address as verified:** ✅ **Check this**
   - **Generate temporary password:** Leave unchecked (using email invitation instead)

4. **Click "Create user"**

5. **User Receives Email:**
   - User gets email with temporary password
   - They must:
     1. Log in with temporary password
     2. Change password (required on first login)
     3. Set up MFA (if required - Google Authenticator/Authy)

---

### Method 2: Create User with Temporary Password (No Email)

**Best for:** When email isn't available or for testing

1. **Navigate to User Pool:**
   - Go to **Amazon Cognito** → **User pools** → Your admin pool
   - Click **Users** tab
   - Click **Create user** button

2. **Fill User Details:**
   - **Username:** Enter email address
   - **Email address:** Same email address
   - **Email verified:** ✅ **Check this box**
   - **Send an invitation email:** ❌ **Uncheck this**
   - **Temporary password:** Enter a temporary password (e.g., `TempPass123!`)
     - Must meet password policy requirements (8+ chars, uppercase, lowercase, number, special char)
   - **Mark email address as verified:** ✅ **Check this**

3. **Click "Create user"**

4. **Share Password Securely:**
   - Tell user their temporary password via secure channel (not email!)
   - User must:
     1. Log in with temporary password
     2. Change password immediately (required)
     3. Set up MFA (if required)

---

### Method 3: Import Users (Bulk Import)

**Best for:** Adding multiple users at once

1. **Prepare CSV File:**
   ```csv
   email,email_verified
   admin1@engsitetools.com,true
   admin2@engsitetools.com,true
   developer@engsitetools.com,true
   ```

2. **Import Users:**
   - User Pool → **Users** tab → **Import users** button
   - Upload CSV file
   - Users are created but **must set passwords via "Forgot password"**

3. **Set Temporary Passwords:**
   - For each imported user, click on their username
   - Click **Set temporary password**
   - Generate temporary password
   - Share securely with user

---

## User's First Login Steps

After you create the user, they must:

### Step 1: Log In with Temporary Password

1. Go to `login.html` (or your login page)
2. Enter email address
3. Enter temporary password (from email or shared securely)
4. Click "Sign in"

### Step 2: Change Password (Required)

1. User is prompted to change password
2. Enter temporary password
3. Enter new password (must meet policy requirements)
4. Confirm new password
5. Submit

**Password Requirements (Typical):**
- Minimum 8 characters (or 12 for stricter pools)
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Step 3: Set Up MFA (If Required)

1. User is prompted to set up MFA
2. User scans QR code with authenticator app:
   - **Google Authenticator**
   - **Authy**
   - **Microsoft Authenticator**
   - Any TOTP-compatible app
3. User enters 6-digit code to verify
4. MFA is now active

### Step 4: Log In Normally

1. User logs in with new password
2. User enters MFA code from authenticator app
3. Access granted!

---

## Managing Existing Users

### View User Details

1. User Pool → **Users** tab
2. Click on user's email/username
3. View:
   - User status
   - Email verified status
   - MFA status
   - Last login time
   - Groups (if any)

### Reset User Password

1. Click on user's username
2. Click **Reset password** button
3. Choose:
   - **Send reset email** (user receives reset link)
   - **Set temporary password** (you set it manually)

### Disable User (Temporary)

1. Click on user's username
2. Click **Disable user** button
3. User cannot log in until re-enabled

### Delete User (Permanent)

1. Click on user's username
2. Click **Delete user** button
3. Confirm deletion
4. ⚠️ **Warning:** This permanently deletes user and cannot be undone!

### Enable MFA (Force Setup)

1. Click on user's username
2. Scroll to **Multi-factor authentication** section
3. Click **Set up MFA**
4. User must complete setup on next login

---

## Common Issues & Solutions

### Issue: "User does not exist"
**Solution:** Create user in AWS Console (see Method 1 or 2 above)

### Issue: "Temporary password expired"
**Solution:** 
1. Click on user
2. Click **Set temporary password**
3. Generate new temporary password
4. Share with user

### Issue: "MFA required but user hasn't set it up"
**Solution:**
1. Click on user
2. Click **Set up MFA** (forces setup on next login)
3. OR temporarily disable MFA requirement for that user

### Issue: "Email not verified"
**Solution:**
1. Click on user
2. Click **Mark email as verified** checkbox
3. Save

### Issue: "User can't receive email invitation"
**Solution:** Use Method 2 (set temporary password manually) and share via secure channel

---

## Security Best Practices

### ✅ DO:

- ✅ **Verify email immediately** (check "Email verified" when creating)
- ✅ **Use strong temporary passwords** (meet policy requirements)
- ✅ **Require password change** on first login (automatic)
- ✅ **Require MFA** for all admin users
- ✅ **Share temporary passwords securely** (not via email if possible)
- ✅ **Review users monthly** (remove inactive admins)

### ❌ DON'T:

- ❌ **Don't use weak temporary passwords**
- ❌ **Don't skip email verification** (security risk)
- ❌ **Don't share passwords via email** (use secure channel)
- ❌ **Don't forget to set up MFA** for new users
- ❌ **Don't leave inactive users** (delete old accounts)

---

## Example: Adding a Developer

### Scenario: Add developer "john@engsitetools.com"

**Steps:**

1. **Create User:**
   - Username: `john@engsitetools.com`
   - Email: `john@engsitetools.com`
   - Email verified: ✅ Checked
   - Send invitation: ✅ Checked
   - Click "Create user"

2. **User Receives Email:**
   - Email subject: "Your temporary password for EngSiteTools"
   - Contains temporary password

3. **User Logs In:**
   - Goes to `login.html`
   - Enters email and temporary password
   - Prompted to change password
   - Sets new password

4. **User Sets Up MFA:**
   - Scans QR code with Google Authenticator
   - Enters verification code
   - MFA active

5. **Done!**
   - User can now access `lidar-annotation.html`
   - User must enter MFA code on each login

---

## Quick Checklist

When adding a new admin user:

- [ ] User created in Admin User Pool (not app pool!)
- [ ] Email verified immediately
- [ ] Temporary password set or email invitation sent
- [ ] User knows to change password on first login
- [ ] User knows MFA is required
- [ ] User has authenticator app installed (Google Authenticator/Authy)
- [ ] User can successfully log in
- [ ] User can access annotation tool

---

## Summary

**Adding Users:**

1. AWS Console → Cognito → User Pools → Your Admin Pool
2. Users tab → Create user
3. Enter email, check "Email verified", send invitation
4. User receives email, logs in, changes password, sets up MFA
5. Done! ✅

**Time:** 2-3 minutes per user

**Cost:** $0 (within free tier)

