<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Overlays -->

> Overlays are Nix functions which accept two arguments, conventionally called `final` and `prev` (formerly also `self` and `super`), and return a set of packages. ... Overlays are similar to other methods for customizing Nixpkgs, in particular the packageOverrides ... Indeed, packageOverrides acts as an overlay with only the `prev` (`super`) argument. It is therefore appropriate for basic use, but overlays are more powerful and easier to distribute.

<cite>From the [Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#sec-overlays-definition)</cite>

Overlays provide a method to extend and change nixpkgs. They replace constructs like `packageOverride` and `overridePackages`.

Consider a simple example of setting the default proxy in Google Chrome:

``` nix
final: prev: {
   google-chrome = prev.google-chrome.override {
     commandLineArgs =
       "--proxy-server='https=127.0.0.1:3128;http=127.0.0.1:3128'";
   };
};
```

## Data flow of overlays

The data flow of overlays, especially regarding `prev` and `final` arguments can be a bit confusing if you are not familiar with how overlays work. This graph shows the data flow:

<figure>
<img src="Dram-overlay-final-prev.png" title="Dram-overlay-final-prev.png" />
<figcaption>Dram-overlay-final-prev.png</figcaption>
</figure>

Here the main package set is extended with two overlays, ext-1 and ext-2. `x // y` is represented by a `//` box with `x` coming in from the left and `y` from above.

As you can see, `final` is the same for every stage, but `prev` comes from only the stage before. So when you define an attribute `foo` in the set to override it, within that overlay `final.foo` will be its version, and `prev.foo` will be the non-overriden version. This is why you see patterns like `foo = prev.foo.override { ... }`.

The alternate names `self` and `super` might remind you of inheritance in object-oriented languages. In fact, overlays are exactly the same thing as subclasses, with regards to overriding and calling methods. This data flow is also how objects know which method to call. This is probably how the two arguments got those names, too.

## Data flow of overlays (alternative explanation)

Source: <https://discourse.nixos.org/t/how-to-exclude-packages/13039/4>

I recommend final: prev. That's also easier to explain. The first argument is nixpkgs with your overlay applied, and the second argument is nixpkgs without your overlay. So the “final” nixpkgs and the “previous” nixpkgs. This allows you to access things you defined in your overlay along with things from nixpkgs itself.

``` nix
final: prev: { f = final.firefox; }
```

would work, but

``` nix
final: prev: { f = prev.firefox; }
```

would make more sense. This could be useful:

``` nix
final: prev: {
  firefox = prev.firefox.override { ... };
  myBrowser = final.firefox;
}
```

And

``` nix
final: prev: { firefox = final.firefox.override { ... }; }
```

would cause infinite recursion.

## Using overlays

### Applying overlays manually

#### In standalone nix code

##### In a shell.nix

When writing standalone nix code, for example a `shell.nix` for a project, one usually starts by importing nixpkgs: `let pkgs = import `<nixpkgs>` {}`. To use an overlay in this context, replace that by:

``` nix
import <nixpkgs> { overlays = [ overlay1 overlay2 ]; }
```

##### In a Nix flake

In a Nix flake, nixpkgs will be coming from the inputs. It is common to write something like

``` nix
let pkgs = nixpkgs.legacyPackages.${system}
```

where `system` is a variable containing eg. `"x86_64-linux"`. In order to apply overlays to this, one can do either of:

``` nix
let pkgs = (nixpkgs.legacyPackages.${system}.extend overlay1).extend overlay2
```

or, using the `import` function:

``` nix
let pkgs = import nixpkgs { inherit system; overlays = [ overlay1 overlay2 ]; }
```

#### In NixOS

In `/etc/nixos/configuration.nix`, use the `nixpkgs.overlays` option:

``` nix
{ config, pkgs, lib, ... }:
{
   # [...]
   nixpkgs.overlays = [ (final: prev: /* overlay goes here */) ];
}
```

Note that this does not impact the usage of nix on the command line, only your NixOS configuration.

#### In <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

In `~/.config/nixpkgs/home.conf`, use the `nixpkgs.overlays` option:

``` nix
{ config, pkgs, lib, ... }:
{
   # [...]
   nixpkgs.overlays = [ (final: prev: /* overlay goes here */) ];
}
```

Note that this does not impact the usage of nix on the command line or in your your NixOS configuration, only your home-manager configuration.

### Applying overlays automatically

#### On the user level

A list of overlays placed into `~/.config/nixpkgs/overlays.nix` will be automatically loaded by all nix tools run as your user (hence not nixos-rebuild).

Alternatively, you can put each overlay in its own .nix file under your `~/.config/nixpkgs/overlays` directory.

#### On the system level

If you want your overlays to be accessible by nix tools and also in the system-wide configuration, add `nixpkgs-overlays` to your `NIX_PATH`:

``` shell
NIX_PATH="$NIX_PATH:nixpkgs-overlays=/etc/nixos/overlays"
```

Currently `nixos-rebuild` only works with a <nixpkgs-overlays> path that is a directory.

There is a configuration option `nixpkgs.overlays`. Overlays set here will **not** be automatically applied by nix tools.

##### Using `nixpkgs.overlays` from `configuration.nix` as <nixpkgs-overlays> in your NIX_PATH

Configuration below will allow all of the Nix tools to see the exact same overlay as is defined in your `configuration.nix` in the option.

The core of the idea here is to point the `nixpkgs-overlays` element of `NIX_PATH` to a "compatibility" overlay, which will load all of the overlays defined in your NixOS system configuration and apply them to its own input. Thus, when various Nix tools attempt to load the overlays from the `nixpkgs-overlays` element of `NIX_PATH`, they will get contents of overlays defined in your NixOS system config.

First, in the `configuration.nix` file, depending on whether your `configuration.nix` already defines `nix.nixPath`, add one of these definitions:

``` nix
{ config, pkgs, options, ... }: {
  # With an existing `nix.nixPath` entry:
  nix.nixPath = [
    # Add the following to existing entries.
    "nixpkgs-overlays=/etc/nixos/overlays-compat/"
  ];

  # Without any `nix.nixPath` entry:
  nix.nixPath =
    # Prepend default nixPath values.
    options.nix.nixPath.default ++
    # Append our nixpkgs-overlays.
    [ "nixpkgs-overlays=/etc/nixos/overlays-compat/" ]
  ;
}
```

Then, add the following contents to `/etc/nixos/overlays-compat/overlays.nix`[^1]:

``` nix
final: prev:
with prev.lib;
let
  # Load the system config and get the `nixpkgs.overlays` option
  overlays = (import <nixpkgs/nixos> { }).config.nixpkgs.overlays;
in
  # Apply all overlays to the input of the current "main" overlay
  foldl' (flip extends) (_: prev) overlays final
```

The `/etc/nixos/overlays-compat` directory should contain a single `overlays.nix` file to be understood by the Nix tooling, but the location of this directory can be arbitrary, as long as it is set correctly in the `nix.nixPath` option.

## Examples of overlays

Here are a few example usages of overlays.

### Overriding a version

Assume you want the original version of sl, not the fork that nixpkgs ships. First, you have to choose the exact revision you want nix to build. Here we will build revision 923e7d7ebc5c1f009755bdeb789ac25658ccce03. The core of the method is to override the attribute `src` of the derivation with an updated value. Here we use `fetchFromGitHub` because sl is hosted on github, but other locations need other functions. To see the original derivation, run `nix edit -f "`<nixpkgs>`" sl`. This method will fail if the build system changed or new dependencies are required.

``` nix
final: prev:
{
  sl = prev.sl.overrideAttrs (old: {
    src = prev.fetchFromGitHub {
      owner = "mtoyoda";
      repo = "sl";
      rev = "923e7d7ebc5c1f009755bdeb789ac25658ccce03";
      # If you don't know the hash, the first time, set:
      # hash = "";
      # then nix will fail the build with such an error message:
      # hash mismatch in fixed-output derivation '/nix/store/m1ga09c0z1a6n7rj8ky3s31dpgalsn0n-source':
      # specified: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
      # got:    sha256-173gxk0ymiw94glyjzjizp8bv8g72gwkjhacigd1an09jshdrjb4
      hash = "sha256-173gxk0ymiw94glyjzjizp8bv8g72gwkjhacigd1an09jshdrjb4";
    };
  });
}
```

### Adding patches

It is easy to add patches to a nix package:

``` nix
final: prev:
{
  sl = prev.sl.overrideAttrs (old: {
    patches = (old.patches or []) ++ [
      (prev.fetchpatch {
        url = "https://github.com/charlieLehman/sl/commit/e20abbd7e1ee26af53f34451a8f7ad79b27a4c0a.patch";
        hash = "07sx98d422589gxr8wflfpkdd0k44kbagxl3b51i56ky2wfix7rc";
      })
      # alternatively if you have a local patch,
      /path/to/file.patch
      # or a relative path (relative to the current nix file)
      ./relative.patch
    ];
  });
}
```

### Compilation options

Some packages provide compilation options. Those are not easily disoverable; to find them you need to have a look at the source. For example, with `nix edit -f "`<nixpkgs>`" pass` one can see that pass can be compiled with or without dependencies on X11 with the `x11Support` argument. Here is how you can remove X11 dependencies:

``` nix
final: prev:
{
  pass = prev.pass.override { x11Support = false; };
}
```

### Overriding a package inside a scope

Some packages are not in the top level of nixpkgs but inside a *scope*. For example all <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> packages are in the `gnome` attribute set and <a href="Xfce" class="wikilink" title="Xfce">Xfce</a> packages inside `xfce`. These attributes are often *scopes* and must be overriden specially. Here is an example of patching `gnome.mutter` and `gnome.gnome-control-center`.

``` nix
# elements of nixpkgs must be taken from final and prev
final: prev: {
  # elements of pkgs.gnome must be taken from gfinal and gprev
  gnome = prev.gnome.overrideScope (gfinal: gprev: {
    mutter = gprev.mutter.overrideAttrs (oldAttrs: {
      patches = oldAttrs.patches ++ [
        # https://salsa.debian.org/gnome-team/mutter/-/blob/ubuntu/master/debian/patches/x11-Add-support-for-fractional-scaling-using-Randr.patch
        (prev.fetchpatch {
          url = "https://salsa.debian.org/gnome-team/mutter/-/raw/91d9bdafd5d624fe1f40f4be48663014830eee78/debian/patches/x11-Add-support-for-fractional-scaling-using-Randr.patch";
          hash = "m6PKjVxhGVuzsMBVA82UyJ6Cb1s6SMI0eRooa+F2MY8=";
        })
    ];
    });
    gnome-control-center = gprev.gnome-control-center.overrideAttrs (oldAttrs: {
      patches = oldAttrs.patches ++ [
        # https://salsa.debian.org/gnome-team/gnome-control-center/-/blob/ubuntu/master/debian/patches/ubuntu/display-Support-UI-scaled-logical-monitor-mode.patch
        (prev.fetchpatch {
          url = "https://salsa.debian.org/gnome-team/gnome-control-center/-/raw/f185f33fb200cc963c062c7a82920a085f696978/debian/patches/ubuntu/display-Support-UI-scaled-logical-monitor-mode.patch";
          hash = "XBMD0chaV6GGg3R9/rQnsBejXspomVZz/a4Bvv/AHCA=";
        })
        # https://salsa.debian.org/gnome-team/gnome-control-center/-/blob/ubuntu/master/debian/patches/ubuntu/display-Allow-fractional-scaling-to-be-enabled.patch
        (prev.fetchpatch {
          url = "https://salsa.debian.org/gnome-team/gnome-control-center/-/raw/f185f33fb200cc963c062c7a82920a085f696978/debian/patches/ubuntu/display-Allow-fractional-scaling-to-be-enabled.patch";
          hash = "Pm6PTmsL2bW9JAHD1u0oUEqD1PCIErOlcuqlwvP593I=";
        })
      ];
    });
  });
}
```

### Overriding a package inside an extensible attribute set

Here is an example of adding plugins to `vimPlugins`.

``` nix
final: prev: {
  vimPlugins = prev.vimPlugins.extend (final': prev': {
    indent-blankline-nvim-lua = prev.callPackage ../packages/indent-blankline-nvim-lua { };
  });
}
```

### Overrding a package inside a plain attribute set

Here's an example of overriding the source of `obs-studio-plugins.obs-backgroundremoval`.

``` nix
    final: prev: {
      obs-studio-plugins = prev.obs-studio-plugins // {
        obs-backgroundremoval =
          prev.obs-studio-plugins.obs-backgroundremoval.overrideAttrs (old: {
            version = "0.5.17";
            src = prev.fetchFromGitHub {
              owner = "royshil";
              repo = "obs-backgroundremoval";
              rev = "v0.5.17";
              hash = "";
            };
          });
      };
    };
```

### Perl Package overlays

Perl packages require some extra care prevent the error `undefined variable 'perl'`. This example turns off tests for the `example` package:

``` nix
  final: prev: {
    perlPackages = prev.perlPackages // {
      example = prev.perlPackages.example.overrideAttrs (attrs: 
        { doChecks = false; }
      )
    };
  };
```

### Python Packages Overlay

Here is an example of Python packages overlay. The trick is to also override python itself with `packageOverrides`.

Github issue with the snippet below: <a href="https://github.com/NixOS/nixpkgs/issues/26487#issuecomment-307363295" class="wikilink" title="https://github.com/NixOS/nixpkgs/issues/26487#issuecomment-307363295">https://github.com/NixOS/nixpkgs/issues/26487#issuecomment-307363295</a>

``` nix
final: prev:
# Within the overlay we use a recursive set, though I think we can use `final` as well.
{
  # nix-shell -p python.pkgs.my_stuff
  python = prev.python.override {
    # Careful, we're using a different final and prev here!
    packageOverrides = pyfinal: pyprev: {
      my_stuff = pyprev.buildPythonPackage rec {
        pname = "pyaes";
        version = "1.6.0";
        src = pyprev.fetchPypi {
          inherit pname version;
          hash = "0bp9bjqy1n6ij1zb86wz9lqa1dhla8qr1d7w2kxyn7jbj56sbmcw";
        };
      };
    };
  };
  # nix-shell -p pythonPackages.my_stuff
  pythonPackages = final.python.pkgs;

  # nix-shell -p my_stuff
  my_stuff = final.pythonPackages.buildPythonPackage rec {
    pname = "pyaes";
    version = "1.6.0";
    src = pythonPackages.fetchPypi {
      inherit pname version;
      hash = "0bp9bjqy1n6ij1zb86wz9lqa1dhla8qr1d7w2kxyn7jbj56sbmcw";
    };
  };
}
```

### R Packages Overlay

Here is an example of an R packages overlay, in which it can be seen how to provide different versions of packages then those available in the current R version. It should be noted that in the case of R and Python the argument to `override` is named differently. Names of these can be found using `nix repl` and evaluating e.g. `python.override.__functionArgs`.

``` nix
final: prev:

{
  rPackages = prev.rPackages.override {
    overrides = {

      rprojroot = prev.rPackages.buildRPackage rec {
        name = "rprojroot-${version}";
        version = "2.0.2";
        src = prev.fetchurl {
          url =
            "https://github.com/r-lib/rprojroot/archive/refs/tags/v2.0.2.tar.gz";
          hash = "1i0s1f7hla91yw1fdx0rn7c18dp6jwmg2mlww8dix1kk7qbxfjww";
        };
        nativeBuildInputs = [ prev.R ];
      };

      here = prev.rPackages.buildRPackage rec {
        name = "here-${version}";
        version = "1.0.1";
        src = prev.fetchurl {
          url = "https://github.com/r-lib/here/archive/refs/tags/v1.0.1.tar.gz";
          hash = "0ky6sq6n8px3b70s10hy99sccf3vcjjpdhamql5dr7i9igsf8nqy";
        };
        nativeBuildInputs = [ prev.R final.rPackages.rprojroot ];
        propagatedBuildInputs = [ final.rPackages.rprojroot ];
      };
    };
  };
}
```

### Rust packages

Due to <https://github.com/NixOS/nixpkgs/issues/107070>

it is not possible to just override `cargoHash`, instead cargoDeps has to be overriden

``` nix
final: prev: {
  rnix-lsp = prev.rnix-lsp.overrideAttrs (oldAttrs: rec {
    version = "master";
  
    src = prev.fetchFromGitHub {
      owner = "nix-community";
      repo = "rnix-lsp";
      rev = "1fdd7cf9bf56b8ad2dddcfd27354dae8aef2b453";
      hash = "sha256-w0hpyFXxltmOpbBKNQ2tfKRWELQzStc/ho1EcNyYaWc=";
    };
  
    cargoDeps = oldAttrs.cargoDeps.overrideAttrs (lib.const {
      name = "rnix-lsp-vendor.tar.gz";
      inherit src;
      outputHash = "sha256-6ZaaWYajmgPXQ5sbeRQWzsbaf0Re3F7mTPOU3xqY02g=";
    });
  });
}
```

## List of 3rd party overlays

This is an non-exhaustive list:

- [Details in the Nixpkgs manual for using Rust overlays](https://nixos.org/manual/nixpkgs/unstable/#using-community-maintained-rust-toolchains)
- [Overlay for Radeon Open-Compute packages](https://github.com/peter-sa/nixos-rocm)
- [Overlay by Rok Garbas for a set of python packages built by pypi2nix (archived)](https://github.com/garbas/nixpkgs-python)

## See also

- [Overlays in nixpkgs manual](https://nixos.org/nixpkgs/manual/#chap-overlays)
- [Blog post "Mastering Nixpkgs Overlays: Techniques and Best Practice"](https://nixcademy.com/posts/mastering-nixpkgs-overlays-techniques-and-best-practice/)
- [Blog post "The DOs and DON’Ts of nixpkgs overlays"](https://blog.flyingcircus.io/2017/11/07/nixos-the-dos-and-donts-of-nixpkgs-overlays/)
- [Nixpkgs Overlays – A place for all excluded packages](https://www.youtube.com/watch?v=s2fkgkN55vk&list=PLgknCdxP89ReD6gxl755B6G_CI65z4J2e) - Talk by Nicolas B. Pierron at NixCon 2017
- <a href="Nixpkgs/Patching_Nixpkgs" class="wikilink" title="Nixpkgs/Patching Nixpkgs">Nixpkgs/Patching Nixpkgs</a>

#### References

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>

[^1]: Based on [1](https://gitlab.com/samueldr/nixos-configuration/blob/3febd83b15210282d6435932944d426cd0a9e0ca/modules/overlays-compat/overlays.nix)<a href="User:Samueldr" class="wikilink" title="@samueldr">@samueldr</a><span>'s configuration: overlays-compat</span>
