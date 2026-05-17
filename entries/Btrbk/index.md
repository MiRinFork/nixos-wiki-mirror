<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Btrbk -->

[Btrbk](https://digint.ch/btrbk/), a tool for creating snapshots and remote backups of <a href="btrfs" class="wikilink" title="btrfs">btrfs</a> subvolumes.

## Setup

When transferring backups of root filesystem snapshots using Btrbk, it is recommended to mount the root Btrfs drive with subvolume id 5 (in this example `/dev/sda1`) to a specific mountpoint where Btrbk can operate with. So in this case all subvolumes will be available as a subdirectory in `/btr_pool`.

## Configuration

### Basic example

Following example configuration will create a weekly incremental backup of a local Btrfs subvolume called `nixos` and sends it compressed to the remote host `myhost`. The mount point `/btr_pool`, as referenced above, contains the subvolume.

The user `btrbk` together with the private key `/etc/btrbk_key` is used for authentication.

For the remote host, configure SSH access for Btrbk:

### Local `/home` Snapshots

If `/home` is its own subvolume and important files are backed up separately or combined with the above section, this configuration takes snapshots hourly, retains them for at least a week, and keeps weekly snapshots for two weeks under `/snapshots`.

### Retention policy

The following example takes daily snapshot but won't store them forever with the given retention policy:

- **7d**: For the most recent week, you will have a **daily snapshot** stored from each day.
- **4w**: After a week, you'll only keep one snapshot per week for the next 4 weeks (so older daily snapshots get removed).
- **12m**: After a month, the policy will keep only **monthly snapshots** for the next 12 months.

The option `snapshot_preserve_min`ensures that all daily snapshots from the last 7 days are preserved, regardless of the other retention rules. It's a safety net to guarantee that no daily snapshot from the past week is deleted prematurely.

``` nix
services.btrbk.instances."remote_myhost" = {
  onCalendar = "daily";
  settings = {
      snapshot_preserve = "7d 4w 12m";
      snapshot_preserve_min = "7d";
      target_preserve = "7d 4w 12m";
  };
};
```

This retention policy will ensure you have a balance between recent, frequent backups (daily) and older, more spaced-out backups (weekly/monthly) while preserving space.

## Manual usage

Manually dry running and testing a btrbk configuration

``` bash
btrbk -c /etc/btrbk/remote_myhost.conf --dry-run --progress --verbose run
```

The filename `remote_myhost.conf` references the instance name choosen in the example configuration above.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Backup" class="wikilink" title="Category:Backup">Category:Backup</a>
