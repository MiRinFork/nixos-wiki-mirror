<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SSHFS -->

[SSHFS](https://github.com/libfuse/sshfs) is a <a href="Filesystems" class="wikilink" title="file system">file system</a> that allows users to mount and access remote files over <a href="SSH" class="wikilink" title="SSH">SSH</a> (Secure Shell) connections, providing secure and encrypted access to remote data.

For more information on using SSHFS on NixOS, refer to .

You may want to connect to the machine 'interactively' once before configuring the connection declaratively, to add the remote key to your 'known hosts'.

## Configuration

Following example configuration will mount the remote filesystem `/mydata` of the host `10.0.1.100` at the destination `/mnt`. Authentication is done via the user `myuser` and the private key `/root/.ssh/id_ed25519`.

``` nix
fileSystems."/mnt" = {
  device = "myuser@10.0.1.100:/mydata";
  fsType = "sshfs";
  options = [
    "nodev"
    "noatime"
    "allow_other"
    "IdentityFile=/root/.ssh/id_ed25519"
  ];
};
```

## See also

- <a href="Rclone" class="wikilink" title="Rclone">Rclone</a>, which also supports mounting via SFTP. Possibly a more robust and stable implementation.

<a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
