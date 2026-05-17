<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Netboot -->

This provides an easy way to serve the NixOS installer over netboot, such as when you already have a working NixOS machine and want to install NixOS on a second machine connected to the same network.

## Setup

This example uses [Pixiecore](https://github.com/danderson/netboot/tree/main/pixiecore) for hosting, which works in an ordinary network environment with an existing DHCP server. Pixiecore will notice when the booted machine talks to the network's existing DHCP server, and send netboot information to it at that time.

``` nix
services.pixiecore = {
  enable = true;
  openFirewall = true;
  dhcpNoBind = true;
  kernel = "https://boot.netboot.xyz";
};
```

The Pixicore server will provide a [netboot.xyz](https://netboot.xyz) multi-boot image to the clients, offering various operating systems which will get downloaded by the client on demand.

## Tips and tricks

### Serve custom NixOS installation images

Create file `system.nix`:

``` nix
let
  nixpkgs = builtins.getFlake "github:nixos/nixpkgs/nixos-25.11";

  sys = nixpkgs.lib.nixosSystem {
    system = "x86_64-linux";
    modules = [
      ({ config, pkgs, lib, modulesPath, ... }: {
        imports = [
          (modulesPath + "/installer/netboot/netboot-minimal.nix")
        ];
        config = {
          ## Some useful options for setting up a new system
          # services.getty.autologinUser = lib.mkForce "root";
          # users.users.root.openssh.authorizedKeys.keys = [ ... ];
          # console.keyMap = "de";
          # hardware.video.hidpi.enable = true;

          system.stateVersion = config.system.nixos.release;
        };
      })
    ];
  };

  run-pixiecore = let
    hostPkgs = if sys.pkgs.system == builtins.currentSystem
               then sys.pkgs
               else nixpkgs.legacyPackages.${builtins.currentSystem};
    build = sys.config.system.build;
  in hostPkgs.writers.writeBash "run-pixiecore" ''
    exec ${hostPkgs.pixiecore}/bin/pixiecore \
      boot ${build.kernel}/bzImage ${build.netbootRamdisk}/initrd \
      --cmdline "init=${build.toplevel}/init loglevel=4" \
      --debug --dhcp-no-bind \
      --port 64172 --status-port 64172 "$@"
  '';
in
  run-pixiecore
```

Building:

``` bash
# Build pixiecore runner
nix-build system.nix -o /tmp/run-pixiecore
```

Running:

``` bash
# Open required firewall ports
sudo iptables -w -I nixos-fw -p udp -m multiport --dports 67,69,4011 -j ACCEPT
sudo iptables -w -I nixos-fw -p tcp -m tcp --dport 64172 -j ACCEPT

# Run pixiecore
sudo $(realpath /tmp/run-pixiecore)

# Close ports
sudo iptables -w -D nixos-fw -p udp -m multiport --dports 67,69,4011 -j ACCEPT
sudo iptables -w -D nixos-fw -p tcp -m tcp --dport 64172 -j ACCEPT
```

#### Another example

Building:

``` bash
# Build pixiecore runner
nix-build netboot.nix -o /tmp/run-pixiecore

# Build dnsmasq + pxelinux runner
nix-build netboot.nix --arg legacy true -o /tmp/run-dnsmasq

# Build for some ancient system with a serial console
nix-build netboot.nix --arg name '"ancient-netboot"' -o /tmp/run-netboot \
  --arg configuration 'import ./ancient-config.nix' \
  --arg legacy true --arg proxynets '["10.2.1.0"]' \
  --arg serialconsole true --arg serialport 3 --arg serialspeed 115200
```

Running:

- Run the example exactly like the other example further up on the page.

### Troubleshooting

- Error "**autoexec.ipxe... Operation not supported**": See [this issue](https://github.com/NixOS/nixpkgs/pull/378513#pullrequestreview-3081586117).

## See also

- NixOS manual: [PXE booting](https://nixos.org/nixos/manual/index.html#sec-booting-from-pxe).

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>
