<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ONLYOFFICE DocumentServer -->

[ONLYOFFICE DocumentServer](https://www.onlyoffice.com/) is a full-featured backend for editing different office documents like Open Document, Word, Excel, etc. online in your browser. The software is open source and can be easily deployed and integrated into existing server software. Available frontends are <a href="Nextcloud" class="wikilink" title="Nextcloud">Nextcloud</a> or the ONLYOFFICE CommunityServer. It can also be used in own software, see [following examples](https://github.com/ONLYOFFICE/document-server-integration) for PHP, Node.js, etc.

## Installation

A minimal example to get a ONLYOFFICE DocumentServer running on localhost should look like this

Note the example above leaks the secret into your nix store - you should review a <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secrets management approach">secrets management approach</a> and make sure you pick a unique secret.

## Configuration

### Change default listening port

In case port 80 is already used by a different application, or you're using a different web server than <a href="Nginx" class="wikilink" title="Nginx">Nginx</a>, which is used by the ONLYOFFICE module, you can change the listening port with the following option:

### Caddy web server

Instead of using the default <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> web server, a configuration for <a href="Caddy" class="wikilink" title="Caddy">Caddy</a> might look like this

The reverse_proxy configuration directly forwards all requests to the ONLYOFFICE server, ignoring the default Nginx vhost.

## Troubleshooting

When using the documentserver from Nextcloud, saving the settings on the Nextcloud UI ("Administration Settings" -\> Administration -\> ONLYOFFICE)" triggers a round-trip test.

There are two services: onlyoffice-docservice.service and onlyoffice-converter.service. These need to be started after each other: onlyoffice-docservice.service (currently) generates configuration files in /run/onlyoffice, which can take a while. onlyoffice-converter.service then picks these up and uses them.

## Packaging

The notes below are mainly useful for those creating the onlyoffice packages.

### Sourcemaps

To enable sourcemaps for sdkjs and partly web-apps, see <https://github.com/raboof/nixpkgs/commit/0b3b7a9f10565eda44a9b32e1b9bfa5726bf49d3>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
