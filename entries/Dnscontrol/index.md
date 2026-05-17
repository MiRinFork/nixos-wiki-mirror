<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dnscontrol -->

[Dnscontrol](https://dnscontrol.org) is a tool to synchronize your DNS to multiple providers from a simple DSL.

## Installation

Install dnscontrol in your current environment

``` console
# nix-env -iA nixos.dnscontrol
```

## Configuration

In the following example usage, we'll create a credentials file called `creds.json` with the login details for the domain provider [Inwx.com](https://inwx.com):

See [upstream documentation](https://docs.dnscontrol.org/service-providers/providers) for available provider and their authentication syntax.

The second required configuration file called `dnsconfig.js` defines providers and domain configurations. In this example, we'll add a subdomain `test` to the domain `example.org` with a specific A-record.

The provider will be Inwx for which we configured the credentials earlier. The option `NO_PURGE` tells dnscontrol to only add the new record while leaving all other entries untouched.

## Usage

Preview the changes which will be made to your domain

``` console
# dnscontrol preview
```

Apply changes with the following command

``` console
# dnscontrol push
```

Confirm changes to the dns record using the tool `dig`.

``` console
# nix shell nixpkgs#dnsutils --command dig +short test.example.org
```

## See also

- <a href="Octodns" class="wikilink" title="Octodns">Octodns</a>, tool that allows for easy management of DNS records across multiple providers

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
