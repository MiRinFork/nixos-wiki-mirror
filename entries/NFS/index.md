<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NFS -->

\_\_FORCETOC\_\_

<a href="wikipedia:Network_File_System" class="wikilink" title="NFS">NFS</a> is a distribute filesystem protocol to access directories and files over a network.

# Server

## NFS share setup

### Using bind mounts

When deploying NFS, it is considered best practice to bind mount directories to be shared to a "virtual root directory" (typically `/export`) as filesystems to be exported can be made available under a single directory.

Let's say that we've got one server-machine with 2 directories that we want to share: `/mnt/tomoyo` and `/mnt/kotomi`.

First, we have to create a dedicated directory ("virtual root directory") from which our NFS server will access the data:

``` console
$ mkdir /export
```

You may need to change ownership of the `/export` directory to `nobody:nogroup`.

Next mount directories to the virtual root directory.

``` console
# mount --bind /mnt/tomoyo /export/tomoyo
# mount --bind /mnt/kotomi /export/kotomi
```

Generate hardware config:

``` console
nixos-generate-config
```

This will add the following to `hardware-configuration.nix`.

Refer to <a href="Filesystems#Bind_mounts" class="wikilink" title="Filesystems#Bind mounts">Filesystems#Bind mounts</a> for more information on bind mounts.

### Using btrfs subvolumes

If you are using Btrfs, instead of moving existing directories or bind-mounting them into `/export`, you can create dedicated subvolumes directly under `/export`. This avoids the need for additional bind mounts and makes snapshotting or quota management easier. See <a href="btrfs#Subvolumes" class="wikilink" title="btrfs#Subvolumes">btrfs#Subvolumes</a> for details on creating subvolumes.

## NFS service configuration

Having the filesystem ready, we can proceed to configure the NFS server itself:

This configuration exposes all our shares to 2 local IPs; you can find more examples at [Gentoo's wiki on NFS](https://wiki.gentoo.org/wiki/NFSv4).

To list the current loaded exports, use: `exportfs -v`

Other options are available on the [NixOS option page](https://search.nixos.org/options?query=nfs) or via the `nixos-option` command.

12345</code>. See the [btrfs interoperability docs](https://btrfs.readthedocs.io/en/latest/Interoperability.html#nfs) for more info.}}

### Firewall

If your server-machine has a firewall turned on (as NixOS does by default, for instance), don't forget to open appropriate ports; e.g. for NFSv4:

``` nix
networking.firewall.allowedTCPPorts = [ 2049 ];
```

Many clients only support NFSv3, which requires the server to have fixed ports:

``` nix
  services.nfs.server = {
    enable = true;
    # fixed rpc.statd port; for firewall
    lockdPort = 4001;
    mountdPort = 4002;
    statdPort = 4000;
    extraNfsdConfig = '''';
  };
  networking.firewall = {
    enable = true;
      # for NFSv3; view with `rpcinfo -p`
    allowedTCPPorts = [ 111  2049 4000 4001 4002 20048 ];
    allowedUDPPorts = [ 111 2049 4000 4001  4002 20048 ];
  };
```

# Client

To ensure the client has the necessary NFS utilities installed to mount NFS drives, add "nfs" to .

Next mount exports to your local directories:

``` console
# mount 192.0.2.1:/tomoyo /mnt/tomoyo
# mount 192.0.2.1:/kotomi /mnt/kotomi
```

Generate hardware config:

``` console
nixos-generate-config
```

This will add the following to `hardware-configuration.nix`.

Other, regular [filesystem options](https://search.nixos.org/options?query=filesystems.%3Cname%3E) apply.

## Specifying NFS version

You can specify NFS version by adding the `"nfsvers="` option:

``` nix
{
  fileSystems."/mnt/tomoyo" = {
    # ...
    options = [ "nfsvers=4.2" ];
  };
}
```

## Lazy-mounting

By default, all shares will be mounted right when your machine starts - apart from being simply unwanted sometimes, this may also cause issues when your computer doesn't have a stable network connection or uses WiFi; you can fix this by telling systemd to mount your shares the first time they are *accessed* (instead of keeping them mounted at all times):

``` nix
{
  fileSystems."/mnt/tomoyo" = {
    # ...
    options = [ "x-systemd.automount" "noauto" ];
  };
}
```

## Auto-disconnecting

You can tell systemd to disconnect your NFS-client from the NFS-server when the directory has not been accessed for some time:

``` nix
{
  fileSystems."/mnt/tomoyo" = {
    # ...
    options = [ "x-systemd.idle-timeout=600" ]; # disconnects after 10 minutes (i.e. 600 seconds)
  };
}
```

## Using systemd.mounts and systemd.automounts

This section provides an alternative approach for users who prefer to manage mounts using dedicated systemd units. Here is an example with auto-disconnecting and lazy-mounting implemented, and the `noatime` mount option added.

Note that `wantedBy = [ "multi-user.target" ];` is required for the automount unit to start at boot.

Also note that `x-systemd` mount options are unneeded, as they are a representation of systemd options in `fstab(5)` format. They get parsed and converted to unit files by `systemd-fstab-generator(8)` as mentioned in `systemd.mount(5)`.

``` nix
{
  services.rpcbind.enable = true; # needed for NFS
  systemd.mounts = [{
    type = "nfs";
    mountConfig = {
      Options = "noatime";
    };
    what = "server:/tomoyo";
    where = "/mnt/tomoyo";
  }];

  systemd.automounts = [{
    wantedBy = [ "multi-user.target" ];
    automountConfig = {
      TimeoutIdleSec = "600";
    };
    where = "/mnt/tomoyo";
  }];
}
```

Multiple mounts with the exact same options can benefit from abstraction.

``` nix
{
  services.rpcbind.enable = true; # needed for NFS
  systemd.mounts = let commonMountOptions = {
    type = "nfs";
    mountConfig = {
      Options = "noatime";
    };
  };

  in

  [
    (commonMountOptions // {
      what = "server:/tomoyo";
      where = "/mnt/tomoyo";
    })

    (commonMountOptions // {
      what = "server:/kotomi";
      where = "/mnt/kotomi";
    })
  ];

  systemd.automounts = let commonAutoMountOptions = {
    wantedBy = [ "multi-user.target" ];
    automountConfig = {
      TimeoutIdleSec = "600";
    };
  };

  in

  [
    (commonAutoMountOptions // { where = "/mnt/tomoyo"; })
    (commonAutoMountOptions // { where = "/mnt/kotomi"; })
  ];
}
```

# Nix store on NFS

In a single-user setup (**not on Nixos**) the Nix store can be also exported over NFS (common in HPC clusters) to share package over the networks. The only requirement is to also pass `local_lock=flock` or `local_lock=all` as mount option to allow the nix packages to take locks on modifications. Example entry in `fstab`:

``` console
<host_or_ip>/nix /nix nfs nofail,x-systemd.device-timeout=4,local_lock=all 0 0
```

**TODO:** Why this? That seems extremely unsafe. This disables NFS locks (which apply to all NFS clients), and makes locks *local*, meaning a lock taken by one NFS client isn't seen by another, and both can take their locks. So this removes protection against concurrent writes, which Nix assumes.

<a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
