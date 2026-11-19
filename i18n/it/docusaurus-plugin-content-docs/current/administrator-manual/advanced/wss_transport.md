---
title: Trasporto WSS
sidebar_position: 9
---

# Trasporto WSS {#trasporto-wss}

NethVoice su NethServer 8 supporta il trasporto WebSocket Secure (WSS) per gli interni. I client si collegano al nome host di NethVoice sulla porta HTTPS standard (443), utilizzando il percorso `/ws`.

:::warning Vincolo di Rete
Questa configurazione si basa sulla connettività diretta e **non funziona dietro NAT**. Assicurarsi che NethVoice abbia visibilità di rete diretta verso gli endpoint client.
:::

## Configurazione del Servizio {#configurazione-del-servizio}

I client che si connettono a NethVoice via WebRTC o altri protocolli basati su WebSocket devono utilizzare il seguente indirizzo:

```
wss://<host NethVoice>/ws
```

* **Host:** il nome host impostato per NethVoice nelle impostazioni dell'applicazione (non il nome host di NethVoice CTI).
* **Porta:** 443. Il reverse proxy (Traefik) pubblica il percorso `/ws` sull'host di NethVoice e lo inoltra ad Asterisk.
* **Certificato:** i client vedono il certificato dell'host di NethVoice servito dal reverse proxy, ad esempio un certificato Let's Encrypt richiesto nelle impostazioni dell'applicazione.
* **Audio:** il traffico audio non passa dal reverse proxy. Utilizza l'intervallo di porte RTP di Asterisk, che deve essere raggiungibile dai client, ed è cifrato con DTLS.

Nel firewall non è aperta nessuna porta WSS dedicata. La variabile `ASTERISK_WSS_PORT` non deve essere utilizzata dai client.

:::note Aggiornamento da una versione precedente
I client configurati con il vecchio indirizzo `wss://<host>:<ASTERISK_WSS_PORT>/ws` smettono di registrarsi dopo l'aggiornamento. Modificare l'indirizzo del server di ogni client in `wss://<host NethVoice>/ws` (porta 443). La configurazione dell'interno nell'**Interfaccia Avanzata** non cambia.
:::

## Impostazione dell'Interno {#impostazione-dell-interno}

Per utilizzare WSS, l'interno deve essere configurato all'interno dell'**Interfaccia Avanzata** (FreePBX).

### Prerequisiti {#prerequisiti}

1. Creare un nuovo **Dispositivo Personalizzato** o modificarne uno esistente.
2. Accedere all'**Interfaccia Avanzata**.


### Impostazioni Avanzate

Non modificare l'impostazione `HTTPS Bind Address` (`Impostazioni` → `Impostazioni Avanzate` → `Asterisk Builtin mini-HTTP server`): deve rimanere `127.0.0.1`.

### Impostazioni di Trasporto {#impostazioni-di-trasporto}

Modificare le impostazioni `Avanzate` dell'interno con i seguenti parametri per abilitare il trasporto WebSocket sicuro:

1. **Outbound Proxy:** Rimuovere le configurazioni proxy per questo specifico interno.

2. **Transport:** Impostare su `0.0.0.0-wss`.

3. **Enable AVPF:** Impostare su `Yes`.

4. **Enable ICE Support:** Impostare su `Yes`.

5. **Enable rtcp Mux:** Impostare su `Yes`.

6. **Media Encryption:** Impostare su `DTLS`.

7. **Enable WebRTC Defaults:** Abilitare questa impostazione per applicare le ottimizzazioni WebRTC standard.

## Configurazione del Client {#configurazione-del-client}

Configurare il proprio client con le seguenti impostazioni. Assicurarsi che il dispositivo client abbia accesso di rete all'istanza NethVoice.

| Parametro | Valore / Istruzione |
| :--- | :--- |
| **SIP Server / Domain** | Il nome host di NethVoice impostato nelle impostazioni dell'applicazione. |
| **SIP Proxy** | (Lasciare vuoto). |
| **Transport Protocol** | **WSS** (Secure WebSocket). |
| **Port** | `443`. |
| **Path** | `/ws`. |
| **Username / Extension** | Il numero dell'interno (es. `1001`). |
| **Password / Secret** | Il segreto dell'interno definito in FreePBX. |
| **Media Encryption** | **DTLS** (Obbligatorio per WebRTC/WSS). |
| **AVPF** | Abilitato / Yes. |
| **ICE Support** | Abilitato / Yes. |

:::warning Fiducia nel Certificato SSL
WSS richiede un certificato SSL valido: quello dell'host di NethVoice servito dal reverse proxy. Se si utilizza un certificato autofirmato, il dispositivo client (o il browser) **deve esplicitamente considerare attendibile l'Autorità di Certificazione (CA)** prima che la connessione possa essere stabilita.
:::
