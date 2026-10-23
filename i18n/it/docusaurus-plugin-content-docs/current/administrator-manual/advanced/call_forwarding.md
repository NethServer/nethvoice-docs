---
title: Inoltro di chiamata
---

# Inoltro di chiamata

:::info Aggiornamento a FreePBX 17
Queste regole si applicano alle istanze NethVoice aggiornate a FreePBX 17 e Asterisk 22. Verificarle prima di aggiornare un'installazione esistente.
:::

## Permessi sulle chiamate in uscita {#outbound-permissions}

Una chiamata inoltrata usa i permessi di instradamento dell'interno a cui appartiene l'impostazione di inoltro. Per l'interno di un utente, si tratta delle rotte in uscita consentite dal suo profilo CTI. Gli interni hotel usano le proprie restrizioni di instradamento.

Per esempio, se il profilo di un utente non consente chiamate verso i cellulari, anche l'inoltro delle sue chiamate verso un cellulare fallisce. Il permesso **Inoltro di chiamata** consente all'utente di configurare l'inoltro, ma non concede l'accesso ad altre rotte in uscita.

Questo modifica il comportamento della precedente integrazione con FreePBX 16, in cui l'inoltro usava il contesto di instradamento interno generale. Il nuovo comportamento impedisce di aggirare le restrizioni sulle chiamate in uscita tramite l'inoltro.

La regola si applica all'inoltro incondizionato, su occupato e su mancata risposta, comprese le impostazioni di inoltro dei singoli membri di un gruppo di chiamata. Ogni membro usa i propri permessi di instradamento. Un numero esterno configurato direttamente come destinazione di un gruppo di chiamata mantiene l'instradamento di quella destinazione e va verificato separatamente.

## Interni supportati {#supported-extensions}

NethVoice deve poter ricavare il contesto di instradamento del proprietario dell'inoltro da un peer telefonico configurato. Gli interni PJSIP e i peer IAX2 usano il proprio contesto. Non è necessario che un telefono sia registrato perché il suo endpoint PJSIP configurato abbia un contesto.

L'inoltro viene rifiutato quando non è possibile ricavare il contesto del proprietario, per esempio per un interno virtuale o custom senza un peer supportato, un peer eliminato o un tipo di dispositivo non supportato. NethVoice non ripiega sull'instradamento interno senza restrizioni. Nei log di Asterisk il rifiuto può comparire con causa di chiusura `21`.

## Prima dell'aggiornamento {#before-upgrading}

1. Verificare le destinazioni di inoltro esistenti, in particolare i numeri di cellulare esterni.
2. Controllare le rotte in uscita consentite dal [profilo](../configuration/wizard.md#profiles) di ciascun utente che usa l'inoltro. Concedere solo le rotte che l'utente deve poter utilizzare.
3. Verificare gli interni virtuali, custom e hotel. Se l'inoltro non dispone del contesto di un peer supportato, configurare un interno supportato adeguato oppure rivedere l'instradamento previsto con l'amministratore del centralino.
4. Provare l'inoltro incondizionato, su occupato e su mancata risposta, oltre ai gruppi di chiamata con membri assegnati a profili diversi. Verificare sia le destinazioni consentite sia quelle vietate.

## Risoluzione dei problemi {#troubleshooting}

Se l'inoltro smette di funzionare dopo l'aggiornamento, controllare il profilo del proprietario e verificare che le sue regole in uscita corrispondano al numero di destinazione. Per gli interni hotel, controllare le regole di instradamento hotel. Se la destinazione è consentita, verificare che il proprietario abbia ancora un peer configurato con il contesto previsto.

Cambiare la destinazione o abilitare il permesso di inoltro non permette di superare questi controlli. Vedere anche [l'inoltro di chiamata in NethVoice CTI](../../user-manual/nethcti/calls.md#call-forwarding).
