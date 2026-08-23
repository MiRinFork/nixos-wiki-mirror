<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dynamic DNS -->

[Dynamic DNS](https://en.wikipedia.org/wiki/Dynamic_DNS) (DDNS) is a method that automatically updates name server records with current information such as hostnames and IP addresses. This is particularly useful for users hosting services on a home network with a dynamic public IP address, which can change over time due to ISP policies or network restarts.

By using DDNS, users can maintain consistent access to their services over the internet via a fixed domain name, even as their IP address changes. The DDNS client software or service detects IP changes and promptly updates the DNS records to ensure reliable remote connectivity.

There are [many](https://wiki.archlinux.org/title/Dynamic_DNS) options to choose from, some are provider specific.

## Configuration example

One easy way to setup DNS updater is [ddns-updater](https://github.com/qdm12/ddns-updater). It may be configured like so:

Where `CONFIG_FILEPATH` should correspond to the location of your config.json file.

The following is an example for the provider [Porkbun](https://porkbun.com). Consult the documentation of your DNS provider for proper formatting and make sure to enable API access if needed.

You can verify proper operation using `journalctl -u ddns-updater.service`. Note that previous manual DNS entries might not be overwritten using this tool and need to be deleted first.

## Troubleshooting

If you run into issues with IP addresses not updating, stale cache may be at fault. Depending on your setup, `sudo systemd-resolve --flush-caches` or `sudo systemctl restart dnsmasq` followed by `sudo systemctl restart ddns-updater` might solve this.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
