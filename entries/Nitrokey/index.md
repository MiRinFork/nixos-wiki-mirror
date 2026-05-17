<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nitrokey -->

<languages/>

<translate> This article describes how you can use your <a href="Wikipedia:Nitrokey" class="wikilink" title="Nitrokey">Nitrokey</a> with NixOS.

There are multiple variants of Nitrokeys, with the newest being the "Nitrokey 3". Different products support different security operations like FIDO2, One-Time-Passwords and S/MIME and OpenPGP key handling [^1]. </translate>

<translate>

## Installation

While Nitrokey devices operate via USB (a standard port & protocol), to use it in a meaningful way, udev rules need to be added to the system to make the USB device available to regular users. </translate>

<translate>

### Shell

Depending on your Nitrokey device, there are different CLI applications to interact with it.

- \(CLI\) and (GUI) for *Nitrokey Pro* and *Nitrokey Storage*

- \(CLI\) and (GUI) for *Nitrokey 3*.

</translate>

<translate>

### System Setup

To make Nitrokey devices usable by regular users, enable the appropriate hardware option. This will set up correct udev rules. </translate>

<translate>

## Tips and Tricks

### GPG Support

``` nix
programs = {
  ssh.startAgent = false;
  gnupg.agent = {
    enable = true;
    enableSSHSupport = true;
  };
};
```

</translate>

<translate>

### KeePassXC

[KeePassXC](https://keepassxc.org/) supports securing a password database with Nitrokey hardware tokens. The [official Nitrokey documentation](https://docs.nitrokey.com/software/nk-app2/keepassxc) has details on how a Nitrokey device must be set up to work with KeePassXC.

However, some NixOS Options should be set to make it work: </translate>

<translate>

## References

<references/>

</translate>

<translate> </translate>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: <https://en.wikipedia.org/wiki/Nitrokey#Technical_features>
