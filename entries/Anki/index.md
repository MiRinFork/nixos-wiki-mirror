<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Anki -->

Anki is a spaced repetition system (SRS) commonly used to learn new languages. Information is placed on individual flashcards, which are sorted into decks. Anki is extensible using <a href="Python" class="wikilink" title="Python">Python</a> addons.

In addition to the desktop software, Anki has an iOS app, Android app, and web interface available. Decks/flashcards can be synced using a self hosted instance of `anki-sync-server` or an AnkiWeb account.

## Installation

`anki` is recommended over `anki-bin`, due to `anki-bin` being out of date (at the time of writing). Using old versions of `anki-bin` may lead to decks being incompatible with newer versions.

NixOS  

nix-shell  

``` console
$ nix-shell -p anki
```

## Installing Addons

Additional addons can be installed using the following syntax:

NixOS  

Note that as of writing, `anki-bin` does not support installing addons in this way.

### Configuring Addons

Addons can be configured using `.withConfig`:

NixOS  

## Self Hosting

You can self host an instance of anki-sync-server via the NixOS module. The default port for this service is 27701. The most simplest setup for it you can have is like below:

NixOS  

``` nix
services.anki-sync-server = {
  enable = true;
  address = "0.0.0.0";
  openFirewall = true;
  users = [
    {
       username = "bob";
       password = "password";
    }
  ];
};
```

You would then access the self hosted instance by changing it on the anki app you're using, but make sure to write as [`http://ReplaceLocalIPHere:27701/`](http://ReplaceLocalIPHere:27701/) it is necessary to have the `/` at the end on the clients. After doing that, attempt to sync and when asked for log in details do, in this case `bob` as the email address and `password` as the password and it will work. Note: This does let anyone on your local network access your anki-sync-server instance and it is exposed under http. It also exposes your password in plain text on the server. A better recommendation is to use the `passwordFile` option.

### Reverse Proxy

You can reverse proxy anki-sync-server to make sure it's running under a https connection and in order to restrict it more to your vpn of choice. A complete setup for that using caddy as the reverse proxy would be:

NixOS  

``` nix
services.anki-sync-server = {
  enable = true;
  address = "127.0.0.1";
  users = [
    {
      username = "bob";
      password = "password";
    }
  ];
};
services.caddy.virtualHosts."anki.custom.domain".extraConfig = ''
  reverse_proxy ${config.services.anki-sync-server.address}:${builtins.toString config.services.anki-sync-server.port}
'';
```

Then to access that on your anki clients, you change the sync server to [`https://anki.custom.domain/`](https://anki.custom.domain/) that end `/` is important in order to get the clients working properly. Then you would log in with the "email address" as `bob` and the password as `password` Note: It is still recommended to use the `passwordFile` option over the plain text `password` option as the latter option stores it in plain text in the nix store on the server.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
