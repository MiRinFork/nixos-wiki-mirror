<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FreshRSS -->

**[FreshRSS](https://freshrss.org)** is a self-hosted RSS and Atom feed aggregator. It is lightweight, multi-user, and supports custom tags, an API for mobile clients (Google Reader API and Fever API), WebSub push notifications, XPath-based web scraping (for generating feeds from websites that have no RSS/Atom feed published), OPML import/export, themes, and extensions.

## Installation

Enable the FreshRSS module in your configuration:

This creates a PHP-FPM pool and an nginx virtual host automatically.

## Configuration

### Basic setup

Unlike some NixOS service modules, FreshRSS does not automatically create the database, so you must set it up yourself, e.g. using PostgreSQL:

The module sets up the and for the virtual host automatically. You are responsible for adding TLS settings (, or ) to the virtual host.

If you run into issues with cert-issuing, manually triggering a renew might help:[^1]

### Password file

The must contain the plaintext password and be readable by the user:

Create the file with correct permissions:

sudo tee /etc/secrets/freshrss \$ sudo chown freshrss:freshrss /etc/secrets/freshrss \$ sudo chmod 400 /etc/secrets/freshrss }}

### Caddy

The module supports Caddy as an alternative to nginx via the option:

Caddy handles TLS automatically. Further customization can be done via .

### Mobile API

To enable the Google Reader and Fever APIs for mobile clients:

Users must then set individual API passwords in their profile settings.

## See also

- <a href="Tt-rss" class="wikilink" title="Tt-rss">Tt-rss</a> — an alternative self-hosted RSS reader with a NixOS module
- <a href="RSSHub" class="wikilink" title="RSSHub">RSSHub</a> — an RSS feed generator for sites that do not natively provide feeds

## References

- [FreshRSS official website](https://freshrss.org/)
- [FreshRSS on GitHub](https://github.com/FreshRSS/FreshRSS)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>

[^1]: <https://discourse.nixos.org/t/security-acme-defaults-to-minica-instead-of-lego-with-cloudflare-dns-on-nixos-25-11/73220>
