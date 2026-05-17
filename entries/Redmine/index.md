<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Redmine -->

[](https://redmine.org/) (<a href="wikipedia:en:{{PAGENAME}}" class="wikilink" title="wikipedia:en:{{PAGENAME}}">wikipedia:en:{{PAGENAME}}</a>) is available as a <a href="module" class="wikilink" title="module">module</a>.

## configuration examples

#### minimal configuration

``` nix
```

``` nix
# system.stateVersion = "22.05";

  services.redmine.enable = true;

  networking.firewall.allowedTCPPorts = [ 3000 ];
```

``` nix
```

  
unencrypted http (only)

<http://hostName.domain.tld:3000>

#### basic configuration

``` nix
```

``` nix
# system.stateVersion = "22.05";

# networking.hostName = "redmine";
# networking.domain = "domain.tld";

  services.redmine.enable = true;

  services.nginx.enable = true;
# services.nginx.recommendedOptimisation = true;
#  services.nginx.recommendedGzipSettings = true;

# services.nginx.recommendedProxySettings = true;
  services.nginx.virtualHosts."${config.networking.fqdn}" = {
    locations."/" = {
      proxyPass = "http://127.0.0.1:3000";
    };
    forceSSL = true;
    enableACME = true;
  };
# services.nginx.recommendedTlsSettings = true;
  security.acme.defaults.email = "acme@${config.networking.domain}";
  security.acme.acceptTerms = true;

#  networking.firewall.allowedTCPPorts = [ 80 443 3000 ];
  networking.firewall.allowedTCPPorts = [ 80 443 ];
```

``` nix
```

<https://redmine.domain.tld>

## login

(first you have to) login in as the initial account

  
this initial account is having highest privileges

<https://redmine.domain.tld/login>

:; Login: *admin*

:; Password: *admin*

  
`Login`

(redmine forces you to) change the password

<https://redmine.domain.tld/my/password>

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
