<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/System76/galp5/ru -->

<languages />

<div class="infobox">

<div lang="en" dir="ltr" class="mw-content-ltr">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>System76 Galago Pro</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>System76</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>x86_64-linux</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>galp5</p></td>
</tr>
<tr>
<td><p>Status</p></td>
<td><p>supported</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:Ahoneybun" class="wikilink" title="Ahoneybun">Ahoneybun</a></p></td>
</tr>
</tbody>
</table>

</div>

</div>

System76 Galago Pro - это Linux-ноутбук под управлением System76 Open Firmware (основанной на coreboot+EDK2) от System76. <span id="Status"></span>

## Состояние

Устройство загружает NixOS. <span id="Known_issues"></span>

## Известные проблемы

<span id="Configuration"></span>

## Настройка

### BIOS

За это отвечает пакет firmware-manager, который можно включить в конфигурации следующим образом:

### galp5

#### GTX 1650/1650 Ti

- Модуль NixOS Hardware при использовании <a href="Special:MyLanguage/Flakes" class="wikilink" title="Flakes">Flakes</a>: `nixos-hardware.nixosModules.system76-galp5-1650`
- Модуль NixOS Hardware при использовании каналов: <nixos-hardware/system76/galp5-1650>

<span id="Tech_Docs"></span>

### Техническая документация

Речь в документации идет о замене и обновлении таких компонентов, как оперативная память и диски. <https://tech-docs.system76.com/models/galp5/README.html>

<a href="Category:_Incomplete" class="wikilink" title="Category: Incomplete">Category: Incomplete</a>
