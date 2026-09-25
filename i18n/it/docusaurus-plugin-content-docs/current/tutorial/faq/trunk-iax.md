---
title: Come configurare un trunk tra due sistemi NethVoice?
sidebar_position: 11
---

# Come configurare un trunk PJSIP tra due sistemi NethVoice?

Per collegare due sistemi **NethVoice su NS8**, è consigliato utilizzare un **trunk PJSIP**.

PJSIP può riutilizzare le porte SIP/RTP standard già utilizzate da NethVoice, quindi non richiede l'apertura di una porta dedicata aggiuntiva specifica per il trunk tra le due sedi.

È possibile collegare i due sistemi anche utilizzando **IAX**, ma in questo caso è necessario consentire la porta IAX su entrambi i sistemi NethVoice e sui relativi firewall.

Inoltre, le configurazioni IAX standard non forniscono cifratura della segnalazione e del traffico audio, quindi questa soluzione è generalmente sconsigliata rispetto a PJSIP, soprattutto quando è possibile utilizzare **TLS/SRTP**.

Su entrambi i sistemi, aprire:

**Avanzate → Connectivity → Trunks**

## Primo NethVoice

Creare un nuovo **trunk PJSIP** e configurarlo nel seguente modo:

- **Authentication**: `Outbound`
- **Registration**: `Send`
- **Username**: scegliere uno username per il trunk
- **Secret**: scegliere una password
- **SIP Server**: hostname del secondo NethVoice
- **SIP Server Port**: `5060`
- **Context**: `from-internal`
- **Transport**: `0.0.0.0-udp`

Nelle impostazioni PJSIP avanzate, mantenere abilitata l'opzione **Send Line in Registration**.

## Secondo NethVoice

Creare un altro **trunk PJSIP** utilizzando le stesse credenziali:

- **Authentication**: `Inbound`
- **Registration**: `Receive`
- **Secret**: la stessa password configurata sul primo NethVoice
- **SIP Server**: hostname del primo NethVoice
- **SIP Server Port**: `5060`
- **Context**: `from-internal`
- **Transport**: `0.0.0.0-udp`

Se l'interfaccia non permette di inserire il **SIP Server** quando è selezionato `Receive`, impostare temporaneamente **Registration** su `Send`, inserire le informazioni del server e successivamente reimpostarlo su `Receive`.

## Come instradare le chiamate tra le due sedi?

Una volta registrato il trunk, creare le **rotte in uscita** necessarie su entrambi i sistemi.

I dial pattern devono corrispondere agli interni disponibili sul NethVoice remoto.

Ad esempio, se la sede remota utilizza interni nell'intervallo `2XX`, è possibile creare una rotta in uscita che instradi tali numeri attraverso il trunk tra le sedi.

## Quali porte firewall sono necessarie?

Per PJSIP su UDP, il firewall tra i due sistemi NethVoice deve consentire:

- segnalazione SIP sulla porta **UDP 5060**
- traffico audio RTP sulle porte **UDP 10000-20000**

Se invece viene utilizzato TLS:

- utilizzare la porta SIP **5061**
- impostare **Transport** su `0.0.0.0-tls`

## Cosa fare se le chiamate in ingresso vengono visualizzate come anonymous?

A seconda della configurazione del trunk, le chiamate provenienti dal NethVoice remoto possono essere ricevute come **anonymous**.

Se necessario, le chiamate SIP anonime possono essere abilitate da:

**Avanzate → Settings → Asterisk SIP Settings**

Abilitare questa opzione solo quando necessario e quando l'accesso SIP al PBX è adeguatamente limitato dal firewall.
