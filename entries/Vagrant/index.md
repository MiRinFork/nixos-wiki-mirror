<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vagrant -->

## NixOS as Host

### Using NFS mounts

Add to your `Vagrantfile`:

``` Ruby
  # Mount a folder inside the VM.
  config.vm.synced_folder "myfolder/", "/mnt/myfolder", type: "nfs", nfs_version: 4
```

Add to your `configuration.nix`:

``` nix
{
  # Minimal configuration for NFS support with Vagrant.
  services.nfs.server.enable = true;
  
  # Add firewall exception for VirtualBox provider 
  networking.firewall.extraCommands = ''
    ip46tables -I INPUT 1 -i vboxnet+ -p tcp -m tcp --dport 2049 -j ACCEPT
  '';

  # Add firewall exception for libvirt provider when using NFSv4 
  networking.firewall.interfaces."virbr1" = {                                   
    allowedTCPPorts = [ 2049 ];                                               
    allowedUDPPorts = [ 2049 ];                                               
  };     
}
```

This should make NFS mounts work.

## Plugins

### NixOS Plugin

See <a href="Vagrant_Box#NixOS_Plugin" class="wikilink" title="the NixOS vagrant box page">the NixOS vagrant box page</a>, which as information about the `vagrant-nixos-plugin` project.

## Troubleshooting: conflicting dependencies bundler when installing vagrant plugins

As of 18.03 vagrant plugins are broken:

``` console
$  vagrant plugin update
Updating installed plugins...
Bundler, the underlying system Vagrant uses to install plugins,
reported an error. The error is shown below. These errors are usually
caused by misconfigured plugin installations or transient network
issues. The error from Bundler is:
conflicting dependencies bundler (= 1.14.6) and bundler (= 1.16.1)
  Activated bundler-1.16.1
  which does not match conflicting dependency (= 1.14.6)
  Conflicting dependency chains:
    bundler (= 1.16.1), 1.16.1 activated
  versus:
    bundler (= 1.14.6)
  Gems matching bundler (= 1.14.6):
    bundler-1.14.6
```

using the following nix expression fixes the problems:

``` nix
(import <nixpkgs> {
    overlays = [
      (self: super: {
        bundler = super.bundler.overrideAttrs (old: {
          name = "bundler-1.16.1";
          src = super.fetchurl {
            url = "https://rubygems.org/gems/bundler-1.16.1.gem";
            sha256 = "1s2nq4qnffxg3kwrk7cnwxcvfihlhxm9absl2l6d3qckf3sy1f22";
          };
        });
      })
    ];
  }).vagrant
```

More information in this [issue](https://github.com/NixOS/nixpkgs/issues/36880)

## Troubleshooting: VM failing to receive IP address

If you run `vagrant up` and your VM is stalling with the message `Waiting for domain to get an IP address`, your networking firewall may be blocking vagrants DHCP requests. You can allow the requests with the following changes to your configuration.nix file:

``` nix
# Trust libvirt bridge interfaces for VM networking (required for Vagrant DHCP)
networking.firewall.trustedInterfaces = [ "virbr0" "virbr1" "virbr2" ];
# Don't let NetworkManager manage libvirt bridges (prevents conflicts)
networking.networkmanager.unmanaged = [ "virbr0" "virbr1" "virbr2" ];
```
