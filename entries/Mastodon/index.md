<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mastodon -->

[Mastodon](https://joinmastodon.org) is a decentralized social media platform that allows users to create accounts, post content, and interact with others. It is an alternative to centralized social media platforms like Twitter and Facebook.

## Setup

The `services.mastodon` service can be used to setup a Mastodon instance in [single user mode](https://docs.joinmastodon.org/admin/config/#single_user_mode). It will setup all the necessary services (PostgreSQL, Redis, Nginx...) and setup a valid certificate to be used for the HTTPS connection:

``` nix
  security.acme = {
    acceptTerms = true;
    defaults.email = "<EMAIL TO USE FOR CORRESPONDENCE WITH Let's Encrypt>";
  };
  services.mastodon = {
    enable = true;
    localDomain = "social.example.com"; # Replace with your own domain
    configureNginx = true;
    smtp.fromAddress = "noreply@social.example.com"; # Email address used by Mastodon to send emails, replace with your own
    streamingProcesses = 3; # Number of processes used. It is recommended to set to the number of CPU cores minus one
    extraConfig.SINGLE_USER_MODE = "true";
  };
  networking.firewall.allowedTCPPorts = [ 80 443 ];
```

You can then create your account using the package `mastodon`: Ignore any warnings about the ruby version, it should work anyways

``` console
# sudo -u mastodon mastodon-tootctl accounts create USERNAME --email=YOUR_EMAIL --confirmed --role=Owner
```

and approve your new account

``` console
# sudo -u mastodon mastodon-tootctl accounts approve USERNAME
```

Then you're ready to head to the domain you set up and start tooting away!

## Usage

Create user

``` console
# sudo -u mastodon mastodon-tootctl accounts create my_user --email myuser@example.org
```

Confirm user mail manually

``` console
# sudo -u mastodon mastodon-tootctl accounts modify my_user --email myuser@example.org --confirm
```

Approve user manually

``` console
# sudo -u mastodon mastodon-tootctl accounts modify my_user --email myuser@example.org --approve
```

Change password for user `my_user`

``` console
# sudo -u mastodon mastodon-tootctl accounts modify --reset-password my_user
```

## Tips and tricks

### Enabling full text search

Using OpenSearch as alternative to ElasticSearch after the license change. First set the following options and rebuild the config:

``` nix
services.opensearch.enable = true;
services.mastodon.elasticsearch.host = "127.0.0.1";
```

Then on the server run the following command to fill the search index:

``` console
$ sudo -u mastodon mastodon-tootctl search deploy
```

### Using Caddy as a server

Use the following template:

``` nix
services = {
  caddy = {
    enable = true;
    virtualHosts = {
    
      # Don't forget to change the host!
      "<your-server-host>" = {
        extraConfig = ''
          handle_path /system/* {
              file_server * {
                  root /var/lib/mastodon/public-system
              }
          }

          handle /api/v1/streaming/* {
              reverse_proxy  unix//run/mastodon-streaming/streaming.socket
          }

          route * {
              file_server * {
              root ${pkgs.mastodon}/public
              pass_thru
              }
              reverse_proxy * unix//run/mastodon-web/web.socket
          }

          handle_errors {
              root * ${pkgs.mastodon}/public
              rewrite 500.html
              file_server
          }

          encode gzip

          header /* {
              Strict-Transport-Security "max-age=31536000;"
          }
          header /emoji/* Cache-Control "public, max-age=31536000, immutable"
          header /packs/* Cache-Control "public, max-age=31536000, immutable"
          header /system/accounts/avatars/* Cache-Control "public, max-age=31536000, immutable"
          header /system/media_attachments/files/* Cache-Control "public, max-age=31536000, immutable"
        '';
    };
  };
};

# Caddy requires file and socket access
users.users.caddy.extraGroups = [ "mastodon" ];
```

### Automatic backups

Mastodon uses postgreSQL as database. Luckily, Nixpkgs offers a useful service, [`services.postgresqlBackup.enable`](https://search.nixos.org/options?channel=unstable&show=services.postgresqlBackup.enable&from=0&size=50&sort=relevance&type=packages&query=postgresql).

Example settings, assuming you have the default database settings:

``` nix
  services.postgresqlBackup = {
    enable = true;
    databases = [ "mastodon" ];
  };
```

## Troubleshooting

### Hints for running in your local network for testing

If you get a `Mastodon::HostValidationError` when trying to federate with another ActivityPub instance in your local network you need to allow Mastodon to access local ip addresses in outgoing http (federation) requests. To do this set the following environment variable: `ALLOWED_PRIVATE_ADDRESSES` to a comma-separated list of allowed ip addresses with the format specified in <https://ruby-doc.org/stdlib-2.5.1/libdoc/ipaddr/rdoc/IPAddr.html>. This is also documented in the Mastodon admin guide[1](https://docs.joinmastodon.org/admin/config/).

<a href="Category:ActivityPub" class="wikilink" title="Category:ActivityPub">Category:ActivityPub</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
