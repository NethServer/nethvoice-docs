---
title: "Template telefono personalizzato"
sidebar_position: 2
tags: 
  - provisioning
  - telefoni
  - template
---

Se hai telefoni che devono essere configurati con parametri predefiniti diversi da quello standard scelto dal provisioning, e questi parametri non sono esposti dall'interfaccia Tancredi nella Procedura guidata NethVoice, puoi creare un template alternativo che sarà selezionabile dall'interfaccia.

Al termine di questa guida, potrai scegliere, per il modello a cui sei interessato, sia un template standard che un template personalizzato con parametri personalizzati non presenti nell'interfaccia.

Per installare vim, esegui il seguente comando:

```bash
dnf -y install vim
```

Per questo esempio, eseguiremo questa operazione su un telefono NethPhone X3.

## Accesso al contenitore Tancredi

Prima di procedere, devi accedere al contenitore Tancredi con il seguente comando:

```bash
runagent -m nethvoiceX podman exec -it tancredi bash
```

Sostituisci `nethvoiceX` con l'istanza NethVoice desiderata (`nethvoice1`, `nethvoice2`, ecc.).

## Creazione e modifica del template

1. Crea un template personalizzato con il seguente comando:

```bash
cp /usr/share/tancredi/data/templates/nethesis.tmpl /var/lib/tancredi/data/templates-custom/nethesis_custom.tmpl
```

2. Modifica il template personalizzato con un editor di testo, modificando i parametri di interesse per la tua configurazione. Per primo, installa vim nel contenitore:

```bash
apt-get install vim
vim /var/lib/tancredi/data/templates-custom/nethesis_custom.tmpl
```

3. Crea un nuovo modello da **Dispositivi → Modelli** duplicando il NethPhone X3 originale e rinominandolo (ad esempio, NethPhone X3 Custom).

4. Modifica l'ambito del modello creato per puntare al template personalizzato:

```bash
vim /var/lib/tancredi/data/scopes/nethesis-NPX3-custom.ini
```

Modifica il seguente parametro:

```ini
tmpl_phone = "nethesis_custom.tmpl"
```

A questo punto, quando selezioni il modello NethPhone X3 Custom dalla procedura guidata provisioning, il template modificato verrà utilizzato automaticamente.
