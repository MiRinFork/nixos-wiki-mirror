<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: BigBlueButton -->

[BigBlueButton](https://bigbluebutton.org) is an open source virtual classroom software.

### Setup

The BigBlueButton server itself [hasn't been packaged yet](https://github.com/ngi-nix/projects/issues/36#issuecomment-5211192339) for NixOS. Meanwhile it is possible to use the standalone web frontend [Greenlight](https://docs.bigbluebutton.org/greenlight/v3/install/), which can be used to manage rooms and connect to other BigBlueButton servers.To enable the Greenlight web frontend for the domain `example.org`, add following confguration.

``` bash
services.greenlight = {
  enable = true;
  settings.URL_HOST = "example.org";
};
```

Create an admin account with following command.

``` bash
greenlight-rake admin:create['name','email','password']
```

Reference <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> page for instructions on how to configure SSL and ACME. Access the web app via <https://example.org>.

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
