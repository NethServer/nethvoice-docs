---
title: Getting started
sidebar_position: 1
---

# Guida introduttiva a NethVoice

NethVoice è una piattaforma di telefonia e comunicazione unificata che offre funzionalità PBX per piccole e medie imprese.  
Fornisce instradamento delle chiamate, segreteria telefonica, conferenze e gestione utenti tramite un'interfaccia web intuitiva.  
Progettata per funzionare su [NethServer](https://www.nethserver.org/), NethVoice supporta installazioni scalabili e accesso remoto sicuro tramite il Proxy NethVoice.

Questa guida ti accompagnerà nei passaggi fondamentali per configurare NethVoice sul tuo sistema.

## 1. Installare NethServer 8 {#install-nethserver-8}

Inizia installando NethServer 8 sul tuo server.  
- Scarica e segui le istruzioni di installazione dalla [guida ufficiale](https://docs.nethserver.org/projects/ns8/it/latest/install.html).  
- Dopo l'installazione, accedi all'interfaccia web su `https://<server_ip_o_fqdn>/cluster-admin/` utilizzando:  
  - **Username:** `admin`  
  - **Password:** `Nethesis,1234`  
- Crea un cluster e assicurati che il server abbia un IP statico e un FQDN valido.

## 2. Installa il modulo NethVoice {#install-nethvoice-module}

Una volta configurato il proxy, è possibile installare il modulo NethVoice:  
- Aprire il **Software Center** dall'interfaccia web.  
- Cercare l'applicazione NethVoice e fare clic su **Install**.  
- Per maggiori informazioni, consultare la [documentazione del Software Center](https://docs.nethserver.org/projects/ns8/en/latest/software_center.html).

## 3. Configura NethVoice {#configure-nethvoice}

Dopo l'installazione, configurare l'istanza NethVoice:  
- Seguire il [wizard di configurazione iniziale](https://docs.nethvoice.com/docs/administrator-manual/install/nethvoice_install#setup-wizard)  
- Seguire la [guida alla configurazione di NethVoice](https://docs.nethvoice.com/docs/administrator-manual/install/nethvoice_install#module-configuration) per istruzioni dettagliate sulla configurazione.  
- Completare la configurazione iniziale, aggiungere utenti e configurare l'ambiente di telefonia secondo necessità.

---

Per ogni passaggio, consulta la documentazione collegata per istruzioni dettagliate e complete.

## Tutorial correlati {#tutorial-correlati}

* [Scenari tipici di installazione](./cloud_vs_onpremise.md)
* [Esportare la rubrica come CSV da NethVoice](./export-phonebook-csv.md)
* [Eliminare i vecchi messaggi della casella vocale](./voicemail-prune.md)
* [Eliminare le vecchie registrazioni di chiamate](./recording-prune.md)
* [Integrazione con vtenext CRM](https://docs.nethvoice.com/docs/tutorial/vtenext-integration)