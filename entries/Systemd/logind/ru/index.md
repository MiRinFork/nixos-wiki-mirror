<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/logind/ru -->

`logind` это менеджер входа в систему являющийся компонентом <a href="Systemd" class="wikilink" title="Systemd">Systemd</a>.

Его главное руководство это `systemd-logind.service(8)`. Параметры его конфигурации описаны в `logind.conf(5)`.

<span id="Handling_of_power_keys"></span>

## Обработка нажатий клавиши питания

<div lang="en" dir="ltr" class="mw-content-ltr">

`logind` handles power and standby hardware switches. The Arch wiki has a [good overview of which ACPI events are handled](https://wiki.archlinux.org/index.php/Power_management#ACPI_events).

</div>

<span id="Don’t_shutdown_on_power_button_press"></span>

### Не выключать компьютер при нажатие клавиши питания

<div class="mw-translate-fuzzy">

Если вы пользуетесь ноутбуком, то часто не хотите, чтобы случайное короткое нажатие на кнопку питания привело к выключению системы. Вы можете добавить следующий фрагмент кода в свой конфиг `logind` чтобы избежать этого:

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

Долгое нажатие кнопки питания (5 секунд или дольше) для выполнения жесткого сброса обрабатывается BIOS/EFI вашего компьютера и поэтому все еще возможно.

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

<span id="Ignore_hardware_keys_when_using_systemd-inhibit"></span>

### Игнорировать аппаратные клавиши при использовании `systemd-inhibit`

code\>systemd-inhibit</code> позволяет наложить блокировку, например, на shutdown или sleep, которая будет действовать до тех пор, пока данный процесс запущен. По умолчанию действия аппаратных клавиш, настроенные в `logind`, отменяют такие запреты.

Допустим, вы хотите, чтобы ваш ноутбук не выключался при закрытии крышки в некоторых обстоятельствах, например, если вы хотите послушать музыку. Если вы запустите экран блокировки с запретом на переключение крышки

<div lang="en" dir="ltr" class="mw-content-ltr">

`systemd-inhibit --what=handle-lid-switch lock-screen-tool`

</div>

`logind` все равно отменяет это решение пользователя. Чтобы это работало, вам нужно указать logind игнорировать переключатель lid в системной конфигурации:

``` nix
services.logind.extraConfig = ''
  # want to be able to listen to music while laptop closed
  LidSwitchIgnoreInhibited=no
'';
```

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
