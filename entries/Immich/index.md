<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Immich -->

[Immich](https://immich.app) is a self-hosted photo and video management solution.

## Installation

To install Immich, add the following to your NixOS configuration:

To access Immich from other devices via network, add the following as well:

To change Immich’s default log verbosity, you can set the [`IMMICH_LOG_LEVEL`](https://docs.immich.app/install/environment-variables#general) environment variable: More options are available:

## Tips and Tricks

### Reducing Log Verbosity Of Redis

As noted in the [Immich FAQ](https://docs.immich.app/FAQ/#how-can-i-reduce-the-log-verbosity-of-redis), you can reduce Redis log verbosity by setting the log level to warning. In NixOS this is done with the [log Level option](https://search.nixos.org/options?show=services.redis.servers.%3Cname%3E.logLevel) of the Redis server that Immich uses:

### Custom Media Location

While the official Immich documentation recommends modifying `UPLOAD_LOCATION` environmental variable for Docker build, NixOS does not support modifying it. Instead, may be used, which simply sets \[<https://docs.immich.app/install/environment-variables/>　`IMMICH_MEDIA_LOCATION`\] variable, while this is not recommended in the official documentation:

### Enabling Hardware Accelerated Video Transcoding

Add the Immich user to the `render` and `video` groups, override the `PrivateDevices` service config setting to allow the service to access `/dev/dri/` and enable <a href="Accelerated_Video_Playback" class="wikilink" title="Accelerated Video Playback">Accelerated Video Playback</a> on your system:

### Using Immich behind Nginx

This is a typical <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> configuration for Immich:

### Using borg for backups

Following Immichs [backup docs](https://immich.app/docs/administration/backup-and-restore/) and [backup script](https://immich.app/docs/guides/template-backup-script) an automated backup using <a href="Borg_backup" class="wikilink" title="Borg backup">Borg backup</a> could look something like this: Make sure to manually create a borg repo at the desired location beforehand with `sudo borg init --encryption=none `<path-to-borg-repo>

## Troubleshooting

### Fixing PostgreSQL database issue after 25.05 upgrade

#### PostgreSQL collation version mismatch

After upgrading you might run into an issue like this, leading to immich-server continuously failing and restarting:

    Jul 01 14:23:12 server2 immich[178592]: Postgres notice: {
    Jul 01 14:23:12 server2 immich[178592]:   severity_local: 'WARNING',
    Jul 01 14:23:12 server2 immich[178592]:   severity: 'WARNING',
    Jul 01 14:23:12 server2 immich[178592]:   code: '01000',
    Jul 01 14:23:12 server2 immich[178592]:   message: 'database "immich" has a collation version mismatch',
    Jul 01 14:23:12 server2 immich[178592]:   detail: 'The database was created using collation version 2.39, but the operating system provides version 2.40.',
    Jul 01 14:23:12 server2 immich[178592]:   hint: 'Rebuild all objects in this database that use the default collation and run ALTER DATABASE immich REFRESH COLLATION VERSION,>
    Jul 01 14:23:12 server2 immich[178592]:   file: 'postinit.c',
    Jul 01 14:23:12 server2 immich[178592]:   line: '477',
    Jul 01 14:23:12 server2 immich[178592]:   routine: 'CheckMyDatabase'
    Jul 01 14:23:12 server2 immich[178592]: }

To fix this, run `sudo -u immich psql -d immich` and execute these two commands:

``` sql
ALTER DATABASE immich REFRESH COLLATION VERSION;
REINDEX DATABASE immich;
```

### Immich server too old on NixOS stable

If you encounter errors like `Error processing stream` or `Error in runInIsolateGentle for remote-sync` on Android/iOS clients, the cause may be that the Immich server version packaged in `nixos-stable` is behind the mobile apps.

You can use the Immich package from `nixos-unstable` while keeping the rest of your system on stable. Add the following to the top of your `/etc/nixos/configuration.nix`:

``` nix
let
  unstableTarball = fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz";
in {
  nixpkgs.config = {
    packageOverrides = pkgs: {
      unstable = import unstableTarball {
        config = config.nixpkgs.config;
      };
    };
  };
}
```

Then override the Immich package in your service config:

``` nix
services.immich.package = pkgs.unstable.immich;
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
