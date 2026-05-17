<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/en -->

<languages/> Frequently asked questions and common newcomer trouble should be put here so that we can point to this page instead of answering the same question over and over again.

<http://unix.stackexchange.com/questions/tagged/nixos> can also be used for questions.

### Why is there a new wiki? What is with nixos.wiki?

The old wiki at nixos.wiki has several problems:

- Many components (mediawiki, php, icu) are severely outdated.
  - MediaWiki 1.29 (EOL 2018), now 1.35 (EOL 2023-12)
  - PHP 7.3.33 (EOL 2021-12)
  - ICU 64.2
- Cloudflare DDOS protection makes wiki edits fail sometimes.
- There is no WYSIWYG editor.
- The wiki infrastructure, which was supposed to be made public after launch, never ended-up being made public.

We tried to address these issues multiple times over multiple years across multiple channels (email, matrix). We never got a direct answer. The last point of contact was made through zimbatm representing the <a href="NixOS_Foundation" class="wikilink" title="NixOS Foundation">NixOS Foundation</a>, asking the maintainer about possible cooperation on a new wiki. The answer was no. With the old wiki deteriorating and the maintainer unresponsive, forking the content into a new wiki remained the only way forward.

Also see:

- <https://wiki.nixos.org/wiki/User:Winny/WikiRisks>
- <https://greasyfork.org/en/scripts/495011-redirect-to-wiki-nixos-org> (trivial userscript to redirect nixos.wiki links here)

### Why is Nix written in C++ rather than a functional language like Haskell?

Mainly because Nix is intended to be lightweight, easy to learn, and portable (zero dependencies).

### How to keep build-time dependencies around / be able to rebuild while being offline?

``` nix
# /etc/nixos/configuration.nix
{ config, pkgs, lib, ... }:
{
  nix.settings = {
    keep-outputs = true;
    keep-derivations = true;
    # See https://nixos.org/manual/nix/stable/command-ref/conf-file.html
    # for a complete list of Nix configuration options.
  };
}
```

Check 'man configuration.nix' for these options. Rebuild for these options to take effect:

``` bash
nixos-rebuild switch
```

List all store paths that form the system closure and realise them:

``` bash
nix-store -qR $(nix-instantiate '<nixpkgs/nixos>' -A system) | xargs nix-store -r
warning: you did not specify `--add-root'; the result might be removed by the garbage collector

<build output and list of successfully realised paths>
```

Repeat for your user and further profiles:

``` bash
nix-store -qR ~/.nix-profile | xargs nix-store -r
```

The warning can be ignored for profiles that are listed/linked in */nix/var/nix/profiles/* or one of its subdirectories.

Consult man pages of nix-store and nix-instantiate for further information.

### Why <hash>-<name> instead of <name>-<hash>?

For the rare cases where we have to dig into the /nix/store it is more practical to keep in mind the first few letters at the beginning than finding a package by name. Ie, you can uniquely identify almost any storepath with just the first 4-5 characters of the hash. (Rather than having to type out the full package name, then 4-5 characters of the hash.)

Also, since the initial part is all of the same length, visually parsing a list of packages is easier.

If you still wonder why, run `ls -1 /nix/store | sort -R -t - -k 2 | less` in your shell. *(? unclear)*

This is what might happen if you don't garbage collect frequently, or if you are testing compilation variants:

``` bash
q0yi2nr8i60gm2zap46ryysydd2nhzhp-automake-1.11.1/
vbi4vwwidvd6kklq2kc0kx3nniwa3acl-automake-1.11.1/
wjgzir57hcbzrq3mcgxiwkyiqss3r4aq-automake-1.11.1/
1ch5549xnck37gg2w5fh1jgk6lkpq5mc-nixos-build-vms/
4cmjlxknzlvcdmfwj0ih0ggqsj5q73hb-nixos-build-vms/
7fv4kwi5wwwzd11ili3qwg28xrj8rxw2-nixos-build-vms/
8jij13smq9kdlqv96hm7y8xmbh2c54iy-nixos-build-vms/
j714mv53xi2j4ab4g2i08knqr137fd6l-nixos-build-vms/
xvs7y09jf7j48p6l0p87iypgpq470jqw-nixos-build-vms/
```

### I've updated my channel and something is broken, how can I rollback to an earlier channel?

View the available generations of your channel:

``` bash
nix-env --list-generations -p /nix/var/nix/profiles/per-user/root/channels
18   2014-04-17 09:16:28
19   2014-06-13 10:31:24 
20   2014-08-12 19:09:20   (current)
```

To rollback to the previous generation:

``` bash
nix-env --rollback -p /nix/var/nix/profiles/per-user/root/channels
switching from generation 20 to 19
```

To switch to a particular generation:

``` bash
nix-env --switch-generation 18 -p /nix/var/nix/profiles/per-user/root/channels
switching from generation 20 to 18
```

### I'm working on a new package, how can I build it without adding it to nixpkgs?

``` bash
nix-build -E 'with import <nixpkgs> { }; callPackage ./mypackage.nix { }'
```

You can replace callPackage with callPackage_i686 to build the 32-bit version of your package on a 64-bit system if you want to test that.

### How can I compile a package with debugging symbols included?

To build a package with -Og and -g, and without stripping debug symbols use:

``` bash
nix-build -E 'with import <nixpkgs> { }; enableDebugging fooPackage'
```

See also <a href="Debug_Symbols" class="wikilink" title="Debug Symbols">Debug Symbols</a>

### How can I force a rebuild from source even without modifying the nix expression?

As root you can run nix-build with the --check flag:

``` bash
sudo nix-build --check -A ncdu
```

### How can I manage software with nix-env like with configuration.nix?

There are many ways, one is the following:

1.  Create a meta package called *userPackages* your *~/.config/nixpkgs/config.nix* file with the packages you would like to have in your environment:
    ``` nix
    with (import <nixpkgs> {});
    {
      packageOverrides = pkgs: with pkgs; {
        userPackages = buildEnv {
          inherit ((import <nixpkgs/nixos> {}).config.system.path)
          pathsToLink ignoreCollisions postBuild;
          extraOutputsToInstall = [ "man" ];
          name = "user-packages";
          paths = [ vim git wget ];
        };
      };
    }
    ```
2.  Install all specified packages using this command:
    ``` bash
    nix-env -iA userPackages -f '<nixpkgs>'
    ```

Now you can add and remove packages from the paths list and rerun nix-env to update your user local packages.

Another way is using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.

### I've downloaded a binary, but I can't run it, what can I do?

Binaries normally do not work out of the box when you download them because they normally just assume that libraries can be found in hardcoded paths such as `/lib`. However this assumption is incorrect on NixOS systems due to the inner workings of `nix` - there is no default path, everything gets set to the corresponding version on compile time.

If you are new to packaging proprietary software you should check out the <a href="Packaging_Binaries" class="wikilink" title="Packaging Binaries Tutorial">Packaging Binaries Tutorial</a>.

If you are in a hurry and just want to get shit running, continue reading:  
You can use [nix-ld](https://github.com/Mic92/nix-ld) to run compiled binaries. For example, if your binary needs zlib and openssl:

``` nix
programs.nix-ld = {
  enable = true;
  libraries = [ pkgs.zlib pkgs.openssl ];
};
```

Log out and back in to apply the environment variables it sets, and you can then directly run the binary.

If you don't want to configure the list of libraries manually, a quick and dirty way to run nearly any precompiled binary is the following:

``` nix
programs.nix-ld = {
  enable = true;
  libraries = pkgs.steam-run.args.multiPkgs pkgs;
};
```

This uses the libraries that are used by <a href="Steam" class="wikilink" title="Steam">Steam</a> to simulate a traditional Linux FHS environment to run games in. It's a [big list](https://github.com/NixOS/nixpkgs/blob/nixos-unstable/pkgs/by-name/st/steam/package.nix) that usually contains all the libraries your binary needs to run.

Another possibility is to use [patchelf](https://nixos.org/patchelf.html) to set the library path and dynamic linker appropriately, since compiled binaries have hard-coded interpreter and require certain dynamic libraries.

``` nix
# mybinaryprogram.nix
with import <nixpkgs> {}; 
stdenv.mkDerivation rec {
  name = "somename";
  buildInputs = [ makeWrapper ];
  buildPhase = "true";
  libPath = lib.makeLibraryPath with xlibs;[ libXrandr libXinerama libXcursor ];
  unpackPhase = "true";
  installPhase = ''
    mkdir -p $out/bin
    cp ${./mybinaryprogram} $out/bin/mybinaryprogram
  '';
  postFixup = ''
    patchelf \
      --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" \
      --set-rpath "${libPath}" \
      $out/bin/mybinaryprogram
  '';
}
```

This can be built with:

``` bash
nix-build mybinaryprogram.nix
```

And run with:

``` bash
./result/bin/mybinaryprogram
```

Another possibility is using a FHS-compatible Sandbox with [buildFHSUserEnv](https://nixos.org/nixpkgs/manual/#sec-fhs-environments)

``` nix
# fhsUser.nix
{ pkgs ? import <nixpkgs> {} }:
(pkgs.buildFHSUserEnv {
  name = "example-env";
  targetPkgs = pkgs: with pkgs; [
    coreutils
  ];
  multiPkgs = pkgs: with pkgs; [
    zlib
    xorg.libXxf86vm
    curl
    openal
    openssl_1_0_2
    xorg.libXext
    xorg.libX11
    xorg.libXrandr
    mesa_glu
  ];
  runScript = "bash";
}).env
```

the sandbox can be entered with

``` bash
nix-shell fhsUser.nix
```

If your target application can't find shared libraries inside buildFHSUserEnv, you may run [nix-de-generate](https://github.com/lexleogryfon/de-generate) for target application inside FHS, which will generate newenv.nix file, an nix-expression of buildFHSUserEnv with resolved dependencies for shared libraries.

### What are channels and how do they get updated?

[Nixpkgs](https://github.com/NixOS/nixpkgs) is the git repository containing all packages and NixOS modules/expressions. Installing packages directly from Nixpkgs master branch is possible but a bit risky as git commits are merged into master before being heavily tested. That's where channels are useful.

A "channel" is a name for the latest "verified" git commits in Nixpkgs. Each channel has a different definition of what "verified" means. Each time a new git commit is verified, the channel declaring this verification gets updated. Contrary to an user of the git master branch, a channel user will benefit both from verified commits and binary packages from the binary cache.

Channels are reified as git branches in the [nixpkgs repository](https://github.com/NixOS/nixpkgs) and as disk images in the [channels webpage](https://nixos.org/channels/). There are several channels, each with its own use case and verification phase:

- **nixos-unstable**
  - **description** Use this when you want the latest package and module versions while still benefiting from the binary cache. You can use this channel on non-NixOS systems. This channel corresponds to NixOS’s main development branch, and may thus see radical changes between channel updates. This channel is not recommended for production systems.
  - **definition** this channel is updated depending on [release.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release.nix) and [release-lib.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-lib.nix)
- **nixos-unstable-small**
  - **description** This channel is identical to `nixos-unstable` described above, except that this channel contains fewer binary packages. This means the channel gets updated faster than `nixos-unstable` (for instance, when a critical security patch is committed to NixOS’s source tree). However, the binary cache may contain less binary packages and thus using this channel may require building more packages from source than `nixos-unstable`. This channel is mostly intended for server environments and as such contains few GUI applications.
  - **definition** this channel is updated depending on [release-small.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-small.nix) and [release-lib.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-lib.nix)
- **nixos-YY.MM** (where **YY** is a 2-digit year and **MM** is a 2-digit month, such as [*nixos-17.03*](https://nixos.org/channels/nixos-15.09/))
  - **description** These channels are called **stable** and only get conservative bug fixes and package upgrades. For instance, a channel update may cause the Linux kernel on your system to be upgraded from 3.4.66 to 3.4.67 (a minor bug fix), but not from 3.4.x to 3.11.x (a major change that has the potential to break things). Stable channels are generally maintained until the next stable branch is created.
  - **definition** this channel is updated depending on [release.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release.nix) and [release-lib.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-lib.nix)
- **nixos-YY.MM-small** (where **YY** is a 2-digit year and **MM** is a 2-digit month, such as [nixos-15.09-small](https://nixos.org/channels/nixos-15.09-small/))
  - **description** The difference between `nixos-YY.MM-small` and `nixos-YY.MM` is the same as the one between `nixos-unstable-small` and `nixos-unstable` (see above)

Channel update works as follows:

1.  Each channel has a particular job at **hydra.nixos.org** which must succeed:

- For NixOS: the trunk-combined [tested](http://hydra.nixos.org/job/nixos/trunk-combined/tested) job, which contains some automated NixOS tests.
- For nixos-small: the unstable-small [tested](http://hydra.nixos.org/job/nixos/unstable-small/tested) job.
- For nixpkgs: the trunk [unstable](http://hydra.nixos.org/job/nixpkgs/trunk/unstable) job, which contains some critical release packages.

2.  Once the job succeeds at a particular nixpkgs commit, **cache.nixos.org** will download binaries from **hydra.nixos.org**.
3.  Once the above download completes, the channel updates.

You can checkout the nixpkgs git and reset it to a particular commit of a channel. This will not affect your access to the binary cache.

### How do I know where's nixpkgs channel located and at which commit?

First `echo $NIX_PATH` to see where nix looks for the expressions. Note that nix-env uses *~/.nix-defexpr* regardless of *\$NIX_PATH*.

If you want to know where <nixpkgs> is located:

``` bash
nix-instantiate --find-file nixpkgs
```

To know the commit, open the .version-suffix file in the nixpkgs location. The hash after the dot is the git commit.

### Nixpkgs branches

Branches on the nixpkgs repo have a relationship with channels, but that relationship is not 1:1.

Some branches are reified as channels (e.g. the `nixos-XX.YY` branches, or `nix(os|pkgs)-unstable`), whereas others are the starting point for those branches (e.g. the `master` or `release-XX.YY` branches). For example:

- When a change in master needs to be backported to the current NixOS release, it is cherry-picked into the current `release-XX.YY` branch
- <a href="Channel_branches#Channel_update_process" class="wikilink" title="Hydra">Hydra</a> picks up this change, runs tests, and if those tests pass, updates the corresponding `nixos-XX.YY` branch, which is then reified as a channel.

So in short, the `relase-XX.YY` branches have not been run through Hydra yet, whereas the `nixos-XX.YY` ones have.

### There's an updated version for \$software on nixpkgs but not in channels, how can I use it?

You can jump the queue and use `nix-shell` with a `NIX_PATH` pointing to a tarball of the channel to get a shell for that software. Some building may occur. This will not work for system services.

``` command
NIX_PATH=nixpkgs=https://github.com/NixOS/nixpkgs/archive/release-17.09.tar.gz nix-shell -p $software
```

### There's an updated version for \$software on the unstable branch, but I use stable, how can I use it?

Before going ahead with this, note that firstly, this likely means that the package you intend to update has had a major version change. If you have used it previously, there is a chance that your existing data either will not work with the new version or will need to be migrated; If in doubt, consult the upstream documentation of the package.

Secondly, while you're less likely to run into issues on NixOS than on, for example, Debian when installing packages from different releases, it's not impossible.

Nix ensures that libraries and (usually) runtime dependencies of packages are kept separate, so that you can trivially have many versions of those dependencies installed, without affecting the versions of said dependencies used by important system components. This ensures that you cannot accidentally break your package manager by, say, updating Python, as is quite common on other distros.

Nix cannot however ensure that there will be no incompatibilities with services of which there can inherently be only one running instance. As an example, if you try to use a package from unstable on a stable system that requires a feature in systemd that is not yet present in the systemd version on stable, this package will not work; it's simply not possible to run two different versions of systemd simultaneously.

Nonetheless, it's quite uncommon that end-user facing applications rely on such singleton services, or at the very least they will typically have internal backwards compatibility. As such, mixing channels is usually unproblematic in practice, and even if not, NixOS' rollback features make it trivial to recover from problems should they occur.

#### Using channels

First we need to add the unstable channel to our system channels:

``` console
$ sudo nix-channel --add https://nixos.org/channels/nixos-unstable nixos-unstable
$ sudo nix-channel --update
```

Then we can import this channel using the angle-bracket notation to refer to it:

``` nixos
# configuration.nix
{ 
  config,
  pkgsUnstable,
  ...
}: {
  # We add a new `pkgsUnstable` to the module arguments; this allows
  # us to easily use `pkgsUnstable` in other modules as well, without
  # having to evaluate it again.
  _module.args.pkgsUnstable = import <nixos-unstable> { inherit (config.nixpkgs) config; };

  environment.systemPackages = [
    # Once we have created our `pkgsUnstable`, we can easily use
    # packages from it wherever NixOS modules expect derivations
    pkgsUnstable.hello
  ];
}
```

#### Using flakes

We simply add the unstable branch to our flake inputs, and pass them into the NixOS module system using `specialArgs`:

``` nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixos-25.05/nixexprs.tar.xz";
    nixpkgs-unstable.url = "https://channels.nixos.org/nixos-unstable/nixexprs.tar.xz";
  };

  outputs = { nixpkgs, ... } @ inputs: {
    # Note that the hostname "nixos" and the system tuple used here are
    # examples.
    nixosConfigurations."nixos" = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";

      modules = [
        ./configuration.nix
      ];

      # Any attributes of `specialArgs` will be added to our NixOS module
      # arguments.
      #
      # We've bound `nixpkgs-unstable` to the `inputs` variable using the `@`
      # syntax; if we add any other flake inputs in the future those will also
      # be added to our module arguments.
      specialArgs.flake-inputs = inputs;
    };
  };
}
```

Using this in `configuration.nix` then looks as follows:

``` nixos
# configuration.nix
{
  pkgs,
  flake-inputs,
  ...
}: {
  environment.systemPackages = [
    flake-inputs.nixpkgs-unstable.legacyPackages.${pkgs.system}.hello
  ];
}
```

### How do I install a specific version of a package for build reproducibility etc.?

See <a href="FAQ/Pinning_Nixpkgs" class="wikilink" title="FAQ/Pinning Nixpkgs">FAQ/Pinning Nixpkgs</a> and <a href="How_to_fetch_Nixpkgs_with_an_empty_NIX_PATH" class="wikilink" title="How to fetch Nixpkgs with an empty NIX PATH">How to fetch Nixpkgs with an empty NIX PATH</a>. Find the version of nixpkgs with the package version you want and pin nixpkgs to that. However, be aware that the pinning of a package of another nixpkgs version results in a much larger package size as not only the package itself but all dependencies (down to libc) have older versions.

if you just want the old version of the single package but with new dependencies it is often easier to copy the package description into your scope and add it to your `configuration.nix` via: `mypackage-old = pkgs.callPackage ./mypackage-old.nix {};`.You can try to build the package as described in <a href="FAQ#I.27m_working_on_a_new_package.2C_how_can_I_build_it_without_adding_it_to_nixpkgs.3F" class="wikilink" title="the FAQ: building a single derivation">the FAQ: building a single derivation</a>.

### An error occurs while fetching sources from an url, how do I fix it?

First try to update the local nixpkgs expressions with `nix-channel --update` (these describe where to download sources from and how to build them). Try your build again and the url might have already been correctly updated for the package in question. You can also subscribe the unstable channel (which includes the most up-to-date expressions) with `nix-channel --add `[`http://nixos.org/channels/nixpkgs-unstable`](http://nixos.org/channels/nixpkgs-unstable), update and try the build again.

If that fails you can update the url in the nix expression yourself. <a href="#How_do_I_know_where&#39;s_nixpkgs_channel_located_and_at_which_commit?" class="wikilink" title="Navigate to your channel&#39;s expressions">Navigate to your channel's expressions</a> and find the package in one of the subdirectories. Edit the respective *default.nix* file by altering the *url* and *sha256*. You can use `nix-prefetch-url url` to get the SHA-256 hash of source distributions.

If the shell complains that you do not have write privileges for the file system, you will have to enable them.

start a new shell with a private mount namespace (Linux-only)

``` bash
sudo unshare -m bash
```

remount the filesystem with write privileges (as root)

``` bash
mount -o remount,rw /nix/store
```

update the file

``` bash
nano <PATH_TO_PACKAGE>/default.nix
```

exit to shell where /nix/store is still mounted read-only

``` bash
exit
```

Be sure to [report the incorrect url](https://github.com/NixOS/nixpkgs/issues) or [fix it yourself](https://github.com/NixOS/nixpkgs/pulls).

### How do I know the sha256 to use with fetchgit, fetchsvn, fetchbzr or fetchcvs?

Install `nix-prefetch-scripts` and use the corresponding nix prefetch helper.

For instance to get the checksum of a git repository use:

``` bash
nix-prefetch-git https://git.zx2c4.com/password-store
```

Or, use `lib.fakeHash` as the fetcher's hash argument, and attempt to build; Nix will tell you the actual and expected hash's mismatch, and you may copy the actual hash.

### Should I use <http://hydra.nixos.org/> as a binary cache?

No. As of 2017, all build artifacts are directly pushed to <http://cache.nixos.org/> and are available there, therefore setting <http://hydra.nixos.org/> as a binary cache no longer serves any function.

### I'm trying to install NixOS but my WiFi isn't working and I don't have an ethernet port

Most phones will allow you to share your WiFi connection over USB. On Android you can enable this setting via *Settings* \> *Wireless & Networks* / More ... \> *Tethering & portable hotspot* \> *USB tethering*. This should be enough to allow you to install NixOS, and then fix your WiFi. iPhones only let you tether using your data connection rather than WiFi.

It is also possible to build a custom NixOS installation ISO containing all the dependencies needed for an offline installation, but the default installation ISOs require internet connectivity.

For connecting to your WiFi, see <a href="NixOS_Installation_Guide#Wireless" class="wikilink" title="NixOS_Installation_Guide#Wireless">NixOS_Installation_Guide#Wireless</a>

### How can I disable the binary cache and build everything locally?

Set the binary caches to an empty list: `nix.binaryCaches = [];` in `configuration.nix` or pass ad-hoc `--option binary-caches ''` as parameter to nix-build or its wrappers.

This is also useful to make simple configuration changes in NixOS (ex.: network related), when no network connectivity is available:

``` bash
nixos-rebuild switch --option binary-caches ''
```

### How do I enable sandboxed builds on non-NixOS?

Two options have to be added to make sandboxed builds work on Nix, *build-use-sandbox* and *build-sandbox-paths*:

``` nix
# /etc/nix/nix.conf
build-use-sandbox = true
build-sandbox-paths = $(nix-store -qR $(nix-build '<nixpkgs>' -A bash) | xargs echo /bin/sh=$(nix-build '<nixpkgs>' -A bash)/bin/bash)
```

On NixOS set the following in *configuration.nix*:

``` nix
nix.settings.sandbox = true;
```

See <a href="Nix_package_manager#Sandbox_builds" class="wikilink" title="Nix package manager#Sandbox_builds">Nix package manager#Sandbox_builds</a> for more details.

### How can I install a package from unstable while remaining on the stable channel?

If you simply want to run a *nix-shell* with a package from unstable, you can run a command like the following:

``` bash
nix-shell -I nixpkgs=channel:nixpkgs-unstable -p somepackage
```

It is possible to have multiple nix-channels simultaneously. To add the unstable channel with the specifier *unstable*,

``` bash
sudo nix-channel --add https://nixos.org/channels/nixos-unstable nixos-unstable
```

After updating the channel

``` bash
sudo nix-channel --update nixos-unstable
```

queries via `nix-env` will show packages from both *stable* and *unstable*. Use this to install unstable packages into your user environment. The following snippet shows how this can be done in *configuration.nix*.

``` nix
{ config, pkgs, ... }:
let
  unstable = import <nixos-unstable> {};
in {
  environment.systemPackages = [ unstable.PACKAGE_NAME ];
}
```

This only changes what version of `PACKAGE_NAME` is available on `$PATH`. If the package you want to take from unstable is installed through a NixOS module, you must use <a href="overlays" class="wikilink" title="overlays">overlays</a>:

``` nix
{ config, pkgs, ... }:
let
  unstable = import <nixos-unstable> {};
in {
  nixpkgs.overlays = [
    (self: super: {
       PACKAGE_NAME = unstable.PACKAGE_NAME;
    })
  ];
}
```

Note that this will rebuild all packages depending on the overlaid package, which may be a lot. Some modules offer a `services.foo.package` to change the actual derivation used by the module without and overlay, and without recompiling dependencies ([example](https://nixos.org/manual/nixos/stable/options.html#opt-services.gvfs.package)).

If you want to install unfree packages from unstable you need to also set allowUnfree by replacing the import statment above with:

``` nix
import <nixos-unstable> { config = { allowUnfree = true; }; }
```

### I'm unable to connect my USB HDD \| External HDD is failing to mount automatically

**Note:** If you're using a kernel with at least version 5.6, you don't need to explicitly add this.

exfat is not supported in NixOS by default - since there are legality issues still with exFAT filesystem.

``` bash
su nano /etc/nixos/configuration.nix
```

Add this line to your configuration file.

``` bash
boot.extraModulePackages = [ config.boot.kernelPackages.exfat-nofuse ];
```

After saving the file rebuild NixOS:

``` bash
nixos-rebuild switch
```

Restart NixOS.

### What is the origin of the name "Nix"

The name `Nix` comes from the Dutch word [niks](https://en.wiktionary.org/wiki/nix) which means *nothing*. It reflects the fact that Nix derivations do not have access to anything that has not been explicitly declared as an input.[^1]

### What does it mean to say that NixOS is "immutable"

Immutability is a property of data, in general, which means that the data cannot be modified after it is created. In the context of an operating system, it really means that certain parts of the system have this property. In the case of Nix and NixOS, that includes the Nix store, where files can be created but not modified after the time they are created. It does not apply to every part of the operating system, in that users can still modify their own files in their home directory, for example.

### I'm getting ‘infinite recursion’ errors when trying to do something clever with `imports`

Evaluating the `imports` attribute of a NixOS module (such as configuration.nix) is a prerequisite for evaluating just about everything else, so trying anything clever with `imports` is a common source of infinite recursion (because the evaluator can't determine the values of packages and options without knowing what is imported, and can't determine what is imported without knowing the values of packages or options).

You should not try to conditionally import other modules based on other values. Make your imports unconditional, and make the modules that you're importing have conditional *behavior* based on the values of options.

If it helps, think of `imports` as akin to an `#include` directive in C.

(Note that none of this applies to the [`import` built-in Nix language function](https://nix.dev/manual/nix/stable/language/builtins#builtins-import), which is its own thing.)

## References

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>

[^1]: Eelco Dolstra et al. “Nix: A Safe and Policy-Free System for Software Deployment.” LiSA (2004), <https://pdfs.semanticscholar.org/5fd8/8f89bd8738816e62808a1b7fb12d3ab14a2f.pdf>
