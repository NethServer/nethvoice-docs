---
title: Quali sono i passaggi esatti per eliminare un utente dal dominio utenti NethVoice?
sidebar_position: 12
---

# Quali sono i passaggi esatti per eliminare un utente dal dominio utenti NethVoice?

Per eliminare un utente da NethVoice è necessario prima rimuovere tutte le risorse NethVoice associate all'utente.

## 1. Rimuovere i dispositivi associati

Aprire il **wizard di configurazione di NethVoice** e andare in:

**Utenti → Configurazioni**

Selezionare l'utente e:

- disassociare tutti i dispositivi assegnati

## 2. Rimuovere l'interno dall'utente

Andare in:

**Utenti → Interni**

Selezionare l'utente, rimuovere il numero di interno assegnato e salvare le modifiche.

Dopo poco tempo, l'utente verrà visualizzato come inattivo in NethVoice.

## 3. Eliminare l'utente dal dominio

Gli utenti NethVoice vengono forniti dall'**account provider** configurato per il dominio utenti, quindi l'utente deve essere eliminato dal dominio stesso e non direttamente da NethVoice.

Se il dominio utenti è gestito localmente su NS8, aprire l'account provider che gestisce il dominio ed eliminare l'utente.

Se NethVoice utilizza un **account provider remoto**, come un server LDAP esterno o Active Directory, l'utente deve invece essere eliminato dalla directory utenti remota.

> Prima di eliminare l'utente dal dominio, rimuovere sempre i dispositivi, la configurazione WebRTC e l'interno associati all'utente in NethVoice.
