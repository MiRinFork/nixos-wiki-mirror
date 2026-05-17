<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ghidra -->

[Ghidra](https://www.nsa.gov/ghidra) is a software reverse engineering (SRE) framework created and maintained by the American [National Security Agency](https://en.wikipedia.org/wiki/National_Security_Agency) (NSA).

### Install Ghidra on NixOS

Ghidra can be installed from nixpkgs from source via the `ghidra` package or as a pre-packaged build using `ghidra-bin`.

There are a number of [extensions](https://github.com/NixOS/nixpkgs/tree/nixos-unstable/pkgs/tools/security/ghidra/extensions) already supported in nixpkgs. Note that extensions *cannot* be used with the `ghidra-bin` package. If you want to build Ghidra with some extensions included, you can use the following:

``` nix
      pkgs.ghidra.withExtensions (p: with p; [
        ret-sync
      ]);
```

### Ghidra overlays

Updating the `ghidra` package using an overlay is not as easy as most common packages in nixpkgs, due to it's use of [gradle](https://gradle.org/) and how gradle-based packages are built on nix.

First you will need to generate a new gradle dependency (`deps.json`) file. which will be be used to override the file specified in the `mitmCache` part of the `ghidra` derivation.

In order to generate `deps.json`, you will need to git clone a copy of [Nixpkgs](https://github.com/NixOS/nixpkgs/) if you don't already have one. Inside of the clone you need modify the `rev` field of the attribute set passed to `mkDerivation` in [`pkgs/tools/security/ghidra/build.nix`](https://github.com/NixOS/nixpkgs/blob/nixos-unstable/pkgs/tools/security/ghidra/build.nix) file, which used for building `ghidra`. The `rev` field should be set to whatever git commit you want to install.

Then from the root of your Nixpkgs folder run the command `$(nix-build -A ghidra.mitmCache.updateScript)`. This command execute an update script to fetch the gradle dependencies, and then stores the relevant information into `pkgs/tools/security/ghidra/deps.json`. Copy the generated file over to your nix configuration and reference it in your overlays. In the example overlay below, the `deps.json` file has been renamed to `ghidra-deps.json`.

``` nix
        (final: prev: {
          ghidra = prev.ghidra.overrideAttrs (oldAttrs: {
            mitmCache = prev.gradle.fetchDeps {
              inherit (oldAttrs) pname;
              data = ./ghidra-deps.json;
            };

            src = prev.fetchFromGitHub {
              owner = "NationalSecurityAgency";
              repo = "Ghidra";
              rev = "7d5a514f25fe5bea52a0465c26ae5663855f79c9";
              hash = "sha256-PN5J2Wrr8RUF1UljG57bfw2lhlEqnmWwtZy5xQcrNsE=";
              # populate values that require us to use git. By doing this in postFetch we
              # can delete .git afterwards and maintain better reproducibility of the src.
              leaveDotGit = true;
              postFetch = ''
                cd "$out"
                git rev-parse HEAD > $out/COMMIT
                # 1970-Jan-01
                date -u -d "@$(git log -1 --pretty=%ct)" "+%Y-%b-%d" > $out/SOURCE_DATE_EPOCH
                # 19700101
                date -u -d "@$(git log -1 --pretty=%ct)" "+%Y%m%d" > $out/SOURCE_DATE_EPOCH_SHORT
                find "$out" -name .git -print0 | xargs -0 rm -rf
              '';
            };
```

### Declarative preferences

Although not built-in directly to the `ghidra` package, it's possible to create a declarative Ghidra `preferences` file. This does have the caveat that by making the file read-only, Ghidra will not be able to update it with new settings at runtime.

The following is an example, using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, of how you might setup your Preferences file:

``` nix
{
  lib,
  pkgs,
  config,
  ...
}:
let
  ghidra_pkg = pkgs.ghidra.withExtensions (
    exts:
    builtins.attrValues {
      # inherit (exts) <plugin-name>;
    }
  );
  ghidra_dir = ".config/ghidra/${pkgs.ghidra.distroPrefix}";
in
{
  home = {
    packages = [ ghidra_pkg ];
    file = {
      "${ghidra_dir}/preferences".text = ''
        GhidraShowWhatsNew=false
        SHOW.HELP.NAVIGATION.AID=true
        SHOW_TIPS=false
        TIP_INDEX=0
        G_FILE_CHOOSER.ShowDotFiles=true
        USER_AGREEMENT=ACCEPT
        LastExtensionImportDirectory=${config.home.homeDirectory}/.config/ghidra/scripts/
        LastNewProjectDirectory=${config.home.homeDirectory}/.config/ghidra/repos/
        ViewedProjects=
        RecentProjects=
      '';
    };
  };
}
// (lib.optionalAttrs pkgs.stdenv.isLinux {
  systemd.user.tmpfiles.rules = [
    # https://www.man7.org/linux/man-pages/man5/tmpfiles.d.5.html
    "d %h/${ghidra_dir} 0700 - - -"
    "L+ %h/.config/ghidra/latest - - - - %h/${ghidra_dir}"
    "d %h/.config/ghidra/scripts 0700 - - -"
    "d %h/.config/ghidra/repos 0700 - - -"
  ];
})
```

### Building Ghidra on NixOS

Building Ghidra on NixOS can be a bit finicky because of the gradle setup. This is an example `shell.nix` file to setup a development shell:

``` nix
with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = [
    pkgs.jdk21
    pkgs.gradle
    pkgs.gcc
    pkgs.git
    pkgs.bison
    pkgs.flex
  ];

  shellHook = ''
    rm -rf /tmp/gradle &> /dev/null
    mkdir /tmp/gradle
    export GRADLE_USER_HOME="/tmp/gradle"
    echo "org.gradle.java.home=${pkgs.jdk21}/lib/openjdk" > /tmp/gradle/gradle.properties
  '';
}
```

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
