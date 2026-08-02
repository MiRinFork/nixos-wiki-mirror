<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Installation Guide/ru -->

<languages/> Это руководство служит вспомогательным руководством для [официального руководства](https://nixos.org/nixos/manual/index.html#ch-installation). Оно описывает установку <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> как полноценной операционной системы, смотрите <a href="Nix_Installation_Guide" class="wikilink" title="Nix Installation Guide">Nix Installation Guide</a>.

Помимо описания действий из официального руководства, здесь приводятся проверенные инструкции для типичных сценариев использования. В случае расхождения между руководством и данным документом приоритетным считается вариант, описанный в руководстве.

<span id="Installation_target"></span>

## Цель установки

NixOS может быть установлена на различные типы устройств:

<div class="mw-translate-fuzzy">

- обычные (Intel или AMD) настольные компьютеры, ноутбуки или физически доступные сервера, представленные на этой странице
- Мини-компьютеры (как Raspberry Pi's) или другие платы на архитектуре ARM, смотрите \[\[NixOS on ARM\]\[
- Облачные или удаленные сервера, смотрите <a href="NixOS_friendly_hosters" class="wikilink" title="NixOS friendly hosters">NixOS friendly hosters</a>

</div>

<span id="Installation_method"></span>

## Методы установки

NixOS, как и многие другие Linux-базированные операционные системы, может быть установлен разными путями

1.  Обычный способ, загрузка с загрузочного диска. (Написано ниже.)
2.  <a href="Installing_from_Linux" class="wikilink" title="Booting the media from an existing Linux installation">Booting the media from an existing Linux installation</a>

<span id="Making_the_installation_media"></span>

## Создание загрузочного диска

С NixOS 14.11 установочный ISO образ гибридный. Это значит что он может загружаться как с CD так и с USB накопителя. Он может загружаться как с EFI систем, с более современных материнских плат и компьютеров Apple. Данная инструкция покажет стандартный способ копирования образа на USB накопитель. Если у вас CD или DVD накопитель, используйте способы для записи диска с ISO образа.

<span id="&quot;Burning&quot;_to_USB_drive"></span>

## Запись образа на USB накопитель

Для начала, скачайте образ [NixOS ISO image](https://nixos.org/download.html#nixos-iso) или <a href="Creating_a_NixOS_live_CD" class="wikilink" title="create a custom ISO">create a custom ISO</a>. Затем, вставьте USB накопитель, размер которого больше чем вес образа. Затем, следуйте инструкциям:

<span id="From_Linux"></span>

### Для Linux

1.  Найдите правильное устройство с `lsblk` or `fdisk -l`. Переместите <i>`/dev/sdX`</i> на нужное устройство по следующим шагам.
2.  Скопируйте на устройство: `cp nixos-xxx.iso `<em>`/dev/sdX`</em>

Запишите образ на диск с помощью команды: `dd if=nixos.iso of=/dev/sdX bs=4M status=progress conv=fdatasync`

<span id="From_macOS"></span>

### Для macOS

1.  Найдите правильное устройство: `diskutil list`, затем напишите: <i>`diskX`</i>.
2.  Размонтируйте: `diskutil unmountDisk `<i>`diskX`</i>.
3.  Запишите: `sudo dd if=`<b>`path_to_nixos.iso`</b>` of=/dev/`<i>`diskX`</i>

<span id="From_Windows"></span>

## Для Windows

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  Download [USBwriter](http://sourceforge.net/projects/usbwriter/).
2.  Start USBwriter.
3.  Choose the downloaded ISO as 'Source'
4.  Choose the USB drive as 'Target'
5.  Click 'Write'
6.  When USBwriter has finished writing, safely unplug the USB drive.

</div>

<span id="Alternative_installation_media_instructions"></span>

## Альтернативные способы установки

Способы приведенные выше являются одними из способов создания USB накопителя для загрузки

Эти методы написаны в гайде, но вы их можете использовать и для создания мультизагрузочной флешки. Этот способ не поддерживается, результат может получиться разным

- <a href="NixOS_Installation_Guide/Unetbootin" class="wikilink" title="Установка с помощью Unetbootin">Установка с помощью Unetbootin</a>
- <a href="NixOS_Installation_Guide/Manual_USB_Creation" class="wikilink" title="Ручное создание загрузочного USB накопителя">Ручное создание загрузочного USB накопителя</a>
- <a href="NixOS_Installation_Guide/multibootusb" class="wikilink" title="Мультизагрузочная флешка">Мультизагрузочная флешка</a>

## Загрузка установочного накопителя

Установочный накопитель гибридный и может загружаться как в legacy BIOS режиме так и в <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> режиме

Вне зависимости от способа загрузки, на вашей материнской плате или компьютере возможно прийдется разрешить загрузку с CD/DVD диска или USB накопителя

<span id="Legacy_bios_boot"></span>

### Legacy bios boot

Это единственный возможный вариант загрузки на компьютерах без EFI/UEFI

### UEFI boot

Загрузочный образ не подписан, поэтому EFI загрузчики могут ругаться. Для беспроблемной загрузки обязательно отключите Secure Boot в настройках

<span id="Connecting_to_the_internet"></span>

## Подключение к интернету

Для установки **обязательно** нужен работающий интернет. Также, возможна установка без интернета, но нужен специальный образ

<span id="Wired"></span>

### Проводной интернет

Для сетевых интерфейсов, поддерживаемых ядром, получение адреса по DHCP должно завершиться к моменту, когда станет доступна консоль.

<span id="Tethered_(Internet_Sharing)"></span>

## По модему (раздача интернета)

Если вы не можете подключить интернет с помощью кабеля или WiFi, просто подключите свой смартфон по проводу, и включите в настройках режим "USB-модема". Если ваш телефон поддерживается драйверами ядра, то у вас появится интернет.

<span id="Wireless"></span>

### Беспроводное подключение

<a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> устанавливается в образе с графическим интерфейсом, также возможно использование `nmtui` в консоли для подключения к интернету

Используя вкладку "Приложения" в левом верхнем углу или панель запуска в нижней части экрана, выберите терминал и запустите в нем команду `nmtui`. Это позволит вам активировать (беспроводное) соединение: в списке должны отобразиться доступные сети (SSID); если нужной сети нет, можно добавить новое соединение. После активации и проверки беспроводного соединения программа установки, запущенная при старте системы, скорее всего, еще не обнаружит новое подключение. Закройте программу установки и запустите ее заново с панели в нижней части экрана — теперь она должна распознать новое соединение и продолжить работу.

На минимальном образе вам лучше использовать <a href="wpa_supplicant" class="wikilink" title="wpa_supplicant">wpa_supplicant</a> вы его можете запустить посредством этих команд:`wpa_passphrase ESSID | sudo tee /etc/wpa_supplicant.conf`, затем впишите свой пароль, `systemctl restart wpa_supplicant`.

<span id="Partitioning"></span>

## Разметка

<div lang="en" dir="ltr" class="mw-content-ltr">

To partition the persistent storage run `sudo fdisk /dev/diskX` and follow instructions for MBR or (U)EFI. To determine which mode you are booted into, run:

</div>

``` console
$ [ -d /sys/firmware/efi/efivars ] && echo "UEFI" || echo "Legacy"
```

Очень простой вариант разметок дан тут.

### Legacy Boot (MBR)

- o (раздел dos диска)
- n new
- p primary (4 главных в сумме)
- 1 (номер раздела \[1/4\])
- 2048 первый раздел (соответствуйте ради эффективности)
- +500M последний сектор (сектор для загрузки)
- rm signature (Y), если она существует =\> предупреждение о перезаписи существующей файловой системы; можно использовать wipefs
- n
- p
- 2
- default (заполнить раздел)
- default (заполнить раздел)
- w (записать)

### UEFI

- g (раздел gpt диска)
- n
- 1 (номер раздела \[1/128\])
- 2048 первый сектор
- +500M последний сектор (размер загрузочного раздела)
- t
- 1 (EFI System)
- n
- 2
- default (заполните раздел)
- default (заполните раздел)
- w (записать)

<span id="Format_partitions"></span>

### Форматирование разделов

Для примера возьмем файловую систему формата <a href="ext4" class="wikilink" title="ext4">ext4</a>, По желанию, можете также использовать и другие форматы такие как <a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a> или <a href="ZFS" class="wikilink" title="ZFS">ZFS</a>:

- <a href="Bcachefs#NixOS_установка_в_bcachefs" class="wikilink" title="Bcachefs#NixOS установка в bcachefs">Bcachefs#NixOS установка в bcachefs</a>
- <a href="Btrfs#Установка_NixOS_на_btrfs" class="wikilink" title="Btrfs#Установка NixOS на btrfs">Btrfs#Установка NixOS на btrfs</a>
- <a href="LVM#Обычная_установка" class="wikilink" title="LVM#Обычная установка">LVM#Обычная установка</a>
- <a href="ZFS#Легкая_установка_NixOS_ZFS_в_root" class="wikilink" title="ZFS#Легкая установка NixOS ZFS в root">ZFS#Легкая установка NixOS ZFS в root</a>

Это полезно для использования нескольких конфигураций и упрощает управление разделами.

``` console
$ lsblk # lists current system block devices
# mkfs.fat -F 32 -n boot /dev/sdX1
# mkfs.ext4 /dev/sdX2 -L nixos
# mount /dev/disk/by-label/nixos /mnt
# mkdir -p /mnt/boot
# mount /dev/disk/by-label/boot /mnt/boot
```

<span id="NixOS_configuration"></span>

## Конфигурация NixOS

Настройка NixOS осуществляется с помощью файла <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="декларативной конфигурации">декларативной конфигурации</a>. Чтобы создать файл конфигурации по умолчанию, выполните <a href="nixos-generate-config" class="wikilink" title="nixos-generate-config">nixos-generate-config</a>:

``` console
# nixos-generate-config --root /mnt
# nano /mnt/etc/nixos/configuration.nix
```

Для информации как работать с системной конфигурацией, посмотрите <a href="NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>. Для домашних видов конфигураций смотрите <a href="NixOS_as_a_desktop" class="wikilink" title="NixOS as a desktop">NixOS as a desktop</a>

Самые ощутимые изменения:

- раскладка клавиатуры, т. е. <a href="Keyboard_Layout_Customization" class="wikilink" title="services.xserver.xkb.layout"><code>services.xserver.xkb.layout</code></a>
- <a href="networking" class="wikilink" title="networking">networking</a> (Wi-Fi); если возникнут проблемы, решение приведено ниже
- установка <a href=":Category:Text_Editor" class="wikilink" title="текстового редактора">текстового редактора</a> для правки конфигурации

Поиск по самодокументируемым опциям NixOS можно выполнить с помощью [(инструмент поиска опций NixOS)](https://search.nixos.org/options).

<span id="Swap_file"></span>

### Файл подкачки

Для дополнительных методов конфигурации файла подкачки, смотрите <a href="Swap" class="wikilink" title="Swap">Swap</a>. В следующем примере показано, как создать и включить <a href="Swap#Swap_file" class="wikilink" title="файл подкачки">файл подкачки</a>:

<span id="Bootloader"></span>

## Загрузчик

NixOS поддерживает различные <a href="Bootloader" class="wikilink" title="загрузчики">загрузчики</a> такие как <a href="GNU_GRUB" class="wikilink" title="GNU GRUB">GNU GRUB</a> и <a href="Systemd/boot" class="wikilink" title="Systemd/boot">Systemd/boot</a>

Systemd-boot — рекомендуемый загрузчик. В следующем примере показано, как включить systemd-boot в вашей конфигурации:

Возможно, вы также захотите настроить <a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a>.

<span id="Users"></span>

### Пользователи

Для информации как создавать и редактировать пользователей, смотрите <a href="User_management" class="wikilink" title="User management">User management</a> и . Например:

<span id="NixOS_installation"></span>

## Установка NixOS

``` console
# cd /mnt
# nixos-install
```

после установки: Запустите `passwd` для изменения пароля пользователя

<div lang="en" dir="ltr" class="mw-content-ltr">

if internet broke/breaks, try one of the following:

</div>

``` console
# nixos-rebuild switch --option substitute false # no downloads
# nixos-rebuild switch --option binary-caches "" # no downloads
```

wpa_supplicant flags для подключения к wifi

<hr />

<span id="Additional_notes_for_specific_hardware"></span>

## Дополнительные заметки для конкретных устройств

Здесь собраны заметки или ссылки для решения конкретных проблем у устройств.

<div lang="en" dir="ltr" class="mw-content-ltr">

- Blog post how to install NixOS on a [Dell 9560](http://grahamc.com/blog/nixos-on-dell-9560)
- Brand servers may require extra kernel modules be included into initrd (`boot.initrd.extraKernelModules` in configuration.nix) For example HP Proliant needs "hpsa" module to see the disk drive.

</div>

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
