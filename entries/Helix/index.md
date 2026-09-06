<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Helix -->

[Helix](https://helix-editor.com/) is a modal text-editor inspired by <a href="Neovim" class="wikilink" title="Neovim">Neovim</a> and <a href="Kakoune" class="wikilink" title="Kakoune">Kakoune</a>, written in Rust. Compared to neovim, it is preconfigured with the functions that most people need (for example tree-sitter for syntax highlighting). It uses (neo-)vim motions keybindings, but it uses the object-verb approach (visually highlighting text and then executing a function on it). It is intended for people who like to use a modal text editor but don't want to spend a lot of time configuring it.

## Seup

Helix can be installed system-wide on NixOS with the `helix` package:

``` nix
environment.systemPackages = [ pkgs.helix ];
```

Depending on the programming languages it is helpful to install additional packages from nixpkgs. To show what packages are needed, it is helpful to check `hx --health`.

### With Home Manager

<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> provides a module for configuring helix.

``` nix
programs.helix = {
  enable = true;
  settings = {
    theme = "autumn_night_transparent";
    editor.cursor-shape = {
      normal = "block";
      insert = "bar";
      select = "underline";
    };
  };
  languages.language = [{
    name = "nix";
    auto-format = true;
    formatter.command = lib.getExe pkgs.nixfmt-rfc-style;
  }];
  themes = {
    autumn_night_transparent = {
      "inherits" = "autumn_night";
      "ui.background" = { };
    };
  };
};
```

The full configuration options are described on the [Helix documentation](https://docs.helix-editor.com/). For programming languages (LSP, formatter, ..) see the [Helix wiki](https://github.com/helix-editor/helix/wiki/Language-Server-Configurations).

## Configuration

### Language server

For further auto-completion features and syntax evaluation, a language server such `nixd` can be configured using Home-Manager.

``` nix
programs.helix = {
  enable = true;
  [...]
  languages = {
    language-server = {
      nixd = {
        command = "${lib.getExe pkgs.nixd}";
        args = [ "--semantic-tokens=true" ];
        config.nixd =
          let
            nixosConfiguration = "mynixos";
            flakeRef = "(builtins.getFlake (toString /etc/nixos/.))";
            nixosOpts = "${flakeRef}.nixosConfigurations.${nixosConfiguration}.options";
          in
          {
            nixpkgs.expr = "${flakeRef}.inputs.nixpkgs";
            options = {
              nixos.expr = nixosOpts;
              home-manager.expr = "${nixosOpts}.home-manager.users.type.getSubOptions []";
            };
          };
      };
    };
  };
};
```

Adapt `nixosConfiguration` variable, file path to your flake.nix in `flakeRef` and the list of expression paths in the `options` attribute set, according to your system and your needs.

## Tips and tricks

### Plugins

There is an open and actively worked on [PR](https://github.com/helix-editor/helix/pull/8675) to add [plugins](https://helix-plugins.com/), which can be tested by using the `steelix` package [from nixpkgs-unstable](https://search.nixos.org/packages?channel=unstable&query=steelix).

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>
