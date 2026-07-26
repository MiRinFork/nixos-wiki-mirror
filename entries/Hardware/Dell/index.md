<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Dell -->

### Efivars is full

Encountered this issue on A Dell server

`Failed to create EFI Boot variable entry: No space left on device.` during bootloader install.

Googling `DbocBoot` only shows one result: https://bbs.archlinux.org/viewtopic.php?id=276175

Running `strings` on the `DbocBoot` entries show that they contain strings like `Windows Boot Manager` and `Ubuntu` and other old efi boot entries

`bcfg boot dump -v` in EFI shell does not show these variables, only `Boot*` variables.

###### The fix is to remove the `DbocBoot` entries

Normally the files are protected therefore it is necessary to remove the protection:

``` console
$ chattr -i /sys/firmware/efi/efivars/DbocBoot*
```

Then they can be removed:

``` console
$ rm -vi /sys/firmware/efi/efivars/DbocBoot*</code>
```

During the next boot there may be a warning:

`Warning: Corrupted BootOrder variable detected... Repaired` and the boot will continue as normal.

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
