<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Loops -->

[Loops](https://joinloops.org) is a federated short video sharing platform.

### Setup

An instance of Loops can be enabled on the domain `loops.example.org` using following example.

``` nixos
environment.etc."loops-secret.env".text = "APP_KEY=adKK9EcY8Hcj3PLU7rzG9rJ6KKTOtYfA";

services.loops = {
  enable = true;
  domain = "loops.example.org";
  nginx = {
    enableACME = true;
    forceSSL = true;
  };
  secretFile = "/etc/loops-secret.env";
};
```

Reference <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> page for instructions on how to configure SSL and ACME.

To create an administrator account that can also be used to log into Loops, run the following commands.

``` bash
loops-manage create-admin-account
```

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
