<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plymouth/zh -->

<languages/> <span lang="zh" dir="ltr">[Plymouth](https://www.freedesktop.org/wiki/Software/Plymouth) 是一个在启动过程早期运行的应用程序，提供图形启动动画，被大多数面向桌面的 Linux 发行版所使用。</span>

<span id="Usage"></span>

## <span lang="zh" dir="ltr">用法</span>

<span lang="zh" dir="ltr">例如，您可以通过以下代码使用 [adi1090x's collection](https://github.com/adi1090x/plymouth-themes) 中的启动动画：</span>

<span lang="en" dir="ltr">在图形的启动过程中，可以用退出键（或者说 ESC）来切换在文本模式和 Playmouth 界面中切换。

<div lang="en" dir="ltr" class="mw-content-ltr">

If you are using LUKS encryption and the password prompt falls back to text mode, it may help to switch to initrd-systemd mode:

</div>

</span lang="en" dir="ltr">

``` nix
boot.initrd.systemd.enable = true;
```

<span lang="en" dir="ltr"><span lang="en" dir="ltr" class="mw-content-ltr">While the default `bgrt` theme supports graphical password entry, this may not be supported by all themes.</span></span lang="en" dir="ltr">

<a href="Category:Booting{{#translation:}}" class="wikilink" title="Category:Booting{{#translation:}}">Category:Booting{{#translation:}}</a>
