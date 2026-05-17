<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: QuakeJS -->

[QuakeJS](http://www.quakejs.com/) is a browser-based port of **Quake III Arena**, enabling players to enjoy the classic shooter directly in their web browsers. It uses WebAssembly and WebGL to deliver the original gameplay experience without additional software.

## Run the game

The game can be run by opening it in a web browser and accepting persistent storage of the game files.

## Setup of a dedicated server

Following example configuration will enable QuakeJS for the domain`http://quakejs.example.org`:

``` nix
services.quakejs = {
  enable = true;
  hostname = "quakejs.example.org";
  eula = true;
  openFirewall = true;
  dedicated-server.enable = true;
};
```

Join your own dedicated server using the url: `http://quakejs.example.org/play?connect%20192.0.2.0:27960, where` 192.0.2.0 `is the public IP of your dedicated server.`

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
