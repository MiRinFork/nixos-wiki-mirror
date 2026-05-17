<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Uninterruptible power supply -->

Uninterruptible power supply (UPS), provides near-instantaneous protection from input power interruptions by switching to energy stored in battery packs, supercapacitors or flywheels. The on-battery run-times of most UPSs are relatively short (only a few minutes) but sufficient to "buy time" for initiating a standby power source or properly shutting down the protected equipment. (source: Wikipedia)

Network UPS Tools (NUT) is a collection of software for managing power devices, mainly UPS units. This article describes the configuration of NUT for a simple server with a single power supply, with no local users and no additional equipment.

This article is mostly adapted from the excellent NUT ConfigExamples book, version 3.0, by Roger Price. [1](https://github.com/networkupstools/ConfigExamples/releases/latest/download/ConfigExamples.pdf)

# Compatible Hardware

Compatible hardware are listed at NUT website [2](https://networkupstools.org/stable-hcl.html). For best results, choose a model with good driver support with battery replacement notification. Battery pack in UPS is designed to be replaced every few years. For example, Eaton Ellipse ECO 650 [3](https://www.eaton.com/content/dam/eaton/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/eaton-ellipse-eco/eaton-ellipse-eco-userguides-en.pdf) needs a new battery every four years, under optimal operating conditions.

# Components of NUT Software

One or more UPS's are attached to the <strong>attachment daemon</strong> `upsd` via a UPS-specific <strong>driver daemon</strong>.

The attachment daemon maintains an abstract image of the UPS in memory. The attachment daemon can be queried by the `upsc` command. The driver daemon talks to the hardware and the attachment daemon. The driver daemon can be controlled by the `upsdrvctl` command.

The <strong>management daemon</strong> `upsmon` is a client of upsd. It runs permanently, checks the status of UPS, and react to status changes, such as initiating a shutdown.

# Configuration files in use

In this simple standalone server setup, the following configuration files are generated:

- ups.conf, declare UPS-specific driver information, power.ups.ups.\* option
- upsd.conf, control access to upsd, power.ups.upsd option
- upsd.users, add user with access to upsd, power.ups.users option
- upsmon.conf, connect upsmon to upsd, power.ups.upsmon.monitor section;
- upsmon.conf, set how upsmon should react to status changes, power.ups.upsmon.settings section
- delayed UPS shutdown systemd unit, to make Restore Power on AC Return BIOS option functional, systemd.services.nut-delayed-ups-shutdown section

# Declare UPS units

Corresponds to file ups.conf

``` nix
  power.ups = {
    enable = true;
    mode = "standalone";
    # section: The upsd UPS declarations: ups.conf
    # this UPS device is named UPS-1.
    ups."UPS-1" = {
      description = "Eaton Ellipse ECO 650 with 12V 7Ah lead-acid Batt";

      # driver name from https://networkupstools.org/stable-hcl.html
      driver = "usbhid-ups";

      # usbhid-ups driver always use value "auto"
      port = "auto";

      directives = [
        # "Restore power on AC" BIOS option needs power to be cut a few seconds to work;
        # this is achieved by the offdelay and ondelay directives.

        # in the last stages of system shutdown, "upsdrvctl shutdown" is called to tell UPS that
        # after offdelay seconds, the UPS power must be cut, even if
        # wall power returns.

        # There is a danger that the system will take longer than the default 20 seconds to shut down. 
        # If that were to happen, the UPS shutdown would provoke a brutal system crash.
        # We adjust offdelay, to solve this issue.
        "offdelay = 60"

        # UPS power is now cut regardless of wall power.  After (ondelay minus offdelay) seconds,
        # if wall power returns, turn on UPS power.  The system has now been disconnected for a minimum of (ondelay minus offdelay) seconds,
        # "Restore power on AC" should now power on the system.
        # For reasons described above, ondelay value must be larger than offdelay value.
        # We adjust ondelay, to ensure Restore power on AC option returns to Power Disconnected state.
        "ondelay = 70"

        # set value for battery.charge.low,
        # upsmon initiate shutdown once this threshold is reached.
        "lowbatt = 40"

        # ignore it if the UPS reports a low battery condition
        # without this, system will shutdown only when ups reports lb,
        # not respecting lowbatt option
        "ignorelb"
      ];
    };
```

# Declare upsd listening ports

Corresponds to file upsd.conf. This file declares which ports the upsd daemon will listen to.

``` nix
  power.ups = {
    # section: The upsd daemon access control; upsd.conf
    upsd = {
      listen = [
        {
          address = "127.0.0.1";
          port = 3493;
        }
        {
          address = "::1";
          port = 3493;
        }
      ];
    };
   };
```

# Declare users with access to UPS

Corresponds to file upsd.users. This file declares a virtual user (not related to /etc/passwd users) with write access to UPS. A password is also declared.

``` nix
  power.ups = {
    # section: Users that can access upsd. The upsd daemon user
    # declarations. upsd.users
    users."nut-admin" = {
      # A file that contains just the password.
      passwordFile = "/etc/nixos/ups-passwd.txt";
      upsmon = "primary";
    };
   };
```

# Connect upsmon to upsd

Corresponds to upsmon.conf. This file declares how upsmon should connect to upsd

``` nix
  power.ups = {
    # section: The upsmon daemon configuration: upsmon.conf
    upsmon.monitor."UPS-1" = {
      system = "UPS-1@localhost";
      powerValue = 1;
      user = "nut-admin";
      passwordFile = "/etc/nixos/ups-passwd.txt";
      type = "primary";
    };
   };
```

# Declare how upsmon should react to status changes

Corresponds to upsmon.conf. This file declares how upsmon is to handle NOTIFY events.

``` nix
  power.ups = {
    upsmon.settings = {
      # This configuration file declares how upsmon is to handle
      # NOTIFY events.

      # POWERDOWNFLAG and SHUTDOWNCMD is provided by NixOS default
      # values

      # values provided by ConfigExamples 3.0 book
      NOTIFYMSG = [
        [ "ONLINE" ''"UPS %s: On line power."'' ]
        [ "ONBATT" ''"UPS %s: On battery."'' ]
        [ "LOWBATT" ''"UPS %s: Battery is low."'' ]
        [ "REPLBATT" ''"UPS %s: Battery needs to be replaced."'' ]
        [ "FSD" ''"UPS %s: Forced shutdown in progress."'' ]
        [ "SHUTDOWN" ''"Auto logout and shutdown proceeding."'' ]
        [ "COMMOK" ''"UPS %s: Communications (re-)established."'' ]
        [ "COMMBAD" ''"UPS %s: Communications lost."'' ]
        [ "NOCOMM" ''"UPS %s: Not available."'' ]
        [ "NOPARENT" ''"upsmon parent dead, shutdown impossible."'' ]
      ];
      NOTIFYFLAG = [
        [ "ONLINE" "SYSLOG+WALL" ]
        [ "ONBATT" "SYSLOG+WALL" ]
        [ "LOWBATT" "SYSLOG+WALL" ]
        [ "REPLBATT" "SYSLOG+WALL" ]
        [ "FSD" "SYSLOG+WALL" ]
        [ "SHUTDOWN" "SYSLOG+WALL" ]
        [ "COMMOK" "SYSLOG+WALL" ]
        [ "COMMBAD" "SYSLOG+WALL" ]
        [ "NOCOMM" "SYSLOG+WALL" ]
        [ "NOPARENT" "SYSLOG+WALL" ]
      ];
      # every RBWARNTIME seconds, upsmon will generate a replace
      # battery NOTIFY event
      RBWARNTIME = 216000;
      # every NOCOMMWARNTIME seconds, upsmon will generate a UPS
      # unreachable NOTIFY event
      NOCOMMWARNTIME = 300;
      # after sending SHUTDOWN NOTIFY event to warn users, upsmon
      # waits FINALDELAY seconds long before executing SHUTDOWNCMD
      # Some UPS's don't give much warning for low battery and will
      # require a value of 0 here for aq safe shutdown.
      FINALDELAY = 0;
    };
   };
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
