<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nitrokey/en -->

<languages/> This article describes how you can use your <a href="Wikipedia:Nitrokey" class="wikilink" title="Nitrokey">Nitrokey</a> with NixOS

## Installation

You also want to add the nitrokey udev rules and enable the gpg agent

``` nix
services.udev.packages = [ pkgs.nitrokey-udev-rules ];
programs = {
  ssh.startAgent = false;
  gnupg.agent = {
    enable = true;
    enableSSHSupport = true;
  };
};
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
