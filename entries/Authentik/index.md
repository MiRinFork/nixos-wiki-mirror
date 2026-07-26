<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Authentik -->

[authentik](https://goauthentik.io/) is an identity provider supporting protocols such as OAuth 2.0, OpenID Connect, SAML, and LDAP. It provides a free open-source edition and a paid Enterprise edition with additional features and support. It is an alternative to <a href="Keycloak" class="wikilink" title="Keycloak">Keycloak</a>.

There are currently three ways to use authentik on NixOS:

1.  the official [docker-compose](https://docs.goauthentik.io/install-config/install/docker-compose/)
2.  unofficial [flake](https://github.com/nix-community/authentik-nix)
3.  your own NixOS module

As of NixOS 26.05 there is no module in nixpkgs which would start the service with something like `services.authentik.enable = true;`. Therefore, if you don't want to use docker containers or flakes, writing your own modules is the only way to run authentik, currently.

## Your own NixOS module

Advantages of this option are not having to use flakes and having more integration and less indirection than with containers.

The example configuration below

1.  creates two systemd services: authentik server and authentik worker (this is analog to the to containers in the official docker-compose solution)
2.  reuses an existing PostgreSQL instance (the official docker-compose solution creates its own instance)
3.  uses <a href="Agenix" class="wikilink" title="Agenix">Agenix</a> for storing the authentik sercret key
4.  uses nginx as a reverse proxy
5.  does not store authentik's configuration such as users, groups, policies declaratively
6.  uses the unstable version of authentik. authentik version 2026 introduced several configuration option changes and therefore, for a new installation, it is advisable to use the unstable nixpkgs package which is already on 2026.x.y. This reduces future required configuration changes.

### Preresiquites

1.  This example suggest to use <https://auth.yourdomain.example> as the URL of authentik. Add the DNS records (A and AAAA) for `auth` to the DNS configuration of your domain. If you change the `domain` option, you can use any other subdomain.
2.  Create an agenix secret file named `authentik-secret-key.age` and add a secret key using `openssl rand -base64 60 | tr -d '\n'`[^1]

### Configuration

You can import the authentik module below to your main configuration using `imports`. For example:

Search for all `TODO`s and set your system's values accordingly.

<references />

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>

[^1]: [authentik's Docker Compose installation documentation](https://docs.goauthentik.io/install-config/install/docker-compose/#generate-postgresql-password-and-secret-key)
