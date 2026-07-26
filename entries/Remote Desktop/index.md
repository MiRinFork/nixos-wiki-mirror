<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Remote Desktop -->

## Software

Remote desktop software is split into two types: servers and clients. To access a computer remotely, it must have a server running, which usually is exposed to a port or set thereof. Access to that server can be gained using a client; many protocols, like RDP, are open to all clients willing to support them. Others require specific clients, so consult the documentation for whichever service you choose to use.

## Server Protocols

- <a href="Wikipedia:VNC" class="wikilink" title="VNC">VNC</a>
- <a href="Wikipedia:Remote_Desktop_Protocol" class="wikilink" title="RDP">RDP</a>

## Self hosting

- <a href="RustDesk" class="wikilink" title="RustDesk">RustDesk</a> available in nixpkgs as [rustdesk-server](https://search.nixos.org/packages?query=rustdesk-server)

## Clients

- Apache Guacamole
- FreeRDP
- KRDC (KDE)
- Remmina
- TightVNC and its forks <a href="TigerVNC" class="wikilink" title="TigerVNC">TigerVNC</a> and TurboVNC
- x2goclient
- GNOME Connections
- <a href="RustDesk" class="wikilink" title="RustDesk">RustDesk</a>

## VNC

Most servers provide a `vncserver` command. Various servers provide configuration options either by CLI or by configuration file.

### Desktop session

To start a desktop session or window manager, one currently has to do this manually because servers still have hard-coded paths to `/usr/share/xsessions` to look for `.desktop` files. That means one has to write a script that starts the desktop session, window manager, or any other X application.

Some servers will automatically run `$HOME/.vnc/xstartup` but the more secure option is to write an executable script and run `vncserver -xstartup $pathToScript`.

An example script:

``` bash
#!/usr/bin/env bash

# set some env variables
# start window manager
exec icewm
```

`pathToScript` can also be a path to an executable like `${pkgs.icewm}/bin/icewm`.

### TigerVNC

Nixpkgs has a package but no service. The server component can be started using the `vncserver` command. To connect, use the `vncviewer` command.

For an automated nixos config see <a href="TigerVNC" class="wikilink" title="TigerVNC">TigerVNC</a>.

However, you'll more likely have success running [x11vnc](https://search.nixos.org/packages?channel=unstable&query=x11vnc&show=x11vnc) on the remote/far-away server, while only using `vncviewer` from the TigerVNC package from where you're sitting. Quality documentation for x11vnc usage is at its [official repository](https://github.com/LibVNC/x11vnc/?tab=readme-ov-file#readme).

### x2go

X2go client is packaged in nixos as `x2goclient`.

The server is installed by adding the following line:  
`services.x2goserver.enable = true;`  
to `/etc/nixos/configuration.nix`.

### Guacamole

#### Guacamole Server

In nixos the guacamole server component is provided by [guacamole-server](https://github.com/NixOS/nixpkgs/blob/nixos-24.05/nixos/modules/services/web-apps/guacamole-server.nix).

A basic server setup service entry would look like this:

``` nix
services.guacamole-server = {
    enable = true;
    host = "127.0.0.1";
    port = 4822;
    userMappingXml = ./user-mapping.xml;
};
```

This creates the `guacamole-server.service` systemd unit.

See the [NixOS Options search](https://search.nixos.org/options?type=packages&query=services.guacamole-server) for other configuration options.

The `host` entry indicates on which IP the server component listens. The `port` entry here is the default port of `4822`.

The `./user-mapping.xml` is a relative path to the file which declares the service. So if the service is in `/etc/nixos/configuration.nix` then in this example the file would reside at `/etc/nixos/user-mapping.xml`. Contents of the file are discussed below.

#### user-mapping.xml

The `user-mapping.xml` file is how to define the user(s) that are allowed to login to the webportal, as well as the connections available to the user.

The file content should look something like this:

The `password=""` can be a plain text password, but it is not recommended. An easy way to encrypt a password would be something like:

``` console
$ echo -n 'SUPERsecretPASSWORD' | openssl dgst -sha256
SHA2-256(stdin)= 491cf91d586fb9442db7efe92b7839190206a653971573c23fed0435ceb596e8
```

The [upstream documentation](https://guacamole.apache.org/doc/gug/configuring-guacamole.html#configuring-connections) has complete configuration options avaiable.

#### Guacamole Client

In nixos the guacamole client component is provided by the [guacamole-client](https://github.com/NixOS/nixpkgs/blob/nixos-24.05/nixos/modules/services/web-apps/guacamole-client.nix) component.

This is the part of the service that provides the webportal for end users.

A basic client setup service entry would look like this:

``` nix
services.guacamole-client = {
  enable = true;
  enableWebserver = true;
  settings = {
    guacd-port = 4822;
    guacd-hostname = "localhost";
  };
};
```

This creates a `tomcat.service` systemd unit.

See the [search.nixos options](https://search.nixos.org/options?type=packages&query=services.guacamole-client) for other configuration options.

The webportal this provides is served by the tomcat server, and listens on port `8080` by default. The `settings.guacd-port` tells the client software how to communicate with the guacamole-server component.

The [upstream documentation](https://guacamole.apache.org/doc/gug/configuring-guacamole.html#guacamole-properties) has the list of `guacamole.properties` options that can be provided for this setting.

At this point if you are intending to serve the webportal directly, then the service can be reached at the url [`http://`](http://)`<your-computer-ip:8080/guacamole`.

#### Reverse Proxy

If you want to use `nginx` as a reverse proxy in front of the webportal, then the below options can serve as an example setup.

This example has a virtual host available as [`https://remote.mydomain.net`](https://remote.mydomain.net). It uses the [nginx](https://search.nixos.org/options?type=packages&query=services.nginx) service, and [LetsEncrypt](https://letsencrypt.org/) for SSL. Configuration of a DNS domain and records is outside the scope of this document.

``` nix
services.nginx = {
  enable = true;
  upstreams."guacamole_server" = {
    extraConfig = ''
      keepalive 4;
    '';
    servers = {
      "127.0.0.1:8080" = { };
    };
};

virtualHosts."remote.mydomain.net" = {
  forceSSL = true; # redirect http to https
  enableACME = true;
  locations."/" = {
    extraConfig = ''
      proxy_buffering off;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $http_connection;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://guacamole_server/guacamole$request_uri;
      proxy_redirect http://guacamole_server/ https://$server_name/;
    '';
  };
      
# this sets up the letsencrypt service to get ssl certs for the above
security.acme = {
  acceptTerms = true;
  defaults.email = "your.email@server.name";
};    
```

The `upstreams."guacamole_server".servers` setting points the to IP:port where the `guacamole-client` webportal is hosted. In this example `nginx` and `guacamole` are on the same host.

The `virtualHosts."name".forceSSL` ensures requests sent to HTTP are redirected to HTTPS. The `enableACME` sets up LetsEncrypt and nginx to get and renew SSL certs.

The `proxy_buffering off;`, `proxy_set_header Upgrade $http_upgrade;`, and `proxy_set_header Connection $http_connection;` settings are required to prevent nginx from buffering traffic, which can prevent guacamole from operating properly.

The optional `proxy_pass `[`http://guacamole_server/guacamole$request_uri`](http://guacamole_server/guacamole$request_uri)`;` allows end users to access the service at [`https://remote.mydomain.net`](https://remote.mydomain.net) as opposed to [`https://remote.mydomain.net/guacamole`](https://remote.mydomain.net/guacamole).

See the [upstream documentation](https://guacamole.apache.org/doc/gug/reverse-proxy.html#) for more details and other proxy examples.

#### Firewall

In the case of the above reverse proxy example, the correct firewall ports will also need to be opened on the server hosting the `nginx` proxy.

``` nix
networking.firewall = {
  enable = true;
  allowedTCPPorts = [
    80 # http
    443 # https
    8080 # guacamole
    4822 # guacamole
  ];
};                                        
```

For any systems that will be reached from the guacamole service, the corresponding ports will need to be opened. The below example opens ports that match the connection settings in the above `user-mapping.xml`.

``` nix
networking.firewall = {
  enable = true;
  allowedTCPPorts = [
    3389 # rdp
  ];
};                                        
```

#### References

[The original package request has good discussions as well](https://github.com/NixOS/nixpkgs/issues/17879)

## RDP

### XRDP

![GNOME running in an XRDP shell in Remmina.](Screenshot_from_2024-03-02_03-15-05.png "GNOME running in an XRDP shell in Remmina.") NixOS has first-class support for XRDP. Client-wise, RDP can be accessed in many ways, but `remmina` and `freerdp` support it natively.

All of the options for the `xrdp` service can be viewed through the [NixOS Options search](https://search.nixos.org/options?query=xrdp), though an example setup inside of `configuration.nix` is provided below:

``` nix
services.xserver = {
  enable = true;
  displayManager.sddm.enable = true;
  desktopManager.plasma5.enable = true;
};

services.xrdp = {
  enable = true;
  defaultWindowManager = "startplasma-x11";
  openFirewall = true;
};
```

(Source: [Discourse Link](https://discourse.nixos.org/t/please-post-working-xrdp-setting-in-configuration-nix/7404/10), [nixpkgs code](https://github.com/NixOS/nixpkgs/blob/86a80807d8d7051c63ab2b9d7f630abe066468b1/nixos/modules/services/networking/xrdp.nix))

A different window manager can be used for XRDP than a machine user, provided it has been enabled (through NixOS `services` or `nixpkgs`.

Make sure you log out the visual user first on the remote machine, otherwise you'll get a black screen. (Source: [Reddit](https://www.reddit.com/r/Proxmox/comments/hxp28j/black_screen_in_microsoft_remote_desktop_noob/fzm7zbo/)). You may be able to work around this by enabling and configuring <a href="Polkit" class="wikilink" title="Polkit">Polkit</a>, as demonstrated on that page.

#### XRDP with Gnome 48 and higher

``` nix

services.xrdp.enable = true;
services.xrdp.defaultWindowManager = "${pkgs.gnome-session}/bin/gnome-session"; # gnome wayland session
services.gnome.gnome-remote-desktop.enable = true; # needs gnome-remote-desktop backend to work!!
services.displayManager.autoLogin.enable = false;
services.getty.autologinUser = null;
networking.firewall.allowedTCPPorts = [ 3389 ];
```

#### XRDP under Hyper-V with enhanced session mode

If you want to use enhanced session mode in VMConnect while using Hyper-V for a NixOS VM, you need to specify some additional options:

``` nix
programs.fuse.enable = true;

services = {
  xrdp = {
    defaultWindowManager = "${pkgs.i3}/bin/i3";
    enable = true;
    extraConfDirCommands = ''
      substituteInPlace $out/xrdp.ini \
        --replace-fail 'port=3389' 'port=vsock://-1:3389' \
        --replace-fail '#vmconnect=true' 'vmconnect=true' \
        --replace-fail 'security_layer=negotiate' 'security_layer=rdp' \
        --replace-fail 'crypt_level=high' 'crypt_level=none' \
        --replace-fail 'bitmap_compression=true' 'bitmap_compression=false'
    '';
  };
};

systemd.services.xrdp.serviceConfig.ExecStart = lib.mkForce "${pkgs.xrdp}/bin/xrdp --nodaemon --config /etc/xrdp/xrdp.ini";

virtualisation.hypervGuest.enable = true;
```

As documented in [this issue](https://github.com/nixos/nixpkgs/issues/304855), the current behavior of the XRDP module in NixOS is to provide the `--port` parameter on the CLI in the systemD unit file. It does print a message indicating it's ignoring anything provided in the configuration saying `--port parameter found, ini override` in journalctl.

If in doubt, you can always run `ss --vsock -l`. If nothing shows up, then XRDP isn't listening where it should be and something about the above has changed.

Enabling fuse allows you to configure drive redirection in VMConnect and any drives selected will appear under `~/thinclient_drives` by default. Without enabling this programs option, you will receive a command not found error in `~/.local/share/xrdp/xrdp-chansrv.*.log` related to fusermount3.

### GNOME RDP

To enable the built in gnome-rdp, setting `services.gnome.gnome-remote-desktop.enable = true;` is not enough by itself. This installs the systemd unit but the unit does not start automatically at boot. As a consequence the 'Remote Desktop' configuration option is also not available in 'System' tab of the 'Settings' app.

To fix this we need to enable and start the systemd unit at boot using `wantedBy = [ "graphical.target" ];` as shown below:

``` nix
services.gnome.gnome-remote-desktop.enable = true;
systemd.services.gnome-remote-desktop = { 
  wantedBy = [ "graphical.target" ]; # for starting the unit automatically at boot
};
services.displayManager.autoLogin.enable = false;
networking.firewall.allowedTCPPorts = [ 3389 ];
```

### Meshcentral

Meshcentral is a self-hosted open source administration tool similar to teamviewer. It can be added with:

`services.meshcentral.enable = true;`

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
