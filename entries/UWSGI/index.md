<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: UWSGI -->

[uWSGI](https://github.com/unbit/uwsgi) web application server for different programming languages such as Python, Perl or Ruby. Implementing the WSGI-protocol.

## Setup

Following example configuration illustrates how to serve the Python web app <a href="Oncall" class="wikilink" title="Oncall">Oncall</a> usgin the uWSGI module

``` nix
services.uwsgi = {
  enable = true;
  plugins = [ "python3" ];
  instance = {
    type = "emperor";
    vassals = {
      oncall = {
        type = "normal";
        env = [
          "PYTHONPATH=${pkgs.oncall.pythonPath}"
          "STATIC_ROOT=/var/lib/oncall"
        ];
        module = "oncall.app:get_wsgi_app()";
        socket = "${config.services.uwsgi.runDir}/oncall.sock";
        socketGroup = "nginx";
        immediate-gid = "nginx";
        chmod-socket = "770";
        pyargv = "${pkgs.oncall}/share/configs/config.yaml";
        buffer-size = 32768;
      };
    };
  };
};

services.nginx = {
  enable = lib.mkDefault true;
  virtualHosts."localhost".locations = {
    "/".extraConfig = "uwsgi_pass unix://${config.services.uwsgi.runDir}/oncall.sock;";
  };
};
```

The application will be available on `http://localhost`.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
