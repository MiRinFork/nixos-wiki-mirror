<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RSSHub -->

[RSSHub](https://rsshub.app) is an open-source RSS feed generator that can produce RSS and Atom feeds from virtually any website or service, including platforms that do not natively support RSS.

## Setup

Enable the service by adding the following to your NixOS configuration:

``` nix
services.rsshub.enable = true;
```

After rebuild, RSSHub will be available at `http://localhost:1200`

## See also

- [RSSHub documentation](https://docs.rsshub.app)
