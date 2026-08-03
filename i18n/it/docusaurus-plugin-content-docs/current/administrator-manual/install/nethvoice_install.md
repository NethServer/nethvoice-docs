---
title: Installazione di NethVoice
sidebar_position: 4
---

# Installazione di NethVoice

NethVoice è un'applicazione VoIP che richiede un'installazione specifica su NethServer. Questa guida ti accompagnerà nel processo di installazione.

:::tip
Se desideri un'installazione di NethVoice pronta all'uso, prendi in considerazione:
- il nostro servizio **[NethVoice SaaS](saas.md#nethvoice-as-a-service)**, che fornisce un'istanza NethVoice completamente gestita nel cloud
- un **[VoiceBox Appliance](voicebox.md)**, l'appliance hardware con NethServer e NethVoice preinstallati
:::

## Installazione modulo {#module-installation}

1. **Accedi al Software Center** nel tuo sistema NethServer 8.
2. **Cerca "NethVoice"** nella barra di ricerca del Software Center.
3. **Fai clic su "Installa"** accanto a NethVoice.
4. **Attendi il completamento dell'installazione** (potrebbe richiedere alcuni minuti).

## Procedura guidata di configurazione iniziale {#setup-wizard}

Apri l'applicazione NethVoice dalla pagina **Applicazioni** oppure dal **Menu Applicazioni** (icona a 9 punti in alto a destra, oppure premi **Ctrl + Shift + A**) in NethServer 8. Apparirà una procedura guidata di configurazione iniziale che ti guiderà attraverso:
- Configurazione di un provider di account per NethVoice  
- Installazione e configurazione del NethVoice Proxy  
- Configurazione dell'applicazione NethVoice  

### Provider di account {#user-domains}

Il primo passaggio della procedura guidata ti aiuta a configurare il dominio utenti utilizzato da NethVoice.  

I domini utenti memorizzano utenti e gruppi in un database LDAP. NethVoice richiede un dominio utenti per gestire interni, utenti e autenticazione.  
NethServer 8 supporta due tipi di provider di account LDAP:  

| Provider | Tipo | Ideale per | Funzionalità |
|----------|------|------------|--------------|
| **OpenLDAP (RFC2307)** | Interno | Client Unix/Linux, configurazione semplice | Leggero, configurazione semplice, distribuzioni di piccole dimensioni, istanze multiple per nodo |
| **Active Directory (Samba)** | Interno | Client Windows, condivisione file SMB | Controller di dominio, compatibilità Windows, maggiore complessità, una sola istanza per nodo |
| **LDAP Esterno** | Esterno | Infrastruttura LDAP esistente | Connessione a server esistenti (Active Directory, OpenLDAP, ecc.) |

:::info Requisiti di NethVoice  
NethVoice richiede almeno un dominio utenti configurato. Scegli **OpenLDAP (RFC2307)** per distribuzioni più semplici o **Active Directory** se hai bisogno di supporto per client Windows.  
:::

#### Configurazione rapida: OpenLDAP (Consigliato per NethVoice) {#quick-setup-openldap-recommended-for-nethvoice}

La procedura guidata consente di installare facilmente un provider di account OpenLDAP. Per configurarlo, devi:  

- **Inserire il nome del dominio** (es. `nethvoice.local`) - questo è un nome logico, non correlato al DNS  
- **Impostare nome utente e password dell'amministratore di OpenLDAP**  

Per scenari avanzati (LDAP esterno, Active Directory, configurazione DNS, politiche di password, gestione utenti), consulta la [documentazione ufficiale sui domini utenti di NethServer 8](https://docs.nethserver.org/projects/ns8/en/latest/user_domains.html).

Argomenti chiave nella documentazione ufficiale:  
- **Configurazione di Active Directory**: Configurazione completa del controller di dominio  
- **Connessione LDAP esterno**: Collegamento a server LDAP esistenti  
- **Politiche di password**: Età, complessità e scadenza delle password  
- **Portale di gestione utenti**: Modifica autonoma delle password da parte degli utenti  
- **Repliche del provider LDAP**: Tolleranza ai guasti e ridondanza  
- **Impostazioni di binding LDAP**: Collegamento di applicazioni esterne a un server LDAP locale  

### NethVoice Proxy

Il passaggio successivo della procedura guidata iniziale installa e configura il NethVoice Proxy.  

Il NethVoice Proxy è un componente che deve essere installato e configurato prima di configurare le istanze applicative di NethVoice. Anche con una sola installazione di NethVoice, il proxy è essenziale per una corretta gestione del traffico di rete.  

Il proxy gestisce tutto l'accesso esterno a Internet e il routing del traffico SIP/RTP. È necessario per:  
- Accesso esterno da Internet  
- Delegazione del traffico verso più installazioni NethVoice sullo stesso nodo
- Gestione delle connessioni SIP e RTP per tutte le istanze di NethVoice  
- Terminazione SSL/TLS per il traffico VoIP esposto a Internet  

Il NethVoice Proxy è un'applicazione standard di NethServer 8: le sue impostazioni possono essere riviste e modificate accedendo dalla pagina **Applicazioni** oppure dal **Menu Applicazioni** (icona a 9 punti in alto a destra, oppure premi **Ctrl + Shift + A**).

#### Prerequisiti {#prerequisiti}

Prima di configurare il NethVoice Proxy:  

1. **Record DNS creati**: Crea un record DNS A/AAAA per il dominio del proxy (es. `proxy.nethserver.org`) che punti al tuo indirizzo IP pubblico  
2. **Indirizzo IP pubblico**: Identifica l'indirizzo IPv4 o IPv6 pubblico dove il proxy sarà accessibile da Internet  
3. **Interfaccia di rete**: Identifica quale interfaccia di rete gestirà il traffico VoIP  

La procedura guidata rileva automaticamente se esiste già un proxy sul nodo di installazione di NethVoice e propone di installarlo se necessario. Successivamente, per configurare il NethVoice Proxy:  

1. **Configura il dominio del Proxy**: questo è il FQDN pubblico dove il proxy sarà raggiungibile.  
   Non inserire il FQDN di NethServer ma utilizza uno dedicato, come `proxy.nethserver.org`.  
   Questo nome sarà utilizzato dai client esterni per raggiungere i tuoi servizi VoIP, ma non sarà utilizzato direttamente dagli utenti finali.  
2. **Abilita la richiesta del certificato Let's Encrypt** se necessario: verrà richiesto un certificato Let's Encrypt per il dominio del proxy.  
3. **Imposta l'interfaccia di rete** che gestirà il traffico VoIP  
4. **Configura l'indirizzo IP pubblico** se diverso dall'IP dell'interfaccia  

La configurazione sopra sarà il punto di ingresso per tutto il traffico VoIP esterno.  

Assicurati che:  
- Il FQDN configurato risolva correttamente l'indirizzo IP pubblico  
- Eventuali record DNS siano correttamente configurati per puntare al proxy  

Questi requisiti sono fondamentali per ottenere un certificato SSL/TLS valido per comunicazioni sicure.  

Consulta la [documentazione del NethVoice Proxy](../advanced/nethvoice_proxy.md) per maggiori informazioni.  

### Applicazione NethVoice

:::warning Configurazione DNS  
Per configurare NethVoice, è necessario disporre di due virtual host dedicati:  

- Un **Host base NethVoice** per l'interfaccia di amministrazione di NethVoice, ad esempio `nethvoice.nethserver.org`  
- Un **Host base NethVoice CTI** per l'applicazione web NethVoice CTI, ad esempio `cti.nethserver.org`  

Prima di procedere con la configurazione, assicurati di aver creato i corrispondenti record DNS per questi FQDN nel tuo server DNS.  

Se prevedi di utilizzare un certificato Let's Encrypt come certificato predefinito, assicurati di avere i necessari record DNS pubblici.  
:::

Nell'ultimo passaggio della procedura guidata, ti verrà richiesto di fornire le seguenti informazioni:  

- **Host base NethVoice**: Inserisci un FQDN valido per accedere alla pagina di amministrazione dell'applicazione; qui gestirai le impostazioni di NethVoice, ad esempio `nethvoice.nethserver.org`.  
- **Host base NethVoice CTI**: Inserisci un FQDN valido per l'applicazione web NethVoice CTI, ad esempio `cti.nethserver.org`.  
- **Richiedi certificato Let's Encrypt**: Se abilitato, verrà richiesto un certificato Let's Encrypt sia per l'**host base NethVoice** che per l'**Host base NethVoice CTI**.  
- **Fuso orario**: Seleziona il fuso orario appropriato per l'applicazione NethVoice; questo è importante per la registrazione accurata delle chiamate e la pianificazione.  
- **Password amministratore per accedere all'interfaccia utente**: Imposta la password per la pagina di amministrazione di NethVoice.  

### Passaggi successivi {#next-steps}

Al termine della procedura guidata di configurazione iniziale, NethVoice sarà accessibile sull'host base configurato, ad esempio:  
```
https://nethvoice.nethserver.org  
```  

Per accedere all'interfaccia di amministrazione di NethVoice, utilizza le seguenti credenziali:  

- Utente: `admin`  
- Password: La password scelta nella procedura guidata di configurazione iniziale  

Dopo aver completato la configurazione di NethVoice nell'interfaccia di amministrazione, gli utenti possono accedere al NethVoice CTI sull'host base configurato, ad esempio:  
```
https://cti.nethserver.org  
```  

## Configurazione del modulo {#module-configuration}

Le impostazioni del modulo NethVoice possono essere riviste e modificate accedendo al modulo NethVoice di NethServer 8. Per farlo:  

- Accedi alla pagina di amministrazione del cluster NethServer.  
- Apri l'applicazione NethVoice dalla pagina **Applicazioni** oppure dal **Menu Applicazioni** (icona a 9 punti in alto a destra, oppure premi **Ctrl + Shift + A**).
- Vai alla pagina di configurazione specifica che desideri modificare.  

Nella pagina **Impostazioni** puoi rivedere e modificare la maggior parte dei parametri di configurazione:  

- **Host base NethVoice**: virtual host per l'interfaccia di amministrazione di NethVoice.  
- **Host base NethVoice CTI**: virtual host per l'applicazione web NethVoice CTI.  
- **Richiedi certificato Let's Encrypt**: se abilitato, verrà richiesto un certificato Let's Encrypt sia per l'**Host base NethVoice** che per l'**Host base NethVoice CTI**.  
- **Provider di account**: dominio utenti utilizzato da NethVoice.  
- **Fuso orario**: fuso orario per l'applicazione NethVoice, importante per la registrazione accurata delle chiamate e la pianificazione.  
- **Prefisso dei report**: prefisso telefonico utilizzato nei report.  
- **Nuova password amministratore per NethVoice**: definisci una nuova password per l'utente `admin`.  

Nella pagina **Integrazioni** puoi configurare i servizi speech-to-text e AI:
- **API Key Deepgram**: necessaria per abilitare la trascrizione delle chiamate e dei messaggi vocali.
- **Trascrizione delle chiamate (Preview)**: abilita la trascrizione delle chiamate gestite da NethVoice. Gli utenti con il permesso di profilo richiesto possono aprire la trascrizione live durante una chiamata, e le chiamate completate supportate possono mostrare i dati di trascrizione post-chiamata nella Cronologia CTI. Questa funzionalità può consumare rapidamente crediti Deepgram sui sistemi con molte chiamate.
- **Trascrizione dei messaggi vocali**: converte l'audio dei messaggi vocali in testo con Deepgram e include la trascrizione nei messaggi vocali quando il flusso voicemail fornisce un allegato audio.
- **API Key OpenAI**: necessaria per abilitare i riassunti delle chiamate generati dall'AI. Quando una API Key OpenAI è configurata, gli utenti con il permesso di profilo richiesto possono consultare i riassunti generati dalla Cronologia CTI e configurare le notifiche di riassunto pronto.
- **Riepilogo chiamata**: abilita i riepiloghi generati dall'AI delle chiamate completate. Può essere attivato solo quando è configurata una OpenAI API Key e **Trascrizione chiamata** è abilitata, poiché i riepiloghi vengono generati dai dati di trascrizione post-chiamata.

I riassunti delle chiamate generati dall'AI usano i dati della trascrizione post-chiamata e richiedono sia una configurazione Deepgram funzionante che una API Key OpenAI configurata.

Con una API Key Deepgram configurata, è disponibile anche la sintesi vocale (text-to-speech) durante l'aggiunta di una registrazione per Annunci, IVR o Code di chiamata: inserisci il testo del messaggio, scegli lingua e voce, ascolta l'anteprima e salvala come registrazione di sistema.

:::info Trascrizioni e riassunti  
Per informazioni utente su trascrizione live, trascrizione post-chiamata, riassunti, notifiche e integrazione con la Cronologia, consulta [Trascrizione vocale e Riassunto chiamata](../../user-manual/nethcti/other.md#voice-transcription) nel Manuale Utente.  
:::

Nella pagina **Rebranding** puoi personalizzare l'interfaccia utente di NethVoice con l'identità del marchio della tua azienda. Per abilitare questa funzionalità, devi contattare il team commerciale di Nethesis e avere un abbonamento Enterprise attivo.  

Il rebranding è organizzato in schede, una per ogni interfaccia:

- **CTI**: nome del brand, loghi, favicon e sfondo della pagina di login di NethVoice CTI.
- **Admin**: nome del brand, loghi, favicon e sfondo della pagina di login del wizard, più la sezione **Interfaccia di amministrazione FreePBX**, dove puoi impostare il logo in alto a sinistra e la favicon della GUI di amministrazione di FreePBX. Il nome del brand mostrato nell'interfaccia di amministrazione FreePBX segue il nome del brand del wizard.
- **Report**: nome del brand, logo e favicon della pagina di login di NethVoice Reports.
- **NethLink**: nome e URL dell'azienda mostrati nella finestra *Informazioni* del client desktop NethLink.

Tutte le immagini devono essere raggiungibili a un URL pubblico e il formato consigliato è SVG. I campi lasciati vuoti usano gli asset predefiniti. Il salvataggio applica in una sola volta le modifiche in sospeso di tutte le schede.  

Nella pagina **Hotel** puoi configurare il modulo Hotel; è richiesto un abbonamento attivo per questa funzionalità.  

- **Stato**: Attiva il modulo Hotel per gestire funzionalità telefoniche specifiche per hotel.  
- **Host server FIAS Hotel**: Inserisci l'indirizzo IP o il nome host del server FIAS dell'hotel.  
- **Porta server FIAS Hotel**: Specifica il numero di porta per la connessione al server FIAS dell'hotel.  

Consulta la [documentazione del modulo Hotel di NethVoice](/docs/administrator-manual/nethhotel/) per maggiori dettagli.
