<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dual Booting NixOS and Windows -->

This section explains various methods to have the <a href="bootloader" class="wikilink" title="bootloader">bootloader</a> prompt whether to boot windows or NixOS.

## Autodetection

### systemd-boot

When is installed to the same EFI System Partition (ESP) that Windows uses, it will automatically detect the Windows installation () and present it as a boot option.

You can verify detected boot loaders by running the command.

A system pre-installed with Windows might have a small ESP partition size that is not sufficient to store the kernel and initrd files for multiple NixOS generations. One solution is to create an additional [XBOOTLDR](https://uapi-group.org/specifications/specs/boot_loader_specification/#the-partitions) partition and configure to use it:

### os-prober

`os-prober` is a tool to autodetect which other systems are present on the machine. Grub can be told to use os-prober to add a menu-entry for each of them.

## Manual configuration

In case `os-prober` does not detect your windows partition you can configure your bootloader manually to find it.

### MBR

All MBR bootloaders will need at least some configuration to chainload Windows.

#### Grub

Here is an example config:

Source: <https://www.reddit.com/r/NixOS/comments/31lx3i/windows_and_nixos_dual_boot/>

### UEFI

After setting up a 256mb EFI Partition dualboot should work out of the box (at least for windows10)

Source: [zimbatm.com/journal/2016/09/09/nixos-window-dual-boot](https://web.archive.org/web/20170523065625/https://zimbatm.com/journal/2016/09/09/nixos-window-dual-boot/)

Here is another article that documents dual booting NixOS and Windows on a Lenovo ThinkPad X1 Carbon (6th Gen): <https://github.com/andywhite37/nixos/blob/master/DUAL_BOOT_WINDOWS_GUIDE.md>

#### Grub

Here we assume:

- the EFI partition has been mounted on /boot/efi
- `$FS_UUID` is the UUID of the EFI partition
- the `boot.loader.systemd-boot.enable = true;` line added to configuration.nix by `nixos-generate-config` has been removed

#### EFI with multiple disks

##### systemd-boot

As systemd-boot cannot directly load binaries from other ESPs[^1], let alone other disks, we have to employ [edk2-uefi-shell](https://search.nixos.org/packages?channel=unstable&show=edk2-uefi-shell&from=0&size=50&sort=relevance&type=packages&query=edk2-uefi-shell) to implement a chainloading strategy[^2]. The basic config looks like this:You can try if this works without changes, but most likely you have to modify the value of `boot-drive` first to match your hardware configuration.

First, make sure you `nixos-rebuild switch` or `nixos-rebuild boot` , then reboot your machine and select the entry "EDK2 UEFI Shell" from the systemd-boot menu. In this shell, run the command `map -c` to get a list of all "consistent" device mappings:

``` text
Press ESC in 1 seconds to skip startup.nsh or any other key to continue.
Shell> map -c
Mapping table
    HD0c3: Alias(s):FS0:;BLK7:
          PciRoot(0x0)/Pci(0x1,0x1)/Ata(0x0)/HD(3,GPT,5CBAF773-8FFA-11EB-952D-FCAA14203853,0x1DAA6000,0x32000)
    HD0d1: Alias(s):FS1:;BLK10:
          PciRoot(0x0)/Pci(0x1,0x1)/Ata(0x0)/HD(1,GPT,7F623BEA-5891-49EE-9980-6534716F0F50,0x800,0x1F4000)
```

Then, change to each of these drives by entering the drive name (not one of the aliases!) and check whether the Windows bootloader is present:

``` text
Shell> HD0d1:
HD0d1:\> ls EFI
Directory of: HD0d1:\EFI\
09/21/2024  22:05 <DIR>         4,096  .
09/21/2024  22:05 <DIR>             0  ..
09/21/2024  23:08 <DIR>         4,096  BOOT
09/21/2024  22:05 <DIR>         4,096  Linux
09/24/2024  08:30 <DIR>         4,096  nixos
01/01/1980  00:00           1,060,672  shell.efi
09/21/2024  23:08 <DIR>         4,096  systemd
          1 File(s)   1,060,672 bytes
          6 Dir(s)
HD0d1:\> HD0c3:
HD0c3:\> ls EFI
Directory of: HD0c3:\EFI\
03/28/2021  21:28 <DIR>         1,024  .
03/28/2021  21:28 <DIR>             0  ..
03/28/2021  21:28 <DIR>         1,024  Boot
03/28/2021  21:28 <DIR>         1,024  Microsoft
          0 File(s)           0 bytes
          4 Dir(s)
```

In this case, HD0d1 is the ESP of our NixOS installation, and HD0c3 is the ESP of Windows.

After entering the Windows ESP, you can boot into it by running `EFI\Microsoft\Boot\Bootmgfw.efi`. This is also useful if you have multiple Windows installations and want to find out which ESP belongs to which installation.

After this, you can change the value of `boot-drive` in the configuration snippet above, `nixos-rebuild switch` and reboot to boot into windows. Make sure that you use the actual device name, not one of the aliases, as these might not be available immediately on boot, making the shell invocation fail.

##### Grub

In Grub, the following might work:

## System time

System clock might be incorrect after booting Windows and going back to NixOS.

It can be fixed by setting RTC time standard to UTC on Windows (*recommended*, see [how to do this](https://wiki.archlinux.org/title/System_time#UTC_in_Microsoft_Windows)).

Alternatively, you can set NixOS RTC time standard to localtime, compatible with Windows in its default configuration:

See [Arch Linux wiki#System time](https://wiki.archlinux.org/title/System_time#Time_standard) for discussion of both options.

## See also

- <a href="GNU_GRUB" class="wikilink" title="GNU GRUB">GNU GRUB</a>
- [Arch Linux wiki#GRUB](https://wiki.archlinux.org/index.php/GRUB#Windows_installed_in_UEFI-GPT_Mode_menu_entry)
- [NixOS GRUB installer](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/system/boot/loader/grub/install-grub.pl) (check the code block beginning with \# install EFI GRUB)

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>

[^1]: <https://github.com/systemd/systemd/issues/3252>

[^2]: <https://wiki.archlinux.org/title/Systemd-boot#Boot_from_another_disk>
