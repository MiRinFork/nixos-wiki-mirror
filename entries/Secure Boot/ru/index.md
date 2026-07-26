<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Secure Boot/ru -->

<languages/> Под безопасной загрузкой обычно подразумевается возможность встроенного программного обеспечения платформы проверять компоненты загрузки и гарантировать, что загрузится только ваша собственная операционная система.

Secure Boot имеет несколько реализаций, наиболее известная - UEFI Secure Boot, которая опирается на прошивку платформы UEFI, но во встраиваемых системах могут существовать и другие реализации.

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

## Проверка состояния безопасной загрузки

самый лёгкий способ проверить, включена ли безопасная загрузка на вашем компьютере - использовать `bootctl` от <a href="Systemd" class="wikilink" title="Systemd">Systemd</a>. Необязательно использовать <a href="Systemd/boot" class="wikilink" title="systemd-boot">systemd-boot</a> как ваш основной загрузчик, чтобы эта команда работала.

``` console
$ bootctl status
System:
    Firmware: UEFI 2.80 (American Megatrends 5.25)
    Firmware Arch: x64
    Secure Boot: enabled (user)
    TPM2 Support: yes
    Measured UKI: yes
    Boot into FW: supported
...
```

В продемонстрированной выше системе включена и используется безопасная загрузка. Другие значения включают `disabled (setup)` для режима настройки, `disabled (disabled)` или `disabled (unsupported)`. Тэг unsupported появляется только если ваша материнская плата или её программное обеспечение не поддерживает безопасную загрузку. Если вы видите `disabled (disabled)`, это значит, что вам нужно включить безопасную загрузку в настройках UEFI перед тем как продолжить, чтобы использовать один из описанных ниже проектов

## Включение безопасной загрузки на NixOS

В NixOS на данный момент имеется два способа включения безопасной загрузки, <a href="Lanzaboote" class="wikilink" title="Lanzaboote">Lanzaboote</a> и <a href="Limine" class="wikilink" title="Limine">Limine</a>. Пошаговые инструкции по каждому из них вы найдете на соответствующих страницах вики.

Чтобы безопасная загрузка была максимально эффективна, должны быть соблюдены определённые условия. Самими важными являются:

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  The UEFI firmware is protected by a strong password to prevent an untrusted drive from being booted or Secure Boot being disabled.
2.  Full disk encryption is enabled so that your drive cannot simply be read by putting it another another machine.
3.  Ideally, default OEM/third party keys are not in use as these have been shown to weaken the security of Secure Boot significantly.[^1] However, this may brick some devices which use Microsoft-signed OpROMS for certain hardware during the boot process, particularly some laptops, so you must be certain before removing them. It may be impossible to fix if, for example, the GPU relies on these OpROMS.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## See Also

[Arch Wiki/Secure Boot](https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot) Extensive information on Secure Boot including using UKIs.

</div>

<references />

<a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>

[^1]: <https://habr.com/ru/articles/446238/>
