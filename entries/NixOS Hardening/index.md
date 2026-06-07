<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Hardening -->

## Kernel

### linux-hardened

[linux-hardened](https://github.com/anthraxx/linux-hardened) is a Linux kernel with additional hardening patches applied. You can build it from source, but you have to keep the kernel up to date for receiving security patches. You can check for latest releases [here](https://github.com/anthraxx/linux-hardened/releases).

``` nix
boot.kernelPackages = let
  linux_hardened_pkg = { fetchFromGitHub, buildLinux, lib, ... } @ args:

      buildLinux (args // rec {
        version = "6.18.33-hardened1";
          hash = "sha256-SlsOQjREc73E+90FiR+zrNELtUY9yZAT34vBr4Dt7h4=";
        extraMeta.branch = "6.18";

        modDirVersion = version;
        src = fetchFromGitHub {
          inherit hash;
          owner = "anthraxx";
          repo = "linux-hardened";
          tag = "v${version}";
        };
        kernelPatches = [];

        structuredExtraConfig = with lib.kernel; {
          # Perform additional validation of commonly targeted structures.
          DEBUG_NOTIFIERS = yes;
          DEBUG_PLIST = yes;
          DEBUG_SG = yes;
          DEBUG_VIRTUAL = yes;
          SCHED_STACK_END_CHECK = yes;

          # tell EFI to wipe memory during reset
          # https://lwn.net/Articles/730006/
          RESET_ATTACK_MITIGATION = yes;

          # restricts loading of line disciplines via TIOCSETD ioctl to CAP_SYS_MODULE
          CONFIG_LDISC_AUTOLOAD = option no;

          # Enable init_on_free by default
          INIT_ON_FREE_DEFAULT_ON = yes;

          # Initialize all stack variables on function entry
          INIT_STACK_ALL_ZERO = yes;

          # Wipe all caller-used registers on exit from a function
          ZERO_CALL_USED_REGS = yes;

          # Enable the SafeSetId LSM
          SECURITY_SAFESETID = yes;

          # Reboot devices immediately if kernel experiences an Oops.
          PANIC_TIMEOUT = freeform "-1";

          # Enable gcc plugin options
          GCC_PLUGINS = yes;

          # Runtime undefined behaviour checks
          # https://www.kernel.org/doc/html/latest/dev-tools/ubsan.html
          # https://developers.redhat.com/blog/2014/10/16/gcc-undefined-behavior-sanitizer-ubsan
          UBSAN = yes;
          UBSAN_TRAP = yes;
          UBSAN_BOUNDS = yes;
          UBSAN_LOCAL_BOUNDS = option yes; # clang only
          CFI_CLANG = option yes; # clang only Control Flow Integrity since 6.1

          # Disable various dangerous settings
          PROC_KCORE = no; # Exposes kernel text image layout
          INET_DIAG = no; # Has been used for heap based attacks in the past

          # INET_DIAG=n causes the following options to not exist anymore, but since they are defined in common-config.nix,
          # make them optional
          INET_DIAG_DESTROY = option no;
          INET_RAW_DIAG = option no;
          INET_TCP_DIAG = option no;
          INET_UDP_DIAG = option no;
          INET_MPTCP_DIAG = option no;

          # CONFIG_DEVMEM=n causes these to not exist anymore.
          STRICT_DEVMEM = option no;
          IO_STRICT_DEVMEM = option no;

          # stricter IOMMU TLB invalidation
          IOMMU_DEFAULT_DMA_STRICT = option yes;
          IOMMU_DEFAULT_DMA_LAZY = option no;

          # not needed for less than a decade old glibc versions
          LEGACY_VSYSCALL_NONE = yes;
        };
      } // (args.argsOverride or {}));
    linux_hardened = pkgs.callPackage linux_hardened_pkg{};
  in
    lib.recurseIntoAttrs (pkgs.linuxPackagesFor linux_hardened);
```

### Lock kernel modules

This option locks kernel modules after the system is initialized. For example it prevents malicious USB devices from exploiting vulnerable kernel modules.

``` nix
security.lockKernelModules = true;
```

All needed modules must be loaded at boot by adding them to `boot.kernelModules`. One way of knowing what modules must be enabled is to disable this option and then list all enabled modules with `lsmod`.

``` nix
boot.kernelModules = [
  # USB
  "usb_storage" "uinput" "usbhid" "usbserial"
  # DVD
  "udf" "iso9660"
  # GPU
  "amdgpu" "i915"
  # Networking
  "nft_chain_nat" "xt_conntrack" "xt_CHECKSUM" "xt_MASQUERADE" "ipt_REJECT" "ip6t_REJECT" "nf_reject_ipv4" "nf_reject_ipv6" "xt_mark" "xt_comment" "xt_multiport" "xt_addrtype" "xt_connmark" "nf_conntrack_netlink"
];
```

### Module blacklist

``` nix
boot.blacklistedKernelModules = [
  # Obscure network protocols
  "ax25" "netrom" "rose"

  # Old or rare or insufficiently audited filesystems
  "adfs" "affs"
  "bfs" "befs"
  "cramfs"
  "efs" "erofs" "exofs"
  "freevxfs" "f2fs"
  "hfs" "hpfs"
  "jfs"
  "minix"
  "nilfs2" "ntfs"
  "omfs"
  "qnx4" "qnx6"
  "sysv"
  "ufs"
];
```

### Kernel image protection

Prevents replacing the running kernel image.

``` nix
security.protectKernelImage = true;
```

### Kernel parameters

``` nix
boot.kernelParams = [
 # Don't merge slabs
 "slab_nomerge"

 # Overwrite free'd pages
 "page_poison=1"

 # Enable page allocator randomization
 "page_alloc.shuffle=1"

 # Disable debugfs
 "debugfs=off"
];
```

### Sysctl parameters

``` nix
# Hide kptrs even for processes with CAP_SYSLOG
boot.kernel.sysctl."kernel.kptr_restrict" = "2";

# Disable bpf() JIT (to eliminate spray attacks)
boot.kernel.sysctl."net.core.bpf_jit_enable" = false;

# Disable ftrace debugging
boot.kernel.sysctl."kernel.ftrace_enabled" = false;

# Disable io_uring, a large source of security vulnerabilities
# https://security.googleblog.com/2023/06/learnings-from-kctf-vrps-42-linux.html
boot.kernel.sysctl."kernel.io_uring_disabled" = 2;

# Enable strict reverse path filtering (that is, do not attempt to route
# packets that "obviously" do not belong to the iface's network; dropped
# packets are logged as martians).
boot.kernel.sysctl."net.ipv4.conf.all.log_martians" = true;
boot.kernel.sysctl."net.ipv4.conf.all.rp_filter" = "1";
boot.kernel.sysctl."net.ipv4.conf.default.log_martians" = true;
boot.kernel.sysctl."net.ipv4.conf.default.rp_filter" = "1";

# Ignore broadcast ICMP (mitigate SMURF)
boot.kernel.sysctl."net.ipv4.icmp_echo_ignore_broadcasts" = true;

# Ignore incoming ICMP redirects (note: default is needed to ensure that the
# setting is applied to interfaces added after the sysctls are set)
boot.kernel.sysctl."net.ipv4.conf.all.accept_redirects" = false;
boot.kernel.sysctl."net.ipv4.conf.all.secure_redirects" = false;
boot.kernel.sysctl."net.ipv4.conf.default.accept_redirects" = false;
boot.kernel.sysctl."net.ipv4.conf.default.secure_redirects" = false;
boot.kernel.sysctl."net.ipv6.conf.all.accept_redirects" = false;
boot.kernel.sysctl."net.ipv6.conf.default.accept_redirects" = false;

# Ignore outgoing ICMP redirects (this is ipv4 only)
boot.kernel.sysctl."net.ipv4.conf.all.send_redirects" = false;
boot.kernel.sysctl."net.ipv4.conf.default.send_redirects" = false;
```

### Disable Simultaneous Multithreading (SMT)

Might cause significant performance cost.

``` nix
security.allowSimultaneousMultithreading = false;
```

### Force Page Table Isolation

``` nix
security.forcePageTableIsolation = true;
```

## Nix settings

### Nix allowed users

This option allows only `users` group to connect to the Nix daemon.

``` nix
nix.settings.allowed-users = [ "@users" ];
```

## Other settings

### Memory allocator

You can use security-focused memory allocator like [scudo](https://llvm.org/docs/ScudoHardenedAllocator.html) or [GrapheneOS hardened_malloc](https://github.com/GrapheneOS/hardened_malloc).

``` nix
# scudo
environment.memoryAllocator.provider = "scudo";
environment.variables.SCUDO_OPTIONS = "zero_contents=true";

# hardened_malloc
environment.memoryAllocator.provider = "graphene-hardened";
```

Some programs may not work with these memory allocators. You can force them to use the default libc allocator by blacklisting `/etc/ld-nix.so.preload` with a firejail wrap.

``` nix
programs.firejail = {
  enable = true;
  wrappedBinaries = {
    chromium = {
      executable = "${pkgs.chromium}/bin/chromium-browser";
      profile = "${pkgs.firejail}/etc/firejail/chromium-browser.profile";
      extraArgs = [
        "--blacklist=/etc/ld-nix.so.preload"
      ];
    };
  };
};
```

### Flush L1 data cache

Might cause significant performance cost.

``` nix
security.virtualisation.flushL1DataCache = "always";
```

### AppArmor

See <a href="Security#AppArmor" class="wikilink" title="Security#AppArmor">Security#AppArmor</a> for more details.

``` nix
security.apparmor.enable = true;
security.apparmor.killUnconfinedConfinables = true;
```

## Lower-level

### Secure Boot

See <a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a>. <a href="Limine" class="wikilink" title="Limine">Limine</a> bootloader supports coreboot's Secure Boot.

## See Also

- [Arch Wiki Security Page](https://wiki.archlinux.org/title/Security)

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
