<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Audio production -->

[Musnix](https://github.com/musnix/musnix) provides a set of simple, high-level configuration options for doing real-time audio work in NixOS, including optimizing the kernel, applying the CONFIG_PREEMPT_RT patch to it, and adjusting various low-level system settings, eg. setting up ulimit values automatically.

## Plugins not found

Due to NixOS not using FHS paths, many DAWs will not know where to look for VSTs and other plugins. Musnix fixes this; if you don't want to use it, you can solve this by setting

``` nix
environment.variables = let
      makePluginPath = format:
        (lib.makeSearchPath format [
          "$HOME/.nix-profile/lib"
          "/run/current-system/sw/lib"
          "/etc/profiles/per-user/$USER/lib"
        ])
        + ":$HOME/.${format}";
    in {
      DSSI_PATH   = makePluginPath "dssi";
      LADSPA_PATH = makePluginPath "ladspa";
      LV2_PATH    = makePluginPath "lv2";
      LXVST_PATH  = makePluginPath "lxvst";
      VST_PATH    = makePluginPath "vst";
      VST3_PATH   = makePluginPath "vst3";
      CLAP_PATH   = makePluginPath "clap";
    };
```

Some programs may not support those and may require other means of setting VST paths.

## Packaging plugins

Source-available plugins can be packaged like any other library; note that the files should be in a subdirectory according to the plugin type e.g. `$out/lib/vst3`.

If the plugin is only available as a binary, you may need to use <a href="Packaging/Binaries" class="wikilink" title="the advice on packaging binaries">the advice on packaging binaries</a> to help. Since many plugins will not be accessible via the standard fetchers, you can always fall back on including the plugin using `src = ./plugin.zip`; note that if you're using flakes and don't want to commit the plugin to Git (an especially bad idea if your config is public!), you can use requireFile and manually add files to the store. To do this, run `nix-hash --flat --type sha256 plugin.zip`, take the output, and use it in a derivation like so:

``` nix
      src = requireFile {
        message = "run nix-store add-file";
        name = "plugin.zip";
        sha256 =
          "68f3c7e845f3d7a5b44a83adeb6e34ef221503df00e7964f7d5a1f132a252d13";
      };
```

Then run `nix-store add-file plugin.zip`.

As an example, a working package for Vital looks like

``` nix
stdenv.mkDerivation rec {
  pname = "vital";
  version = "1.5.5";
  src = requireFile {
    message = "run nix-store add-file VitalInstaller.zip";
    name = "VitalInstaller.zip";
    # this may be different for you!
    sha256 =
      "68f3c7e845f3d7a5b44a83adeb6e34ef221503df00e7964f7d5a1f132a252d13";
  };
  nativeBuildInputs = [ makeWrapper unzip ];
  buildInputs = [
    alsa-lib
    freetype
    libglvnd
    stdenv.cc.cc.lib
    xorg.libICE
    xorg.libSM
    xorg.libX11
    xorg.libXext
  ];

  unpackPhase = ''
    unzip $src
  '';

  installPhase = ''
    mkdir -p $out
    cp -r VitalInstaller/lib $out/lib 
  '';
  postFixup = ''
    for file in \
      $out/lib/clap/Vital.clap \
      $out/lib/vst/Vital.so \
      $out/lib/vst3/Vital.vst3/Contents/x86_64-linux/Vital.so
    do
      patchelf --set-rpath "${lib.makeLibraryPath buildInputs}" $file
    done
  '';
};
```

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
