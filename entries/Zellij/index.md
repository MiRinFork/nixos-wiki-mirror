<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zellij -->

[Zellij](https://zellij.dev/) is a terminal multiplexer: it enables a number of terminals (or windows), each running a separate program, to be created, accessed, and controlled from a single screen. Zellij may be detached from a screen and continue running in the background, then later reattached.

## Installation

#### Shell

To temporarily use zellij in a shell environment without modifying your system configuration, you can run: This makes the zellij available in your current shell. You can then launch zellij by typing `zellij`.

## Configuration

can be configured using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

As an example:

#### Using Plugins

Zellij offers a WebAssembly / WASI plugin system, allowing plugin developers to develop plugins in many different languages. Plugins can be configured using `programs.zellij.plugins`. In nixpkgs, they can be found in the [zellijPlugins](https://search.nixos.org/packages?type=packages&query=zellijPlugins) namespace.

This will generate `~/.config/zellij/config.kdl`, with something like this:

## Packaging Plugins

All plugins are packaged in the `pkgs/by-name/ze/zellij/plugins/` folder. Currently, only Rust plugins are packaged, but if you figure out how to package other languages, contributions are welcome.

To add a new plugin, you can just use [nix-init](https://github.com/nix-community/nix-init) like this:

If the repository name starts with `zellij`, you should omit it in the actual package name. `zellijPlugins.autolock` looks better than `zellijPlugins.zellij-autolock`.

After you have generated the initial definition file, remove all dependencies that were automatically set by nix-init. They are not needed when compiling a WASM binary. If the plugin depends on something at runtime, read the next section.

#### Specifying runtime dependencies

Runtime dependencies are packages that will be used by the plugin inside a Zellij session. Those are specified in `passthru.runtimeDeps` attribute from `pkgsBuildBuild` attrset.

Since we compile all plugins for WASI, everything that the plugin gets as derivation arguments is also compiled for WASI. Some packages (for example `coreutils`) might not be available on WASI, so we need to use `pkgsBuildBuild` attrs set (which points to the user's system).

If you are wondering why `pkgsBuildBuild` is named like that, refer to [the docs on cross-compilation](https://nixos.org/manual/nixpkgs/unstable/#possible-dependency-types).

#### Overriding plugins

Plugins use a wrapper for additional post-processing, like stripping unnecessary information from `pluginDrv.name`. So naїve override won't work, as it overrides the wrapper and not the plugin itself. Instead, you should override the unwrapped version and then pass that to the wrapper:

## See also

- [Zellij documentation](https://zellij.dev/documentation/)

<a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a>
