---
title: Bypass del proxy per trunk non supportati
sidebar_position: 6
---

## Introduzione — panoramica sul bypass del proxy

Questa pagina spiega perché e come bypassare il proxy SIP per trunk non supportati. Raccolgo qui note pratiche, modalità di guasto comuni e una piccola prova di concetto basata su un approccio di port‑forwarding pensato per installazioni on‑premise dove il proxy causa problemi di connettività.

## Quando valutare il bypass del proxy

- Usare questa procedura solo quando i trunk falliscono costantemente passando attraverso il proxy e il provider o il dispositivo non possono essere modificati.
- Preferire prima modifiche di configurazione sul trunk/provider (credenziali, host, porta, transport, codec).
- Usare il bypass solo dopo aver testato in un ambiente di staging e valutato le implicazioni di sicurezza e NAT.

## Panoramica ad alto livello

- Il proxy agisce come mediatore in uscita/entrata per la maggior parte dei trunk, ma alcuni trunk e dispositivi (in particolare alcune configurazioni Mediant) non si comportano correttamente quando instradati attraverso il proxy.
- Il bypass del proxy può essere necessario per ripristinare il servizio su trunk problematici o per supportare configurazioni specifiche dell'operatore che il proxy non è in grado di gestire.
- La decisione di bypassare dovrebbe essere presa dopo aver valutato i vincoli operativi (firewall/NAT, uso delle porte, gestione dei certificati e requisiti del provider).

## Trunk con registrazione

- Comportamento predefinito: il wizard imposta il proxy come outbound proxy per i trunk registrati.
- Per bypassare un trunk registrato, rimuovere il valore dell'outbound proxy nella pagina [FreePBX advanced](/docs/administrator-manual/advanced/freepbx) relativa a quel trunk.
- Cambiare il nome del trunk aggiungendo il suffisso `Custom-`: questo è importante, altrimenti la configurazione verrà sovrascritta durante gli aggiornamenti.
- Poi, configura le impostazioni NAT in FreePBX come descritto nella [guida alla risoluzione dei problemi audio](../troubleshooting/audio_problems.md#nat-settings) per garantire la corretta gestione del traffico SIP e RTP.

## Trunk senza registrazione

- Per i trunk non registrati, il routing via proxy è configurato tramite la [pagina specifica](/docs/administrator-manual/advanced/trunks_without_registration); è possibile aggiungere route in ingresso basate sui numeri.
- Alcuni dispositivi/operatore inviano un Request‑URI contenente un dominio non riconosciuto. Sono previste regole basate sul dominio (oltre al numero) per semplificare la gestione di questi casi. Se hai questo problema, contatta il supporto Nethesis per assistenza.

## Note sui dispositivi Mediant

- Le configurazioni Mediant sono spesso gestite dal tecnico del gestore e possono essere immutabili o errate.
- Problemi comuni:
  - Dispositivi che si aspettano di usare la porta 5060 mentre il proxy occupa quella porta.
  - Request‑URI che contiene un dominio non riconosciuto, causando il rifiuto da parte del proxy.
- Possibili workaround:
  - Usare mappature di dominio personalizzate (simili alle regole di numerazione) — è in roadmap.
  - Quando solo l'operatore può modificare il Mediant, adattare la configurazione del PBX (o bypassare il proxy) per rendere il trunk funzionante.

## Problemi operativi ricorrenti

- Gli installatori PBX potrebbero non poter cambiare operatore a causa di vincoli di portabilità.
- Alcuni ambienti migrati da versioni precedenti di NethVoice (dove tutto funzionava) vedono regressioni.
- I provider possono variare unilateralmente i parametri del trunk.
- Il proxy richiede hairpin NAT in alcune topologie; molti installatori non possono o non vogliono modificare il firewall.


## Esperimento di port‑forwarding (ALTAMENTE SPERIMENTALE)

Scopo: permettere un bypass completo del proxy SIP in casi estremi (tipico: Mediant on‑prem che si aspetta 5060).

### Scenario tipico

- Installazione on‑prem dove il Mediant deve essere raggiungibile su UDP 5060.
- Vincolo: 5060 deve essere riservata ai trunk; i telefoni devono continuare a usare 5061.

### Limitazioni e prerequisiti

- Non è possibile rimappare 5061 (richiederebbe certificati e modifiche alla provisioning dei telefoni).
- Dopo aver abilitato il port forward, i settaggi NAT di FreePBX devono essere aggiornati: impostare l'IP pubblico, i network locali e includere la rete di NethServer tra le local nets.
- Il port forward non è visibile nell'interfaccia del proxy.
- Limitare il port forward a un singolo IP sorgente quando possibile.

### Esempio di comandi firewall (solo UDP 5060)

Esportare una variabile con la porta SIP di Asterisk:

```bash
export $(runagent -m nethvoice1 grep ASTERISK_SIP_PORT environment)
```

Aggiungere una regola di forward globale:

```bash
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT"
firewall-cmd reload
```

Limitare il forward a un singolo IP (esempio 1.2.3.4):

```bash
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT source address=1.2.3.4"
firewall-cmd reload
```

### Verifica e rimozione

Elencare le regole:

```bash
firewall-cmd --list-rich-rules
```

Rimuovere la regola globale:

```bash
firewall-cmd --permanent --remove-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT"
```

Rimuovere la regola limitata a IP:

```bash
firewall-cmd --permanent --remove-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT source address=1.2.3.4"
```

Applicare le modifiche:

```bash
firewall-cmd reload
```

### Note

- Varianti IPv6 e TCP richiedono regole equivalenti.
- Questa è una mitigazione sperimentale e dovrebbe essere usata solo in casi in cui non sono disponibili correzioni dal provider/dispositivo.
