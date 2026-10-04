<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vernissage -->

[Vernissage](https://vernissage.photos/) is an application that enables users to share their photographs with others.

## Setup

The following configuration provides a minimal example to configure [VernissageServer](https://github.com/VernissageApp/VernissageServer) and [VernissageWeb](https://github.com/VernissageApp/VernissageWeb), with the default SQLite database, without Redis or S3 object store. The necessary configuration options for [VernissageWeb](https://github.com/VernissageApp/VernissageWeb) are automatically derived from the base address, set on the API.

``` nix
services.vernissage = {
  api = {
    enable = true;
    settings.baseAddress = "https://vernissage.example.com";
  };
  web.enable = true;
}
```

## Configuration

Check the [upstream example](https://github.com/VernissageApp/VernissageServer#configuration) on how to configure the API server.

Here is an example, including secret configuration. As you can see, secrets are specified via a `_secret` sub-option.

``` nix
services.vernissage.api.settings = {
  baseAddress = "https://vernissage.example.com";
  connectionString._secret = pkgs.writeText "vernissage-conn-string" ''
    postgres://vernissage:PASSWORD@127.0.0.1:5432/vernissage
  '';
  queueUrl = "redis://127.0.0.1:6379";
  s3Address = "https://s3.garage.example.com";
  s3Bucket = "vernissage";
  s3AccessKeyId._secret = pkgs.writeText "vernissage-s3-id" ''
    KEY-ID
  '';
  s3SecretAccessKey._secret = pkgs.writeText "vernissage-s3-secret" ''
    KEY-SECRET
  '';
}
```

### WebPush

``` nix
services.vernissage.push = {
  enable = true;
  vpushKeyFile = pkgs.writeText "vernissage-push-key" ''
    9c52bba3682020aa21b8562dc4f1975370284e95e92f4d7d21bd0473214fdf03
  '';
};
```

Then in the Vernissage settings (web frontend), enable WebPush and enter the following values:

- **Service endpoint**: `http://127.0.0.1:3000`
- **Service secret key**: the key you specified in your config (e.g. `9c52bba3682020aa21b8562dc4f1975370284e95e92f4d7d21bd0473214fdf03`)
- **Vapid subject**: `mailto:postmaster@example.com`

The **Vapid public** and **private key** have to be generated.

``` shell
openssl ecparam -name prime256v1 -genkey -noout -out vapid_private.pem

# Vapid private key
sed '1d;5d' vapid_private.pem | tr --delete '\n' | tr '+' '-' | tr '/' '_'

# Vapid public key
openssl ec -in vapid_private.pem -pubout | sed '1d;4d' | tr --delete '\n' | tr '+' '-' | tr '/' '_'
```

## Reverse Proxy (nginx)

The <a href="nginx" class="wikilink" title="nginx">nginx</a> configuration is adapted from [VernissageProxy](https://github.com/VernissageApp/VernissageProxy/), which is is a preconfigured <a href="nginx" class="wikilink" title="nginx">nginx</a> server the upstream project provides as a <a href="Docker" class="wikilink" title="Docker">Docker</a> container.

``` nix
services.nginx = {
  enable = true;

  appendHttpConfig = ''
    map "$http_content_type:$http_accept" $vernissage_machine {
      default "127.0.0.1:${config.services.vernissage.web.port}";
      ~*json  "127.0.0.1:${config.services.vernissage.api.port}";
    }
  '';

  virtualHosts."vernissage.example.com" = {
    locations."~ \/(api\/v1|storage|.well-known|rss|atom)\/".proxyPass = "http://127.0.0.1:${config.services.vernissage.api.port}";
    locations."/".proxyPass = "http://$vernissage_machine";

    extraConfig = ''
      client_max_body_size 10M;
    '';
  };
```

## S3 Object Store

The project suggests to use <a href="Minio" class="wikilink" title="Minio">Minio</a> but since it has been abandoned, <a href="Garage" class="wikilink" title="Garage">Garage</a> is a nearly perfect replacement.

### <a href="Garage" class="wikilink" title="Garage">Garage</a>

#### Configuration

``` nix
services.garage = {
  enable = true;
  package = pkgs.garage_2;
  settings = {
    replication_factor = 1;
    rpc_bind_addr = "[::]:3901";
    rpc_secret = "687335124ab1c88816cb5fd7e8d77ffe164c04e6bba8ea9d6d8301a92cf96c01";
    s3_api = {
      api_bind_addr = "[::]:3900";
      s3_region = "us-east-1";
      root_domain = ".s3.garage.example.com";
    };
      s3_web = {
        bind_addr = "[::]:3902";
        root_domain = ".web.garage.example.com";
      };
      admin = {
        api_bind_addr = "[::]:3903";
        admin_token = "DDZcCyhTSJGKGN4ukojesKL9aO7zVxQFsWG8FpFW6fw=";
        # Effectively disables metrics because no metrics token is specified (besides the admin token)
        metrics_require_token = true;
      };
    };
  };
```

#### Setup

1.  Follow the upstream [Quick Start guide](https://garagehq.deuxfleurs.fr/documentation/quick-start/#creating-a-cluster-layout) to setup your node(s), the S3 bucket and a keypair.
2.  Enable exposition as a website with `sudo garage -c /etc/garage.toml bucket website --allow vernissage`
3.  Optionally set a bucket quota through `sudo garage -c /etc/garage.toml bucket set-quotas --max-size 25GiB vernissage`

#### Reverse proxy configuration (until anonymous HTTP access is possible)

Until support for anonymous HTTP access is there ([upstream PR](https://git.deuxfleurs.fr/Deuxfleurs/garage/pulls/1306)) you need configure your reverse proxy to redirect unauthenticated file requests to <a href="Garage" class="wikilink" title="Garage">Garage</a>’s web backend.

``` nix
services.nginx.virtualHosts."s3.garage.example.com".locations."~ \/vernissage\/(.*\.jpg)" = {
proxyPass = "http://127.0.0.1:3902/$1";
  extraConfig = ''
    proxy_set_header Host "vernissage.web.garage.example.com"
  '';
};
```
