<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Specialisation -->

Specialisations allow you to define variations of your system configuration. For instance, if you don't usually use GPU, you might create a base system with your GPU disabled and create a dedicated specialisation with Nvidia/AMD drivers installed. Then, during boot, you can choose which configuration you want to boot into this time.

## Config

Specialisations are defined with the following options[^1]: <https://search.nixos.org/options?from=0&size=50&sort=relevance&query=specialisation>

``` nix
specialisation = {
  chani.configuration = {
    services.desktopManager.plasma6.enable = true;
  };

  paul = {
    inheritParentConfig = false;
    configuration = {
      system.nixos.tags = [ "paul" ];
      services.desktopManager.gnome.enable = true;
      users.users.paul = {
        isNormalUser = true;
        uid = 1002;
        extraGroups = [ "networkmanager" "video" ];
      };
      services.displayManager.autoLogin = {
        enable = true;
        user = "paul";
      };
      environment.systemPackages = with pkgs; [
        dune-release
      ];
    };
  };
};
```

In this example, the `chani` specialisation inherits the parent configuration (which contains the `specialisation` directive), but additionally activates the `plasma6` desktop. The `paul` specialisation does not inherit the parent configuration, and defines its own configuration from scratch instead.

## Special case: the default non-specialised entry

Specialisations will receive options in addition to your default configuration. If you want to have options in your default configuration that shouldn't be pulled by the specialisations, use the conditional `config.specialisation != {}` to declare values for the non-specialised case.

For example, you could write a module (as a variable, or a separate file), imported from `configuration.nix` via `imports = [...]` like this:

``` nix
({ lib, config, pkgs, ... }: {
  config = lib.mkIf (config.specialisation != {}) {
    # Config that should only apply to the default system, not the specialised ones

    # example
    hardware.opengl.extraPackages = with pkgs; [ vaapiIntel vaapiVdpau ];
  };
})
```

However, if there are no specialisations defined, then `config.specialisation != {}` always evaluates to `false`.

## Activating a specialisation

After rebuilding your system, you can choose a specialisation during boot. It's also possible to switch into a specialisation at runtime - following the example above, you would run:

``` console
$ nixos-rebuild switch --specialisation chani
```

Not all configurations can be fully switched into at runtime. For example, if your specialisation uses a different kernel, switching into it will not actually reload the kernel, but if you were to restart your computer and pick the specialisation from the boot menu, the alternative kernel would be loaded.

## Further reading

- <https://discourse.nixos.org/t/nixos-specialisations-how-do-you-use-them/>

[^1]: <https://www.tweag.io/blog/2022-08-18-nixos-specialisations/>
