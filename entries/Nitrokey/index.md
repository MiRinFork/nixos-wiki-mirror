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

### FIDO2

Nitrokey devices with FIDO2 support (*Nitrokey 3*, *Nitrokey FIDO2*) can unlock LUKS volumes and authenticate PAM services such as `sudo` or the GNOME Display Manager.

</translate>

<translate>

#### LUKS unlock

Enroll the key in a free LUKS slot of every encrypted device: </translate>

``` shell
systemd-cryptenroll --fido2-device=auto /dev/disk/by-uuid/38f1c94c-5dfa-4e0a-8ec0-ae78126ac3c0
```

<translate> Then point the initrd at it: </translate>

``` nix
boot.initrd.luks.devices."crypted" = {
  device = "/dev/disk/by-uuid/38f1c94c-5dfa-4e0a-8ec0-ae78126ac3c0";
  crypttabExtraOpts = [ "fido2-device=auto" ];
};
```

<translate> </translate>

<translate>

#### PAM: sudo and GDM login

Register the key for your user. reads `$XDG_CONFIG_HOME/Yubico/u2f_keys` (i.e. `~/.config/Yubico/u2f_keys`) by default: </translate>

``` shell
mkdir -p ~/.config/Yubico
nix-shell -p pam_u2f --run pamu2fcfg > ~/.config/Yubico/u2f_keys
```

<translate> Touch the key when it blinks. Append additional keys with `pamu2fcfg -n >> ~/.config/Yubico/u2f_keys`.

Enable the module and the PAM services you want to protect: </translate>

``` nix
security.pam.u2f = {
  enable = true;
  cue = true; # ask to touch the device
  # A system-wide mapping file can be set instead of the per-user one:
  # settings.authfile = "/etc/u2f_keys";
};

security.pam.services.gdm-password.u2f.enable = true;
security.pam.services.sudo.u2f.enable = true;
```

<translate> </translate>

<translate>

#### Lock the session when the key is removed

Nitrokey devices use the USB vendor ID `20a0`: </translate>

``` nix
services.udev.extraRules = ''
  ACTION=="remove", ENV{ID_BUS}=="usb", ENV{ID_VENDOR_ID}=="20a0", \
    RUN+="${pkgs.systemd}/bin/loginctl lock-sessions"
'';
```

<translate>

## References

<references/>

</translate>

<translate> </translate>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: <https://en.wikipedia.org/wiki/Nitrokey#Technical_features>
