<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: GoToSocial -->

[GoToSocial](https://gotosocial.org/) is an ActivityPub social network server.

## Setup

Minimal configuration example.

``` nix
services.gotosocial = {
  enable = true;
  setupPostgresqlDB = true;
  settings = {
    application-name = "My GoToSocial";
    host = "gotosocial.example.com";
    protocol = "https";
    bind-address = "127.0.0.1";
    port = 8080;
  };
};
```

## See also

- Upstream documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-gotosocial).

<a href="Category:ActivityPub" class="wikilink" title="Category:ActivityPub">Category:ActivityPub</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
