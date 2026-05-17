<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nitrokey/fr -->

<languages/>

<div class="mw-translate-fuzzy">

Cet article décrit comment utiliser <a href="Wikipedia:Nitrokey" class="wikilink" title="Nitrokey">Nitrokey</a> avec NixOS

</div>

<span id="Installation"></span>

<div class="mw-translate-fuzzy">

## Installation

Vous devez également ajouter la règle udev pour Nitrokey et activer l'agent GPG.

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

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You also want to add the nitrokey udev rules and enable the gpg agent

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
