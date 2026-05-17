<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/networkd/dispatcher -->

[Networkd-dispatcher](https://gitlab.com/craftyguy/networkd-dispatcher) is a dispatcher service for systemd-networkd connection status changes. This daemon is similar to NetworkManager-dispatcher, but is much more limited in the types of events it supports due to the limited nature of systemd-networkd.

## Usage

The following example triggers a script every time the networkd state `routable` or `off` is reached. This is the case when you connect to a new network or quit an existing connection as with <a href="OpenVPN" class="wikilink" title="OpenVPN">OpenVPN</a>. An additional check ensures that the affected interface corresponds to `wlan0` and that the uplink is `configured`. After that the <a href="Tor" class="wikilink" title="Tor">Tor</a> daemon gets restarted.

``` nix
services.networkd-dispatcher = {
  enable = true;
  rules."restart-tor" = {
    onState = ["routable" "off"];
    script = ''
      #!${pkgs.runtimeShell}
      if [[ $IFACE == "wlan0" && $AdministrativeState == "configured" ]]; then
        echo "Restarting Tor ..."
        systemctl restart tor
      fi
      exit 0
    '';
  };
};
```

Please refer [upstream documentation](https://gitlab.com/craftyguy/networkd-dispatcher) for available states and additional examples.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
