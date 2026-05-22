---
title: Supported Phones
sidebar_position: 3
---

# Supported Phones

We support the following phones using automatic provisioning. 
However, all standard SIP phones should work with NethVoice. 
For phones not listed as supported, it is possible to create custom provisioning templates using Tancredi.

## NethPhone {#nethphone}

**FIRMWARE Version 2.0 or higher**

- NP-X3
- NP-V61
- NP-X5
- NP-X210

## Fanvil {#fanvil}

**FIRMWARE Version 2.0 or higher**

- V61, V62, V63, V64, V65, V67
- X1/S/SP
- X210
- X3/S/SP/G/SG, X3U, X3U Pro
- X4/G/SG, X4U, X4U-V2
- X5S, X5U, X5U-V2
- X6, X6U, X6U-V2
- X7A/C
- X301/P/G/W, X303/P/G/W
- H2U, H2U-V2, H5
- W610W, W611W, W620W

## Yealink {#yealink}

**FIRMWARE Version 0.86 or higher**

- T19(P) E2, T21(P) E2, T23P/G, T27G, T29G
- T30/P, T31/P/G/W, T33P/G, T34W
- T40P/G, T41P/S/U, T42G/S/U, T43U, T44U/W, T46G/S/U, T48G/S/U, T49G
- T52S, T53/W/C, T54S/W, T56A, T57W, T58V/A/W, VP59
- T73U/W, T74U/W, T77U
- T85W, T87W, T88W
- AX83H, AX86R

## Snom {#snom}

**FIRMWARE Version 8.7.5 or higher**

- D120, D140, D150
- D305, D315, D345, D375, D385
- D710, D712, D713, D715, D717, D725, D735, D745, D765, D785
- D812, D815, D862, D865

:::note
The Snom D862 and D865 phones do not support HTTP commands, so it is not possible to use click-to-call.
:::

## Gigaset {#gigaset}

**FIRMWARE Version 10.1.0 or higher**

- P710 IP PRO, P810-P810B IP PRO, P820-P825 IP PRO, P850W-P855BW IP PRO



## Provisioning compatibility {#provisioning-compatibility}

The following table summarizes the provisioning methods used by each manufacturer at the phone's first boot.

| Manufacturer | Primary method | Secondary method | DHCP option   | DHCP option value                                 |
|--------------|---------------|-----------------|--------------|--------------------------------------------------|
| NethPhone    | RPS           | DHCP            | 66           | `http://IP_PHONE_SYSTEM/provisioning/$mac.cfg`   |
| Fanvil       | RPS           | DHCP            | 66           | `http://IP_PHONE_SYSTEM/provisioning/$mac.cfg`   |
| Yealink      | RPS           | DHCP            | 66           | `http://IP_PHONE_SYSTEM/provisioning/$MAC.cfg`   |
| Snom         | RPS           | DHCP            | 66 and 67    | `http://IP_PHONE_SYSTEM/provisioning/{mac}.xml`  |
| Gigaset      | DHCP[^f1]     | RPS             | 114          | `http://IP_PHONE_SYSTEM/provisioning/%MACD.xml`  |

[^f1]: For Gigaset phones, make sure that the network DHCP server does not provide OPTION 66.


For a complete list of provisioning parameters, see [Provisioning Parameters](provisioning_parameters).