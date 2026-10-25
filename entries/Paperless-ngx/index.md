<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Paperless-ngx -->

[Paperless-ngx](https://paperless-ngx.com) is a community-supported open-source document management system that transforms your physical documents into a searchable online archive, allowing you to reduce paper clutter.

## Setup

The following example configuration will enable Paperless locallyAfter applying the configuration you can access the instance via <http://localhost:28981> and login with username `admin` and password `admin`.

Another example below could be used on a server with an actual URL and some extra settings.

``` nix
services.paperless = {
  enable = true;
  consumptionDirIsPublic = true;
  address = "<machine ip>";
  settings = {
    PAPERLESS_CONSUMER_IGNORE_PATTERN = [
      ".DS_STORE/*"
      "desktop.ini"
    ];
    PAPERLESS_OCR_LANGUAGE = "deu+eng";
    PAPERLESS_OCR_USER_ARGS = {
      optimize = 1;
      pdfa_image_compression = "lossless";
    };
    PAPERLESS_URL = "https://paperless.example.com";
  };
};
```

After the installation, you can set an admin user yourself via the following command on the server

``` bash
sudo paperless-manage createsuperuser
```

## Maintenance

Paperless-ngx comes with some [management commands](https://docs.paperless-ngx.com/administration/#management-commands) that can be used for various maintenance tasks. On NixOS you can invoke these commands with `paperless-manage` in the following way:

#### Export / Backup

Creating backups of your data (incl. settings and database) can be configured and automated with [services.paperless.exporter](https://search.nixos.org/options?channel=unstable&query=services.paperless.exporter&type=options). If needed you can also manually trigger an export with `document_exporter`for example:

    sudo -u paperless paperless-manage document_exporter /var/lib/paperless/export <arguments>

#### Import

The `document_importer` takes your previously created export and imports it into paperless:

    sudo -u paperless paperless-manage document_importer /path/to/export <arguments>

#### More commands

Check [official documentation](https://docs.paperless-ngx.com/administration/#management-commands) for more management commands and further explanation.

## FAQ

### Why is Paperless being rebuilt from source, even if there is a version in the package cache?

If you have set `PAPERLESS_OCR_LANGUAGE`, the tesseract OCR engine and consequently paperless-ngx are recompiled for your specified languages.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
