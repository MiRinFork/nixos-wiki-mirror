<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Rackspace Cloud Servers -->

This page is a slightly modified version of <a href="Install_NixOS_on_Online.Net" class="wikilink" title="the instructions for Online.net">the instructions for Online.net</a>, which in turn are based on <a href="Install_NixOS_on_Linode" class="wikilink" title="the instructions for Linode">the instructions for Linode</a>, and all real credit goes to the authors of that page. I won't bother explaining as much here, so if something is unclear, please refer back to the original page. I've tested this with Rackspace 2GB Perf1 Cloud Servers in Chicago and other regions.

Start by installing a flavor of Linux (don't care which, since we'll be blowing it away) using the standard Rackspace control panel.

Let the image get built. When it's ready, click on the server and boot it into rescue mode. This will give you a temporary password for the rescue image, and then login at the given IP address. The machine is a Debian Jessie image.

## Preparation

## Install some necessary stuff

You'll need bzip2 later. Also, you'll need to set up some group permissions so NixOS can install properly:

``` console
$ apt-get update && apt-get install bzip2
$ addgroup nixbld && adduser --disabled-password nixbld0 && usermod -a -G nixbld nixbld0
```

The user is temporary; you'll be erasing everything, after all.

### Check your partitions

Rackspace servers, by default, all come with two drives: a single 'system disk', and a 'data disk'. These are located on separate devices. System disks are designed to be stored as 'machine images', since this is the disk the machine boots off of. We'll ignore the data disk for the rest of this page.

NOTE: 1GB rackspace images do not have a 'data disk' at all. All other Virtual machines come with a data disk.

Normally, your system disk is available under `/dev/xvda`. When you boot into the rescue image though, the disk is \`/dev/xvdb\`.

Now, make sure your partitions are where you expect them, on `/dev/xvdb`.

``` bash
fdisk -l /dev/xvdb
```

Here's what mine look like on a 2gb cloud image:

``` bash
Disk /dev/xvdb: 40 GiB, 42949672960 bytes, 83886080 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x0004cdc6

Device     Boot Start       End   Blocks  Id System
/dev/xvda1 *     2048  83875364 41936658+ 83 Linux
```

### Format your partitions

This will blast away any existing data on your main disk, so make sure you're okay with that.

``` bash
mkfs.ext4 /dev/xvdb1 -L nixos
```

### Mount your freshly minted filesystems

and mount the new ones we made:

``` console
$ mount /dev/xvdb1 /mnt && mkdir /mnt/boot
```

## Nix-flavored stuff

### Get nix onto the rescue system

We'll need some nix packages to install nix on the target:

``` bash
bash <(curl https://nixos.org/nix/install)
. /root/.nix-profile/etc/profile.d/nix.sh
nix-channel --remove nixpkgs
nix-channel --add http://nixos.org/channels/nixos-unstable nixos
nix-channel --update

cat <<EOF > configuration.nix
{ fileSystems."/" = {};
  boot.loader.grub.enable = false;
}
EOF

export NIX_PATH=nixpkgs=/root/.nix-defexpr/channels/nixos:nixos=/root/.nix-defexpr/channels/nixos/nixos
export NIXOS_CONFIG=/root/configuration.nix
nix-env -i -A config.system.build.nixos-install -A config.system.build.nixos-option -A config.system.build.nixos-generate-config -f "<nixos>"
```

### Make configuration for your target system

Generate a default configuration:

``` bash
nixos-generate-config --root /mnt
```

This will generate `/mnt/etc/nixos/configuration.nix` and `/mnt/etc/nixos/hardware-configuration.nix`. Eyeball the latter (`nano` is preinstalled) to make sure the filesystem config looks reasonable and that it's detected your cores correctly. Then customize the former to your liking. You'll need to explicitly set up your networking information accordingly.

If you need to figure out your current network settings to fill in the gaps in the settings file, try `cat /etc/resolv.conf` and `cat /etc/network/interfaces`.

Here's a sample config from my box:

``` nix
{ config, pkgs, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Use the GRUB 2 boot loader.
  boot.loader.grub.enable = true;
  boot.loader.grub.version = 2;
  # Define on which hard drive you want to install Grub.
  boot.loader.grub.device = "/dev/xvdb";

  networking.hostName        = "nixos"; # Define your hostname.
  networking.interfaces.eth0 = { ipAddress = "166.78.116.171"; prefixLength = 24; };
  networking.defaultGateway  = "166.78.116.1";
  networking.nameservers     = [ "173.203.4.8" "173.203.4.9" ];

  time.timeZone = "America/Chicago";

  i18n = {
     defaultLocale = "en_US.UTF-8";
  };

  # environment.systemPackages = with pkgs; [
  #   wget
  # ];

  services.openssh.enable = true;

  security.sudo.wheelNeedsPassword = false;

  users.extraUsers.youruser = 
    { createHome      = true;
      home            = "/home/youruser";
      description     = "your name";
      extraGroups     = [ "wheel" ];
      useDefaultShell = true;
      openssh.authorizedKeys.keys = [
        "<your pubkey here>"
      ];
    };
}
```

Note something <b>very important</b>: we set GRUB to install to `/dev/xvdb`, which is the right thing to do when we install <i>from the rescue image</i>. Once we reboot, we need to change this to point back to \`/dev/xvda\`, in case of GRUB updates.

### Actually install the system

``` bash
unset NIXOS_CONFIG
nixos-install
```

That should spend some time downloading and copying stuff around, and then should fail without error. After that, tell the web console to exit rescue mode - your machine will be rebooted, and then you can login to NixOS!

### Reboot and fix boot.loader.grub.device

As mentioned above, after your reboot for the first time, you need to go back to `/etc/nixos/configuration.nix` and make sure `boot.loader.grub.device` is changed to look back at `/dev/xvda` instead. This way your bootloader is properly configured when GRUB may update.

## Troubleshooting

If `nixos-install` fails to download files from the internet, check that your rescue image's `/etc/resolv.conf`is not a symlink. The issue should be fixed now, but at some point the `nixos-install` chroot process would not copy symlinks appropriately, so things would not resolve in the jail.

See [this commit](https://github.com/NixOS/nixpkgs/commit/6ebe4a6a523bbab3388453ac119ab08e295a7e06) for the fix.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
