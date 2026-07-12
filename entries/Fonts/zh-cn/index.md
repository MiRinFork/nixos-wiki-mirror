<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fonts/zh-cn -->

<languages/> NixOS 处理字体就像处理系统中许多不同部分一样：除非明确标记为环境的一部分，否则它们不会出现在环境中。本指南涵盖字体的安装、配置和故障排除。

在 NixOS 上安装字体

NixOS 有许多可用的字体包，你可以轻松地在这里搜索并使用他们： [NixOS packages site](https://search.nixos.org/packages).

尽管这些字体包看起来与普通包无异，但仅将它们添加到 \`environment.systemPackages\` 并不会让应用程序能够访问这些字体。要实现这一点，应将它们放入 NixOS 的 \`[fonts.packages](https://search.nixos.org/options?channel=unstable&show=fonts.packages&from=0&size=50&sort=relevance&type=packages&query=fonts.packages)\` 选项列表中。

*For example:*

### 启用预置字体集合

- `fonts.enableDefaultPackages`：当设为 `true` 时，会安装一些“基础”字体以提供合理的 Unicode 覆盖范围。如果您不确定自己可能会阅读哪些语言，可将其设为 `true`。
- `fonts.enableGhostscriptFonts`：影响 `ghostscript` 包。Ghostscript 为标准的 PostScript 字型打包了一些 URW 字体。若设为 `true`，这些字体将对 GUI 应用程序可见。如果您需要这些字体，可以设为 `true`，但 `gyre-fonts`（属于 `fonts.enableDefaultPackages` 的一部分）根据您的判断可能质量更高。

### 使用来自 TexLive 的字体

您可以将 TexLive 包中的 \`fonts\` 属性传递给 \`fonts.packages\`，从而使用来自 CTAN 和 <a href="TexLive" class="wikilink" title="TexLive">TexLive</a> 的所有 TeX/LaTeX 字体：

### 安装 `Nerd Fonts`

单个Nerd Fonts可以像这样安装：

可用的 Nerd Fonts 子包可以通过在 <a href="Searching_packages" class="wikilink" title="NixOS Package Search">NixOS Package Search</a> 中搜索 来列出，或者运行以下命令：

``` console
$ nix-instantiate --eval --expr "with (import <nixpkgs> {}); lib.attrNames (lib.filterAttrs (_: lib.isDerivation) nerd-fonts)"
```

<span id="Installing_all_nerdfonts"></span>

#### 安装所有 `Nerd Fonts`

要安装来自 Nerd Fonts 仓库 的所有字体，只需将所有独立的包添加到 NixOS 配置中即可。以下代码行通过搜索 \`nerd-fonts\` 属性下的所有派生，精确实现这一目的：

### 将 nerdfonts 补丁应用到字体中

并非所有字体都有 Nerd Fonts 变体，但幸运的是，您可以轻松地自行打补丁。

### 让 Fontconfig 识别 Nix 配置文件中的字体

Nix 会将其用户配置文件路径插入到 `$XDG_DATA_DIRS` 中，而 Fontconfig 默认并不在此路径中查找。这会导致 KDE Plasma 等图形应用程序无法识别通过 `nix-env` 或 `nix profile` 安装的字体。

要解决此问题，请将 `100-nix.conf` 文件添加到 Fontconfig 用户配置目录中（通常为 `$XDG_CONFIG_HOME/fontconfig/conf.d`）：

``` xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <!-- NIX_PROFILE 是您的 Nix 配置文件的路径。详见 Nix 参考手册。 -->
  <dir>NIX_PROFILE/lib/X11/fonts</dir>
  <dir>NIX_PROFILE/share/fonts</dir>
</fontconfig>
```

然后运行 `fc-cache`。

或者，在您的 Home Manager 配置 `opt-fonts.fontconfig.enable` 中启用 Fontconfig 配置。

### 命令式安装用户字体

<span lang="en" dir="ltr" class="mw-content-ltr">This is useful for quick font experiments.</span>

*Example*: Install `SourceCodePro-Regular`.

``` bash
font=$(nix-build --no-out-link '<nixpkgs>' -A source-code-pro)/share/fonts/opentype/SourceCodePro-Regular.otf
cp $font ~/.local/share/fonts
fc-cache
# Verify that the font has been installed
fc-list -v | grep -i source
```

<span lang="en" dir="ltr" class="mw-content-ltr">=== Install fonts in nix-shells ===</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

`fonts` is not available as set-valued option in `mkshell` (gives you an error because it tries to coerce an attribute set into a string). Instead, insert the following:

</div>

[^1]

<div lang="en" dir="ltr" class="mw-content-ltr">

``` nix
{pkgs ? import <nixpkgs> {} }:
let
  fontsConf = pkgs.makeFontsConf {
    fontDirectories = [
      # your needed fonts here, e.g.:
      pkgs.font-awesome
      pkgs.atkinson-hyperlegible-next
    ];
  };
in
  pkgs.mkShell {
    packages = with pkgs; [
      # your font-dependent packages, e.g.:
      typst
    ];
    shellHook = ''
      export FONTCONFIG_FILE="${fontsConf}"
    '';
  }
```

Then `typst fonts` finds the installed fonts in the nix-shell.

</div>

## 配置字体

NixOS 的 [`fonts.fontconfig`](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=fonts.fontconfig) 配置项（点击查看完整列表！）用于处理 fontconfig 选项。部分选项已被 nix 很好地封装；此外始终可以使用 `localConf` 直接编写 XML 配置。

### 为不同语言设置多种字体

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to use other languages alongside English, you may want to set appropriate fonts for each language in your whole OS. For example, a Persian speaker might want to use the

</div>

[Vazirmatn](https://rastikerdar.github.io/vazirmatn/) <span lang="en" dir="ltr" class="mw-content-ltr">font for Persian texts, but</span> [Ubuntu](https://design.ubuntu.com/font/)

<div lang="en" dir="ltr" class="mw-content-ltr">

and Liberation Serif fonts for English texts. Just put these lines into your `configuration.nix`:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NB:

- This actually just sets the font fallback order so that fontconfig tries using the English font first, then falls back to another font if the character set is not covered. You *usually* want to write the English font *before* the other-language font, because the other-language font might cover Latin characters too, preventing the English font from showing up.
- `defaultFonts` translates to `<prefer>` in the actual fontconfig file. See <https://github.com/NixOS/nixpkgs/blob/nixos-23.11/nixos/modules/config/fonts/fontconfig.nix> for how NixOS does it, and the links below for how fontconfig interpret it.
- Vazirmatn is actually a "sans-serif" font; using it for `serif` is not a good visual match. You might need not one, but two (or if you count monospace, three!) font packages for a language.

</div>

### 使用自定义字体替换

有时，由于不恰当的替换，文档可能会出现字距不佳或字间距难以阅读的问题。 例如，Okular 可能在“文档属性”对话框中显示已将 DejaVu Sans Mono（一种无衬线字体）替换为 "NewCenturySchlbk"。运行 `fc-match NewCenturySchlbk` 会显示类似信息。

将此添加到您的 `/etc/nixos/configuration.nix` 中，应能促使其改用更相似（且更美观）的衬线字体 *Schola* 作为替代：

有关 XML 配置语言的更多信息和示例：

- <https://www.mankier.com/5/fonts-conf>
- <https://wiki.archlinux.org/index.php/Font_configuration>
- <https://wiki.archlinux.org/index.php/Font_configuration/Examples>

有关合适的替代字体列表：

- <https://wiki.archlinux.org/title/Metric-compatible_fonts>

## 故障排除

### 在 `fonts.fontconfig.defaultFonts.monospace` 中可以使用哪些字体名称？

<span lang="en" dir="ltr" class="mw-content-ltr">Those that fontconfig will understand. This can be queried from a font file using `fc-query`.</span>

``` console
$ cd /nix/var/nix/profiles/system/sw/share/X11/fonts
$ fc-query DejaVuSans.ttf | grep '^\s\+family:' | cut -d'"' -f2
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Note that you may need to set `fonts.fontDir.enable = true;` for that X11/fonts directory to exist.

</div>

<span lang="en" dir="ltr" class="mw-content-ltr">=== Adding personal fonts to `~/.fonts` doesn't work ===</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

The `~/.fonts` directory is being deprecated upstream[^2]. It already doesn't work in NixOS.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The new preferred location is in `$XDG_DATA_HOME/fonts`, which for most users will resolve to `~/.local/share/fonts`

</div>

[^3]

<span lang="en" dir="ltr" class="mw-content-ltr">=== Flatpak applications can't find system fonts ===</span>

<span lang="en" dir="ltr" class="mw-content-ltr">To expose available fonts under `/run/current-system/sw/share/X11/fonts`, enable `fontDir` in your NixOS configuration.</span>

<span lang="en" dir="ltr" class="mw-content-ltr">You will then need to link/copy this folder to one of the Flatpak-supported locations - see below.</span>

<span lang="en" dir="ltr" class="mw-content-ltr">==== Solution 1: Copy fonts to `$HOME/.local/share/fonts` ====</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

Create fonts directory `$HOME/.local/share/fonts` and copy system fonts with option `-L, --dereference`. You will need to repeat this step whenever the fonts change.

``` console
$ mkdir $HOME/.local/share/fonts && cp -L /run/current-system/sw/share/X11/fonts/* $HOME/.local/share/fonts/
```

Note: There is no need to grant flatpak applications access to `$HOME/.local/share/fonts`.

</div>

<span lang="en" dir="ltr" class="mw-content-ltr">Instead, if you do that, some applications (for example, steam) won't work.

> Internals: How it works?</span>
>
> <span lang="en" dir="ltr" class="mw-content-ltr">Flatpak applications run in sandboxes. When you start a flatpak application, flatpak builds a rootfs for it with bubblewrap.</span>
>
> <span lang="en" dir="ltr" class="mw-content-ltr">With `findmnt --task {PID of flatpak app}` , you can explore the details of its rootfs.</span>
>
> <div lang="en" dir="ltr" class="mw-content-ltr">
>
> By default, flatpak mounts `$HOME/.local/share/fonts` to `/run/host/user-fonts` in rootfs of an flatpak application.
>
> ``` json
> {
>   "target": "/run/host/user-fonts",
>   "source": "/dev/disk/by-uuid/b2e1e6b5-738b-410b-b736-6d5c3dbbe31f[/home/username/.local/share/fonts]",
>   "fstype": "ext4",
>   "options": "ro,nosuid,nodev,relatime"
> }
> ```
>
> Then flatpak application can read fonts from that to display contents correctly.

</div>

<span lang="en" dir="ltr" class="mw-content-ltr">==== Solution 2: Symlink to system fonts at `$HOME/.local/share/fonts` ====</span> <span lang="en" dir="ltr" class="mw-content-ltr">

> **Note:** this method doesn't work for some flatpak applications (for example, steam)!</span>
>
> Error:
>
> ``` console
> $ flatpak run com.valvesoftware.Steam
> bwrap: Can't make symlink at /home/username/.local/share/fonts: File exists
> ```

Create a symlink in `XDG_DATA_HOME/fonts` pointing to `/run/current-system/sw/share/X11/fonts`, e. g.

``` bash
mkdir $HOME/.local/share/fonts && ln -s /run/current-system/sw/share/X11/fonts ~/.local/share/fonts/
```

<span lang="en" dir="ltr" class="mw-content-ltr">Now you have two options.</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

##### Option 1: Allow access to the fonts folder and `/nix/store`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

By using the Flatpak CLI or the Flatseal Flatpak make the following directory available to all Flatpaks `$HOME/.local/share/fonts` and `$HOME/.icons` the appropriate commands for this are:

</div>

``` bash
flatpak --user override --filesystem=$HOME/.local/share/fonts:ro
flatpak --user override --filesystem=$HOME/.icons:ro
```

<span lang="en" dir="ltr" class="mw-content-ltr">And, because `~/.local/share/fonts` is linked to `/run/current-system/sw/share/X11/fonts`, which in turn is linked to content in `/nix/store`. You need to grant flatpak applications access to the `/nix/store` directory, so that they can load fonts correctly. You may need to reboot for this to fully take effect.</span>

``` bash
flatpak --user override --filesystem=/nix/store:ro
flatpak --user override --filesystem=/run/current-system/sw/share/X11/fonts:ro
```

<span lang="en" dir="ltr" class="mw-content-ltr">===== Option 2: Allow access to the WHOLE filesystem =====</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

Allow them access the WHOLE filesystem of yours: `All system files` in Flatseal or equivalently `filesystem=host` available to your application, the command for this is:

</div>

``` bash
flatpak --user override --filesystem=host
```

<div lang="en" dir="ltr" class="mw-content-ltr">

It is important to keep in mind that some flatpak apps may refuse to launch if given certain permissions, such as the Steam flatpak.

</div>

<span lang="en" dir="ltr" class="mw-content-ltr">==== Solution 3: Configure bindfs for fonts/cursors/icons support ====</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

Alternatively, you can expose relevant packages directly under `/usr/share/...` paths. This will also enable Flatpak to use a custom cursor theme if you have one. This solution doesn't require `fonts.fontDir.enable` to be enabled.

``` nix
  system.fsPackages = [ pkgs.bindfs ];
  fileSystems = let
    mkRoSymBind = path: {
      device = path;
      fsType = "fuse.bindfs";
      options = [ "ro" "resolve-symlinks" "x-gvfs-hide" ];
    };
    fontsPkgs = config.fonts.packages ++ (with pkgs; [
        # Add your cursor themes and icon packages here
        bibata-cursors
        gnome-themes-extra
        # etc.
      ]);
    x11Fonts = pkgs.runCommand "X11-fonts"
      {
        preferLocalBuild = true;
        nativeBuildInputs = with pkgs; [
          gzip
          mkfontdir
        ];
      }
      (''
        mkdir -p "$out/share/fonts"
        font_regexp='.*\.\(ttf\|ttc\|otb\|otf\|pcf\|pfa\|pfb\|bdf\)\(\.gz\)?'
      ''
      + (builtins.concatStringsSep "\n" (builtins.map (pkg: ''
          find ${toString pkg} -regex "$font_regexp" \
            -exec ln -sf -t "$out/share/fonts" '{}' \;
        '') fontsPkgs
        ))
      + ''
        cd "$out/share/fonts"
        mkfontscale
        mkfontdir
        cat $(find ${pkgs.font-alias}/ -name fonts.alias) >fonts.alias
      '');
    aggregatedIcons = pkgs.buildEnv {
      name = "system-icons";
      paths = fontsPkgs;
      pathsToLink = [
        "/share/icons"
      ];
    };
  in {
    "/usr/share/icons" = mkRoSymBind (aggregatedIcons + "/share/icons");
    "/usr/share/fonts" = mkRoSymBind (x11Fonts + "/share/fonts");
  };
</div>

  <div lang="en" dir="ltr" class="mw-content-ltr">
fonts.packages = with pkgs; [
    noto-fonts
    noto-fonts-color-emoji
    noto-fonts-cjk-sans
  ];
```

Note that font cache inside flatpak container may not be recreated after changes to fonts in `/usr/share/fonts`, because font cache seem to be relying on file timestamps that are missing in `/nix/store`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can make sure that font directory is bind-mounted properly inside flatpak container by running `flatpak enter `<instance>` findmnt | grep /run/host/fonts`, or by running `flatpak enter `<instance>` ls -alh /run/host/fonts` and compare it to `ls -alh /usr/share/fonts`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If everything is mounted properly, but you still do not see fonts in flatpak app - force font cache recreation inside flatpak container: `flatpak run --command=fc-cache `<application id>` -f -v`

</div>

<span lang="en" dir="ltr" class="mw-content-ltr">=== Noto Color Emoji doesn't render on Firefox ===</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

Enable `useEmbeddedBitmaps` in your NixOS configuration.

``` nix
fonts.fontconfig.useEmbeddedBitmaps = true;
```

</div>

<hr />

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Fonts" class="wikilink" title="Category:Fonts">Category:Fonts</a>

[^1]: <https://programming.dev/post/32484220>

[^2]: <https://lists.freedesktop.org/archives/fontconfig/2014-July/005269.html>

[^3]: <https://lists.freedesktop.org/archives/fontconfig/2014-July/005270.html>
