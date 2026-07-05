<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Signing store paths -->

## Setup

This is based on the section of the <a href="Nix_(package_manager)" class="wikilink" title="Nix">Nix</a> manual.

### Signing Key

You need a signing key to sign <a href="Nix_store" class="wikilink" title="store">store</a> paths. The key name (`cache.example.org-1` for example) can be anything, but it's suggested to use the <a href="Wikipedia:Hostname" class="wikilink" title="hostname">hostname</a> of your cache/store (e.g. `cache.example.org` or `raspberrypi`) with a suffix denoting the number of the key (to be incremented every time you need to revoke a key).[^1] You can create a signing key using the or the commands.

``` shell-session
# mkdir -pv /var/secrets
# cd /var/secrets

Using the old CLI:
# nix-store --generate-binary-cache-key cache.example.org-1 nix-cache-priv-key nix-cache-pub-key

Using the new nix CLI:
# nix key generate-secret --key-name cache.example.org-1 > nix-cache-priv-key
# chmod 0600 nix-cache-priv-key # make the private key inaccessible to other users
# nix key convert-secret-to-public < nix-cache-priv-key > nix-cache-pub-key

The keys will look like this:
# cat nix-cache-priv-key
cache.example.org-1:MKk58wILGij4+VKU5xXESsU+MnslTUKfCjX/9OEXq6c6lhrq8lbOw9UpHeAC46rkpXf7/jJ0KmhnjIXcpVrT0Q==
# cat nix-cache-pub-key
cache.example.org-1:OpYa6vJWzsPVKR3gAuOq5KV3+/4ydCpoZ4yF3KVa09E=
```

### Auto-signing

To automatically sign store paths after building, you need to configure the Nix option with the path of the private key. Here is how you do it on NixOS: And here on non-NixOS:

### Signing already-built store paths

When you add a key to `secret-key-files`, Nix does not automatically sign store paths that have already been built. You must run the command to do that.

``` shell-session
# nix store sign --all --key-file /var/secrets/nix-cache-priv-key
```

### Trusting store paths using a signing key

On a machine that you want to trust the signed store's store paths, configure the Nix option with thepublic key from `/var/secrets/nix-cache-pub-key` on the machine with the signed store. Here is how you do it on NixOS: And here on non-NixOS:

## Usage

Now you can copy store paths without signatures from the NixOS binary cache to a remote! You can continue by setting up <a href="Distributed_build" class="wikilink" title="remote builders">remote builders</a> or a <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>, or simply using `nix copy`.

### `nix copy` example

``` shell-session
$ # Note that we're not a trusted user as that could allow copying without valid signatures
$ nix store --store ssh-ng://anothermachine.local info
Store URL: ssh-ng://anothermachine.local
Version: 2.34.7
Trusted: 0

$ # Yet we can copy store paths built on this machine
$ nix build --impure --expr "let pkgs = import <nixpkgs> { }; in pkgs.hello.overrideAttrs { pname = \"hello-$SECONDS\"; }"
$ # Note how cache.nixos.org-1 isn't mentioned here:
$ nix path-info ./result --sigs
/nix/store/... ultimate cache.example.org-1:AAAAAAAAA...==
$ nix copy ./result --to ssh-ng://anothermachine.local
```

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a>

[^1]: <https://nix.dev/manual/nix/2.34/command-ref/new-cli/nix3-key-generate-secret.html>
