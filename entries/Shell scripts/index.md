<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Shell scripts -->

The package `writeShellScript` can be used to add shell scripts to nix expressions

``` nix
someBuildHelper = { name, sha256 }:
  stdenv.mkDerivation {
    inherit name;
    outputHashMode = "recursive";
    outputHashAlgo = "sha256";
    outputHash = sha256;
    builder = writeShellScript "builder.sh" ''
      echo "hi, my name is ''${0}" # escape bash variable
      echo "hi, my hash is ${sha256}" # use nix variable
      echo "hello world" >output.txt
    '';
  };
```

## External builder.sh script

Longer bash scripts are usually stored as external script files, and called from Nix:

See also

- [make a derivation with no source](https://github.com/NixOS/nixpkgs/issues/23099)
- [Nix Pills: Chapter 7. Working Derivation](https://nixos.org/guides/nix-pills/working-derivation.html)

### runCommand + builder.sh

Instead of `stdenv.mkDerivation`, we can also use `runCommand` to call an external bash script:

## Packaging

Example:

``` nix
# nix-build -E 'with import <nixpkgs> { }; callPackage ./default.nix { }'

{ stdenv
, lib
, fetchFromGitHub
, bash
, subversion
, makeWrapper
}:
  stdenv.mkDerivation {
    pname = "github-downloader";
    version = "08049f6";
    src = fetchFromGitHub {
      # https://github.com/Decad/github-downloader
      owner = "Decad";
      repo = "github-downloader";
      rev = "08049f6183e559a9a97b1d144c070a36118cca97";
      sha256 = "073jkky5svrb7hmbx3ycgzpb37hdap7nd9i0id5b5yxlcnf7930r";
    };
    buildInputs = [ bash subversion ];
    nativeBuildInputs = [ makeWrapper ];
    installPhase = ''
      mkdir -p $out/bin
      cp github-downloader.sh $out/bin/github-downloader.sh
      wrapProgram $out/bin/github-downloader.sh \
        --prefix PATH : ${lib.makeBinPath [ bash subversion ]}
    '';
  }
```

`wrapProgram` will move the original script to `.github-downloader.sh-wrapped`

### Command not found

For example, the script throws the error `svn: command not found`, because the dependency `subversion` is missing.

When a command is missing, you can use `nix-locate` to find the package name. for example, the `stat` command:

``` console
$ nix-locate bin/stat | grep 'bin/stat$'
coreutils.out       0 s /nix/store/vr96j3cxj75xsczl8pzrgsv1k57hcxyp-coreutils-8.31/bin/stat
```

## Debugging embedded scripts

When a bash script fails, it prints only an error message, but no code location.

To trace commands and line numbers, we can use

``` console
$ nix-build -E 'with import <nixpkgs> { }; callPackage ./test-trace.nix { }'
this derivation will be built:
  /nix/store/2v5biwny8plpyk2bv6cfr41ppp0a1i4k-output.txt.drv
building '/nix/store/2v5biwny8plpyk2bv6cfr41ppp0a1i4k-output.txt.drv'...
++ Line 9: echo hello
++ Line 11: set +o xtrace
/nix/store/ppidmnpd5m762x9kqj8jd3g7df7dknrz-output.txt
```

## Posix Shell

Some environments (like OpenWRT, via `busybox`) offer only a "limited" shell (`sh` instead of `bash`).

On NixOS, posix shells are provided by the packages `dash` and `posh`.

## See also

- <a href="Nix-shell_shebang" class="wikilink" title="Nix-shell shebang">Nix-shell shebang</a>
- [Shell functions section in the Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-functions)
- [nix-shell and Shebang Lines](https://gist.github.com/travisbhartwell/f972aab227306edfcfea)
- [Shell Scripts with Nix](https://ertt.ca/nix/shell-scripts/)

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
