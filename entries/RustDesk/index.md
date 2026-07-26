<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RustDesk -->

[RustDesk](https://rustdesk.com) is a remote desktop remote maintenance software. It can be used with the official server as well as with a self-hosted server (better confidentiality and availability). Open source client and server are included in nixpkgs. RustDesk offers an improved server for self-hosting in the rental model (not included in nixpkgs).

# Client

There are two versions of the client available [rustdesk](https://search.nixos.org/packages?channel=26.05&query=rustdesk) (deprecated) and [rustdesk-flutter](https://search.nixos.org/packages?channel=26.05&query=rustdesk) (more recent). They do not need any changes in the configuration to be used with the official server.

To use the client with a custom server, it is necessary to change in the network preferences (burger menu --\> network):

    ID-Server: [enter IP or domain name of server]
    Relay-Server: [Enter IP or domain name of server]
    API-Server:  [leave blank]
    Key: [Copy the content from /var/lib/private/rustdesk/id_ed25519.pub]

Installing rustdesk (even though version number might be higher) on Wayland can lead to error `"failed to create capturer for display 0"`, while rustdesk-flutter on the same PC can work fine.

# Server

There are only a few options necessary to run a RustDesk server:

``` nixos
services.rustdesk-server = {
  enable = true;
  openFirewall = true;
  signal.relayHosts = ["example.com"];
};
```

The key is stored at: /var/lib/private/rustdesk/id_ed25519.pub

[Some settings may only be set via ENV variables](https://github.com/rustdesk/rustdesk-server/tree/235a3c326ceb665e941edb50ab79faa1208f7507#env-variables) like this:

``` nixos
systemd.services.rustdesk-signal.environment.ALWAYS_USE_RELAY = "Y";
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
