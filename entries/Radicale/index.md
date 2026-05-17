<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Radicale -->

Radicale is a Free and Open-Source CalDAV (calendars, todo-lists) and CardDAV (contacts) Server. For more information about Radicale itself, see <https://radicale.org/>.

This basic configuration will run the server. Note that you might want to allow the port (5232 in this case) on your [firewall](https://nixos.org/nixos/manual/index.html#sec-firewall).

``` nix
services.radicale = {
  enable = true;
  settings.server.hosts = [ "0.0.0.0:5232" ];
};
```

The `settings` is standard Radicale configuration, see <https://radicale.org/v3.html#configuration>.

## Authentication

The default authentication mode is `None` which just allows all usernames and passwords. The other option is to use an Apache htpasswd file for authentication.

``` nix
services.radicale = {
  enable = true;
  settings = {
    server.hosts = [ "0.0.0.0:5232" ];
    auth = {
      type = "htpasswd";
      htpasswd_filename = "/path/to/htpasswd/file/radicale_users";
      # hash function used for passwords. May be `plain` if you don't want to hash the passwords
      htpasswd_encryption = "bcrypt";
    };
  };
};
```

## Web Proxy examples

Caddy configured to proxy radicale in a subdirectory

``` nix
caddy = {
  enable = true;
  extraConfig = ''
    :80 {
      redir /radicale /radicale/
      handle /radicale/* {
        uri strip_prefix /radicale
        reverse_proxy localhost:5232 {
          header_up X-Script-Name /radicale
          header_up Authorization {header.Authorization}
        }
      }
    }
  '';
}
```

Nginx virtualhost location snippet configured to proxy radicale in a subdirectory

``` nix
locations."/radicale/" = {
  proxyPass = "http://127.0.0.1:5232/";
  extraConfig = ''
    proxy_set_header X-Script-Name /radicale;
    proxy_pass_header Authorization;
  '';
};
```

## See also

- [Source code of the service](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/networking/radicale.nix)
- [List of Radicale options supported by NixOS](https://search.nixos.org/options?query=services.radicale)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
