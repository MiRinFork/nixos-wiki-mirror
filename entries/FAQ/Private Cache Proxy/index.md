<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/Private Cache Proxy -->

For private deployments, it can be desirable to reduce how often you reach out of your network and to an upstream. Mirroring all the dependencies internally means even if external services fail, your internal network is still functional. An additional reason to implement this is to reduce the external signals your deployment emits. For example, you may want to avoid exposing how often you fetch a specific file from an external service.

The following location blocks can be used with Nginx to produce a transparent caching proxy to the upstream NixOS cache:

     location ~ ^/nix-cache-info {
        proxy_store        on;
        proxy_store_access user:rw group:rw all:r;
        proxy_temp_path    /data/nginx/nix-cache-info/temp;
        root               /data/nginx/nix-cache-info/store;

        proxy_set_header Host "cache.nixos.org";
        proxy_pass https://cache.nixos.org;
      }

      location ~^/nar/.+$ {
        proxy_store        on;
        proxy_store_access user:rw group:rw all:r;
        proxy_temp_path    /data/nginx/nar/temp;
        root               /data/nginx/nar/store;

        proxy_set_header Host "cache.nixos.org";
        proxy_pass https://cache.nixos.org;
      }

The data paths must exist and be read/writable by the Nginx process. This configuration will transparently mirror the upstream <https://cache.nixos.org> packages on the proxy server when they are first fetched, meaning all future fetches of the same files are served from the local disk.
