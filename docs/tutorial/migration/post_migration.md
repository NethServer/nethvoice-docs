---
title: Post-Migration Steps
sidebar_position: 3
---

# Post-Migration Steps

After completing the NethVoice migration from NethServer 7 to NethServer 8, verify that everything works correctly before decommissioning the old system.

## System Verification {#system-verification}

### Check Service Status {#check-service-status}

1. **Access NS8 Interface**
   - Navigate to `https://<ns8-server>/cluster-admin/`
   - Go to **Applications** and verify NethVoice shows **Running** status

2. **Test Web Interfaces**
   - Administration: `https://<nethvoice-fqdn>` (login with admin credentials)
   - NethVoice CTI: `https://<cti-fqdn>` (test with user account)
   - Verify SSL certificates are valid

3. **Check Database**
   - From NethVoice admin, go to **Advanced (FreePBX)** → **Reports** → **CDR Reports**
   - Verify historical call records are present

## Users and Extensions {#users-and-extensions}

### Account Provider {#account-provider}

1. **Verify Users**
   - NS8 interface → **Domains and users**
   - Check your domain is active
   - Verify all users and groups are present
   - Test user authentication via CTI login

2. **Check Extensions**
   - FreePBX → **Applications** → **Extensions**
   - Count and compare with NS7
   - Verify extension-to-user mappings
   - Test voicemail access

3. **Phone Registration**
   - Update DHCP option 66 if needed for new provisioning server
   - Reboot phones and check registration
   - If the NethVoice hostname changed, reset phones to factory defaults. They will automatically retrieve the new configuration from the server

## Telephony Testing {#telephony-testing}

### Core Features {#core-features}

Test the following systematically:

- **Internal calls**: Between extensions, verify quality and caller ID
- **External calls**: Inbound/outbound, test various number patterns
- **Voicemail**: Deposit, retrieval, email notifications
- **Call forwarding**: Immediate, busy, no-answer
- **Call transfers**: Blind and attended
- **Conference calls**: Multiple participants
- **IVR menus**: Navigation and audio prompts
- **Call queues**: Agent login/logout, hold music

:::tip Quick Test
Create a checklist for your specific features and test each one systematically.
:::

## Data Verification {#data-verification}

Verify migrated data is accessible:

- **Call recordings**: Check FreePBX → **Admin** → **System Recordings**, test playback
- **Custom audio files**: IVR prompts, announcements, music on hold
- **CDR data**: Historical reports from before migration
- **Extensions configuration**: Device associations, codec settings

## Network Configuration {#network-configuration}

### DNS and Certificates {#dns-and-certificates}

1. **Verify DNS Records**
   ```bash
   nslookup nethvoice.example.com
   nslookup cti.example.com
   ```
   - Each FQDN should resolve to NS8 IP
   - Test from internal and external networks

2. **Check SSL Certificates**
   ```bash
   openssl s_client -connect nethvoice.example.com:443
   ```
   - Verify certificates are valid
   - No browser warnings when accessing interfaces

## Account Provider Finalization {#account-provider-finalization}

### For Samba Active Directory {#for-samba-active-directory}

- Verify all users and groups present
- Test authentication
- Transfer NS7 DC IP to NS8 if required by Windows clients
- Update DHCP DNS settings or configure external DNS forwarding

See: [Samba DC Migration Documentation](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#samba-dc)

### For OpenLDAP {#for-openldap}

⚠️ **Important**: Password policies were NOT migrated automatically

1. NS8 Interface → **Domains and users** → OpenLDAP domain → **Settings**
2. Configure password strength and expiration policies
3. Test with new password changes

## NS7 Cleanup {#ns7-cleanup}

### Monitor and Redirect {#monitor-and-redirect}

1. **Check Redirect Pages**
   - Access old NethVoice URL on NS7
   - Should show HTML redirect to new NS8 URLs

2. **Monitor Lingering Connections**
   ```bash
   # On NS7, check for registered phones
   asterisk -rx "pjsip show endpoints"
   ```
   - Notify users to update configurations
   - Update DHCP/provisioning settings

3. **Plan Decommission**
   - Grace period: 1-4 weeks
   - Create final backup
   - Archive for compliance
   - Document decommission date

:::info Rollback Window
Keep NS7 offline but preserved for 30-90 days for emergency rollback if needed.
:::


## Troubleshooting {#troubleshooting}

### Common Issues {#common-issues}

**Phones Not Registering**
- Update provisioning server address to NS8
- Verify network connectivity
- Check SIP credentials
- Review firewall rules (5060, 5061, RTP 10000-20000)

**External Calls Not Working**
- Verify trunk configuration migrated
- Test trunk registration
- Check public IP and NAT settings

**Call Recordings Missing**
- Check storage path and permissions
- Review migration logs for rsync errors
- Verify file counts match

**Users Can't Login to CTI**
- Verify account provider connection
- Check user credentials
- Test LDAP/AD connectivity

**DNS Resolution Issues**
```bash
nslookup nethvoice.example.com
dig cti.example.com +short
```
- Wait 24-48 hours for DNS propagation
- Use alternate DNS (8.8.8.8) for testing

## Final Checklist {#final-checklist}

Before considering migration complete:

- [ ] NethVoice services running on NS8
- [ ] All interfaces accessible via correct FQDNs
- [ ] Users and extensions verified
- [ ] Internal and external calls working
- [ ] Call recordings and CDR data accessible
- [ ] DNS records updated and propagated
- [ ] SSL certificates valid
- [ ] No phones registered to NS7
- [ ] Account provider finalized

## Next Steps {#next-steps}

1. **Establish Backup Schedule**
   - Configure automated backups for NS8
   - Test restoration procedures

2. **Schedule NS7 Decommission**
   - Set date (30-90 days out)
   - Verify no dependencies
   - Archive final backup

## Congratulations! {#congratulations}

You have successfully completed the NethVoice migration to NethServer 8. Your system is now running on the modern NS8 platform with improved performance and security.

:::tip Need Help?
For assistance, consult the [NethServer community forums](https://community.nethserver.org/) or contact Nethesis professional support services.
:::
