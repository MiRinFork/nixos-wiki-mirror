<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Helm and Helmfile -->

## HELM and HELMFILE

Using **Helm** and **Helmfile** on **NixOS** effectivly requires some minor setup.

## HELM

The derivation for `helm` is in `nixpkgs` und the name `kubernetes-helm`. However it does not include any plugins for helm.

To see which plugins are avaiable in `nixpkgs` do a `nix search nixpkgs kubernetes-helmPlugins`.

In order to make any plugins available to `helm` itself, `nixpkgs` provides a helper function called `wrapHelm`. This allows you to set an attribute called `plugins`.

The following snippet will give you access to helm with four plugins via your list of system packages. It assumes that you are using `nixpkgs` as `pkgs`:

``` nix
{
  environment.systemPackages = with pkgs; [
      (wrapHelm kubernetes-helm {
        plugins = with pkgs.kubernetes-helmPlugins; [
          helm-secrets
          helm-diff
          helm-s3
          helm-git
        ];
      }) 
    ];
}
```

Alternatively a self-contained flake for a development shell with helm and plugins available might look like this:

``` nix
{
  description = "Nix flake for Helm";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShells.default = pkgs.mkShell {
          name = "helm devShell";
          nativeBuildInputs = [ pkgs.bashInteractive ];
          buildInputs = with pkgs; [
            (wrapHelm kubernetes-helm {
              plugins = with pkgs.kubernetes-helmPlugins; [
                helm-diff
                helm-secrets
                helm-s3
              ];
            })
          ];
        };
      });
}
```

Create a `flake.nix` in some empty directory, paste the snippet above and run it with `nix develop`

This will create a devShell with helm and listed plugins available. Check `helm plugin list` to verify.

### HELMFILE

Helmfile can be found in `nixpkgs` as `helmfile`.

In order to work properly, `helmfile` requires access to a number of helm plugins aside from the helm binary itself. In version 0.146.0, helmfile has introduced a check for plugin versions which uses helm's Go API directly instead of calling the helm binary. In order to make plugins avaiable after this change, the nix derivation `kubernetes-helm-wrapped` exposes an attribute called `pluginsDir` if helm is wrapped with plugins. The `helmfile` binary needs to be wrapped in turn in order to have access to this attribute.

There are several ways to achieve this. One is using an overlay inside a flake to populate the `pluginsDir` attribute.

``` nix
{
  description = "Nix flake for Helm and Helmfile with plugins";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          system = "x86_64-linux";
          overlays = [
            (final: prev: rec {
              kubernetes-helm-wrapped = prev.wrapHelm prev.kubernetes-helm {
                plugins = with prev.kubernetes-helmPlugins; [
                  helm-diff
                  helm-secrets
                  helm-s3
                ];
              };
            })
          ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "helmfile devShell";
          nativeBuildInputs = with pkgs; [
            bashInteractive
          ];
          buildInputs = with pkgs; [
            kubernetes-helm-wrapped
            helmfile-wrapped
          ];
        };
      });
}
```

Here `helmfile-wrapped` reads `kubernetes-helm-wrapped.passthru.pluginsDir` and picks up the plugins correctly.

Again, create a `flake.nix` in some empty directory, paste the snippet above and run it with `nix develop`

This time it will create a devShell with helm and helmfile and listed plugins available. Check `helm plugin list` to verify for helm. Likewise check `helmfile init` to see if helmfile finds its helm plugin dependencies.

------------------------------------------------------------------------

Another approach is via a `let ... in` block in your `configuration.nix`.

``` nix
{ config, pkgs, ... }:
let
  my-kubernetes-helm = with pkgs; wrapHelm kubernetes-helm {
    plugins = with pkgs.kubernetes-helmPlugins; [
      helm-secrets
      helm-diff
      helm-s3
      helm-git
    ];
  };

  my-helmfile = pkgs.helmfile-wrapped.override {
    inherit (my-kubernetes-helm) pluginsDir;
  };
in

{
  environment.systemPackages =  [
    my-kubernetes-helm
    my-helmfile
  ];
}
```

Create a new `*.nix` file for the code snippet and import it into your system `configuration.nix`. In this case it should make `helm` and `helmfile` with plugins available to your system.

## References

[Issue \#217768](https://github.com/NixOS/nixpkgs/issues/217768): helmfile does not recognize helm plugins [NixOS Discourse](https://discourse.nixos.org/t/helm-plugin-install/20705/3): Helm plugin install

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>
