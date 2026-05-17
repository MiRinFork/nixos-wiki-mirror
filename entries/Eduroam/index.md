<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Eduroam -->

**[](https://eduroam.org/)** (for *edu*cation *roam*ing) (<a href="wikipedia:en:{{lcfirst:{{PAGENAMEE}}}}" class="wikilink" title="wikipedia:en:{{lcfirst:{{PAGENAMEE}}}}">wikipedia:en:{{lcfirst:{{PAGENAMEE}}}}</a>) is the secure, world-wide roaming access service developed for the international research and education community.[^1]

## Setup

For manual setup using wpa_supplicant, iwd, NetworkManager et. al. you can follow the instructions in the [Arch Linux Wiki](https://wiki.archlinux.org/title/Network_configuration/Wireless#eduroam). Note that for wpa_supplicant users, <a href="Wpa_supplicant#Restrictions_on_Certificate_Location" class="wikilink" title="additional restrictions are placed on where certificates can be located">additional restrictions are placed on where certificates can be located</a>. Also note that configuration of eduroam highly depends on the way your institution implemented it. That's why you should consult their guidelines first and adapt accordingly.

Declarative setup on Nix is possible for <a href="wpa_supplicant#eduroam" class="wikilink" title="wpa_supplicant#eduroam">wpa_supplicant#eduroam</a>, <a href="iwd#eduroam" class="wikilink" title="iwd#eduroam">iwd#eduroam</a> (example in the respective articles) and <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a>. For the latter, an exemplary setup is described below.

First, you should download the necessary certificates and key files (if applicable) from your university. If provided as a PKCS#12 certificate bundle (.p12-file), you may unpack the individual components using openssl. A password may be provided using the `-passin pass:` flag or entered interactively.

``` console
openssl pkcs12 -in eduroam.p12 -nocerts -nodes -out private.key
openssl pkcs12 -in eduroam.p12 -nokeys -out cert.pem
```

It may be advisable to move them to `/etc/ssl/certs/eduroam` and adjust permissions.

``` console
sudo mkdir -p /etc/ssl/certs/eduroam
sudo mv private.key cert.pem /etc/ssl/certs/eduroam/
sudo chmod 600 /etc/ssl/certs/eduroam/private.key
sudo chmod 644 /etc/ssl/certs/eduroam/cert.pem
sudo chown root:root /etc/ssl/certs/eduroam/*
```

Note that some universities just require a certificate some .crt or .pem certificate and authenticate via password, eliminating the need for a .key-file. Stick to your universities instructions for this.

Next, you may setup NetworkManager.

After rebuilding and switching, you can verify the presence of your newly configured eduroam.nmconnection and check for issues:

``` console
ls /run/NetworkManager/system-connections/
nmcli -f NAME,TYPE,ACTIVE c s | grep eduroam
sudo journalctl -u NetworkManager -f
```

## See also

- <a href="wpa_supplicant#eduroam" class="wikilink" title="wpa_supplicant#eduroam">wpa_supplicant#eduroam</a>
- <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a>
- <a href="iwd#eduroam" class="wikilink" title="iwd#eduroam">iwd#eduroam</a>
- <a href="SecureW2_JoinNow" class="wikilink" title="SecureW2 JoinNow">SecureW2 JoinNow</a>
- …

## External links

- [(german) article *eduroam meets NixOS* (with configuration)](https://www.stura.htw-dresden.de/stura/ref/hopo/dk/nachrichten/eduroam-meets-nixos) (instance *University of Applied Sciences Dresden*: The [eduroam installer for GNU/Linux](https://cat.eduroam.org/?idp=5106&profile=5098) works [for example for Ubuntu](https://www.htw-dresden.de/en/university/organisation/zid/service-overview-and-instructions/wi-fi-/-wlan/eduroam/linux) but not <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>)

## References

<references />

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>

[^1]: <https://eduroam.org/what-is-eduroam/>
