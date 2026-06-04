---
title: CTI APIs quickstart
sidebar_position: 2
---

# CTI APIs quickstart

The CTI API provides programmatic access to NethVoice CTI (Computer Telephony Integration) features. This guide covers authentication, WebSocket connection, two-factor authentication, and call-insights endpoints.

NethVoice currently runs with both layers:
- `nethcti-middleware` exposes `/api/...` endpoints (JWT-based, current integration layer)
- `nethcti-server` exposes `/webrest/...` endpoints (still active and supported for compatibility)

Full API specification is available at:
- [NethCTI Server full reference](https://documenter.getpostman.com/view/15699632/TzRRC88p#41f9b8cc-bea8-4917-a293-84eaedcaed08)
- [NethCTI Middleware reference](https://bump.sh/nethesis/doc/nethcti-middleware/)
- see also [API Migration Status dashboard](/migration-status) for an overview of which endpoints have already been migrated and which are still proxied to the legacy server.

---

## Authentication {#authentication}

The middleware authentication method uses JWT (JSON Web Tokens) for secure API access.

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

## Compatibility APIs (`/webrest/...`) {#compatibility-apis-webrest}

`nethcti-server` APIs are still available and can coexist with middleware APIs.
Use these endpoints when integrating with flows that are still tied to `/webrest/...` behavior.

### Login with challenge/response

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

### `/webrest` token usage

Include the token in the `Authorization` header for authenticated requests:

```bash
curl https://nethcti.example.com/webrest/user/me \
  -H "Authorization: username:abc123def456..."
```

### `/webrest` WebSocket

**Endpoint:** `/socket.io/`

```javascript
const socket = io('https://nethcti.example.com', {
  path: '/socket.io'
});
```

---

## Adoption Guide: `/webrest` to `/api` {#adoption-guide-webrest-to-api}

For a full overview of which endpoints have already been migrated and which are still proxied to the legacy server, see the [API Migration Status dashboard](/migration-status).

To progressively adopt middleware JWT APIs:

1. Start new integrations on `/api/login` and `Authorization: Bearer <jwt-token>`
2. Keep existing `/webrest/...` consumers working while migrating module by module
3. Move WebSocket consumers from `/socket.io/` to `/api/ws/` when possible
4. Use middleware-only endpoints (for example summary/transcripts) on `/api/...`
5. Keep compatibility tests for both paths during transition
