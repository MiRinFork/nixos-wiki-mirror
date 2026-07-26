<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rsync -->

[rsync](https://rsync.samba.org/) is a utility for efficiently transferring and synchronizing files between a computer and an external hard drive and across networked computers by comparing the modification times and sizes of files.

## Running a server

Running rsync via <a href="SSH" class="wikilink" title="SSH">SSH</a> is recommended for security reasons.

You can restrict an SSH user to rsync command using :

``` nix

users.users.backup = {
  isNormalUser = true;
  openssh.authorizedKeys.keys = [
    ''command="${pkgs.rrsync}/bin/rrsync /home/backup/dir/",restrict ssh-ed25519 AAAAC3NzaCetcetera/etceteraJZMfk3QPfQ''
  ];
};
```

Now you should be able to backup to your directory with the rsync client:

``` console
$ rsync -Pav -e "ssh -i $HOME/.ssh/somekeys" photos backup@server:
```

See [rrsync.1](https://download.samba.org/pub/rsync/rrsync.1) for additional options, such as enforcing read-only or write-only access.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Backup" class="wikilink" title="Category:Backup">Category:Backup</a>
