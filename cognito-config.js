// AWS Cognito Configuration for EngSiteTools Admin Login
// Configure these values for your Cognito User Pool

window.ENGSITE_COGNITO_CONFIG = {
  // Your Cognito User Pool ID (found in AWS Console > Cognito > User Pools)
  // Example: "ap-southeast-2_aLYok8BLT"
  // TODO: Replace with your actual User Pool ID
  userPoolId: "ap-southeast-2_aLYok8BLT",  // Update this with your User Pool ID
  
  // Your Cognito App Client ID (found in AWS Console > Cognito > User Pools > App integration > App clients)
  // IMPORTANT: This must be a client WITHOUT a client secret (for public client authentication)
  // If your app client has a secret, create a new one without a secret for web use
  clientId: "",  // TODO: Set your App Client ID
  
  // AWS Region where your Cognito User Pool is located
  // Example: "ap-southeast-2" (Sydney), "us-east-1" (N. Virginia)
  region: "ap-southeast-2",  // Update if different
};

/* 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Get your User Pool ID:
 *    - Go to AWS Console > Cognito > User Pools
 *    - Select your User Pool
 *    - Copy the User Pool ID (e.g., ap-southeast-2_aLYok8BLT)
 *    - Paste it in userPoolId above
 * 
 * 2. Get or create an App Client ID:
 *    - In your User Pool, go to "App integration" tab
 *    - Click "App clients and analytics"
 *    - If you have an existing app client WITHOUT a client secret, use that Client ID
 *    - If all your clients have secrets, create a new one:
 *        * Click "Create app client"
 *        * Name: "WebAdminClient" (or similar)
 *        * IMPORTANT: UNCHECK "Generate client secret"
 *        * Under "Authentication flows configuration":
 *            ✓ Enable "ALLOW_USER_PASSWORD_AUTH"
 *            ✓ Enable "ALLOW_REFRESH_TOKEN_AUTH"
 *        * Click "Create app client"
 *        * Copy the Client ID and paste it in clientId above
 * 
 * 3. Enable User Password Auth:
 *    - In your User Pool, go to "Sign-in experience" tab
 *    - Under "Authentication flows", make sure "Username" is selected
 *    - This allows email/password authentication
 * 
 * 4. Enable MFA (Multi-Factor Authentication) - RECOMMENDED:
 *    - In your User Pool, go to "Sign-in experience" tab
 *    - Under "Multi-factor authentication", select "Optional" or "Required"
 *    - Enable "TOTP (Software token)" for authenticator apps (Google Authenticator, Authy, etc.)
 *    - Optionally enable "SMS" if you want SMS-based MFA
 *    - Users can set up MFA in their profile or during first login
 * 
 * 5. Test the login:
 *    - Users must exist in your Cognito User Pool
 *    - Users must have confirmed email addresses
 *    - Users must have passwords set
 *    - If MFA is enabled, users must complete MFA setup before using it
 * 
 * SECURITY NOTES:
 * - Never commit this file with real credentials to public repositories
 * - Consider using environment variables or server-side configuration for production
 * - The app client should NOT have a client secret for browser-based authentication
 * - MFA is now supported in the login flow - users will be prompted for MFA code when enabled
 * - MFA significantly improves security - consider making it required for admin users
 */

