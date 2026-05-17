<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: St -->

`st` the suckless terminal or the simple terminal

most things here apply for dwm and other suckless software too

The examples below only assume you are running Linux (at the time of this writing, darwin/OS X does not support `st`).

## Installing

### NixOS

Add `st` to the list of available packages in your `configuration.nix`.

System-wide:

``` nix
environment.systemPackages = with pkgs; [
  st
];
```

Only available to certain users:

``` nix
users.users.alice.packages = with pkgs; [
  st
];
```

### Other Linux distributions

You will need to write a roughly equivalent nix expression and install it the imperative way.

E.g.

`my-custom-st`

``` nix
# pinned nixpkgs from nix.dev > "toward reproducibility"
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/3590f02e7d5760e52072c1a729ee2250b5560746.tar.gz") {}
}:
# specifics elided for brevity
pkgs.st.overrideAttrs { ... }
```

Followed by:

``` console
$ nix-env -i -f my-custom-st
```

## Patching

Most customization of `st` that alters its base feature set comes in the form of applying patches to the source code.

### Obtaining hashes

To apply a patch you need to obtain the hash, the hash should be obtained with the following command

``` console
$ nix-prefetch-url <url>
```

example

``` console
$ nix-prefetch-url https://st.suckless.org/patches/rightclickpaste/st-rightclickpaste-0.8.2.diff
```

### Patches

Can be applied by including them in an attribute override in your systemPackages declaration:

``` nix
environment.systemPackages = with pkgs; [
  (st.overrideAttrs (oldAttrs: rec {
    patches = [
      # You can specify local patches
      ./path/to/local.diff
      # Fetch them directly from `st.suckless.org`
      (fetchpatch {
        url = "https://st.suckless.org/patches/rightclickpaste/st-rightclickpaste-0.8.2.diff";
        sha256 = "1y4fkwn911avwk3nq2cqmgb2rynbqibgcpx7yriir0lf2x2ww1b6";
      })
      # Or from any other source
      (fetchpatch {
        url = "https://raw.githubusercontent.com/fooUser/barRepo/1111111/somepatch.diff";
        sha256 = "222222222222222222222222222222222222222222";
      })
    ];
  }))
];
```

### Patch Dependencies

Can be included with the `buildInputs` line like in the following ligature patch example:

``` nix
environment.systemPackages = with pkgs; [
  (st.overrideAttrs (oldAttrs: rec {
    buildInputs = oldAttrs.buildInputs ++ [ harfbuzz ];
    patches = [
      (fetchpatch {
        url = "https://st.suckless.org/patches/ligatures/0.8.3/st-ligatures-20200430-0.8.3.diff";
        sha256 = "67b668c77677bfcaff42031e2656ce9cf173275e1dfd6f72587e8e8726298f09";
      })
    ];
  }))
];
```

## Config

Configuration is accomplished through a `config.h` file.

### Header file

``` nix
environment.systemPackages = with pkgs; [
  (st.overrideAttrs (oldAttrs: rec {
    # Using a local file
    configFile = writeText "config.def.h" (builtins.readFile ./path/to/local/config.h);
    # Or one pulled from GitHub
    # configFile = writeText "config.def.h" (builtins.readFile "${fetchFromGitHub { owner = "LukeSmithxyz"; repo = "st"; rev = "8ab3d03681479263a11b05f7f1b53157f61e8c3b"; sha256 = "1brwnyi1hr56840cdx0qw2y19hpr0haw4la9n0rqdn0r2chl8vag"; }}/config.h");
    postPatch = "${oldAttrs.postPatch}\n cp ${configFile} config.def.h";
  }))
];
```

## All together now

``` nix
environment.systemPackages = with pkgs; [
  (st.overrideAttrs (oldAttrs: rec {
    # ligatures dependency
    buildInputs = oldAttrs.buildInputs ++ [ harfbuzz ];
    patches = [
      # ligatures patch
      (fetchpatch {
        url = "https://st.suckless.org/patches/ligatures/0.8.3/st-ligatures-20200430-0.8.3.diff";
        sha256 = "67b668c77677bfcaff42031e2656ce9cf173275e1dfd6f72587e8e8726298f09";
      })
    ];
    # version controlled config file
    configFile = writeText "config.def.h" (builtins.readFile "${fetchFromGitHub { owner = "me"; repo = "my-custom-st-stuff"; rev = "1111222233334444"; sha256 = "11111111111111111111111111111111111"; }}/config.h");
    postPatch = oldAttrs.postPatch ++ ''cp ${configFile} config.def.h'';
  }))
];
```

## Using DWM

However, this will not work for `dwm`. (Probably `services.xserver.windowManager.dwm` can only see the `dwm` in `pkgs`, not the one in `environment.systemPackages`.) But you can use an overlay, like this:

``` nix
nixpkgs.overlays = [
  (self: super: {
    dwm = super.dwm.overrideAttrs (oldAttrs: rec {
      patches = [
        ./path/to/my-dwm-patch.patch
        ];
      configFile = super.writeText "config.h" (builtins.readFile ./dwm-config.h);
      postPatch = oldAttrs.postPatch or "" + "\necho 'Using own config file...'\n cp ${configFile} config.def.h";
      });
    })
  ];
```

It should also be mentioned that the `st.overrideAttrs` should be added to the overlays when using `dwm` with dwm changes and st changes the overlay could look like this

``` nix
nixpkgs.overlays = [
  (self: super: {
    dwm = super.dwm.overrideAttrs (oldAttrs: rec {
      patches = [
        ./path/to/my-dwm-patch.patch
        ];
      configFile = super.writeText "config.h" (builtins.readFile ./dwm-config.h);
      postPatch = oldAttrs.postPatch or "" + "\necho 'Using own config file...'\n cp ${configFile} config.def.h";
      });
    })
    st = super.st.overrideAttrs (oldAttrs: rec {
      patches = [
        ./path/to/my-dwm-patch.patch
        ];
      configFile = super.writeText "config.h" (builtins.readFile ./st-config.h);
      postPatch = "${oldAttrs.postPatch}\ncp ${configFile} config.def.h\n"
      });
    })
  ];
```

## Remote config

If instead, you would prefer to build a pre-configured repository or realize more intense configuration, fork the mainline repository (or find one you like) and replace the value of the `src` attribute in the override.

### Forks

Luke smiths st fork is used as the example

``` nix
environment.systemPackages = with pkgs; [
  (st.overrideAttrs (oldAttrs: rec {
    src = fetchFromGitHub {
      owner = "LukeSmithxyz";
      repo = "st";
      rev = "8ab3d03681479263a11b05f7f1b53157f61e8c3b";
      sha256 = "1brwnyi1hr56840cdx0qw2y19hpr0haw4la9n0rqdn0r2chl8vag";
    };
    # Make sure you include whatever dependencies the fork needs to build properly!
    buildInputs = oldAttrs.buildInputs ++ [ harfbuzz ];
  # If you want it to be always up to date use fetchTarball instead of fetchFromGitHub
  # src = builtins.fetchTarball {
  #   url = "https://github.com/lukesmithxyz/st/archive/master.tar.gz";
  # };
  }))
];
```

## Troubleshooting

### See files after patching

``` console
$ nix-shell st-test.nix
$ unpackPhase
$ ls
$ cd theunpackeddir
$ patchPhase
```

[Additional phases](https://nixos.org/manual/nixpkgs/stable/#sec-stdenv-phases)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
