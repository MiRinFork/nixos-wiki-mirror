<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOps -->

**NixOps** is a tool for deploying NixOS systems in a reproducible and declarative manner. It allows users to manage and deploy entire NixOS-based infrastructures, whether to cloud platforms, virtual machines, or physical hardware.

NixOps allows users to declaratively specify the desired configuration of their systems and then automatically performs all necessary actions to realize that configuration. This includes tasks such as instantiating cloud machines, managing dependencies, and provisioning resources. NixOps is meant to be fully automated and to create reproducible deployments that leverage the Nix package manager’s purely functional model, creating consistency in the configuration and providing reliability across various environments.

For further details, please refer to the [NixOps manual](https://nixos.org/nixops/manual/), which provides an overview of its functionality and features, as well as an up-to-date installation guide.

## Example Configuration

This example demonstrates a basic NixOps configuration that sets up a staging environment with two machines: a reverse proxy and an application server running a git server (Forgejo). This example assumes that both machines already exist, that SSH in the operator's machine is well configured to reach them, and that both machines are running NixOS. The <a href="Overview_of_the_Nix_Language" class="wikilink" title="nix language">nix language</a> allows referencing the configuration of other machines using the `nodes` argument, making it easy to link services across the network.

``` nix
# network-staging.nix file
let
  proxyHostname = "proxy.example.com";
  gitHostname = "10.0.0.2";
in {
  network.description = "Staging environment for our git setup";
  defaults.imports = [ ./common.nix ];
  
  reverse-proxy = { nodes, ... }: {
    deployment.targetHost = proxyHostname;
    services.nginx = {
      enable = true;
      virtualHosts."example.com".locations."/" = {
        proxyPass = "http://${gitHostname}:${nodes.gitServer.config.services.forgejo.port}";
      };
    };
    # the rest of reverse-proxy's configuration can be added here
  };
  
  gitServer = _: {
    deployment.targetHost = gitHostname;
    services.forgejo.enable = true;
    # additional git server configuration can be added here
  };
}
```

### Invocation

To apply this configuration on both nodes, one must first create a deployment with the `nixops create` command, and then apply the new configuration with `nixops deploy`.

``` bash
nixops create network-staging.nix -d staging
> created deployment ‘32b06868-d27c-11e2-a055-81d7beb7925e’

nixops deploy -d staging
```

## External links

- [The NixOps Manual](https://nixos.org/manual/nixops/stable/)
- [A presentation on NixOps by Kim Lindberger (talyz) - Oslo NixOS MiniCon, March 2020](https://www.youtube.com/watch?v=SoHtccHNOJ8)
- [An example of cross-building for ARM and x86_64 using nixops](https://eno.space/blog/2021/08/nixos-on-underpowered-devices)

## See also

- <a href="krops" class="wikilink" title="krops">krops</a>
- <a href="morph" class="wikilink" title="morph">morph</a>
- <a href="nix-deploy" class="wikilink" title="nix-deploy">nix-deploy</a>
- <a href="Colmena" class="wikilink" title="Colmena">Colmena</a>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOps" class="wikilink" title="Category:NixOps">Category:NixOps</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
