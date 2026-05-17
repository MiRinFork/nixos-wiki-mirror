<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Pocketbase -->

[Pocketbase](https://pocketbase.io/) is a realtime backend, meant as an alternative to Firebase and Supabase.

## Example config

The following setup is based on recommendations from <https://pocketbase.io/docs/going-to-production/>

``` nixos
systemd.services.pocketbase = {
  script = "${pkgs.pocketbase}/bin/pocketbase serve --encryptionEnv=PB_ENCRYPTION_KEY --dir /path/to/pb_data";
  serviceConfig = {
    LimitNOFILE = 4096;
    EnvironmentFile = ["/path/to/secret"];
  };
  wantedBy = [ "multi-user.target" ];
};

# You can replace caddy with another reverse proxy (or none, albeit generally not recommended) if wanted
services.caddy = {
  enable = true;
  virtualHosts = {
    "pocketbase.example.com".extraConfig = ''
      request_body {
        max_size 10MB
      }
      reverse_proxy 127.0.0.1:8090 {
          transport http {
              read_timeout 360s
          }
      }
    '';
  };
};
```

Then, at **/path/to/secret**

``` numberLines
PB_ENCRYPTION_KEY=32_CHARACTER_STRING
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Database" class="wikilink" title="Category:Database">Category:Database</a>
