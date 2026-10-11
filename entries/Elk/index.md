<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Elk -->

[Elk](https://github.com/elk-zone/elk) is a modern web client for Mastodon.

### Setup

To enable Elk, add following part to your system configuration.

``` nix
services.elk.enable = true;
```

After that Elk will be reachable at <http://localhost:3000> .

### Configuration

Lock Elk instance to a specific public Mastodon server.

``` nix
elk = {
  settings = {
    NUXT_PUBLIC_DEFAULT_SERVER = "gotosocial.project-insanity.org";
    NUXT_PUBLIC_SINGLE_INSTANCE = "true";
  };
};
```

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
