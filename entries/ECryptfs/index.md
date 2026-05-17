<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ECryptfs -->

[eCryptfs](http://ecryptfs.org/) is a cryptographic filesystem encrypting each file individually. To install `ecryptfs` add the following to `environment.systemPackages`:

``` nix
{ pkgs, ... }: {
  environment.systemPackages = with pkgs; [
    ecryptfs
  ];
}
```

`man ecryptfs-migrate-home` describes how to encrypt your home folder. The TL;DR is that you need to: log out, log in as root, `modprobe ecryptfs` if needed, kill all processes that still access the home folder you want to migrate (check with `lsof /home/YOURUSERNAME`), wait for it to finish, then run `ecryptfs-migrate-home -u YOURUSERNAME`, then log in as your migrated user before rebooting.

To automatically mount your private folder on login with `PAM`, add this to your `config`:

``` nix
{
  security.pam.enableEcryptfs = true;
}
```

Don't forget to also load the `ecryptfs` kernel module on boot as well in this case:

``` nix
{
  boot.kernelModules = ["ecryptfs"];
}
```
