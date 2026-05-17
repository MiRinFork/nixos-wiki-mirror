<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenProjekt -->

[OpenProject](https://www.openproject.org/) is an open-source project management web-app.

## Setup

Following example enables OpenProject, running only locally for testing purpose.

``` nix
environment.etc."openproject-secret".text = "3f9b4e6a7c1d2f8a9b0c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5";
services.openproject = {
  enable = true;
  secrets.keyBaseFile = "/etc/openproject-secret";
  settings = {
    OPENPROJECT_HTTPS = false;
    OPENPROJECT_HSTS = false;
  };
};
```

OpenProject initialization will take some time, after that it will be available at <http://localhost:6346>. Default login is user `admin` with password `admin`.
