<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Luanti -->

[Luanti](https://www.luanti.org/) (formerly Minetest) is an open-source voxel-based game engine focused on modding.

## Minetest server

Below is a basic configuration that will host a Minetest server on port 30000:

``` nix
{
 services.minetest-server = {
   enable = true;
   port = 30000;
 };
}
```

With this configuration, a user named will be created, along with its home folder . All default Minetest configuration and world files are stored in .

The Minetest service will be started after running nixos-rebuild. It can be controlled using systemctl:

``` nix
systemctl start minetest-server.service
systemctl stop minetest-server.service
```

Additional options can be found in the NixOS options [search](https://search.nixos.org/options?channel=unstable&query=minetest&type=options)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
