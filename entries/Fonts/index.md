<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fonts -->

<languages/> <translate> NixOS handles fonts like it handles many different parts of the system: they are not in an environment unless explicitly marked to be part of it. This guide covers the installation, configuration and troubleshooting of fonts. </translate>

<translate>== Installing fonts on NixOS == </translate>

<translate> NixOS has many font packages available, and you can easily search for your favorites on the</translate> [NixOS packages site](https://search.nixos.org/packages).

<translate> Despite looking like normal packages, simply adding these font packages to your `environment.systemPackages` won't make the fonts accessible to applications. To achieve that, put these packages in the [`fonts.packages`](https://search.nixos.org/options?channel=unstable&show=fonts.packages&from=0&size=50&sort=relevance&type=packages&query=fonts.packages) NixOS options list instead.</translate>

*For example:*

<translate>=== Shorthands for fonts === </translate> <translate>

- `fonts.enableDefaultPackages`: when set to `true`, causes some "basic" fonts to be installed for reasonable Unicode coverage. Set to `true` if you are unsure about what languages you might end up reading.
- `fonts.enableGhostscriptFonts`: affects the `ghostscript` package. Ghostscript packages some URW fonts for the standard PostScript typefaces. If `true`, these fonts will be visible to GUI applications. You could set it to `true` if you want these fonts, but `gyre-fonts` (part of `fonts.enableDefaultPackages`) might be higher-quality depending on your judgement.

</translate>

<translate>=== Using fonts from TexLive === </translate> <translate> You can make use of all TeX/LaTeX fonts from CTAN and <a href="TexLive" class="wikilink" title="TexLive">TexLive</a> by passing the `fonts` attribute of your TexLive package to `fonts.package`:</translate>

<translate>=== Installing `nerdfonts` === </translate>

<translate> Individual Nerd Fonts can be installed like so: </translate>

<translate> The available Nerd Font subpackages can be listed by searching for on the <a href="Searching_packages" class="wikilink" title="NixOS Package Search">NixOS Package Search</a> or by running the following command:

``` console
$ nix-instantiate --eval --expr "with (import <nixpkgs> {}); lib.attrNames (lib.filterAttrs (_: lib.isDerivation) nerd-fonts)"
```

</translate>

<translate>

#### Installing all `nerdfonts`

</translate>

<translate> Installing all fonts from the [Nerd Fonts repository](https://www.nerdfonts.com/) is as simple as adding all of the individual packages to the NixOS configuration. The following line will do exactly that, by searching for all derivations under the `nerd-font` attribute: </translate>

<translate>=== Patching nerdfonts into fonts === </translate> <translate> Not all fonts have Nerd Fonts variants, thankfully you can easily patch them in yourself. </translate>

<translate>=== Let Fontconfig know the fonts within your Nix profile === </translate> <translate> Nix inserts its user profile path into `$XDG_DATA_DIRS`, which Fontconfig by default doesn't look in. This cause graphical applications like KDE Plasma not able to recognize the fonts installed via `nix-env` or `nix profile`. </translate>

<translate> To solve this, add the file `100-nix.conf` to your Fontconfig user configuration directory (usually `$XDG_CONFIG_HOME/fontconfig/conf.d`):

``` xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <!-- NIX_PROFILE is the path to your Nix profile. See Nix Reference Manual for details. -->
  <dir>NIX_PROFILE/lib/X11/fonts</dir>
  <dir>NIX_PROFILE/share/fonts</dir>
</fontconfig>
```

and run `fc-cache`. </translate>

<translate> Alternatively, [enable Fontconfig configuration](https://nix-community.github.io/home-manager/options.xhtml#opt-fonts.fontconfig.enable) in your Home Manager configuration. </translate>

<translate>=== Imperative installation of user fonts === </translate> <translate> This is useful for quick font experiments.</translate>

*Example*: Install `SourceCodePro-Regular`.

``` console
$ font=$(nix-build --no-out-link '<nixpkgs>' -A source-code-pro)/share/fonts/opentype/SourceCodePro-Regular.otf
$ cp $font ~/.local/share/fonts
$ fc-cache
$ # Verify that the font has been installed
$ fc-list -v | grep -i source
```

<translate>=== Install fonts in nix-shells === </translate>

<translate> `fonts` is not available as set-valued option in `mkshell` (gives you an error because it tries to coerce an attribute set into a string). Instead, insert the following:</translate>[^1]

<translate>

``` nix
{ pkgs ? import <nixpkgs> {} }:
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

Then `typst fonts` finds the installed fonts in the nix-shell. </translate>

<translate>== Configuring fonts == </translate>

<translate> The nixos key [`fonts.fontconfig`](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=fonts.fontconfig) (click to see the full list!) handles the fontconfig options. Some options are nicely wrapped in nix; there's always `localConf` to go straight to the XML. </translate>

<translate>=== Set multiple fonts for different languages === </translate> <translate> If you want to use other languages alongside English, you may want to set appropriate fonts for each language in your whole OS. For example, a Persian speaker might want to use the</translate> [Vazirmatn](https://rastikerdar.github.io/vazirmatn/) <translate> font for Persian texts, but</translate> [Ubuntu](https://design.ubuntu.com/font/) <translate> and Liberation Serif fonts for English texts. Just put these lines into your `configuration.nix`:

</translate>

<translate> NB:

- This actually just sets the font fallback order so that fontconfig tries using the English font first, then falls back to another font if the character set is not covered. You *usually* want to write the English font *before* the other-language font, because the other-language font might cover Latin characters too, preventing the English font from showing up.
- `defaultFonts` translates to `<prefer>` in the actual fontconfig file. See <https://github.com/NixOS/nixpkgs/blob/nixos-23.11/nixos/modules/config/fonts/fontconfig.nix> for how NixOS does it, and the links below for how fontconfig interpret it.
- Vazirmatn is actually a "sans-serif" font; using it for `serif` is not a good visual match. You might need not one, but two (or if you count monospace, three!) font packages for a language.

</translate>

<translate>=== Use custom font substitutions === </translate>

<translate> Sometimes, documents may appear to have bad kerning or hard-to-read letter spacing, due to a bad substitution. For example, Okular may show in the *Document Properties* dialog that it has substituted DejaVu Sans Mono (a sans-serif font) in place of "NewCenturySchlbk". `fc-match NewCenturySchlbk` would display similiar info. </translate>

<translate> Adding this to your `/etc/nixos/configuration.nix` should prompt it to use the more similar (and nicer) serif *Schola* font instead:

</translate>

<translate> For more information and examples on the xml configuration language: </translate>

- <https://www.mankier.com/5/fonts-conf>
- <https://wiki.archlinux.org/index.php/Font_configuration>
- <https://wiki.archlinux.org/index.php/Font_configuration/Examples>

<translate> For a list of suitable replacement fonts:</translate>

- <https://wiki.archlinux.org/title/Metric-compatible_fonts>

<translate>== Troubleshooting == </translate>

<translate>=== What font names can be used in `fonts.fontconfig.defaultFonts.monospace`? === </translate>

<translate> Those that fontconfig will understand. This can be queried from a font file using `fc-query`.</translate>

``` console
$ cd /nix/var/nix/profiles/system/sw/share/X11/fonts
$ fc-query DejaVuSans.ttf | grep '^\s\+family:' | cut -d'"' -f2
```

<translate> Note that you may need to set `fonts.fontDir.enable = true;` for that X11/fonts directory to exist. </translate>

<translate>=== Adding personal fonts to `~/.fonts` doesn't work === </translate>

<translate> The `~/.fonts` directory is being deprecated upstream[^2]. It already doesn't work in NixOS. </translate>

<translate> The new preferred location is in `$XDG_DATA_HOME/fonts`, which for most users will resolve to `~/.local/share/fonts`</translate>[^3]

<translate>=== Flatpak applications can't find system fonts === </translate>

<translate> To expose available fonts under `/run/current-system/sw/share/X11/fonts`, enable `fontDir` in your NixOS configuration.</translate>

<translate> You will then need to link/copy this folder to one of the Flatpak-supported locations - see below.</translate>

<translate>==== Solution 1: Copy fonts to `$HOME/.local/share/fonts` ==== </translate> <translate> Create fonts directory `$HOME/.local/share/fonts` and copy system fonts with option `-L, --dereference`. You will need to repeat this step whenever the fonts change.

``` console
$ mkdir $HOME/.local/share/fonts && cp -L /run/current-system/sw/share/X11/fonts/* $HOME/.local/share/fonts/
```

Note: There is no need to grant flatpak applications access to `$HOME/.local/share/fonts`. </translate>

<translate> Instead, if you do that, some applications (for example, steam) won't work.

> Internals: How it works?</translate>
>
> <translate> Flatpak applications run in sandboxes. When you start a flatpak application, flatpak builds a rootfs for it with bubblewrap.</translate>
>
> <translate> With `findmnt --task {PID of flatpak app}` , you can explore the details of its rootfs.</translate>
>
> <translate> By default, flatpak mounts `$HOME/.local/share/fonts` to `/run/host/user-fonts` in rootfs of an flatpak application.
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

</translate>

<translate>==== Solution 2: Symlink to system fonts at `$HOME/.local/share/fonts` ==== </translate> <translate>

> **Note:** this method doesn't work for some flatpak applications (for example, steam)! </translate>
>
> Error:
>
> ``` console
> $ flatpak run com.valvesoftware.Steam
> bwrap: Can't make symlink at /home/username/.local/share/fonts: File exists
> ```

Create a symlink in `XDG_DATA_HOME/fonts` pointing to `/run/current-system/sw/share/X11/fonts`, e. g.

``` console
$ mkdir $HOME/.local/share/fonts && ln -s /run/current-system/sw/share/X11/fonts ~/.local/share/fonts/
```

<translate> Now you have two options.</translate>

<translate>

##### Option 1: Allow access to the fonts folder and `/nix/store`

</translate> <translate> By using the Flatpak CLI or the Flatseal Flatpak make the following directory available to all Flatpaks `$HOME/.local/share/fonts` and `$HOME/.icons` the appropriate commands for this are: </translate>

``` console
$ flatpak --user override --filesystem=$HOME/.local/share/fonts:ro
$ flatpak --user override --filesystem=$HOME/.icons:ro
```

<translate> And, because `~/.local/share/fonts` is linked to `/run/current-system/sw/share/X11/fonts`, which in turn is linked to content in `/nix/store`. You need to grant flatpak applications access to the `/nix/store` directory, so that they can load fonts correctly. You may need to reboot for this to fully take effect.</translate>

``` console
$ flatpak --user override --filesystem=/nix/store:ro
$ flatpak --user override --filesystem=/run/current-system/sw/share/X11/fonts:ro
```

<translate>===== Option 2: Allow access to the WHOLE filesystem ===== </translate> <translate> Allow them access the WHOLE filesystem of yours: `All system files` in Flatseal or equivalently `filesystem=host` available to your application, the command for this is: </translate>

``` console
$ flatpak --user override --filesystem=host
```

<translate> It is important to keep in mind that some flatpak apps may refuse to launch if given certain permissions, such as the Steam flatpak. </translate>

<translate>==== Solution 3: Configure bindfs for fonts/cursors/icons support ==== </translate> <translate> Alternatively, you can expose relevant packages directly under `/usr/share/...` paths. This will also enable Flatpak to use a custom cursor theme if you have one. This solution doesn't require `fonts.fontDir.enable` to be enabled.

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

<!--T:69-->
nts.packages = with pkgs; [
  noto-fonts
  noto-fonts-color-emoji
  noto-fonts-cjk-sans
];
```

Note that font cache inside flatpak container may not be recreated after changes to fonts in `/usr/share/fonts`, because font cache seem to be relying on file timestamps that are missing in `/nix/store`. </translate>

<translate> You can make sure that font directory is bind-mounted properly inside flatpak container by running `flatpak enter `<instance>` findmnt | grep /run/host/fonts`, or by running `flatpak enter `<instance>` ls -alh /run/host/fonts` and compare it to `ls -alh /usr/share/fonts`. </translate>

<translate> If everything is mounted properly, but you still do not see fonts in flatpak app - force font cache recreation inside flatpak container: `flatpak run --command=fc-cache `<application id>` -f -v` </translate>

<translate>=== Noto Color Emoji doesn't render on Firefox === </translate>

<translate> Enable `useEmbeddedBitmaps` in your NixOS configuration.

``` nix
fonts.fontconfig.useEmbeddedBitmaps = true;
```

</translate>

<hr />

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Fonts" class="wikilink" title="Category:Fonts">Category:Fonts</a>

[^1]: <https://programming.dev/post/32484220>

[^2]: <https://lists.freedesktop.org/archives/fontconfig/2014-July/005269.html>

[^3]: <https://lists.freedesktop.org/archives/fontconfig/2014-July/005270.html>
