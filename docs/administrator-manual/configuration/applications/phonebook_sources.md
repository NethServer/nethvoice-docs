---
title: Phonebook sources
sidebar_position: 2
---

# Phonebook sources

# Phonebook sources

The NethVoice phonebook is a centralized directory that stores and manages contact information for users and organizations. It enables seamless name and number resolution for incoming and outgoing calls, ensuring that caller details are consistently available across NethVoice CTI and NethVoice App. The phonebook can aggregate contacts from various sources, including external databases and CSV files, providing a unified and easily accessible address book for all users.

#### How phonebook sources interact with CTI permissions {#how-phonebook-sources-interact-with-cti-permissions}

Contacts imported from Address Book Sources are added to the centralized phonebook and are available for search and name resolution in NethVoice CTI and NethVoice App.

- Users with address book access can search and view these imported contacts.
- Imported contacts remain read-only in NethVoice CTI, even when the user has the maximum phonebook permission level.
- Create, edit, delete, and sharing actions in NethVoice CTI apply only to CTI contacts created by users.
- Phonebook permission levels configured in user profiles control what users can do with CTI contacts, not with records imported from external sources. For profile-level details, see [Address Book permissions](../wizard.md#address-book).
- Group sharing applies only to CTI contacts and is available only with `Manage private and shared contacts`. The selectable groups come from the user's Presence Panel group permissions and group membership; if the Presence Panel `all_groups` permission is enabled, all operator groups are available.

#### Adding External Address Books {#adding-external-address-books}

From the menu `Applications -> Address Book Sources`, you can define an external source for the contacts NethVoice should use to resolve incoming and outgoing calls.
These contacts will be added to the NethVoice address book and made available for use in NethVoice CTI and NethVoice App.

To configure a new source, three steps are required:

- **Source**: Configure access to the source database of contacts.
- **Mapping**: Associate fields from the source database with those of the NethVoice address book.
- **Settings**: Choose the synchronization interval.

#### Phonebook Source {#phonebook-source}

A unique `Phonebook Name` must be assigned to the source to distinguish the origin of the contacts imported into the NethVoice phonebook.

Based on the `Source Type`, additional attributes need to be specified:

**MySQL**

Database name, server address/port, username, and password for the source database are required.

Additionally, in the Select query text area, the SQL query used to retrieve data to be imported into the centralized address book must be inserted. If present in the text area, replace the word `[table]` with the name of the source table.

**CSV**

In the `URL` field, you can specify the web address of a file in CSV format (Comma-Separated Values, values separated by commas and double quotes "" as text qualifiers, mandatory if the field contains a comma or space). Addresses starting with `http://` and `https://` are accepted.

Alternatively, you can upload a CSV file via the button to the right of the same text field. In this case, the `URL` field will be automatically populated.

The CSV file must be encoded in UTF-8 and contain column names on the first row.

The `Verify` button allows you to preview the data retrieved from the source.

#### Custom Name Resolution {#custom-name-resolution}

If you wish to use a source other than the centralized address book to resolve names, you can create a custom resolution script and place it in the *~/.local/share/containers/storage/volumes/lookup.d/\_data/* directory.

In the [Github repository](https://github.com/nethesis/ns8-nethvoice/tree/main/freepbx/usr/src/nethvoice/samples), there are two example scripts: *lookup_dummy.php* and *lookup_vte.php*, which can serve as a starting point for creating your own custom script.

The *lookup_dummy.php* script returns a fake result for any number dialed or incoming call, while the lookup_vte.php script utilizes an external API.

| Field           | Description             |
|-----------------|------------------------|
| owner_id        | Owner of the contact   |
| type            | Source of origin       |
| homeemail       | Home email address     |
| workemail       | Work email address     |
| homephone       | Home phone number      |
| workphone       | Work phone number      |
| cellphone       | Cell phone number      |
| fax             | Fax number             |
| title           | Job title              |
| company         | Company                |
| notes           | Notes                  |
| name            | First and last name    |
| homestreet      | Home address           |
| homepob         | Home PO Box            |
| homecity        | Home city              |
| homeprovince    | Home province          |
| homepostalcode  | Home postal code       |
| homecountry     | Home country/region    |
| workstreet      | Work address           |
| workpob         | Work PO Box            |
| workcity        | Work city              |
| workprovince    | Work province          |
| workpostalcode  | Work postal code       |
| workcountry     | Work country/region    |
| url             | Website address        |

#### Settings {#settings}

You can choose the synchronization interval for contacts between:

- 15 minutes
- 30 minutes
- 1 hour
- 6 hours
- 24 hours

Once the source is created, you can:

- Immediately synchronize using the `Sync` button
- Enable/disable synchronization

