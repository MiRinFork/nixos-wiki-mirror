<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Samba -->

This guide will help you on how to use samba on nixos.

## Usershares

You can allow some users to share via samba a given directory simply via a right click in their file browser (tested with Dolphin). For that, first add this configuration (make sure to add your user in the samba group):

Then, logout and login (to make sure your group change has been taken into account), open Dolphin, right click on a folder you'd like to share, go to Properties, Tab "Share", and configure it the way you want.

## Server setup

Example setup for creating a public guest share called `public` and a private share called `private`.

The `samba-wsdd` service and avahi is used to advertise the shares to Windows hosts.

### User Authentication

For a user called `my_user`to be authenticated on the samba server, you can add a password using:

``` bash
sudo smbpasswd -a my_user
```

To automate creation of the samba user and the required system user, you can use [system.activationScripts](https://search.nixos.org/options?show=system.activationScripts):

``` nix
{
  # Make the samba user "my_user" on the system
  users.users.my_user = {
    description = "Write-access to samba media shares";
    # Add this user to a group with permission to access the expected files 
    extraGroups = [ "users" ];
    # Password can be set in clear text with a literal string or from a file.
    # Using sops-nix we can use the same file so that the system user and samba
    # user share the same credential (if desired).
    hashedPasswordFile = config.sops.secrets.samba.path;
    isNormalUser = true;
  };
  # Set "my_user" as a valid samba login
  services.samba = {
    enable = true;
    openFirewall = true;
    settings = {
      global = {
        # ...
        "security" = "user";
      };
      my_share_directory = {
        # ...
        "valid users" = "my_user";
      };
    };
  };
  # Activation scripts run every time nixos switches build profiles. So if you're
  # pulling the user/samba password from a file then it will be updated during
  # nixos-rebuild. Again, in this example we're using sops-nix with a "samba" entry
  # to avoid cleartext password, but this could be replaced with a static path.
  system.activationScripts = {
    # The "init_smbpasswd" script name is arbitrary, but a useful label for tracking
    # failed scripts in the build output. An absolute path to smbpasswd is necessary
    # as it is not in $PATH in the activation script's environment. The password
    # is repeated twice with newline characters as smbpasswd requires a password
    # confirmation even in non-interactive mode where input is piped in through stdin. 
    init_smbpasswd.text = ''
      /run/current-system/sw/bin/printf "$(/run/current-system/sw/bin/cat ${config.sops.secrets.samba.path})\n$(/run/current-system/sw/bin/cat ${config.sops.secrets.samba.path})\n" | /run/current-system/sw/bin/smbpasswd -sa my_user
    '';
  };

}
```

### Configuration

#### Apple Time Machine

In addition to the example above, add this to your configuration:

``` nix
services.samba = {
  settings = {
    "tm_share" = {
        "path" = "/mnt/Shares/tm_share";
        "valid users" = "username";
        "public" = "no";
        "writeable" = "yes";
        "force user" = "username";
        # Below are the most imporant for macOS compatibility
        # Change the above to suit your needs
        "fruit:aapl" = "yes";
        "fruit:time machine" = "yes";
        "vfs objects" = "catia fruit streams_xattr";
    };
  };
};

# Ensure Time Machine can discover the share without `tmutil`
services.avahi = {
  extraServiceFiles = {
    timemachine = ''
      <?xml version="1.0" standalone='no'?>
      <!DOCTYPE service-group SYSTEM "avahi-service.dtd">
      <service-group>
        <name replace-wildcards="yes">%h</name>
        <service>
          <type>_smb._tcp</type>
          <port>445</port>
        </service>
          <service>
          <type>_device-info._tcp</type>
          <port>0</port>
          <txt-record>model=TimeCapsule8,119</txt-record>
        </service>
        <service>
          <type>_adisk._tcp</type>
          <!-- 
            change tm_share to share name, if you changed it. 
          --> 
          <txt-record>dk0=adVN=tm_share,adVF=0x82</txt-record>
          <txt-record>sys=waMa=0,adVF=0x100</txt-record>
        </service>
      </service-group>
    '';
  };
};
```

#### Printer sharing

``` nix
services.samba.package = pkgs.sambaFull;
```

A printer share that allows printing to all members in the local network

The \`samba\` packages comes without <a href="Printing" class="wikilink" title="CUPS printing">CUPS printing</a> support compiled in, however \`sambaFull\` features printer sharing support.

#### Active Directory Domain Controller

We will setup an AD DC just like the the [Samba Wiki](https://wiki.samba.org/index.php/Setting_up_Samba_as_an_Active_Directory_Domain_Controller). Let's add the following nix config, updating the `adDomain`, `adWorkgroup`, `adNetbiosName` and `staticIp` according to your needs.

``` nix
{ config, lib, pkgs, ... }:
with lib;

let
  cfg = config.services.samba;
  samba = cfg.package;
  nssModulesPath = config.system.nssModules.path;
  adDomain = "samdom.example.com";
  adWorkgroup = "SAM";
  adNetbiosName = "SAMDOM";
  staticIp = "10.42.129.160";
in {
  # Disable resolveconf, we're using Samba internal DNS backend
  systemd.services.resolvconf.enable = false;
  environment.etc = {
    resolvconf = {
      text = ''
        search ${adDomain}
        nameserver ${staticIp}
      '';
    };
  };

  # Rebuild Samba with LDAP, MDNS and Domain Controller support
  nixpkgs.overlays = [ (self: super: {
    samba = (super.samba.override {
      enableLDAP = true;
      enableMDNS = true;
      enableDomainController = true;
      enableProfiling = true; # Optional for logging
       # Set pythonpath manually (bellow with overrideAttrs) as it is not set on 22.11 due to bug
    }).overrideAttrs (finalAttrs: previousAttrs: {
        pythonPath = with super; [ python3Packages.dnspython python3Packages.markdown tdb ldb talloc ];
      });
  })];

  # Disable default Samba `smbd` service, we will be using the `samba` server binary
  systemd.services.samba-smbd.enable = false;  
  systemd.services.samba = {
    description = "Samba Service Daemon";

    requiredBy = [ "samba.target" ];
    partOf = [ "samba.target" ];

    serviceConfig = {
      ExecStart = "${samba}/sbin/samba --foreground --no-process-group";
      ExecReload = "${pkgs.coreutils}/bin/kill -HUP $MAINPID";
      LimitNOFILE = 16384;
      PIDFile = "/run/samba.pid";
      Type = "notify";
      NotifyAccess = "all"; #may not do anything...
    };
    unitConfig.RequiresMountsFor = "/var/lib/samba";
  };
  services.samba = {
    enable = true;
    enableNmbd = false;
    enableWinbindd = false;
    configText = ''
      # Global parameters
      [global]
          dns forwarder = ${staticIp}
          netbios name = ${adNetbiosName}
          realm = ${toUpper adDomain}
          server role = active directory domain controller
          workgroup = ${adWorkgroup}
          idmap_ldb:use rfc2307 = yes

      [sysvol]
          path = /var/lib/samba/sysvol
          read only = No

      [netlogon]
          path = /var/lib/samba/sysvol/${adDomain}/scripts
          read only = No
    '';
  };  
}
```

After evaluating, you should see that the Samba service crashed because we haven't setup the database yet.

To do that, let's run the following command, updated with your own configuration:

`samba-tool domain provision --server-role=dc --use-rfc2307 --dns-backend=SAMBA_INTERNAL --realm=SAMDOM.EXAMPLE.COM --domain=SAMDOM --adminpass=Passw0rd`

Then restart the samba service with `sudo systemctl restart samba`, and you're ready to go!

## Samba Client

### CIFS mount configuration

The following snippets shows how to mount a CIFS (Windows) share in NixOS.

Note the inclusion of the `"nofail"` option; NixOS will treat CIFS shares like any other mounted drive, and this will allow the system to boot correctly if the mounted NAS is off or if the network is slow to initialize.

Replace all <FIELDS> with concrete values:

``` nix
{
  # For mount.cifs, required unless domain name resolution is not needed.
  environment.systemPackages = [ pkgs.cifs-utils ];
  fileSystems."/mnt/share" = {
    device = "//<IP_OR_HOST>/path/to/share";
    fsType = "cifs";
    options = let
      # this line prevents hanging on network split
      automount_opts = "x-systemd.automount,x-systemd.idle-timeout=60,x-systemd.device-timeout=5s,x-systemd.mount-timeout=5s";

    in ["${automount_opts},credentials=/etc/nixos/smb-secrets" "nofail"];
  };
}
```

Also create /etc/nixos/smb-secrets with the following content (`domain=` can be optional)

``` nix
username=<USERNAME>
domain=<DOMAIN>
password=<PASSWORD>
```

By default, CIFS shares are mounted as root. If mounting as user is desirable, \`uid\`, \`gid\` and usergroup arguments can be provided as part of the filesystem options:

``` nix
{
  fileSystems."/mnt/share" = {
    # ... rest of the filesystem config omitted
    options = let
      automount_opts = "x-systemd.automount,x-systemd.idle-timeout=60,x-systemd.device-timeout=5s,x-systemd.mount-timeout=5s,user,users";

      in ["${automount_opts},credentials=/etc/nixos/smb-secrets,uid=1000,gid=100"];
    # or if you have specified `uid` and `gid` explicitly through NixOS configuration,
    # you can refer to them rather than hard-coding the values:
    # in ["${automount_opts},credentials=/etc/nixos/smb-secrets,uid=${toString config.users.users.<username>.uid},gid=${toString config.users.groups.<group>.gid}"];
  };
}
```

### Firewall configuration

Samba discovery of machines and shares may need the firewall to be tuned ([source](https://wiki.archlinux.org/index.php/Samba#.22Browsing.22_network_fails_with_.22Failed_to_retrieve_share_list_from_server.22)): in `/etc/nixos/configuration.nix`, add:

``` nix
networking.firewall.extraCommands = ''iptables -t raw -A OUTPUT -p udp -m udp --dport 137 -j CT --helper netbios-ns'';
```

### Command line

List shares

    smbclient --list localhost

This should print

    $ smbclient --list localhost 
    Password for [WORKGROUP\user]:

        Sharename       Type      Comment
        ---------       ----      -------
        public          Disk      
        IPC$            IPC       IPC Service (smbnix)
    SMB1 disabled -- no workgroup available

Mount as guest. `public` is your share name

    nix-shell -p cifs-utils
    mkdir mnt
    sudo mount.cifs -o sec=none //localhost/public mnt

mount as user. `user` is your username

    sudo mount.cifs -o sec=ntlmssp,username=user //localhost/public mnt

`sec=ntlmssp` should work. for more values, see \`man mount.cifs\` (search for \`sec=arg\`)

### Browsing samba shares with GVFS

Many GTK-based file managers like Nautilus, Thunar, and PCManFM can browse samba shares thanks to GVFS. GVFS is a dbus daemon which must be running for this to work. If you use Gnome, you have nothing to do as the module already enables it for you, but in less full-featured desktop environments, some further configuration options are needed.

The generic way of enabling GVFS is to add this in `/etc/nixos/configuration.nix`:

``` nix
services.gvfs.enable = true;
```

There are however some special cases.

##### XFCE

<a href="Xfce" class="wikilink" title="Xfce">Xfce</a> comes with a slimmed-down version of GVFS by default which comes with samba support compiled out. To have <smb://> support in Thunar, we will use GNOME's full-featured version of GVFS:

``` nix
  services.gvfs = {
    enable = true;
    package = lib.mkForce pkgs.gnome.gvfs;
  };
```

##### No desktop environment

GVFS relies on polkit to gain privileges for some operations. Polkit needs an authentication agent to ask for credentials. Desktop environments usually provide one but if you have no desktop environment, you may have to install one yourself:

Excerpt of `/etc/nixos/configuration.nix`:

``` nix
environment.systemPackages = with pkgs; [ lxqt.lxqt-policykit ]; # provides a default authentification client for policykit
```

##### DBUS

Furthermore, if you happen to start your Window Manager directly, via `.xinitrc`, or directly invoke a Wayland compositor such as Sway, you should ensure that you launch dbus at startup in your session and export its environment. If you do not have a dbus session in your environment, you will see errors such as "Operation not supported" when attempting to browse the network.

For example, if you are using `.xinitrc`, you could invoke `dbus-launch`:

``` bash
export `dbus-launch` # starts dbus and exports its address
exec xterm # your prefered Window Manager
```

(You need to restart your Window Manager to have the changes in `.xinitrc` to take place.)

If you are using a Wayland compositor like Sway, you can run it under `dbus-run-session` for the same effect:

``` bash
dbus-run-session sway
```

(Because `dbus-run-session` exits when the child process exits, it is only appropriate to use `dbus-run-session` with a process that will be running during the entire session. This is the case for Wayland compositors, but is not necessarily true for all configurations of X11 window managers.)

## Troubleshooting

### Server log

    sudo journalctl -u samba-smbd.service -f

### Stale file handle

Trying to read the contents of a remote file leads to the following error message: "Stale file handle". If you have mounted a share via the method described in "cfis mount", adding the option `noserverino` might fix this problem. [1](https://askubuntu.com/questions/1265164/stale-file-handler-when-mounting-cifs-smb-network-drive-from-fritz-router)

### NT_STATUS_INVALID_NETWORK_RESPONSE

The error `protocol negotiation failed: NT_STATUS_INVALID_NETWORK_RESPONSE` means "access denied". Probably you must fix your server's `hosts allow` section. Note that `localhost` is the ipv6 localhost `::1`, and `127.0.0.1` is the ipv4 localhost

### Permission denied

Maybe check the `guest account` setting in your server config. The default value is `nobody`, but the user `nobody` has no access to `/home/user`:

    $ sudo -u nobody ls /home/user
    [sudo] password for user: 
    ls: cannot open directory '/home/user': Permission denied

As workaround, set `guest account = user`, where `user` is your username

## See also

- [Samba Options in NixOS on unstable](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=services.samba)
- [Samba in the Arch Linux Wiki](https://wiki.archlinux.org/title/Samba)
- [smb.conf man page](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
