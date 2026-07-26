<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rclone -->

[Rclone](https://rclone.org) is a command-line program that synchronizes files and directories between different cloud storage services, including Google Drive, Amazon S3, Microsoft OneDrive, Dropbox, and more. With its flexible configuration options and robust feature set, Rclone provides a powerful tool for managing and accessing data stored in the cloud.

## Configuration

Mounting remote filesystem, in this example via SFTP. The remote profile is called `myremote`, and authentication is done with user `myuser` and key file `/root/.ssh/id_rsa` against `192.0.2.2`. The remote directory `/my_data` is then mounted to the local directory `/mnt`.

``` nix
environment.systemPackages = [ pkgs.rclone ];
environment.etc."rclone-mnt.conf".text = ''
  [myremote]
  type = sftp
  host = 192.0.2.2
  user = myuser
  key_file = /root/.ssh/id_rsa
'';

fileSystems."/mnt" = {
  device = "myremote:/my_data";
  fsType = "rclone";
  options = [
    "nodev"
    "nofail"
    "allow_other"
    "args2env"
    "config=/etc/rclone-mnt.conf"
  ];
};
```

This can be also done with <a href="SSHFS" class="wikilink" title="SSHFS">SSHFS</a> while Rclone seems to be more robust for unstable connections.

## Configuration with Home-Manager

Home-manager users may wish to make a user-centric configuration of rclone. To do so add `pkgs.rclone` to your `~/.config/home-manager/home.nix` file. You can also configure remotes with home-manager. Here is an example below.

``` nix
home.packages = [ pkgs.rclone ];
xdg.configFile."rclone/rclone.conf".text = ''
  [fichier]
  type = fichier
  user = foo@bar.com
  pass = password
'';
```

Particular concern should be made when uploading such configurations online as your passwords will be plainly visible. It is recommended to instead put the passwords in a local file if such is needed. Keep in mind that if you do output to .config/rclone/rclone.conf, every time you switch your home-manager configuration it will be overwritten. It would be wiser to instead output to a separate file, especially if using systemd services as in the example below.

``` nix
xdg.configFile."rclone/example.conf".text = ''
  [fichier]
  type = fichier
  user = foo@bar.com
  pass = p4ssw0rd
'';
};

systemd.user.services.example-mounts = {
  Unit = {
    Description = "Example programmatic mount configuration with nix and home-manager.";
    After = [ "network-online.target" ];
  };
  Service = {
    Type = "notify";
    ExecStartPre = "${pkgs.coreutils}/bin/mkdir -p %h/Example Sync Dir";
    ExecStart = "${pkgs.rclone}/bin/rclone --config=%h/.config/rclone/example.conf --vfs-cache-mode writes --ignore-checksum mount \"fichier:\" \"%h/Example Sync Dir\"";
    ExecStop="/run/wrappers/bin/fusermount -u %h/Example Sync Dir/%i";
  };
  Install.WantedBy = [ "default.target" ];
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Backup" class="wikilink" title="Category:Backup">Category:Backup</a>
