<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Limine -->

[**Limine**](https://limine-bootloader.org/) ([lē-mi-ne](https://www.merriam-webster.com/dictionary/in%20limine)) is a modern, advanced, portable, multi-protocol bootloader and boot manager. It aims to be a more robust alternative to bootloaders like <a href="GNU_GRUB" class="wikilink" title="GNU GRUB">GNU GRUB</a> and <a href="Systemd/boot" class="wikilink" title="Systemd-boot">Systemd-boot</a>.

## Usage

To install and enable Limine, add this to your system configuration: For additional Limine module configuration options, refer to \[<https://search.nixos.org/options?channel=unstable&show=boot.loader.limine>. boot.loader.limine.\]

## Secure Boot

Limine Secure Boot support is principally controlled by the [module options](https://search.nixos.org/options?channel=unstable&show=boot.loader.limine.secureBoot.enable&query=boot.loader.limine.secureBoot.enable).

### Prerequisites

Before trying to set up secure boot, ensure that:

1.  Limine is enabled as the current bootloader using `boot.loader.limine.enable = true`. You may find the existing <a href="Bootloader" class="wikilink" title="Bootloader">Bootloader</a> documentation helpful.
2.  `sbctl` is installed as a system level package (using `environment.systemPackages`).

### Generate Secure Boot keys

`sbctl` is used to securely generate & store the Secure Boot keys. Generating the keys is as simple as:

``` console
$ sudo sbctl create-keys
```

This stores your secure boot keys at `/var/lib/sbctl` and sets the permissions so that they can only be read by the root user.

### Enable UEFI Secure Boot Setup Mode

This usually involves entering the UEFI firmware menu (BIOS) and enabling the relevant option under Secure Boot named "Reset to Setup Mode" or "Erase all Secure Boot settings".

On some UEFI firmware implementations, there is not an explicit option to enter Setup Mode, instead the user must chose the option(s) to erase existing Secure Boot keys. After entering Setup Mode or clearing the keys, reboot back into NixOS.

### Enroll Secure Boot keys

Once in Setup Mode, your generated keys can be enrolled using `sbctl` again.

``` console
$ sudo sbctl enroll-keys --microsoft --firmware-builtin
```

The `--microsoft` option is required for some devices which have hardware OptionROMS signed by Microsoft keys. The `--firmware-builtin` option ensures your OEM certificates are also installed.

If this is successful, you can now rebuild with `boot.loader.limine.secureBoot.enable` set to true and reboot. Secure Boot should be enabled after reboot, but some devices will require it to be re-enabled manually in the UEFI firmware.

Once rebooted, you can verify the Secure Boot status using, `bootctl status`.

``` console
$ bootctl status
systemd-boot not installed in ESP.
System:
      Firmware: n/a (n/a)
 Firmware Arch: x64
   Secure Boot: enabled (user)
...
```

## See Also

<a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a>

<a href="Bootloader" class="wikilink" title="Bootloader">Bootloader</a>

[Limine GitHub Repository](https://github.com/Limine-Bootloader/Limine)

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a> <a href="Category:Secure_Boot" class="wikilink" title="Category:Secure Boot">Category:Secure Boot</a>
