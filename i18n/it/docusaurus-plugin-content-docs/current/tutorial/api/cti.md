---
title: API CTI
sidebar_position: 2
---

# API CTI

L'API CTI fornisce accesso programmatico alle funzionalità CTI (Computer Telephony Integration) di NethVoice. Questa guida copre l'autenticazione, la connessione WebSocket e l'autenticazione a due fattori.
I metodi legacy sono documentati per riferimento, ma è fortemente consigliato eseguire la migrazione ai nuovi metodi.
Le nuove funzionalità e i miglioramenti sono disponibili solo nella nuova API.

---

## Autenticazione

Il nuovo metodo di autenticazione utilizza JWT (JSON Web Tokens) per un accesso API sicuro.

### Login

**Endpoint:** `POST /api/login`

Autenticatevi con le vostre credenziali NethVoice per ottenere un token JWT.

```bash
curl -X POST https://nethcti.example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Risposta (senza 2FA)
{
  "code": 200,
  "expire": "2025-11-17T10:30:00Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Campi della risposta:**
- `code`: Codice di stato HTTP
- `expire`: Timestamp di scadenza del token
- `token`: Token JWT da utilizzare nelle richieste successive

### Logout

**Endpoint:** `POST /api/logout`

Invalidare il token JWT corrente.

```bash
curl -X POST https://nethcti.example.com/api/logout \
  -H "Authorization: Bearer <jwt-token>"
```

**Nota:** Il logout invalida solo il token specifico. Le altre sessioni dello stesso utente rimangono attive.

### Utilizzo dei token JWT

Includete il token JWT in tutte le richieste autenticate utilizzando l'header `Authorization: Bearer`:

```bash
curl https://nethcti.example.com/api/user/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## WebSocket

Collegatevi al server CTI utilizzando WebSocket per lo streaming di eventi in tempo reale e la comunicazione bidirezionale.

### Connessione

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
  console.log('Evento ricevuto:', data);
});
```

### Test WebSocket da CLI

Utilizzate `websocat` per testare le connessioni WebSocket dalla riga di comando:

```bash
# Installare websocat (se non già installato)
# cargo install websocat
# oppure
# apt install websocat

# Connettersi a WebSocket
websocat "wss://nethcti.example.com/api/ws/?EIO=4&transport=websocket"

# Dopo la connessione, inviare il messaggio di login Socket.IO:
42["login",{"accessKeyId":"user","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","uaType":"desktop"}]
```

---

## Autenticazione a due fattori (2FA)

Proteggete l'accesso all'API con l'autenticazione facoltativa a due fattori utilizzando password monouso basate su tempo (TOTP).

### Generare il codice QR

**Endpoint:** `GET /api/2fa/qr-code`

Generare un codice QR per la registrazione con un'app di autenticazione.

```bash
curl -X GET https://nethcti.example.com/api/2fa/qr-code \
  -H "Authorization: Bearer <jwt-token>"

# Risposta
{
  "code": 200,
  "message": "QR code string",
  "data": {
    "url": "otpauth://totp/NethVoice:user?secret=JBSWY3DPEHPK3PXP&algorithm=SHA1&digits=6&period=30",
    "key": "JBSWY3DPEHPK3PXP"
  }
}
```

L'`url` può essere convertita in un'immagine di codice QR o inserita direttamente in un'app di autenticazione (Google Authenticator, Microsoft Authenticator, Authy, ecc.).

### Verificare il codice OTP

**Endpoint:** `POST /api/2fa/verify-otp`

Verificare una password monouso durante l'accesso o quando si abilita 2FA.

```bash
curl -X POST https://nethcti.example.com/api/2fa/verify-otp \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","otp":"123456"}'

# Risposta (successo)
{
  "code": 200,
  "message": "OTP verified",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expire": "2025-11-17T10:30:00Z"
  }
}
```

**Importante:** Dopo la verifica OTP, viene restituito un nuovo token con `otp_verified: true`. Utilizzate il nuovo token per le richieste API successive.

### Generare codici di recupero

**Endpoint:** `POST /api/2fa/recovery-codes`

Generare codici di backup che possono essere utilizzati in caso di perdita dell'accesso al dispositivo di autenticazione.

```bash
curl -X POST 'https://nethcti.example.com/api/2fa/recovery-codes' \
  -H 'authorization: Bearer <jwt-token>' \
  -d '{"password":"NethVoice,1234"}'

# Risposta
{
  "codes": ["123456", "789012", "345678", "901234", "567890"]
}
```

Ricevete 5 codici di 6 cifre monouso. Conservateli in un luogo sicuro.

### Verificare lo stato 2FA

**Endpoint:** `GET /api/2fa/status`

Verificare se l'autenticazione a due fattori è abilitata per l'utente corrente.

```bash
curl -X GET https://nethcti.example.com/api/2fa/status \
  -H "Authorization: Bearer <jwt-token>"

# Risposta
{"status": true}
```

### Disabilitare 2FA

**Endpoint:** `POST /api/2fa/disable`

Disabilitare l'autenticazione a due fattori per l'utente corrente.

```bash
curl -X POST https://nethcti.example.com/api/2fa/disable \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

**Nota:** Questa operazione richiede la vostra password e invalida tutti i token JWT per l'utente.

### Flusso di accesso con 2FA

Processo di accesso completo quando 2FA è abilitato:

```bash
# Passaggio 1: Accesso iniziale
curl -X POST https://nethcti.example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
# Risposta: token con "2fa": true, "otp_verified": false

# Passaggio 2: Verificare il codice OTP
curl -X POST https://nethcti.example.com/api/2fa/verify-otp \
  -H "Authorization: Bearer <token-from-step-1>" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","otp":"123456"}'
# Risposta: nuovo token con "otp_verified": true

# Passaggio 3: Utilizzare il nuovo token per tutti gli accessi API
curl https://nethcti.example.com/api/user/me \
  -H "Authorization: Bearer <token-from-step-2>"
```

---

## Metodo legacy (Deprecato)

:::warning Avviso di deprecazione
Il metodo di autenticazione legacy che utilizza token HMAC-SHA1 non sarà più disponibile dopo il **1° giugno 2026**. 
Eseguite la migrazione al nuovo metodo di autenticazione basato su JWT il prima possibile.
:::

### Login legacy

Il metodo legacy richiedeva un processo challenge-response con HMAC-SHA1:

**Endpoint:** `POST /webrest/authentication/login`

```bash
# Passaggio 1: Richiesta di accesso per ottenere il nonce
curl -i -X POST https://nethcti.example.com/webrest/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Risposta: HTTP 401 Unauthorized
# Header: Www-Authenticate: Digest <nonce_value>

# Passaggio 2: Calcolare il token lato client
# message = username:password:nonce
# token = HMAC-SHA1(message, password)
# auth_token = username:token_hex (es: "user:abc123def456...")

# Passaggio 3: Utilizzare il token calcolato per tutte le richieste successive
curl https://nethcti.example.com/webrest/user/me \
  -H "Authorization: user:calculated_token_here"
```

### Utilizzo del token legacy

Includete il token nell'header `Authorization` per le richieste autenticate:

```bash
curl https://nethcti.example.com/webrest/user/me \
  -H "Authorization: username:abc123def456..."
```

### WebSocket legacy

**Endpoint:** `/socket.io/`

```javascript
const socket = io('https://nethcti.example.com', {
  path: '/socket.io'
});
```

---

## Guida alla migrazione: Dal metodo legacy al nuovo metodo

Per eseguire la migrazione dall'autenticazione legacy al nuovo metodo basato su JWT:

1. **Sostituire l'endpoint di accesso**: Cambiare da `/webrest/authentication/login` a `/api/login`
2. **Aggiornare il formato del token**: Sostituire `username:token_hex` con `Bearer <jwt-token>`
3. **Aggiornare il percorso WebSocket**: Cambiare da `/socket.io/` a `/api/ws/`
4. **Adattare gli header**: Utilizzare `Authorization: Bearer <jwt-token>` invece di `Authorization: username:token`
5. **Gestire la scadenza JWT**: Monitorare il campo `expire` del token e aggiornare secondo necessità

