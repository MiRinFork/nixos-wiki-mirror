<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/logind -->

<translate> `logind` is systemd’s login manager.

Its main manual page is `systemd-logind.service(8)`. Its configuration options are described in `logind.conf(5)`.

## Handling of power keys

`logind` handles power and standby hardware switches. The Arch wiki has a [good overview of which ACPI events are handled](https://wiki.archlinux.org/index.php/Power_management#ACPI_events).

### Don’t shutdown on power button press

On a laptop, you often don’t want an accidental short press of the power button to shut down your system, but instead to `suspend` or `hibernate`. You can add the following snippet to your `logind` config: </translate>

``` nix
services.logind.settings.Login.HandlePowerKey = "suspend";
```

<translate> If you want to ignore short presses of the power button entirely, you can use the following snippet instead: </translate>

``` nix
services.logind.settings.Login.HandlePowerKey = "ignore";
```

<translate> Long-pressing your power button (5 seconds or longer) to do a hard reset is handled by your machine’s BIOS/EFI and thus still possible.

Similar to the power key, you can ignore the reboot, suspend and hibernate keys like this: </translate>

``` nixos
services.logind.settings.Login.HandleRebootKey = "ignore";
services.logind.settings.Login.HandleSuspendKey = "ignore";
services.logind.settings.Login.HandleHibernateKey = "ignore";
```

<translate> Or ignore the action of closing/opening the lid on laptops like this: </translate>

``` nixos
services.logind.settings.Login.HandleLidSwitch = "ignore";
```

<translate>

### Ignore hardware keys when using `systemd-inhibit`

`systemd-inhibit` allows you to put a lock on e.g. shutdown or sleep that is in place as long the given process is running. By default, the hardware key actions configured in `logind` override such inhibits.

Say you want your laptop to stay awake when closing the lid in some circumstances, for example if you want to listen to music. If you start your lock screen with an inhibit on the lid switch

`systemd-inhibit --what=handle-lid-switch lock-screen-tool`

`logind` still overrides that user decision. For it to work, you need to tell logind to ignore the lid switch in your system config: </translate>

``` nix
services.logind.settings.Login = {
  # If you want to listen to music while the lid is closed
  HandleLidSwitch = "ignore";
};
```

<translate> </translate>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
