<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Scaleway X86 Virtual Cloud Server -->

## nixos-bite

As of July 2026, using [nixos-bite](https://codeberg.org/whitequark/nixos-bite) just works. Even on a STARDUST with ipv6 only.

Add this to your `cloud-init.yaml`:

``` yaml
#cloud-config
runcmd:
- 'sleep 30s' # wait for network
- 'curl https://codeberg.org/whitequark/nixos-bite/raw/branch/main/nixos-bite.sh | bash -s reboot' 
# For Ipv6 only
# - 'curl https://codeberg.org/whitequark/nixos-bite/raw/branch/main/nixos-bite.sh | NIX_DNS=2a00:1098:2c::1 bash -s reboot' 
```

It will maintain the SSH key provided to Scaleway, so you can just `nixos-rebuild switch` to the instance.

## nixos-anywhere

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
