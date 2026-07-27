# Zucchetti Infinity

L'integrazione tra NethVoice e [Zucchetti Infinity](https://www.zucchetti.it/website/cms/infinity-zucchetti/1059-infinity-zucchetti.html) porta le funzionalità CTI di NethVoice direttamente nel portale Zucchetti.

Inoltre, sfruttando le **API di Zucchetti Infinity**, è possibile popolare la rubrica telefonica di NethVoice con i contatti di Zucchetti e abilitare l'identificazione del chiamante in tempo reale sia per le chiamate in entrata che in uscita.

Zucchetti richiede a ciascun utente CTI di NethVoice di generare un token di autorizzazione da *Impostazioni → Integrazioni*.

Con questa integrazione, Zucchetti Infinity gestisce l'*Isola Telefonica* (il softphone basato su web) e fornisce altre tipiche funzionalità CTI di NethVoice come *presenza*, *code* e altro.

## Passaggi di configurazione

### 1. Configurare il token di integrazione in Zucchetti Infinity

Genera e configura il token di integrazione per il CTI di NethVoice in Zucchetti Infinity.

---

### 2. Configurare la sincronizzazione della rubrica {#configure-phonebook-synchronization}

Il metodo consigliato è aggiungere una fonte di rubrica **Infinity Zucchetti** dall'interfaccia di amministrazione di NethVoice, senza accedere al server tramite SSH.

1. Vai su `Applicazioni -> Fonti della Rubrica` e aggiungi una nuova fonte.
2. Seleziona `Infinity Zucchetti` come **Tipo di fonte**.
3. Compila il **Nome della rubrica** e i campi `URL`, `Username` e `Password` delle API di Infinity fornite da Zucchetti.
4. In **Impostazioni**, scegli chi può visualizzare i contatti importati (**Pubblico** o un elenco di **Gruppi**) e l'intervallo di sincronizzazione.

La mappatura dei campi è fissa e applicata dall'importatore, quindi il passaggio **Mappatura** è in sola lettura. Consulta [Fonti della rubrica](/docs/administrator-manual/configuration/applications/phonebook_sources#phonebook-source) per la tabella di mappatura e le opzioni di condivisione.

#### Alternativa: configurare manualmente lo script di sincronizzazione {#configure-synchronization-script}

Utilizza questa procedura solo se la fonte non può essere configurata dall'interfaccia di amministrazione.

1. Accedi al server tramite *SSH*.
2. Esegui i seguenti comandi, sostituendo *X* con il numero dell'istanza del sistema NethVoice da configurare:

`runagent -m nethvoiceX podman exec -it freepbx cp -a /usr/share/phonebooks/samples/zucchetti_infinity_api.py /usr/share/phonebooks/scripts/`

`runagent -m nethvoiceX podman exec -it freepbx vim /usr/share/phonebooks/scripts/zucchetti_infinity_api.py`

Modifica i seguenti parametri:

```python
# Imposta l'URL per le API
url = 'https://CHANGE_ME/infinity'
username = 'CHANGE_ME'
password = 'CHANGE_ME'
```

Sostituiscili con il *FQDN* e le credenziali API fornite da Zucchetti.

Salva il file ed esci da Vim digitando:

`:wq`

e premendo *Invio*.

---

### 3. Abilitare la ricerca del chiamante in tempo reale (opzionale)

Abilita la ricerca del chiamante in tempo reale se la rubrica di Zucchetti Infinity viene aggiornata significativamente più frequentemente rispetto alla sincronizzazione programmata della rubrica di NethVoice.

1. Accedi al server tramite *SSH*.
2. Esegui il seguente comando, sostituendo *X* con il numero dell'istanza del sistema NethVoice da configurare:

`runagent -m nethvoiceX podman exec -it freepbx cp -a /usr/src/nethvoice/samples/lookup_infinity.py /usr/src/nethvoice/lookup.d/`

`runagent -m nethvoiceX podman exec -it freepbx vim /usr/src/nethvoice/scripts/lookup_infinity.py`

Modifica i seguenti parametri:

```python
# Imposta l'URL per le API
url = ''
username = ''
password = ''
```

Sostituiscili con il *FQDN* e le credenziali API fornite da Zucchetti.

Salva il file ed esci da Vim digitando:

`:wq`

e premendo *Invio*.
