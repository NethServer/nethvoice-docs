---
title: API CTI quickstart
sidebar_position: 2
---

# API CTI quickstart

L'API CTI fornisce accesso programmatico alle funzionalità CTI (Computer Telephony Integration) di NethVoice. Questa guida copre autenticazione, connessione WebSocket, autenticazione a due fattori e endpoint di call insights.

NethVoice attualmente opera con entrambi i layer:
- `nethcti-middleware` espone endpoint `/api/...` (layer di integrazione JWT)
- `nethcti-server` espone endpoint `/webrest/...` (ancora attivo e supportato per compatibilità)

La specifica completa dell'API è disponibile su:
- [Riferimento completo API NethCTI Server](https://documenter.getpostman.com/view/15699632/TzRRC88p#41f9b8cc-bea8-4917-a293-84eaedcaed08)
- [NethCTI Middleware reference](https://bump.sh/nethesis/doc/nethcti-middleware/)
- consulta anche [API Migration Status dashboard](/migration-status) per una panoramica degli endpoint già migrati e di quelli ancora inoltrati al server legacy.

---

## Autenticazione {#authentication}

Il metodo di autenticazione middleware utilizza JWT (JSON Web Tokens) per un accesso API sicuro.

### Login {#login}

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

## API Call Insights {#api-call-insights}

Questi endpoint sono esposti da `nethcti-middleware` sotto `/api/...`. Richiedono autenticazione JWT e la capability `nethvoice_cti.satellite_stt`. L'utente autenticato deve inoltre aver partecipato alla chiamata, altrimenti gli endpoint di riassunto e trascrizione restituiscono `403`.

Usa il `uniqueid` della chiamata come identificativo principale. Quando una riga di Cronologia ha anche un `linkedid`, passalo come `?linkedid=<linkedid>` per aiutare il middleware a risolvere trasferimenti, code e chiamate multi-leg sulla riga di trascrizione corretta.

### Verifica stati

Usa `POST /api/summary/statuses` per controllare più chiamate insieme:

```bash
curl -X POST https://nethcti.example.com/api/summary/statuses \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"lookups":[{"uniqueid":"1750153516.571","linkedid":"1750153516.570"}]}'
```

Puoi anche inviare `{"uniqueids":["1750153516.571"]}` quando non è disponibile un linked ID. Ogni risultato può includere:

- `state`: stato di elaborazione, ad esempio `progress`, `summarizing`, `done` o `failed`
- `has_transcription`: `true` quando è disponibile una trascrizione post-chiamata
- `has_summary`: `true` quando è disponibile un riassunto
- `error: "not_found"`: nessuna riga di trascrizione trovata per quella richiesta

Mostra contenuto finale solo quando `state` è `done` e il relativo flag `has_*` è `true`.

### Recupero e aggiornamento contenuti

- `GET /api/transcripts/{uniqueid}?linkedid={linkedid}`: recupera la trascrizione post-chiamata.
- `GET /api/summary/{uniqueid}?linkedid={linkedid}`: recupera il riassunto della chiamata e i metadati della chiamata.
- `PUT /api/summary/{uniqueid}?linkedid={linkedid}` con `{"summary":"..."}`: aggiorna il testo del riassunto.
- `DELETE /api/summary/{uniqueid}?linkedid={linkedid}`: elimina la riga salvata di riassunto/trascrizione.

### Disponibilità del riassunto e notifiche

Usa `HEAD /api/summary/{uniqueid}?linkedid={linkedid}` quando devi solo sapere se un riassunto è pronto. La risposta non ha body:

- `200`: riassunto pronto
- `204`: riassunto non ancora pronto, oppure riga di trascrizione non ancora disponibile per la chiamata collegata
- `404`: nessuna chiamata o nessun riassunto corrispondente trovato
- `401`, `403`, `503`: errore di autenticazione, autorizzazione o disponibilità del servizio

Per ricevere una notifica WebSocket quando il riassunto è pronto, registra un watch:

```bash
curl -X POST https://nethcti.example.com/api/summary/watch \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"uniqueid":"1750153516.571","linkedid":"1750153516.570"}'
```

Un nuovo watch avviato correttamente restituisce `202`. Se un watch è già attivo o non può essere avviato, l'endpoint restituisce `200` con un messaggio. Le notifiche di disponibilità arrivano sull'evento Socket.IO `satellite/summary`.

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

## API di compatibilità (`/webrest/...`) {#api-di-compatibilita-webrest}

Le API di `nethcti-server` sono ancora disponibili e possono coesistere con le API middleware.
Usatele quando l'integrazione dipende ancora da flussi `/webrest/...`.

### Login challenge/response

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

### Utilizzo token `/webrest`

Includete il token nell'header `Authorization` per le richieste autenticate:

```bash
curl https://nethcti.example.com/webrest/user/me \
  -H "Authorization: username:abc123def456..."
```

### WebSocket `/webrest`

**Endpoint:** `/socket.io/`

```javascript
const socket = io('https://nethcti.example.com', {
  path: '/socket.io'
});
```

---

## Guida di adozione: da `/webrest` a `/api` {#guida-di-adozione-da-webrest-a-api}

Per una panoramica completa degli endpoint già migrati e di quelli ancora inoltrati al server legacy, consulta la [API Migration Status dashboard](/migration-status).

Per adottare progressivamente le API JWT del middleware:
