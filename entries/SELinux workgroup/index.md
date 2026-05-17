<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SELinux workgroup -->

## Selinux

Security-Enhanced Linux (SELinux) is a security architecture for Linux® systems that allows administrators to have more control over who can access the system. It was originally developed by the United States National Security Agency (NSA) as a series of patches to the Linux kernel using Linux Security Modules (LSM).

#### Config Sample

``` nix

 boot.kernelParams = [ "security=selinux" ];
 # compile kernel with SELinux support - but also support for other LSM modules
 boot.kernelPatches = [ {
        name = "selinux-config";
        patch = null;
        extraConfig = ''
                SECURITY_SELINUX y
                SECURITY_SELINUX_BOOTPARAM n
                SECURITY_SELINUX_DISABLE n
                SECURITY_SELINUX_DEVELOP y
                SECURITY_SELINUX_AVC_STATS y
                SECURITY_SELINUX_CHECKREQPROT_VALUE 0
                DEFAULT_SECURITY_SELINUX n
              '';
        } ];
 # policycoreutils is for load_policy, fixfiles, setfiles, setsebool, semodile, and sestatus.
 environment.systemPackages = with pkgs; [ policycoreutils ];
 # build systemd with SELinux support so it loads policy at boot and supports file labelling
 systemd.package = pkgs.systemd.override { withSelinux = true; };
```

#### Links

- [RHEL overview to SElinux](https://www.redhat.com/de/topics/linux/what-is-selinux)
- [Archwiki to SElinux](https://wiki.archlinux.org/title/SELinux)
- [Proposed patch for subst file-contexts](https://lore.kernel.org/selinux/7853167.K65cXu0y11@neuromancer/T/#u), this maps /nix/store/\* directories to / for file labelling (both initial system labelling and dynamic labelling of new files).
- [GitHub page for e-user's changes adding SELinux support to NixOS](https://github.com/NixOS/nix/pull/2670).
