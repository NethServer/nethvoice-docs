---
title: Custom VoIP trunk
sidebar_position: 6
---


# Configurare trunk VoIP personalizzati

## Panoramica

Se un provider non è presente nella pagina [Trunk supportati](/docs/administrator-manual/provisioning/supported-trunks), puoi comunque provare ad aggiungerlo manualmente.

La configurazione di un provider non presente nell'elenco richiede generalmente la modifica di parametri che NethVoice configura automaticamente per i provider conosciuti. Puoi:

* creare manualmente un trunk PJSIP in [FreePBX](freepbx)
* creare un trunk tramite la [procedura guidata di configurazione](/docs/administrator-manual/configuration/wizard), scegliendo un provider simile, soluzione consigliata, e modificare successivamente i campi differenti, generalmente il server SIP e la porta

## Prerequisiti

* Accesso amministrativo all'interfaccia web di NethVoice e a FreePBX
* Dati del provider: server o host SIP, porta SIP se diversa da 5060, nome utente, password, informazioni di autenticazione ed eventuali valori richiesti per dominio o realm
* Un ambiente di staging o una finestra di manutenzione per eseguire i test in sicurezza

## Procedura dettagliata con configurazione guidata e modifica

1. Nella sezione [Configurazione](/docs/administrator-manual/configuration/wizard) di NethVoice, vai in **Trunk** -> **VoIP**

2. Fai clic su **Configura nuovo provider**

3. Utilizza la procedura guidata per creare un nuovo trunk selezionando **Clouditalia**, oppure un altro provider simile. Assegna al trunk un nome chiaro e compila i campi utilizzando le credenziali fornite dal provider SIP

4. Fai clic su **Salva**

5. Vai in **Amministrazione -> Avanzate** per aprire l'interfaccia di FreePBX. Successivamente, vai in **Connettività -> Trunk** e apri il trunk appena creato

6. Apri la scheda **Impostazioni PJSIP**

7. Modifica i seguenti campi in base alle necessità:

   * **Server SIP**: sostituisci l'host impostato dalla procedura guidata con il server o host SIP fornito dal gestore
   * **Porta server SIP**: configura la porta corretta se diversa da 5060
   * **From Domain**, nella scheda Avanzate: configura il dominio fornito dal gestore oppure utilizza l'host del provider se non è stato indicato alcun dominio
   * Eventuali parametri specifici del gestore, come realm di autenticazione, codec, trasporto e altri valori

8. Mantieni per gli altri campi la configurazione impostata dalla procedura guidata, ad esempio **Proxy in uscita**

9. Fai clic su **Invia** nella parte inferiore della pagina, quindi su **Applica configurazione** in alto a destra per attivare le modifiche

## Test e ripristino

* Dopo aver applicato la configurazione, verifica le chiamate in uscita e in ingresso utilizzando un numero limitato di destinazioni
* Se il trunk non funziona, puoi eseguire il ripristino nei seguenti modi:

  * ripristina in FreePBX i valori precedenti dei campi modificati e fai clic su **Applica configurazione**
  * se hai utilizzato la procedura guidata, elimina il trunk personalizzato e ricrealo utilizzando un backup o le impostazioni originali annotate in precedenza

## Verifiche per la risoluzione dei problemi

* Controlla lo stato della registrazione nella panoramica dei trunk di FreePBX, verificando se il trunk risulta registrato o non registrato
* Verifica con il provider il server SIP, la porta, il nome utente e la password
* Controlla le regole di rete e firewall tra NethVoice e il provider, inclusi NAT, porta 5060/UDP o il trasporto utilizzato
* Consulta i [log di Asterisk](/docs/tutorial/troubleshooting/quick_checks#step-3--collect-asterisk-logs) e la console di FreePBX per individuare errori di autenticazione o di instradamento

