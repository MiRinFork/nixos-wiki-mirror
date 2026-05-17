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

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
