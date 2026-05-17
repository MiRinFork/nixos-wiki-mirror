<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Authelia -->

## Minimal Configuration Example

``` nix
{ config, pkgs, ... }:
{
  age.secrets."authelia_jwt-secret-file" = {
    file = ../../secrets/authelia_jwt-secret-file.age;
    owner = "authelia-main";
  };
  age.secrets."authelia_storage-encryption-key-file" = {
    file = ../../secrets/authelia_storage-encryption-key-file.age;
    owner = "authelia-main";
  };

  services.authelia.instances.main = {
    enable = true;
    package = pkgs.authelia;
    secrets = {
      jwtSecretFile = config.age.secrets."authelia_jwt-secret-file".path;
      storageEncryptionKeyFile = config.age.secrets."authelia_storage-encryption-key-file".path;
    };
    settings = {
      theme = "auto";
      default_2fa_method = "totp";
      log.level = "info";
      server.address = "tcp://:9091/";
      session = {
        cookies = [
          {
            domain = "domain.tld";
            authelia_url = "https://auth.domain.tld";
          }
        ];
      };
      access_control = {
        default_policy = "deny";
        rules = [ 
          {
            domain = "auth.domain.tld";
            policy = "bypass";
          }
          {
            domain = "*.domain.tld";
            policy = "one_factor";
          }
        ];
      };
      storage.local.path = "/var/lib/authelia-main/db.sqlite";
      notifier.filesystem.filename = "/var/lib/authelia-main/notifications.yml";
      authentication_backend.file.path = "/etc/authelia/users.yml";
    };
  };
  environment.etc."authelia/users.yml" = {
    mode = "0400";
    user = "authelia-main";
    text = ''
      users:
        john:
          password: "$argon..." # generate with `authelia -c authelia crypto hash generate`
          displayname: "John"
          email: "<your_email>"
          groups: ["admins"]
    '';
  };
  services.nginx.virtualHosts."auth.domain.tld" = {
    forceSSL = true;
    locations."/".proxyPass = "http://127.0.0.1:9091";
  };
}
```
