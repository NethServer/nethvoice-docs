---
title: Access
sidebar_position: 1
---

# Access

Access is provided through a web browser:

![Login Page](/img/nethcti/Pagina_Login.png)

The connection link and login credentials are specific to your installation and are provided during the initial setup phase.

## Requirements {#requirements}

- A modern web browser (Chrome, Firefox, or Edge)
- Active internet connection
- Valid NethVoice account
- Access to your organization's NethVoice server

## Login Steps {#login-steps}

1. Open your web browser
2. Navigate to your NethVoice CTI URL (provided by your administrator)
3. Enter your username and password
4. Click the login button
5. You will be redirected to the main interface

## Password {#password}

You can change your password and handle its expiration directly from NethVoice CTI, without accessing the NethServer 8 user portal.

### Changing the password

1. Go to **Settings** → **Account**
2. In the **Change password** section, click **Change password**
3. Enter your current password, the new password and its confirmation
4. Click **Change password**

The section also shows when your password expires. The new password must meet the password policy of the account provider: the minimum length, at least 3 of uppercase letters, lowercase letters, numbers and special characters, and it must differ from the previous passwords.

After the change you are signed out from the other devices and browsers, including NethLink: sign in again with the new password. The mobile app linked with the QR code stays connected.

### Password expiration

- Starting 7 days before the expiration, a warning is shown once a day after the login.
- If your password is expired, the login asks you to choose a new one. After the change, sign in with the new password.

:::note

Password management requires OpenLDAP 2.7.0 or Samba 3.4.6 (or later) as account provider: with older versions the expiration is not handled. It is not available with an external account provider or when the login uses Single Sign-On (SSO).

:::

## Two-Factor Authentication (2FA) {#two-factor-authentication}

Two-factor authentication (2FA) provides an additional layer of security for your NethVoice CTI account by requiring a second verification method during login.

### Enabling 2FA

1. Go to **Settings** → **Account**
2. Look for the "Two-Factor Authentication" section showing the current status (enabled or disabled)
3. Click the configuration button to begin setup
4. Choose your setup method:
   - **QR Code**: Scan the QR code with your authenticator app (e.g., Google Authenticator)
   - **Secret Key**: Manually enter the secret code into your authenticator app
5. Enter the OTP (one-time password) code from your authenticator
6. Click confirm
7. You will see a confirmation message when 2FA is successfully enabled

### Recovery Codes

When 2FA is enabled, you can access your recovery codes in Settings (password verification required). These codes are:

- **Single-use**: Each code can only be used once
- **Automatic regeneration**: When all codes are used, new ones are automatically generated
- **Emergency access**: Use these codes if you lose access to your authenticator app

### Logging In with 2FA

When 2FA is enabled:

1. Enter your username and password as usual
2. You will be prompted to enter your OTP code
3. Open your authenticator app and enter the 6-digit code
4. You will be logged in successfully

### Disabling 2FA

To turn off two-factor authentication:

1. Go to **Settings** → **Account**
2. Click the configuration button
3. Enter your password to confirm
4. 2FA will be disabled
5. You will be logged out from all active sessions for your account

### Supported Authenticator Apps

2FA works with any standard OTP (one-time password) authenticator. Tested and confirmed working apps include:

- **Google Authenticator** (all platforms)
- **Bitwarden** (password manager with 2FA support)
- Any other OTP-compliant authenticator app
