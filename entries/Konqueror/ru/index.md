<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Konqueror/ru -->

<languages/> Konqueror - это приложение файлового менеджера, предустановленное в окружениях рабочего стола KDE/Plasma.

## Запуск без KDE

Поскольку NixOS позволяет запускать отдельные приложения KDE без запуска менеджера рабочего стола KDE Plasma, можно легко установить Konqueror в качестве файлового менеджера; но (начиная с NixOS Stable 22.11) он не будет показывать миниатюры (которые он называет "значками предварительного просмотра").

Исправление (опять же, по состоянию на NixOS Stable 22.11), похоже, заключается в установке этих пакетов в environment.systemPackages, в дополнение к libsForQt5.konqueror:

- ffmpegthumbnailer
- libsForQt5.kdegraphics-thumbnailers
- libsForQt5.ffmpegthumbs
- libsForQt5.kio-extras

<div class="mw-translate-fuzzy">

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
