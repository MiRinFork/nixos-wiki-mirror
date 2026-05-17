<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PICO-8 -->

PICO-8 is a "fantasy console", allowing for easy game creation on heavily limited specifications.

The editor is only available commercially and distributed as a binary, the following nix-shell script allows you to run it:

``` nix
{ pkgs ? import <nixpkgs> {} }:
let fhs = pkgs.buildFHSUserEnv {
  name = "pico8";
  targetPkgs = pkgs: (with pkgs; [
    xorg.libX11
    xorg.libXext
    xorg.libXcursor
    xorg.libXinerama
    xorg.libXi
    xorg.libXrandr
    xorg.libXScrnSaver
    xorg.libXxf86vm
    xorg.libxcb
    xorg.libXrender
    xorg.libXfixes
    xorg.libXau
    xorg.libXdmcp
    alsa-lib
    udev
  ]);
  runScript = "bash -c ./pico8";
};
in pkgs.stdenv.mkDerivation {
  name = "pico8-shell";
  nativeBuildInputs = [ fhs ];
  shellHook = ''
     exec pico8
    '';
}
```
