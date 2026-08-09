<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/Hardening -->

<translate> Systemd's service options are quite lax by default, and so it is often desirable to look at ways to harden systemd services. </translate> <translate> A good way to get started on a given service is to look at the output of the command `systemd-analyze security myService`. From there, you can look at the documentation for the options you see in the output, often in `man systemd.exec` or `man systemd.resource-control`, and set the appropriate options for your service. </translate> <translate>

## Accessing the network with a different RootDirectory

</translate> <translate> To be able to access the network while having a RootDirectory specified, you need to give access to `/etc/ssl`, `/etc/static/ssl` and `/etc/resolv.conf`. The simplest way of doing this is by simply putting `/etc` in the `BindReadOnlyPaths` option. </translate> <translate> A more granular way, would be to put these 3 paths into `BindReadOnlyPaths`, and wait for the creation of `/etc/resolv.conf` through a `systemd.path` unit. </translate> <translate>

## Dropping a shell inside a systemd service

</translate> <translate> While hardening a service, it often happens that you want a shell inside a hardened systemd unit, for example to check access to files, or check the network connectivity. Since systemd v258, one may run `systemd-analyze unit-shell `<service> to accomplish this. Note that this [currently](https://mastodon.social/@zihco/114823612021351075) only works for running services. Alternatively, one might use tmux to create a session inside the service, and attaching to it outside of the service. </translate> <translate> Simple example: </translate>

``` nix

{ pkgs, ... }:
{
  systemd.services.myService = {
    serviceConfig = {
      ExecStart = "${pkgs.tmux}/bin/tmux -S /tmp/tmux.socket new-session -s my-session -d";
      ExecStop = "${pkgs.tmux}/bin/tmux -S /tmp/tmux.socket kill-session -t my-session";
      Type = "forking";

      # ...
    };
  };
}
```

<translate> Example with a `RootDirectory` specified: </translate> <translate>

``` nix
{ pkgs }:
{
  systemd.services.myService = {
    serviceConfig = {
      ExecStart = "${pkgs.tmux}/bin/tmux -S /run/myService/tmux.socket new-session -s my-session -d";
      ExecStop = "${pkgs.tmux}/bin/tmux -S /run/myService/tmux.socket kill-session -t my-session";
      Type = "forking";

      <!--T:11-->
# Used as root directory
      RuntimeDirectory = "myService";
      RootDirectory = "/run/myService";

      <!--T:12-->
BindReadOnlyPaths = [
        "/nix/store"

        <!--T:13-->
# So tmux uses /bin/sh as shell
        "/bin"
      ];

      <!--T:14-->
# This sets up a private /dev/tty
      # The tmux server would crash without this
      # since there would be nothing in /dev
      PrivateDevices = true;
    };
  };
}
```

</translate> <translate> To attach to the shell, simply execute `tmux -S /path/to/tmux.socket attach`. </translate> <translate>

## Hardened service unit example

Below is an example service unit with annotations explaining the configuration set, what it does, and why it is enabled. This list is not exhaustive, but is a good start for hardening a unit.

``` nix

{ pkgs, lib, ... }:
{
  # Package options above
  systemd.services.coolService = {
    description = "A really cool and useful system service";
    after = [ "network.target" ];

    # This is where the real unit options are set
    serviceConfig = {
      ExecStart = lib.getExe cfg.package; # The executable to run to start the service
      Restart = "on-failure"; 

      # Creates an ephemeral user for the service
      # Can be hard to deal with in nixos, so is often not used.
      # If used, Group and SupplementaryGroups must be carefully configured
      # for shared data to be useful.
      # 
      # Usually false, and a specific service user and group is used instead.
      DynamicUser = false;
      
      # The path under `/run` to create for the lifetime of the service.
      # This is a tmpfs
      RuntimeDirectory = "coolService";

      # This does a pivot_root to the tmpfs directory created with the above option.
      # This create an empty root filesystem on the tmpfs, and the service's mount namespace
      # is rooted to this directory. This greatly limits the filesystem a service can observe,
      # and the whole filesystem is destroy when the service stops, thus no other
      # system processes can access it at the end of the lifetime.
      #
      # Highly recommended.
      RootDirectory = "/run/coolService";

      # Crate a directory under "/var/lib" for the service to put stateful data in
      StateDirectory = "coolService";

      # Create a directory under /var/log for the service
      LogsDirectory = "coolService";

      # The CWD of the service. Not critical.
      WorkingDirectory = "/var/lib/coolService";

      # Since RootDirectory is set, there is nothing to make r/w
      # All paths must be bind-mounted into the mount namespace.
      #
      # If RootDirectory is not set, then this make selected paths
      # r/w. Primarily for any shared directories for the service.
      # Can be a list.
      ReadWritePaths = "";

      # Mount the entire fs as read-only. 
      ProtectSystem = "strict";

      # bind-mounts paths into the mount namespace as read/write
      #
      # Should be limited to only the paths that are required to be
      # r/w.
      BindPaths = [
        "/var/lib/coolService"
        cfg.sharedDirectory
      ];

      # bind-mounts paths into the namespace as read-only
      # Users can provide their own paths for configuration if required.
      # 
      # Should be preferred for paths that the service needs.
      BindReadOnlyPaths = [
        # The Nix store is generally required
        builtins.storeDir
        # For TLS
        "${config.security.pki.caBundle}:/etc/ssl/certs/ca-certificates.crt"
        # For DNS, failably attempts to mount the file
        "-/etc/resolve.conf"
      ]
      # For if the user uses systemd-resolved instead
      ++ lib.optionals config.services.resolved.enable [
        "/run/systemd/resolve/stub-resolv.conf"
        "/run/systemd/resolve/resolv.conf"  
      ];

      # Disallows the service from setting suid/sgid bits on paths
      # Should be disabled for services with shared directories as users
      # may user sgid.
      # 
      # Can usually be enabled.
      RestrictSUIDSGID = true;
      
      # Should usually be empty, but limits privileges that the process
      # can obtain. Does not actually grant any of these priviledges.
      # Use "AmbientCapabilities" to grant capabilities
      #
      # Almost always can be set to ""
      CapabilityBoundingSet = "";

      # Restrict the types of networking that the service can use
      # 
      # Can almost always be set, or set to an empty string if no network access is required.
      RestrictAddresFamilies = [
        "AF_UNIX" # Unix sockets
        "AF_INET" # ipv4
        "AF_INET6" # ipv6
      ];

      # Disallows the service to bind to any sockets (unix, tcp, udp)
      # exact those whitelisted below
      # 
      # Can almost always be set since most serices have explicitly defined ports they bind to
      SocketBindDeny = "any";

      # Whitelist specific ports to allow
      # Can be "tcp:${port}", "udp:${port}", "ipv4:tcp:${port}"
      # and can be listed multiple times
      #
      # Can almost always be used as most services have specific ports they bind to
      SocketBindAllow = "${toString cfg.port}"

      # When a syscall is denied, return EPERM rather than crash the process.
      # This is usually easier to debug than the default behavior, which is
      # immediatly killing the process
      #
      # Recommended for easier debugging.
      SystemCallErrorNumber = "EPERM";

      # List of syscalls to allow
      # @system-service is a list (designated by '@') of common syscalls required.
      # Note that @system-service does not include chmod, this list can be
      # viewed with `systemd-analyze syscall-filter @system-service`
      #
      # Specific syscalls can also be denied with "~syscall"
      # 
      # Should almost always be set.
      SystemCallFilter = [
        "@system-service"
      ];

      # umask to run the service with
      # this effects the default permissions a file is created with
      #
      # 0007 creates files that the owner can r/w but no one else can read
      # 
      # Should often be set. Depends on service shared file usage.
      UMask = "0007";

      # Should almost always be used.
      # Only use a different value if running a binary for a different CPU
      # architecture, for example x86 on x64
      # 
      # Can almost always be set.
      SystemCallArchitectures = "native";

      # Make /proc unreadable by the service
      # 
      # Can almost always be set.
      ProtectProc = "invisible";

      # Service cannot change its kernel execution domain.
      # 
      # Almost always true.
      LockPersonality = true;

      # Service and its children cannot obtain new privledges via suid, sgid, clone, or execve
      # 
      # Should almost always be enabled.
      NoNewPrivileges = true;

      # Run within a fs namespace.
      # Implied by other options, but good to make explicit.
      #
      # Should almost always be true.
      PrivateMounts = true;

      # Makes /dev mostly empty except for /dev/null and other pseudo devices.
      # Makes /dev read-only. Note that is disables all /dev access, so
      # for services that need devices, see the below attribute.
      #
      # Should usually be enabled, unless the service need hardware acceleration
      PrivateDevices = true;

      # Specific devices to allow under /dev
      # Note that if set, `PrivateDevices` must be false.
      # Usually needed for services that use GPU, hwaccel, or the system clocks
      # 
      # Usually not needed, and "PrivateDevices" should be used. 
      DeviceAllow = [
        "/dev/dri/renderD128 rw"
      ];

      # Closes access to /dev except for devices allowed via DeviceAllow
      # and the pseudo devices (/dev/null and others)
      # 
      # Should always be combined with DeviceAllow
      DevicePolicy = "closed";

      # Make an IPC namespace for systemV IPC and posix queues
      # Doesn't effect unix sockets.
      # 
      # Can almost always be enabled.
      PrivateIPC = true;

      # Create a PID namespace. The service is PID 1 in the new namespace.
      # All other processes are not visible.
      #
      # Should almost always be enabled.
      PrivatePIDs = true;

      # Creates a private /tmp for the service
      # Should almost always be enabled
      PrivateTmp = true;

      # Creates a user/group namespace
      # Maps the root user and the service user into the namespace
      # If more are needed, see systemd.exec(5)
      # 
      # Should almost always be enabled.
      PrivateUsers = true;

      # Disallows writes to the system clock
      # Redudant with the /dev protection
      # 
      # Should almost always be enabled.
      ProtectClock = true;

      # Make /home empty and inaccessible
      # Redundant with the RootDirectory, but good to make explicit
      # 
      # Should almost always be enabled. Bind mount directories if required.
      ProtectHome = true;

      # Denies access to kernel log buffer
      # 
      # Should almost always be enabled
      ProtectKernelLogs = true;

      # Disallows loading and unloading kernel modules
      # 
      # Should almost always be enabled
      ProtectKernelModules = true;

      # Create hostname namespace to protect the system hostname from being modified
      # Can be set to true, or a hostname can be specified with "yes:example.com"
      # 
      # Should almost always be enabled
      ProtectHostname = true;

      # Makes kernel variables under /proc inaccessible
      # These variables are usually only chanegd at boot, and should not be modified at runtime.
      # 
      # Should almost always be enabled
      ProtectKernelTunables = true;

      # Protects the cgroup fs under /sys/fs/cgroup
      # Make the cgroup fs read-only and a private mount
      # Set to "private" if it must be writeable
      # Set to "true" if it should be read-only and able to view the system's full cgroup heirachy
      # 
      # Should almost always be enabled.
      ProtectControlGroup = "strict";

      # All systemv and posix IPC objects are cleaned-up when the service is stopped
      # 
      # Should almost always be enabled
      RemoveIPC = true;

      # Disables requests for realtime scheduling
      # Protects against potential DOS attacks
      #
      # Should almost always be enabled.
      RestrictRealtime = true;

      # Disables the ability to create namespaces
      # 
      # Should almost always be enabled
      RestrictNamespaces = true;
      
      # Disables memory being able to be writable and executable.
      # The only time this should be disabled is with a JIT runtime like
      # .NET, the JVM, and others.
      # There are also some C programs that use trampolines that require this
      # disabled as well.
      #
      # Should usually be enabled.
      MemoryDenyWriteExecute = true;
    };
  };
}
```

## Hardening examples

</translate> <translate> This list contains proposed hardening options that are not yet upstreamed. Please use with caution, and please notify the author of the change if something breaks: </translate> <translate>

- Navidrome: <https://github.com/NixOS/nixpkgs/blob/445d861c6d31b4af0c79d8d4be2331f762a361d7/nixos/modules/services/audio/navidrome.nix#L167-L225>
- Chrony: <https://github.com/NixOS/nixpkgs/pull/104944/files>
- Isso: <https://github.com/NixOS/nixpkgs/pull/140840/files>
- Mautrix-based bridge: <https://github.com/mautrix/docs/pull/18/files>
- Postfix: <https://github.com/NixOS/nixpkgs/pull/93305/files>
- TheLounge: <https://github.com/thelounge/thelounge-deb/pull/78>

</translate> <translate>

## Related links

</translate> <translate>

- SHH, systemd hardening helper, note this tool is not exhaustive and is just a good first-step: [systemd hardening made easy with SHH](https://www.synacktiv.com/en/publications/systemd-hardening-made-easy-with-shh)

</translate>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
