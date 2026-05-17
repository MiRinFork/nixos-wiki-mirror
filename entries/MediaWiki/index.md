<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MediaWiki -->

[](https://mediawiki.org/) (<a href="wikipedia:en:{{PAGENAME}}" class="wikilink" title="wikipedia:en:{{PAGENAME}}">wikipedia:en:{{PAGENAME}}</a>) is available as a <a href="module" class="wikilink" title="module">module</a>.

## Configuration Examples

### Small Configuration

``` nix
services.mediawiki = {
  enable = true;
  name = "Sample MediaWiki";
  httpd.virtualHost = {
    hostName = "example.com";
    adminAddr = "admin@example.com";
  };
  # Administrator account username is admin.
  # Set initial password to "cardbotnine" for the account admin.
  passwordFile = pkgs.writeText "password" "cardbotnine";
  extraConfig = ''
    # Disable anonymous editing
    $wgGroupPermissions['*']['edit'] = false;
  '';

  extensions = {
    # some extensions are included and can enabled by passing null
    VisualEditor = null;

    # https://www.mediawiki.org/wiki/Extension:TemplateStyles
    TemplateStyles = pkgs.fetchzip {
      url = "https://extdist.wmflabs.org/dist/extensions/TemplateStyles-REL1_40-5c3234a.tar.gz";
      hash = "sha256-IygCDgwJ+hZ1d39OXuJMrkaxPhVuxSkHy9bWU5NeM/E=";
    };
  };
};
```

## Web Server

By default, the `services.mediawiki` module creates a `services.httpd.virtualHost` which can be configured via the `services.mediawiki.httpd.virtualHost` submodule.

If you are using another web server (like <a href="Nginx" class="wikilink" title="Nginx">Nginx</a>), you can configure MediaWiki for a reverse proxy with the `services.mediawiki.virtualHost.listen` option:

``` nix
services.mediawiki.httpd.virtualHost.listen = [
  {
    ip = "127.0.0.1";
    port = 8080;
    ssl = false;
  }
];
```

Alternatively, `services.mediawiki.webserver` can be set to `"nginx"` to use nginx instead of <a href="Apache_HTTP_Server" class="wikilink" title="apache">apache</a>.

## Troubleshooting

### Edit php.ini

A <a href="Phpfpm" class="wikilink" title="php-fpm">php-fpm</a> pool is automatically created when Mediawiki is enabled. The `php.ini` file can be modified by using `phpOptions`. The following example shows how to increase the allowed file upload size.

``` nix
services.phpfpm.pools.mediawiki.phpOptions = ''
    upload_max_filesize = 10M
    post_max_size = 15M
'';
```

## See Also

- [Configuration of the NixOS wiki](https://github.com/NixOS/nixos-wiki-infra)
- [nixos/tests/mediawiki.nix](https://github.com/NixOS/nixpkgs/blob/master/nixos/tests/mediawiki.nix)
- <a href="Dokuwiki" class="wikilink" title="Dokuwiki">Dokuwiki</a>, simple PHP- and web-based wiki software which uses file based storage for its content.
- <a href="Outline" class="wikilink" title="Outline">Outline</a>, a modern web based wiki and knowledge base for teams.

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
