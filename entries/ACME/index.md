<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ACME -->

NixOS supports automatic domain validation & certificate retrieval and renewal using the ACME protocol. Any provider can be used, but by default NixOS uses Let's Encrypt. The alternative ACME client [lego](https://go-acme.github.io/lego/) is used under the hood.

# Basics

This process should generate three key files. The naming and usage of the three key files is common to all programs and services in NixOS.

We let `sslCertDir = config.security.acme.certs.${domainName}.directory;` in the following paragraph.

The three key files and their location are

- `sslServerCert = "/var/host.cert";` Path to server SSL certificate. Located at `"${sslCertDir}/fullchain.pem"`.

<!-- -->

- `sslServerChain = "/var/ca.pem";` Path to server SSL chain file. Located at `"${sslCertDir}/chain.pem"`.

<!-- -->

- `sslServerKey = "/var/host.key";` Path to server SSL certificate key. Located at `"${sslCertDir}/key.pem"`.

The `useACMEHost` option can be used with a wide variety of services[1](https://search.nixos.org/options?channel=25.05&query=useACMEHost), which simplifies the configuration and enables the automatic checking of correct private and public key permissions during nixos-rebuild.

# Obtaining a new certificate

## Basics

You need to agree to the Terms of Service, provide an email address, provide a domain name, and, if any, extra domain names.

DNS challenge supports obtaining certificates for wildcard domains, such as `*.example.org`.

``` nix
let
  domainName = "example.org";
in
{
  security.acme = {
    acceptTerms = true;
    defaults.email = "admin@${domainName}";
    certs = {
      "${domainName}" = {
        group = config.services.nginx.group;
        extraDomainNames = [
          "mail.${domainName}"
          "www.${domainName}"
        ];
      };
    };
  };
}
```

## HTTP challenge

To use HTTP challenge, you need to have your DNS record pointing to this computer. You also need to enable a web server and allow plaintext traffic on port 80. This example is based on the previous section:

``` nix
  security.acme = {
    defaults.webroot = "/var/lib/acme/acme-challenge/";
    # We are using nginx as webserver, therefore set correct key permissions
    certs.${domainName}.group = config.services.nginx.group;
  };

  # for acme plain http challenge
  networking.firewall.allowedTCPPorts = [ 80 ];

  # webserver for http challenge
  services.nginx = {
    enable = true;
    virtualHosts.${domainName} = {
      forceSSL = true;
      useACMEHost = domainName;
      locations."/.well-known/".root = "/var/lib/acme/acme-challenge/";
    };
  };
```

## DNS challenge

If you want to use the DNS challenge with nginx, you should also set [service.nginx.virtualHosts.<name>.acmeRoot](https://search.nixos.org/options?show=services.nginx.virtualHosts.%3Cname%3E.acmeRoot) to `null`. [^1]

### With inwx as DNS provider

Following example setup generates certificates using DNS validation. [Let's Encrypt ToS](https://letsencrypt.org/repository/) has to be accepted. Further the contact mail `admin+acme@example.com` is defined.

``` nix
security.acme = {
  acceptTerms = true;
  defaults.email = "admin+acme@example.org";
  certs."mx1.example.org" = {
    dnsProvider = "inwx";
    # Supplying password files like this will make your credentials world-readable
    # in the Nix store. This is for demonstration purpose only, do not use this in production.
    environmentFile = "${pkgs.writeText "inwx-creds" ''
      INWX_USERNAME=xxxxxxxxxx
      INWX_PASSWORD=yyyyyyyyyy
    ''}";
  };
};
```

Certificates are getting generated for the domain `mx1.example.org` using the DNS provider `inwx`. See \[<https://go-acme.github.io/lego/dns> upstream documentation\] on available providers and their specific configuration for the `credentialsFile` option.

### With Cloudflare as DNS provider

The next example issues a wildcard certificate and uses Cloudflare for validation. We're also adding the group "nginx" here so that the certificate files can be used by nginx later on.

``` nix
security.acme = {
  acceptTerms = true;
  defaults.email = "admin@example.org";
  certs = {
    "example.org" = {
      domain = "*.example.org";
      group = "nginx";
      dnsProvider = "cloudflare";
      # location of your CLOUDFLARE_DNS_API_TOKEN=[value]
      # https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#EnvironmentFile=
      environmentFile = "/home/admin/cloudflare";
    };
  };
};
```

## TLS challenge

Todo.

# Integration with service modules

## Setting file permission with postRun

Use the `security.acme.certs.*.postRun` to set permissions on the key directory and the key files:

``` nix
security.acme.certs.${domainName}.postRun = ''
  # set permission on dir
  ${pkgs.acl}/bin/setfacl -m \
  u:nginx:rx,u:turnserver:rx,u:prosody:rx,u:dovecot2:rx,u:postfix:rx \
  /var/lib/acme/${domainName}

  # set permission on key file
  ${pkgs.acl}/bin/setfacl -m \
  u:nginx:r,u:turnserver:r,u:prosody:r,u:dovecot2:r,u:postfix:r \
  /var/lib/acme/${domainName}/*.pem
'';
```

## Reload services after renewal

``` nix
security.acme.certs.${domainName}.reloadServices = [
  "prosody"
  "coturn"
  "nginx"
  "dovecot2"
  "postfix"
];
```

## Using useACMEHost

Many service modules support obtaining certificates. But if you were to configure certificate options separately for each service module, it would be time-consuming and risks hitting the certificate renewal limits of the service provider.

Instead, centrally manage certificate options within the security.acme module; then point other services to security.acme with `useACMEHost` option.

``` nix
security.acme.certs."example.org".extraDomainNames = [
  "syncplay.example.org"
  "reposilite.example.org"
  "site2.example.org"
];

services.syncplay.useACMEHost = "example.org";
services.reposilite.useACMEHost = "example.org";
services.nginx.virtualHosts."site2.example.org".useACMEHost = "example.org";
```

# Using Let's Encrypt Staging

For testing your Let's Encrypt configuration it makes sense to use their [staging environment](https://letsencrypt.org/docs/staging-environment/), because it offers less stringent rate limits.

``` nix
security.acme.defaults.server = "https://acme-staging-v02.api.letsencrypt.org/directory";
```

# See also

- NixOS manual on [SSL/TLS Certificates with ACME](https://nixos.org/manual/nixos/stable/index.html#module-security-acme)

<a href="Category:_Server" class="wikilink" title="Category: Server">Category: Server</a> <a href="Category:_Networking" class="wikilink" title="Category: Networking">Category: Networking</a>

[^1]: From [NixOS Manual: *Using DNS validation with web server virtual hosts*](https://nixos.org/manual/nixos/stable/#module-security-acme-config-dns-with-vhosts). [Issue \#210807](https://github.com/NixOS/nixpkgs/issues/210807) provides some detail on why this is needed.
