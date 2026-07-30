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
- La condivisione per gruppi dei contatti *creati in NethVoice CTI* è disponibile solo con `Manage private and shared contacts`. I gruppi selezionabili derivano dai permessi gruppo del Pannello di presenza e dall'appartenenza dell'utente ai gruppi; se il permesso `all_groups` del Pannello di presenza è abilitato, sono disponibili tutti i gruppi operatori.
- I contatti importati hanno una propria visibilità, scelta dall'amministratore sulla fonte stessa: vedi [Opzioni di condivisione](#sharing-options).

#### Aggiunta di rubriche esterne

Le fonti della rubrica si configurano nell'**interfaccia di amministrazione di NethVoice**, dal menu `Applicazioni -> Fonti della rubrica`. Da qui puoi definire un'origine esterna per i contatti che NethVoice dovrebbe utilizzare per risolvere le chiamate in arrivo e in uscita.
Questi contatti verranno aggiunti alla rubrica di NethVoice e resi disponibili per l'utilizzo in NethVoice CTI e NethVoice App.

:::note
Questa configurazione non è disponibile dentro NethVoice CTI: solo un amministratore può creare fonti della rubrica, dall'interfaccia di amministrazione di NethVoice.
:::

Per configurare una nuova fonte sono necessari tre passaggi:

- **Fonte**: Configura l'accesso al database di origine dei contatti.
- **Mappatura**: Associa i campi del database di origine a quelli della rubrica di NethVoice.
- **Impostazioni**: Scegli chi può vedere i contatti importati e, per le fonti ricorrenti, l'intervallo di sincronizzazione.

#### Fonte della rubrica {#phonebook-source}

I valori disponibili per `Tipo di origine` sono:

| Tipo di origine | Destinazione | Comportamento |
|-----------------|--------------|---------------|
| `MySQL` | Rubrica centralizzata | Sincronizzazione ricorrente da un database esterno |
| `MS SQL Server` | Rubrica centralizzata | Sincronizzazione ricorrente da un database Microsoft SQL Server esterno |
| `CSV` | Rubrica centralizzata | Sincronizzazione ricorrente da un file CSV |
| `CSV (rubrica CTI)` | Rubrica personale di un utente CTI | Importazione una tantum, senza sincronizzazione |
| `Infinity Zucchetti` | Rubrica centralizzata | Sincronizzazione ricorrente tramite le API di Zucchetti Infinity |

Per le fonti che alimentano la rubrica centralizzata deve essere assegnato un `Nome rubrica` univoco, per distinguere l'origine dei contatti importati nella rubrica di NethVoice. La fonte `CSV (rubrica CTI)` non lo richiede, perché i contatti importati appartengono a un utente e non a una fonte centralizzata.

In base al `Tipo di origine`, è necessario specificare attributi aggiuntivi:

**MySQL**

Il nome del database, l'indirizzo/porta del server, il nome utente e la password per il database di origine sono richiesti.

Inoltre, nell'area di testo Seleziona query, deve essere inserita la query SQL utilizzata per recuperare i dati da importare nella rubrica centralizzata. Se presente nell'area di testo, sostituisci la parola `[table]` con il nome della tabella di origine.

**MS SQL Server**

Gli stessi campi di una fonte MySQL: nome del database, indirizzo/porta del server (`1433` per impostazione predefinita), nome utente, password e query di selezione.

La connessione avviene via TCP con il driver ODBC FreeTDS, quindi l'istanza SQL Server deve accettare connessioni TCP/IP sulla porta configurata. Un'istanza con nome non può essere indicata come `server\istanza`: usa l'indirizzo e la porta TCP su cui l'istanza è in ascolto.

**CSV**

Nel campo `URL`, puoi specificare l'indirizzo web di un file in formato CSV (Comma-Separated Values, valori separati da virgole e virgolette doppie "" come qualificatori di testo, obbligatorio se il campo contiene una virgola o uno spazio). Gli indirizzi che iniziano con `http://` e `https://` sono accettati.

In alternativa, puoi caricare un file CSV tramite il pulsante a destra dello stesso campo di testo. In questo caso, il campo `URL` verrà compilato automaticamente.

Il file CSV deve essere codificato in UTF-8 e contenere nomi di colonne nella prima riga.

Il pulsante `Verifica` consente di visualizzare in anteprima i dati recuperati dall'origine.

**CSV (rubrica CTI)**

Questo tipo di origine usa lo stesso formato di file CSV descritto sopra, ma i contatti vengono importati una sola volta nella rubrica personale di un singolo utente CTI invece che nella rubrica centralizzata. Non viene salvata alcuna fonte ricorrente e non è disponibile un intervallo di sincronizzazione.

L'importazione viene avviata dall'amministratore da `Applicazioni -> Fonti della rubrica -> Nuova sorgente rubrica`, scegliendo `CSV (CTI phonebook)` come `Tipo sorgente`. Gli utenti non possono importare un CSV da NethVoice CTI: al termine dell'importazione trovano i contatti nella propria rubrica, dove possono gestirli come se li avessero creati loro.

![Nuova sorgente rubrica con tipo sorgente CSV (CTI phonebook)](/img/administrator-manual/phonebook_source_csv_cti.png)

Sono richieste due impostazioni aggiuntive:

- **Proprietario**: l'utente CTI a cui vengono assegnati i contatti. Sono selezionabili solo gli utenti configurati (con un interno) e il campo è obbligatorio.
- **Opzioni di condivisione**: la visibilità applicata a tutti i contatti importati, vedi [Opzioni di condivisione](#sharing-options).

Il campo di destinazione `owner_id` non è mappabile per le origini CSV, perché il proprietario viene scelto esplicitamente.

Al termine dell'importazione il risultato viene riportato come numero di righe `Importate`, `Saltate` e `Fallite`. Le righe senza valore nel campo mappato su `name` vengono saltate e una riga malformata non interrompe l'intera importazione.

**Infinity Zucchetti**

Popola la rubrica centralizzata tramite le API di [Zucchetti Infinity](/docs/tutorial/integrations/zucchetti-integration). Sono richiesti solo l'`URL` dell'endpoint API, lo `Username` e la `Password` forniti da Zucchetti: la mappatura dei campi è fissa e applicata dall'importatore, quindi il passaggio **Mappatura** la mostra solo in sola lettura.

| Campo di origine Infinity | Campo rubrica NethVoice |
|---------------------------|-------------------------|
| Name | `name` |
| Company | `company` |
| Mobile phone | `cellphone` |
| Work phone | `workphone` |
| Home phone | `homephone` |
| Fax | `fax` |
| Work email | `workemail` |
| Home email | `homeemail` |
| Address | `workstreet` |
| Office | `title` |
| Office / status / id | `notes` |

#### Opzioni di condivisione {#sharing-options}

Per ogni fonte puoi scegliere chi può vedere i contatti importati:

- **Pubblico**: i contatti sono visibili a tutti gli utenti che possono accedere alla rubrica. È il valore predefinito e corrisponde al comportamento delle fonti configurate prima dell'introduzione di questa opzione.
- **Gruppi**: i contatti sono visibili solo ai membri dei gruppi selezionati. Deve essere selezionato almeno un gruppo.

I gruppi selezionabili sono i gruppi CTI configurati in `Configurazioni -> Utenti`. Se nessuno dei gruppi selezionati esiste più (ad esempio perché rinominato o eliminato), la fonte viene rifiutata invece di essere resa pubblica in modo silenzioso.

#### Risoluzione personalizzata del nome

Se desideri utilizzare un'origine diversa dalla rubrica centralizzata per risolvere i nomi, puoi creare uno script di risoluzione personalizzato e posizionarlo nella directory *~/.local/share/containers/storage/volumes/lookup.d/\_data/*.

Nel [repository Github](https://github.com/nethesis/ns8-nethvoice/tree/main/freepbx/usr/src/nethvoice/samples), ci sono due script di esempio: *lookup_dummy.php* e *lookup_vte.php*, che possono servire come punto di partenza per la creazione del tuo script personalizzato.

Lo script *lookup_dummy.php* restituisce un risultato finto per qualsiasi numero composto o chiamata in arrivo, mentre lo script lookup_vte.php utilizza un'API esterna.

| Campo           | Descrizione             |
|-----------------|------------------------|
| owner_id        | Proprietario del contatto   |
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
| firstname       | Nome                   |
| lastname        | Cognome                |
| job             | Mansione               |
| workphone2      | Secondo numero di telefono di lavoro |
| cellphone2      | Secondo numero di cellulare |
| otherphone      | Altro numero di telefono |
| otheremail      | Altro indirizzo email  |
| facebook        | Profilo Facebook       |
| instagram       | Profilo Instagram      |
| linkedin        | Profilo LinkedIn       |

Il campo `name` resta quello usato per la risoluzione del nome nelle chiamate: `firstname` e `lastname` sono campi aggiuntivi, visualizzati e modificabili in NethVoice CTI.

:::note
Il nome della fonte non è più un campo di destinazione mappabile: viene impostato una sola volta nel campo `Nome rubrica` della fonte.
:::

#### Impostazioni

Le fonti ricorrenti (`MySQL`, `MS SQL Server`, `CSV`, `Infinity Zucchetti`) sincronizzano i contatti in modo pianificato. La fonte `CSV (rubrica CTI)` è un'importazione una tantum e non ha impostazioni di sincronizzazione.

Puoi scegliere l'intervallo di sincronizzazione per i contatti tra:

- 15 minuti
- 30 minuti
- 1 ora
- 6 ore
- 24 ore

Una volta creata l'origine, puoi:

- Sincronizzare immediatamente utilizzando il pulsante `Sincronizza`
- Abilitare/disabilitare la sincronizzazione
