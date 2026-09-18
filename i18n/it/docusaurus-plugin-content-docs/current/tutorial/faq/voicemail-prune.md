---
title: liminare i vecchi messaggi di casella vocale
sidebar_position: 4
---

# Eliminare i vecchi messaggi di casella vocale

*Come eliminare automaticamente i messaggi di casella vocale più vecchi di un numero specificato di giorni su NethVoice*

## Obiettivo della guida

Lo scopo di questa guida è **spiegare come configurare l'eliminazione automatica della casella vocale** su NethVoice e **descrivere la configurazione, il funzionamento e le procedure di backup dei dati** per garantire un'eliminazione sicura dei vecchi messaggi.

## Introduzione

NethVoice archivia i messaggi di casella vocale in un database MariaDB. Nel corso del tempo, questo database può crescere in modo significativo, consumando spazio su disco. La **funzionalità di eliminazione della casella vocale** consente di **eliminare automaticamente i messaggi di casella vocale più vecchi di un numero configurabile di giorni** (predefinito: 10 giorni) utilizzando i timer systemd e i servizi.

### Come funziona

* Un timer systemd attiva un servizio ogni giorno a mezzanotte.
* Il servizio esegue una query MariaDB che elimina i messaggi di casella vocale più vecchi del periodo di conservazione configurato.
* Il periodo di conservazione è **configurabile** (predefinito: 10 giorni).
* I messaggi eliminati sono **rimossi permanentemente** dal database.

### Casi di utilizzo

* **Gestione dello spazio su disco**: Prevenire l'ingrandimento del database rimuovendo automaticamente i messaggi precedenti.
* **Conformità ai criteri di conservazione dei dati**: Mantenere le politiche di conservazione specifiche dell'organizzazione.
* **Ottimizzazione delle prestazioni**: Mantenere il database snello migliora le prestazioni delle query.

## Prerequisiti {#prerequisites}

* Accesso SSH al cluster NethServer 8 dove è in esecuzione NethVoice.
* Familiarità con i servizi utente systemd.

## Istruzioni di configurazione {#setup-instructions}

### Passaggio 1: Accedere all'applicazione

Innanzitutto, connettersi a NethServer utilizzando SSH, quindi accedere all'ambiente container NethVoice:

```bash
runagent -m nethvoice1
```

Quindi navigare nella directory utente systemd:

```bash
cd ~/.config/systemd/user/
```

*(Il percorso completo è `/home/nethvoice1/.config/systemd/user/`)*

### Passaggio 2: Creare il file del timer

Creare un file denominato `voicemail-prune.timer` con il seguente contenuto:

**File: voicemail-prune.timer**

```ini
[Unit]
Description=Daily timer to prune old voicemails

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Questo file definisce un **timer quotidiano** che attiva il servizio di eliminazione ogni giorno. L'imcasellazione `Persistent=true` assicura che il timer venga eseguito anche se il sistema era spento all'ora pianificata.

### Passaggio 3: Creare il file del servizio

Creare un file denominato `voicemail-prune.service` con il seguente contenuto:

**File: voicemail-prune.service**

```ini
[Unit]
Description=Prune old voicemail messages
Wants=voicemail-prune.timer

[Service]
Type=oneshot
Environment=PODMAN_SYSTEMD_UNIT=%n
EnvironmentFile=%S/state/passwords.env
WorkingDirectory=%S/state
Environment=DAYS=10
ExecStart=podman exec -i mariadb mysql -uroot -p"${MARIADB_ROOT_PASSWORD}" asteriskcdrdb -e "DELETE FROM voicemessages WHERE msgnum <> -1 AND CAST(origtime AS UNSIGNED) < (UNIX_TIMESTAMP() - ${DAYS}*24*60*60); OPTIMIZE TABLE voicemessages;"
```

La riga `Environment=DAYS=10` imcasella il periodo di conservazione su 10 giorni. È possibile modificare questo valore per cambiare quanti giorni di casella vocale conservare.

### Passaggio 4: Abilitare e avviare il timer

Abilitare il timer per l'avvio automatico al boot:

```bash
systemctl --user daemon-reload
systemctl --user enable --now voicemail-prune.timer
```

**Fatto!** Il servizio di eliminazione della casella vocale è ora configurato per l'esecuzione una volta al giorno.

---

## Procedure di backup e ripristino {#backup-and-restore}

Prima di fare affidamento sull'eliminazione automatica in produzione, è **fortemente consigliato** creare un backup dei dati di casella vocale.

Prima di eseguire qualsiasi comando, assicurarsi di essere nell'ambiente applicativo NethVoice:
```bash
runagent -m nethvoice1
```

### Creazione di un backup

Per eseguire il backup della tabella voicemessages:

```bash
export MARIADB_ROOT_PASSWORD="$(awk -F= '/^MARIADB_ROOT_PASSWORD=/{sub(/^[^=]*=/,""); print}' ~/.config/state/passwords.env)"
podman exec -ti mariadb mysqldump -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb voicemessages > backup.dump
```

Questo comando:
* Estrae la password root di MariaDB dal file `passwords.env`.
* Utilizza `mysqldump` per esportare la tabella `voicemessages` in un file denominato `backup.dump` nell'ambiente host.

### Ripristino da un backup

Per ripristinare la tabella voicemessages da un backup:

```bash
podman cp backup.dump mariadb:/tmp
podman exec -ti mariadb /bin/bash -c "mysql -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb < /tmp/backup.dump"
podman exec -ti mariadb rm /tmp/backup.dump
```

Questo comando:
* Copia il file di backup nel container MariaDB.
* Ripristina i dati dal backup utilizzando il comando `mysql`.

---

## Gestione e risoluzione dei problemi {#management-and-troubleshooting}

Prima di eseguire qualsiasi comando, assicurarsi di essere nell'ambiente applicativo NethVoice:
```bash
runagent -m nethvoice1
```

### Eseguire il servizio manualmente

Per testare il servizio di eliminazione manualmente:

```bash
systemctl --user start voicemail-prune.service
```

### Controllare lo stato del timer

Per visualizzare il timer e la sua ultima esecuzione:

```bash
systemctl --user status voicemail-prune.timer
```

### Visualizzare i log del servizio

Per vedere l'output del servizio di eliminazione:

```bash
api-server-logs logs --entity module --name nethvoice1
```

Questo visualizza i log per il modulo NethVoice. Cercare le voci relative al servizio di eliminazione della casella vocale:

```
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Starting Prune old voicemail messages...
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Finished Prune old voicemail messages.
```

### Regolare il periodo di conservazione

Per modificare il periodo di conservazione dai 10 giorni predefiniti:

1. Modificare il file `voicemail-prune.service`.
2. Individuare la riga: `Environment=DAYS=10`
3. Sostituire `10` con il numero di giorni desiderato.
4. Salvare il file.
5. Ricaricare il daemon utente systemd: `systemctl --user daemon-reload`

### Disabilitare il servizio di eliminazione

Per disabilitare il timer e interrompere l'eliminazione automatica:

```bash
systemctl --user disable --now voicemail-prune.timer
```

Per rimuovere i file di servizio e timer:

```bash
rm ~/.config/systemd/user/voicemail-prune.service
rm ~/.config/systemd/user/voicemail-prune.timer
systemctl --user daemon-reload
```

### Problemi comuni

**Il timer non è in esecuzione:**
* Verificare se il timer è abilitato: `systemctl --user list-timers`
* Verificare che i file di servizio si trovino nella posizione corretta: `ls -la ~/.config/systemd/user/voicemail-prune.*`
* Ricaricare il daemon utente systemd: `systemctl --user daemon-reload`

**Errori di connessione al database:**
* Confermare che il container MariaDB è in esecuzione: `podman ps | grep mariadb`
* Testare manualmente la connessione MariaDB utilizzando le credenziali fornite.
