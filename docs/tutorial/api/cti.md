---
title: CTI APIs quickstart
sidebar_position: 2
---

# CTI APIs quickstart

The CTI API provides programmatic access to the NethVoice CTI (Computer Telephony Integration) features. This guide covers authentication, WebSocket connection, and two-factor authentication.
The legacy API paths `/webrest` and `/socket.io` were removed in NethVoice 1.9: see [Legacy API removal](#legacy-api-removal).
New features and improvements are only available in the new API.

Full API specification is available at:
- [NethVoice CTI Server full reference](https://documenter.getpostman.com/view/15699632/TzRRC88p#41f9b8cc-bea8-4917-a293-84eaedcaed08)
- [NethVoice CTI Middleware reference](https://bump.sh/nethesis/doc/nethcti-middleware/)
- see also [API Migration Status dashboard](/migration-status) for an overview of which endpoints have already been migrated and which are still proxied to the legacy server.

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

## Legacy API removal {#legacy-api-removal}

:::danger Removed in NethVoice 1.9
Starting from NethVoice 1.9, the legacy CTI server is no longer published on `/webrest` and `/socket.io`: requests to these paths fail.
The legacy authentication with HMAC-SHA1 tokens (`POST /webrest/authentication/login`) is no longer available.
Integrations and scripts that still use them must move to the new API described above, following the [migration guide](#migration-guide-legacy-to-new-method).
:::

The endpoints of the legacy CTI server that have not been migrated yet are still available through the middleware: call them on `/api` with a JWT token, for example `/api/user/me` instead of `/webrest/user/me`.

NethLink and Phone Island must be updated to their latest versions, which use the new API.

---

## Migration Guide: Legacy to New Method {#migration-guide-legacy-to-new-method}

For a full overview of which endpoints have already been migrated and which are still proxied to the legacy server, see the [API Migration Status dashboard](/migration-status).

To migrate from the legacy authentication to the new JWT-based method:

1. **Replace login endpoint**: Change from `/webrest/authentication/login` to `/api/login`
2. **Update token format**: Replace `username:token_hex` with `Bearer <jwt-token>`
3. **Update WebSocket path**: Change from `/socket.io/` to `/api/ws/`
4. **Adapt headers**: Use `Authorization: Bearer <jwt-token>` instead of `Authorization: username:token`
5. **Handle JWT expiration**: Monitor token `expire` field and refresh as needed
6. **Update the other paths**: Replace the `/webrest` prefix with `/api` (for example `/webrest/user/me` becomes `/api/user/me`)
