<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Umami -->

[Umami](https://github.com/umami-software/umami) is a modern, privacy-focused analytics platform. An open-source alternative to Google Analytics, Mixpanel and Amplitude.

## Setup

For a local testing setup of Umami, following configuration can be used.

``` nix
environment.etc."umami-secret".text = "3f9b4e6a7c1d2f8a9b0c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5";
services.umami = {
  enable = true;
  settings.APP_SECRET_FILE = "/etc/umami-secret";
};
```

Ensure to generate a new and strong secret in a production environment.

After applying the configuration, Umami will be available at <http://localhost:3000>. The default login is user `admin` with password `umami`.

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
