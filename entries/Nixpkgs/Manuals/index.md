<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/Manuals -->

## Links

In the nix ecosystem these are important manuals

### Nix

The manual for nix, the package manager

<https://nix.dev/manual/nix/unstable>

<https://nix.dev/manual/nix/stable>

<https://nix.dev/manual/nix/latest>

### Nixpkgs

The manual for nixpkgs, the package repository

<https://nixos.org/manual/nixpkgs/unstable>

<https://nixos.org/manual/nixpkgs/stable>

### Nixos

The manual for nixos, the linux based operating system

<https://nixos.org/manual/nixos/unstable>

<https://nixos.org/manual/nixos/stable>

### home-manager

The manual for <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

<https://nix-community.github.io/home-manager>

### nix-darwin

The manual for <a href="Nix-darwin" class="wikilink" title="Nix-darwin">Nix-darwin</a>

<https://nix-darwin.github.io/nix-darwin/manual/index.html>

## Building the manuals yourself

To build the manuals above

### nixos manual

``` bash
cd nixpkgs
nix-build nixos/release.nix --no-out-link -A manualHTML.x86_64-linux # or aarch64-linux
```

### nixpkgs manual

``` bash
# master
nix build github:nixos/nixpkgs#nixpkgs-manual --print-out-paths --no-link

# nixos-unstable
nix build github:nixos/nixpkgs/nixos-unstable#nixpkgs-manual --print-out-paths --no-link
```

#### older versions of the manual

If you want to build the manual for older versions of nixpkgs for e.g. nixos-24.05

``` bash
nix build github:nixos/nixpkgs/nixos-24.05#nixpkgs-manual --print-out-paths --no-link
```

To build the manual for a specific revision of nixpkgs

clone nixpkgs locally and cd into nixpkgs

checkout the specific revision (branch or commit)

``` bash
git checkout nixos-24.05
nix build .#nixpkgs-manual --print-out-paths --no-link
```

### nix manual

``` bash
# before nix version 2.25.0
nix build github:nixos/nix/2.24.11#nix^doc --print-out-paths --no-link

# after 2.25.x
nix build github:nixos/nix/2.25.0#nix-manual --print-out-paths --no-link

# master
nix build github:nixos/nix#nix-manual --print-out-paths --no-link

# for other system
nix build github:nixos/nix/2.25.0#packages.aarch64-darwin.nix-manual --print-out-paths --no-link
```

### home-manager manual

``` bash
# unstable
nix build github:nix-community/home-manager#docs-html --print-out-paths --no-link

# stable version, e.g. 25.05
nix build github:nix-community/home-manager/release-25.05#docs-html --print-out-paths --no-link
```

### nix-darwin manual

``` bash
# unstable
nix build github:LnL7/nix-darwin#manualHTML --print-out-paths --no-link

# stable version, e.g. 25.05
nix build github:LnL7/nix-darwin/nix-darwin-25.05#manualHTML --print-out-paths --no-link

# in local clone with nix-build
nix-build release.nix -A docs.manualHTML
```
