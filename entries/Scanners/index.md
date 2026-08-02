<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Scanners -->

## Installing scanner support

Scanner support is provided by the [SANE](http://www.sane-project.org) library. To enable scanner support, amend your system configuration like so: Users in the `scanner` group will gain access to the scanner, or the `lp` group if it’s also a printer. To add yourself to these groups, amend your system configuration as follows:

## Testing scanner support

To determine if your scanner is supported by SANE:

``` console
$ scanimage -L
```

If you can only see scanners when running as root, try adding the user to the `scanner` or `lp` groups, either using the method given above, or as follows (beware, don't forget to logout/login after running this command):

``` console
$ sudo usermod -a -G scanner,lp username
```

## Supported backends

See the [Supported Devices](http://www.sane-project.org/sane-supported-devices.html) page to check if your scanner is supported. Some backends are proprietary and are not installed by default; see below. You may also be interested in "driverless" scanning (see below) if your scanner supports Apple AirScan and/or Microsoft WSD.

### Driverless Apple AirScan and Microsoft WSD

A large number of printers now support "driverless" scanning. As explained [at the sane-airscan backend project](https://github.com/alexpevzner/sane-airscan):

> Driverless scanning comes in two flavors:
>
> - Apple AirScan or AirPrint scanning (official protocol name is eSCL)
> - Microsoft WSD, or WS-Scan (Web Services for Devices)
>
> This backend implements both protocols, choosing automatically between them. It was successfully tested with many devices from Brother, Canon, Dell, Kyocera, Lexmark, Epson, HP, Panasonic, Ricoh, Samsung and Xerox, both in WSD and eSCL modes.
>
> For eSCL devices, Apple maintains a [comprehensive list of compatible devices](https://support.apple.com/en-us/HT201311). This list has scanners, multifunction devices and pure printers.

eSCL/Apple Airscan scanners should be found natively by the default escl backend. However, the `sane-airscan` third party backend is more actively maintained and you may have better luck using it:

``` nix
hardware.sane.extraBackends = [ pkgs.sane-airscan ];
services.udev.packages = [ pkgs.sane-airscan ];
```

It can be that your scanner is found twice (once by `escl` and once by `airscan`, in this case disable `escl`:

``` nix
hardware.sane.disabledDefaultBackends = [ "escl" ];
```

To detect Microsoft WSD "driverless" scanning, also use the `sane-airscan` backend.

If the scanner is connected by USB, also set the following option:

``` nix
services.ipp-usb.enable=true;
```

### HP

``` nix
hardware.sane.extraBackends = [ pkgs.hplipWithPlugin ];
```

### Epson

If your scanner is listed as supported by the `epkowa` backend and is connected by USB or SCSI:

``` nix
hardware.sane.extraBackends = [ pkgs.epkowa ];
```

If your scanner is listed as supported by the `epkowa` backend and is on the network, substitute the host name or IP address in:

``` nix
hardware.sane.extraBackends = [
  (pkgs.epkowa.overrideAttrs (oldAttrs: {
    postInstall = oldAttrs.postInstall + ''
      echo "net epson10a2e0.local" >> $out/etc/sane.d/epkowa.conf
    '';
  }))
];
```

Some other scanners (see [list](https://gitlab.com/utsushi/utsushi/blob/master/README)) need the `utsushi` backend:

``` nix
hardware.sane.extraBackends = [ pkgs.utsushi ];
services.udev.packages = [ pkgs.utsushi ];
```

### SnapScan firmware

Many scanners require firmware blobs which can be downloaded from the website of the scanner or extracted from the drivers they provide. Once you have the appropriate firmware you need to tell SANE where to find it in your configuration.nix:

``` nix
{
  hardware.sane.enable = true;
  hardware.sane.drivers.scanSnap.enable = true;
  # the below may be necessary
  nixpkgs.config.sane.snapscanFirmware = pkgs.fetchurl {
    # https://wiki.ubuntuusers.de/Scanner/Epson_Perfection/#Unterstuetzte-Geraete
    url = "https://media-cdn.ubuntu-de.org/wiki/attachments/52/46/Esfw41.bin"; #Epson Perfection 2480
    sha256 = "00cv25v4xlrgp3di9bdfd07pffh9jq2j0hncmjv3c65m8bqhjglq";
  };
}
```

### Brother

Brother currently provides four different scanner backends for various generations of its scanners. The newest (brscan4) is supported as a loadable submodule in NixOS. It can be activated by importing the appropriate file into `/etc/nixos/configuration.nix`:

``` nix
{
  ...
  imports = [
    <nixpkgs/nixos/modules/services/hardware/sane_extra_backends/brscan4.nix>
    ./hardware-configuration.nix
  ];
  ...
}
```

Then just add a scanner in the sane module:

``` nix
{
  ...
  hardware = {
    sane = {
      enable = true;
      brscan4 = {
        enable = true;
        netDevices = {
          home = { model = "MFC-L2700DN"; ip = "192.168.178.23"; };
        };
      };
    };
  };
  ...
}
```

In some cases, configuration changes may not take effect until after a reboot.

## GIMP support

To enable support for scanning in GIMP:

1.  Enable GIMP support in xsane by editing `/etc/nixos/configuration.nix.` Remove `pkgs.xsane` from your package list, and use the following instead:
    ``` nix
    {
      #...
      environment.systemPackages = [
        (pkgs.xsane.override { gimpSupport = true; })
      ];
      #...
    }
    ```
2.  Rebuild:
    ``` console
    $ sudo nixos-rebuild switch
    ```
3.  Finally, you will need to manually create a symlink:
    ``` console
    $ ln -s /run/current-system/sw/bin/xsane ~/.config/GIMP/2.10/plug-ins/xsane
    ```

## Network scanning

If NixOS cannot find a scanner located on your network, you may be interested in adding in your `configuration.nix`:

``` nix
{
  ...
  services.avahi = {
    enable = true;
    nssmdns4 = true;  # for IPv4
  # nssmdns6 = true;  # for IPv6
  };
  ...
}
```

Currently (2017-08-16) the SANE backend does not support overriding according to . The workaround for this is to download [michaelrus's sane-extra-config.nix](https://raw.githubusercontent.com/michalrus/dotfiles/d943be3089aa436e07cea5f22d829402936a9229/.nixos-config.symlink/modules/sane-extra-config.nix), copy it to `/etc/nixos/sane-extra-config.nix` and import it in `/etc/nixos/configuration.nix` as follows:

``` nix
{
  ...
  imports = [
    ...
    ./sane-extra-config.nix
    ...
  ];
 ...
 hardware.sane.extraConfig."magicolor" = ''
   net 10.0.0.30 0x2098
 ''; # Magicolor 1690mf
 ...
}
```

## Using the scanner button

Many scanners feature a hardware button which makes for very convenient operation, especially in combination with an automated document processing system like `paperless`. NixOS includes the scanner button daemon `scanbd` which can be used for this purpose; however, its setup isn't terribly user friendly.

Basic `scanbd` configuration requires us to provide:

1.  a config file;
2.  a script to execute the scanning sequence;
3.  a systemd service that loads the config file, starts polling the scanner, and executes the script when it detects a button press.

There is a more advanced configuration which allows sharing the scanner with SANE frontends, but I haven't yet figured out how to set this up under NixOS (the config is a bit recursive).

Full documentation is in [the project README](https://sourceforge.net/p/scanbd/code/HEAD/tree/releases/1.5.1/doc/README.txt).

[kliu's blog](https://kliu.io/post/automatic-scanning-with-scansnap-s500m/) includes in his writeup a nice script, bits of which have been cribbed here.

Here is a working derivation that dumps the scanned document into the `paperless` intake directory; you'll need to modify it to suit your own needs.

``` nix
{ config, lib, pkgs, ... }:

with lib;

let
  configDir = "/etc/scanbd";
  saneConfigDir = "${configDir}/sane.d";

  scanbdConf = pkgs.writeText "scanbd.conf"
    ''
      global {
        debug = true
        debug-level = ${toString config.services.scanbd.debugLevel}
        user = ${config.services.scanbd.user}
        group = ${config.services.scanbd.group}
        scriptdir = ${configDir}/scripts
        pidfile = ${config.services.scanbd.pidFile}
        timeout = ${toString config.services.scanbd.timeOut}
        environment {
          device = "SCANBD_DEVICE"
          action = "SCANBD_ACTION"
        }

        multiple_actions = true
        action scan {
          filter = "^scan.*"
          numerical-trigger {
            from-value = 1
            to-value = 0
          }
          desc = "Scan to file"
          script = "scan.script"
        }
        ${config.services.scanbd.extraConfig}
      }
    '';

  scanScript = pkgs.writeScript "scanbd_scan.script"
    ''
      #! ${pkgs.bash}/bin/bash
      export PATH=${lib.makeBinPath [ pkgs.coreutils pkgs.sane-frontends pkgs.sane-backends pkgs.ghostscript pkgs.imagemagick ]}
      set -x
      date="$(date --iso-8601=seconds)"
      filename="Scan $date.pdf"
      tmpdir="$(mktemp -d)"
      pushd "$tmpdir"
      scanadf -d "$SCANBD_DEVICE" --source "ADF Duplex" --mode Gray --resolution 200dpi

      # Convert any PNM images produced by the scan into a PDF with the date as a name
      convert image* -density 200 "$filename"
      chmod 0666 "$filename"

      # Remove temporary PNM images
      rm --verbose image*

      # Atomic move converted PDF to destination directory
      paperlessdir="/var/lib/paperless/consume"
      cp -pv "$filename" $paperlessdir/"$filename".tmp &&
      mv $paperlessdir/"$filename".tmp $paperlessdir/"$filename" &&
      rm "$filename"

      popd
      rm -r "$tmpdir"
    '';

in

{

  ###### interface
  options = {

    services.scanbd.enable = mkOption {
      type = types.bool;
      default = false;
      description = ''
        Enable support for scanbd (scanner button daemon).

        <note><para>
          If scanbd is enabled, then saned must be disabled.
        </para></note>
      '';
    };

    services.scanbd.user = mkOption {
      type = types.str;
      default = "scanner";
      example = "";
      description = ''
        scanbd daemon user name.
      '';
    };

    services.scanbd.group = mkOption {
      type = types.str;
      default = "scanner";
      example = "";
      description = ''
        scanbd daemon group name.
      '';
    };

    services.scanbd.extraConfig = mkOption {
      type = types.lines;
      default = "";
      example = ''
        device canon {
          filter = "^genesys.*"
          desc = "Canon LIDE"
          action file {
            filter = "^file.*"
            desc = "File"
            script = "copy.script"
          }
        }
        '';
      description = ''
        Extra configuration lines included verbatim in scanbd.conf.
        Use e.g. in lieu of including device-specific config templates
        under scanner.d/
      '';
    };

    services.scanbd.pidFile = mkOption {
      type = types.str;
      default = "/var/run/scanbd.pid";
      example = "";
      description = ''
        PID file path.
      '';
    };

    services.scanbd.timeOut = mkOption {
      type = types.int;
      default = 500;
      example = "";
      description = ''
        Device polling timeout (in ms).
      '';
    };

    services.scanbd.debugLevel = mkOption {
      type = types.int;
      default = 3;
      example = "";
      description = ''
        Debug logging (1=error, 2=warn, 3=info, 4-7=debug)
      '';
    };

  };

  ###### implementation
  config = mkIf config.services.scanbd.enable {

      users.groups.scanner.gid = config.ids.gids.scanner;
      users.users.scanner = {
        uid = config.ids.uids.scanner;
        group = "scanner";
      };

      environment.etc."scanbd/scanbd.conf".source = scanbdConf;
      environment.etc."scanbd/scripts/scan.script".source = scanScript;
      environment.etc."scanbd/scripts/test.script".source = "${pkgs.scanbd}/etc/scanbd/test.script";

      systemd.services.scanbd = {
        enable = true;
        description = "Scanner button polling service";
        documentation = [ "https://sourceforge.net/p/scanbd/code/HEAD/tree/releases/1.5.1/integration/systemd/README.systemd" ];
        script = "${pkgs.scanbd}/bin/scanbd -c ${configDir}/scanbd.conf -f";
        wantedBy = [ "multi-user.target" ];
        aliases = [ "dbus-de.kmux.scanbd.server.service" ];
      };
}
```

## See also

### Scanner firmware files

- [Agfa Snapscan e40](https://sites.google.com/site/rameyarnaud/media/books/agfa-scanners-with-linux)
- [Misc Agfa Snapscan](https://download.tuxfamily.org/xcfaudio/) \| [IPFS mirror](https://ipfs.io/ipfs/QmZJ2SfpfYUAS23TujhcdLpTox1SW3Dw3MoCej9GAfs4ya)

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
