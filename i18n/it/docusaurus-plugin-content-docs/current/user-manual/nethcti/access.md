---
title: Accesso
sidebar_position: 1
---

# Accesso

L'accesso è fornito tramite un browser web:

![Pagina Login](/img/nethcti/Pagina_Login.png)

Il link di collegamento e le credenziali di accesso sono specifiche della tua installazione e vengono comunicate durante la fase di configurazione iniziale.

## Requisiti

- Un browser web moderno (Chrome, Firefox o Edge)
- Connessione internet attiva
- Account NethVoice valido
- Accesso al server NethVoice della tua organizzazione

## Passaggi di Login

1. Apri il tuo browser web
2. Accedi all'URL di NethVoice CTI (fornito dal tuo amministratore)
3. Immetti il tuo nome utente e password
4. Clicca il pulsante di accesso
5. Verrai reindirizzato all'interfaccia principale

## Password {#password}

Puoi cambiare la password e controllarne la scadenza direttamente da NethVoice CTI.

### Cambio della password

1. Vai su **Impostazioni** → **Account** e clicca **Cambia password**
2. Inserisci la password attuale e due volte quella nuova, poi clicca **Cambia password**

La nuova password deve rispettare la policy del provider di account: lunghezza minima, almeno 3 tra lettere maiuscole, lettere minuscole, numeri e caratteri speciali, non usata in precedenza.

Dopo il cambio le altre sessioni, compreso NethLink, vengono disconnesse. L'app mobile collegata con il QR code e i token di integrazione continuano a funzionare.

### Scadenza della password

- Da 7 giorni prima della scadenza, dopo l'accesso viene mostrato un avviso una volta al giorno e **Impostazioni** → **Account** mostra la data di scadenza.
- Se la password scade mentre sei connesso, puoi continuare a usare NethVoice CTI fino alla fine della sessione: **Impostazioni** → **Account** mostra fino a quando.
- Se la password è scaduta al login, devi sceglierne una nuova, poi accedere con quella.

:::note

Richiede come provider di account OpenLDAP 2.7.0 o Samba 3.4.6 (o successivi): le versioni precedenti non gestiscono la scadenza. Non è disponibile con un provider di account esterno o con il Single Sign-On (SSO).

:::

## Autenticazione a due fattori (2FA) {#two-factor-authentication}

L'autenticazione a due fattori (2FA) fornisce un livello di sicurezza aggiuntivo per il tuo account NethVoice CTI richiedendo un secondo metodo di verifica durante l'accesso.

### Attivazione della 2FA

1. Vai a **Impostazioni** → **Account**
2. Cerca la sezione "Autenticazione a due fattori" che mostra lo stato attuale (abilitato o disabilitato)
3. Fai clic sul pulsante di configurazione per iniziare l'installazione
4. Scegli il tuo metodo di configurazione:
   - **Codice QR**: Scansiona il codice QR con la tua app authenticator (es. Google Authenticator)
   - **Chiave segreta**: Inserisci manualmente il codice segreto nella tua app authenticator
5. Inserisci il codice OTP (one-time password) dal tuo authenticator
6. Fai clic su conferma
7. Vedrai un messaggio di conferma quando la 2FA è stata attivata con successo

### Codici di recupero

Quando la 2FA è abilitata, puoi accedere ai tuoi codici di recupero in Impostazioni (richiesta verifica della password). Questi codici sono:

- **Monouso**: Ogni codice può essere utilizzato una sola volta
- **Rigenerazione automatica**: Quando tutti i codici sono stati utilizzati, ne vengono generati automaticamente di nuovi
- **Accesso di emergenza**: Usa questi codici se perdi l'accesso alla tua app authenticator

### Accesso con 2FA

Quando la 2FA è abilitata:

1. Inserisci il tuo nome utente e password come al solito
2. Ti verrà richiesto di inserire il tuo codice OTP
3. Apri la tua app authenticator e inserisci il codice di 6 cifre
4. Sarai loggato con successo

### Disattivazione della 2FA

Per disattivare l'autenticazione a due fattori:

1. Vai a **Impostazioni** → **Account**
2. Fai clic sul pulsante di configurazione
3. Inserisci la tua password per confermare
4. La 2FA sarà disabilitata
5. Sarai disconnesso da tutte le sessioni attive del tuo account

### App Authenticator supportate

La 2FA funziona con qualsiasi authenticator OTP (one-time password) standard. Le app testate e confermate funzionanti includono:

- **Google Authenticator** (tutte le piattaforme)
- **Bitwarden** (password manager con supporto 2FA)
- Qualsiasi altra app authenticator conforme allo standard OTP
