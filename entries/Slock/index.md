<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Slock -->

## Setup

To make slock available, amend `/etc/nixos/configuration.nix` as follows:

``` nix
{
  ...
  programs.slock.enable = true;
  ...
}
```

## Troubleshooting

### "cannot disable the out-of-memory killer for this process"

slock requires root for accessing passwords and protecting itself from OOM killing. Adding `slock` to `environment.systemPackages` is not adequate (nor is it necessary); slock should be enabled via the provided NixOS module via the means shown above.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
