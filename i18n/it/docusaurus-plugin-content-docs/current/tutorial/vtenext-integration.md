# Integrazione CRM vtenext

## Obiettivo della guida

Lo scopo di questa guida è spiegare come configurare gli script di integrazione di [vtenext CRM](https://www.vtenext.com/) su NethVoice 8 **per consentire lo scambio di dati tra i due sistemi**.

## Introduzione al concetto

Lo scambio di dati tra i due sistemi può avvenire in entrambe le direzioni:

- da vtenext CRM a NethVoice:

    1. mostrare le informazioni di contatto del CRM durante una chiamata in arrivo.
    2. popolare la rubrica telefonica centralizzata di NethVoice con i contatti aziendali di vtenext.

- da NethVoice a vtenext CRM:

    3. NethVoice può registrare le informazioni del chiamante in vtenext per le chiamate in arrivo.

## 1. Mostrare le informazioni di contatto del CRM durante una chiamata in arrivo {#show-crm-contact-info}

### Definizione

Questa funzionalità consente di mostrare le informazioni del chiamante, prese da vtenext CRM, durante la ricezione di una chiamata in arrivo.

### Come Funziona

* un contatto registrato in vtenext CRM chiama.  
* le sue informazioni appaiono nel CTI mentre il telefono squilla.  

## 2. Popolare la Rubrica Telefonica di NethVoice con i dati dei contatti di vtenext {#populate-nethvoice-phone-directory}

### Definizione

I dati telefonici dei contatti di vtenext vengono importati periodicamente nella rubrica telefonica centralizzata di NethVoice.

### Come Funziona

Periodicamente, i dati telefonici dei contatti vengono aggiornati automaticamente importandoli da vtenext nella rubrica telefonica di NethVoice, secondo le impostazioni di **Address Book Sources** nel menu **Application**.

L'intervallo di aggiornamento può essere:

- 15 minuti  
- 30 minuti  
- 1 ora  
- 6 ore  
- 24 ore  

È possibile verificare la frequenza di importazione con il comando:

`systemctl --user list-timers | grep phonebook-update`

Il primo timestamp è relativo all'ultimo aggiornamento, mentre il secondo indica la prossima esecuzione.

## 3. Registrare le chiamate in arrivo in vtenext {#register-incoming-calls}

:::info  
Questa funzione richiede un plugin proprietario, disponibile da vtenext, che implementa l'endpoint `notify_incoming_call` delle API di vtenext.  
:::

### Definizione

Su una chiamata in arrivo, l'evento viene registrato in vtenext, attribuito al proprietario dell'interno chiamato e viene mostrata una notifica di chiamata in arrivo in vtenext.

### Come Funziona

Quando un interno telefonico riceve una chiamata in entrata, NethVoice notifica vtenext tramite una chiamata API e l'evento viene registrato nel CRM e collegato al proprietario dell'interno come definito nella configurazione di Asterisk sotto le preferenze utente.

---

## Istruzioni di configurazione

### Prerequisiti

- Versione 1.6 o successiva dell'immagine di NethVoice.  
  Il numero di versione può essere verificato all'interno del modulo NethVoice con il comando:  
  `runagent -m nethvoice1`  
  `env | grep IMAGE_URL`  
- Versione 2 di vtenext CRM.  
- Plugin vtenext (necessario solo se si desidera registrare le chiamate in arrivo in vtenext).

### Configurazione di VTENEXT

#### Ottenere la chiave di accesso al Webservice

1. Accedi come utente che gestisce le chiamate API.  
2. Apri **Impostazioni** (icona dell'ingranaggio in basso a sinistra).  
3. Seleziona **Business Process Manager** (icona degli edifici a sinistra).  
4. Vai su **Webservice REST**.  
5. Nel campo **Username**, seleziona l'utente che eseguirà gli script.  
6. Premi il pulsante **Webservice accesskey – Mostra**.  
7. Autenticati.  
8. Copia il contenuto del campo **Access Key**.  

#### Installare il plugin vtenext {#install-vtenext-plugin}

1. Ottenere il plugin da vtenext.  
2. Aprire **Settings** (icona dell'ingranaggio in basso a sinistra).  
3. Selezionare **Business Process Manager** (icona degli edifici a sinistra).  
4. Accedere a **Module Manager**.  
5. Selezionare la scheda **Custom Modules**.  
6. Premere il pulsante **Import new module**.  
7. Premere il pulsante di selezione file e scegliere il file ZIP del plugin dal proprio disco.  
8. Premere **Import**.  
9. Verificare che il modulo **NethVoice** appaia nell'elenco **Standard Modules**.  

### Installare gli script in NethVoice {#install-scripts}

1. Accedere alla macchina tramite **ssh**.  
2. Per accedere al modulo NethVoice, eseguire il comando:  
   `runagent -m nethvoice1`  
3. Per accedere al container FreePBX, eseguire il comando:  
   `podman exec -ti freepbx /bin/sh`  
4. Copiare i file:  
   - `lookup_vte.php` da `/usr/src/nethvoice/samples` a `/usr/src/nethvoice/lookup.d`  
   - `vte.php` da `/usr/share/phonebooks/samples/` a `/usr/share/phonebooks/scripts`  
   - `vte_incoming_call.php` da `/usr/src/nethvoice/samples` a `/var/lib/asterisk/agi-bin`  

   `cp /usr/src/nethvoice/samples/lookup_vte.php /usr/src/nethvoice/lookup.d`  
   `cp /usr/share/phonebooks/samples/vte.php /usr/share/phonebooks/scripts`  
   `cp /usr/src/nethvoice/samples/vte_incoming_call.php /var/lib/asterisk/agi-bin`  

5. Modificare tutti e tre gli script per aggiornare:  
   - l'URL base delle API  
   - il nome utente  
   - la chiave di accesso  

6. Definire la variabile di ambiente `NETHCTI_CDR_SCRIPT_EXTENSION_RING` nell'ambiente del modulo, puntando allo script `vte_incoming_call.php`:  
   `sed -i '/^NETHCTI_CDR_SCRIPT_EXTENSION_RING=/d' environment && echo 'NETHCTI_CDR_SCRIPT_EXTENSION_RING="/var/lib/asterisk/agi-bin/vte_incoming_call.php"' >> environment`  

:::warning  
Il seguente comando chiuderà tutte le chiamate attive, quindi eseguirlo solo quando opportuno.  
:::

7. Per applicare le modifiche, riavviare FreePBX all'interno del modulo NethVoice con il comando:  
   `systemctl --user restart freepbx`