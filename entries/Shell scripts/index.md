<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Shell scripts -->

the package `writeShellScript` can be used to add shell scripts to nix expressions

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

``` nix
# default.nix
{
  outputTxtDrv = stdenv.mkDerivation rec {
    name = "output.txt";
    # disable unpackPhase etc
    phases = "buildPhase";
    builder = ./builder.sh;
    nativeBuildInputs = [ coreutils jq ];
    PATH = lib.makeBinPath nativeBuildInputs;
    # only strings can be passed to builder
    someString = "hello";
    someNumber = builtins.toString 42;
    someJson = builtins.toJSON { dst = "world"; };
  };
}
```

``` bash
# builder.sh
echo "$someString $(echo "$someJson" | jq -r '.dst') $someNumber" >$out
```

See also

- [make a derivation with no source](https://github.com/NixOS/nixpkgs/issues/23099)
- [Nix Pills: Chapter 7. Working Derivation](https://nixos.org/guides/nix-pills/working-derivation.html)

### runCommand + builder.sh

Instead of `stdenv.mkDerivation`, we can also use `runCommand` to call an external bash script:

``` nix
# default.nix
{
  outputTxtDrv = runCommand "output.txt" {
    nativeBuildInputs = [ coreutils jq ];
    # only strings can be passed to builder
    someString = "hello";
    someNumber = builtins.toString 42;
    someJson = builtins.toJSON { dst = "world"; };
  } (builtins.readFile ./builder.sh);
}
```

## Packaging

example:

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

for example, the script throws the error `svn: command not found`, because the dependency `subversion` is missing.

when a command is missing, you can use `nix-locate` to find the package name. for example, the `stat` command:

``` console
$ nix-locate bin/stat | grep 'bin/stat$'
coreutils.out                                         0 s /nix/store/vr96j3cxj75xsczl8pzrgsv1k57hcxyp-coreutils-8.31/bin/stat
```

## Debugging embedded scripts

When a bash script fails, it prints only an error message, but no code location.

To trace commands and line numbers, we can use

``` nix
# test-trace.nix
{ runCommand, coreutils }:
  runCommand "output.txt" {
    nativeBuildInputs = [ coreutils ];
  } ''
    # line 5 in nix file = line 1 in bash script -> offset 4
    PS4='+ Line $(expr $LINENO + 4): '
    set -o xtrace # print commands

    echo hello >$out # line 9 in nix file

    set +o xtrace # hide commands
  ''
```

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

some environments (like OpenWRT, via `busybox`) offer only a "limited" shell (`sh` instead of `bash`).

on nixos, posix shells are provided by the packages `dash` and `posh`

## See also

- <a href="Nix-shell_shebang" class="wikilink" title="Nix-shell shebang">Nix-shell shebang</a>
- [Shell functions section in the Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-functions)
- [nix-shell and Shebang Lines](https://gist.github.com/travisbhartwell/f972aab227306edfcfea)
- [Shell Scripts with Nix](https://ertt.ca/nix/shell-scripts/)

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
