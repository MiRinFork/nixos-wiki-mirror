<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Automatic system upgrades -->

Automatic system upgrades can be used to upgrade a system regularly at a specific time. This can help to reduce the time period of applying important security patches to your running software but might also introduce some breakage in case an automatic upgrade fails. For automatic upgrades an automatic <a href="Garbage_Collection" class="wikilink" title="garbage collection">garbage collection</a> is important to prevent full

``` bash
/boot
```

and

``` bash
/
```

partitions.

## Configuration

### Channel-based systems (default)

Most NixOS installations use channels by default. If you're unsure which you're using, check with

``` bash
nix-channel --list
```

. If that returns results, you're using channels.

For channel-based systems, use this configuration:

<strong>Important:</strong> Do not use flake-specific flags with channel-based systems, as they will cause the upgrade to fail silently.

### Flake-based systems

To enable unattended automatic system updates on a flake-enabled host, add following part to your configuration:

Previously this page advised to set the flags `--update-input nixpkgs` to trigger updating a specific input. However that flag will just be handed through to `nix build` where it was deprecated and removed. Follow [this Bug for details and resolutions](https://github.com/NixOS/nixpkgs/issues/349734).

## Monitoring

Check that automatic system upgrades run successfully. Force an automatic system upgrade by running

``` bash
# systemctl start nixos-upgrade
```

Check the upgrade log with

``` bash
# systemctl status nixos-upgrade.service
```

Or, to see the full log

``` bash
# journalctl -u nixos-upgrade.service
```

To see the status of the upgrade timer run

``` bash
# systemctl status nixos-upgrade.timer
```

## Troubleshooting

### Git "repository is not owned by current user"

The flake repository directory is not owned by

``` bash
root
```

(which

``` bash
nixos-upgrade
```

runs as). To fix this, add the following to

``` bash
/root/.gitconfig
```

  

### Git "fatal: unable to auto-detect email address"

The root user doesn't have specified the user and email in the git configuration. To fix this, you can extend the

``` bash
nixos-upgrade
```

service with:

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
