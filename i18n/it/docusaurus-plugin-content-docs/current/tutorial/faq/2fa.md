---
title: Debug e reset del 2FA degli utenti di NethVoice CTI
sidebar_position: 5
---

# Come verificare e resettare il 2FA di un utente CTI

Un utente CTI può aver abilitato la **Two-Factor Authentication (2FA)** e non riuscire più ad accedere. Può inoltre essere necessario verificare quali utenti hanno attualmente il 2FA abilitato oppure resettare la configurazione 2FA di uno specifico utente.

## Dove viene memorizzata la configurazione 2FA del CTI?

In NethVoice, le informazioni relative al 2FA degli utenti CTI vengono memorizzate nel filesystem, all'interno del volume utilizzato dal container `nethcti-middleware`.

Negli esempi viene utilizzata come riferimento l'istanza NethVoice `nethvoice1`; il percorso deve essere adattato in base al numero effettivo dell'istanza.

La configurazione è memorizzata nel seguente percorso:

```text
/home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/
````

All'interno di questa directory è presente una directory per ogni utente CTI.

Ad esempio:

```text
/home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/giulias
/home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/andrear
```

I seguenti file sono relativi alla configurazione 2FA:

* `secret` - chiave segreta del 2FA
* `codes` - codici di recovery
* `status` - stato del 2FA

## Come posso verificare se un utente ha il 2FA abilitato?

Accedere alla directory dell'utente:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/<username>
```

Quindi visualizzarne il contenuto:

```bash
ls
```

Un utente con **2FA abilitato** presenta generalmente i seguenti file:

```text
codes
secret
status
```

Ad esempio:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/giulias
ls
```

Output:

```text
codes
secret
status
```

Un utente senza 2FA attivo può invece avere solamente:

```text
secret
```

oppure una directory vuota.

## Come posso visualizzare tutti gli utenti con il 2FA abilitato?

Eseguire:

```bash
find /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/ \
  -mindepth 2 -maxdepth 2 \
  -type f -name status \
  -exec grep -q '^1$' {} \; \
  -print | sed 's|/status$||; s|.*/||'
```

Il comando verifica gli utenti il cui file `status` contiene il valore `1` e ne restituisce gli username.

Esempio di output:

```text
giulias
user1
user2
```

## Come posso resettare il 2FA di un utente CTI?

Accedere alla directory 2FA dell'utente:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/<username>
```

Per resettare l'attivazione corrente del 2FA mantenendo la chiave segreta esistente, rimuovere i file `codes` e `status`:

```bash
rm -f codes status
```

In alternativa, per rimuovere completamente la configurazione 2FA memorizzata, inclusa la chiave segreta, eliminare tutti i file presenti nella directory dell'utente:

```bash
rm -f *
```

Dopo il reset:

* il 2FA non sarà più attivo per l'utente
* l'utente potrà accedere al CTI senza inserire un codice OTP
* l'utente potrà configurare nuovamente il 2FA dal proprio profilo CTI, se necessario

## Riferimento rapido

Visualizzare gli utenti con 2FA abilitato:

```bash
find /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/ \
  -mindepth 2 -maxdepth 2 \
  -type f -name status \
  -exec grep -q '^1$' {} \; \
  -print | sed 's|/status$||; s|.*/||'
```

Verificare uno specifico utente:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/<username>
ls
```

Resettare il 2FA:

```bash
rm -f codes status
```

Rimuovere completamente la configurazione 2FA memorizzata per l'utente:

```bash
rm -f *
```

