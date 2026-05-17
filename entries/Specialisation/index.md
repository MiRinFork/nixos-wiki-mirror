<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Specialisation -->

Specialisations allow you to define variations of your system configuration. For instance, if you don't usually use GPU, you might create a base system with your GPU disabled and create a dedicated specialization with Nvidia/AMD drivers installed - later, during boot, you can choose which configuration you want to boot into this time.

## Config

Specialisations are defined with the following options \[1\]: <https://search.nixos.org/options?from=0&size=50&sort=relevance&query=specialisation>

``` nix
specialisation = {
  chani.configuration = {
    services.xserver.desktopManager.plasma5.enable = true;
  };

  paul = {
    inheritParentConfig = false;
    configuration = {
      system.nixos.tags = [ "paul" ];
      services.xserver.desktopManager.gnome.enable = true;
      users.users.paul = {
        isNormalUser = true;
        uid = 1002;
        extraGroups = [ "networkmanager" "video" ];
      };
      services.xserver.displayManager.autoLogin = {
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

In this example, the `chani` specialisation inherits the parent config (that contains the `specialisation` directive), but additionally activates the plasma5 desktop. The `paul` specialisation on the other hand does not `inheritParentConfig` and defines its own one from scratch instead.

## Special case: the default non-specialized entry

Specializations are receiving options in addition to your default configuration, but what if you want to have options in your default configuration that shouldn't be pulled by the specializations?

Use the conditional `config.specialisation != {}` to declare values for the non-specialized case. For example, you could write a module (as variable, or separate file), imported from `configuration.nix` via `imports = [...]` like this:

``` nix
({ lib, config, pkgs, ... }: {
  config = lib.mkIf (config.specialisation != {}) {
    # Config that should only apply to the default system, not the specialised ones

    # example
    hardware.opengl.extraPackages = with pkgs; [ vaapiIntel vaapiVdpau ];
  };
})
```

However, if there are no specialisations defined, then `config.specialisation != {}` always evaluate to `false`.

## Activating a specialization

After rebuilding your system, you can choose a specialisation during boot; it's also possible to switch into a specialisation at runtime - following the example above, we'd run:

``` console
$ nixos-rebuild switch --specialisation chani
```

Note that not all configurations can be fully switched into at runtime - e.g. if your specialization uses a different kernel, switching into it will not actually reload the kernel (but if you were to restart your computer and pick the specialisation from the boot menu, the alternative kernel would get loaded).

## Further reading

\[1\] <https://www.tweag.io/blog/2022-08-18-nixos-specialisations/>

\[2\] <https://discourse.nixos.org/t/nixos-specialisations-how-do-you-use-them/10367/4>

\[3\] <https://discourse.nixos.org/t/what-does-mkdefault-do-exactly/9028>
