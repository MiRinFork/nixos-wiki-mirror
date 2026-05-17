<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: GNU GRUB -->

[GNU GRUB](https://www.gnu.org/software/grub/) , also known as the Grand Unified Bootlader, is a multiboot bootloader created and maintained by GNU. It is a versatile alternative to systemd-boot that supports both UEFI and Legacy BIOS.

## Usage

To install and enable GRUB on UEFI systems, add this to your system configuration: Alternatively, to install and enable GRUB on Legacy BIOS systems, add this to your system configuration: For additional GRUB module configuration options, refer to [boot.loader.grub.](https://search.nixos.org/options?channel=25.11&query=boot.loader.grub)

## FAQ

→ See <a href="Bootloader#FAQ" class="wikilink" title="Bootloader#FAQ">Bootloader#FAQ</a> as those questions also applies to GRUB.

### this GPT partition label contains no BIOS Boot Partition

This error is caused by using grub for legacy boot with a disk formatted as GPT[^1].

This can be fixed either by:

- Using a MBR partition scheme
- Adding a `BIOS boot` partition among your GPT partitions. See <https://github.com/nix-community/disko/blob/master/example/gpt-bios-compat.nix#> for an example setup using <a href="disko" class="wikilink" title="disko">disko</a>.

### How do I use GRUB in text mode?

Sometimes you need to access GRUB in text mode (e.g. when using out of band management systems like HP ILO in "textcons" mode).

To use GRUB in text mode there are two settings that need to be configured depending on whether you use EFI or BIOS boot:

``` nix
boot.loader.grub.gfxmodeEfi= "text";
boot.loader.grub.gfxmodeBios= "text";
```

Only disabling the GRUB splash screen via

``` nix
boot.loader.grub.splashImage = null;
```

results in a similar output but that is not the real text only mode.

<hr />

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>

[^1]: <https://en.wikipedia.org/wiki/BIOS_boot_partition>
