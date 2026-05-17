<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Packettracer -->

[Packettracer](https://www.netacad.com/courses/packet-tracer) is a network simulation software. The tool from Cisco is suitable, for example, for training as an IT specialist to learn how to deal with networks and, in particular, how to behave in the event of problems. A free and open source alternative would be <a href="GNS3" class="wikilink" title="GNS3">GNS3</a>

## Installation

You need to enable <a href="Unfree_software" class="wikilink" title="unfree">unfree</a> and prefetch the `.deb` file from Packettracer before you are able to installing it. The Package is allready [available](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=packettracer) for Nix. Other Unix/Linux Distros with Nix installed can installing it on their system aswell.

``` console
 $nix-store --add-fixed sha256 CiscoPacketTracer_"version"_Ubuntu_64bit.deb
 # or with
 $nix-prefetch-url --type sha256 file:///path/to/CiscoPacketTracer_"version"_Ubuntu_64bit.deb
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
