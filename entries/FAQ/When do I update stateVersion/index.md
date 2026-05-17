<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/When do I update stateVersion -->

<onlyinclude>

## Why am I told not to update[^1] `system.stateVersion`?

Since it is not clearly codified what should be used for, and it is used for a great many different things in practice[^2], <strong>there is no practical way to ensure that changing it is ever safe</strong>.

The consequences of changing its value range from none at all, to complete destruction of data written by specific software.

## How do I update NixOS, if changing `system.stateVersion` does not do that?

See <a href="Updating_NixOS#Changing_Nixpkgs_version" class="wikilink" title="Updating nixos">Updating nixos</a>.

## Why does `system.stateVersion` look like a NixOS version?

This is because it notes down the version of NixOS you first installed with a given configuration. It does not mean that you should update it.

## When can I update `system.stateVersion` safely?

Currently, you cannot update it safely without a complete understanding of all NixOS modules you are using, directly or indirectly.

Only when the NixOS release notes say that it can be changed, should it be changed.

## Is it ok to leave `system.stateVersion` at a very old version?

The NixOS module authors are aware of their use of the setting, and must ensure that old versions continue to work. Whether and how this is sustainable is an upstream issue; Users should not update the setting unless instructed otherwise.

## What even is `system.stateVersion` for, if it is just an unchanging string?

Currently, this is undefined[^3], though the intent is to keep track of on-disk state versions that are not supposed to change with the configuration.

As a result, modules can effectively use `system.stateVersion` for anything, which makes the effects of changing it unpredictable.

Since it is sometimes used to protect data integrity upon package updates, changing the number can lead to irreversible data loss.

## References

</noinclude>

[^1]: <https://nixos.org/manual/nixos/stable/options#opt-system.stateVersion>

[^2]: <https://discourse.nixos.org/t/using-hashes-for-stateversion-instead-of-human-readable-strings/61823/30>

[^3]:
