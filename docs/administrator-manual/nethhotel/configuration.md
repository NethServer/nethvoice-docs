---
title: NethHotel Configuration & Management
sidebar_position: 1
---

# NethHotel

NethHotel is a specialized module of NethVoice designed for the management of extensions properly configured as hotel rooms. It provides comprehensive features for managing guest communications, billing, and property management system integration.

By default, access to NethHotel is granted to the admin user.

## Configuration {#configuration}

### Enabling NethHotel {#enabling-nethhotel}

NethHotel can be enabled within the NethVoice instance configuration:

1. Access the NethVoice applications inside NethServer
2. Go to the **Settings** page
3. Check the **Enable Hotel module** option
4. (Optional) Specify the address and port of the FIAS server if using PMS integration
5. Save the changes

### PBX Configuration {#pbx-configuration}

After enabling the NethHotel module, some configurations are required on the NethVoice side:

1. **Create Outbound Routes**
   - In the advanced interface of NethVoice, go to **Connectivity > Outbound Routes**
   - Create a dedicated outbound route for hotel rooms
   - Use a prefix (typically `0`) and place it at the end of the route list
   - Click **Save** and **Apply Configuration**

2. **Configure Hotel Profile**
   - From the NethVoice wizard page, access the Hotel profile
   - Enable the newly created outbound route

3. **Create Room Users**
   - Every room used in NethHotel must first exist as a user in the user domain (Active Directory or LDAP) configured on NethServer 8 — see [User Domain](../install/nethvoice_install#user-domains)
   - Recommended naming: username `room301`, display name `Room 301`
   - Set a strong, random password
   - If the user domain supports it, enable **password never expires** to avoid account lockouts

4. **Add Room Extensions**
   - Open the [Extensions](../configuration/wizard#extensions) page in NethVoice
   - The page lists every user created in the user domain, including the rooms just created
   - Enter the extension number for each room (e.g. `room301` → extension `301`)

5. **Assign Hotel Profile**
   - **Single user**: go to [Configurations > Users](../configuration/wizard#users), select the room (e.g. `room301`), and set the **Profile** field to `Hotel`
   - **In bulk**: go to [Applications > Bulk Extensions](../configuration/applications/bulk_actions#bulk-extensions-users), select all the room extensions just created, open the lock on the **Profile** field, and assign `Hotel` to all of them at once
   - Only extensions with the Hotel profile are visible inside NethHotel

### Accessing NethHotel {#accessing-nethhotel}

The NethHotel application is accessible at:
```
https://<nethvoice_domain>/freepbx/hotel/rooms.php
```

It can also be accessed from the NethVoice administrator wizard: **Administration** → **Advanced (freepbx)** → **Applications** → **Hotel**

## How to Configure the PBX {#how-to-configure-the-pbx}

We recommend the following configuration:

### Room Extensions {#room-extensions}

- All room extensions must belong to a user created in the user domain, with an extension assigned and the Hotel profile applied — see [Create Room Users](#pbx-configuration) above for the full procedure

### Service Extensions {#service-extensions}

- Service extensions (such as reception) should **not** be added to the hotel profile
- Configure them as standard extensions following your hotel's numbering policy
- Example: If room extensions range from 201 to 299, set reception as 200 or 300
- Allow rooms to call reception by configuring a speed dial number (see [Speed Dial Numbers](#speed-dial-numbers))
- Service extensions can call each other directly

### Outbound Routes {#outbound-routes}

- Use a separate Outbound Route **without** a prefix for service extensions
- This should be different from the route used for room extensions

## Phone Feature Codes {#phone-feature-codes}

In the NethVoice PBX management interface, under **Service Codes**, you can find codes to use NethHotel features directly from the phones.

### Example Feature Codes {#example-feature-codes}

Add an extra charge to a room:
```
*33 + Room Extension + # + Extra ID + # + Quantity
```

**Example:** `*33201#99#3` charges three units of the extra code 99 to room 201

Set an alarm (guest call):

`977`

## Room Management {#room-management}

### Room Status Display {#room-status-display}

On the main page, all configured extensions are displayed in tabs based on the numeric value of the *callgroup* field (configured in NethVoice).

The room status is indicated by color:

| Color  | Status      | Meaning                                   |
| ------ | ----------- | ----------------------------------------- |
| Green  | Available   | The room is empty and ready for check-in  |
| Red    | Occupied    | The guest has checked in                 |
| Yellow | Cleaning    | The room needs cleaning                  |

### Accessing Room Functions {#accessing-room-functions}

All available functions are presented directly in the room panel. It is also possible to use the context menu by right-clicking on the room.

## Wake-Up Call {#wake-up-call}

The wake-up call feature can be scheduled as a single event or repeated over multiple days.

### For Guests {#for-guests}

Guests can set the wake-up call for their room by dialing:

`977`

### From the NethHotel Interface {#from-nethhotel-interface}

Administrators can schedule wake-up calls for rooms through the NethHotel web interface.

## Groups {#groups}

It is possible to group multiple rooms into a single group to perform multiple operations:

- **Check-in/Check-out**: perform these actions on all rooms in the group
- **Wake-Up Calls**: schedule wake-up calls for all rooms in a group
- **Call Policies**: define call rules for group members:
  - Enable calls between rooms
  - Enable calls among all rooms in the group
  - Allow external calls

## Billing and Reporting {#billing-and-reporting}

### Add an Extra {#add-an-extra}

To add a charge to a room:

1. Open the room panel
2. Click on the icon of the corresponding extra
3. The charge will be added to the room's bill

### Generate Reports {#generate-reports}

To generate the report of the bills for currently occupied rooms:

1. Click on the report icon
2. The report includes:
   - A detailed list of all calls made from the room
   - All extras/charges applied to the room
   - Real-time updated total

## Rates {#rates}

NethHotel includes a predefined set of phone rates based on the type of call (mobile, local, long-distance, etc.).

### Managing Rates {#managing-rates}

- Modify existing rates according to your pricing policy
- Create new custom rates
- Enable or disable calls to specific types of numbers (e.g., premium, international)

## Extras {#extras}

Extras are additional charges assignable to rooms for services or items.

### Configuring Extras {#configuring-extras}

Extras can be configured and assigned to rooms:

- **Web Interface**: use NethHotel to add charges to rooms
- **Directly from the Phone**: guests or staff can dial function codes (e.g., `*33`)

### Example {#example}

Charge three units of the extra code 99 to room 201:

`*33201#99#3`

## Options {#options}

The General Options section allows you to configure policies valid for the entire hotel:

- **External Call Prefix**: set the prefix for making external calls
- **Internal Numbering Format**: define how extensions should be formatted
- **Calls Between Rooms**: enable/disable calls between rooms
- **Calls Between Rooms in the Same Group**
- **External Calls**: enable/disable external calls from rooms
- **Calls from Rooms Without Check-in**
- **Missed Wake-Up Call Notification Extension**
- **Room Cleaning Status Function**
- **Room Cleaning Status Code**
- **Language**: default language for reception messages (fallback)

## Speed Dial Numbers {#speed-dial-numbers}

The Speed Dial section allows you to define quick numbers for easily calling predefined destinations.

### Basic Speed Dial {#basic-speed-dial}

- Define shortcuts to quickly call extensions
- **Example**: Dial `9` to call the reception

### Conditional Speed Dial with Time Group {#conditional-speed-dial-with-time-groups}

It is possible to associate a speed dial with time groups configured in the NethVoice PBX:

- **Destination**: where the call goes if the time condition is met
- **Otherwise**: where the call goes if the condition is NOT met

Allows different routing between working hours and nighttime (e.g., reception during the day, voicemail at night).

## Call History {#call-history}

View all calls made from the rooms through the History section.

### Filtering Options {#filtering-options}

- Filter by date range
- Filter by room number
- Search by called number

### Use Cases {#use-cases}

- Verify calls for billing
- Investigate unusual patterns
- Generate reports for accounting

## FIAS Integration {#fias-integration}

NethHotel can be connected to a PMS (Property Management System) for automated operations.  
See [FIAS Integration](./fias_integration) for full details.
