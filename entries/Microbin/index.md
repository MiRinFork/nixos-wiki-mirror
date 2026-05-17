<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Microbin -->

## Introduction

**MicroBin** is a feature rich, performant and secure text and file sharing web application, a "paste bin". Imagine cloud storage, but simpler, and with cool features like URL redirection, automatic file expiry, raw file serving support, and 3 possible levels of encryption.

## Setup

The following is a minimal configuration to get MicroBin up and running:

``` nix
{
  services.microbin = {
    enable = true;
    settings = {
      MICROBIN_BIND = "0.0.0.0";
      MICROBIN_PORT = 8080;
    };
  };
}
```

Access it on `localhost:8080`

## Additional Configuration

For details regarding the MicroBin environment variables go to <https://microbin.eu/docs/installation-and-configuration/configuration>.

The following is a more complete configuration:

``` nix
{
  services.microbin = {
    enable = true;
    passwordFile = "/var/lib/microbinEnv";
    settings = {
      MICROBIN_BIND = "0.0.0.0";
      MICROBIN_PORT = 8080;
      MICROBIN_ENCRYPTION_CLIENT_SIDE = true;
      MICROBIN_ENCRYPTION_SERVER_SIDE = true;
      MICROBIN_HASH_IDS = true;
      MICROBIN_DISABLE_TELEMETRY = true;
    };
  };
}
```

It is recommended to not write your admin password and user to the settings file so that is not stored in the nix store.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
