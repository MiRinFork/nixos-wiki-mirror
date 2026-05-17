<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Node-red -->

## Node-red

[Node-red](https://nodered.org/) describeds itself as a "Low-code programming for event-driven applications", where you can connect nodes (that you can possibly obtain directly from a large list of npm packages) to automatize many different tasks.

### Standalone run

You can simply install and run the application locally like:

``` bash
$ nix-shell -p node-red
$ node-red
… http://127.0.0.1:1880/
…
```

and you will see the address of the website that is loaded in the log, typically <http://127.0.0.1:1880/>. Just open the link, and start to use node-red (you may also want to check the command line options of node-red to configure it further). Note that if you want to imperatively install new nodes, you may need to enable <a href="nix-ld" class="wikilink" title="nix-ld">nix-ld</a> if you run NixOS.

### As a publicly accessible website

If you want to configure it as a permanent, always active service, on your own computer, you can configure the module. Below, we describe a more advanced usecase where you also want to make the service available online, behind an <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> server in charge of configuring automatically the https certificate.

``` nix
{ lib, pkgs, config, ... }:
let
  cfg = config.services.node-red;
in
{
  services.nginx = {
    virtualHosts."YOURDOMAIN.com" = {
      forceSSL = true; # Enable and force https
      enableACME = true; # Automatically get a Let's Encrypt certificate 
      locations."/" = {
        proxyPass = "http://localhost:${toString cfg.port}";
        # This fixes WS errors, inspired by
        # https://github.com/meeki007/node-red-server-howto-guide/blob/master/README.md
        extraConfig = ''
          #Defines the HTTP protocol version for proxying by default it it set to 1.0.
          #For Websockets and keepalive connections you need to use the version 1.1
          proxy_http_version  1.1;
          
          #Sets conditions under which the response will not be taken from a cache.
          proxy_cache_bypass  $http_upgrade;
          
          #These header fields are required if your application is using Websockets
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
          
          #The $host variable in the following order of precedence contains:
          #hostname from the request line, or hostname from the Host request header field
          #or the server name matching a request.
          proxy_set_header Host $host;
          
          #Forwards the real visitor remote IP address to the proxied server
          proxy_set_header X-Real-IP $remote_addr;
          
          #A list containing the IP addresses of every server the client has been proxied through
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          
          #When used inside an HTTPS server block, each HTTP response from the proxied server is rewritten to HTTPS.
          proxy_set_header X-Forwarded-Proto $scheme;
          
          #Defines the original host requested by the client.
          proxy_set_header X-Forwarded-Host $host;
          
          #Defines the original port requested by the client.
          proxy_set_header X-Forwarded-Port $server_port;      
        '';
      };
    };
  };
  
  services.node-red = {
    enable = true;
    # Do NOT open this port, nginx will automatically forward to it
    port = 1880;
    withNpmAndGcc = true; # Allow imperative download of nodes. Need to enable nix-ld, see below
    # I just downloaded the file from
    # https://github.com/node-red/node-red/blob/master/packages/node_modules/node-red/settings.js
    # and I added for instance a user in the configuration, changed the
    # contextStorage, and enabled project. I can't use "define" (that uses -D)
    # since for what I know it does not support nested lists of users, and is also less
    # practical than uncommenting a config file.
    configFile = ./node-red-settings.js;
  };

  # If you want to imperatively install most npm packages, you will need nix-ld since npm is typically
  # not very pure (to say the least)
  programs.nix-ld.enable = true;
  systemd.services.node-red = {
    path = with pkgs; [
      # git is needed for projects, but systemd resets the path so we need to add it back
      git
      # needed by nodejs to install for instance node-red-dashboard (or "error syscall spawn sh")
      bash
      # Add here any other program needed by the npm packages you want to install
    ];
    environment = {
      # environment variables are removed, so we need to specify nix-ld environment here
      NIX_LD = lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker";
      NIX_LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [
        # List by default
        zlib
        zstd
        stdenv.cc.cc
        curl
        openssl
        attr
        libssh
        bzip2
        libxml2
        acl
        libsodium
        util-linux
        xz
        systemd
      ];
    };
  };
  
}
```
