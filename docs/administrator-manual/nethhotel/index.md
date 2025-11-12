```
---
title: NethHotel
sidebar_position: 12
---

# NethHotel Module

NethHotel is a specialized module of NethVoice designed for the management of extensions properly configured as hotel rooms. It provides comprehensive features for managing guest communications, billing, and property management system integration.

## Overview {#overview}

NethHotel enables hotel operators to:

- **Manage Guest Communications**: Check-in/check-out, wake-up calls, inter-room calling policies
- **Automate Billing**: Track calls, apply rates, manage extras and minibar charges
- **Integrate with PMS**: Connect to Oracle Hospitality OPERA via FIAS protocol for seamless guest management
- **Control Rooms**: Manage room status, groups, and service policies
- **Generate Reports**: Track call history, billing, and guest usage

## Key Features {#key-features}

- ✅ **Room Check-in/Check-out** - Manage guest room activation and deactivation
- ✅ **Wake-up Calls** - Single and group wake-up call scheduling for guests
- ✅ **Call Reporting** - Detailed call history and billing reports
- ✅ **Customizable Rates** - Define rates for different call types
- ✅ **Speed Dial** - Quick access to reception and service extensions
- ✅ **Room Groups** - Bulk operations and call policy management
- ✅ **PMS Integration** - Connect to Oracle OPERA via FIAS protocol
- ✅ **Extras Management** - Track and bill minibar and other charges
- ✅ **Room Management** - Visual status display and room operations
- ✅ **Voicemail Management** - Ability to leave a voicemail message in case of no answer

## Quick Links {#quick-links}

### [NethHotel Configuration & Management](nethhotel) {#nethhotel-configuration--management}

Complete guide for setting up and managing the NethHotel module:
- Enable NethHotel in NethVoice configuration
- Configure PBX settings and outbound routes
- Manage room extensions and service extensions
- Room management and status tracking
- Wake-up calls (guest and administrator setup)
- Groups and bulk operations
- Billing and reporting
- Phone feature codes
- Request the reboot of NethVoice

### [FIAS Integration](fias_integration.md) {#fias-integration}

Property Management System (PMS) integration via FIAS protocol:
- Oracle Hospitality OPERA certification
- Supported FIAS protocol versions
- Automated check-in/check-out from PMS
- Wake-up call management via PMS
- Automatic billing and call tracking
- Minibar and extras billing
- Guest language configuration
- Integration benefits and workflow

## Getting Started {#getting-started}

1. **Enable NethHotel** - Check the Enable Hotel module option in NethVoice settings
2. **Configure PBX** - Create outbound routes and hotel profiles in NethVoice
3. **Add Room Extensions** - Assign room extensions to the hotel profile
4. **Manage Rooms** - Access the NethHotel interface to manage guests and billing
5. **(Optional) Integrate PMS** - Connect Oracle OPERA for automated guest management

## Access NethHotel {#access-nethhotel}

The NethHotel application is accessible at:
```
https://<nethvoice_domain>/freepbx/hotel/rooms.php
```

Or from NethVoice administrator wizard:
**Administration** → **Advanced (freepbx)** → **Applications** → **NethHotel**

## Learn More {#learn-more}

- See the [NethHotel Configuration & Management](nethhotel) guide for comprehensive setup and operation details
- Review [FIAS Integration](fias_integration.md) for PMS connection and automation
- Check [NethVoice main documentation](../index.md) for general NethVoice features

## Feedback {#feedback}

If any malfunctions are encountered, please send us a report at [test@example.it](mailto:test@example.it).
```