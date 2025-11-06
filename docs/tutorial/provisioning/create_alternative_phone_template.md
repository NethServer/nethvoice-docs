---
title: "Custom phone template"
sidebar_position: 2
---

If you have phones that need to be configured with default parameters different from the standard chosen by provisioning, and these parameters are not exposed by the Tancredi interface in the NethVoice Wizard, you can create an alternative template that will be selectable from the interface.

At the end of this guide, you will be able to choose, for the model you are interested in, both a standard template and a custom template with personalized parameters not present in the interface.

To install vim, run the following command:

```bash
dnf -y install vim
```

For this example, we will perform this operation on a NethPhone X3 phone.

## Accessing the Tancredi Container {#accessing-the-tancredi-container}

Before proceeding, you need to access the Tancredi container with the following command:

```bash
runagent -m nethvoiceX podman exec -it tancredi bash
```

Replace `nethvoiceX` with the desired NethVoice instance (`nethvoice1`, `nethvoice2`, etc.).

## Creating and Modifying the Template {#creating-and-modifying-the-template}

1. Create a custom template with the following command:

```bash
cp /usr/share/tancredi/data/templates/nethesis.tmpl /var/lib/tancredi/data/templates-custom/nethesis_custom.tmpl
```

2. Modify the custom template with a text editor, changing the parameters of interest for your configuration. First, install vim in the container:

```bash
apt-get install vim
vim /var/lib/tancredi/data/templates-custom/nethesis_custom.tmpl
```

3. Create a new model from **Devices → Models** by duplicating the original NethPhone X3 and renaming it (for example, NethPhone X3 Custom).

4. Modify the scope of the created model to point to the custom template:

```bash
vim /var/lib/tancredi/data/scopes/nethesis-NPX3-custom.ini
```

Modify the following parameter:

```ini
tmpl_phone = "nethesis_custom.tmpl"
```

At this point, when you select the NethPhone X3 Custom model from the provisioning wizard, the modified template will be automatically used.
