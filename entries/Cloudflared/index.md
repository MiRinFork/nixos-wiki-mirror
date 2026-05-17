<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cloudflared -->

[Cloudflared](https://github.com/cloudflare/cloudflared) is a command line client for a network tunnel from the cloudflare network to a server.

Introduced in <https://github.com/NixOS/nixpkgs/pull/171875>

## Example

To get credentialsFile (e.g. tunnel-ID.json) do:

``` sh
cloudflared tunnel login <the-token-you-see-in-dashboard>
cloudflared tunnel create ConvenientTunnelName
```

``` nix
{
  services.cloudflared = {
    enable = true;
    tunnels = {
      "00000000-0000-0000-0000-000000000000" = {
        credentialsFile = "${config.sops.secrets.cloudflared-creds.path}";
        default = "http_status:404";
      };
    };
  };
}
```

Then you can use dashboard to add your public hosts (will need to convert the new tunnel to dashboard-managed).

Alternatively, save the `cert.pem` to cloudflared user's %home%/.cloudflared/cert.pem, and instead of using dashboard specify ingress rules in your configuration.nix like this:

``` nix
{
  services.cloudflared = {
    enable = true;
    tunnels = {
      "00000000-0000-0000-0000-000000000000" = {
        credentialsFile = "${config.sops.secrets.cloudflared-creds.path}";
        ingress = {
          "*.domain1.com" = {
            service = "http://localhost:80";
            path = "/*.(jpg|png|css|js)";
          };
          "*.domain2.com" = "http://localhost:80";
        };
        default = "http_status:404";
      };
    };
  };
}
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
