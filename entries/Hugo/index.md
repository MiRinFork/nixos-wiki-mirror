<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hugo -->

<languages/> <translate> **Hugo** is a static site generator written in Go. It builds websites from content files and templates, supporting features such as Markdown content, themes, and flexible deployment options. Hugo is available in the NixOS ecosystem and can be used for a variety of web publishing tasks.[^1] </translate>

## Installation

#### Shell

<translate> To temporarily use Hugo in a shell environment, you can run: </translate>

``` bash
nix-shell -p hugo
```

<translate> This will provide a shell with Hugo available without adding it to your system configuration. </translate>

#### System setup

<translate> To install Hugo, add it to either the system-wide `environment.systemPackages` in `/etc/nixos/configuration.nix` or to the user-specific `home.packages` in `~/.config/nixpkgs/home.nix`.[^2] </translate>

``` nix
# System-wide installation (in /etc/nixos/configuration.nix)
environment.systemPackages = with pkgs; [
  hugo
  git # Useful for managing Hugo themes and site repositories
];

# User-specific installation (in ~/.config/nixpkgs/home.nix)
home.packages = with pkgs; [
  hugo
  git
];
```

<translate> Then, rebuild your system or apply your Home Manager configuration: </translate>

``` bash
# For system-wide installation
sudo nixos-rebuild switch

# For Home Manager
home-manager switch
```

## Configuration

#### Basic

<translate> Basic Hugo configuration involves creating a new site and choosing themes. Use the following command to create a new Hugo site: </translate>

``` bash
hugo new site my-site
```

<translate> Navigate to the site directory and add a theme as a git submodule or download it directly. For detailed steps, refer to the official Hugo documentation. </translate>

#### Advanced

<translate> </translate>

## Tips and tricks

<translate>

### Development Shell

You may want to limit Hugo installation to your project only. This allows contributors to use the exact dependencies specified for the project:

To avoid typing `nix-shell` or `nix develop` to access the dev shell, consider <a href="Direnv" class="wikilink" title="enabling nix-direnv">enabling nix-direnv</a>. </translate>

<translate>

### Theming

Nix can be used to deterministically import Hugo themes by pinning them to a specific revision:

After creating a `hugo.toml` file like the following, activate the theme with `hugo new site . --force`: </translate>

## Troubleshooting

<translate> </translate>

## References

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Go" class="wikilink" title="Category:Go">Category:Go</a>

[^1]: <https://gohugo.io/documentation/>

[^2]: <https://nixos.org/manual/nixos/stable/>
