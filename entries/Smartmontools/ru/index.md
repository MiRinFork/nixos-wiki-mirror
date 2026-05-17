<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Smartmontools/ru -->

<languages/> **smartmontools** это пакет, который предоставляет инструменты для мониторинга дисков, поддерживающих систему <a href="wikipedia:Self-Monitoring,_Analysis_and_Reporting_Technology" class="wikilink" title="S.M.A.R.T.">S.M.A.R.T.</a> для мониторинга состояни жёсткого диска.

Он включает в себя программы **smartd** и **smartctl**. Smartd может быть включён на системах NixOS с помощью модуля .

<div lang="en" dir="ltr" class="mw-content-ltr">

## Locating devices

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It is important to use persistent methods of identification for disks, as device nodes are arbitrary and subject to change. The following command will print a list of storage devices, as well as partitions contained on them. When configuring smartd, you should use entries that are **not** suffixed with "-partX", as they refer to whole disks.

</div>

``` bash
ls /dev/disk/by-id/
```

<span id="Example"></span>

## Пример

<div class="mw-translate-fuzzy">

</div>
