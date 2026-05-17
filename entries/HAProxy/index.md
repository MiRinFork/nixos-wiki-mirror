<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: HAProxy -->

[HAProxy](https://www.haproxy.com) is an open-source software tool used for load balancing and proxying TCP and HTTP applications. It helps manage incoming traffic by distributing it across multiple servers, enhancing both reliability and scalability. Key features include health checks, session persistence, and SSL termination, making it a practical choice for handling web service traffic effectively.

### Setup

The following example configures HAProxy to forward all incoming SMTP mail traffic to an internal mail server on `10.250.0.8` and `fdc9:281f:4d7:9ee9::8`.The `send-proxy` option enables Proxy Protocol which is useful in combination with mail servers such <a href="Stalwart" class="wikilink" title="Stalwart">Stalwart</a>.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
