---
title: NethHotel
sidebar_position: 12
---

# Modulo NethHotel

NethHotel è un modulo specializzato di NethVoice progettato per la gestione delle estensioni configurate correttamente come camere d’albergo. Fornisce funzionalità complete per la gestione delle comunicazioni degli ospiti, della fatturazione, dell'integrazione con il sistema di gestione della proprietà e della fatturazione.

## Panoramica

NethHotel consente agli operatori degli hotel di:

- **Gestire le comunicazioni degli ospiti**: Check-in/check-out, sveglia, policy di chiamate tra camere
- **Automatizzare la fatturazione**: Traccia le chiamate, applica tariffe, gestisci extra e addebiti minibar
- **Integrarsi con il PMS**: Connettiti a Oracle Hospitality OPERA tramite protocollo FIAS per una gestione degli ospiti senza interruzioni
- **Controllare le camere**: Gestisci lo stato delle camere, gruppi e policy di servizio
- **Generare report**: Traccia la cronologia delle chiamate, la fatturazione e l'utilizzo degli ospiti

## Caratteristiche principali

- ✅ **Check-in/check-out in camera** - Gestisci l'attivazione e la disattivazione delle camere degli ospiti
- ✅ **Sveglia** - Programmazione di sveglia singola e di gruppo per gli ospiti
- ✅ **Reporting delle chiamate** - Cronologia dettagliata delle chiamate e report di fatturazione
- ✅ **Tariffe personalizzabili** - Definisci tariffe per diversi tipi di chiamate
- ✅ **Selezione rapida** - Accesso rapido alle estensioni della ricezione e dei servizi
- ✅ **Gruppi di camere** - Operazioni in bulk e gestione della policy di chiamata
- ✅ **Integrazione PMS** - Connessione a Oracle OPERA tramite protocollo FIAS
- ✅ **Gestione extra** - Traccia e fattura addebiti minibar e altri
- ✅ **Gestione camere** - Visualizzazione dello stato visuale e operazioni della camera

## Link veloci

### [Configurazione e gestione di NethHotel](configuration.md)

Guida completa per la configurazione e la gestione del modulo NethHotel:
- Abilita NethHotel nella configurazione di NethVoice
- Configura le impostazioni del PBX e le rotte in uscita
- Gestisci gli interni delle camere e gli interni dei servizi
- Gestione della camera e tracciamento dello stato
- Sveglia (configurazione ospite e amministratore)
- Gruppi e operazioni in bulk
- Fatturazione e reporting
- Codici funzionalità del telefono

### [Integrazione FIAS](fias_integration.md)

Integrazione del sistema di gestione della proprietà (PMS) tramite protocollo FIAS:
- Certificazione Oracle Hospitality OPERA
- Versioni del protocollo FIAS supportate
- Check-in/check-out automatico dal PMS
- Gestione della sveglia tramite PMS
- Fatturazione e tracciamento delle chiamate automatici
- Fatturazione di minibar e extra
- Configurazione della lingua dell'ospite
- Vantaggi dell'integrazione e workflow

## Per iniziare

1. **Abilita NethHotel** - Seleziona l'opzione Abilita modulo hotel nelle impostazioni di NethVoice
2. **Configura PBX** - Crea rotte in uscita e profili hotel in NethVoice
3. **Aggiungi interni delle camere** - Assegna gli interni delle camere al profilo dell'hotel
4. **Gestisci camere** - Accedi all'interfaccia di NethHotel per gestire gli ospiti e la fatturazione
5. **(Facoltativo) Integra PMS** - Connettiti a Oracle OPERA per la gestione automatica degli ospiti

## Accedi a NethHotel

L'applicazione NethHotel è accessibile a:
```
https://<nethvoice_domain>/freepbx/hotel/rooms.php
```

O dalla procedura guidata dell'amministratore di NethVoice:
**Amministrazione** → **Avanzate (freepbx)** → **Applicazioni** → **NethHotel**

## Scopri di più

- Vedi la guida [Configurazione e gestione di NethHotel](configuration.md) per i dettagli completi di configurazione e operazione
- Rivedi [Integrazione FIAS](fias_integration.md) per la connessione PMS e l'automazione
- Consulta la [documentazione principale di NethVoice](../../intro.md) per le funzionalità generali di NethVoice