---
title: Esportare la rubrica come CSV da NethVoice
sidebar_position: 3
---

# Esportare la rubrica come CSV da NethVoice {#esportare-rubrica-csv}

## Obiettivo della guida {#obiettivo-guida}
Questo tutorial illustra come esportare i dati della rubrica di NethVoice in un file CSV pulito su NethServer 8, includendo la copia dal container MariaDB e la preparazione per il download.

## Prerequisiti {#prerequisiti}
* Accesso a una shell sull'istanza NethVoice di destinazione (`runagent -m nethvoiceX`).
* Credenziali per l'utente root di MariaDB (`MARIADB_ROOT_PASSWORD`).
* Conoscenza dei comandi di base per i container `podman`.

## Passaggio 1: Accedere all'istanza NethVoice {#passaggio-1-accedere-nethvoice}
Accedi al nodo NethVoice desiderato con il seguente comando, sostituendo `X` con il numero dell'istanza:

`runagent -m nethvoiceX`

Ora sei posizionato sull'host del cluster dove vengono eseguiti i container.

## Passaggio 2: Accedere al container MariaDB {#passaggio-2-accedere-mariadb}
Avvia una shell interattiva all'interno del container MariaDB:

`podman exec -it mariadb bash`

Questo ti dà accesso diretto al database che contiene la tabella della rubrica.

## Passaggio 3: Esportare la rubrica come CSV {#passaggio-3-esportare-rubrica}
Esegui il seguente comando all'interno del container MariaDB. Scrive la tabella `cti_phonebook` come `/tmp/rubrica.csv`:

`mysql -u root -p"$MARIADB_ROOT_PASSWORD" nethcti3 -e "SELECT * FROM cti_phonebook INTO OUTFILE '/tmp/rubrica.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';"`

Il file viene generato nella directory `/tmp` di MariaDB.

## Passaggio 4: Copiare il CSV sull'host {#passaggio-4-copiare-csv}
Esci dalla shell e dal container MariaDB, quindi copia il file nella cartella `/tmp` dell'host:

`exit`  
`podman cp mariadb:/tmp/rubrica.csv /tmp/rubrica.csv`

Questi comandi portano i dati esportati fuori dal container per ulteriori elaborazioni.

## Passaggio 5: Pulire le voci NULL {#passaggio-5-pulire-null}
Sostituisci i marcatori `NULL` del database (`\N`) con stringhe vuote, in modo che il CSV sia pronto per l'uso:

`sed -i 's/\\N/""/g' /tmp/rubrica.csv`

L'espressione `sed` gestisce in modo sicuro la sequenza letterale inserita da MySQL.

## Passaggio 6: Spostare il file in `/root` {#passaggio-6-spostare-root}
Per rendere il file facile da scaricare, spostalo in `/root`:

`mv /tmp/rubrica.csv /root/`

Ora il CSV è visibile a strumenti come WinSCP quando ci si connette al nodo.

## Pulizia {#pulizia}
Dopo aver trasferito il CSV fuori dal server, elimina la copia temporanea:

`rm -f /root/rubrica.csv`

Questo mantiene il sistema ordinato e protegge i dati sensibili.

## Vedi anche {#see-also}

Per caricare un file CSV *dentro* la rubrica di un utente CTI, usa il tipo di origine `CSV (rubrica CTI)` descritto in [Fonti della rubrica](../administrator-manual/configuration/applications/phonebook_sources.md#phonebook-source).
