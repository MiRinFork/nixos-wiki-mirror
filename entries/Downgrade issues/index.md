<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Downgrade issues -->

NixOS und Nix support downgrade of packages and their configuration. That works without issues with most programs, but some complain when their **state** (config. not managed by NixOS, some kind of database, ...) was created with a newer version. This page exist to collect those cases.

## 1Password

The 1Password app will refuse to open if the data was written using a newer version.

> Your saved data appears to be newer than this version of 1Password can use.

The easiest way to solve this is to delete and sync all data again. Make sure you are logged in to 1Password on another device or that you have access to the account email, password, and secret key. Delete the local data `rm -rf .config/1Password` and start the app again. It will prompt you to log in again. Settings will have reverted to the defaults.

## Atom

Forgets open files, unsaved text is lost.

## Davinci Resolve

The project database at

    /home/<user>/.local/share/DaVinciResolve/Resolve Disk Database

only works with one major version. It is upgraded after a software update (manually) and can't get downgraded.

When starting a downgraded software version, you get the error:

    database is incompatible

## Electrum

Can't open wallet created with newer version.

    This version of Electrum is too old to open this wallet.
    (highest supported storage version: 40, version of this file: 41)

## Signal

Start fails with error message. Offers to "delete data and close". Then start and link again to mobile device.

    Database startup error:

    Error: Error: SQL: User version is 54 but the expected maximum version is 43. Did you try to start an old version of Signal?
    ...

## Syncthing

Refuses to start when downgraded.

    [root@nixos:~]# journalctl -u syncthing.service
    ...
    WARNING: Failed to initialize config: config file version (36) is newer than supported version (35). If this is expected, use -allow-newer-config to override

syncthing will however store a copy of its configuration when upgrading next to `config.xml`, so you might be able to shut down syncthing, take a backup up the new file and then copy the old file into place.

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
