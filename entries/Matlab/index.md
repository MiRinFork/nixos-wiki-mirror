<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Matlab -->

MATLAB (an abbreviation of "matrix laboratory") is a proprietary multi-paradigm programming language and numeric computing environment developed by MathWorks.[1](https://en.wikipedia.org/wiki/MATLAB)

## Installation

Matlab due to it's installation method and licensing is really problematic to package into nixpkgs[2](https://github.com/NixOS/nixpkgs/issues/56887), that is why the only way to install it is to use some imperative way (to install it outside the nix store).

### (Recommended) Based on Doronbehar [3](https://gitlab.com/doronbehar/nix-matlab) repo (with or without flakes)

You may prefer to use [this method](https://gitlab.com/doronbehar/nix-matlab) by doronbehar. It is based on the one described below, but requires less work.

### Based on tviiti[4](https://github.com/tviti/nix-cfg/tree/aunuu/pkgs/matlab) repo or custom work (without flakes)

Firstly you need to download zipped Matlab archive for Linux from the official webpage. Then create a folder for the installation files and unzip the archive into that folder via `unzip -X -K` command.

Then you will need `shell.nix` file that will create proper FHS environment. This shell should use `buildFHSUserEnv` function and should contain all the relevant packages. Personally I have used tviti[5](https://github.com/tviti/nix-cfg/tree/aunuu/pkgs/matlab) imperative Matlab shell.

Get into the proper environment via `nix-shell`. Then you can safely start Matlab installer by running `./install` script in the Matlab installation folder. It is strongly preferred to install Matlab somewhere in the user home folder.

After successful installation, you should add Matlab do your `configuration.nix` file. Personally I have used modified tvitii[6](https://github.com/tviti/nix-cfg/tree/aunuu/pkgs/matlab) files. I have simply switched `runPath` to the path of freshly installed Matlab folder. Then in my configuration.nix I have used his matlab folder like so:

``` nix
...
let
    tviti-matlab = pkgs.callPackage ./matlab { };
...
in {
...
    environment.systemPackages = [ ... tviti-matlab.matlab  ... ];
...
```

Now you should have `matlab` in your path and be able to run it via `matlab` command.

#### Weird java errors

In case you have java errors, and you are using tvitii[7](https://github.com/tviti/nix-cfg/tree/master/pkgs/matlab) derivation, you may need to modify `matlab.nix` to something like this:

``` nix
{ common,  buildFHSUserEnv }:
buildFHSUserEnv {
  name = "matlab";

  targetPkgs = pkgs: with pkgs; common.targetPkgs pkgs;

  runScript = "${common.runPath}/bin/matlab";
}
```

### Other possible issues

#### I can't see anything

If you are using Window Manager and Matlab does not display anything, you will need to use `wmname` command (preferably when starting your session). Just run `wmname LG3D`, run Matlab again and the issue should be fixed.

#### No hardware support

There is a great answer about that here on Matlab answers[8](https://www.mathworks.com/matlabcentral/answers/241850-matlab-failing-to-find-hardware-opengl#answer_263092).

Summarizing this answer:

``` console
$ cd <your_matlab_location>/sys/os/glnxa64/
$ sudo mv libstdc++.so.6 libstdc++.so.6.bak
$ sudo ln -s /usr/lib64/libstdc++.so.6  libstdc++.so.6
```

You will not have `/usr/lib64/libstdc++.so.6` at the time of following the steps, but Matlab will be run in FHS env, and this path will be visible for it.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
