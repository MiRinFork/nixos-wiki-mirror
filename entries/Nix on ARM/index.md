<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix on ARM -->

This wiki section concerns the Nix package manager tool only. Information about ARM based NixOS systems can be found here: <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>

Both aarch64 and armv7l are tested and working. Though, aarch64 is the only ARM architecture which is officially supported and has binary packages available from the official NixOS cache. Therefore it is highly recommended to use the aarch64 version of Nix if your platform and OS support it. For example on Raspberry OS, aarch64 support [can be enabled easily](https://www.raspberrypi.org/forums/viewtopic.php?t=250730).

## aarch64

Since aarch64 is officially supported, Nix can be installed the official way `curl -L `[`https://nixos.org/nix/install`](https://nixos.org/nix/install)` | sh` For more information see: [Getting Nix](https://nixos.org/download.html)

## armv7l

A prebuilt nix installer for armv7l, including instruction on how to build it yourself using docker, can be found here: [github.com/DavHau/nix-on-armv7l](https://github.com/DavHau/nix-on-armv7l)

For some more information on, for example, community maintained binary caches, check also: <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>

In case this helps anyone - by modifying Nix's \`release.nix\` you can make your own ARMv7 installer. (This is outdated and doesn't work anymore. At least not without additional modifications)

``` nix
{ nix ? builtins.fetchGit ./.
, nixpkgs ? <nixpkgs> #builtins.fetchGit { url = https://github.com/NixOS/nixpkgs.git; ref = "nixos-18.03"; }
, officialRelease ? false
, systems ? [ "armv7l-linux" ]
}:

let

  pkgs = import nixpkgs { system = builtins.currentSystem or "x86_64-linux"; };

  jobs = rec {


    tarball =
      with pkgs;

      with import ./release-common.nix { inherit pkgs; };

      releaseTools.sourceTarball {
        name = "nix-tarball";
        version = builtins.readFile ./.version;
        versionSuffix = if officialRelease then "" else "pre${toString nix.revCount}_${nix.shortRev}";
        src = nix;
        inherit officialRelease;

        buildInputs = tarballDeps ++ buildDeps ++ propagatedDeps;

        configureFlags = "--enable-gc";

        postUnpack = ''
          (cd source && find . -type f) | cut -c3- > source/.dist-files
          cat source/.dist-files
        '';

        preConfigure = ''
          (cd perl ; autoreconf --install --force --verbose)
          # TeX needs a writable font cache.
          export VARTEXFONTS=$TMPDIR/texfonts
        '';

        distPhase =
          ''
            runHook preDist
            make dist
            mkdir -p $out/tarballs
            cp *.tar.* $out/tarballs
          '';

        preDist = ''
          make install docdir=$out/share/doc/nix makefiles=doc/manual/local.mk
          echo "doc manual $out/share/doc/nix/manual" >> $out/nix-support/hydra-build-products
        '';
      };


    build = pkgs.lib.genAttrs systems (system:

      let pkgs = import nixpkgs { inherit system; }; in

      with pkgs;

      with import ./release-common.nix { inherit pkgs; };

      releaseTools.nixBuild {
        name = "nix";
        src = tarball;

        buildInputs = buildDeps;
        propagatedBuildInputs = propagatedDeps;

        configureFlags = configureFlags ++
          [ "--sysconfdir=/etc" ];

        enableParallelBuilding = true;

        makeFlags = "profiledir=$(out)/etc/profile.d";

        preBuild = "unset NIX_INDENT_MAKE";

        installFlags = "sysconfdir=$(out)/etc";

        doInstallCheck = true;
        installCheckFlags = "sysconfdir=$(out)/etc";
      });


    perlBindings = pkgs.lib.genAttrs systems (system:

      let pkgs = import nixpkgs { inherit system; }; in with pkgs;

      releaseTools.nixBuild {
        name = "nix-perl";
        src = tarball;

        buildInputs =
          [ jobs.build.${system} curl bzip2 xz pkg-config pkgs.perl boost ]
          ++ lib.optional (stdenv.isLinux || stdenv.isDarwin) libsodium;

        configureFlags = ''
          --with-dbi=${perlPackages.DBI}/${pkgs.perl.libPrefix}
          --with-dbd-sqlite=${perlPackages.DBDSQLite}/${pkgs.perl.libPrefix}
        '';

        enableParallelBuilding = true;

        postUnpack = "sourceRoot=$sourceRoot/perl";

        preBuild = "unset NIX_INDENT_MAKE";
      });


    binaryTarball = pkgs.lib.genAttrs systems (system:

      with import nixpkgs { inherit system; };

      let
        toplevel = builtins.getAttr system jobs.build;
        version = toplevel.src.version;
        installerClosureInfo = closureInfo { rootPaths = [ toplevel cacert ]; };
      in

      runCommand "nix-binary-tarball-${version}"
        { nativeBuildInputs = lib.optional (system != "armv7l-linux") shellcheck;
          meta.description = "Distribution-independent Nix bootstrap binaries for ${system}";
        }
        ''
          cp ${installerClosureInfo}/registration $TMPDIR/reginfo
          substitute ${./scripts/install-nix-from-closure.sh} $TMPDIR/install \
            --subst-var-by nix ${toplevel} \
            --subst-var-by cacert ${cacert}

          substitute ${./scripts/install-darwin-multi-user.sh} $TMPDIR/install-darwin-multi-user.sh \
            --subst-var-by nix ${toplevel} \
            --subst-var-by cacert ${cacert}
          substitute ${./scripts/install-systemd-multi-user.sh} $TMPDIR/install-systemd-multi-user.sh \
            --subst-var-by nix ${toplevel} \
            --subst-var-by cacert ${cacert}
          substitute ${./scripts/install-multi-user.sh} $TMPDIR/install-multi-user \
            --subst-var-by nix ${toplevel} \
            --subst-var-by cacert ${cacert}

          if type -p shellcheck; then
            # SC1090: Don't worry about not being able to find
            #         $nix/etc/profile.d/nix.sh
            shellcheck --exclude SC1090 $TMPDIR/install
            shellcheck $TMPDIR/install-darwin-multi-user.sh
            shellcheck $TMPDIR/install-systemd-multi-user.sh

            # SC1091: Don't panic about not being able to source
            #         /etc/profile
            # SC2002: Ignore "useless cat" "error", when loading
            #         .reginfo, as the cat is a much cleaner
            #         implementation, even though it is "useless"
            # SC2116: Allow ROOT_HOME=$(echo ~root) for resolving
            #         root's home directory
            shellcheck --external-sources \
              --exclude SC1091,SC2002,SC2116 $TMPDIR/install-multi-user
          fi

          chmod +x $TMPDIR/install
          chmod +x $TMPDIR/install-darwin-multi-user.sh
          chmod +x $TMPDIR/install-systemd-multi-user.sh
          chmod +x $TMPDIR/install-multi-user
          dir=nix-${version}-${system}
          fn=$out/$dir.tar.bz2
          mkdir -p $out/nix-support
          echo "file binary-dist $fn" >> $out/nix-support/hydra-build-products
          tar cvfj $fn \
            --owner=0 --group=0 --mode=u+rw,uga+r \
            --absolute-names \
            --hard-dereference \
            --transform "s,$TMPDIR/install,$dir/install," \
            --transform "s,$TMPDIR/reginfo,$dir/.reginfo," \
            --transform "s,$NIX_STORE,$dir/store,S" \
            $TMPDIR/install $TMPDIR/install-darwin-multi-user.sh \
            $TMPDIR/install-systemd-multi-user.sh \
            $TMPDIR/install-multi-user $TMPDIR/reginfo \
            $(cat ${installerClosureInfo}/store-paths)
        '');


    coverage =
      with pkgs;

      with import ./release-common.nix { inherit pkgs; };

      releaseTools.coverageAnalysis {
        name = "nix-build";
        src = tarball;

        buildInputs = buildDeps;
        propagatedBuildInputs = propagatedDeps;

        configureFlags = ''
          --disable-init-state
        '';

        dontInstall = false;

        doInstallCheck = true;

        lcovFilter = [ "*/boost/*" "*-tab.*" "*/nlohmann/*" "*/linenoise/*" ];

        # We call `dot', and even though we just use it to
        # syntax-check generated dot files, it still requires some
        # fonts.  So provide those.
        FONTCONFIG_FILE = texFunctions.fontsConf;
      };

    # Aggregate job containing the release-critical jobs.
    release = pkgs.releaseTools.aggregate {
      name = "nix-${tarball.version}";
      meta.description = "Release-critical builds";
      constituents =
        [ tarball
          build.armv7l-linux
        ];
    };

  };

in jobs
```

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
