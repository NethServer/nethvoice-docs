---
title: Trasporto WSS
sidebar_position: 7
---

# Trasporto WSS {#trasporto-wss}

NethVoice su NethServer 8 supporta il trasporto WebSocket Secure (WSS) per gli interni. Ogni istanza di NethVoice espone una porta WSS specifica dedicata alle connessioni WebSocket.

:::warning Vincolo di Rete
Questa configurazione si basa sulla connettività diretta e **non funziona dietro NAT**. Assicurarsi che NethVoice abbia visibilità di rete diretta verso gli endpoint client.
:::

## Configurazione del Servizio {#configurazione-del-servizio}

La porta WSS assegnata alla specifica istanza di NethVoice è definita dinamicamente.

* **Variabile:** `ASTERISK_WSS_PORT`
* **Posizione:** All'interno delle variabili d'ambiente del modulo.

I client che si connettono a NethVoice via WebRTC o altri protocolli basati su WebSocket devono puntare a questa porta specifica.

## Impostazione dell'Interno {#impostazione-dell-interno}

Per utilizzare WSS, l'interno deve essere configurato all'interno dell'**Interfaccia Avanzata** (FreePBX).

### Prerequisiti {#prerequisiti}

1.  Creare un nuovo **Dispositivo Personalizzato** o modificarne uno esistente.
2.  Accedere all'**Interfaccia Avanzata**.

### Impostazioni di Trasporto {#impostazioni-di-trasporto}

Modificare le impostazioni `Avanzate` dell'interno con i seguenti parametri per abilitare il trasporto WebSocket sicuro:

1.  **Outbound Proxy:** Rimuovere le configurazioni proxy per questo specifico interno.
2.  **Transport:** Impostare su `0.0.0.0-wss`.
3.  **Enable AVPF:** Impostare su `Yes`.
4.  **Enable ICE Support:** Impostare su `Yes`.
5.  **Enable rtcp Mux:** Impostare su `Yes`.
6.  **Media Encryption:** Impostare su `DTLS`.
7.  **Enable WebRTC Defaults:** Abilitare questa impostazione per applicare le ottimizzazioni WebRTC standard.

## Configurazione del Client {#configurazione-del-client}

Configurare il proprio client con le seguenti impostazioni. Assicurarsi che il dispositivo client abbia accesso di rete all'istanza NethVoice.

| Parametro | Valore / Istruzione |
| :--- | :--- |
| **SIP Server / Domain** | L'FQDN della vostra istanza NethVoice. |
| **SIP Proxy** | (Lasciare vuoto). |
| **Transport Protocol** | **WSS** (Secure WebSocket). |
| **Port** | Il valore di `ASTERISK_WSS_PORT` (controllare le variabili d'ambiente del modulo). |
| **Path** | `/ws` (Percorso WebSocket predefinito di Asterisk). |
| **Username / Extension** | Il numero dell'interno (es. `1001`). |
| **Password / Secret** | Il segreto dell'interno definito in FreePBX. |
| **Media Encryption** | **DTLS** (Obbligatorio per WebRTC/WSS). |
| **AVPF** | Abilitato / Yes. |
| **ICE Support** | Abilitato / Yes. |

:::warning Fiducia nel Certificato SSL
WSS richiede un certificato SSL valido. Se si utilizza un certificato autofirmato, il dispositivo client (o il browser) **deve esplicitamente considerare attendibile l'Autorità di Certificazione (CA)** prima che la connessione possa essere stabilita.
:::
