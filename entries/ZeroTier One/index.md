<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ZeroTier One -->

[ZeroTierOne](https://github.com/zerotier/ZeroTierOne) is the open source ethernet switch for the ZeroTier network. It is a way to connect devices over private networks anywhere in the world. Its done by creating a network and then joining two or more devices to that network.

## Example config

``` nixos
services.zerotierone = {
  enable = true;
  joinNetworks = [
    "6465f4ee45356976"
    "71e441cc137b93c8"
  ];
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
