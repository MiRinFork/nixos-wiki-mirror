<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Matter Server -->

## Matter server

you can enable the matter server with the following configuration

``` nixos
services.matterjs-server = {
  enable = true;
  extraArgs = [
    # "--vendorid=4939" # Home Assistant's vendor ID, if you're switching from deprecated services.matter-server
  ];
};
```
