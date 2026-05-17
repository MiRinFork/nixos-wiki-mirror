<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Secure Boot/ru -->

<languages/> Под безопасной загрузкой обычно подразумевается возможность встроенного программного обеспечения платформы проверять компоненты загрузки и гарантировать, что загрузится только ваша собственная операционная система.

Secure Boot имеет несколько реализаций, наиболее известная - UEFI Secure Boot, которая опирается на прошивку платформы UEFI, но во встраиваемых системах могут существовать и другие реализации.

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Checking Secure Boot status

The easiest way to check if your machine has Secure Boot enabled is through the use of <a href="Systemd" class="wikilink" title="Systemd">Systemd</a>'s `bootctl`. There is no need to be using <a href="Systemd/boot" class="wikilink" title="systemd-boot">systemd-boot</a> as your bootloader for this command to work.

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

The system above has secure boot enabled and enforced. Other values include `disabled (setup)` for Setup Mode, `disabled (disabled)` or `disabled (unsupported)`. The unsupported tag only appears if your device firmware does not support Secure Boot at all. If you see `disabled (disabled)`, this means you will need to enable Secure Boot in your UEFI firmware settings before proceeding to use one of the projects outlined below.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Enabling Secure Boot on NixOS

On NixOS, there are currently two main ways to enable Secure Boot, <a href="Lanzaboote" class="wikilink" title="Lanzaboote">Lanzaboote</a> and <a href="Limine" class="wikilink" title="Limine">Limine</a>. See their respective wiki pages for step by step instructions on each.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For Secure Boot to be most effective, there are certain conditions which should also be met. The most important are:

</div>

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
