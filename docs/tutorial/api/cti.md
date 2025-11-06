---
title: CTI APIs
sidebar_position: 2
---

# CTI APIs

The CTI API provides programmatic access to the NethVoice CTI (Computer Telephony Integration) features. This guide covers authentication, WebSocket connection, and two-factor authentication.
Legacy methods are also documented for reference, but migrating to the new methods is strongly recommended.
New features and improvements are only available in the new API.

---

## Authentication {#authentication}

The new authentication method uses JWT (JSON Web Tokens) for secure API access.

### Login {#login}

**Endpoint:** `POST /api/login`

Authenticate with your NethVoice credentials to obtain a JWT token.

```bash
curl -X POST https://nethcti.example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Response (without 2FA)
{
  "code": 200,
  "expire": "2025-11-17T10:30:00Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Fields:**
- `code`: HTTP status code
- `expire`: Token expiration timestamp
- `token`: JWT token to use in subsequent requests

### Logout {#logout}

**Endpoint:** `POST /api/logout`

Invalidate the current JWT token.

```bash
curl -X POST https://nethcti.example.com/api/logout \
  -H "Authorization: Bearer <jwt-token>"
```

**Note:** Logout only invalidates the specific token. Other sessions for the same user remain active.

### Using JWT Tokens {#using-jwt-tokens}

Include the JWT token in all authenticated requests using the `Authorization: Bearer` header:

```bash
curl https://nethcti.example.com/api/user/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## WebSocket {#websocket}

Connect to the CTI server using WebSocket for real-time event streaming and bidirectional communication.

### Connection {#connection}

**Endpoint:** `/api/ws/`

```javascript
const socket = io('https://nethcti.example.com', {
  path: '/api/ws/',
  transports: ['websocket']
});

socket.on('connect', () => {
  socket.emit('login', {
    accessKeyId: 'user',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    uaType: 'desktop'
  });
});

socket.on('event', (data) => {
  console.log('Received event:', data);
});
```

### WebSocket CLI Testing {#websocket-cli-testing}

Use `websocat` to test WebSocket connections from the command line:

```bash
# Install websocat (if not already installed)
# cargo install websocat
# or
# apt install websocat

# Connect to WebSocket
websocat "wss://nethcti.example.com/api/ws/?EIO=4&transport=websocket"

# After connection, send Socket.IO login message:
42["login",{"accessKeyId":"user","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","uaType":"desktop"}]
```

---

## Two-Factor Authentication (2FA) {#two-factor-authentication-2fa}

Secure API access with optional two-factor authentication using time-based one-time passwords (TOTP).

### Generate QR Code {#generate-qr-code}

**Endpoint:** `GET /api/2fa/qr-code`

Generate a QR code for registering with an authenticator app.

```bash
curl -X GET https://nethcti.example.com/api/2fa/qr-code \
  -H "Authorization: Bearer <jwt-token>"

# Response
{
  "code": 200,
  "message": "QR code string",
  "data": {
    "url": "otpauth://totp/NethVoice:user?secret=JBSWY3DPEHPK3PXP&algorithm=SHA1&digits=6&period=30",
    "key": "JBSWY3DPEHPK3PXP"
  }
}
```

The `url` can be converted to a QR code image or entered directly into an authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.).

### Verify OTP Code {#verify-otp-code}

**Endpoint:** `POST /api/2fa/verify-otp`

Verify a one-time password during login or when enabling 2FA.

```bash
curl -X POST https://nethcti.example.com/api/2fa/verify-otp \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","otp":"123456"}'

# Response (success)
{
  "code": 200,
  "message": "OTP verified",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expire": "2025-11-17T10:30:00Z"
  }
}
```

**Important:** After OTP verification, a new token is returned with `otp_verified: true`. Use the new token for subsequent API requests.

### Generate Recovery Codes {#generate-recovery-codes}

**Endpoint:** `POST /api/2fa/recovery-codes`

Generate backup codes that can be used if you lose access to your authenticator device.

```bash
curl -X POST 'https://nethcti.example.com/api/2fa/recovery-codes' \
  -H 'authorization: Bearer <jwt-token>' \
  -d '{"password":"NethVoice,1234"}'

# Response
{
  "codes": ["123456", "789012", "345678", "901234", "567890"]
}
```

You receive 5 single-use 6-digit codes. Store them securely.

### Check 2FA Status {#check-2fa-status}

**Endpoint:** `GET /api/2fa/status`

Check if two-factor authentication is enabled for the current user.

```bash
curl -X GET https://nethcti.example.com/api/2fa/status \
  -H "Authorization: Bearer <jwt-token>"

# Response
{"status": true}
```

### Disable 2FA {#disable-2fa}

**Endpoint:** `POST /api/2fa/disable`

Disable two-factor authentication for the current user.

```bash
curl -X POST https://nethcti.example.com/api/2fa/disable \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

**Note:** This operation requires your password and invalidates all JWT tokens for the user.

### Login Flow with 2FA {#login-flow-with-2fa}

Complete login process when 2FA is enabled:

```bash
# Step 1: Initial login
curl -X POST https://nethcti.example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
# Response: token with "2fa": true, "otp_verified": false

# Step 2: Verify OTP code
curl -X POST https://nethcti.example.com/api/2fa/verify-otp \
  -H "Authorization: Bearer <token-from-step-1>" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","otp":"123456"}'
# Response: new token with "otp_verified": true

# Step 3: Use the new token for all API access
curl https://nethcti.example.com/api/user/me \
  -H "Authorization: Bearer <token-from-step-2>"
```

---

## Legacy Method (Deprecated) {#legacy-method-deprecated}

:::warning Deprecation Notice
The legacy authentication method using HMAC-SHA1 tokens will no longer be available after **June 1, 2026**. 
Please migrate to the new JWT-based authentication method as soon as possible.
:::

### Legacy Login {#legacy-login}

The legacy method required a challenge-response process with HMAC-SHA1:

**Endpoint:** `POST /webrest/authentication/login`

```bash
# Step 1: Request login to obtain nonce
curl -i -X POST https://nethcti.example.com/webrest/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Response: HTTP 401 Unauthorized
# Header: Www-Authenticate: Digest <nonce_value>

# Step 2: Calculate token on client side
# message = username:password:nonce
# token = HMAC-SHA1(message, password)
# auth_token = username:token_hex (e.g., "user:abc123def456...")

# Step 3: Use calculated token for all subsequent requests
curl https://nethcti.example.com/webrest/user/me \
  -H "Authorization: user:calculated_token_here"
```

### Legacy Token Usage {#legacy-token-usage}

Include the token in the `Authorization` header for authenticated requests:

```bash
curl https://nethcti.example.com/webrest/user/me \
  -H "Authorization: username:abc123def456..."
```

### Legacy WebSocket {#legacy-websocket}

**Endpoint:** `/socket.io/`

```javascript
const socket = io('https://nethcti.example.com', {
  path: '/socket.io'
});
```

---

## Migration Guide: Legacy to New Method {#migration-guide-legacy-to-new-method}

To migrate from the legacy authentication to the new JWT-based method:

1. **Replace login endpoint**: Change from `/webrest/authentication/login` to `/api/login`
2. **Update token format**: Replace `username:token_hex` with `Bearer <jwt-token>`
3. **Update WebSocket path**: Change from `/socket.io/` to `/api/ws/`
4. **Adapt headers**: Use `Authorization: Bearer <jwt-token>` instead of `Authorization: username:token`
5. **Handle JWT expiration**: Monitor token `expire` field and refresh as needed
