---
title: Troubleshooting
sidebar_position: 4
---

# Troubleshooting

## Audio Issues {#audio-issues}

- Verify that audio devices are properly connected
- Check browser audio permission settings
- Run the audio test in the configuration section
- Verify that no other applications are using the audio devices
- Test with different microphone/speaker combinations
- Update audio drivers to the latest version

## Connection Issues {#connection-issues}

- Verify internet connection and DNS resolution
- Check your login credentials
- Verify that the PBX is reachable
- Check firewall settings to ensure NethLink can communicate through required ports
- Verify the correct server address is configured
- Try connecting from a different network

## Call Quality Issues {#call-quality-issues}

- Reduce background noise using the noise suppression feature
- Check network bandwidth availability
- Use wired connection instead of wireless if possible
- Move closer to the wireless router
- Close other applications consuming network bandwidth

## Application Issues {#application-issues}

- Clear application cache in Settings
- Reinstall the application
- Check for available updates
- Restart the application
- Restart your computer if issues persist

## Important Notes {#important-notes}

- NethLink can be used concurrently with NethVoice CTI
- Incoming calls will only be received on the device set as primary
- NethLink uses system notifications for alerts (e.g., incoming call)
- The application remains always accessible from the operating system's system tray
- On macOS, NethLink appears in the Dock and in Cmd+Tab only while one of its windows is open

## Getting Help {#getting-help}

If you encounter issues not covered here:

1. Check the application logs: `Help → View Logs`
2. Enable debug mode in Settings for detailed logging
3. Contact your system administrator
4. Visit the [NethServer Community](https://community.nethserver.org/) for support
