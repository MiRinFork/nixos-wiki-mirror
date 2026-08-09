<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Pixelfed -->

[Pixelfed](https://pixelfed.org/) is a free and ethical photo sharing platform, powered by ActivityPub federation.

### Setup

An instance of Pixelfed can be enabled on the domain `pics.example.org` using following example.

``` nixos
environment.etc."pixelfed-secret.env".text = "APP_KEY=adKK9EcY8Hcj3PLU7rzG9rJ6KKTOtYfA";

services.pixelfed = {
  enable = true;
  domain = "pics.example.org";
  nginx = {
    enableACME = true;
    forceSSL = true;
  };
  secretFile = "/etc/pixelfed-secret.env";
};
```

Reference <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> page for instructions on how to configure SSL and ACME.

To create an administrator account that can also be used to log into Pixelfed, run the following commands.

``` bash
pixelfed-manage user:create --name=test --username=test --email=test@test.com --password=test
pixelfed-manage user:admin test
```

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
