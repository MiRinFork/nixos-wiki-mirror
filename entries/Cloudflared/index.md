<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cloudflared -->

[Cloudflared](https://github.com/cloudflare/cloudflared) is a command line client that can be used to establish a network tunnel from the Cloudflare network to a server.

## Cloudflare Tunnel

### Prerequisites

- A Cloudflare account
- A domain registered on Cloudflare (see <https://developers.cloudflare.com/fundamentals/manage-domains/add-site/>)

If you do not wish to install cloudflared you may use a nix-shell to use it for the following steps without adding it to your configuration.

``` console
$ nix-shell -p cloudflared
```

You will need to log in to your Cloudflare account through the command line, the following command will open a web browser to allow you to log in:

``` console
$ cloudflared tunnel login
```

You can use the link it provides on any machine that has a browser in order to get the needed cert.pem file.

Afterwards you will need to create the tunnel from the machine.

``` console
$ cloudflared tunnel create <tunnel-name-of-choice>
```

The command will output the tunnel ID in the format 00000000-0000-0000-0000-000000000000, which will be needed for setting up the tunnel service. The following example uses flakes and [sops-nix](https://github.com/Mic92/sops-nix) to hide the credentials file secret. You can now use the Cloudflare dashboard to add your public hosts.

#### Declarative igress

However, if you would instead like to do so in your configuration file you may specify ingress rules in your configuration file.Finally, create a CNAME record with the following command.

``` console
$ cloudflared tunnel route dns <your-tunnel> <your-public-domain>
```

## Troubleshooting

At the moment (2025), for support of browser rendering of the tunnels, this line is required:

``` nix
services.openssh.settings.Macs = [
  # Current defaults:
  "hmac-sha2-512-etm@openssh.com"
  "hmac-sha2-256-etm@openssh.com"
  "umac-128-etm@openssh.com"
  # Added:
  "hmac-sha2-256"
];
```

The issue has been reported on [Github](https://github.com/cloudflare/cloudflared/issues/1198)

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
