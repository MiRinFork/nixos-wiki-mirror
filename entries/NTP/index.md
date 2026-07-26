<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NTP -->

[NTP](https://ntp.org/) (<a href="wikipedia:en:Network_Time_Protocol" class="wikilink" title="wikipedia:en:Network Time Protocol">wikipedia:en:Network Time Protocol</a>) is a protocol to synchronise time and date information through a network. It is used to set the clock of your system automatically when your computer is connected to the internet.

## NTP servers

To choose which servers to ask for time information to, use the `networking.timeServers` option. If you simply want to *add* a server to the default list, you can retrieve the default value of the option under the name `options.networking.timeServers.default`. Make sure to have `options` in the arguments at the beginning of the file:

## NTP daemon

The default NTP daemon is `systemd-timesyncd` (<a href="wikipedia:en:timesyncd" class="wikilink" title="wikipedia:en:timesyncd">wikipedia:en:timesyncd</a>).

However, there are several other NTP daemons available on NixOS. To switch to another implementation:

- for **ntpd** (<a href="wikipedia:en:ntpd" class="wikilink" title="wikipedia:en:ntpd">wikipedia:en:ntpd</a>), use `services.ntp.enable = true;`
- for **openntpd** (<a href="wikipedia:en:OpenNTPD" class="wikilink" title="wikipedia:en:OpenNTPD">wikipedia:en:OpenNTPD</a>), use `services.openntpd.enable = true;`
- for **<a href="chrony" class="wikilink" title="chrony">chrony</a>** (<a href="wikipedia:en:chrony" class="wikilink" title="wikipedia:en:chrony">wikipedia:en:chrony</a>), use `services.chrony.enable = true;`

## Set NTP from DHCP servers

Most of the time the default NTP servers will be reachable. However, sometimes the NTP servers can be blocked by the firewall (for instance most universities block NTP for security reasons). This will be visible in the `systemd-timesyncd.service`:

``` console
$ sudo systemctl status systemd-timesyncd.service
● systemd-timesyncd.service - Network Time Synchronization
…
nov. 22 16:33:23 me systemd-timesyncd[2171]: Timed out waiting for reply from 94.198.159.11:123 (1.nixos.pool.ntp.org).
…
```

You can also test a specific server as follows:

``` console
$ nix-shell -p ntp
$ ntpdate -q 0.nixos.pool.ntp.org
22 Nov 17:06:57 ntpdate[4020886]: no server suitable for synchronization found
```

However, a replacement NTP is usually provided in that case via the DHCP protocol. You can see it for instance if you use <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a>:

``` console
$ nmcli connection show 'name-of-the-current-connection' | grep ntp
DHCP4.OPTION[8]:                        ntp_servers = 192.168.x.y
DHCP4.OPTION[18]:                       requested_ntp_servers = 1
$ ntpdate -q 192.168.x.y
server 192.168.x.y, stratum 3, offset +2.493988, delay 0.02779
22 Nov 16:51:37 ntpdate[3923570]: step time server 192.168.128.1 offset +2.493988 sec
```

You might also be able to get the actual hostname of the DHCP (if it exists) using:

``` console
$ sudo nmap -sP 192.168.x.y
```

Then, you can of course manually add the DHCP server as explained above… but it's not practical when you often go to new places, or if the NTP server changes over time. For laptop it may not be a big issue (your internal clock will be used in that case until you reach a new network without firewalls) but for some devices like raspberry pi that can't store the time when device is turned off, or for servers that will always be behind the firewall, it can be interesting to automatically configure the NTP server using DHCP.

The procedure depends on how you configure internet:

1.  **By default**: (if you have not installed network manager…) the [module `network-interfaces-scripted`](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/tasks/network-interfaces-scripted.nix) will be used… unfortunately as far as I know this script cannot deal with NTP.
2.  **networkd**: If you use `systemd-networkd`, then it should automatically use the right NTP… However if you want the configuration to be automatic you want to use `networking.useNetworkd = true;` instead of `systemd.network.enable` (`useNetworkd` will automatically configure `systemd.network` to provide a good default experience as alone `systemd.network` does basically nothing). However, `networking.useNetworkd` is apparently experimental now (2022) according to its documentation, so use it at your own risks. As far as I understand you can also **disable** the default behavior using:
    ``` nix
    systemd.network.config = {
      dhcpV4Config = { UseNTP = false; };
      dhcpV6Config = { UseNTP = false; };
    }
    ```

    but I have not tested it.
3.  **Network Manager** If you use Network Manager, then Network Manager cannot (in 2022) automatically configure the NTP as-it… but you can use this trick to fake it, by automatically creating a new connection-specific NTP configuration every time the connection changes and restarting `systemd-timesyncd.service`:
    ``` nix
    # In /etc/nixos/configuration.nix
    { pkgs, lib, options, ...}
    {
      ## To use, put this in your configuration, switch to it, and restart NM:
      ## $ sudo systemctl restart NetworkManager.service
      ## To check if it works, you can do `sudo systemctl status systemd-timesyncd.service`
      ## (it may take a bit of time to pick the right NTP as it may try the
      ## other NTP firsts)
      networking.networkmanager.dispatcherScripts = [
        {
          # https://wiki.archlinux.org/title/NetworkManager#Dynamically_set_NTP_servers_received_via_DHCP_with_systemd-timesyncd
          # You can debug with sudo journalctl -u NetworkManager-dispatcher -e
          # make sure to restart NM as described above
          source = pkgs.writeText "10-update-timesyncd" ''
            [ -z "$CONNECTION_UUID" ] && exit 0
            INTERFACE="$1"
            ACTION="$2"
            case $ACTION in
            up | dhcp4-change | dhcp6-change)
                systemctl restart systemd-timesyncd.service
                if [ -n "$DHCP4_NTP_SERVERS" ]; then
                  echo "Will add the ntp server $DHCP4_NTP_SERVERS"
                else
                  echo "No DHCP4 NTP available."
                  exit 0
                fi
                mkdir -p /etc/systemd/timesyncd.conf.d
                # <<-EOF must really use tabs to keep indentation correct… and tabs are often converted to space in wiki
                # so I don't want to risk strange issues with indentation
                echo "[Time]" > "/etc/systemd/timesyncd.conf.d/''${CONNECTION_UUID}.conf"
                echo "NTP=$DHCP4_NTP_SERVERS" >> "/etc/systemd/timesyncd.conf.d/''${CONNECTION_UUID}.conf"
                systemctl restart systemd-timesyncd.service
                ;;
            down)
                rm -f "/etc/systemd/timesyncd.conf.d/''${CONNECTION_UUID}.conf"
                systemctl restart systemd-timesyncd.service
                ;;
            esac
            echo 'Done!'
          '';
        }
      ];
    }
    ```

    To apply the change, switch to your new configuration and make sure to restart Network Manager:

    ``` console
    $ sudo systemctl restart NetworkManager.service
    ```

    Check if the NTP server is used (may need to wait a few minutes):

    ``` console
    $ sudo systemctl status systemd-timesyncd.service
    ```

    You might need to wait a one or two minutes as `systemd-timesyncd` may try to load other ntp servers, timeout, and then try the new NTP server.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
