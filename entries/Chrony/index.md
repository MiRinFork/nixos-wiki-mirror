<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Chrony -->

Chrony is an NTP and NTS client and server implementation. This means it can synchronize the time of your local machine, as well as provide services to clients on the attached network segments.

## NTP

This protocol is slowly being phased out due it security concerns, using a more secure method like NTS is recommended. To enable NTP, enable the chrony service and add whichever NTP servers you wish to use. If you don't set a serverlist here, the value of `networking.timeServers` will be used.

``` nix
{ config
, ...
};
{
  services.chrony = {
    enable = true;
    servers = [ "ntp-example.com" ];
  };
}
```

## NTS

To enable NTS (Network Time Security), typically all that needs to be provided is a NTP server capable of NTS.

``` nix
{ config
, ...
};
{
  services.chrony = {
    enable = true;
    enableNTS = true;
    servers = [ "nts-example.com" ];
  };
}
```

You can verify that NTS is being used via observing the output of `sudo chronyc -N authdata` and reading the value under mode, it should read NTS.

This will not work with the default timeservers of NixOS, as they do not support NTS!

### Troubleshooting

It is possible that a certificate may need to be manually provided. You can rely on the ACME service to acquire one, but make sure that the certificate group gets assigned to `chrony`, or else the service will not be able to read the certificate and key after it drops its privileges.

``` nix
{ config
, ...
};
let
  acmePath = config.security.acme.certs."foo-example.com".directory;
in
{
  security.acme.certs."foo-example.com" = {
    group = "chrony";
    # One of the following challenge method options will need to be provided
    # to obtain a self signed cert
    webroot = "";
    s3bucket = '"";
    dnsProvider = "";
    listenHTTP = "";
  };

   services.chrony = {
     enable = true;
     enableNTS = true;
     extraConfig = ''
      [...]
      ntsservercert ${acmePath}/fullchain.pem
      ntsserverkey ${acmePath}/key.pem
    '';
  };
}
```

## Hosting an NTP server

The simplest config to make chrony act as an NTP server is this configuration:

``` nix
{ ... }:
{
  services.chrony = {
    enable = true;
    extraConfig = ''
      allow
    '';
  };

  networking.firewall.allowedUDPPorts = [ 123 ];
}
```

This allows any external client to request time via NTP. You can also limit the allowed clients to certain subnets like so:

``` nix
{ ... }:
{
  services.chrony = {
    enable = true;
    extraConfig = ''
      allow 10.100.0.0/24
      allow 192.168.178.0/24
    '';
  };

  networking.firewall.allowedUDPPorts = [ 123 ];
}
```

### NTS while hosting

If you want to enable NTS, you need to also add `networking.firewall.allowedTCPPorts = [ 4460 ];` as this port is used for the NTS key-exchange before the encrypted connection via port 123.

Currently, `enableNTS` is an all-or-nothing setting; it will require all servers to support NTS as well as all clients. If you need more granularity, use `extraConfig`and refer to [the chrony documentation](https://chrony-project.org/documentation.html).

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
