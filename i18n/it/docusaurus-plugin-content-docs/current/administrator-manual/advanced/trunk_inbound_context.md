---
title: Contesto di ingresso dei trunk
sidebar_position: 8
---

# Contesto di ingresso dei trunk

Ogni chiamata proveniente da un trunk entra nel dialplan di Asterisk nel **contesto** configurato su quel trunk. Il contesto stabilisce quale numero viene usato come numero chiamato (DID) per il confronto con le [rotte in ingresso](../configuration/wizard.md#in-entrata) e, in alcuni casi, quale numero viene mostrato come identificativo del chiamante. NethVoice imposta il contesto automaticamente quando il trunk viene creato con la [procedura guidata di configurazione](../configuration/wizard.md#trunk); va modificato solo se il provider trasmette i numeri in modo non standard.

## Contesti disponibili {#available-contexts}

| Contesto | Numero chiamato (DID) preso da | Note |
|---|---|---|
| `from-pstn` | Request-URI dell'INVITE | Contesto predefinito di Asterisk per le chiamate in ingresso. |
| `from-pstn-toheader` | Header `To` | Predefinito per la maggior parte dei provider VoIP configurati con la procedura guidata. |
| `from-pstn-identity` | Request-URI | Predefinito per i gateway fisici. Il numero del chiamante viene preso dall'header `P-Asserted-Identity` o `P-Preferred-Identity`, se presente. |
| `from-pstn-preferredin` | Header `P-Preferred-Identity` | Per i trunk multinumero il cui provider invia il DID chiamato in questo header. Disponibile da NethVoice 1.8. |

Tutti i contesti passano poi la chiamata a `from-pstn`: le rotte in ingresso e il resto del flusso della chiamata entrante non cambiano.

## Modificare il contesto di un trunk {#change-the-context-of-a-trunk}

1. Vai in **Amministrazione -> Avanzate** per aprire l'interfaccia di FreePBX, poi in **Connettività -> Trunk** e apri il trunk.
2. Apri la scheda **Impostazioni PJSIP**, quindi la scheda **Avanzate**.
3. Imposta il campo **Contesto** sul contesto desiderato, ad esempio `from-pstn-preferredin`.
4. Fai clic su **Invia** in fondo alla pagina, quindi su **Applica configurazione** in alto a destra per attivare la modifica.

## DID nell'header P-Preferred-Identity {#did-in-the-p-preferred-identity-header}

Alcuni provider forniscono un trunk multinumero con lo stesso numero nella Request-URI di tutte le chiamate e trasportano il DID effettivamente composto dal chiamante nell'header `P-Preferred-Identity`:

```text
P-Preferred-Identity: <sip:0123456789@provider.example>
```

Con i contesti predefiniti le rotte in ingresso non possono distinguere i DID del trunk. Imposta il contesto del trunk su `from-pstn-preferredin`: il dialplan estrae il numero dall'header (`0123456789` nell'esempio) e lo usa come numero chiamato, così è possibile creare una rotta in ingresso per ogni DID. Se l'header manca, la chiamata usa il numero della Request-URI.

Per verificare il comportamento, chiama uno dei DID e cerca la riga `Goto(from-pstn,<DID>,1)` nei [log di Asterisk](../../tutorial/troubleshooting/quick_checks.md#step-3--collect-asterisk-logs), dove `<DID>` è il numero trasportato dall'header.

:::info
Con un [trunk senza registrazione](./trunks_without_registration.md) dietro NethVoice Proxy, il provider deve comunque anteporre il prefisso radice (**Root**) alla Request-URI, in modo che il proxy instradi la chiamata all'istanza NethVoice corretta. Il DID preso dall'header non ha prefisso: crea le rotte in ingresso sul numero senza prefisso.
:::

:::warning
Prima di NethVoice 1.8 lo stesso comportamento si otteneva aggiungendo un contesto personalizzato `[from-pstn-preferredin]` in `extensions_custom.conf`. Rimuovi quel contesto dopo l'aggiornamento, altrimenti Asterisk registra avvisi di priorità duplicate a ogni ricaricamento della configurazione.
:::
