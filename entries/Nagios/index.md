<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nagios -->

Nagios is a monitoring daemon. It comprises the daemon itself, and a web interface.

### Daemon configuration

The simplest way of having the Nagios daemon run is to write its configuration in a `main.cfg` alongside `configuration.nix` in `/etc/nixos`.

Then

Nagios configuration files contain a lot of boilerplate, it is possible to reuse some of the default configuration files. For example to reuse `templates.cfg`, `timeperiods.cfg` and `commands.cfg`:

``` nix
{
    services.nagios.objectDefs =
      (map (x: "${pkgs.nagios}/etc/objects/${x}.cfg") [ "templates" "timeperiods" "commands" ]) ++
      [ ./main.cfg ];
}
```

To enable verbose logging into `/var/log/nagios/debug.log`:

``` nix
{
    services.nagios.extraConfig = {
        debug_level = "-1";
        debug_file = "/var/log/nagios/debug.log";
     };
}
```

### Web interface

The NixOS module for Nagios does not automatically configure the web interface for your favorite web server. The section below describes a possible configuration for <a href="Nginx" class="wikilink" title="Nginx">Nginx</a>.

The web interface does not handle authentication; instead it is delegated to the web server. We will use HTTP basic authentication. This is only safe over HTTPS, of course. You need to create a htpasswd file readable by the nginx user only:

Now a possible configuration looks like this:

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
