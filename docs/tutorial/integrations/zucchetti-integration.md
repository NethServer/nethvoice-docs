# Zucchetti Infinity

The integration between NethVoice and [Zucchetti Infinity](https://www.zucchetti.it/website/cms/infinity-zucchetti/1059-infinity-zucchetti.html) brings the NethVoice CTI features directly into the Zucchetti portal.

Additionally, by leveraging the **Zucchetti Infinity APIs**, it is possible to populate the NethVoice phonebook with Zucchetti contacts and enable real-time caller identification for both incoming and outgoing calls.

Zucchetti requires each NethVoice CTI user to generate an authorization token from *Settings → Integrations*.

With this integration, Zucchetti Infinity manages the *Phone Island* (the web-based softphone) and provides other typical NethVoice CTI features such as *presence*, *queues*, and more.

## Configuration Steps

### 1. Configure the integration token in Zucchetti Infinity

Generate and configure the integration token for NethVoice CTI in Zucchetti Infinity.

---

### 2. Configure the phonebook synchronization {#configure-phonebook-synchronization}

The recommended way is to add an **Infinity Zucchetti** address book source from the NethVoice administration interface, without touching the server via SSH.

1. Go to `Applications -> Address Book Sources` and add a new source.
2. Select `Infinity Zucchetti` as **Source type**.
3. Fill in the **Phonebook name** and the `URL`, `Username` and `Password` of the Infinity APIs provided by Zucchetti.
4. In **Settings**, choose who can see the imported contacts (**Public** or a list of **Groups**) and the synchronization interval.

The field mapping is fixed and applied by the importer, so the **Mapping** step is read-only. See [Phonebook sources](/docs/administrator-manual/configuration/applications/phonebook_sources#phonebook-source) for the mapping table and the sharing options.

#### Alternative: configure the synchronization script manually {#configure-synchronization-script}

Use this procedure only if the source cannot be configured from the administration interface.

1. Access the server via *SSH*.
2. Run the following commands, replacing *X* with the instance number of the NethVoice system to be configured:

```bash
runagent -m nethvoiceX podman exec -it freepbx cp -a /usr/share/phonebooks/samples/zucchetti_infinity_api.py /usr/share/phonebooks/scripts/
```

```bash
runagent -m nethvoiceX podman exec -it freepbx vim /usr/share/phonebooks/scripts/zucchetti_infinity_api.py
```

Modify the following parameters:

```python
# Set the URL for the API
url = 'https://CHANGE_ME/infinity'
username = 'CHANGE_ME'
password = 'CHANGE_ME'
```

Replace them with the *FQDN* and API credentials provided by Zucchetti.

Save the file and exit Vim by typing:

```text
:wq
```

and pressing *Enter*.

---

### 3. Enable real-time caller lookup (optional)

Enable real-time caller lookup if the Zucchetti Infinity phonebook is updated significantly more frequently than the scheduled NethVoice phonebook synchronization.

1. Access the server via *SSH*.
2. Run the following command, replacing *X* with the instance number of the NethVoice system to be configured:

```bash
runagent -m nethvoiceX podman exec -it freepbx cp -a /usr/src/nethvoice/samples/lookup_infinity.py /usr/src/nethvoice/lookup.d/
```

```bash
runagent -m nethvoiceX podman exec -it freepbx vim /usr/src/nethvoice/scripts/lookup_infinity.py
```

Modify the following parameters:

```python
# Set the URL for the API
url = ''
username = ''
password = ''
```

Replace them with the *FQDN* and API credentials provided by Zucchetti.

Save the file and exit Vim by typing:

```text
:wq
```

and pressing *Enter*.

