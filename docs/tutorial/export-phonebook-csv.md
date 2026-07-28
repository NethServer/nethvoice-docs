---
title: Export phonebook as CSV from NethVoice
sidebar_position: 9
---

# Export phonebook as CSV from NethVoice {#export-phonebook-csv}

## Guide objective {#guide-objective}
This tutorial walks through exporting the NethVoice phonebook data to a clean CSV file on NethServer 8, including copying it off the MariaDB container and preparing it for download.

## Prerequisites {#prerequisites}
* Access to a shell on the target NethVoice instance (`runagent -m nethvoiceX`).
* Credentials for the MariaDB root user (`MARIADB_ROOT_PASSWORD`).
* Knowledge of basic `podman` container commands.

## Step 1: Enter the NethVoice instance {#step-1-enter-nethvoice}
Log in to the desired NethVoice node with the following command, replacing `X` with the instance number:

```bash
runagent -m nethvoiceX
```

You are now positioned on the cluster host where the containers run.

## Step 2: Enter the MariaDB container {#step-2-enter-mariadb}
Launch an interactive shell inside the MariaDB container:

```bash
podman exec -it mariadb bash
```

This gives you direct access to the database that holds the phonebook table.

## Step 3: Export the phonebook as CSV {#step-3-export-phonebook}
Run the following command inside the MariaDB container. It writes the `cti_phonebook` table as `/tmp/rubrica.csv`:

```bash
mysql -u root -p"$MARIADB_ROOT_PASSWORD" nethcti3 -e "SELECT * FROM cti_phonebook INTO OUTFILE '/tmp/rubrica.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';"
```

The file is generated in MariaDB’s `/tmp` directory.

## Step 4: Copy the CSV to the host {#step-4-copy-csv}
Exit the MariaDB shell and container, then copy the file to the host’s `/tmp` folder:

```bash
exit
podman cp mariadb:/tmp/rubrica.csv /tmp/rubrica.csv
```

These commands bring the exported data outside the container for post-processing.

## Step 5: Clean NULL entries {#step-5-clean-null}
Replace database `NULL` markers (`\N`) with empty strings so the CSV is ready for consumption:

```bash
sed -i 's/\\N/""/g' /tmp/rubrica.csv
```

The `sed` expression safely handles the literal sequence inserted by MySQL.

## Step 6: Move the file to `/root` {#step-6-move-root}
To make the file easy to download, move it into `/root`:

```bash
mv /tmp/rubrica.csv /root/
```

Now the CSV is visible to tools like WinSCP when connecting to the node.

## Cleanup {#cleanup}
After transferring the CSV off the server, delete the temporary copy:

```bash
rm -f /root/rubrica.csv
```

This keeps the system tidy and protects sensitive data.

## See also {#see-also}

To load a CSV file *into* a CTI user address book, use the `CSV (CTI phonebook)` source type described in [Phonebook sources](../administrator-manual/configuration/applications/phonebook_sources.md#phonebook-source).
