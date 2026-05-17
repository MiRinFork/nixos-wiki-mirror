<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ZNC -->

[ZNC](https://znc.in/) is an [IRC](https://en.wikipedia.org/wiki/Internet_Relay_Chat) bouncer: it stays connected to IRC networks so clients can disconnect without missing messages or losing the session.

Start with the following:

``` nix
services.znc = {
  enable = true;
  mutable = false; # Overwrite configuration set by ZNC from the web and chat interfaces.
  useLegacyConfig = false; # Turn off services.znc.confOptions and their defaults.
  openFirewall = true; # ZNC uses TCP port 5000 by default.
};
```

And use `services.znc.config` to configure ZNC as described in [Configuration](https://wiki.znc.in/Configuration) on the ZNC wiki.

## Clients

Choose a password, and extract a hash with:

``` bash
$ nix-shell --packages znc --command "znc --makepass"
```

Then, in `configuration.nix`:

``` nix
services.znc.config = {
  LoadModule = [ "adminlog" ]; # Write access logs to ~znc/moddata/adminlog/znc.log. 
  User.bob = {
    Admin = true;
    Pass.password = {
      Method = "sha256"; # Fill out this section
      Hash = "...";      # with the generated hash.
      Salt = "...";
    };
  };
};
```

SSL is enabled by default and a self-signed certificate is generated to `~znc/znc.pem`. A fingerprint can be extracted with:

``` bash
cat ~znc/znc.pem | openssl x509 -sha512 -fingerprint -noout | tr -d ':' | tr 'A-Z' 'a-z' | cut -d = -f 2
```

Next, see [Connecting](https://wiki.znc.in/Connecting_to_ZNC) and [Category:Clients](https://wiki.znc.in/Category:Clients) on the ZNC wiki.

## Networks

SASL authentication is not yet supported from `configuration.nix`. Either `/msg *sasl` [^1] or use NickServ instead as shown below.

``` nix
service.znc.config.User.bob = {
  Network.freenode = {
    Server = "chat.freenode.net +6697";
    Chan = { "#nixos" = {}; "#nixos-wiki" = {}; };
    Nick = "bob";                             # Supply your password as an argument
    LoadModule = [ "nickserv yourpassword" ]; # <- to the nickserv module here.
    JoinDelay = 2; # Avoid joining channels before authenticating.
  };
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>

[^1]: See [Sasl](https://wiki.znc.in/Sasl) on the ZNC wiki.
