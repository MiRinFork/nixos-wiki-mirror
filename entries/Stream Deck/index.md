<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Stream Deck -->

## Stream Deck UI

You can use [**streamdeck-linux-gui**](https://streamdeck-linux-gui.github.io/streamdeck-linux-gui/) (also called **streamdeck-ui**) to control Elgato Stream Deck devices.

To ensure udev rules are correctly enabled, use `programs.streamdeck-ui` to enable the application:

``` nix
{
  programs.streamdeck-ui = {
    enable = true;
    autoStart = true; # optional
  };
}
```

Alternatively you can use [**streamcontroller**](https://github.com/StreamController/StreamController), a more modern solution to control your Elgato Stream Deck.

To install the streamcontroller package you simply put it in your environment packages:

``` nix
{
  environment.systemPackages = [ 
    pkgs.streamcontroller 
  ];
}
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
