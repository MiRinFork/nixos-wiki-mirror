<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Installing Nix on Crostini -->

This Wiki page describes the process required to get up and running on Chrome OS within Crostini. This does not talk about Crouton and assumes you have already installed Nix. [Guide to Installation](https://nixos.org/nix/manual/#chap-installation).

Once you have Nix installed, there are a few things that need to be done.

## Home-Manager

Using [Home-manager](https://github.com/rycee/home-manager/) is pretty straight-forward, and is an easy way to manage Nix and install packages. The documentation on the Github repo is sufficient.

## Registering Applications with Chrome OS

This feature of Crostini expects .desktop files to be dropped in the appropriate places. (namely somewhere under `$XDG_DATA`).

Applications are registered with Chrome OS using a service running within the container called *cros-garcon*. As it is a simple systemd service, we can easily extend it to look in nix-specific locations.

First we extend the service with new environment variables

``` console
$ mkdir -p ~/.config/systemd/user/cros-garcon.service.d/
```

followed by.

``` console
$ cat > ~/.config/systemd/user/cros-garcon.service.d/override.conf <<EOF
[Service]
Environment="PATH=%h/.nix-profile/bin:/usr/local/sbin:/usr/local/bin:/usr/local/games:/usr/sbin:/usr/bin:/usr/games:/sbin:/bin"
Environment="XDG_DATA_DIRS=%h/.nix-profile/share:%h/.local/share:%h/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share:/usr/share"
```

You can also set this inside your Home-Manager configuration:

``` nix
{ ... }:
{
    xdg.configFile."systemd/user/cros-garcon.service.d/override.conf".text = ''
      [Service]
      Environment="PATH=%h/.nix-profile/bin:/usr/local/sbin:/usr/local/bin:/usr/local/games:/usr/sbin:/usr/bin:/usr/games:/sbin:/bin"
      Environment="XDG_DATA_DIRS=%h/.nix-profile/share:%h/.local/share:%h/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share:/usr/share"
    '';
}
```

Then we need to restart our container. I found restarting the whole laptop to be the easiest and most effective method.

After this, we can simply start adding GUI packages to our home-manager configuration. Alternatively, if we are not using home-manager, then we can directly install packages:

``` console
$ nix-env -i slack
```

Note: These instructions were adapted from the following post [on Reddit](https://www.reddit.com/r/Crostini/comments/9lazhn/environment_variables_for_launcher_applications/e769u4y/)

## Graphical applications

Thanks to the usage of VirtGL as the GPU driver, you can easily run applications that depend on OpenGL/Vulkan by using [NixGL](https://github.com/nix-community/nixGL):

``` console
$ nix run --impure github:guibou/nixGL -- program
```

If you are setting up it in your Flakes/Home-Manager configuration, you can use:

``` nix
{
  outputs = { nixgl, nixpkgs, home-manager, ... }:
  let
    pkgs = import nixpkgs {
      system = "x86_64-linux"; # or "aarch64-linux"
      overlays = [ nixgl.overlay ];
    };
  in
  {
    homeConfigurations.penguin = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      modules = [
        ({ pkgs, ...}: {
          home.packages = with pkgs; [ nixgl.nixGLMesa ];
        })
      ];
    };
  }
}
```

Using `nixgl.nixGLMesa` instead of `nixgl.auto.nixGLDefault` allow usage of pure evaluation.

Afterwards, you can call programs with:

``` console
$ nixGLMesa program
```
