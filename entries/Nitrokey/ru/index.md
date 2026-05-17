<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nitrokey/ru -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

This article describes how you can use your <a href="Wikipedia:Nitrokey" class="wikilink" title="Nitrokey">Nitrokey</a> with NixOS

</div>

<span id="Installation"></span>

<div class="mw-translate-fuzzy">

## Установка

Вам также нужно добавить правила nitrokey udev и включить gpg-агент

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
