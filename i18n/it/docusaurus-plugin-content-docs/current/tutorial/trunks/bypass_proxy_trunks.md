---
title: Bypass del proxy per trunk non supportati
sidebar_position: 6
---

## Introduzione — panoramica sul bypass del proxy

Questa pagina spiega perché e come bypassare il proxy SIP per trunk non supportati. Raccolgo qui note pratiche, modalità di guasto comuni e l'impostazione di bypass del proxy, pensata per installazioni on‑premise dove il proxy causa problemi di connettività.

## Quando valutare il bypass del proxy

- Usare questa procedura solo quando i trunk falliscono costantemente passando attraverso il proxy e il provider o il dispositivo non possono essere modificati.
- Preferire prima modifiche di configurazione sul trunk/provider (credenziali, host, porta, transport, codec).
- Usare il bypass solo dopo aver testato in un ambiente di staging e valutato le implicazioni di sicurezza e NAT.

## Panoramica ad alto livello

- Il proxy agisce come mediatore in uscita/entrata per la maggior parte dei trunk, ma alcuni trunk e dispositivi (in particolare alcune configurazioni Mediant) non si comportano correttamente quando instradati attraverso il proxy.
- Il bypass del proxy può essere necessario per ripristinare il servizio su trunk problematici o per supportare configurazioni specifiche dell'operatore che il proxy non è in grado di gestire.
- La decisione di bypassare dovrebbe essere presa dopo aver valutato i vincoli operativi (firewall/NAT, uso delle porte, gestione dei certificati e requisiti del provider).

## Trunk con registrazione {#trunks-with-registration}

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


## Bypass del proxy per un dispositivo {#proxy-bypass}

Scopo: permettere a un singolo dispositivo di saltare il proxy SIP in ingresso e parlare direttamente con NethVoice, in casi estremi (tipico: Mediant TIM on‑prem che si aspetta 5060).

Usare con attenzione!

### Scenario tipico {#proxy-bypass-scenario}

- Installazione on‑prem dove il Mediant deve raggiungere NethVoice su UDP 5060.
- Il proxy continua a servire i telefoni e gli altri trunk sulle stesse porte.

### Configurazione {#proxy-bypass-configuration}

Il bypass si configura nelle impostazioni dell'applicazione NethVoice Proxy in esecuzione sullo stesso nodo di NethVoice:

1. Aprire la pagina **Settings** dell'applicazione NethVoice Proxy ed espandere **Advanced**.
2. Sotto **Proxy bypass**, fare clic su **Add IP address**.
3. Inserire l'indirizzo IP del dispositivo, per esempio `192.168.1.245`.
4. Selezionare l'istanza NethVoice che riceve le sue chiamate. Sono elencate solo le istanze in esecuzione sul nodo del proxy.
5. Fare clic su **Save**.

Se la lista **Proxy bypass** non è presente, aggiornare l'applicazione NethVoice Proxy.

Per ogni indirizzo il proxy crea da solo le regole del firewall:

- Il traffico SIP su UDP inviato dal dispositivo alla porta SIP del proxy viene rediretto all'istanza NethVoice. La regola ha la precedenza su quelle delle [reti locali](/docs/administrator-manual/advanced/nethvoice_proxy#local-networks), quindi il bypass vale anche per un dispositivo dentro una rete locale.
- La porta SIP dell'istanza NethVoice viene aperta per il dispositivo. Senza questa apertura le chiamate in ingresso vengono chiuse dopo circa 30 secondi.
- Le regole seguono la [porta SIP](/docs/administrator-manual/advanced/nethvoice_proxy#sip-ports) del proxy e vengono rimosse quando l'indirizzo viene tolto dalla lista.

Lato NethVoice, configurare il trunk del dispositivo come descritto in [Trunk con registrazione](#trunks-with-registration): nessun **Outbound proxy** e il suffisso `Custom-` nel nome del trunk.

### Limitazioni e prerequisiti {#proxy-bypass-limitations}

- Il bypass riguarda solo il SIP su UDP.
- L'istanza NethVoice deve essere in esecuzione sullo stesso nodo del proxy.
- Un dispositivo che sta già inviando traffico SIP al proxy continua a raggiungerlo finché non resta in silenzio per circa due minuti. Per applicare subito una modifica, fermare il dispositivo per quel tempo oppure riavviare il nodo.
- I settaggi NAT di FreePBX devono essere aggiornati: impostare l'IP pubblico, i network locali e includere la rete di NethServer tra le local nets. Vedi la [guida alla risoluzione dei problemi audio](../troubleshooting/audio_problems.md#nat-settings).
- In alternativa al bypass, la porta SIP del proxy può essere spostata (per esempio su 5070) per lasciare libera la 5060: vedi [Porte SIP](/docs/administrator-manual/advanced/nethvoice_proxy#sip-ports). Telefoni, gateway e app mobile con provisioning di NethVoice seguono le nuove porte.

### Verifica {#proxy-bypass-verification}

Elencare le regole del firewall sul nodo:

```bash
firewall-cmd --list-rich-rules
```

Per ogni indirizzo sono elencate due regole con `priority="-10"`: una con `forward-port` e una con `accept`.

### Regole aggiunte a mano {#proxy-bypass-manual-rules}

Le versioni precedenti di questa pagina aggiungevano il port forward con comandi `firewall-cmd`. Quelle regole non sono gestite dal proxy: non seguono le sue porte SIP, vengono ignorate quando il dispositivo appartiene a una rete locale del proxy e non aprono la porta SIP di NethVoice.

Prima di aggiungere un dispositivo alla lista **Proxy bypass**, rimuovere le regole aggiunte a mano per quel dispositivo. Elencarle, poi rimuoverle una alla volta passando il testo così come viene stampato:

```bash
firewall-cmd --list-rich-rules
firewall-cmd --permanent --remove-rich-rule='<testo della regola>'
firewall-cmd --reload
```

Non rimuovere le regole create dal proxy, come quelle con `priority="-10"` e quelle delle reti locali.
