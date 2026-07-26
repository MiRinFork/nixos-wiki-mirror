<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plymouth -->

<languages/> [Plymouth](https://www.freedesktop.org/wiki/Software/Plymouth) is a project from Fedora and now listed among the [freedesktop.org's official resources](https://www.freedesktop.org/wiki/Software/#graphicsdriverswindowsystemsandsupportinglibraries) providing a flicker-free graphical boot process. It relies on [kernel mode setting](https://wiki.archlinux.org/title/Kernel_mode_setting) (KMS) to set the native resolution of the display as early as possible, then provides an eye-candy splash screen leading all the way up to the login manager.

## Preparation

*Plymouth* primarily uses KMS to display graphics, but on UEFI systems it can utilize the EFI framebuffer.

If you have neither KMS nor a framebuffer, *Plymouth* will fall back to text-mode.[^1]

## Installation

### Basic Config

``` nix
{
  boot = {
    plymouth = {
      enable = true;
    };

    # Enable "Silent boot"
    consoleLogLevel = 3;
    initrd.verbose = false;
    kernelParams = [
      "quiet"
      "rd.udev.log_level=3"
      "rd.systemd.show_status=auto"
    ];

    # Hide the OS choice for bootloaders.
    # It's still possible to open the bootloader list by pressing any key
    # It will just not appear on screen unless a key is pressed
    loader.timeout = 0;
  };
}
```

## Configuration

### Changing the theme

Plymouth comes with a selection of themes:

1.  **BGRT**: A variation of Spinner that keeps the OEM logo if available (BGRT stands for Boot Graphics Resource Table)
2.  **Fade-in**: "Simple theme that fades in and out with shimmering stars"
3.  **Glow**: "Corporate theme with pie chart boot progress followed by a glowing emerging logo"
4.  **Script**: "Script example plugin" (Despite the description seems to be a quite nice Arch logo theme)
5.  **Solar**: "Space theme with violent flaring blue star"
6.  **Spinner**: "Simple theme with a loading spinner"
7.  **Spinfinity**: "Simple theme that shows a rotating infinity sign in the center of the screen"
8.  **Tribar**: "Text mode theme with tricolor progress bar"
9.  **Text**: "Text mode theme with tricolor progress bar"
10. **Details**: "Verbose fallback theme"

NixOS sets the default theme to **bgrt**[^2]. You can change the theme with \`boot.plymouth.theme\`:

``` nix
{
  boot = {
    plymouth = {
      enable = true;
      theme = "solar";
    };
  };
}
```

### Install new themes

As an example, you can use a boot animation from [adi1090x's collection](https://github.com/adi1090x/plymouth-themes) like so:

### HiDPI

Edit the configuration file:

``` nix
{
  boot = {
    plymouth = {
      enable = true;
      extraConfig = ''
        [Daemon]
        DeviceScale=an-integer-scaling-factor
      '';
    };
  };
}
```

## Tips and tricks

### Show boot messages

During the graphical boot process, it is possible to switch to text mode and back by pressing the escape key.

## Troubleshooting

### LUKS Encryption

If you are using LUKS encryption the password prompt may fall back to text mode. While the default `bgrt` theme supports graphical password entry, this may not be supported by all themes.

## See Also

- [Arch Wiki](https://wiki.archlinux.org/title/Plymouth)

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>

[^1]: <https://wiki.archlinux.org/title/Plymouth>

[^2]: <https://github.com/NixOS/nixpkgs/blob/8c91a71d13451abc40eb9dae8910f972f979852f/nixos/modules/system/boot/plymouth.nix>
