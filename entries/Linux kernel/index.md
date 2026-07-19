<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Linux kernel -->

By default, the latest LTS linux kernel is installed ([Linux Kernel Version History](https://en.wikipedia.org/wiki/Linux_kernel_version_history)).

## Configuration

You can change the installed kernel using . To use the latest release:

Then rebuild your system and reboot to use your new kernel:

``` console
$ sudo nixos-rebuild boot
$ sudo reboot
```

### List available kernels

You can list available kernels using `nix repl` (previously `nix-repl`) by typing the package name and using the tab completion:

``` console
$ nix repl
```

``` nix
nix-repl> pkgs = import <nixpkgs> {}
Added 12607 variables.

nix-repl> pkgs.linuxKernel.packages
pkgs.linuxPackages                           pkgs.linuxPackages_custom
pkgs.linuxPackages-libre                     pkgs.linuxPackages_custom_tinyconfig_kernel
pkgs.linuxPackages-rt                        pkgs.linuxPackages_hardened
pkgs.linuxPackages-rt_latest                 pkgs.linuxPackages_latest
pkgs.linuxPackagesFor                        pkgs.linuxPackages_latest-libre
pkgs.linuxPackages_4_14                      pkgs.linuxPackages_latest_hardened
pkgs.linuxPackages_4_19                      pkgs.linuxPackages_latest_xen_dom0
pkgs.linuxPackages_4_19_hardened             pkgs.linuxPackages_latest_xen_dom0_hardened
pkgs.linuxPackages_4_9                       pkgs.linuxPackages_lqx
pkgs.linuxPackages_5_10                      pkgs.linuxPackages_rpi0
pkgs.linuxPackages_5_10_hardened             pkgs.linuxPackages_rpi02w
pkgs.linuxPackages_5_15                      pkgs.linuxPackages_rpi1
pkgs.linuxPackages_5_15_hardened             pkgs.linuxPackages_rpi2
pkgs.linuxPackages_5_18                      pkgs.linuxPackages_rpi3
pkgs.linuxPackages_5_19                      pkgs.linuxPackages_rpi4
pkgs.linuxPackages_5_4                       pkgs.linuxPackages_rt_5_10
pkgs.linuxPackages_5_4_hardened              pkgs.linuxPackages_rt_5_15
pkgs.linuxPackages_6_0                       pkgs.linuxPackages_rt_5_4
pkgs.linuxPackages_6_1                       pkgs.linuxPackages_rt_6_1
pkgs.linuxPackages_6_1_hardened              pkgs.linuxPackages_testing
pkgs.linuxPackages_6_2                       pkgs.linuxPackages_testing_bcachefs
pkgs.linuxPackages_6_3                       pkgs.linuxPackages_xanmod
pkgs.linuxPackages_6_4                       pkgs.linuxPackages_xanmod_latest
pkgs.linuxPackages_6_5                       pkgs.linuxPackages_xanmod_stable
pkgs.linuxPackages_6_6                       pkgs.linuxPackages_xen_dom0
pkgs.linuxPackages_6_6_hardened              pkgs.linuxPackages_xen_dom0_hardened
pkgs.linuxPackages_6_7                       pkgs.linuxPackages_zen
pkgs.linuxPackages_6_8
```

### Custom kernel modules

Note that if you deviate from the default kernel version, you should also take extra care that extra kernel modules must match the same version. The safest way to do this is to use `config.boot.kernelPackages` to select the correct module set:

### Customizing kernel module parameters

You can use , which is analogous to creating modprobe.conf files in /etc/modprobe.d/ in regular Linux distributions. This can be used for both built-in and loadable kernel modules.

can be used to set additional kernel command line arguments at boot time. It can only be used for built-in modules. For example:

### Enable SysRq

The Linux kernel is known[^1] to not handle out-of-memory situation properly and can freeze for a long time, often leaving no option but doing a hard reboot. The [SysRq shortcuts](https://en.wikipedia.org/wiki/Magic_SysRq_key) can be used to trigger a more graceful reboot. However, most keys are disabled by default on NixOS. To enable:

Useful shortcuts, triggered using :

-   
  Print help to the system log.

-   
  Trigger the kernel oom killer.

-   
  Sync data to disk before triggering the reset options below.

-   
  SIGTERM all processes except PID 0.

-   
  SIGKILL all processes except PID 0.

-   
  Reboot the system.

Check `journalctl` to see if you are triggering the shortcuts correctly, which might be different for your keyboard, as noted in the Wikipedia page.

Also see and .

### Custom configuration

It is sometimes desirable to change the configuration of your kernel, while keeping the kernel version itself managed through Nixpkgs.

One way is to use [^2][^3]. For example, is configured as shown below. Note that the prefix is not used in the configuration names.

``` nix
{
  boot.kernelPatches = [ {
    name = "crashdump-config";
    patch = null;
    structuredExtraConfig = with lib.kernel; {
      CRASH_DUMP = yes;
      DEBUG_INFO = yes;
      PROC_VMCORE = yes;
      LOCKUP_DETECTOR = yes;
      HARDLOCKUP_DETECTOR = yes;
    };
  } ];
}
```

Another way is to create an overlay to configure . This allows for more flexibility, since you can basically override any available kernel option[^4].

If the kernel config fails to build with messages like `error: unused option: DRM_I915_GVT`, try setting e.g. `DRM_I915_GVT = lib.kernel.unset`. Setting will also silence these errors, at the cost of ignoring potential problems. ([generate-config.pl](https://github.com/NixOS/nixpkgs/blob/3ab9a9d12ba76f6a544c207e1364da5b3087b77c/pkgs/os-specific/linux/kernel/generate-config.pl) is responsible for these; they are often produced when [the default config](https://github.com/NixOS/nixpkgs/blob/3ab9a9d12ba76f6a544c207e1364da5b3087b77c/pkgs/os-specific/linux/kernel/common-config.nix) doesn't use `lib.kernel.option` for an option that is implicitly disabled by whatever change you made.)

### Pinning a kernel version

Note that pinning the kernel version will likely require manual recompilation, which may be slow on older hardware. See [this thread](https://discourse.nixos.org/t/pin-kernel-version/50630/3) for a related discussion.

### Debugging a failed configuration

As dependencies between kernel configurations need to be addressed manually, use [--keep-failed](https://nixos.org/manual/nix/stable/command-ref/nix-build#opt-keep-failed) to inspect the intermediate nix config file after any build failures:

## Embedded Linux Cross-compile

To configure and cross-compile Linux kernels for embedded development, often distributed separately instead of using the stock kernel, you can setup a development environment as shown below:

Clone the kernel sources, enter the environment using , and then do development normally.

## make menuconfig

It is not possible to run `make menuconfig` in the standard kernel shell. This is because `ncurses` is not part of your working environment when you start it with `nix-shell '`<nixpkgs>`' -A linuxPackages.kernel`.

Use `linuxPackages.kernel.configEnv` instead, which adds ncurses as a build dependency to the kernel:

``` console
$ nix-shell '<nixpkgs>' -A linuxPackages.kernel.configEnv
[nix-shell] $ unpackPhase && cd linux-*
[nix-shell] $ patchPhase
[nix-shell] $ make menuconfig
```

(thanks to sphalerite)

## make xconfig

Similarly to make menuconfig, you need to import qt in the environment:

``` console
$ nix-shell -E 'with import <nixpkgs> {}; linux.overrideAttrs (o: {nativeBuildInputs=o.nativeBuildInputs ++ [ pkg-config qt5.qtbase ];})'
```

If the source was unpacked and an initial config exists, you can run `make xconfig KCONFIG_CONFIG=build/.config`

## Requesting a change in the default nixos kernel configuration

Please provide a comparison with other distributions' kernel:

- Arch: <https://gitlab.archlinux.org/archlinux/packaging/packages/linux/-/blob/main/config>
- Debian: <https://salsa.debian.org/kernel-team/linux/blob/master/debian/config/config> and the ARCH specific ones

## Booting a kernel from a custom source

The following example shows how to configure NixOS to compile and boot a kernel from a custom source, and with custom configuration options.

``` nix
{ pkgs, ... }:

{
  boot.kernelPackages = let
      linux_sgx_pkg = { fetchurl, buildLinux, ... } @ args:

        buildLinux (args // rec {
          version = "5.4.0-rc3";
          modDirVersion = version;

          src = fetchurl {
            url = "https://github.com/jsakkine-intel/linux-sgx/archive/v23.tar.gz";
            # After the first build attempt, look for "hash mismatch" and then 2 lines below at the "got:" line.
            # Use "sha256-....." value here.
            hash = "";
          };
          kernelPatches = [];

          structuredExtraConfig = with lib.kernel; {
            INTEL_SGX = yes;
          };

          extraMeta.branch = "5.4";
        } // (args.argsOverride or {}));
      linux_sgx = pkgs.callPackage linux_sgx_pkg{};
    in 
      pkgs.recurseIntoAttrs (pkgs.linuxPackagesFor linux_sgx);
}
```

## Out-of-tree kernel modules

### Packaging out-of-tree kernel modules

There are a couple of steps that you will most likely need to do a couple of things. Here is an annotated example:

``` nix
{ stdenv, lib, fetchFromGitHub, kernel, kernelModuleMakeFlags, kmod }:

stdenv.mkDerivation rec {
  pname = "v4l2loopback-dc";
  version = "1.6";

  src = fetchFromGitHub {
    owner = "aramg";
    repo = "droidcam";
    tag = "v${version}";
    hash = "1d9qpnmqa3pfwsrpjnxdz76ipk4w37bbxyrazchh4vslnfc886fx";
  };

  sourceRoot = "source/linux/v4l2loopback";
  hardeningDisable = [ "pic" "format" ];                                             # 1
  nativeBuildInputs = kernel.moduleBuildDependencies;                       # 2

  makeFlags = kernelModuleMakeFlags ++ [
    "KERNELRELEASE=${kernel.modDirVersion}"                                 # 3
    "KERNEL_DIR=${kernel.dev}/lib/modules/${kernel.modDirVersion}/build"    # 4
    "INSTALL_MOD_PATH=$(out)"                                               # 5
  ];

  meta = {
    description = "A kernel module to create V4L2 loopback devices";
    homepage = "https://github.com/aramg/droidcam";
    license = lib.licenses.gpl2;
    maintainers = [ lib.maintainers.makefu ];
    platforms = lib.platforms.linux;
  };
}
```

1\. For kernel modules it is necessary to disable `pic` in compiler hardenings as the kernel need different compiler flags.

2\. In addition to other dependencies in `nativeBuildInputs` you should include `kernel.moduleBuildDependencies` as this propagates additional libraries required during the build.

3\. Some kernel modules try guess the kernel version based on the running kernel via `uname`. Usually they save this information in a makefile variable like `KERNELRELEASE`. If this is the case you can override the kernel version via `makeFlags`. The right kernel version string can be found in `kernel.modDirVersion`.

4\. You need to find out how the build environment (Makefile in general) finds the kernel tree. This is sometimes `KDIR` and sometimes `KERNEL_DIR`.

5\. Lastly it is required to give the kernel build system the right location where to install the kernel module. This is done by setting `INSTALL_MOD_PATH` to `$out` Otherwise an error like `mkdir: cannot create directory '/lib': Permission denied` is generated.

You can then call your program using something like `let yourprogram = config.boot.kernelPackages.callPackage ./your-derivation.nix {}; in …` (or if you want to compile it for the default kernel used by nix you can use `pkgs.linuxPackages.callPackage` but be aware that if you install it on a system running another kernel it will not work) and install the module in the kernel using `boot.extraModulePackages = [ yourprogram ];`.

### Developing out-of-tree kernel modules

See also:

If you work on an out-of-tree kernel module the workflow could look as follow:

``` C
#include <linux/module.h>
#define MODULE_NAME "hello"
static int __init hello_init(void)
{
    printk(KERN_INFO "hello world!\n");
    return 0;
}
static void __exit hello_cleanup(void) {
    printk(KERN_INFO "bye world!\n");
}
module_init(hello_init);
module_exit(hello_cleanup);
```

``` Make
obj-m += hello.o
```

``` console>
$ nix-shell '<nixpkgs>' -A linux.dev
$ make -C $(nix-build -E '(import <nixpkgs> {}).linux.dev' --no-out-link)/lib/modules/*/build M=$(pwd) modules
$ insmod ./hello.ko
$ dmesg | grep hello
[   82.027229] hello world!
</syntaxHighlight>

If wishing to develop out-of-tree kernel modules for kernels aside from the default variant shipped under <code>pkgs.linuxPackages</code>, you can replace <code>linux.dev</code> with (for instance) <code>linuxPackages_latest.kernel.dev</code>.

If you want a local development environment and are only interested in Module.symvers, then you can do instead:
<syntaxHighlight lang=
```

\$ cp \$(nix-build -E '(import <nixpkgs> {}).linux.dev' --no-out-link)/lib/modules/\*/build/Module.symvers .

</syntaxHighlight>

### Loading out-of-tree kernel modules

As far as I understand, if you developed a kernel module, you should end up with having some `.ko` files inside a subfolder inside `$out/lib/modules/${kernel.modDirVersion}`. Now, if you want to make your module loadable inside the kernel by `modprobe`, you should do:

``` nix
boot.extraModulePackages = [ yourmodulename ];
```

Then, the user can load it using:

``` console
$ sudo modprobe yourmodulename
```

or unload it using

``` console
$ sudo modprobe -r yourmodulename
```

However, if you want to autoload your module at startup in stage 2, you need to do:

``` nix
boot.kernelModules = [ "yourmodulename" ]; 
```

and the module will be automatically loaded after a reboot. If you want instead to load it at stage 1 (before the root is even mounted), you need to add it to `boot.initrd.availableKernelModules` and `boot.initrd.kernelModules`.

Note that if you don't reboot, you can still load manually the module using `modprobe `<yourmodulename>, and to automatically enable a module during configuration switch/reboot, you can put `modprobe yourmodulename || true` inside the script of a systemctl service (it is for example what does wireguard).

Finally, if you want to define some options by default (used when you load manually a module using `modprobe`, or when the system boots), you can specify them in:

``` nix
boot.extraModprobeConfig = ''
  options yourmodulename optionA=valueA optionB=valueB
'';
```

If you have developed a Nix package for your module, and want to only add the module to your `configuration.nix` instead of complete rebuilding the system based on your local `nixpkgs`, you need to update `boot.kernelPackages` as well, so kernel and modules can match each other:

``` nix
{
  boot = {
    kernelPackages = pkgs.wip.linuxPackages;
    extraModulePackages = with config.boot.kernelPackages; [ yourmodulename ];
  }
  nixpkgs.config = {
    # Allow unfree modules
    allowUnfree = true;
    packageOverrides = pkgs: {
      wip = import (fetchGit { url = "/home/user/nixpkgs"; shallow = true;}) {
        config = config.nixpkgs.config;
      };
    };
  };
};
```

### Cross-compiling Linux from source

Save the following as `shell.nix` for your nix-shell:

``` nix
{ pkgs ? import <nixpkgs> {} }:
let
  # more platforms are defined here: https://github.com/NixOS/nixpkgs/blob/master/lib/systems/examples.nix
  aarch64 = pkgs.pkgsCross.aarch64-multiplatform;
in
aarch64.linux.overrideAttrs (old: {
  # the override is optional if you need for example more build dependencies
  nativeBuildInputs = old.nativeBuildInputs ++ [ pkgs.gllvm ];
})
```

Then you can run the following commands (in the nix-shell `$makeFlags` will contain the necessary cross-compiling arguments)

``` console
$ nix-shell
$ # to configure
$ nix-shell> make $makeFlags defconfig -j $(nproc)
$ # to build
$ nix-shell> make $makeFlags -j $(nproc)
```

### Compiling Linux with clang

Save this as `shell.nix`

``` nix
{ pkgs ? import <nixpkgs> {} }:
pkgs.linux.override {
   # needs to be clang11Stdenv or newer
   stdenv = clang11Stdenv;
}
```

Then you can use:

``` console
$ nix-shell
$ # to configure
$ nix-shell> make $makeFlags defconfig -j $(nproc)
$ # to build
$ nix-shell> make $makeFlags -j $(nproc)
```

### Overriding kernel packages

In order to override `linuxPackages`, an alias of `linuxKernel.packages`, use the `extend` attribute. Example:

``` nix
linuxPackages.extend (self: super: {
  xpadneo = super.xpadneo.overrideAttrs (o: rec {
    src = pkgs.fetchFromGitHub {
      # Custom override goes here.
    };
  });
});
```

Here is a fully worked example to enable debugging for the `zfsUnstable` module:

``` nix
 nixpkgs.overlays = [
    (self: super: {
      linuxPackages = super.linuxPackages.extend (lpself: lpsuper: {
        zfsUnstable = super.linuxPackages.zfsUnstable.overrideAttrs (oldAttrs: {
          configureFlags = oldAttrs.configureFlags ++ [ "--enable-debug" ];
        });
      });
    })
  ];
```

You can also use `kernelPackagesExtensions` in a similar fashion to override `linuxKernel.packages`:

``` nix
nixpkgs.overlays = [   
  (_: prev: {
    kernelPackagesExtensions = prev.kernelPackagesExtensions ++ [
      (_: linuxPrev: {
        digimend = linuxPrev.digimend.overrideAttrs (prevAttrs: {
          postPatch = prevAttrs.postPatch or "" + ''
            substituteInPlace "hid-uclogic-core.c" \
              --replace-fail "del_timer_sync" "timer_shutdown_sync"
          '';
        });
      })
    ];
  })
];
```

## Patching a single In-tree kernel module

If you wish to patch a single kernel module, you can avoid rebuilding the entire linux kernel by packaging that module applying patches to it.

### Packaging a single kernel module

Here is an example for how to package the `amdgpu` kernel module.

``` nix
{ pkgs
, lib
, kernel ? pkgs.linuxPackages_latest.kernel
}:

pkgs.stdenv.mkDerivation {
  pname = "amdgpu-kernel-module";
  inherit (kernel) src version postPatch nativeBuildInputs;

  kernel_dev = kernel.dev;
  kernelVersion = kernel.modDirVersion;

  modulePath = "drivers/gpu/drm/amd/amdgpu";

  buildPhase = ''
    BUILT_KERNEL=$kernel_dev/lib/modules/$kernelVersion/build

    cp $BUILT_KERNEL/Module.symvers .
    cp $BUILT_KERNEL/.config        .
    cp $kernel_dev/vmlinux          .

    make "-j$NIX_BUILD_CORES" modules_prepare
    make "-j$NIX_BUILD_CORES" M=$modulePath modules
  '';

  installPhase = ''
    make \
      INSTALL_MOD_PATH="$out" \
      XZ="xz -T$NIX_BUILD_CORES" \
      M="$modulePath" \
      modules_install
  '';

  meta = {
    description = "AMD GPU kernel module";
    license = lib.licenses.gpl3;
  };
}
```

### Replacing default kernel modules

After packaging the kernel module you can add it to your system just like an out-of-tree kernel module, it will replace the default module provided by the linux package because it has the same name:

``` nix
{pkgs, config, ...}:
let
  amdgpu-kernel-module = pkgs.callPackage ./amdgpu-kernel-module.nix {
    # Make sure the module targets the same kernel as your system is using.
    kernel = config.boot.kernelPackages.kernel;
  };
in
{
  boot.extraModulePackages = [
    (amdgpu-kernel-module.overrideAttrs (_: {
      patches = [ ./patches/amdgpu-foo-bar.patch ];
    }))
  ];
}
```

## Sysctls

Example of configuring kernel sysctls:

``` nix
{
  boot.kernel.sysctl."net.ipv4.tcp_ecn" = 1;
}
```

## Sysfs

Example of configuring kernel sysfs:

``` nix
{
  boot.kernel.sysfs = {
    kernel.mm.transparent_hugepage = {
      enabled = "always";
      defrag = "defer";
      shmem_enabled = "within_size";
    };
  };
}
```

## See also

<a href="Kernel_Debugging_with_QEMU" class="wikilink" title="Kernel Debugging with QEMU">Kernel Debugging with QEMU</a>

## References

<references />

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>

[^1]: <https://github.com/hakavlad/nohang?tab=readme-ov-file#what-is-the-problem>

[^2]: \[<https://logs.nix.samueldr.com/nixos/2018-05-09#1525898458-1525898534>; \#nixos 2018-05-09\]

[^3]: [`nixos/modules/misc/crashdump.nix#L63-L73`](https://github.com/NixOS/nixpkgs/blob/03d4694e6110fa9c16e88ee74085ea2068c27494/nixos/modules/misc/crashdump.nix#L63-L73)

[^4]: \[<https://github.com/NixOS/nixpkgs/blob/e6db435973160591fe7348876a5567c729495175/pkgs/os-specific/linux/kernel/generic.nix#L11-L56>`pkgs/os-specific/linux/kernel/generic.nix#L11-L56`\]
