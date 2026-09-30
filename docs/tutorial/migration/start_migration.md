---
title: Start Migration
sidebar_position: 2
---

# Start Migration

This guide walks you through the actual NethVoice migration process from NethServer 7 to NethServer 8. The migration involves connecting your NS7 system to the NS8 cluster, synchronizing data, and performing the final cutover.

## Overview {#overview}

The migration process converts your NethServer 7 NethVoice installation into a NethServer 8 application while preserving:

- All call recordings and audio files
- CDR (Call Detail Records) database
- Extension configurations
- Trunk settings
- Route configurations
- User and group settings
- Voicemail data

**Migration Timeline**:
- Initial setup: 15-30 minutes
- Data synchronization: 1-8 hours (depends on data volume)
- Multiple sync cycles: As needed to minimize downtime
- Final cutover: 30 minutes - 2 hours

:::info Automatic NethVoice Proxy Installation
If NethVoice Proxy is not already installed on the destination node, the migration tool will install it automatically. However, you'll need to configure it manually after migration completes.

## Step 1: Install Migration Tool on NS7 {#step-1-install-migration-tool-on-ns7}

The migration starts by installing the migration tool on your NethServer 7 system.

### Installation Steps {#installation-steps}

1. **Access NS7 Cockpit Interface**
   - Open your web browser
   - Navigate to: `https://<ns7-server>:9090`
   - Log in with root or administrative credentials

2. **Navigate to Software Center**
   - Click on **Software Center** in the left sidebar
   - Wait for the application list to load

3. **Install Migration to NS8**
   - In the search box, type: `Migration to NS8`
   - Locate the "Migration to NS8" application
   - Click the **Install** button
   - Wait for the installation to complete (typically 2-5 minutes)

4. **Open Migration Application**
   - After installation, the application appears in the left sidebar
   - Click on **NS8 Migration** to open it
   - The connection page will be displayed

:::tip Installation Verification
After installation, you should see a connection form asking for NS8 cluster details. If you see an error, check the NS7 system logs and ensure all updates are installed.
:::

## Step 2: Connect NS7 to NS8 Cluster {#step-2-connect-ns7-to-ns8-cluster}

This step establishes a secure connection between your NS7 system and the NS8 cluster.

### Connection Parameters {#connection-parameters}

Fill in the connection form with the following information:

#### Required Fields {#required-fields}

| Field | Description | Example |
|-------|-------------|---------|
| **NS8 leader node** | Hostname or IP address of the NS8 cluster leader | `ns8.example.com` or `192.168.1.100` |
| **NS8 admin username** | Administrator username for NS8 | `admin` |
| **NS8 admin password** | Administrator password for NS8 | Your secure password |
| **LDAP user domain** | (Only if using local OpenLDAP) Unique domain name in NS8 | `nethvoice.local` |
| **TLS validation** | Checkbox for certificate validation | Uncheck if no valid TLS cert |

#### Field Details {#field-details}

**NS8 Leader Node**:
- Enter the fully qualified domain name (FQDN) of your NS8 leader
- Alternatively, use the IP address if DNS is not configured
- This should be the same address you use to access the NS8 web interface

**NS8 Admin Credentials**:
- These credentials are only used to create a temporary migration account (`ns7admin1`)
- The temporary account is automatically removed when migration completes
- Your admin password is not stored permanently

**LDAP User Domain** (OpenLDAP only):
- This field appears only if NS7 uses a local OpenLDAP account provider
- Choose a unique name that doesn't conflict with existing NS8 domains
- The NS7 LDAP database will be renamed to this domain during migration
- Example: If your NS7 domain is `example.local`, you might use `nethvoice-example.local`

**TLS Validation**:
- Check this box if your NS8 leader has a valid, trusted TLS certificate
- Uncheck if using self-signed certificates or IP address access
- When unchecked, the connection accepts any certificate

### Connection Process {#connection-process}

1. **Fill in all required fields**
   - Double-check the NS8 leader address
   - Verify admin credentials are correct
   - Choose appropriate domain name if using OpenLDAP

2. **Click the "Connect" button**
   - The system establishes a VPN connection to NS8
   - A temporary admin account (`ns7admin1`) is created
   - NS7 registers as a special node in the NS8 cluster

3. **Wait for connection confirmation**
   - You'll see a success message when connected
   - The application list page will appear
   - NethVoice should be listed among available applications

:::warning Active Subscription Impact
If your NS8 has an active subscription plan, automated system updates will be paused during migration. Updates resume automatically after NS7 is removed from the cluster at migration completion.
:::

### Troubleshooting Connection Issues {#troubleshooting-connection-issues}

**Problem: Cannot connect to NS8 leader**
- Verify the NS8 leader address is correct and reachable
- Check VPN port 55820 is not blocked by firewalls
- Test connectivity: `nc -zv <ns8-leader> 55820` from NS7

**Problem: Authentication failed**
- Verify admin username and password are correct
- Ensure the admin account is active in NS8
- Check for password complexity requirements

**Problem: Domain name conflict**
- Choose a different domain name
- Check existing domains in NS8 under "Domains and users"
- Ensure the name is unique across the entire cluster

For more details on account provider configuration, see the [Account Provider section](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#account-provider) of the official migration guide.

## Step 3: Migrate NethVoice Application {#step-3-migrate-nethvoice-application}

Once connected, you can begin the NethVoice migration process. This involves three phases: starting the migration, synchronizing data, and finishing the migration.

### Phase 1: Start Migration {#phase-1-start-migration}

This phase installs NethVoice on NS8 and performs the initial data synchronization.

#### Steps to Start {#steps-to-start}

1. **Locate NethVoice in Application List**
   - After successful connection, you'll see a list of installed NS7 applications
   - Find **NethVoice** in the list
   - Review its current status and configuration

2. **Click "Start Migration" Button**
   - Click the green **Start migration** button next to NethVoice
   - A dialog will appear with migration options

3. **Select Destination Node** (Multi-node clusters only)
   - If your NS8 cluster has multiple nodes, select the destination node
   - Choose a node with adequate resources
   - Consider network proximity to users

4. **Enter NethVoice-Specific Configuration**

   The system will prompt for two FQDNs:

   | FQDN Purpose | Description | Example |
   |--------------|-------------|---------|
   | **NethVoice base host** | FQDN for administration interface | `nethvoice.example.com` |
   | **NethVoice CTI base host** | FQDN for CTI web application | `cti.example.com` |

   :::warning FQDN Requirements
   - Both FQDNs must be unique and not currently in use
   - You'll need to update DNS records after migration
   - These cannot be easily changed after migration completes
   :::

5. **Confirm and Start**
   - Review your entries carefully
   - Click **Confirm** or **Start**
   - The migration process begins

#### What Happens During Start {#what-happens-during-start}

- NethVoice application is installed on the NS8 node
- If NethVoice Proxy is not installed, it's installed automatically
- Initial data synchronization begins:
  - Call recordings
  - Audio files
  - CDR database
  - Configuration files
  - Voicemail data
- Progress is displayed on screen

:::info Initial Sync Duration
The first synchronization can take several hours depending on your data volume. The system uses Rsync for efficient data transfer.
:::

### Phase 2: Data Synchronization {#phase-2-data-synchronization}

This is the most important phase for minimizing final downtime. Perform multiple sync cycles to keep NS8 data current.

#### Sync Process {#sync-process}

1. **Monitor Initial Sync**
   - Watch the progress indicator
   - Check for any error messages
   - Review the log files if needed

2. **Click "Sync Data" Button**
   - After initial sync completes, the **Sync data** button becomes available
   - Click it to perform incremental synchronization
   - Only changed data is transferred

3. **Repeat Sync Multiple Times**
   - Perform syncs regularly (daily or more frequently)
   - Each sync brings NS8 closer to NS7 current state
   - Final cutover time is reduced significantly

#### What Gets Synchronized {#what-gets-synchronized}

Each sync transfers:
- **New call recordings** since last sync
- **Modified audio files**
- **New CDR entries** in the database
- **Configuration changes**
- **New voicemail messages**

#### Sync Strategy {#sync-strategy}

**Recommended approach**:
```
Day 1: Start migration → Initial sync (longest)
Day 2: Sync data → Incremental sync
Day 3: Sync data → Incremental sync
Day 4: Sync data → Incremental sync
Day 5: Final sync → Finish migration (shortest)
```

:::tip Minimize Final Downtime
The more times you sync, the less data needs to be transferred during final cutover. Aim for at least 3-4 sync cycles before finishing migration.
:::

#### Monitoring Sync Progress {#monitoring-sync-progress}

- **NS7 Migration Interface**: Shows progress and status
- **Log File**: `/var/log/ns8-migration.log` on NS7
  ```bash
  # Monitor live log
  tail -f /var/log/ns8-migration.log
  ```
- **NS8 Application Log**: Check the NethVoice application log in NS8

#### Handling Sync Errors {#handling-sync-errors}

If errors occur during synchronization:

1. **Review Error Messages**
   - Check the migration interface for details
   - Review `/var/log/ns8-migration.log`

2. **Common Issues**:
   - **Network timeout**: Check network connectivity, retry sync
   - **Disk space**: Ensure NS8 has sufficient space
   - **Permission errors**: Verify file permissions on NS7

3. **Abort if Necessary**
   - If critical errors occur, click **Abort migration**
   - This removes the NS8 NethVoice instance
   - You can start over from Phase 1
   - No data on NS7 is affected

:::warning Don't Abort Unless Necessary
Aborting migration removes all synced data from NS8. Only abort if you encounter persistent errors that cannot be resolved.
:::

### Phase 3: Finish Migration {#phase-3-finish-migration}

This is the final cutover phase. Plan this carefully to minimize user impact.

#### Pre-Cutover Checklist {#pre-cutover-checklist}

Before clicking "Finish migration":

- [ ] Performed at least 3-4 data sync cycles
- [ ] Last sync completed successfully without errors
- [ ] Downtime window scheduled and communicated to users
- [ ] DNS records prepared for update
- [ ] Support team on standby
- [ ] Rollback plan documented

#### Finish Migration Steps {#finish-migration-steps}

1. **Schedule Downtime**
   - Choose a low-usage period (evening, weekend)
   - Notify all users in advance
   - Plan for 30 minutes to 2 hours downtime

2. **Perform Final Sync**
   - Click **Sync data** one last time
   - This captures any last-minute changes
   - Wait for completion

3. **Click "Finish Migration" Button**
   - A confirmation dialog will appear
   - Review the warning carefully
   - Click **Confirm** to proceed

4. **Final Operations Execute**
   - Final data synchronization via Rsync
   - Configuration finalization on NS8
   - NethVoice started on NS8
   - NethVoice stopped on NS7

#### What Happens Automatically {#what-happens-automatically}

When you finish migration, the system performs these actions:

| Action | Details |
|--------|---------|
| **NS8 Configuration** | NethVoice is fully configured with migrated data |
| **NS8 Service Start** | NethVoice services start on NS8 |
| **NS7 Service Stop** | NethVoice is stopped and disabled on NS7 |
| **Redirect Page** | NS7 displays HTML redirect to new FQDNs |
| **Account Provider** | Temporary external domain maintains access (if applicable) |
| **Provisioning configuration change** | The phones are assigned the new FQDN (see information below) |


:::info PHONE PROVISIONING
Finalizing the migration sets the NethVoice FQDN on NS8 as the provisioning FQDN for the phones and forces provisioning so that they receive the change (provisioning can only be forced for phones that are online and registered).
To have the phones working with the new NethVoice instance, simply reboot them.
:::

:::info Redirect Page
Users accessing the old NethVoice URLs on NS7 will see a redirect page with links to the new NS8 FQDNs. This helps users find the new location.
:::

#### Post-Finish Tasks {#post-finish-tasks}

After finishing migration:

1. **Verify NS8 Services**
   - Check NethVoice is running on NS8
   - Access the administration interface
   - Access the CTI interface
   - Review logs for errors

2. **Do NOT update DNS yet**
   - Wait to verify everything works
   - See next steps for DNS update procedures

## Step 4: Configure NethVoice Proxy {#step-4-configure-nethvoice-proxy}

If NethVoice Proxy was automatically installed during migration, you must configure it now.

### Check Proxy Status {#check-proxy-status}

1. **Access NS8 Interface**
2. **Navigate to Applications**
3. **Find "NethVoice Proxy"**
4. **Check if it's newly installed** (installed during migration)

### Configuration Required {#configuration-required}

If the proxy was auto-installed, configure:

1. **Proxy FQDN**
   - Set a valid fully qualified domain name
   - Example: `proxy.example.com`

2. **Network Interface**
   - Select the interface for VoIP traffic
   - Typically the main network interface

3. **Public IP Address**
   - Set if different from interface IP
   - Required if behind NAT

4. **SIP/RTP Ports**
   - Verify default ports or customize
   - Ensure ports are open in firewall

For detailed configuration steps, see:
➡️ **[NethVoice Proxy Configuration Guide](/docs/administrator-manual/advanced/nethvoice_proxy)**

:::warning Proxy Configuration is Critical
External calls and phone registrations won't work properly until the proxy is correctly configured. Don't skip this step!
:::

## Step 5: Update DNS Records {#step-5-update-dns-records}

Once you've verified NethVoice is working on NS8, update your DNS records.

### DNS Updates Required {#dns-updates-required}

Update the following DNS records to point to your NS8 node:

| Record Type | Name | Points To | Example |
|-------------|------|-----------|---------|
| **A Record** | NethVoice admin FQDN | NS8 node IP | `nethvoice.example.com` → `192.168.1.100` |
| **A Record** | NethVoice CTI FQDN | NS8 node IP | `cti.example.com` → `192.168.1.100` |
| **A Record** | NethVoice Proxy FQDN | NS8 node IP | `proxy.example.com` → `192.168.1.100` |

### DNS Update Process {#dns-update-process}

1. **Access Your DNS Server**
   - Log in to your DNS management interface
   - Or access your DNS provider's control panel

2. **Update or Create A Records**
   ```
   nethvoice.example.com.  IN  A  192.168.1.100
   cti.example.com.        IN  A  192.168.1.100
   proxy.example.com.      IN  A  192.168.1.100
   ```

3. **Verify DNS Propagation**
   ```bash
   # Check DNS resolution
   nslookup nethvoice.example.com
   nslookup cti.example.com
   nslookup proxy.example.com
   
   # Or use dig
   dig nethvoice.example.com +short
   ```

4. **Wait for Propagation**
   - Internal DNS: Usually immediate
   - Public DNS: Can take 24-48 hours
   - Low TTL helps speed up propagation

:::tip DNS Testing
Test DNS from different locations (internal network, external network, different ISPs) to ensure proper propagation before decommissioning NS7.
:::

### Enable Let's Encrypt Certificate for NethVoice {#enable-lets-encrypt-certificate}

If you want to use a TLS certificate provided by Let's Encrypt for NethVoice:

1. **Open NethVoice application settings**
   - Access the NS8 web interface
   - Go to your **NethVoice** application
   - Open the **Settings** section

2. **Enable Let's Encrypt certificate request**
   - Enable the toggle for **Request Let's Encrypt certificate**
   - Ensure that:
     - The NethVoice FQDNs resolve publicly to the NS8 node
     - TCP port 80 (and, if required, 443) are reachable from the Internet

3. **Confirm and wait for issuance**
   - Save the configuration
   - Wait for the configuration to complete
   - If the configuration change fails, check DNS, firewall and logs, then retry

Use this step only if you need (or prefer) a Let's Encrypt certificate instead of a custom certificate.

## Migration Process Summary {#migration-process-summary}

Here's the complete migration workflow:

```
1. Install Migration Tool on NS7
   ↓
2. Connect NS7 to NS8 Cluster
   - Enter NS8 leader details
   - Provide admin credentials
   - Set domain name (if OpenLDAP)
   ↓
3. Start NethVoice Migration
   - Provide two FQDNs
   - Select destination node
   - Initial sync begins
   ↓
4. Sync Data (Multiple Times)
   - Sync #1 (incremental)
   - Sync #2 (incremental)
   - Sync #3+ (incremental)
   ↓
5. Finish Migration
   - Schedule downtime
   - Final sync
   - Services cutover
   ↓
6. Configure NethVoice Proxy
   - Set FQDN
   - Configure network
   - Set public IP
   ↓
7. Update DNS Records
   - Point FQDNs to NS8
   - Verify propagation
   - Test access
   - Request a Let's Encrypt certificate (optional)
   ↓
8. Verify and Test
   (See Post-Migration Steps)
```

## Monitoring and Logs {#monitoring-and-logs}

During migration, monitor these logs:

### On NethServer 7 {#on-nethserver-7}

**Migration Log**:
```bash
# View migration log
tail -f /var/log/ns8-migration.log

# Search for errors
grep -i error /var/log/ns8-migration.log

# Search for NethVoice entries
grep -i nethvoice /var/log/ns8-migration.log
```

**System Log**:
```bash
# View system messages
tail -f /var/log/messages
```

### On NethServer 8 {#on-nethserver-8}

**Application Log**:
1. Access NS8 web interface
2. Go to **Applications**
3. Click on your NethVoice instance
4. Open **Logs** tab
5. Review `import-module` activity

**Via CLI**:
```bash
# Check application logs
api-cli run module/<nethvoice-instance>/get-logs
```

## Troubleshooting Common Issues {#troubleshooting-common-issues}

### Issue: Migration Tool Won't Install {#issue-migration-tool-wont-install}

**Symptoms**: Installation fails or times out

**Solutions**:
- Ensure NS7 has internet connectivity
- Update NS7 to latest version
- Check Software Center is working
- Review `/var/log/messages` for errors

### Issue: Cannot Connect to NS8 {#issue-cannot-connect-to-ns8}

**Symptoms**: Connection fails with timeout or authentication error

**Solutions**:
- Verify NS8 leader address is correct
- Test VPN port: `nc -zv <ns8-leader> 55820`
- Check admin credentials
- Verify firewall rules
- Ensure NS8 cluster is running

### Issue: NethVoice Not Listed {#issue-nethvoice-not-listed}

**Symptoms**: After connection, NethVoice doesn't appear in application list

**Solutions**:
- Verify NethVoice is installed and running on NS7
- Refresh the migration tool page
- Check migration tool logs
- Reconnect to NS8 cluster

### Issue: Sync Keeps Failing {#issue-sync-keeps-failing}

**Symptoms**: Data synchronization fails repeatedly

**Solutions**:
- Check network stability
- Verify sufficient disk space on NS8
- Review error messages in logs
- Test connectivity between NS7 and NS8
- Check file permissions on NS7

### Issue: Finish Migration Hangs {#issue-finish-migration-hangs}

**Symptoms**: Final migration doesn't complete

**Solutions**:
- Be patient - this can take time for large datasets
- Monitor logs for progress
- Check disk I/O on both systems
- Verify network connection stable
- Contact support if hung for over 2 hours

## Additional Resources {#additional-resources}

For more detailed information:

- **[Full NS8 Migration Guide](https://docs.nethserver.org/projects/ns8/en/latest/migration.html)** - Complete migration procedures
- **[NethVoice Proxy Configuration](/docs/administrator-manual/advanced/nethvoice_proxy)** - Proxy setup guide
- **[Account Provider Migration](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#account-provider)** - Account provider details
- **[Migration Logs Documentation](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#logs)** - Log file locations and meanings

## Next Steps {#next-steps}

After completing the migration and updating DNS:

➡️ **[Post-Migration Steps](./post_migration)** - Verify, test, and finalize your migration

:::tip Need Help?
If you encounter issues during migration, consult the [NethServer community forums](https://community.nethserver.org/) or contact NethVoice support. Don't proceed if you're unsure about any step.
:::

