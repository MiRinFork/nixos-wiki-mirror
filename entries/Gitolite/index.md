<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gitolite -->

[**Gitolite**](https://gitolite.com/) allows you to host <a href="Git" class="wikilink" title="Git">Git</a> repositories with fine-grained access control.

## Installation

Obtain the SSH public key of the user you will use to configure gitolite, then add the following to your NixOS config:

``` nix
services.gitolite = {
  enable = true;
  adminPubkey = "<ssh public key>";
};
```

When you rebuild, a new unit should start:

``` bash
the following new units were started: gitolite-init.service
```

You can now check out the `gitolite-admin` repo using the `gitolite` user. Gitolite's configuration is located in `conf/gitolite.conf` and you can give users access by adding their public keys to `keydir`.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Version_control" class="wikilink" title="Category:Version control">Category:Version control</a>
