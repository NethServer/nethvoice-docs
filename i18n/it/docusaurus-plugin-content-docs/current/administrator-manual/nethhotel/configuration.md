---
title: Configurazione e gestione di NethHotel
sidebar_position: 1
---

# NethHotel

NethHotel è un modulo specializzato di NethVoice progettato per la gestione degli interni configurati correttamente come camere di hotel. Fornisce funzionalità complete per gestire le comunicazioni degli ospiti, la fatturazione e l'integrazione del sistema di gestione della proprietà.

Per impostazione predefinita, l'accesso a NethHotel è concesso all'utente admin.

## Configurazione

### Abilitazione di NethHotel

NethHotel può essere abilitato nella configurazione dell'istanza di NethVoice:

1. Accedi alle applicazioni di NethVoice all'interno di NethServer
2. Vai alla pagina **Impostazioni**
3. Seleziona l'opzione **Abilita modulo hotel**
4. (Facoltativo) Specifica l'indirizzo e la porta del server FIAS se utilizzi l'integrazione PMS
5. Salva le modifiche

### Configurazione del PBX {#pbx-configuration}

Dopo aver abilitato il modulo NethHotel, è necessaria una certa configurazione sul lato NethVoice:

1. **Crea rotte in uscita**
   - Nell'interfaccia avanzata di NethVoice, vai a **Connettività > Rotte in uscita**
   - Crea una rotta in uscita dedicata per le camere dell'hotel
   - Utilizza un prefisso (in genere `0`) e posizionalo alla fine dell'elenco delle rotte
   - Fai clic su **Salva** e **Applica configurazione**

2. **Configura profilo hotel**
   - Dalla pagina della procedura guidata di NethVoice, accedi al profilo Hotel
   - Abilita la rotta in uscita appena creata

3. **Crea gli utenti delle camere**
   - Ogni camera utilizzata in NethHotel deve prima esistere come utente nel dominio utenti (Active Directory o LDAP) configurato su NethServer 8 — vedi [Dominio utenti](../install/nethvoice_install#user-domains)
   - Nome consigliato: username `room301`, nome visualizzato `Room 301`
   - Imposta una password robusta e casuale
   - Se il dominio utenti lo supporta, abilita l'opzione **la password non scade mai** per evitare blocchi dell'account

4. **Aggiungi interni delle camere**
   - Apri la pagina [Interni](../configuration/wizard) di NethVoice
   - La pagina elenca tutti gli utenti creati nel dominio utenti, incluse le camere appena create
   - Inserisci l'interno per ogni camera (es. `room301` → interno `301`)

5. **Assegna il profilo Hotel**
   - **Singolo utente**: vai su [Configurazioni > Utenti](../configuration/wizard), seleziona la camera (es. `room301`) e imposta il campo **Profilo** su `Hotel`
   - **In blocco**: vai su [Applicazioni > Gestione massiva interni](../configuration/applications/bulk_actions#bulk-extensions-users), seleziona tutti gli interni delle camere appena creati, apri il lucchetto sul campo **Profilo** e assegna `Hotel` a tutti in un'unica operazione
   - Solo gli interni con il profilo Hotel sono visibili all'interno di NethHotel

### Accesso a NethHotel

L'applicazione NethHotel è accessibile a:
```
https://<nethvoice_domain>/freepbx/hotel/rooms.php
```

Può essere accessibile anche dalla procedura guidata dell'amministratore di NethVoice: **Amministrazione** → **Avanzate (freepbx)** → **Applicazioni** → **Hotel**

## Come configurare il PBX

Consigliamo la seguente configurazione:

### Interni delle camere

- Tutti gli interni delle camere devono appartenere a un utente creato nel dominio utenti, con un interno assegnato e il profilo Hotel applicato — vedi [Crea gli utenti delle camere](#pbx-configuration) sopra per la procedura completa

### Interni dei servizi

- Gli interni dei servizi (come la ricezione) **non** devono essere aggiunti al profilo hotel
- Configurarli come interni standard seguendo la policy di numerazione dell'hotel
- Esempio: Se gli interni delle camere vanno da 201 a 299, imposta la ricezione come 200 o 300
- Consenti alle camere di chiamare la ricezione configurando un numero di selezione rapida (vedi [Numeri di selezione rapida](#speed-dial-numbers))
- Gli interni dei servizi possono chiamarsi direttamente l'un l'altro

### Numeri a selezione rapida {#speed-dial-numbers}

I numeri a selezione rapida consentono agli ospiti nelle camere di accedere rapidamente ai servizi come la ricezione.

Configura i numeri di selezione rapida nel profilo hotel per abilitare le camere di chiamare i servizi configurati.

### Rotte in uscita

- Utilizza una rotta in uscita separata **senza** prefisso per gli interni dei servizi
- Questo dovrebbe essere diverso dalla rotta utilizzata per gli interni delle camere

## Codici funzionalità del telefono

Nell'interfaccia di gestione PBX di NethVoice, in **Codici servizio**, puoi trovare i codici da utilizzare per le funzionalità di NethHotel direttamente dai telefoni.

### Codici funzionalità di esempio

Aggiungi un addebito extra a una camera:
```
*33 + Interno della camera + # + ID extra + # + Quantità
```

**Esempio:** `*33201#99#3` addebita tre unità dell’extra codice 99 alla camera 201

Impostare una sveglia (chiamata dall’ospite):

```
977
```

## Gestione Camere {#room-management}

### Visualizzazione Stato Camere {#room-status-display}

Nella pagina principale, tutte le estensioni configurate sono visualizzate in tab in base al valore numerico del campo *callgroup* (configurato in NethVoice).

Lo stato della camera è indicato dal colore:

| Colore | Stato       | Significato                                |
| ------ | ----------- | ------------------------------------------ |
| Verde  | Disponibile | La camera è vuota e pronta per il check-in |
| Rosso  | Occupata    | L’ospite ha effettuato il check-in         |
| Giallo | Pulizia     | La camera necessita di pulizia             |

### Accesso alle Funzioni della Camera {#accessing-room-functions}

Tutte le funzioni disponibili sono presentate direttamente nel pannello della camera. È anche possibile usare il menu contestuale cliccando con il tasto destro sulla camera.

## Sveglia {#wake-up-call}

La funzione di sveglia può essere programmata come evento singolo o ripetuto su più giorni.

### Per gli Ospiti {#for-guests}

Gli ospiti possono impostare la sveglia per la loro camera digitando:

```
977
```

### Dall’Interfaccia NethHotel {#from-nethhotel-interface}

Gli amministratori possono programmare le sveglie per le camere tramite l’interfaccia web di NethHotel.

## Gruppi {#groups}

È possibile raggruppare più camere in un unico gruppo per eseguire operazioni multiple:

- **Check-in/Check-out**: esegui queste azioni su tutte le camere del gruppo
- **Sveglie**: programma sveglie per tutte le camere di un gruppo
- **Politiche di Chiamata**: definisci le regole di chiamata per i membri del gruppo:
  - Abilita chiamate tra camere
  - Abilita chiamate tra tutte le camere del gruppo
  - Consenti chiamate esterne

## Fatturazione e Report {#billing-and-reporting}

### Aggiungere un Extra {#add-an-extra}

Per aggiungere un addebito a una camera:

1. Apri il pannello della camera
2. Clicca sull’icona dell’extra corrispondente
3. L’addebito verrà aggiunto al conto della camera

### Generare Report {#generate-reports}

Per generare il report dei conti delle camere attualmente occupate:

1. Clicca sull’icona del report
2. Il report include:
   - Elenco dettagliato di tutte le chiamate effettuate dalla camera
   - Tutti gli extra/addebiti applicati alla camera
   - Totale aggiornato in tempo reale

## Tariffe {#rates}

NethHotel include un set predefinito di tariffe telefoniche in base al tipo di chiamata (mobile, locale, interurbana, ecc.).

### Gestione Tariffe {#managing-rates}

- Modifica le tariffe esistenti secondo la tua politica prezzi
- Crea nuove tariffe personalizzate
- Abilita o disabilita chiamate verso specifiche tipologie di numeri (es. numeri premium, internazionali)

## Extra {#extras}

Gli extra sono addebiti aggiuntivi assegnabili alle camere per servizi o articoli.

### Configurare Extra {#configuring-extras}

Gli extra possono essere configurati e assegnati alle camere:

- **Interfaccia Web**: usa NethHotel per aggiungere addebiti alle camere
- **Direttamente dal Telefono**: ospiti o staff possono digitare codici funzione (es. `*33`)

### Esempio {#example}

Addebitare tre unità dell’extra codice 99 alla camera 201:

```
*33201#99#3
```

## Opzioni {#options}

La sezione Opzioni generali permette di configurare politiche valide per tutto l’hotel:

- **Prefisso Chiamate Esterne**: imposta il prefisso per effettuare chiamate esterne
- **Formato Numerazione Interni**: definisce come devono essere formati gli interni
- **Chiamate tra Camere**: abilita/disabilita chiamate tra camere
- **Chiamate tra Camere dello Stesso Gruppo**
- **Chiamate Esterne**: abilita/disabilita chiamate esterne dalle camere
- **Chiamate da Camere Senza Check-in**
- **Estensione Avviso Sveglia Mancata**
- **Funzione Stato Pulizia Camera**
- **Codice Stato Pulizia Camera**
- **Lingua**: lingua predefinita per i messaggi di reception (fallback)

## Numeri Speed Dial {#speed-dial-numbers}

La sezione Speed Dial permette di definire numeri rapidi per chiamare velocemente destinazioni predefinite.

### Speed Dial Base {#basic-speed-dial}

- Definisci scorciatoie per chiamare interni rapidamente
- **Esempio**: Digitare `9` per chiamare la reception

### Speed Dial Condizionale con Time Group {#conditional-speed-dial-with-time-groups}

È possibile associare uno speed dial a time group configurati nel PBX NethVoice:

- **Destinazione**: dove va la chiamata se la condizione oraria è soddisfatta
- **Altrimenti**: dove va se la condizione NON è soddisfatta

Consente routing diverso tra orario lavorativo e notturno (es. reception di giorno, segreteria telefonica di notte).

## Storico Chiamate {#call-history}

Consulta tutte le chiamate effettuate dalle camere tramite la sezione Storico.

### Opzioni di Filtro {#filtering-options}

- Filtra per intervallo di date
- Filtra per numero di camera
- Cerca per numero chiamato

### Casi d'Uso {#use-cases}

- Verifica delle chiamate per la fatturazione
- Indagine su pattern insoliti
- Generazione report per contabilità

---

## Integrazione FIAS {#fias-integration}

NethHotel può essere collegato a un PMS (Property Management System) per operazioni automatizzate.
Vedi [Integrazione FIAS](./fias_integration) per i dettagli completi.

