# Zucchetti Infinity

The integration between NethVoice and [Zucchetti Infinity](https://www.zucchetti.it/website/cms/infinity-zucchetti/1059-infinity-zucchetti.html) brings the NethVoice CTI features directly into the Zucchetti portal.

Additionally, by leveraging the **Zucchetti Infinity APIs**, it is possible to populate the NethVoice phonebook with Zucchetti contacts and enable real-time caller identification for both incoming and outgoing calls.

Zucchetti requires each NethVoice CTI user to generate an authorization token from *Settings → Integrations*.

With this integration, Zucchetti Infinity manages the *Phone Island* (the web-based softphone) and provides other typical NethVoice CTI features such as *presence*, *queues*, and more.

## Configuration Steps

### 1. Configure the integration token in Zucchetti Infinity

Generate and configure the integration token for NethVoice CTI in Zucchetti Infinity.

---

### 2. Configure the phonebook synchronization script

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

