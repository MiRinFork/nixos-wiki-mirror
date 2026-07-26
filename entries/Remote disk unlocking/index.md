<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Remote disk unlocking -->

This page describes the method for <strong>remotely</strong> unlocking LUKS / ZFS encrypted root partition during boot process. SSH or even Tor may be used to access the system.

## Setup

### Add kernel modules for the network card

The network card may not work in initrd without its kernel being manually loaded by . Find out the kernel module required by checking "Kernel modules" section in the output of `lspci -v | grep -iA8 'network\|ethernet'` (`lspci` is available in ), and add it to (not to confuse with , which is for stage 2).

### Generate host key

Generate host key for the SSH daemon in `/etc/secrets/initrd/ssh_host_ed25519_key` which is required.

``` console
# mkdir -p /etc/secrets/initrd
# ssh-keygen -t ed25519 -N "" -f /etc/secrets/initrd/ssh_host_ed25519_key
```

### Configure SSH

Configure . Add the generated host key to and your public key to .

Now proceed to one of <a href="#Setup_with_Systemd" class="wikilink" title="#Setup with Systemd">#Setup with Systemd</a> or <a href="#Setup_without_Systemd" class="wikilink" title="#Setup without Systemd">#Setup without Systemd</a>.

## Setup with Systemd

### Configure systemd-networkd

has a syntax similar to . For details, see <a href="Systemd/networkd" class="wikilink" title="Systemd/networkd">Systemd/networkd</a>.

First find the interface name(s) (`eth0` in this example):

``` console
# ip addr
lo ...
eth0 ...
```

To configure DHCP:

To configure static IP:

### Debug shell

Enable debug shell. Although it is not required, enabling the debug shell allows you to enter the debug shell by press `Ctrl+Alt+F9` during Stage 1.

The network and SSH status can be checked from within the debug shell:

``` console
# networkctl status: show systemd-networkd status
# journalctl -u sshd
# cat /etc/ssh/sshd_config
```

### Automatic password prompt

To automatically be prompted for a password when logging in via SSH, add `command="systemctl default"` to .

## Setup without Systemd

Enable SSH daemon in initrd

Adapt following parts according to your setup

- **authorizedKeys**: Add the SSH public keys for the users which should be able to authenticate to the SSH daemon to the `authorizedKeys` option.
- **availableKernelModules**: Most likely your network card is not working without its kernel module being part of the initrd, so you have to find out which module is used for your network. Use `lspci -v | grep -iA8 'network\|ethernet'` for that.
- **kernelParams**:
  - When using a dynamic IP address with DHCP you might want to publish your hostname already in the initrd so it can be resolved in the local network: `boot.kernelParams = [ "ip=::::${config.networking.hostName}::dhcp" ];`[^1] Note that when using DHCP, make sure your computer is always attached to the network and is able to get an IP adress, or the boot process will hang.
  - You could also configure a static IP `boot.kernelParams = [ "ip=10.25.0.2::10.25.0.1:255.255.255.0:myhost::none" ];`, where `10.25.0.2` is the client IP, `10.25.0.1` is the gateway IP. See [the kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/nfs/nfsroot.txt) for more information on the `ip=` parameter.

The `postCommands` option is necessary to get a password prompt instead of a shell. If you omit it, you will get dropped into `/bin/ash`, and you will have to manually run `cryptsetup-askpass` to enter the password. Alternatively, the `boot.initrd.systemd.users.root.shell` option can be set to `/bin/conspy` for passwords which expect stdin. This binary included by default, and provided by busybox.

## Usage

After reboot, connect to the initrd SSH daemon using

``` bash
# ssh root@10.25.0.2
```

Where `10.25.0.2` is the IP which is acquired via DHCP or configured via the kernel parameter.

## Tips and tricks

### Bcachefs unlocking

Unlocking encrypted Bcachefs root filesystems is [not yet supported](https://github.com/NixOS/nixpkgs/issues/291529). As a workaround, following script, in combination with the setup above, can be used as SSH shell, to unlock the disk `/dev/vda2`.

Using systemd in initrd automatically continues the boot process after the target `/sysroot` is mounted.

### Wireguard in initrd

Considering you've already enabled the ssh daemon, configured networking (for example with DHCP or static IP) and configured an unlocking command, following additional snippet will enable <a href="WireGuard" class="wikilink" title="WireGuard">WireGuard</a> connectivity to a remote peer while in initrd.

``` nix
boot.initrd.availableKernelModules = [ "r8169" "wireguard" ];
boot.initrd.systemd = {
  enable = true;
  network = {
    netdevs."30-wg-initrd" = {
      netdevConfig = {
        Kind = "wireguard";
        Name = "wg-initrd";
      };
      wireguardConfig = { PrivateKeyFile = "/etc/secrets/30-wg-initrd.key"; };
      wireguardPeers = [{
        AllowedIPs = [ "10.250.0.1/32" ];
        PublicKey = "wUE//Lwi8DZVIvAjIAtMoy+ku+hJ0w28H7ofySwAJRk=";
        Endpoint = "198.51.100.1:51821";
        PersistentKeepalive = 25;
      }];
    };
    networks."30-wg-initrd" = {
      name = "wg-initrd";
      addresses = [{ Address = "10.250.0.2/24"; }];
    };
  };
};
boot.initrd.secrets."/etc/secrets/30-wg-initrd.key" = "/etc/wireguard/private-key";
```

First generate a private und public key pair as mentioned in the WireGuard article. Reference the private key in `boot.initrd.secrets`, in this exmaple `/etc/wireguard/private-key`. Put the `PublicKey` of the remote peer into the `wireguardPeers` array.

Configure the IP addresses used by your initrd peer (`10.250.0.2`) and the remote peer (`10.250.0.1`). Also specify the IP and port of the remote peer in `Endpoint`, in our example `198.51.100.1:51821`. The remote peer also needs to know address configuration and the public key of the initrd peer.

Last but not least add the `wireguard` kernel module to `boot.initrd.availableKernelModules` beside the module required by your network device.

### Tor in initrd

#### Prepare the Onion ID

You need 3 files to create an onion id (a.k.a. tor hidden service).

- `hostname`
- `hs_ed25519_public_key`
- `hs_ed25519_secret_key`

To create these files:

`$ nix-shell -p mkp224o --command "mkp224o-donna a -n 1 -d ."`  
`set workdir: ./`  
`nixuum6flqthv6ar52j5e2ldulylfsfgezykeg37iy74kqowcp5gxfyd.onion`

The files you need are in the `*.onion` directory:

`$ ls *.onion`  
`hostname  hs_ed25519_public_key  hs_ed25519_secret_key`

#### Setup Tor (systemd stage1, since NixOS 26.05)

Since version 26.05, NixOS uses systemd stage1 in initrd.

The following module starts a tor daemon in the initrd and uses it to expose the ssh port on an onion address.

``` nixos
{ config, pkgs, ... }:
let
  onionDir = "/etc/tor/onion/bootup";
  initrdTorRc = (pkgs.writeText "tor.rc" ''
    DataDirectory /etc/tor
    ShutdownWaitLength 0
    HiddenServiceDir ${onionDir}
    HiddenServicePort ${builtins.toString config.boot.initrd.network.ssh.port}
  '');
in
{
  boot.initrd = {
    secrets = {
      "${onionDir}" = /etc/secrets/initrd/onion; # Adapt to the location of your onion keys
    };
    systemd = {
      initrdBin = [ pkgs.tor ];
      storePaths = [ initrdTorRc ];
      services."tor" = {
        description = "Tor daemon";
        preStart = ''
          echo "tor: preparing onion keys"
          chmod -R 700 /etc/tor
        '';
        script = ''
          echo "tor: starting tor"
          tor -f ${initrdTorRc} --verify-config
          tor -f ${initrdTorRc}
        '';
        unitConfig.DefaultDependencies = false;
        wantedBy = [ "initrd.target" ];
        after = [
          "network.target"
          "initrd-nixos-copy-secrets.service"
        ];
        before = [ "shutdown.target" ];
        conflicts = [ "shutdown.target" ];
      };
    };
  };
}
```

#### Setup Tor (pre NixOS 26.05)

Now that you have your 3 files, you have to script a bit, but it’s not too complicated. The snippet is adapted from [krebs/2configs/tor/initrd.nix in stockholm](https://cgit.euer.krebsco.de/makefu/stockholm/src/commit/9b1008814e981dc01afe9ee7446322ad512c1d72/krebs/2configs/tor/initrd.nix).

``` nix
# copy your onion folder
boot.initrd.secrets = {
  "/etc/tor/onion/bootup" = /home/tony/tor/onion; # maybe find a better spot to store this.
};

# copy tor to you initrd
boot.initrd.extraUtilsCommands = ''
  copy_bin_and_libs ${pkgs.tor}/bin/tor
'';

# start tor during boot process
boot.initrd.network.postCommands = let
  torRc = (pkgs.writeText "tor.rc" ''
    DataDirectory /etc/tor
    SOCKSPort 127.0.0.1:9050 IsolateDestAddr
    SOCKSPort 127.0.0.1:9063
    HiddenServiceDir /etc/tor/onion/bootup
    HiddenServicePort 22 127.0.0.1:22
  '');
in ''
  echo "tor: preparing onion folder"
  # have to do this otherwise tor does not want to start
  chmod -R 700 /etc/tor

  echo "make sure localhost is up"
  ip a a 127.0.0.1/8 dev lo
  ip link set lo up

  echo "tor: starting tor"
  tor -f ${torRc} --verify-config
  tor -f ${torRc} &
'';
```

That was it. Tor should be running during your boot process.

#### Setup haveged

If your system doesn't gather enough entropy the startup time of tor is rather long (2:42 vs 0:06 on a RPi 4b). Counter it by starting `haveged`.

Append in your `boot.initrd.extraUtilsCommands`.

      copy_bin_and_libs ${pkgs.haveged}/bin/haveged

Then use this snippet before `echo "tor: starting tor"` in your `boot.initrd.network.postCommands`.

          echo "haveged: starting haveged"
          haveged -F &

#### Setup ntpdate

If your system doesn't utilize a RTC you've to ensure time is correctly set before startup of tor.

Append in your `boot.initrd.extraUtilsCommands`.

      copy_bin_and_libs ${pkgs.ntp}/bin/ntpdate

Then use this snippet before `echo "tor: starting tor"` in your `boot.initrd.network.postCommands`.

          echo "ntp: starting ntpdate"
          echo "ntp   123/tcp" >> /etc/services
          echo "ntp   123/udp" >> /etc/services
          ntpdate w.x.y.z # pick one IP from https://www.ntppool.org/

#### Usage

When your computer boots, and asks for the LUKS password. Now you can unlock your encrypted Hard drive using:

    torify ssh root@<onion.id>.onion -p 22 'my-secret-password'

### Enable Wifi in initrd

Following example configuration by [@loutr](https://discourse.nixos.org/t/wireless-connection-within-initrd/38317/13) enables wifi connections inside initrd. Replace interface name `wlp0s20f0u4` with the name of your wifi adapter. Depending on your wifi device, you might need to add different kernel modules.

``` nix
{
  boot.initrd = {
    # crypto coprocessor and wifi modules
    availableKernelModules = [
      "ccm"
      "ctr"
      "iwlmvm"
      "iwlwifi"
    ];

    systemd = {
      enable = true;

      packages = [ pkgs.wpa_supplicant ];
      initrdBin = [ pkgs.wpa_supplicant ];
      targets.initrd.wants = [ "wpa_supplicant@wlp0s20f0u4.service" ];

      # prevent WPA supplicant from requiring `sysinit.target`.
      services."wpa_supplicant@".unitConfig.DefaultDependencies = false;

      users.root.shell = "/bin/systemd-tty-ask-password-agent";

      network = {
        enable = true;
        networks."10-wlan" = {
          matchConfig.Name = "wlp0s20f0u4";
          DHCP = "yes";
        };
      };
    };

    network.ssh = {
      enable = true;
      port = 22;
      hostKeys = [ "/etc/ssh/ssh_host_ed25519_key" ];
      authorizedKeys = default.user.openssh.authorizedKeys.keys;
    };

    secrets."/etc/wpa_supplicant/wpa_supplicant-wlp0s20f0u4.conf" = /root/secrets/wpa_supplicant.conf;
  };
}
```

The file `wpa_supplicant-wlp0s20f0u4.conf` is the wireless profile used by <a href="wpa_supplicant" class="wikilink" title="wpa_supplicant">wpa_supplicant</a> which will get copied into the initramfs.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>

[^1]: <https://github.com/NixOS/nixpkgs/issues/63941#issuecomment-2628615604>
