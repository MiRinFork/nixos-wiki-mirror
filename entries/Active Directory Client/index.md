<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Active Directory Client -->

Active Directory (AD) is a directory service that enables you to provide login to computers and other useful purposes.

## Basic Setup

1\) Create /etc/nixos/nixos-ad.nix and add the following. Replace your_domain_lowercase and YOUR_DOMAIN_UPPERCASE with something like ad.foobar.com and AD.FOOBAR.COM.

``` nix
#
# nixos-ad.nix -- Active Directory Client
#
# Join AD: sudo adcli join --domain=your.domain.com --user=administrator
#
{
  config,
  pkgs,
  ...
}: {
  #
  # Packages
  #
  environment.systemPackages = with pkgs; [
    adcli # Helper library and tools for Active Directory client operations
    oddjob # Odd Job Daemon
    samba4Full # Standard Windows interoperability suite of programs for Linux and Unix
    sssd # System Security Services Daemon
    krb5 # MIT Kerberos 5
    realmd # DBus service for configuring Kerberos and other
  ];

  #
  # Security
  #
  security = {
    krb5 = {
      enable = true;
      settings = {
        libdefaults = {
          udp_preference_limit = 0;
          default_realm = "YOUR_DOMAIN_UPPERCASE";
        };
      };
    };

    pam = {
      makeHomeDir.umask = "077";
      services.login.makeHomeDir = true;
      services.sshd.makeHomeDir = true;
    };

    sudo = {
      extraConfig = ''
        %domain\ admins ALL=(ALL:ALL) NOPASSWD: ALL
        Defaults:%domain\ admins env_keep+=TERMINFO_DIRS
        Defaults:%domain\ admins env_keep+=TERMINFO
      '';

      # Use extraConfig because of blank space in 'domain admins'.
      # Alternatively, you can use the GID.
      # extraRules = [
      #   { groups = [ "domain admins" ];
      #     commands = [ { command = "ALL"; options = [ "NOPASSWD" ]; }  ]; }
      # ];
    };
  };

  #
  # Services
  #
  services = {
    nscd = {
      enable = true;
      config = ''
        server-user nscd
        enable-cache hosts yes
        positive-time-to-live hosts 0
        negative-time-to-live hosts 0
        shared hosts yes
        enable-cache passwd no
        enable-cache group no
        enable-cache netgroup no
        enable-cache services no
      '';
    };

    sssd = {
      enable = true;
      config = ''
        [sssd]
        domains = your_domain_lowercase
        config_file_version = 2
        services = nss, pam

        [domain/your_domain_lowercase]
        override_shell = /run/current-system/sw/bin/zsh
        krb5_store_password_if_offline = True
        cache_credentials = True
        krb5_realm = YOUR_DOMAIN_UPPERCASE
        realmd_tags = manages-system joined-with-samba
        id_provider = ad
        fallback_homedir = /home/%u
        ad_domain = your_domain_lowercase
        use_fully_qualified_names = false
        ldap_id_mapping = false
        auth_provider = ad
        access_provider = ad
        chpass_provider = ad
        ad_gpo_access_control = permissive
        enumerate = true
      '';
    };
  };

  #
  # Systemd
  #
  systemd = {
    services.realmd = {
      description = "Realm Discovery Service";
      wantedBy = ["multi-user.target"];
      after = ["network.target"];
      serviceConfig = {
        Type = "dbus";
        BusName = "org.freedesktop.realmd";
        ExecStart = "${pkgs.realmd}/libexec/realmd";
        User = "root";
      };
    };
  };
}
```

2\) Update your configuration.nix to import ./nixos-ad.nix

``` nix
imports =
  [
    ./hardware-configuration.nix
    ./nixos-ad.nix
  ]
```

3\) `nix-channel --update ; nixos-switch rebuild --upgrade`

**Note**

- These commands presume that you're using the classic NixOS channels and not the experimental flakes configuration.
- These commands will freshen all installed packages and configuration settings.
- If you experience an error from systemd/sssd, disregard it. You will fix that error by joining the domain.

4\) Join your domain

`sudo adcli join --domain=your.domain.com --user=administrator`

5\) Restart SSSD

`sudo systemctl restart sssd`

6\) Confirm that you have successfully joined your AD

`realm discover your_domain_lowercase`

`id user_in_AD`

7\) Optional: You may reboot to ensure that your machine sustains its domain binding and that end users can login. As of 2024, the adcli join and sssd restart seem to be sufficient.

8\) Optional: If the computer is a laptop, you may add a named user to the NixOS local networkmanager group so that person can add a WiFI network, switch between wireless/wired, and so on.

``` nix
users.groups.networkmanager.members = ["user_in_AD"];
```

Unfortunately, Linux local groups do not support nesting of AD groups. You have to grant this access to individual users.

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
