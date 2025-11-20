---
title: Passaggi successivi alla migrazione
sidebar_position: 3
---

# Passaggi successivi alla migrazione

Dopo aver completato la migrazione di NethVoice da NethServer 7 a NethServer 8, verificate che tutto funzioni correttamente prima di disattivare il vecchio sistema.

## Verifica del sistema

### Verificare lo stato del servizio

1. **Accedere all'interfaccia NS8**
   - Navigare verso `https://<ns8-server>/cluster-admin/`
   - Andare a **Applications** e verificare che NethVoice mostri lo stato **Running**

2. **Testare le interfacce web**
   - Amministrazione: `https://<nethvoice-fqdn>` (accedere con credenziali amministrative)
   - NethVoice CTI: `https://<cti-fqdn>` (testare con account utente)
   - Verificare che i certificati SSL siano validi

3. **Controllare il database**
   - Dall'amministrazione di NethVoice, andare a **Advanced (FreePBX)** → **Reports** → **CDR Reports**
   - Verificare che i record delle chiamate storiche siano presenti

## Utenti e estensioni

### Provider di account

1. **Verificare gli utenti**
   - Interfaccia NS8 → **Domains and users**
   - Verificare che il dominio sia attivo
   - Verificare che tutti gli utenti e i gruppi siano presenti
   - Testare l'autenticazione degli utenti tramite accesso CTI

2. **Controllare le estensioni**
   - FreePBX → **Applications** → **Extensions**
   - Contare e confrontare con NS7
   - Verificare i mapping estensione-utente
   - Testare l'accesso alla segreteria telefonica

3. **Registrazione dei telefoni**
   - Aggiornare l'opzione DHCP 66 se necessario per il nuovo server di provisioning
   - Riavviare i telefoni e verificare la registrazione
   - Se il nome host di NethVoice è stato modificato, reimpostare i telefoni alle impostazioni di fabbrica. Recupereranno automaticamente la nuova configurazione dal server

## Test della telefonia

### Funzionalità principali

Testare sistematicamente le seguenti funzioni:

- **Chiamate interne**: Tra estensioni, verificare la qualità e l'ID del chiamante
- **Chiamate esterne**: Inbound/outbound, testare vari schemi di numeri
- **Segreteria telefonica**: Deposito, recupero, notifiche via email
- **Inoltro di chiamata**: Immediato, occupato, non disponibile
- **Trasferimento di chiamate**: Trasferimento cieco e assistito
- **Conferenze**: Più partecipanti
- **Menu IVR**: Navigazione e messaggi audio
- **Code di chiamata**: Login/logout degli agenti, musica di attesa

:::tip Test rapido
Crear un checklist per le funzioni specifiche e testare sistematicamente ognuna.
:::

## Verifica dei dati

Verificate che i dati migrati siano accessibili:

- **Registrazioni delle chiamate**: Verificare FreePBX → **Admin** → **System Recordings**, testare la riproduzione
- **File audio personalizzati**: Prompt IVR, annunci, musica di attesa
- **Dati CDR**: Report storici da prima della migrazione
- **Configurazione delle estensioni**: Associazioni di dispositivi, impostazioni del codec

## Configurazione di rete

### DNS e certificati

1. **Verificare i record DNS**
   ```bash
   nslookup nethvoice.example.com
   nslookup cti.example.com
   ```
   - Ogni FQDN dovrebbe risolvere all'IP di NS8
   - Testare da reti interne e esterne

2. **Controllare i certificati SSL**
   ```bash
   openssl s_client -connect nethvoice.example.com:443
   ```
   - Verificare che i certificati siano validi
   - Nessun avviso del browser quando si accede alle interfacce

## Finalizzazione del provider di account

### Per Samba Active Directory

- Verificare che tutti gli utenti e i gruppi siano presenti
- Testare l'autenticazione
- Trasferire l'IP del controller di dominio NS7 a NS8 se richiesto dai client Windows
- Aggiornare le impostazioni DNS DHCP o configurare l'inoltro DNS esterno

Vedere: [Documentazione sulla migrazione di Samba DC](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#samba-dc)

### Per OpenLDAP

⚠️ **Importante**: Le politiche delle password NON sono state migrate automaticamente

1. Interfaccia NS8 → **Domains and users** → Dominio OpenLDAP → **Settings**
2. Configurare i criteri di complessità e scadenza della password
3. Testare con nuove modifiche di password

## Pulizia di NS7

### Monitorare e reindirizzare

1. **Controllare le pagine di reindirizzamento**
   - Accedere all'antico URL di NethVoice su NS7
   - Dovrebbe mostrare il reindirizzamento HTML ai nuovi URL di NS8

2. **Monitorare le connessioni rimanenti**
   ```bash
   # Su NS7, controllare i telefoni registrati
   asterisk -rx "pjsip show endpoints"
   ```
   - Notificare agli utenti di aggiornare le configurazioni
   - Aggiornare le impostazioni di provisioning DHCP

3. **Pianificare la disattivazione**
   - Periodo di tolleranza: 1-4 settimane
   - Creare un backup finale
   - Archiviare per conformità
   - Documentare la data di disattivazione

:::info Finestra di rollback
Mantenere NS7 offline ma conservato per 30-90 giorni per il rollback di emergenza se necessario.
:::

## Risoluzione dei problemi

### Problemi comuni

**I telefoni non si registrano**
- Aggiornare l'indirizzo del server di provisioning a NS8
- Verificare la connettività di rete
- Controllare le credenziali SIP
- Esaminare le regole del firewall (5060, 5061, RTP 10000-20000)

**Le chiamate esterne non funzionano**
- Verificare che la configurazione del trunk sia stata migrata
- Testare la registrazione del trunk
- Controllare l'IP pubblico e le impostazioni NAT

**Mancano le registrazioni delle chiamate**
- Verificare il percorso di archiviazione e le autorizzazioni
- Esaminare i log di migrazione per gli errori di rsync
- Verificare che i conteggi dei file corrispondano

**Gli utenti non possono accedere a CTI**
- Verificare la connessione del provider di account
- Controllare le credenziali dell'utente
- Testare la connettività LDAP/AD

**Problemi di risoluzione del DNS**
```bash
nslookup nethvoice.example.com
dig cti.example.com +short
```
- Attendere 24-48 ore per la propagazione del DNS
- Utilizzare un DNS alternativo (8.8.8.8) per il test

## Elenco di controllo finale

Prima di considerare la migrazione completata:

- [ ] Servizi NethVoice in esecuzione su NS8
- [ ] Tutte le interfacce accessibili tramite FQDN corretti
- [ ] Utenti e estensioni verificati
- [ ] Chiamate interne e esterne funzionanti
- [ ] Registrazioni delle chiamate e dati CDR accessibili
- [ ] Record DNS aggiornati e propagati
- [ ] Certificati SSL validi
- [ ] Nessun telefono registrato a NS7
- [ ] Provider di account finalizzato

## Passaggi successivi

1. **Stabilire un programma di backup**
   - Configurare i backup automatizzati per NS8
   - Testare le procedure di ripristino

2. **Pianificare la disattivazione di NS7**
   - Impostare la data (30-90 giorni da ora)
   - Verificare le mancanze di dipendenze
   - Archiviare il backup finale

## Congratulazioni!

Avete completato con successo la migrazione di NethVoice a NethServer 8. Il vostro sistema è ora in esecuzione sulla moderna piattaforma NS8 con prestazioni e sicurezza migliori.

:::tip Hai bisogno di aiuto?
Per assistenza, consultate i [forum della comunità NethServer](https://community.nethserver.org/) o contattate i servizi di supporto professionale di Nethesis.
:::

