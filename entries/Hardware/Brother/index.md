<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Brother -->

## Troubleshooting

### With proper paper setting, printout is shifted or cropped

This may happen because of the way the brother drivers are made, it seems there is a bug in the handling of paper type, and it does not only affect NixOS.

To see if this problem affects you, look at the \`rc\` file for your printer, in the package for your drivers.

    /nix/store/.../opt/brother/Printers/[model]/inf/br[model]rc

There will be a line as such:

    PaperType=A4

The problem can be inverted depending on the driver, some will default to A4 and some to Letter.

One way this can be worked-around is by patching the rc file at build time[^1]. This will not allow switching paper type at runtime.

<hr />

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: <https://ubuntuforums.org/showthread.php?t=1450999&p=11197947#post11197947>
