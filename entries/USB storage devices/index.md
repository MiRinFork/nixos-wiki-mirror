<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: USB storage devices -->

## Auto-mounting with udisks

[udiskie](https://github.com/coldfix/udiskie), a front-end that allows to manage removable media can be used. To enable automounting, first enable udisks2:

Next enable udiskie via <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

Once the configurations are reflected, USB storage devices will be instantly recognized when inserted without any additional operations needed.

## Mounting at boot

### Troubleshooting

While booting you might get a timeout error, caused by missing kernel modules in your initrd. Error message: \[ TIME \] Timed out waiting for device /dev/disk/by-partlabel/disk-<name>-<partition>

To fix this simply add the missing kernel module to your initrd.

You can find the missing kernel modules by plugging in your external storage device and comparing the outputs of the following two commands:

    # Modules available on booted system: 
    lsmod

    # Modules available at boot:
    nix eval --file '<nixpkgs/nixos>' -A config.boot.initrd.availableKernelModules

For other solutions, please refer to [udisks - ArchWiki](https://wiki.archlinux.org/title/Udisks#Mount_helpers) or [USB storage devices - ArchWiki](https://wiki.archlinux.org/title/USB_storage_devices).

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
