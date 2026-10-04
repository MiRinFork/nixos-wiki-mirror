<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Knot -->

[Knot DNS](https://www.knot-dns.cz/) is a high-performance authoritative-only DNS server which supports all key features of the modern domain name system.

## Example

Below is a example setup for a public authoritive DNS server setup with two hosts.

### Generating a TSIG-Key

`keymgr -t tsig_ns`

Save this to both servers to the path in keyFiles.

### Example directory setup

    /etc/nixos/
    ├─ zones/
    │  ├─ example.com.zone
    ├─ configuration.nix

### Shared config

### Primary server:

### Secondary server

## See also

- <https://nohup.no/posts/knot-dns-on-nixos/>
- <https://git.darmstadt.ccc.de/ffda/infra/nixos-config/-/tree/610ac16c150ed8b8f65ec6cd9150c2856e24d22d/config/roles/dns>
- <https://www.knot-dns.cz/docs/latest/html/>
