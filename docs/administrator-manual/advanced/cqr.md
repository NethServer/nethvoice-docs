---
title: Call Query Routing (CQR)
sidebar_position: 5
---

## Overview {#overview}

Call Query Routing (CQR) reverses the concept of traditional IVR by moving the decision of how to handle incoming calls from the caller to NethVoice itself. Instead of relying on caller input through an IVR menu, CQR allows NethVoice to query external or internal databases (MySQL or MSSQL) in real-time to obtain information about the caller and route the call accordingly.

By recognizing the caller through their phone number or a customer code, NethVoice can:
- Query databases for caller-related information
- Make routing decisions based on the query results
- Route calls to different destinations based on customer status

This makes CQR a flexible tool that obtains information in real-time and adapts behavior dynamically. As the database information changes, CQR behavior adjusts automatically.

## Typical Use Cases {#use-cases}

A typical example is using CQR to discriminate whether a caller is a paying customer or not:

- **Paying customers**: Route to support queue
- **Outstanding customers**: Route to administration
- **Potential customers**: Route to sales team

The key requirements for CQR are:
- Accessible databases from NethVoice
- Properly configured queries to interrogate the database

## Configuration {#configuration}

### Prerequisites {#prerequisites}

The database must be reachable from NethVoice, and the database user must have permission to execute the configured queries.

MSSQL support is already included in NethVoice. Configure the connection using the CQR fields described below.

### MSSQL Connection Settings {#mssql-connection-settings}

These settings apply to both the main query and the optional customer code lookup:

- **DB Type**: select `MSSQL`.
- **DB URL**: enter the server hostname or IP address, optionally followed by a colon and the TCP port, for example `sql.example.com:1433`. If the port is omitted, CQR uses `1433`.
- **DB Name**: enter the database name, for example `customers`.
- **Username** and **Password**: enter the database credentials.

Enable TCP/IP on SQL Server and allow connections from NethVoice to the instance's listening port. For SQL Server Express, use the actual TCP port configured for the instance.

:::note SQL Server Express: colon and comma syntax
In some SQL Server Express versions, the server endpoint requires a comma between host and port (`sql.example.com,1433`) instead of a colon (`sql.example.com:1433`).

If your database administrator provides an address such as `sql.example.com,1433`, enter it as `sql.example.com:1433` in **DB URL**. CQR handles the required format automatically.
:::

### Basic Settings {#basic-settings}

| Field | Description |
|-------|-------------|
| **Name** | Name of the CQR used by NethVoice in routing destinations |
| **Description** | Description of the CQR |

### Customer Code Resolution {#customer-code-resolution}

Enable customer code lookup if you want CQR to resolve the customer code from the caller's phone number.

| Field | Description |
|-------|-------------|
| **Use Customer Code** | Enable to activate customer code lookup from caller's phone number |
| **DB Type** | Type of database (MySQL or MSSQL) |
| **DB URL** | Database server address; for MSSQL, see [MSSQL Connection Settings](#mssql-connection-settings) |
| **DB Name** | Database name |
| **Username** | Database user with query permissions |
| **Password** | Database user password |
| **Query** | SQL query to retrieve customer code from caller ID; use `%CID%` placeholder for caller number |
| **Manual Code Entry** | Enable to request manual customer code if query fails |
| **Announcement** | System recording to play when requesting manual code entry |
| **Error Announcement** | System recording to play if manual code entry fails |
| **Code Length** | Expected length of customer code for validation |
| **Max Attempts** | Number of attempts allowed for manual code entry |
| **Validation Query** | Query to validate manually entered code; use `%CODCLI%` placeholder for customer code |

#### Customer Code Query Examples

Retrieve customer code from phone number:
```sql
SELECT `customer_code` FROM `phonebook` WHERE `caller_id` = '%CID%'
```

Validate manually entered customer code:
```sql
SELECT `customer_code` FROM `phonebook` WHERE `customer_code` = '%CODCLI%'
```

### CQR Options {#cqr-options}

| Field | Description |
|-------|-------------|
| **Announcement** | Message played to caller while CQR processes. Duration should match query execution time |
| **DB Type** | Type of database (MySQL or MSSQL) for main query |
| **DB URL** | Database server address for the main query; for MSSQL, see [MSSQL Connection Settings](#mssql-connection-settings) |
| **DB Name** | Database name |
| **Username** | Database user with query permissions |
| **Password** | Database user password |
| **Query** | SQL query for routing decision; use `%CID%` for caller ID or `%CUSTOMERCODE%` if using customer code lookup |
| **Default Destination** | Route for unmatched conditions or database errors |

#### Query Examples

Query by caller ID:
```sql
SELECT `name` FROM `phonebook` WHERE `workphone` = '%CID%'
```

Query by customer code:
```sql
SELECT `name` FROM `phonebook` WHERE `customercode` = '%CUSTOMERCODE%'
```

### Routing Rules {#routing-rules}

Define conditions and their corresponding destinations. Each rule is evaluated in order based on position.

| Field | Description |
|-------|-------------|
| **Position** | Order in which NethVoice evaluates the result |
| **Condition** | Possible query result value (one per line) |
| **Destination** | Route destination if query result matches condition |
| **Delete** | Remove this routing rule |

## How It Works {#how-it-works}

1. **Incoming call**: Caller initiates call to NethVoice
2. **Caller identification**: Extract caller phone number
3. **Customer code lookup** (optional): If enabled, query database to resolve customer code from caller ID
4. **Manual code entry** (if needed): If customer code lookup fails and manual entry is enabled, request code from caller
5. **Main query**: Query database using caller ID or customer code
6. **Route decision**: Evaluate query result against defined conditions
7. **Call routing**: Route call to corresponding destination or default destination if no match

## Best Practices {#best-practices}

- **Database performance**: Ensure database queries are optimized and responsive
- **Announcement duration**: Set announcement duration longer than typical query execution time
- **Query placeholders**: Always use `%CID%` or `%CUSTOMERCODE%` placeholders; never hardcode values
- **Error handling**: Always define a default destination for error scenarios
- **Testing**: Test database connectivity and query accuracy before deploying to production
- **MSSQL connectivity**: Check the server address, TCP port, database name and credentials configured in CQR, and verify that SQL Server accepts connections from NethVoice
