<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dokuwiki -->

[DokuWiki](https://www.dokuwiki.org) is a web application and simple Wiki software for creating documentation and editable pages in markdown language. Compared to other Wikis, it is more minimal and only depends on PHP and file access without any need for databases. It stores all information in plain text files to be available even without the DokuWiki software (e.g. to read directly from backup).

## Installation

To setup DokuWiki locally, this is the most minimal configuration to get started

After that DokuWiki will be available at <http://localhost> .

## Configuration

Besides several options which are exposed by the DokuWiki module in NixOS, you can also use `settings` option to add custom options to your DokuWiki configuration. See the [upstream documentation](https://www.dokuwiki.org/config) for available options.

### Templates

Unfortunately no templates are packaged yet in nixpkgs. It is possible to manually package a template, for example from the [official template repository](https://www.dokuwiki.org/template), and include it in your Dokuwiki instance. In the following example the template [mindthedark](https://www.dokuwiki.org/template:mindthedark) is packaged and enabled

Please note that you'll have to manually update the tempalte source and checksum in case there's a new version.

### Plugins

The following example packages the [edittable plugin](https://www.dokuwiki.org/plugin:edittable)

The plugin is enabled automatically. Note that in case of this plugin, we strip the root directory called *edittable-master* and only copy the plugin files to the *out*-folder. Please note that you'll have to manually update the plugin source and checksum in case there's a new version.

### Clean URLs

If supported by the webserver you've choosen (using the `webserver` option), you can enable clean urls or url rewriting by enabling the option [userewrite](https://www.dokuwiki.org/config:userewrite). This means you can access your sites with the simple URL scheme like <http://localhost/my_project> .

Clean URLs are reported to work with the webserver <a href="Caddy" class="wikilink" title="Caddy">Caddy</a>.

### Anonymous editing

To disable the user authentication completely and make the Wiki editable by anyone (even anonymous users), you can disable the config [useacl](https://www.dokuwiki.org/config:useacl) with the following option

## Tips and tricks

### SSL behind reverse proxy

In case you're running DokuWiki behind a reverse proxy which offers ssl/https to the outside, you might have to enforce https protocol by changing the baseurl

## See also

- <a href="Mediawiki" class="wikilink" title="Mediawiki">Mediawiki</a>, PHP- and web-based wiki software.
- <a href="Outline" class="wikilink" title="Outline">Outline</a>, a modern web based wiki and knowledge base for teams.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
