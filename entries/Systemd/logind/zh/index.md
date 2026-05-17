<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/logind/zh -->

<div lang="en" dir="ltr" class="mw-content-ltr">

`logind` is systemd’s login manager.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Its main manual page is `systemd-logind.service(8)`. Its configuration options are described in `logind.conf(5)`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Handling of power keys

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

`logind` handles power and standby hardware switches. The Arch wiki has a [good overview of which ACPI events are handled](https://wiki.archlinux.org/index.php/Power_management#ACPI_events).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Don’t shutdown on power button press

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

On a laptop, you often don’t want an accidental short press of the power button to shut down your system, but instead to `suspend` or `hibernate`. You can add the following snippet to your `logind` config:

</div>

``` nix
services.logind.powerKey = "suspend";
```

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to ignore short presses of the power button entirely, you can use the following snippet instead:

</div>

``` nix
services.logind.powerKey = "ignore";
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Long-pressing your power button (5 seconds or longer) to do a hard reset is handled by your machine’s BIOS/EFI and thus still possible.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Similar to the power key, you can ignore the reboot, suspend and hibernate keys like this:

</div>

``` nixos
services.logind.rebootKey = "ignore";
services.logind.suspendKey = "ignore";
services.logind.hibernateKey = "ignore";
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Or ignore the action of closing/opening the lid on laptops like this:

</div>

``` nixos
services.logind.lidSwitch = "ignore";
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Ignore hardware keys when using `systemd-inhibit`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

`systemd-inhibit` allows you to put a lock on e.g. shutdown or sleep that is in place as long the given process is running. By default, the hardware key actions configured in `logind` override such inhibits.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Say you want your laptop to stay awake when closing the lid in some circumstances, for example if you want to listen to music. If you start your lock screen with an inhibit on the lid switch

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

`systemd-inhibit --what=handle-lid-switch lock-screen-tool`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

`logind` still overrides that user decision. For it to work, you need to tell logind to ignore the lid switch in your system config:

</div>

``` nix
services.logind.extraConfig = ''
  # want to be able to listen to music while laptop closed
  LidSwitchIgnoreInhibited=no
'';
```

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
