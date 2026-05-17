<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Outline -->

[Outline](https://www.getoutline.com) is a modern web based wiki and knowledge base for teams.

## Setup

The most minimal local installation of Outline can be enabled with the following configuration

Outline is available at <http://localhost> . Choose login provider "Dex" and authenticate with the example mock login `user.email@example.com` and `password`.

### SSL example

Similar as before but this time with Nginx handling SSL.

## Troubleshooting

### Option storageType does not exist

If you see an error that says something like `option "services.outline.storage.storageType" does not exist"` you may need to update your channels (`nix-channel --update`)

## See also

- <a href="Mediawiki" class="wikilink" title="Mediawiki">Mediawiki</a>, PHP- and web-based wiki software.
- <a href="Dokuwiki" class="wikilink" title="Dokuwiki">Dokuwiki</a>, simple PHP- and web-based wiki software which uses file based storage for its content.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
