<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Power Management -->

This article covers configurations related to power management in terms of energy saving modes of various devices and components.

## Configuration

### Hard drives

Following snippet configures <a href="Udev" class="wikilink" title="Udev">Udev</a> rules which automatically run the program `hdparm` to enable power saving modes for hard disks, especially rotational drives mapped to `/dev/sd*`.

``` nix
services.udev.extraRules = 
  let
    mkRule = as: lib.concatStringsSep ", " as;
    mkRules = rs: lib.concatStringsSep "\n" rs;
  in mkRules ([( mkRule [
    ''ACTION=="add|change"''
    ''SUBSYSTEM=="block"''
    ''KERNEL=="sd[a-z]"''
    ''ATTR{queue/rotational}=="1"''
    ''RUN+="${pkgs.hdparm}/bin/hdparm -B 90 -S 41 /dev/%k"''
  ])]);
```

The `hdparm` parameters `-B` and `-S` define power saving modes and in case of `-S` the standby (spindown) timeout. The number 41 means therefore: Turn off the motor after 205 = 41\*5 seconds.

### Suspend hooks

NixOS provides the option which defines commands that are added to a global script that will be executed after resuming.

``` nix
powerManagement.resumeCommands = ''
  echo "This should show up in the journal after resuming."
'';
```

It is also possible to use the `post-resume` target directly to make a service.

``` nix
systemd.services.your-service-name = { 
  description = "Service description here";
  wantedBy = [ "post-resume.target" ];
  after = [ "post-resume.target" ];
  script = ''
    echo "This should show up in the journal after resuming."
  '';
  serviceConfig.Type = "oneshot";
};
```

### Hibernation

Hibernation requires a configured swap device. See [installation instructions](https://nixos.org/manual/nixos/stable/#ch-installation) on how to create a swap partition.

Please note that `resumeDevice` must match the output of `swapon -s` especially if you're dealing with mapped volumes (LUKS, logical volumes, logical volumes under LUKS, etc.). If you're using a swapfile, you must also [specify the offset to it.](https://search.nixos.org/options?channel=unstable&show=boot.resumeDevice&from=0&size=50&sort=relevance&type=packages&query=resume+offset)

Therefore, an example configuration could look like this:

``` nix
// I'm hibernating into a logical volume that's also under LUKS. Pretty cool, right?

swapDevices = [
  {
    device = "/dev/VG/SWAP";
  }
];

boot.resumeDevice = "/dev/dm-7";
```

Derived from a system with the following output from `swapon -s` :

``` text
Filename                                Type            Size           Used             Priority
/dev/dm-7                               partition       67108860       00
/dev/zram0                              partition       32881148       032767
```

Test and use hibernation with the following command:

``` nix
systemctl hibernate
```

## Tips and tricks

### Hibernate after specified time

Using following configuration, your system will go from suspend into hibernate after 1 hour:

``` nix
systemd.sleep.extraConfig = ''
  HibernateDelaySec=1h
'';
```

### Disable all sleep functionality

Some desktop environment and display manager combinations might attempt to put your machine to sleep as default behavior (i.e. SDDM and KDE Plasma 6 under Wayland). If this is not what you want, you can define the following to block any service attempting to put your machine to sleep via systemd:

``` nix
systemd.sleep.settings.Sleep = {
  AllowHibernation = "no";
  AllowHybridSleep = "no";
  AllowSuspend = "no";
  AllowSuspendThenHibernate = "no";
};
```

## Troubleshooting

### System immediately wakes up from suspend

Particularly in some Gigabyte motherboards with NVMe drives, the system may immediately wake up from being suspended. This can be worked around by disabling the wakeup triggers for the offending components:

#### Solution 1: Disabling wakeup triggers for all PCIe devices

If you don't need your system to wakeup via PCIe components you can simply disable it for all without needing to determine which component is causing problems.

``` nix
services.udev.extraRules = ''
  ACTION=="add", SUBSYSTEM=="pci", DRIVER=="pcieport", ATTR{power/wakeup}="disabled"
'';
```

#### Solution 2: Disable a common NVMe interface

Specifically on Gigabyte motherboards you can try targetting only the NVMe ports.

``` nix
services.udev.extraRules = ''
  ACTION=="add" SUBSYSTEM=="pci" ATTR{vendor}=="0x1022" ATTR{device}=="0x1483" ATTR{power/wakeup}="disabled"
'';
```

#### Solution 3: Disable a single device's wakeup triggers

If you wish to be more granular in what components should no longer be able to wakeup your system, you can find out which component is causing the wakeup events.

First, list all components and their current wakeup status:

``` shell-session
$ cat /proc/acpi/wakeup
Device  S-state   Status   Sysfs node
GP12      S4    *enabled   pci:0000:00:07.1
GP13      S4    *disabled  pci:0000:00:08.1
XHC0      S4    *enabled   pci:0000:0a:00.3
GP30      S4    *disabled
....
PT27      S4    *disabled
PT28      S4    *disabled
PT29      S4    *disabled  pci:0000:03:09.0
```

You can temporarily toggle a device by writing its "Device" name back into `/proc/acpi/wakeup`

``` sh
echo GPP0 | sudo tee /proc/acpi/wakeup
```

After finding out which component is causing unwanted wakeups you can use the sysfs id to find out the "vendor" and "device" fields:

``` console
$ cat /sys/class/pci_bus/0000:04/device/0000:04:00.0/vendor
0x1987
$ cat /sys/class/pci_bus/0000:04/device/0000:04:00.0/device
0x5013
```

And finally use those values in a `udev` rule:

``` nix
services.udev.extraRules = ''
  ACTION=="add" SUBSYSTEM=="pci" ATTR{vendor}=="0x1987" ATTR{device}=="0x5013" ATTR{power/wakeup}="disabled"
'';
```

### Suspend blocked by `pre-sleep.service`

Sometimes, the system appears to suspend (Wi-Fi turns off, screen locks), but the hardware does not actually suspend, and all subsequent `systemctl suspend` or `systemctl reboot` commands are met with:

``` console
# systemctl suspend
Call to Suspend failed: Action suspend already in progress, refusing requested suspend operation.

# systemctl reboot
Call to Reboot failed: Action suspend already in progress, refusing requested reboot operation.
```

If directly telling the kernel to suspend as root works:

``` console
# echo mem > /sys/power/state
```

Then a long-running `pre-sleep.service` might be hanging the sleep. This can be verified with `systemctl list-jobs`:

``` console
# systemctl list-jobs 
JOB   UNIT                    TYPE  STATE  
12144 suspend.target          start waiting
12149 pre-sleep.service       start running
12145 systemd-suspend.service start waiting
12268 post-resume.target      start waiting
12148 sleep.target            start waiting
12269 post-resume.service     start waiting
```

Here, the `pre-sleep.service` is blocking and halting suspend. To see why, we can use `systemctl cat pre-sleep.service`:

``` systemd
# systemctl cat pre-sleep.service
# /etc/systemd/system/pre-sleep.service
[Unit]
Before=sleep.target
Description=Pre-Sleep Actions

[Service]
# <... Omitted Environment directives PATH, LOCALE_ARCHIVE, TZDIR ...>
ExecStart=/nix/store/yzf7cpiqzq49san2frijxsh160zjy6fp-unit-script-pre-sleep-start/bin/pre-sleep-start 
Type=oneshot

[Install]
WantedBy=sleep.target
```

In this case, the `pre-sleep-start` script referenced by `ExecStart` contained directives installed by the <a href="Displaylink" class="wikilink" title="Displaylink">Displaylink</a> package, that contained a flush operation which hung the suspend action. Starting `dlm.service` or running `sudo DisplayLinkManager` unblocks the script and made suspend work normally.

#### Cancelling an existing suspend action

An existing suspend operation that is hung may be interrupted using **`systemctl cancel`** in case reboots or internet access is needed.

## See also

- <a href="Laptop" class="wikilink" title="Laptop">Laptop</a>

## External resources

- 

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
