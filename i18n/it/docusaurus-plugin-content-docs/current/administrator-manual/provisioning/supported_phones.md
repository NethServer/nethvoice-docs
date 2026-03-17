---
title: Telefoni supportati
sidebar_position: 3
---

# Telefoni Supportati

Supportiamo i seguenti telefoni utilizzando provisioning automatico. 
Tuttavia, tutti i telefoni SIP standard dovrebbero funzionare con NethVoice. 
Per i telefoni non elencati come supportati, è possibile creare modelli di provisioning personalizzati utilizzando Tancredi.

## NethPhone

**FIRMWARE Versione 2.0 o superiore**

- NP-X3
- NP-V61
- NP-X5
- NP-X210

## Fanvil

**FIRMWARE Versione 2.0 o superiore**

- V61, V62, V63, V64, V65, V67
- X1/S/SP
- X210
- X3/S/SP/G/SG, X3U, X3U Pro
- X4/G/SG, X4U, X4U-V2
- X5S, X5U, X5U-V2
- X6, X6U, X6U-V2
- X7A/C
- X301/P/G/W, X303/P/G/W
- H2U, H2U-V2, H5

## Yealink

**FIRMWARE Versione 0.86 o superiore**

- T19(P) E2, T21(P) E2, T23P/G, T27G, T29G
- T30/P, T31/P/G/W, T33P/G, T34W
- T40P/G, T41P/S/U, T42G/S/U, T43U, T44U/W, T46G/S/U, T48G/S/U, T49G
- T52S, T53/W/C, T54S/W, T56A, T57W, T58V/A/W, VP59
- T73U/W, T74U/W, T77U
- T85W, T87W, T88W
- AX83H, AX86R

## Snom

**FIRMWARE Versione 8.7.5 o superiore**

- D120, D140, D150
- D305, D315, D345, D375, D385
- D710, D712, D713, D715, D717, D725, D735, D745, D765, D785
- D812, D815, D862, D865

:::note
I telefoni Snom D862 e D865 non supportano i comandi HTTP, quindi non è possibile utilizzare click-to-call.
:::

## Gigaset

**FIRMWARE Version 10.1.0 or superiore**

- P710 IP PRO, P810-P810B IP PRO, P820-P825 IP PRO, P850W-P855BW IP PRO

## Compatibilità Provisioning

La tabella seguente riassume i metodi di provisioning utilizzati da ogni produttore all'accensione iniziale del telefono.

| Produttore | Metodo Primario | Metodo Secondario | Opzione DHCP | Valore Opzione DHCP                                     |
|------------|-----------------|------------------|-------------|---------------------------------------------------------|
| NethPhone  | RPS             | DHCP             | 66          | `http://IP_PHONE_SYSTEM/provisioning/$mac.cfg`          |
| Fanvil     | RPS             | DHCP             | 66          | `http://IP_PHONE_SYSTEM/provisioning/$mac.cfg`          |
| Yealink    | RPS             | DHCP             | 66          | `http://IP_PHONE_SYSTEM/provisioning/$MAC.cfg`          |
| Snom       | RPS             | DHCP             | 66 e 67     | `http://IP_PHONE_SYSTEM/provisioning/{mac}.xml`         |
| Gigaset    | DHCP[^f1]       | RPS              | 114         | `http://IP_PHONE_SYSTEM/provisioning/%MACD.xml`         |

[^f1]: Per i telefoni Gigaset, assicurarsi che il server DHCP di rete non fornisca OPTION 66.



## Guida ai Parametri di Provisioning

Le funzioni dei telefoni che possono essere configurate tramite provisioning sono raggruppate nei pannelli dell'interfaccia di amministrazione di NethVoice e sono descritte nelle sezioni seguenti.

Non tutti i modelli di telefoni offrono le stesse funzioni, quindi alcuni parametri o interi pannelli potrebbero non essere visualizzati.

In generale, lasciare un campo vuoto o selezionare l'opzione - (segno meno) indica che viene utilizzato il valore ereditato dal contesto con priorità inferiore; la priorità più alta è data alle impostazioni del telefono, seguita in ordine discendente dal modello e dalle impostazioni predefinite.
Fare riferimento a `Priorità di Configurazione del Telefono <provisioning-scopes-priority>` per ulteriori informazioni.



### Tasto soft

I `tasti soft` sono tasti telefonici programmabili designati per le funzioni di chiamata del telefono.

Se il telefono fornisce più tasti di quelli visualizzati nell'interfaccia di amministrazione di NethVoice, è disponibile un pulsante `Visualizza altro` per aggiungere tasti aggiuntivi.

A seconda del `Tipo`, potrebbe essere necessario completare anche i campi `Valore` e `Etichetta`, come indicato nella tabella seguente.

Nella colonna Etichetta, il termine predefinito significa che se il campo Etichetta viene lasciato vuoto, il telefono assegnerà un'`etichetta` predefinita al tasto soft.

| Tipo         | Descrizione                                                                                              | Valore                  | Etichetta    |
|-------------|----------------------------------------------------------------------------------------------------------|-------------------------|--------------|
| Inoltro     | Abilita/disabilita lo stato di inoltro (inoltro incondizionato). Se abilitato, tutte le chiamate in ingresso vengono inoltrate al numero specificato | Numero di telefono o interno | Sì (predefinito)|
| DND         | Abilita/disabilita lo stato non disturbare. Se abilitato, tutte le chiamate in ingresso vengono rifiutate | No                      | No           |
| Richiamare  | Richiama l'ultimo numero composto                                                                       | No                      | Sì (predefinito)|
| Rispondere  | Rispondi a una chiamata in corso all'interno specificato                                                 | Numero di telefono      | Sì           |
| Numero veloce | Chiama il numero dato premendo il tasto                                                                 | Numero di telefono      | Sì           |
| Prelievo gruppo | Rispondi a una chiamata in corso per il gruppo di prelievo configurato                                | No (Il gruppo è configurato.)| No           |
| Cronologia  | Visualizza la schermata della cronologia delle chiamate                                                  | No                      | Sì (predefinito)|
| Menu        | Mostra il menu di configurazione del telefono                                                           | No                      | Sì (predefinito)|
| Stato       | Visualizza informazioni sullo stato del telefono (es. versione firmware, stato della registrazione...)    | No                      | Sì (predefinito)|
| Prefisso    | Aggiungi le cifre specificate al numero composto                                                        | Le cifre del prefisso   | Sì (predefinito)|
| LDAP        | Visualizza la rubrica LDAP configurata sul telefono                                                     | No                      | Sì (predefinito)|



### Tasto linea

I `tasti linea` sono tasti telefonici programmabili che assomigliano ai tasti soft ma sono progettati più specificamente per la gestione delle chiamate e il monitoraggio dello stato degli interni.

Se il telefono fornisce più tasti di quelli visualizzati nell'interfaccia di amministrazione di NethVoice, è disponibile un pulsante `Visualizza altro` per aggiungere tasti aggiuntivi.

A seconda del `Tipo`, potrebbe essere necessario completare i campi `Valore` e `Etichetta`, come descritto nella tabella seguente.

Nella colonna Etichetta, il termine "predefinito" significa che se il campo Etichetta viene lasciato vuoto, il telefono assegnerà un'`etichetta` predefinita al tasto linea.

| Tipo | Descrizione | Valore | Etichetta |
|------|-------------|--------|-----------|
| Conferenza | Le chiamate attive vengono unite in una conferenza dove ogni partecipante può ascoltare e parlare con gli altri simultaneamente | No | Sì (predefinito) |
| Inoltro | Abilita/disabilita lo stato di inoltro (inoltro incondizionato). Se abilitato, tutte le chiamate in ingresso vengono inoltrate al numero specificato | Numero di telefono o interno | Sì (predefinito) |
| Trasferimento chiamata | Trasferisce la chiamata corrente al numero selezionato o a un altro numero composto al momento | Numero di telefono o interno | Sì |
| Attesa | Mette la chiamata corrente in attesa | No | Sì (predefinito) |
| DND | Abilita/disabilita lo stato Non Disturbare (DND). Se abilitato, tutte le chiamate in ingresso vengono rifiutate | No | No |
| Richiamare | Richiama l'ultimo numero composto | No | Sì (predefinito) |
| Rispondere | Rispondi a una chiamata in ingresso all'interno specificato | Numero di telefono | Sì |
| DTMF | Esegue una sequenza di toni DTMF (Dual-Tone Multi-Frequency) durante una chiamata | Sequenza di simboli o numeri | Sì |
| Accedi/Esci agente dinamico | Accedi/Esci dalla coda di chiamata | No | Sì |
| Segreteria telefonica | Controlla la segreteria telefonica | No | Sì (predefinito) |
| Numero veloce | Chiama il numero dato premendo il tasto | Numero di telefono | Sì |
| Linea | Seleziona un'altra linea | No | Sì (predefinito) |
| BLF | Monitora lo stato dell'interno selezionato e, a seconda del suo stato, esegue un prelievo o un numero veloce quando premuto | Numero di telefono | Sì |
| URL | Esegue una richiesta HTTP GET all'indirizzo web specificato | Indirizzo web (URL) | Sì |
| Prelievo gruppo | Rispondi a una chiamata in corso per il gruppo di prelievo configurato | No (il gruppo è configurato) | No |
| Multicast paging | Invia audio direttamente all'interno configurato per il paging multicast | Numero di telefono | Sì (predefinito) |
| Registra | Avvia la registrazione audio della chiamata attiva | No | Sì (predefinito) |
| Prefisso | Aggiungi le cifre specificate al numero composto | Le cifre del prefisso | Sì (predefinito) |
| Blocco telefono | Attiva la funzione di blocco del telefono, limitando l'accesso ai tasti e all'interfaccia | No | Sì (predefinito) |
| LDAP | Mostra la rubrica LDAP configurata sul telefono | No | Sì (predefinito) |



### Tasto exp

I *Tasti di Espansione* sono pulsanti programmabili su *moduli di espansione*, dispositivi che possono essere collegati al telefono per aumentare il numero di tasti disponibili.

Se il modulo di espansione fornisce più tasti di quelli visualizzati nell'interfaccia di amministrazione di NethVoice, è disponibile un pulsante `Visualizza altro` per aggiungere tasti aggiuntivi.

Questo tipo di tasto è configurato in modo simile al tasto Linea.

Questo tipo di tasto è configurato in modo simile al `Tasto linea <panel-linekeys>`.



### Schermo e Suoneria

- `Selezione Suoneria`: Ogni telefono ha alcune suonerie predefinite che possono essere selezionate in base al loro numero progressivo. Dove supportato, è possibile scegliere anche una suoneria personalizzata, che deve essere caricata nel campo descritto di seguito.
- `Gestione Suoneria Personalizzata`: Seleziona un file audio per la suoneria personalizzata precedentemente caricato, o carica una nuova tramite il modulo di gestione dedicato. Il formato audio deve essere compatibile con le specifiche del produttore del telefono.
- `Immagine di Sfondo" "Immagine Screen Saver`: Seleziona un file immagine per lo sfondo dello schermo del telefono e lo screen saver, o carica una nuova tramite il pannello di gestione dedicato. Il formato immagine deve essere compatibile con le specifiche del produttore del telefono.
- `Attivazione Screen Saver`: Intervallo di tempo dopo il quale lo screen saver viene attivato.
- `Spegnimento Retroilluminazione`: Intervallo di tempo dopo il quale lo schermo abbassa la luminosità o spegne la retroilluminazione dello schermo.
- `Luminosità Schermo" "Contrasto Schermo`: Seleziona i livelli di luminosità e contrasto dello schermo.



### Preferenze

- `Indirizzo Server NTP`: Il nome host o l'indirizzo IP del server Network Time Protocol (NTP) per impostare automaticamente l'ora del telefono.

- "Programma Provisioning\`\`: Selezionando Solo all'avvio, i telefoni rinnovano la loro configurazione dopo l'accensione o il riavvio. In alternativa, selezionando Ogni giorno, i telefoni rinnovano autonomamente la loro configurazione a un'ora casuale durante la notte.

- `Modalità Trasferimento per Tasti Linea`: Specifica come i tasti linea trasferiscono la chiamata in corso a un altro interno.

  - **Nuova Chiamata** avvia una nuova chiamata all'interno configurato sul tasto linea, mettendo la chiamata corrente in attesa.
  - **Consultiva** mette sempre la chiamata corrente in attesa, e il completamento del trasferimento può avvenire mentre l'interno configurato sul tasto linea sta squillando o anche dopo la risposta.
  - **Cieco/Senza Conferma** trasferisce immediatamente la chiamata corrente all'interno configurato.

- `Lingua Telefono`: Lingua utilizzata dallo schermo del telefono e dalla sua interfaccia web.

- `Fuso Orario`: Imposta il fuso orario del telefono, necessario per gli aggiustamenti dell'ora legale.

- `Suonerie`: Sono specifiche per ogni paese e indicano lo stato della chiamata attraverso un segnale udibile: tono libero, tono occupato, tono di riagganciamento, ecc.

- `Formato Ora" "Formato Data": Scelta del formato ora/data visualizzato sullo schermo del telefono.

- `Firmware`: Caricamento e selezione di una nuova versione firmware per il telefono.

### Rubrica LDAP

Le prime due opzioni in `Tipo di Rubrica` non consentono ulteriori modifiche. I telefoni utilizzeranno la rubrica centralizzata fissa e non modificabile di NethVoice. Tuttavia, selezionando "Rubrica personalizzata", è possibile modificare i campi rimanenti in questo pannello per collegare i telefoni a un server LDAP di terze parti.

- `Indirizzo Server`: Nome host o indirizzo IP del server LDAP.
- `Numero Porta`: Porta TCP utilizzata dal server LDAP.
- `Nome Utente" "Password`: Credenziali di autenticazione per il servizio LDAP. Il nome utente potrebbe essere specificato come Distinguished Name (DN) LDAP o in un altro formato, a seconda dei requisiti del server LDAP.
- `Crittografia`: Protegge la connessione con TLS o STARTTLS. Attenzione! Alcuni telefoni non supportano la crittografia, ed è necessario selezionare Nessuno.
- `Base di Ricerca (DN)`: Limita l'accesso al ramo del database LDAP specificato come base. Di solito, la base di ricerca è obbligatoria.
- `Filtro di Ricerca per Nome Contatto` `Filtro di Ricerca per Numero Telefono`: I filtri di ricerca LDAP devono essere specificati con la sintassi definita da RFC-4515 e successive. Il carattere % (percentuale) può essere utilizzato come segnaposto che il telefono sostituisce con il numero composto.
- `Attributi per Nome Contatto`: Separati da spazio, elenca i nomi degli attributi LDAP che possono contenere il nome del contatto.
- `Formato di Visualizzazione Nome`: I nomi degli attributi preceduti dal carattere % (percentuale) possono essere composti per formare il pattern con cui il nome è visualizzato sullo schermo del telefono.
- `Attributo per Numero Telefono Principale` `Attributo per Numero Mobile` `Attributo per Altro Numero Telefono`: Questi tre campi contengono nomi di attributi LDAP per i rispettivi numeri di telefono.

### Rete

I telefoni utilizzano il protocollo DHCP per ricevere la configurazione di rete: IP, subnet mask, DNS e gateway. In alcuni casi, DHCP viene utilizzato anche per ottenere l'URL di provisioning (fare riferimento a "Metodi di provisioning").

Tuttavia, i seguenti parametri possono essere configurati in questo pannello:

- `Identificatore VLAN (VID)`: Specificando un numero tra 1 e 4094, il telefono aggiungerà tagging VLAN ai pacchetti generati dal telefono stesso, in conformità allo standard IEEE 802.1Q.
- `Identificatore VLAN per Porta PC`: Specificando un numero tra 1 e 4094, il telefono aggiungerà tagging VLAN ai pacchetti provenienti dalla porta PC (o porta dati), seguendo lo standard IEEE 802.1Q.

Nei campi VLAN, il valore "" (stringa vuota) di solito considera l'impostazione con priorità inferiore (modello o predefinito), mentre "0" (zero) corrisponde a "disabilitato".

:::warning
L'inserimento di un identificatore VLAN non corretto può rendere il telefono irraggiungibile.
:::





