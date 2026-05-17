<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix vs. Linux Standard Base -->

This article is a comparison between the <a href="Nix_package_manager" class="wikilink" title="Nix package manager">Nix package manager</a> and the [Linux Standard Base](https://en.wikipedia.org/wiki/Linux_Standard_Base) (LSB) standard that the package managers of most conventional Linux distributions follow.

## Package Installation

In most distributions, files of an installed package are stored under `/{,usr}/{bin,etc,lib,...}`.

With Nix, the files of a package go into a *profile* (as if it was a rootfs), and users can have as many profiles as they want.

By default, the only part of the system made aware of the contents of the user profile is the `PATH` environment variable. The user `PATH` is set through bashrc to include `~/.nix-profile/bin`. So, by default, installing a Nix package means "having it in the PATH". A simple operation like `nix-env -i firefox` is meant to update the nix store, then generate a new profile in the store having all the programs *installed* plus the new one, and updating the symlink `~/.nix-profile`, so `~/.nix-profile/bin` will contain a symlink to the executable of firefox. Then a user can type `firefox` and have it running.

If other kind of files are to be found by programs looking at the usual `/{,usr}/{bin,etc,lib,sbin,...}` locations, other variables may be of help. For example, gcc would welcome `CPATH` and `LIBRARY_PATH`. And the dynamic loader will welcome `LD_LIBRARY_PATH`.

## Build and install from Source

In most LSB distributions, you ask for the development tools to be installed into the system. And then you also install dependencies of the package you want to build, and then go on building the source you downloaded. The dependencies are found, and your program builds fine.

With Nix, you can install the needed development tools into your profile (gcc-wrapper, gnumake), and the dependencies for the source you want to build (libpng, qt, ...). Once that done, set the environment variables (for gcc):

``` bash
CPATH=~/.nix-profile/include; LIBRARY_PATH=~/.nix-profile/lib; QTDIR=~/nix-profile
```

... And then you should get your build running. In most LSB distributions, you proceed like the section above to build the program, and then run `make install` to get it into /usr/local, overwritting any files you had there.

Using Nix, if you built your program like the section above, you may end up having /usr/local files depending on dynamic libraries only present in your profile. That situation may require a `LD_LIBRARY_PATH` variable, or your ld.so.conf pointing to your profile, but this situation can end in your programs not working if you remove those dependencies from your profile. This would be also a problem in your LSB distribution, if you remove uninstall packages required by programs you put manually in `/usr/local`.

Therefore, it is advisable to use Nix not only for acquiring dependencies, but also for managing the build of your package. In fact, creating an ad-hoc Nix package for the software is often easier, because the standard environment in NixPkgs automatically takes care of issues that could arise because of the differences between the Nix and LSB approaches. For example, a well packaged autotools-based project usually builds successfully after specifying its dependencies in Nix, whereas if you would install the dependencies and try to build it yourself, you will have a hard time.

## Workflow

A common situation is that LSB distribution users want to keep their habits, but they additionally want the advantages claimed by nix, to mention some:

1.  rollback
2.  disable any possibility of removing dependencies of an installed program
3.  no side effects to other users (if desired), when installing programs
4.  no effects for the own user (have the program installed in the store, but not referenced in the profile)

That can be achieved only following the nix style. So, letting nix build your program from source, instead of doing that on your own in your interactive shell through profiles. Nix will provide a common build system, with whatever stated dependencies available at build time, and will also provide a target installation directory. This requires knowing how to write [simple stdenv derivations](http://hydra.nixos.org/job/nix/trunk/tarball/latest/download-by-type/doc/manual/#id460419), and knowing [where to write them](https://nixos.org/nix/manual/#chap-quick-start).

## Modifying a Package

In LSB distributions, files installed under can be edited by the user as needed.

Files in the Nix store () are meant to be read-only and changes are only done using the commands. can be used to ensure integrity of the store data.

To make changes to Nix packages properly, see <a href="Modifying_a_Package" class="wikilink" title="Modifying a Package">Modifying a Package</a>.

## See also

- [libostree comparison to NixOS](https://ostreedev.github.io/ostree/related-projects/#nixos--nix) — libostree, a project to offer [FHS](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard)-compatible "stores", was in large part inspired by NixOS.

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a>
