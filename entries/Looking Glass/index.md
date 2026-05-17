<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Looking Glass -->

### Prerequisites

- NixOS 25.11 (unstable should work too)
- Looking Glass B7
- systemd 258 (because of [this](https://github.com/systemd/systemd/issues/39056))

### Configuration

#### IVSHMEM with the KVMFR module

###### Installing and Loading

``` nix
  boot.extraModulePackages = [ config.boot.kernelPackages.kvmfr ];
  boot.initrd.kernelModules = [ "kvmfr" ];
  boot.kernelParams = [ "kvmfr.static_size_mb=64" ]; # replace with your calculated MEM requirement
```

###### Permissions

``` nix
  services.udev.packages = lib.singleton (pkgs.writeTextFile
    { 
      name = "kvmfr";
      text = ''
        SUBSYSTEM=="kvmfr", GROUP="kvm", MODE="0660", TAG+="uaccess"
      '';
      destination = "/etc/udev/rules.d/70-kvmfr.rules";
    }
  );
```

###### CGroups

``` nix
  virtualisation.libvirtd.qemu = {
    verbatimConfig = ''
      namespaces = []
      cgroup_device_acl = [
        "/dev/null", "/dev/full", "/dev/zero",
        "/dev/random", "/dev/urandom",
        "/dev/ptmx", "/dev/kvm", "/dev/kqemu",
        "/dev/rtc","/dev/hpet", "/dev/vfio/vfio",
        "/dev/kvmfr0"
      ]
    '';
  };
```

#### Install the Looking Glass client

``` nix
  environment.systemPackages = with pkgs; [
    looking-glass-client
  ];
```
