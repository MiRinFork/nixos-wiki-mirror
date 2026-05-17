<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: COSMIC -->

COSMIC is a <a href=":Category:Desktop_environment" class="wikilink" title="desktop environment">desktop environment</a> developed in the <a href="Rust" class="wikilink" title="Rust">Rust</a> programming language, using the iced cross platform GUI library for Rust, and Smithay as building blocks for its compositor, cosmic-comp. Cosmic-comp is comparable to smithay's own anvil compositor demonstration, just like the Wayland project uses Weston as demo compositor.

COSMIC was primarily developed for use in the [Pop!\_OS](https://pop.system76.com/) distribution.

## Installation (starting with NixOS 25.05)

COSMIC support in nixpkgs is still in development. You can follow progress via [the tracking issue](https://github.com/NixOS/nixpkgs/issues/259641).

You can enable COSMIC on your NixOS system by setting the following configuration options:

``` nix
{
  # Enable the COSMIC login manager
  services.displayManager.cosmic-greeter.enable = true;

  # Enable the COSMIC desktop environment
  services.desktopManager.cosmic.enable = true;
}
```

Support for automatic logins is present when using the \`cosmic-greeter\` login manager. All you need is the following configuration:

``` nix
{
  services.displayManager.autoLogin = {
    enable = true;
    # Replace `yourUserName` with the actual username of user who should be automatically logged in
    user = "yourUserName";
  };
}
```

Alternatively, there is a [flake](https://github.com/lilyinstarlight/nixos-cosmic) to setup COSMIC on NixOS.

### Excluding COSMIC applications

To exclude certain applications that are installed by default with COSMIC, set the module option (only available in 25.11):

## Tips and tricks

Since COSMIC is a new desktop environment and only has a beta release, there are some nuances that not everyone is familiar with. This section will contain as many as the maintainers are aware of.

### Optimization

You can slightly improve the performance of your Cosmic installation by enabling [system76's own scheduler](https://github.com/pop-os/system76-scheduler) using this code block inside of your NixOS configuration file:

``` nixos
{
  services.system76-scheduler.enable = true;
}
```

### Clipboard

Due to the security concerns, Wayland defaults to the behavior where only the focused client (window) can set the clipboard. Clipboard ownership is tied tightly to the focused client so that a background application cannot replace the clipboard contents. The intention from Wayland protocols is to improve security. But that can be an issue if you are either using a clipboard manager or perform rapid copy pasting in the terminal (like using macros in vi).

This security measure can be **bypassed**. by enabling the **unstable** [zwlr_data_control_manager_v1](https://wayland.app/protocols/wlr-data-control-unstable-v1#zwlr_data_control_manager_v1) protocol. But please note that bypassing this security measure means that **all windows now have access to the clipboard, globally**. If that is a sacrifice you are willing to make, add the following to your NixOS configuration file:

``` nix
{
  environment.sessionVariables.COSMIC_DATA_CONTROL_ENABLED = 1;
}
```

### Theming and Firefox

If you have attempted theming the appearance of the COSMIC DE but don't see it reflected in Firefox, that is because Firefox is using the libadwaita theme. That behaviour needs to be disabled. It can be achieved by setting the Firefox configuration option \`widget.gtk.libadwaita-colors.enabled\` to \`false\`. On NixOS, the declarative method to do that is the following:

``` nix
{
  programs.firefox.preferences = {
    # disable libadwaita theming for Firefox
    "widget.gtk.libadwaita-colors.enabled" = false;
  };
}
```

## Configuration

COSMIC stores its configuration in [Rusty Object Notation (RON)](https://github.com/ron-rs/ron) files. By default, the system-wide configuration is used unless user-specific files are present. Currently, NixOS does not provide declarative options for configuring COSMIC through the NixOS module system.

### System-wide configuration

If no user configuration exists, COSMIC falls back to system-wide defaults. These configuration files are bundled with each cosmic package and are located in their respective `[package]/share/cosmic/` directories.

When COSMIC is enabled using the NixOS option `services.desktopManager.cosmic.enable = true;`, the `/share/cosmic` directories from the relevant packages are symlinked into `/run/current-system/sw`.

This allows COSMIC to locate and apply the default configurations at runtime.

### User configuration

User configuration files are located in `~/.config/cosmic/`.

They override the system defaults when present, and are automatically created or updated when using the COSMIC Settings application.

### Component-specific configuration

Each COSMIC component maintains its own configuration files. For example, the COSMIC Panel reads and stores its configuration at `~/.config/cosmic/com.system76.CosmicPanel.Panel` Components can be configured by modifying these files directly. For instance, to place the Time and Notifications applets in the center of the COSMIC panel, create the following file:

Most configuration changes are applied immediately without needing to restart the session.

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a>
