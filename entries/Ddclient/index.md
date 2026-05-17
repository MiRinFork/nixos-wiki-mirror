<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ddclient -->

[Ddclient](https://github.com/ddclient/ddclient) is a program that can dynamically update your <a href="wikipedia:Domain_Name_System" class="wikilink" title="DNS">DNS</a> records for a variety of providers. This is helpful if you're hosting a server without a static IP address.

## Installation & Configuration

Below is an example configuration to dynamically update your records in [Cloudflare DNS](https://www.cloudflare.com/application-services/products/dns/)

may be set to a time of your choosing, check your DNS provider's documentation to ensure that you aren't sending requests too frequently. For formatting, run `man 7 systemd.time` or reference the [online man pages](https://man7.org/linux/man-pages/man7/systemd.time.7.html).

### Using Your DNS Provider

For more in depth info on using ddclient for a specific DNS provider visit the [ddclient documentation](https://ddclient.net/protocols.html). If your provider isn't listed there try searching for the name of your DNS provider in the [ddclient source code](https://github.com/ddclient/ddclient/blob/main/ddclient.in). Modify the above configuration with the relevant , , , , and from the documentation or source code.

#### Cloudflare

This excerpt of [ddclient.in](https://github.com/ddclient/ddclient/blob/main/ddclient.in) describes the specific options needed for Cloudflare. Reference the above nix configuration to understand the mapping between the ddclient config and the Nix config.

## Troubleshooting

Adding to your ddclient config will enable debug logs on the <a href="systemd" class="wikilink" title="systemd">systemd</a> unit. The debug logs can help verify that the client is able to reach your DNS provider even if it doesn't need to change the DNS records.

## References

1.  [ddclient source code](https://github.com/ddclient/ddclient)
2.  [ddclient documentation](https://ddclient.net/)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
