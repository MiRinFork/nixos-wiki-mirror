<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Iwd -->

[iwd](https://archive.kernel.org/oldwiki/iwd.wiki.kernel.org/) (iNet wireless daemon) is a Linux-only wireless daemon aiming to decrease the time spent making connections.

## Setup

iwd can be enabled with the following snippet.

``` nix
networking.wireless.iwd.enable = true;
```

## Usage

Connections can be managed using the provided `iwctl` tool.

## Configuration

To configure iwd, you should use `networking.wireless.iwd.settings` option. An example configuration, which enables IPv6 and automatic connection to known networks, would be similar to:

``` nix
{
  networking.wireless.iwd.settings = {
    Network = {
      EnableIPv6 = true;
    };
    Settings = {
      AutoConnect = true;
    };
  };
}
```

For a detailed and up-to-date list of available settings, please reference the [network daemon configuration documentation](https://git.kernel.org/pub/scm/network/wireless/iwd.git/tree/src/iwd.network.rst), from kernel Git repo.

### <a href="eduroam" class="wikilink" title="eduroam">eduroam</a>

<a href="eduroam" class="wikilink" title="eduroam">eduroam</a> (WPA2 Enterprise) wireless networks need to get configured manually by creating the following file `/var/lib/iwd/eduroam.8021x`, which will not persist across NixOS rebuilds unless explicitly managed. It's often better to configure this via a NixOS module.

``` ini
[Security]
EAP-Method=PEAP
EAP-Identity=eduroamHDcat2024@uni-heidelberg.de
EAP-PEAP-CACert=/var/lib/iwd/ca.pem
EAP-PEAP-ServerDomainMask=radius-node1.urz.uni-heidelberg.de
EAP-PEAP-Phase2-Method=MSCHAPV2
EAP-PEAP-Phase2-Identity=xyz123@uni-heidelberg.de
EAP-PEAP-Phase2-Password=mypassword

[Settings]
Autoconnect=true
```

Replace the values in `EAP-Identity`, `EAP-PEAP-ServerDomainMask`, `EAP-PEAP-Phase2-Identity` and `EAP-PEAP-Phase2-Password` according to your university presets which can be acquired at [cat.eduroam.org](https://cat.eduroam.org). After entering your university name there the site will offer you a download link to a Python script which contains most of the required default values. The script also contains a certificate string which can be copied into the file `/var/lib/iwd/ca.pem`.

### iwd as backend for NetworkManager

If iwd is present, it can be used as a backend for <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> through the following snippet.

``` nix
networking.networkmanager.wifi.backend = "iwd";
```

### iwd as backend for Connman

iwd could be used as a backend for Connman too.

``` nix
services.connman.wifi.backend = "iwd";
```

Note that iwd is experimental and it does not have feature parity with the default backend, wpa_supplicant.

## Troubleshooting

### org.freedesktop.service failed

When connecting to a protected network it could happen that no password window appears and the following message is written in the journal:

``` text
dbus-daemon[1732]: [session uid=9001 pid=1730] Activated service 'org.freedesktop.secrets' failed: Failed to execute program org.freedesktop.secrets: No such file or directory
```

Your desktop manager may not enable some secrets management service you may need to enable one:

``` nix
{
  services.gnome.gnome-keyring.enable = true;
}
```

### rfkill blocks wireless device

If the Wi-Fi connection is blocked by `rfkill`, it needs to unblock the wireless device. A way to do that in NixOS is by using `system.activationScripts`, although it is not the most idiomatic solution.

``` nix
{
  system.activationScripts = {
    rfkillUnblockWlan = {
      text = ''
        rfkill unblock wlan
      '';
      deps = [];
    };
  };
}
```

### event: disconnect-info reason: 2

When using certain chipsets, such as the Qualcomm `qcncm865`[^1], you need to use legacy EAPoL packets[^2] to prevent a disconnect loop. In `iwd.service` this issue shows up as:

``` text
SA Query timed out, connection is invalid.  Disconnecting...
Feb 26 10:17:10 probook iwd[4486]: event: disconnect-info, reason: 2
```

If you are using systemd-networkd, this shows up in `systemd-networkd.service` as repeated `Carrier Gained. Carrier Lost.` messages. On NixOS, this can be resolved by setting the matching iwd settings option.

``` nix
{
  networking.wireless.iwd.settings.General.ControlPortOverNL80211 = false;
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:_Networking" class="wikilink" title="Category: Networking">Category: Networking</a>

[^1]: <https://community.frame.work/t/guide-successful-wi-fi-7-802-11be-on-framework-13-amd-with-qualcomm-qcncm865-and-arch-linux/44723>

[^2]: <https://lkml.org/lkml/2020/10/14/1101>
