<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Coreboot -->

## Building as Nix Derivation

There is a commented example of building Coreboot as Nix derivation at [blitz/nix-coreboot](https://github.com/blitz/nix-coreboot) on Github.

## Building in nix-shell

Coreboot as of 24.02 comes with a Nix shell expression for x86 at `util/nixshell//devshell-i386.nix`.

``` bash
# clone coreboot git repository (latest master)
git clone https://review.coreboot.org/coreboot.git --depth 1
# or for a specific coreboot version (I.E. version 4.15)
git clone --branch 4.15 https://review.coreboot.org/coreboot.git --depth 1

# get 3rd party submodules in coreboot repository
cd coreboot
du -sh . # ~200 MByte
git submodule update --init --checkout --depth 1
du -sh . # ~700 MByte

nix-shell --pure util/nixshell/devshell-i386.nix

# configure
# set mainboard model, chip size, ...
make menuconfig MENUCONFIG_COLOR=blackbg # blackbg = dark mode

# build firmware
make CPUS=$(nproc)

# test firmware
qemu-system-x86_64 -bios build/coreboot.rom -serial stdio
```

## Skip building toolchain

We can use our system toolchain to build coreboot firmware, but this is not recommended per [coreboot docs](https://doc.coreboot.org/tutorial/part1.html):

> you can possibly use your system toolchain, but the results are not reproducible, and may have issues, so this is not recommended

To use the system toolchain, in `make menuconfig`, enable `General Setup > Allow building with any toolchain`

## Building as derivation

coreboot is pretty picky about the toolchain it is built with and thus using the toolchain it comes with is the easiest path to success. There are commented Nix expressions that build coreboot [here](https://github.com/blitz/nix-coreboot).

## See also

- <https://doc.coreboot.org/tutorial/part1.html>
- <https://www.coreboot.org/Build_HOWTO>
- <https://www.coreboot.org/Lesson1>
- <https://wiki.gentoo.org/wiki/Coreboot>
- flashing the new bios image
  - <https://doc.coreboot.org/tutorial/flashing_firmware/index.html>
  - <https://libreboot.org/docs/install/spi.html>

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>
