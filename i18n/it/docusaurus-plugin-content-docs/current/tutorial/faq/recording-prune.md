---
title: Eliminare le vecchie registrazioni di chiamate
sidebar_position: 3
---

# Eliminare le vecchie registrazioni di chiamate

*Come eliminare automaticamente le registrazioni di chiamate più vecchie di un numero specificato di giorni su NethVoice*

## Obiettivo della guida

Lo scopo di questa guida è **spiegare come configurare l'eliminazione automatica delle registrazioni di chiamate** su NethVoice e **descrivere la configurazione, il funzionamento e le procedure di pulizia dei dati** per garantire un'eliminazione sicura delle vecchie registrazioni.

## Introduzione

NethVoice archivia le registrazioni di chiamate come file nel file system e mantiene i riferimenti ai metadati in un database MariaDB. Nel corso del tempo, le registrazioni possono consumare spazio su disco significativo. La **funzionalità di eliminazione delle registrazioni** consente di **eliminare automaticamente sia i file di registrazione che i loro metadati del database per le registrazioni più vecchie di un numero configurabile di giorni** (predefinito: 10 giorni) utilizzando i timer systemd e i servizi.

### Come funziona

* Un timer systemd attiva un servizio ogni giorno a mezzanotte.
* Il servizio rimuove prima i riferimenti ai metadati nel database delle registrazioni più vecchie.
* Il servizio quindi elimina i file di registrazione effettivi dal file system.
* Il periodo di conservazione è **configurabile** (predefinito: 10 giorni).
* Le registrazioni e i loro metadati eliminati sono **rimossi permanentemente**.

### Casi di utilizzo

* **Gestione dello spazio su disco**: Prevenire l'ingrandimento del file system rimuovendo automaticamente le vecchie registrazioni.
* **Conformità ai criteri di conservazione dei dati**: Mantenere le politiche di conservazione specifiche dell'organizzazione per i record di chiamata.
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

Creare un file denominato `recording-prune.timer` con il seguente contenuto:

**File: recording-prune.timer**

```ini
[Unit]
Description=Daily timer to prune old call recordings

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Questo file definisce un **timer quotidiano** che attiva il servizio di eliminazione ogni giorno. L'impostazione `Persistent=true` assicura che il timer venga eseguito anche se il sistema era spento all'ora pianificata.

### Passaggio 3: Creare il file del servizio

Creare un file denominato `recording-prune.service` con il seguente contenuto:

**File: recording-prune.service**

```ini
[Unit]
Description=Prune old call recordings
Wants=recording-prune.timer

[Service]
Type=oneshot
Environment=PODMAN_SYSTEMD_UNIT=%n
EnvironmentFile=%S/state/passwords.env
WorkingDirectory=%S/state
Environment=DAYS=10
ExecStart=/bin/bash -c "podman exec -i mariadb mysql -uroot -p\"${MARIADB_ROOT_PASSWORD}\" asteriskcdrdb -e \"UPDATE asteriskcdrdb.cdr SET recordingfile = '' WHERE calldate < DATE_SUB(NOW(), INTERVAL ${DAYS} DAY) AND recordingfile != '';\""
ExecStart=podman exec -ti freepbx find /var/spool/asterisk/monitor/ -type f -mtime +${DAYS} -delete
```

La riga `Environment=DAYS=10` imposta il periodo di conservazione su 10 giorni. È possibile modificare questo valore per cambiare quanti giorni di registrazioni conservare.

**Nota:** Il servizio utilizza due comandi `ExecStart` separati:
* Il primo comando aggiorna il database per cancellare i riferimenti ai file di registrazione.
* Il secondo comando elimina i file di registrazione effettivi dal disco.


### Passaggio 4: Abilitare e avviare il timer

Abilitare il timer per l'avvio automatico al boot:

```bash
systemctl --user daemon-reload
systemctl --user enable --now recording-prune.timer
```

**Fatto!** Il servizio di eliminazione delle registrazioni è ora configurato per l'esecuzione una volta al giorno.

---


## Procedure di backup e ripristino {#backup-and-restore}

Prima di fare affidamento sull'eliminazione automatica in produzione, è **fortemente consigliato** creare backup dei dati di registrazione.

Prima di eseguire qualsiasi comando, assicurarsi di essere nell'ambiente applicativo NethVoice:
```bash
runagent -m nethvoice1
```

### Backup dei metadati delle registrazioni di chiamata

Per eseguire il backup dei metadati di registrazione di chiamata dalla tabella CDR:

```bash
export MARIADB_ROOT_PASSWORD="$(awk -F= '/^MARIADB_ROOT_PASSWORD=/{sub(/^[^=]*=/,""); print}' ~/.config/state/passwords.env)"
podman exec -ti mariadb mysqldump -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb cdr > cdr_backup.dump
```

Questo comando:
* Estrae la password root di MariaDB dal file `passwords.env`.
* Utilizza `mysqldump` per esportare la tabella CDR in un file denominato `cdr_backup.dump` nell'ambiente host.

### Backup dei file di registrazione

Per eseguire il backup dei file di registrazione effettivi:

```bash
podman exec freepbx tar -cz /var/spool/asterisk/monitor/ > recordings_backup.tar.gz
```

### Ripristino dei metadati da un backup

Per ripristinare la tabella CDR da un backup:

```bash
podman cp cdr_backup.dump mariadb:/tmp
podman exec -ti mariadb /bin/bash -c "mysql -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb < /tmp/cdr_backup.dump"
```

Questo comando:
* Copia il file di backup nel container MariaDB.
* Ripristina i dati CDR dal backup utilizzando il comando `mysql`.

### Ripristino dei file di registrazione da un backup

Per ripristinare i file di registrazione effettivi:

```bash
podman cp recordings_backup.tar.gz freepbx:/tmp
podman exec -ti freepbx /bin/bash -c "tar -xz -C / -f /tmp/recordings_backup.tar.gz"
podman exec -ti freepbx chown -R asterisk:asterisk /var/spool/asterisk/monitor/
podman exec -ti freepbx rm /tmp/recordings_backup.tar.gz
```

---

## Gestione e risoluzione dei problemi {#management-and-troubleshooting}

Prima di eseguire qualsiasi comando, assicurarsi di essere nell'ambiente applicativo NethVoice:
```bash
runagent -m nethvoice1
```

### Eseguire il servizio manualmente

Per testare il servizio di eliminazione manualmente:

```bash
systemctl --user start recording-prune.service
```

### Controllare lo stato del timer

Per visualizzare il timer e la sua ultima esecuzione:

```bash
systemctl --user status recording-prune.timer
```

### Visualizzare i log del servizio

Per vedere l'output del servizio di eliminazione:

```bash
api-server-logs logs --entity module --name nethvoice1
```

Questo visualizza i log per il modulo NethVoice. Cercare le voci relative al servizio di eliminazione delle registrazioni:

```
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Starting Prune old call recordings...
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Finished Prune old call recordings.
```

### Regolare il periodo di conservazione

Per modificare il periodo di conservazione dai 10 giorni predefiniti:

1. Modificare il file `recording-prune.service`.
2. Individuare la riga: `Environment=DAYS=10`
3. Sostituire `10` con il numero di giorni desiderato.
4. Salvare il file.
5. Ricaricare il daemon utente systemd: `systemctl --user daemon-reload`

### Verificare l'eliminazione delle registrazioni

Per verificare che le registrazioni siano state eliminate, controllare la directory di registrazione:

```bash
ls -lah /var/spool/asterisk/monitor/
```

È inoltre possibile interrogare la tabella CDR per vedere quali registrazioni hanno riferimenti di file vuoti:

```bash
podman exec -ti mariadb mysql -uroot -p$MARIADB_ROOT_PASSWORD -e "SELECT COUNT(*) FROM asteriskcdrdb.cdr WHERE recordingfile = '' AND calldate < DATE_SUB(NOW(), INTERVAL 10 DAY);"
```

### Disabilitare il servizio di eliminazione

Per disabilitare il timer e interrompere l'eliminazione automatica:

```bash
systemctl --user disable --now recording-prune.timer
```

Per rimuovere i file di servizio e timer:

```bash
rm ~/.config/systemd/user/recording-prune.service
rm ~/.config/systemd/user/recording-prune.timer
systemctl --user daemon-reload
```

### Problemi comuni

**Il timer non è in esecuzione:**
* Verificare se il timer è abilitato: `systemctl --user list-timers`
* Verificare che i file di servizio si trovino nella posizione corretta: `ls -la ~/.config/systemd/user/recording-prune.*`
* Ricaricare il daemon utente systemd: `systemctl --user daemon-reload`

**Errori di connessione al database:**
* Confermare che il container MariaDB è in esecuzione: `podman ps | grep mariadb`
* Testare manualmente la connessione MariaDB utilizzando le credenziali fornite.

**I file non vengono eliminati:**
* Verificare che il container FreePBX sia in esecuzione: `podman ps | grep freepbx`
* Controllare i permessi nella directory `/var/spool/asterisk/monitor/`.
* Assicurarsi che la variabile di ambiente `DAYS` corrisponda al periodo di conservazione desiderato.

---

## Riepilogo {#summary}

Seguendo questa guida, avete:

* Creato file di servizio e timer dell'utente systemd per l'eliminazione automatica delle registrazioni di chiamate.
* Configurato il periodo di conservazione in base alle esigenze dell'organizzazione.
* Abilitato l'eliminazione giornaliera automatica delle vecchie registrazioni di chiamate.
* Appreso come eseguire il backup e il ripristino sicuro dei metadati di registrazione e dei file.

Il servizio di eliminazione delle registrazioni verrà ora eseguito una volta al giorno e rimuoverà le registrazioni più vecchie del periodo di conservazione configurato, aiutandovi a gestire lo spazio su disco e a mantenere le prestazioni del database.
