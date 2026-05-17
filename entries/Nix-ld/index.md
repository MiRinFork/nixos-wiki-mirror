<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix-ld -->

## Nix-ld

[Nix-ld](https://github.com/nix-community/nix-ld) is a module that is really practical to enable to have a more "traditional" experience in NixOS by recreating the loaders like `/lib/ld-linux.so.2`, needed to run any executable that is not patched by nix. It is not needed when installing regular packages "the nix way", but it is really handy to quickly test a binary not packaged for nix, or when developing, for instance in <a href="JavaScript" class="wikilink" title="javascript">javascript</a>/<a href="node.js" class="wikilink" title="nodejs">nodejs</a>, since these languages often pre-download many binaries (of course, a proper packaging is of course better, but potentially too tedious when quickly prototyping).

To enable it, you just need to put in your `/etc/nixos/configuration.nix` the following:

``` nixos
programs.nix-ld = {
    enable = true;
    libraries = with pkgs; [
      ## Put here any library that is required when running a package
      ## ...
      ## Uncomment if you want to use the libraries provided by default in the steam distribution
      ## but this is quite far from being exhaustive
      ## https://github.com/NixOS/nixpkgs/issues/354513
      # (pkgs.runCommand "steamrun-lib" {} "mkdir $out; ln -s ${pkgs.steam-run.fhsenv}/usr/lib64 $out/lib")
    ];
  };
  ## Uncomment if you used steamrun's libraries
  # nixpkgs.config.allowUnfree = true;
```

By default, nix-ld comes with only a few libraries, and you need to manually add your own. A simple (but a bit tedious) approach to know which library to add is to run the program, and check for errors like:

``` bash
$ ./blender
./blender: error while loading shared libraries: libxkbcommon.so.0: cannot open shared object file: No such file or directory
```

Then, you can search the package that provides the missing library via:

``` bash
$ nix run github:nix-community/nix-index-database -- lib/libxkbcommon.so.0 --top-level
libxkbcommon.out                                      0 s /nix/store/4di7f8w515xl6grwv13pk6855awav0b1-libxkbcommon-1.8.1/lib/libxkbcommon.so.0
libxkbcommon.out                                342,952 x /nix/store/4di7f8w515xl6grwv13pk6855awav0b1-libxkbcommon-1.8.1/lib/libxkbcommon.so.0.8.1
```

so here you would add for instance xorg.libXxf86vm.

It is however a bit long to find all these libraries, so you may want to just copy/paste this pre-made list until [something is done to provide a decent list in Nixpkgs](https://github.com/NixOS/nixpkgs/issues/354513) (to avoid cluttering you configuration, copy it in a separate nix file and import it it your main configuration):

``` nixos
{ config, pkgs, lib, ... }:
{
  # Allow unfree packages
  nixpkgs.config.allowUnfree = true;
  # Automatically creates a loader in /lib/* to avoid patching stuff
  # To disable it temporarily use
  # unset NIX_LD
  programs.nix-ld = {
    enable = true;
    libraries = with pkgs; [
      # List by default
      zlib
      zstd
      stdenv.cc.cc
      curl
      openssl
      attr
      libssh
      bzip2
      libxml2
      acl
      libsodium
      util-linux
      xz
      systemd
      
      # My own additions
      xorg.libXcomposite
      xorg.libXtst
      xorg.libXrandr
      xorg.libXext
      xorg.libX11
      xorg.libXfixes
      libGL
      libva
      pipewire
      xorg.libxcb
      xorg.libXdamage
      xorg.libxshmfence
      xorg.libXxf86vm
      libelf

      # Required
      glib
      gtk2

      # Inspired by steam
      # https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/st/steam/package.nix#L36-L85
      networkmanager      
      vulkan-loader
      libgbm
      libdrm
      libxcrypt
      coreutils
      pciutils
      zenity
      # glibc_multi.bin # Seems to cause issue in ARM
      
      # # Without these it silently fails
      xorg.libXinerama
      xorg.libXcursor
      xorg.libXrender
      xorg.libXScrnSaver
      xorg.libXi
      xorg.libSM
      xorg.libICE
      gnome2.GConf
      nspr
      nss
      cups
      libcap
      SDL2
      libusb1
      dbus-glib
      ffmpeg
      # Only libraries are needed from those two
      libudev0-shim
      
      # needed to run unity
      gtk3
      icu
      libnotify
      gsettings-desktop-schemas
      # https://github.com/NixOS/nixpkgs/issues/72282
      # https://github.com/NixOS/nixpkgs/blob/2e87260fafdd3d18aa1719246fd704b35e55b0f2/pkgs/applications/misc/joplin-desktop/default.nix#L16
      # log in /home/leo/.config/unity3d/Editor.log
      # it will segfault when opening files if you don’t do:
      # export XDG_DATA_DIRS=/nix/store/0nfsywbk0qml4faa7sk3sdfmbd85b7ra-gsettings-desktop-schemas-43.0/share/gsettings-schemas/gsettings-desktop-schemas-43.0:/nix/store/rkscn1raa3x850zq7jp9q3j5ghcf6zi2-gtk+3-3.24.35/share/gsettings-schemas/gtk+3-3.24.35/:$XDG_DATA_DIRS
      # other issue: (Unity:377230): GLib-GIO-CRITICAL **: 21:09:04.706: g_dbus_proxy_call_sync_internal: assertion 'G_IS_DBUS_PROXY (proxy)' failed
      
      # Verified games requirements
      xorg.libXt
      xorg.libXmu
      libogg
      libvorbis
      SDL
      SDL2_image
      glew110
      libidn
      tbb
      
      # Other things from runtime
      flac
      freeglut
      libjpeg
      libpng
      libpng12
      libsamplerate
      libmikmod
      libtheora
      libtiff
      pixman
      speex
      SDL_image
      SDL_ttf
      SDL_mixer
      SDL2_ttf
      SDL2_mixer
      libappindicator-gtk2
      libdbusmenu-gtk2
      libindicator-gtk2
      libcaca
      libcanberra
      libgcrypt
      libvpx
      librsvg
      xorg.libXft
      libvdpau
      # ...
      # Some more libraries that I needed to run programs
      pango
      cairo
      atk
      gdk-pixbuf
      fontconfig
      freetype
      dbus
      alsa-lib
      expat
      # for blender
      libxkbcommon

      libxcrypt-legacy # For natron
      libGLU # For natron

      # Appimages need fuse, e.g. https://musescore.org/fr/download/musescore-x86_64.AppImage
      fuse
      e2fsprogs
    ];
  };  

}
```

Once activated (you may need to reboot the first time you enable nix-ld to make sure the environment variables are properly set), I was for instance able to run blender 4.4.3 using the [unpatched binary provided by the blender foundation](https://download.blender.org/release/Blender4.4/blender-4.4.3-linux-x64.tar.xz), and develop npm projects with `npm install` like in any normal linux distribution.
