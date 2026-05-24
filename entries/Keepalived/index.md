<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Keepalived -->

Keepalived provides Virtual Router Redundancy Protocol (VRRP) and automatic virtual IP addresses for Linux. It is utilized to create high availability services. It can also be used for service discovery when working with something like Docker Swarm.

## Basic Setup Example

This example configuration works well with NixOS 25.05. Use it as a starting point and tailor it for your needs.

The author migrated a known good keepalived.conf from another Linux distribution and adopted NixOS options where feasible. The configuration is imported in the primary /etc/nixos/configuration.nix.

``` nix

imports =
  [
    ./hardware-configuration.nix
    ./keepalived.nix
  ]
```

Lessons Learned

- Declare Keepalived configuration and its tracking scripts in the same NixOS configuration file. **This lets your scripts be in scope and usable**.
- Use NixOS options for script tracking. Use Keepalived native configuration for process tracking. (The author did not work with file tracking.)

``` nix
#
# keepalived.nix
#
# Notes
#
# - Use NixOS options for script tracking. Use extraConfig for 
#   process tracking.
# - Don't use pipes in Keepalived script configuration line:
#   https://github.com/acassen/keepalived/issues/1107
#   https://github.com/acassen/keepalived/issues/2381
# - The MASTER node will enable the Virtual IP (VIP) regardless of the 
#   tracked process state, unless a BACKUP has a higher priority.
#
# References
#
# - https://www.redhat.com/en/blog/ha-cluster-linux
# - https://www.redhat.com/en/blog/advanced-keepalived
# - https://keepalived.org/manpage.html
# - https://search.nixos.org/options?query=services.keepalived
# - use_symlink_paths -- https://github.com/acassen/keepalived/issues/2393
#
{
  config,
  pkgs,
  lib,
  ...
}: let
  docker-ps = pkgs.writeShellScriptBin "docker-ps" ''

    ctnr="$1"

    ${pkgs.docker}/bin/docker ps --filter "status=running" | \
    ${pkgs.gnugrep}/bin/grep -i "$ctnr" > /dev/null

    if [ $? -eq 0 ]; then
      exit 0  # Process is running
    else 
      exit 1  # Process is not running
    fi
  '';
in {
  environment.systemPackages = [docker-ps];

  system.activationScripts = {
    print-keepalived = {
      text = builtins.trace "building the keepalived configuration..." "";
    };
  };

  #
  # Keepalived
  #
  services.keepalived = {
    enable = true;

    openFirewall = true;

    extraGlobalDefs = ''
      use_symlink_paths true
    '';

    vrrpInstances.VIP_32 = {
      state = "BACKUP";
      interface = "eth0";
      virtualRouterId = 32;
      priority = 44;
      virtualIps = [{addr = "172.16.1.32/24";}];
      trackScripts = ["track_homepage"];
    };

    vrrpScripts = {
      track_homepage = {
        # Note: Shell pipes are not supported here. Call a self written 
        # script or something like that instead.
        script = "${docker-ps}/bin/docker-ps homepage";
        interval = 10;
        timeout = 2;
        rise = 2;
        fall = 2;
        weight = 10;
        user = "root";
      };
    };

    extraConfig = ''
      #
      # Track by Process
      #
      vrrp_track_process track_portainer {
        process portainer
        weight 10
      }

      vrrp_track_process track_smokeping {
        process smokeping
        weight 10
      }

      #
      # Order this section by IP
      #
      vrrp_instance VIP_41 {
        state BACKUP
        interface eth0
        virtual_router_id 41
        priority 44
        advert_int 5
        virtual_ipaddress {
          172.16.1.41/24
        }
        track_process {
          track_smokeping
        }
      }

      vrrp_instance VIP_42 {
        state BACKUP
        interface eth0
        virtual_router_id 42
        priority 44
        advert_int 5
        virtual_ipaddress {
          172.16.1.42/24
        }
        track_process {
          track_portainer
        }
      }
    '';
  };
}
```

## Future enhancements for the keepalived module

The current NixOS keepalived module has several limitations that could be improved:

1\. \*\*SNMP Support\*\*: The module needs to support all SNMP options:

``   - `enableRfc`, `enableRfcV2`, `enableRfcV3` options are missing ``  
`  - Current module only supports basic VRRP-specific SNMP`  
`  - Should support all SNMP directives available in keepalived`

2\. \*\*VRRP-Only Mode\*\*: Add option to run keepalived in VRRP-only mode:

``   - Add `services.keepalived.vrrpOnly = true` option ``  
``   - Automatically add `--vrrp` flag to systemd ExecStart when enabled ``  
`  - Useful for systems that only need VRRP (not LVS)`

3\. \*\*Automatic NixOS Compatibility\*\*: Module should automatically enforce NixOS compatibility:

``   - Always add `use_symlink_paths true` to global configuration ``  
`  - Make this non-optional since it's required for NixOS`  
`  - Add validation to ensure this directive is present`

4\. \*\*Enhanced Script Support\*\*: Improve script configuration options:

`  - Better timeout validation (ensure timeout < interval)`

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix_Language" class="wikilink" title="Category:Nix Language">Category:Nix Language</a>
