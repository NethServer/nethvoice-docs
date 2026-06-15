---
title: Fonti della rubrica
sidebar_position: 2
---

# Fonti della rubrica

La rubrica di NethVoice è una directory centralizzata che archivia e gestisce le informazioni di contatto per utenti e organizzazioni. Consente la risoluzione del nome e del numero senza interruzioni per le chiamate in arrivo e in uscita, garantendo che i dettagli del chiamante siano sempre disponibili in NethVoice CTI e NethVoice App. La rubrica può aggregare i contatti da varie fonti, inclusi database esterni e file CSV, fornendo una rubrica unificata e facilmente accessibile per tutti gli utenti.

#### Come le fonti della rubrica interagiscono con i permessi CTI

I contatti importati dalle Fonti della rubrica vengono aggiunti alla rubrica centralizzata e sono disponibili per la ricerca e la risoluzione dei nomi in NethVoice CTI e NethVoice App.

- Gli utenti con accesso alla rubrica possono cercare e visualizzare questi contatti importati.
- I contatti importati restano in sola lettura in NethVoice CTI, anche quando l'utente ha permessi avanzati sulla rubrica.
- Le azioni di creazione, modifica, eliminazione e condivisione in NethVoice CTI si applicano solo ai contatti CTI creati dagli utenti.
- I livelli di permesso rubrica configurati nei profili utente controllano cosa gli utenti possono fare con i contatti CTI, non con i record importati da fonti esterne. Per i dettagli sui profili, vedi [Permessi rubrica](../wizard.md#rubrica).
- La condivisione per gruppi si applica solo ai contatti CTI ed è disponibile solo con `Manage private and shared contacts`. I gruppi selezionabili derivano dai permessi gruppo del Pannello di presenza e dall'appartenenza dell'utente ai gruppi; se il permesso `all_groups` del Pannello di presenza è abilitato, sono disponibili tutti i gruppi operatori.

#### Aggiunta di rubriche esterne

Dal menu `Applicazioni -> Fonti della rubrica`, puoi definire un'origine esterna per i contatti che NethVoice dovrebbe utilizzare per risolvere le chiamate in arrivo e in uscita.
Questi contatti verranno aggiunti alla rubrica di NethVoice e resi disponibili per l'utilizzo in NethVoice CTI e NethVoice App.

Per configurare una nuova fonte sono necessari tre passaggi:

- **Fonte**: Configura l'accesso al database di origine dei contatti.
- **Mappatura**: Associa i campi del database di origine a quelli della rubrica di NethVoice.
- **Impostazioni**: Scegli l'intervallo di sincronizzazione.

#### Fonte della rubrica

Un `Nome rubrica` univoco deve essere assegnato all'origine per distinguere l'origine dei contatti importati nella rubrica di NethVoice.

In base al `Tipo di origine`, è necessario specificare attributi aggiuntivi:

**MySQL**

Il nome del database, l'indirizzo/porta del server, il nome utente e la password per il database di origine sono richiesti.

Inoltre, nell'area di testo Seleziona query, deve essere inserita la query SQL utilizzata per recuperare i dati da importare nella rubrica centralizzata. Se presente nell'area di testo, sostituisci la parola `[table]` con il nome della tabella di origine.

**CSV**

Nel campo `URL`, puoi specificare l'indirizzo web di un file in formato CSV (Comma-Separated Values, valori separati da virgole e virgolette doppie "" come qualificatori di testo, obbligatorio se il campo contiene una virgola o uno spazio). Gli indirizzi che iniziano con `http://` e `https://` sono accettati.

In alternativa, puoi caricare un file CSV tramite il pulsante a destra dello stesso campo di testo. In questo caso, il campo `URL` verrà compilato automaticamente.

Il file CSV deve essere codificato in UTF-8 e contenere nomi di colonne nella prima riga.

Il pulsante `Verifica` consente di visualizzare in anteprima i dati recuperati dall'origine.

#### Risoluzione personalizzata del nome

Se desideri utilizzare un'origine diversa dalla rubrica centralizzata per risolvere i nomi, puoi creare uno script di risoluzione personalizzato e posizionarlo nella directory *~/.local/share/containers/storage/volumes/lookup.d/\_data/*.

Nel [repository Github](https://github.com/nethesis/ns8-nethvoice/tree/main/freepbx/usr/src/nethvoice/samples), ci sono due script di esempio: *lookup_dummy.php* e *lookup_vte.php*, che possono servire come punto di partenza per la creazione del tuo script personalizzato.

Lo script *lookup_dummy.php* restituisce un risultato finto per qualsiasi numero composto o chiamata in arrivo, mentre lo script lookup_vte.php utilizza un'API esterna.

| Campo           | Descrizione             |
|-----------------|------------------------|
| owner_id        | Proprietario del contatto   |
| type            | Fonte di origine       |
| homeemail       | Indirizzo email personale     |
| workemail       | Indirizzo email di lavoro     |
| homephone       | Numero di telefono personale      |
| workphone       | Numero di telefono di lavoro      |
| cellphone       | Numero di telefono cellulare      |
| fax             | Numero di fax             |
| title           | Titolo di lavoro              |
| company         | Azienda                |
| notes           | Note                  |
| name            | Nome e cognome    |
| homestreet      | Indirizzo personale          |
| homepob         | Casella postale personale            |
| homecity        | Città personale             |
| homeprovince    | Provincia personale    |
| homepostalcode  | Codice postale personale       |
| homecountry     | Paese/regione personale    |
| workstreet      | Indirizzo di lavoro           |
| workpob         | Casella postale di lavoro            |
| workcity        | Città di lavoro              |
| workprovince    | Provincia di lavoro          |
| workpostalcode  | Codice postale di lavoro       |
| workcountry     | Paese/regione di lavoro    |
| url             | Indirizzo del sito web        |

#### Impostazioni

Puoi scegliere l'intervallo di sincronizzazione per i contatti tra:

- 15 minuti
- 30 minuti
- 1 ora
- 6 ore
- 24 ore

Una volta creata l'origine, puoi:

- Sincronizzare immediatamente utilizzando il pulsante `Sincronizza`
- Abilitare/disabilitare la sincronizzazione
