<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Buildkite -->

NixOS comes with a module to run [buildkite](https://buildkite.com) agents:

``` nix
{
  services.buildkite-agents.builder = {
    enable = true;
    # store a token provided in the  buildkite webinterface in the `Agents` tab under `Agents token`
    tokenPath = "/path/to/token";
    privateSshKeyPath = "/path/to/ssh/key";

    # tools needed for basic nix-build
    runtimePackages = [
      pkgs.gnutar
      pkgs.bash
      pkgs.nix
      pkgs.gzip
      pkgs.git
    ];
  };
}
```

[Further NixOS options](https://search.nixos.org/options/?query=services.buildkite)

## Using buildkite for public repository

Since buildkite executes code there are some additional security measures to take care of in order to run buildkite on your own infrastructure.

It is recommend to run the buildkit-agent in a sandbox. In the following example, we use the confinement option to run in a chroot where only the nix store is mounted. The nix daemon socket is than bind mounted into the chroot. Make sure that you don't add secrets to your nix store!

``` nix
{ pkgs, config, ... }:
{
  # Replace the suffix `<name>` by the name used in `services.buildkite-agents.<name> `
  systemd.services.buildkite-agent-<name> = {
    confinement.enable = true;
    confinement.packages = config.services.buildkite-agents.<name>.runtimePackages;
    serviceConfig = {
      BindReadOnlyPaths = [
        config.services.buildkite-agents.<name>.tokenPath
        config.services.buildkite-agents.<name>.privateSshKeyPath
        "${config.environment.etc."ssl/certs/ca-certificates.crt".source}:/etc/ssl/certs/ca-certificates.crt"
        "/etc/machine-id"
        # channels are dynamic paths in the nix store, therefore we need to bind mount the whole thing
        "/nix/store"
      ];
      BindPaths = [
        config.services.buildkite-agents.<name>.dataDir
        "/nix/var/nix/daemon-socket/socket"
      ];
    };
  };
}
```

Since pull requests can modify the build instructions it is recommend to move `.buildkite/pipeline.yml` from the repository itself and only provide it via the web interface. Also consider using `restrict-eval` options to prevent leaking the buildkite's ssh key and api token, since those are still mounted into the chroot.

## See also

- <a href="Continuous_Integration_(CI)" class="wikilink" title="Continuous Integration (CI)">Continuous Integration (CI)</a>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
