<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Debug Symbols -->

Nix packages rarely embed debugging symbols, and since the notion of "installing" a package is somewhat complicated with nix, one cannot "just" install the `foo-dev` to magically get debug symbols for `foo`. Here are some explanations on how to get debug symbols with nix, and especially on NixOS.

By default, packages are stripped and all (most?) debug information is irrevocably lost. If you want to debug an application using a library from such a package, there is little you can do to get debug symbols.

Two types of packages can provide debug symbols:

#### Unstripped packages

To prevent stripping of a derivation, use the option `dontStrip = true;`. This still compiles with optimisation; to compile with `-Og -ggdb` in addition to disabling stripping, you can use the function `enableDebugging`. Let's take the example of `socat`. If you install socat, then run you see that you have debugging symbols for neither socat itself nor for dependent libraries.

Now, build an unstripped socat: Let's retry with gdb: You have got debugging symbols for socat, but not its dependencies. Also, gdb complains that it did not find the source files of socat. For source files:

- download the tarball: `nix-build "`<nixpkgs>`" -A socat.src`
- extract it: `tar xvf result`
- back in gdb:

Semi-victory !

To provide debug info for dependencies, we would have to recompile them all with `enableDebugging` which is time consuming and tedious. The only reasonable solution would be to ship debugging information by default, but it would waste a lot of disk space. This leads to the second type of packages.

#### Packages with a debug output

Some packages are built with `separateDebugInfo = true;`. The debug symbols will be stripped from the normal output(s) of the derivation, but instead of being discarded they will be put in a special `debug` output. Since the library does not depend on this output, no disk space is wasted by default.

The openssl package is such a derivation. Imagine you are debugging a live socat and suddenly want debug symbols for openssl. Previous gdb output tells us the version of openssl we are interested in is `/nix/store/9kr8r78bwk12050ppywfbhg1vrsd6dp8-openssl-1.0.2p`. We can get back to the original derivation: Then we can get the store path for the debug output: This store path is probably not yet on our disk, so let's download it: And now we can tell gdb that debug symbols are in the `lib/debug` subdirectory with `set debug-file-directory`: Victory!

Unfortunately, it seems you must issue `set debug-file-directory` before the library is loaded. If you already have typed `start` or if you have attached a live `socat` with `gdb -p`, `set debug-file-directory` won't have any effect. In this case you can export `NIX_DEBUG_INFO_DIRS=/nix/store/xd69daaly33m7zid6g31glwmml7lk93f-openssl-1.0.2p-debug/lib/debug` before launching gdb.

#### NixOS

By toggling `environment.enableDebugInfo` to 'true' in `/etc/nixos/configuration.nix`, all separate debug info derivations in your `systemPackages` will have their debug output linked in `/run/current-system/sw/lib/debug/` and will be automatically available to gdb. Though note that this will not pick up debug symbols of dependencies – you will need to add the dependencies you want to debug to `environment.systemPackages` explicitly. If a derivation you are interested in does not have separate debug info enabled, you still have to override it with an overlay for example.

#### dwarffs

To avoid the need to explicitly list every dependency in `environment.systemPackages` to have its debug output available, you can use [dwarffs](https://github.com/edolstra/dwarffs). It will create a virtual file system where gdb will be able to look for separate debug symbols for packages on-demand. The downside is that it might increase gdb start up time significantly.

#### nixseparatedebuginfo

[nixseparatedebuginfod2](https://github.com/symphorien/nixseparatedebuginfod2) is a debuginfod server that can download the relevant debug outputs and source files as needed by debuginfod-capable tools. Compared to dwarffs, it does not require root access, and handles debug outputs of derivations not built by hydra (eg locally or on a custom binary cache) and source files. Gdb is built with support for debuginfod, and valgrind has support if you additionally install the bin output of elfutils.

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
