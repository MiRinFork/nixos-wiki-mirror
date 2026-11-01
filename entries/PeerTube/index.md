<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PeerTube -->

[PeerTube](https://joinpeertube.org) is a web application to host, browse and share uploaded videos via P2P in a federated network.

NixOS options to setup PeerTube as a service can be found here: [PeerTube Options](https://search.nixos.org/options?query=services.peertube&type=options)

## Installation

Following example code initializes a simple PeerTube instance

After rebuilding your system, open <http://peertube.local:9000> in your browser to access PeerTube. The default administrator username is `root`. The initial password will be logged into the system journal, see the output of `journalctl -u peertube | grep "root" -A 2`.

The generated config lives at: `/var/lib/peertube/config/production.json`.

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
