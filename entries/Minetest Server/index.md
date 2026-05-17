<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Minetest Server -->

[Luanti](https://www.luanti.org/) (formerly Minetest) is a voxel game engine than allows for many different games to be played.

## Minetest Server Setup

Below is a basic configuration that will setup the Minetest server and use port 30000.

``` nix
{
 services.minetest-server = {
   enable = true;
   port = 30000;
 };
}
```

With this setup, a user named will be created, along with its home folder '/var/lib/minetest'. All standard Minetest configuration and world files are stored in .

The Minetest service will be started after running nixos-rebuild. It can be controlled using `systemctl`

``` nix
systemctl start minetest-server.service
systemctl stop minetest-server.service
```

Additional options can be found in the NixOS options [search](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&query=minetest-server)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
