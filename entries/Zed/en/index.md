<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zed/en -->

<languages/> [Zed](https://zed.dev)[^1] is a collaborative, GPU-accelerated text editor developed by Zed Industries. It combines fast local editing with real-time multiplayer features and ships with batteries-included tooling for popular programming languages.

The editor provides native builds for Linux, including Nixpkgs packages and a reproducible flake. Hardware acceleration requires a GPU with Vulkan support; systems without Vulkan can fall back to emulation via tools such as [nixGL](https://github.com/nix-community/nixGL).[^2]

is available in Nixpkgs since 24.11; However, Zed provides [an official nix flake](https://github.com/zed-industries/zed/blob/main/flake.nix) which might be useful if you need features that have not yet reached unstable Nixpkgs.

## Installation

The package installs both desktop launchers and a CLI entry point aliased to `zeditor`, mirroring the upstream binary name

### Imperative

#### Zed's Flake

``` console
nix run github:zed-industries/zed
```

#### Nixpkgs

``` console
nix run nixpkgs#zed-editor
```

### Declarative

#### NixOS

``` nix
environment.systemPackages = [
  pkgs.zed-editor
];
```

#### Home Manager

``` nix
home.packages = [
  pkgs.zed-editor
];
```

``` console
home-manager switch
```

#### Zed's Flake

``` nix
{
  inputs.zed.url = "github:zed-industries/zed";

  outputs =
    {
      self,
      nixpkgs,
      zed,
      ...
    }@inputs:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      packages.${system}.zed-latest = zed.packages.${system}.default;
    };
}
```

Build the flake package with `nix build .#zed-latest` or expose it in your configuration with the appropriate overlay.

true;</code> to provide the necessary libraries. Providing Vulkan through `nixGL` can be more consistent than relying on host distribution packages, especially on non-NixOS systems where Wayland and X11 stacks differ in their Vulkan capabilities.}}

## Configuration

Zed stores its configuration in JSON files under `~/.config/zed`. Home Manager can manage these settings declaratively.

#### Basic

``` nix
programs.zed-editor = {
  enable = true;
  extensions = [ "nix" "toml" "rust" ];
  userSettings = {
    theme = {
      mode = "system";
      dark = "One Dark";
      light = "One Light";
    };
    hour_format = "hour24";
    vim_mode = true;
  };
};
```

The configuration above enables Zed via Home Manager, installs a small set of extensions, and synchronises the theme with the desktop appearance.

#### Advanced

``` nix
programs.zed-editor = {
  enable = true;

  # This populates the userSettings "auto_install_extensions"
  extensions = [ "nix" "toml" "elixir" "make" ];

  # Everything inside of these brackets are Zed options
  userSettings = {
    assistant = {
      enabled = true;
      version = "2";
      default_open_ai_model = null;

      # Provider options:
      # - zed.dev models (claude-3-5-sonnet-latest) requires GitHub connected
      # - anthropic models (claude-3-5-sonnet-latest, claude-3-haiku-latest, claude-3-opus-latest) requires API_KEY
      # - copilot_chat models (gpt-4o, gpt-4, gpt-3.5-turbo, o1-preview) requires GitHub connected
      default_model = {
        provider = "zed.dev";
        model = "claude-3-5-sonnet-latest";
      };

      # inline_alternatives = [
      #   {
      #     provider = "copilot_chat";
      #     model = "gpt-3.5-turbo";
      #   }
      # ];
    };

    node = {
      path = lib.getExe pkgs.nodejs;
      npm_path = lib.getExe' pkgs.nodejs "npm";
    };

    hour_format = "hour24";
    auto_update = false;

    terminal = {
      alternate_scroll = "off";
      blinking = "off";
      copy_on_select = false;
      dock = "bottom";
      detect_venv = {
        on = {
          directories = [ ".env" "env" ".venv" "venv" ];
          activate_script = "default";
        };
      };
      env = {
        TERM = "alacritty";
      };
      font_family = "FiraCode Nerd Font";
      font_features = null;
      font_size = null;
      line_height = "comfortable";
      option_as_meta = false;
      button = false;
      shell = "system";
      # shell = {
      #   program = "zsh";
      # };
      toolbar = {
        title = true;
      };
      working_directory = "current_project_directory";
    };

    lsp = {
      rust-analyzer = {
        binary = {
          # path = lib.getExe pkgs.rust-analyzer;
          path_lookup = true;
        };
      };

      nix = {
        binary = {
          path_lookup = true;
        };
      };

      elixir-ls = {
        binary = {
          path_lookup = true;
        };
        settings = {
          dialyzerEnabled = true;
        };
      };
    };

    languages = {
      "Elixir" = {
        language_servers = [ "!lexical" "elixir-ls" "!next-ls" ];
        format_on_save = {
          external = {
            command = "mix";
            arguments = [ "format" "--stdin-filename" "{buffer_path}" "-" ];
          };
        };
      };

      "HEEX" = {
        language_servers = [ "!lexical" "elixir-ls" "!next-ls" ];
        format_on_save = {
          external = {
            command = "mix";
            arguments = [ "format" "--stdin-filename" "{buffer_path}" "-" ];
          };
        };
      };
    };

    vim_mode = true;

    # Tell Zed to use direnv and direnv can use a flake.nix environment
    load_direnv = "shell_hook";
    base_keymap = "VSCode";

    theme = {
      mode = "system";
      light = "One Light";
      dark = "One Dark";
    };

    show_whitespaces = "all";
    ui_font_size = 16;
    buffer_font_size = 16;
  };
};
```

This example adds language servers to the FHS sandbox, enables the bundled assistant, configures the terminal, and ensures remote server binaries are provided declaratively.

The `userSettings` and `userKeyMaps` options translate directly into JSON. The `extraPackages` option includes additional Nixpkgs in the FHS environment, useful for LSP servers (e.g., `pkgs.nixd`) or optional tools (e.g., `pkgs.shellcheck` for the Basher LSP).

Home Manager renders `settings.json` as read-only, which prevents Zed's GUI from saving most preference changes, including AI provider selection. Plan to manage long-term settings declaratively or temporarily disable the module when editing interactively.

Only the initial extension list can be defined declaratively; additional extensions installed through the GUI are stored within Zed's writable data directories and do not appear in `userSettings`. This follows a similar model to VSCode, where extensions require external binaries downloaded at runtime.

## LSP support

Zed downloads LSP servers into `~/.local/share/zed/languages/`. These binaries most likely will not work because of linking issues. You can workaround this with the following methods or bring your own LSP servers. Check <strong>LSP Logs → Server Info</strong> to confirm which binaries are running.

#### Nix-ld (recommended)

Enable <a href="FAQ#I&#39;ve_downloaded_a_binary,_but_I_can&#39;t_run_it,_what_can_I_do?" class="wikilink" title="programs.nix-ld"><code>programs.nix-ld</code></a> so language servers downloaded by Zed can resolve dynamic libraries without wrapping and work out of the box.

#### FHS wrapper

Use `pkgs.zed-editor.fhsWithPackages` to extend the FHS environment with additional system libraries when a language server requires them.

``` nix
pkgs.zed-editor.fhsWithPackages(
  pkgs: with pkgs; [
    openssl
    zlib
  ]
)
```

Remember that language servers started inside the wrapper do not inherit tools and libraries from nix shell. This is usually not desired because LSP may need project-level dependencies provided by nix-shell to compile and analyze the code.

#### Bring your own LSP servers

Newer versions of Zed can detect LSP servers installed in `PATH` and prefer local versions over automatically downloaded ones. Install LSP servers globally or provide them through nix shell. Nixpkgs versions of tools may be required for development on NixOS, especially for the C/C++ ecosystem. Check <strong>LSP Logs → Server Info</strong> to see which binaries are running. If automatic detection doesn't work, specify the path manually in your Zed configuration:

``` json
{
  "lsp": {
    "rust-analyzer": {
      "binary": {
        "path": "/run/current-system/sw/bin/rust-analyzer"
      }
    }
  }
}
```

Adjust the path for each language server you manage. The example above assumes rust-analyzer is installed in your system profile.

## Remote server

Zed uploads a versioned remote server binary to `~/.zed_server` on the target host. The Nixpkgs package exposes the matching binary via the `remote_server` output. When you connect to a remote machine, the client either downloads a matching server binary from upstream or pushes a local copy if `"upload_binary_over_ssh": true` is enabled. Connections fail if the versions diverge.

``` nix
home.file.".zed_server" = {
  source = "${pkgs.zed-editor.remote_server}/bin";
  recursive = true;
};
```

The `recursive = true;` setting keeps the directory writable while symlinking individual binaries, allowing Zed to add new versions when needed. This is necessary because the `~/.zed_server` folder is also used when external clients connect to the current system as a remote. Alternatively, use Home Manager's built-in option for simpler setup:

``` nix
programs.zed-editor = {
  enable = true;
  installRemoteServer = true;
};
```

To restrict remote clients to a specific server version, set `recursive = false;` to make the entire folder read-only. Zed refuses to connect if it cannot provision the required binary, so document the restriction for collaborators.

## Tips and tricks

#### Vulkan diagnostics

Run the command above to check your Vulkan support before launching Zed. Install `vulkan-tools` if the command is not available. On non-NixOS systems, you may need to wrap Zed with `nixGLVulkan` from the nixGL package.

#### Preinstall extensions

``` json
{
  "extensions": [
    "nix",
    "toml",
    "elixir"
  ]
}
```

Declaratively listing extensions ensures they are installed automatically on new systems while still allowing additional extensions to be added interactively.

#### Synchronise settings across machines

Store the entire `~/.config/zed` directory in a version-controlled dotfiles repo or manage it with Home Manager to keep settings consistent across hosts.

## Troubleshooting

#### Zed fails to start without Vulkan

If the GUI refuses to launch, confirm that `vulkan-tools` reports a working ICD. Use `nixGL` or vendor packages that supply Vulkan drivers for your GPU.

#### Remote collaboration disconnects

Ensure the remote server binary matches the client version. Re-run `home-manager switch` or update the symlink in `~/.zed_server` if the versions diverge after an update.

#### Language server missing binaries

When Zed reports missing tools, add the required executables to `programs.zed-editor.extraPackages` or wrap the server using `pkgs.writeShellApplication`.

## See also

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – Manage Zed configuration declaratively
- <a href="Graphics#Vulkan" class="wikilink" title="Graphics#Vulkan">Graphics#Vulkan</a> – Set up Vulkan on NixOS systems
- [NixOS options search for Zed](https://search.nixos.org/options?query=zed-editor)

## References

<references/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>

[^1]: Zed Industries, "Zed", Official Website, Accessed October 2025. <https://zed.dev>

[^2]: Zed Industries, "Linux", Zed Documentation, Accessed October 2025. <https://zed.dev/docs/linux>
