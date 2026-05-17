<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wpa supplicant -->

[wpa_supplicant](https://w1.fi/wpa_supplicant/) is a WPA Supplicant for Linux, BSD, Mac OS X, and Windows with support for WPA, WPA2 (IEEE 802.11i / RSN), and WPA3. It sets up connections to wireless networks.

## General

**[wpa_supplicant](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/networking/wpa_supplicant.nix)** can be enabled on NixOS with `networking.wireless.enable = true`.

Extra configuration can be specified inside `networking.wireless.extraConfig`.

## wpa_supplicant_gui

To be able to use `wpa_gui` or `wpa_cli` as user put the following in your `configuration.nix` file:

``` nix
networking.wireless.userControlled.enable = true;
```

Also your user must be part of the `wheel` group (replace USER with your username):

``` nix
users.extraUsers.USER.extraGroups = [ "wheel" ];
```

## Using wpa_supplicant from within the configuration file

You can configure your networks with the option `networks`. You have to fill the name(s) of your wifi(s) after the option and the preshared-key(s) (usually called `psk`). If you do not want to have your secret key in plaintext, you can use pskRaw, generated with `wpa_passphrase SSID password`. An example of using networks :

``` nix
networking.wireless.networks.Wifi_name.pskRaw = "pskRaw generated";
```

If you have multiple networks, and you want to set the priority, you can use `networking.wireless.networks.Wifi_name.priority = `<value>`;`

A full example to connect to a university or similar network that uses MSCHAPV2 (like [UWF](https://confluence.uwf.edu/display/public/ArgoAir)):

``` nix
  networking.wireless.networks."uwf-argo-air" = {
    hidden = true;
    auth = ''
      key_mgmt=WPA-EAP
      eap=PEAP
      phase2="auth=MSCHAPV2"
      identity="unx42"
      password="p@$$w0rd"
      '';
    };
```

To avoid having your network password in accessible plaintext on your system or in your version control consider using [networking.wireless.secretsFile](https://search.nixos.org/options?channel=25.05&show=networking.wireless.secretsFile&from=0&size=50&sort=relevance&type=packages&query=networking.wireless).

Another example of simple wpa2 auth:

``` nix
  networking.networkmanager.enable = false;
  networking.wireless = {
    enable = true;  # Enables wireless support via wpa_supplicant.
    networks."MYSSID".psk = "myPresharedKey";
    extraConfig = "ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=wheel";
    # output ends up in /run/wpa_supplicant/wpa_supplicant.conf
  };
```

## Switching Network

From the shell terminal, use the `wpa_cli` command line tool and specify the network interface device with -g

``` text
wpa_cli -g /run/wpa_supplicant/wlp3s0
list_network
select_network 2
```

As a means to debug if things are working, open another terminal and examine the logs by:

``` console
$ journalctl -u wpa_supplicant -f
```

## MAC spoofing

Since there is no option to randomize your MAC address for wpa supplicant, you can instead create your own service using GNU's macchanger:

``` nix
let
    change-mac = pkgs.writeShellScript "change-mac" ''
        card=$1
        tmp=$(mktemp)
        ${pkgs.macchanger}/bin/macchanger "$card" -s | grep -oP "[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[^ ]*" > "$tmp"
        mac1=$(cat "$tmp" | head -n 1)
        mac2=$(cat "$tmp" | tail -n 1)
        if [ "$mac1" = "$mac2" ]; then
            if [ "$(cat /sys/class/net/"$card"/operstate)" = "up" ]; then
                ${pkgs.iproute2}/bin/ip link set "$card" down &&
                ${pkgs.macchanger}/bin/macchanger -r "$card"
                ${pkgs.iproute2}/bin/ip link set "$card" up
            else
                ${pkgs.macchanger}/bin/macchanger -r "$card"
            fi
        fi
    '';
in
    systemd.services.macchanger = {
        enable = true;
        description = "macchanger on wlan0";
        wants = [ "network-pre.target" ];
        before = [ "network-pre.target" ];
        bindsTo = [ "sys-subsystem-net-devices-wlan0.device" ];
        after = [ "sys-subsystem-net-devices-wlan0.device" ];
        wantedBy = [ "multi-user.target" ];
        serviceConfig = {
            Type = "oneshot";
            ExecStart = "${change-mac} wlan0";
        };
    };
```

Where you need to change the `wlan0` with your own wifi network interface. You can list your interfaces by running `ip link`, your wifi network interface should have "wl" prepended. Note that the above snippet fully randomizes your MAC address, for more information you can read macchanger's manpage. This obviously requires you to have the `macchanger` package installed.

## <a href="eduroam" class="wikilink" title="eduroam">eduroam</a>

Nowadays, using EAP-PWD is preferred over MSCHAPv2 when connecting to <a href="eduroam" class="wikilink" title="eduroam">eduroam</a> or other institutional networks. It provides stronger [security claims](https://www.rfc-editor.org/rfc/rfc5931#page-35) and is simpler to set up. It also never transmits your password, doesn't require certificates and needs less authentication roundtrips. The identity and password should be given to you by your institution.

``` nixos
 networking.wireless.networks.eduroam = {
   auth = ''
     key_mgmt=WPA-EAP
     eap=PWD
     identity="youruser@yourinstitution.edu"
     password="p@$$w0rd"
   '';
 };
```

### Restrictions on Certificate Location

For certificate-based setups, due to security hardening for wpa_supplicant in NixOS 26.05 and later users of wpa_supplicant face restrictions on where eduroam certificates can be stored[^1]. Certificates should be placed in either `/etc/ssl/certs` or `/etc/wpa_supplicant` and should be owned by (or accessible to) the wpa_supplicant user.

Some eduroam configuration scripts may hardcode paths in its relevant `/etc/NetworkManager/system-connections/`<connection>`.nmconnection`. In this case, editing the `ca-cert`, `client-cert`, and `private-key` to point at their new location should suffice.

## WEP support

You may encounter a situation where you are in a hotel, for example, and the WiFi uses WEP encryption. As of version 2.10 of `wpa_supplicant`, WEP support is not enabled by default. To enable it, add the following to your `configuration.nix`:

``` nixos
  nixpkgs.overlays = [
    (self: super: {
      wpa_supplicant = super.wpa_supplicant.overrideAttrs (oldAttrs: rec {
        extraConfig = oldAttrs.extraConfig + ''
          CONFIG_WEP=y
        '';
      });
    })
  ];
```

This builds `wpa_supplicant` with WEP support.

## Fixing "legacy sigalg disallowed or unsupported"

When connecting to an institutional network fails, and something similar to following lines appear in the system log:

``` text
mrt 31 17:17:19 t14 wpa_supplicant[727029]: SSL: SSL3 alert: write (local SSL3 detected an error):fatal:internal error
mrt 31 17:17:19 t14 wpa_supplicant[727029]: OpenSSL: openssl_handshake - SSL_connect error:0A00014D:SSL routines::legacy sigalg disallowed or unsupported
```

The cause is probably an outdated RADIUS server that uses an old (insecure) signature algorithm. A workaround can be to reduce OpenSSL's security setting to allow insecure ciphers. Add the following to your NixOS configuration:

``` nixos
networking.wireless.extraConfig = ''
  openssl_ciphers=DEFAULT@SECLEVEL=0
'';
```

## External links

- [NixOs: Can't connect to a WEP network: failure to add network: invalid message format](https://github.com/NixOS/nixpkgs/issues/177501)

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>

[^1]: <https://discourse.nixos.org/t/breaking-changes-announcement-for-unstable/17574/116>
