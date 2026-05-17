<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rosenpass -->

[Rosenpass](https://rosenpass.eu/) implements a post-quantum-secure key exchange for use with e.g. <a href="WireGuard" class="wikilink" title="WireGuard">WireGuard</a>.

# Setting up Rosenpass

This wiki page guides through the set up of an encrypted Wireguard with Rosenpass connection between two network hosts.

For this guide, we assume that there are 2 NixOS hosts, both reachable via the network hostnames `server` and `client`.

After successful setup, the hosts will be able to reach each other via these IPs:

- server: `1:c:bad:c0de::1`
- client: `1:c:bad:c0de::2`

## Generate and distribute keypairs

Each peer needs to have a public-private keypair, for both WireGuard and Rosenpass. The keys can be generated on any machine that already has WireGuard and Rosenpass installed using the `wg` and the `rosenpass` utilities. Install these tools either temporarily with `nix-shell -p rosenpass wireguard-tools` or add these tools to your system profile.

We will first need to generate and then distribute the keypairs.

Creating the key pairs is simple, but to do this securely, it should happen on the respective hosts. This way it becomes a bit elaborate to distribute the public keys to the other respective peer:

``` bash
ssh root@server "rm -rf /var/secrets/{rp,wg} && mkdir -m 755 -p /var/secrets/{rp,wg} && chown systemd-network:systemd-network /var/secrets/wg"
ssh root@client "rm -rf /var/secrets/{rp,wg} && mkdir -m 755 -p /var/secrets/{rp,wg} && chown systemd-network:systemd-network /var/secrets/wg"

ssh root@server "cd /var/secrets/rp && rosenpass gen-keys --secret-key pqsk --public-key pqpk"
ssh root@client "cd /var/secrets/rp && rosenpass gen-keys --secret-key pqsk --public-key pqpk"

ssh root@server "cd /var/secrets/wg && wg genkey | tee wgsk | wg pubkey > wgpk"
ssh root@client "cd /var/secrets/wg && wg genkey | tee wgsk | wg pubkey > wgpk"

rsync root@server:/var/secrets/rp/pqpk server.pqpk
rsync root@client:/var/secrets/rp/pqpk client.pqpk
rsync --perms --chmod=644 server.pqpk root@client:/var/secrets/rp/server.pqpk
rsync --perms --chmod=644 client.pqpk root@server:/var/secrets/rp/client.pqpk

ssh root@server "echo server wg pubkey is \$(cat /var/secrets/wg/wgpk)"
ssh root@client "echo client wg pubkey is \$(cat /var/secrets/wg/wgpk)"
```

Note down the results of the last two printed lines as these are the public keys that need to be entered in the following NixOS configuration snippets.

You can create as many keypairs as you like for different connections or roles; it is also possible to reuse the same keypair for every connection.

### Server setup

Enable WireGuard on the server via `/etc/nixos/configuration.nix`:

``` nix
{
  # ... rest of the server config ...

  systemd.network = {
    networks."rosenpass" = {
      matchConfig.Name = "rosenpass0";
      networkConfig.IPv4Forwarding = true;
      networkConfig.IPv6Forwarding = true;
      address = [ "1:c:bad:c0de::1/64" ];
    };
    netdevs."10-rosenpass0" = {
      netdevConfig = {
        Kind = "wireguard";
        Name = "rosenpass0";
      };
      wireguardConfig.PrivateKeyFile = "/var/secrets/wg/wgsk";
      wireguardConfig.ListenPort = 10000;
      wireguardPeers = [
        {
          # It is possible to restrict this to the actual IP here.
          AllowedIPs = [ "::/0" ];
          PublicKey = "<copy content of client.wgpk here>";
        }
      ];
    };
  };

  services.rosenpass = {
    enable = true;
    defaultDevice = "rosenpass0";
    settings = {
      verbosity = "Verbose";
      public_key = "/var/secrets/rp/pqpk";
      secret_key = "/var/secrets/rp/pqsk";
      listen = [ "[::]:9999" ];
      peers = [
        {
          public_key = "/var/secrets/rp/client.pqpk";
          peer = "<copy content of client.wgpk here>";
        }
      ];
    };
  };

  networking.firewall.allowedUDPPorts = [
    9999 # rosenpass
    10000 # WireGuard
  ];
}
```

### Client setup

``` nix
{
  # ...

  systemd.network = {
    networks."rosenpass" = {
      matchConfig.Name = "rosenpass0";
      networkConfig.IPv4Forwarding = true;
      networkConfig.IPv6Forwarding = true;
      address = [ "1:c:bad:c0de::2/64" ];
    };
    netdevs."10-rosenpass0" = {
      netdevConfig = {
        Kind = "wireguard";
        Name = "rosenpass0";
      };
      wireguardConfig.PrivateKeyFile = "/var/secrets/wg/wgsk";
      wireguardPeers = [
        {
          # It is possible to restrict this to the actual IP here.
          AllowedIPs = [ "::/0" ];
          PublicKey = "<copy content of server.wgpk here>";
          Endpoint = "<IP of Server>:10000";
          PersistentKeepalive = 25;
        }
      ];
    };
  };

  services.rosenpass = {
    enable = true;
    defaultDevice = "rosenpass0";
    settings = {
      verbosity = "Verbose";
      public_key = "/var/secrets/rp/pqpk";
      secret_key = "/var/secrets/rp/pqsk";
      peers = [
        {
          public_key = "/var/secrets/rp/server.pqpk";
          endpoint = "<IP of Server>:9999";
          peer = "<copy content of server.wgpk here>";
        }
      ];
    };
  };
}
```

As the keypairs are already in place, running `nixos-rebuild switch` (or any of the deployment tools you prefer) should result in a working setup.

If you need more connections, then create keypairs for more hosts, reuse the \*client\* config for them and extend the peer lists (for both WireGuard and Rosenpass) in the server configuration.

## Testing the connection

Log in (preferably as root) on both servers and check if the network setup was successful:

``` console
# ip a
...
3: rosenpass0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet6 1:c:bad:c0de::1/64 scope global
       valid_lft forever preferred_lft forever

# wg show all
interface: rosenpass0
  public key: nF7sPZ6pfsyR2yVg+TBen2awq00iU54aMiQ1DPLxGWA=
  private key: (hidden)
  listening port: 10000

peer: sl23uUw0pdWO7vS/O6a7+ZBALLEPkf9jFEl8sviJsnY=
  preshared key: (hidden)
  endpoint: [2a01:4f8:c013:afbc::]:52845
  allowed ips: ::/0
  latest handshake: 59 seconds ago
  transfer: 2.00 KiB received, 1.43 KiB sent

# wg show all preshared-keys
rosenpass0  sl23uUw0pdWO7vS/O6a7+ZBALLEPkf9jFEl8sviJsnY=    2WlrMm+4c56xazoeewsEUmY9rnRhn1kKu9iAepoGCrg=
```

It is important that `rosenpass0` exists at all, has the right configured addresses on both hosts, and that the other peer is correctly shown in the WireGuard output.

For Rosenpass, it is important that the last column in the output of `wg show all preshared-keys` is the same on both hosts, as this is the key that is exchanged via Rosenpass and then inserted as preshared key into the WireGuard connection.

Finally, both machines must be able to reach each other:

``` console
$ ssh server "ping -c3 1:c:bad:c0de::2"
PING 1:c:bad:c0de::2 (1:c:bad:c0de::2) 56 data bytes
64 bytes from 1:c:bad:c0de::2: icmp_seq=1 ttl=64 time=1.12 ms
64 bytes from 1:c:bad:c0de::2: icmp_seq=2 ttl=64 time=1.33 ms
64 bytes from 1:c:bad:c0de::2: icmp_seq=3 ttl=64 time=1.13 ms

--- 1:c:bad:c0de::2 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 1.116/1.190/1.329/0.098 ms

$ ssh client "ping -c3 1:c:bad:c0de::1"
PING 1:c:bad:c0de::1 (1:c:bad:c0de::1) 56 data bytes
64 bytes from 1:c:bad:c0de::1: icmp_seq=1 ttl=64 time=1.03 ms
64 bytes from 1:c:bad:c0de::1: icmp_seq=2 ttl=64 time=1.40 ms
64 bytes from 1:c:bad:c0de::1: icmp_seq=3 ttl=64 time=1.97 ms

--- 1:c:bad:c0de::1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 1.027/1.466/1.969/0.387 ms
```

# Troubleshooting

## The `rosenpass0` device does not pop up

This is most likely an issue in the non-Rosenpass part of the configuration. Please have a look at the output of the command `systemctl status sytemd-network`. If for example file permissions of the keys are too restrictive, then this will manifest as error messages here.

## Rosenpass is not able to exchange keys

Even if the rosenpass0 device pops up, it still might be possible that Rosenpass observes errors during setup or connect. Please have a look at the output of the command `systemctl status rosenpass`. If for example file permissions of the keys are too restrictive, then this will manifest as error messages here.

# See also

- [WireGuard homepage](https://www.wireguard.com/)
- [Rosenpass homepage](https://rosenpass.eu/)
- WireGuard page in this Wiki: <a href="WireGuard" class="wikilink" title="WireGuard">WireGuard</a>
- [List of Rosenpass options supported by NixOS](https://search.nixos.org/options?query=rosenpass)
- [List of WireGuard options supported by NixOS](https://search.nixos.org/options?query=wireguard)

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
