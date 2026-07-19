<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Yazi -->

<strong>[Yazi](https://yazi-rs.github.io)</strong> is a blazing-fast terminal file manager developed in Rust, using non-blocking async I/O for an efficient, user-friendly, and highly customizable file management experience. It features full asynchronous support, distributing CPU tasks across multiple threads to maximize resource use and improve performance.

It offers powerful async task scheduling with real-time progress updates, task cancellation, and internal prioritization. It supports multiple image protocols natively and integrates with [Überzug++](https://github.com/jstkdng/ueberzugpp) for broad terminal compatibility. Additionally, Yazi includes built-in code highlighting and image decoding functionalities, along with a pre-loading mechanism to speed up file loading processes.

## Installation

There are several ways to install Yazi on NixOS.

### Temporary Shell

To temporarily use Yazi in your current shell session, run:

``` bash
nix-shell -p yazi
```

### System-wide

To install Yazi for all users on the system, add it to your :

``` nix
programs.yazi.enable = true;
```

After adding the option, rebuild your system:

``` bash
sudo nixos-rebuild switch
```

### Home Manager

To install Yazi for a single user, add it to your Home Manager configuration:

``` nix
programs.yazi.enable = true;
```

After adding the option, apply the changes:

``` bash
home-manager switch
```

## Configuration

As mentioned above, there are both [NixOS options](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=programs.yazi) and [home-manager options](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.yazi.enable) for configuring Yazi.

#### Advanced

``` nix
programs.yazi = {
  enable = true;
  settings = {
    yazi = {
      ratio = [
        1
        4
        3
      ];
      sort_by = "natural";
      sort_sensitive = true;
      sort_reverse = false;
      sort_dir_first = true;
      linemode = "none";
      show_hidden = true;
      show_symlink = true;
    };

    preview = {
      image_filter = "lanczos3";
      image_quality = 90;
      tab_size = 1;
      max_width = 600;
      max_height = 900;
      cache_dir = "";
      ueberzug_scale = 1;
      ueberzug_offset = [
        0
        0
        0
        0
      ];
    };

    tasks = {
      micro_workers = 5;
      macro_workers = 10;
      bizarre_retry = 5;
    };
  };
}
```

## Using separate files

If you would like to use your existing files to keep them portable, you can import them into your configuration directly to be read and built by nix.

## Plugins

#### Installing Plugins

Many yazi plugins are [packaged in nixpkgs](https://search.nixos.org/packages?channel=unstable&from=0&size=50&buckets=%7B%22package_attr_set%22%3A%5B%22yaziPlugins%22%5D%2C%22package_license_set%22%3A%5B%5D%2C%22package_maintainers_set%22%3A%5B%5D%2C%22package_platforms%22%3A%5B%5D%7D&sort=relevance&type=packages&query=yaziPlugins).

There are some additional yazi plugins packaged in the [nix-yazi-plugins](https://github.com/lordkekz/nix-yazi-plugins) flake. It also provides home-manager modules for configuring the plugins' options.

#### home-manager

## Tips and tricks

#### Bleeding edge

The upstream repository provides a flake so that Nix users can easily keep up with the bleeding edge.[^1]

``` nix
inputs = {
    yazi.url = "github:sxyazi/yazi";
};
```

Afterwards, you can use the new package.

``` nix
# Global
environment.systemPackages = [ yazi.packages.${pkgs.stdenv.hostPlatform.system}.default ];
# or, if you use the module
programs.yazi.package = yazi.packages.${pkgs.stdenv.hostPlatform.system}.default;

# Home Manager
home.packages = [ yazi.packages.${pkgs.stdenv.hostPlatform.system}.default ];
# or, if you use the module
programs.yazi.package = yazi.packages.${pkgs.stdenv.hostPlatform.system}.default;
```

Pre-built artifacts are served at <https://yazi.cachix.org>, so that Nix users don't have to build Yazi on their machine.[^2]

``` nix
nix = {
  settings = {
    substitute = true;
    substituters = [
      "https://yazi.cachix.org"
    ];
    trusted-public-keys = [
      "yazi.cachix.org-1:Dcdz63NZKfvUCbDGngQDAZq6kOroIrFoyO064uvLh8k="
    ];
  };
};
```

#### Stylix integration

``` nix
theme = with config.stylix.base16Scheme; {
  filetype = {
    rules = [
      # Images
      {
        mime = "image/*";
        fg = "#${base0B}";
      }

      # Videos
      {
        mime = "video/*";
        fg = "#${base03}";
      }
      # Audio
      {
        mime = "audio/*";
        fg = "#${base08}";
      }
    ];
  };
};
```

Stylix can do it automatically for you if the following option is set:

``` nix
stylix.targets.yazi.enable = true;
```

#### Key mapping

``` nix
# Hyprland
bind = [
  "$mod, E, exec, kitty -e yazi"
];
```

#### Easy directory keymap

## Troubleshooting

### RAR file extraction

By default, yazi depends on \_7zz in nixpkgs for extraction and previewing purposes. This does not support RAR files by default. To enable support, you can override the \_7zz in the dependencies into unfree rar version.

``` text
pkgs.yazi.override {_7zz = pkgs._7zz-rar; }
```

## See also

- [NixOS options for Yazi](https://search.nixos.org/options?channel=unstable&query=programs.yazi)
- [Yazi official documentation](https://yazi-rs.github.io/docs/installation/)

## References

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>

[^1]: <https://yazi-rs.github.io/docs/installation/#nix-flakes>

[^2]: <https://yazi-rs.github.io/docs/installation/#cache>
