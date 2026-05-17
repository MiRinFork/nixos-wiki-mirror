<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SSL Certificates -->

TLS/SSL Certificates, also called <a href="wikipedia:Public_key_certificate" class="wikilink" title="public key certificates">public key certificates</a>, are files that verify the authenticity of a website or other online entity. They contain the public key of the certificate holder and are issued by trusted certificate authorities to enable secure, encrypted communications between clients and servers.

## Obtain new certificates

See <a href="ACME" class="wikilink" title="ACME">ACME</a>.

## Installation

To add additional trusted root certificates, use one or both of the following options:

``` nix
security.pki.certificates = [ "<insert_certificate_text_here>" ];

security.pki.certificateFiles = [
  /path/to/cert1
  /path/to/cert2
];
```

The first option is a list of strings, whereas the second is a list of filesystem paths.

<a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
