<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Certbot -->

[Certbot](https://github.com/certbot/certbot) is [Electronic Frontier Foundation](https://www.eff.org/)'s <a href="ACME" class="wikilink" title="ACME">ACME</a> client, which is written in Python and provides conveniences like automatic web server configuration and a built-in webserver for the HTTP challenge. Certbot is recommended by [Let's Encrypt](https://letsencrypt.org/).

## Installation

Install *certbot* application and enable *systemd-timer* for automated renewal of certificates

## Usage

It is possible to use several different methods to generate and configure certificates. Verification is done manually, via web servers or DNS records. Not all methods are covered here, for more information please consult the [upstream documentation](https://eff-certbot.readthedocs.io/en/stable/).

Generated certificates and keys by using the commands below will be stored as `/etc/letsencrypt/live/example.org/fullchain.pem` and `/etc/letsencrypt/live/example.org/privkey.pem`, readable by the `acme` group.

### Manual DNS challenge

The following command will generate a SSL certificate key pair for the domain `example.org` using the DNS authentication mechanism. After running this command, you'll get asked by the script to paste a specific key into your DNS records for `example.org`.

``` console
# certbot certonly --manual --preferred-challenges dns -d example.org --register-unsafely-without-email --agree-tos
```

### DNS challenge using a plugin

Currently there are several *certbot* plugins [already packaged](https://search.nixos.org/packages?query=certbot-dns). While the plugin usage should be similar for most of them, you should look up upstream documentation on how to use them. In this example we're going to configure and use [the plugin](https://github.com/oGGy990/certbot-dns-inwx) for the hosting provider [INWX](https://www.inwx.com/en).

Installing *certbot* system wide with specific plugin included

Shared secret must be set in the configuration but you only have to configure the value if you're using 2FA on INWX.

Manually configure and generate certificates for `example.org` using the *inwx*-plugin

``` console
# certbot certonly -a dns-inwx -d example.org --register-unsafely-without-email --agree-tos
```

Now that a specific domain is configured to get renewed using the plugin, the *systemd-timer* of the *certbot* module will automatically renew it after expiration.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
