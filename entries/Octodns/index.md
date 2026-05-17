<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Octodns -->

[OctoDNS](https://github.com/octodns/octodns) is a powerful tool that allows for easy management of DNS records across multiple providers. It leverages Python to provide a unified interface for various DNS services, simplifying DNS administration tasks.

## Installation

Install OctoDNS with additional providers

## Usage

In this example we're going to configure the `A` record for the domain `example.org` which is managed by the provider Gandi

Inside the directory `config` we're going to create a file with the DNS zone configuration for `example.org`

Apply this configuration to the domain

``` bash
GANDI_TOKEN=1234 octodns-sync --config config.yaml --doit
```

## See also

- Use OctoDNS as a NixOS module and declare DNS setup declarative <https://github.com/Janik-Haag/NixOS-DNS>
- <a href="Dnscontrol" class="wikilink" title="Dnscontrol">Dnscontrol</a>, tool to synchronize your DNS to multiple providers from a simple DSL

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
