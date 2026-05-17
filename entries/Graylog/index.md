<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Graylog -->

The [Graylog](https://graylog.org/) software centrally captures, stores, and enables real-time search and log analysis against terabytes of machine data from any component in the IT infrastructure and applications.[^1]

## Installation

The installation consists of three different software programs, namely Graylog, <a href="MongoDB" class="wikilink" title="MongoDB">MongoDB</a> and <a href="OpenSearch" class="wikilink" title="OpenSearch">OpenSearch</a>.

It's advised to pin each package to one major version to circumvent upgrade issues. See following example that uses Graylog 6, MongoDB 6 and Opensearch 2.14.0. We're on NixOS 24.05.

Regarding OpenSearch, the version seems to be important. See Troubleshooting below to know why.

``` nix
{ config, pkgs, ... }:
{
  services = {
    graylog = {
      enable = true;
      extraConfig = ''
        http_external_uri = https://graylog.example.com/
      '';
      elasticsearchHosts = [ "http://127.0.0.1:9200" ];
      package = pkgs.graylog-6_0;
      passwordSecret = "yPE4lpLpjdCxJ5V3q9st7nSw6zo9XYueL191VubFqdjRMK9Wtc4WGbDhJD1AvUPcBwZhMTxtmt9JurbT0fOwaqIdonmVWMAd";
      rootPasswordSha2 = "c0b0109d9439de57fe3cf03abeccbc52f4c98170c732d3b69af5e6395ace574e";
    };
    mongodb = {
      enable = true;
      package = pkgs.mongodb-6_0;
    };
    opensearch = {
      enable = true;
      settings = {
        "cluster.name" = "my-cluster";
      };
    };
  };
}
```

## Troubleshooting

Graylog officially states in their [documentation](https://go2docs.graylog.org/current/downloading_and_installing_graylog/installing_graylog.html) that OpenSearch Version 2.16.0 should not be used. This is a problem as this version is the only one available as a nixpkg in the unstable branch. NixOS 24.05 uses 2.14.0 which doesn't have issues.

If OpenSearch v2.16.0 was already installed, Graylog has a workaround here: <https://graylog.org/post/alert-notice-opensearch-v2-16/>

## References

<references/>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>

[^1]: <a href="Wikipedia:en:Graylog" class="wikilink" title="Wikipedia:en:Graylog">Wikipedia:en:Graylog</a>
