<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Visual Studio Code/en -->

**Visual Studio Code** is a cross-platform text editor developed by Microsoft, built on the Electron framework.

For the free distribution of the VS Code codebase (without MS branding, telemetry, and [extension marketplace](https://marketplace.visualstudio.com/) replaced by [Open VSX](https://open-vsx.org/)) see <a href="VSCodium" class="wikilink" title="VSCodium">VSCodium</a>.

## Installation

### NixOS

``` nix
environment.systemPackages = with pkgs; [ vscode ];
```

Extensions can be managed using :

``` nix
environment.systemPackages = with pkgs; [
  (vscode-with-extensions.override {
    vscodeExtensions = with vscode-extensions; [
      jnoortheen.nix-ide
      ms-python.python
      ms-azuretools.vscode-docker
      ms-vscode-remote.remote-ssh
    ] ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
      {
        name = "remote-ssh-edit";
        publisher = "ms-vscode-remote";
        version = "0.47.2";
        sha256 = "1hp6gjh4xp2m1xlm1jsdzxw9d8frkiidhph6nvl24d0h8z34w49g";
      }
    ];
  })
];
```

Some examples here: \[<https://github.com/search?type=code&q=language:Nix+&#x22;extensionFromVscodeMarketplace%22>; GitHub Search - type:code language:Nix "extensionFromVscodeMarketplace"\]

`extensionsFromVscodeMarketplace` is a manual way to fetch extensions. However, to keep updated from upstream, [nix-community/nix-vscode-extensions](https://github.com/nix-community/nix-vscode-extensions) provides the Nix expressions for the majority of available extensions from Open VSX and VSCode Marketplace. A GitHub Action updates the extensions daily. Similarly, [nix-community/nix4vscode](https://github.com/nix-community/nix4vscode) provides a Nix overlay for VSCode Marketplace and Open VSX extensions.

### Home Manager

``` nix
programs.vscode = {
  enable = true;
  profiles.default.extensions = with pkgs.vscode-extensions; [
    dracula-theme.theme-dracula
    vscodevim.vim
    yzhang.markdown-all-in-one
  ];
};
```

- See for more options: [Home Manager Manual: Options - programs.vscode](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.vscode.enable)
- Search for extensions with configurations: [NixOS Search: vscode-extensions](https://search.nixos.org/packages?type=packages&query=vscode-extensions)

### Nix-env

``` console
nix-env -iA nixos.vscode
```

## Use VS Code extensions without additional configuration

With , the editor launches inside a <a href="wikipedia:Filesystem_Hierarchy_Standard" class="wikilink" title="FHS">FHS</a> compliant chroot environment using . This reintroduces directories such as `/bin`, `/lib`, and `/usr`, which allows for extensions which ship pre-compiled binaries to work with little to no additional nixification.

### NixOS

``` nix
environment.systemPackages = with pkgs; [ vscode.fhs ];
```

### Home Manager

``` nix
programs.vscode = {
  enable = true;
  package = pkgs.vscode.fhs;
};
```

Adding extension-specific dependencies, these will be added to the FHS environment:

``` nix
# needed for rust lang server and rust-analyzer extension
programs.vscode.package = pkgs.vscode.fhsWithPackages (
  ps: with ps; [
    rustup
    zlib
    openssl.dev
    pkg-config
  ]
);
```

## Insiders Build

If you need to test a recent code change, you can run the insiders build. It is designed to run alongside the main build, with a separate `code-insiders` command and a different config path, so you can leave your main VS Code instance installed/running.

The following derivation builds a package with the latest insiders build (on NixOS in `environment.systemPackages`, or on Home Manager in `home.packages`) :

``` nix
(pkgs.vscode.override { isInsiders = true; }).overrideAttrs (oldAttrs: rec {
  src = (builtins.fetchTarball {
    url = "https://code.visualstudio.com/sha/download?build=insider&os=linux-x64";
    sha256 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  });
  version = "latest";

  buildInputs = oldAttrs.buildInputs ++ [ pkgs.krb5 ];
});
```

*[credits: @jnoortheen](https://discourse.nixos.org/t/how-to-install-latest-vscode-insiders/7895/4)*

### Updating insiders placeholder `sha256`

You will need to update the placeholder `sha256` value for each new Insiders build.

The new value will appear in a validation error when you try to build.

Put an arbitrary placeholder value in the `sha256` field, try to build and you'll get an error message regarding the sha256 value.

### Resolving the "hash mismatch" error

#### For `sha256:`

Example:

    //-- ...
           error: hash mismatch in file downloaded from 'https://code.visualstudio.com/sha/download?build=insider&os=linux-x64':
             specified: sha256:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
             got:       sha256:16fzxqs6ql4p2apq9aw7l10h4ag1r7jwlfvknk5rd2zmkscwhn6z
    //-- ...

Copy the "got" value (while stripping out the prepended "`sha256:`"), and paste it in your placeholder `sha256` value

Resulting: "`16fzxqs6ql4p2apq9aw7l10h4ag1r7jwlfvknk5rd2zmkscwhn6z`"

##### For `sha256-`

Example:

    //-- ...
            error: hash mismatch in fixed-output derivation '/nix/store/path':
             specified: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
                got:    sha256-aQvTtZdPU2F1UjkFxiLs4A+60A4qc9bXKwKriNsCDPg=
    //-- ...

Copy the "got" value (while stripping out the prepended "`sha256-`")

Then, run the following python script:

``` python
import base64
text = b'aQvTtZdPU2F1UjkFxiLs4A+60A4qc9bXKwKriNsCDPg=' # Replace the string in between ' with the according hash
print(base64.decodebytes(text).hex())
```

Its output should be pasted in your placeholder `sha256` value

## Creating development environments using nix-shell

Instead of using configuration.nix to add packages (e.g. Python or NodeJS) for developing code on VSCode, you can instead use nix-shell. This will allow you to seamlessly create development environments with the correct packages for your project, without rebuilding and restarting NixOS. See <a href="Development_environment_with_nix-shell" class="wikilink" title=" this page"> this page</a> for further instructions in building nix-shell development environments.

### Automatically switch nix shells when switching projects

You can do this by using [nix-direnv](https://github.com/nix-community/nix-direnv) and [the VSCode extension direnv](https://marketplace.visualstudio.com/items?itemName=mkhl.direnv) for integration. View the nix-direnv github page linked for a guide on setting it up.

### Alternative for manually switching shells

The extension [nix-env-selector](https://marketplace.visualstudio.com/items?itemName=arrterian.nix-env-selector) will make switching between different nix-shell environments within VSCode so you can switch between different coding projects easily and manually. It has a guide for setting up nix-shell environments for VSCode.

## Wayland

To make sure VSCode runs on Wayland native instead of Xwayland, you can make it use Ozone Wayland by setting the environment variable `NIXOS_OZONE_WL` with `NIXOS_OZONE_WL=1`

See <a href="Wayland#Electron_and_Chromium" class="wikilink" title="Wayland#Electron and Chromium">Wayland#Electron and Chromium</a>

## Updating extension versions

The Nixpkgs vscode extensions directory contains [a script](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/editors/vscode/extensions/update_installed_exts.sh) which use `code --list-extensions` and lookup the latest versions of those extensions to outputs a nix expression with a single `extensions` attribute of the same type as `extensionsFromVscodeMarketplace` inputs.

To run it in your current directory:

``` console
curl -fsSL https://raw.githubusercontent.com/NixOS/nixpkgs/master/pkgs/applications/editors/vscode/extensions/update_installed_exts.sh | sh
```

### Example output

``` console
curl -fsSL https://raw.githubusercontent.com/NixOS/nixpkgs/master/pkgs/applications/editors/vscode/extensions/update_installed_exts.sh | sh
{ extensions = [
  {
    name = "project-manager";
    publisher = "alefragnani";
    version = "12.4.0";
    sha256 = "0q6zkz7pqz2prmr01h17h9a5q6cn6bjgcxggy69c84j8h2w905wy";
  }
  {
    name = "githistory";
    publisher = "donjayamanne";
    version = "0.6.18";
    sha256 = "01lc9gpqdjy6himn7jsfjrfz8xrk728c20903lxkxy5fliv232gz";
  }
];
}
```

## Remote SSH

The remote-ssh extension works by connecting to a remote host and downloading scripts and pre-built binaries to . When first launching remote-ssh for a NixOS host, the connection will fail due to the provided node.js not having been built for a NixOS system (the dynamic libraries aren't in the same place).

### Any client to NixOS host

**tl;dr Use [nix-vscode-server](https://github.com/msteen/nixos-vscode-server) or [nix-ld](https://github.com/Mic92/nix-ld) on host machines.**

#### nix-vscode-server

Note that nix-vscode-server works as of 8/21/21 but is occasionally broken (See <https://github.com/msteen/nixos-vscode-server/pull/3>, <https://github.com/msteen/nixos-vscode-server/pull/4>, <https://github.com/msteen/nixos-vscode-server/pull/5>). Here's a workaround: Install the `nodejs-16_x` package on the NixOS host, and then run the following nix-shell script:

``` haskell
#! /usr/bin/env nix-shell
#! nix-shell --pure -i runghc -p "haskellPackages.ghcWithPackages (pkgs: [ pkgs.turtle ])"

{-# LANGUAGE OverloadedStrings #-}
import Turtle

main = sh $ do
  homedir <- home
  subdir <- ls $ homedir </> ".vscode-server/bin/"
  let nodepath = subdir </> "node"
  badnode <- isNotSymbolicLink nodepath
  if badnode
    then do
      mv nodepath (subdir </> "node_backup")
      symlink "/run/current-system/sw/bin/node" nodepath
      echo ("Fixed " <> repr subdir)
    else do
      echo ("Already fixed " <> repr subdir)
```

If instead you'd prefer to fix the binaries manually and have to do so every time that you upgrade your VS Code version, then you can install the `nodejs-16_x` package on the NixOS host and replace the VS Code provided version. This workaround is described here: <https://github.com/microsoft/vscode-remote-release/issues/648#issuecomment-503148523>. Note that NodeJS needs to be updated according to VS Code upstream requirements (NodeJS 16 required from 4/2022).

#### nix-ld

Add the following settings to `configuration.nix` on the NixOS host

Then run `nixos-rebuild switch` to enable `nix-ld`. Unlike the `nix-vscode-server` solution, the `nix-ld` solution also enables VSCode extensions even if they include non-Nix binaries.

### Nix-sourced VS Code to NixOS host

If vscode-remote is installed from nix (vscode-extensions.ms-vscode-remote as above) on the client machine, everything should "just work".

## Remote WSL

Similar to SSH hosts, both `nix-vscode-server` and `nix-ld` solution allows a VSCode Windows client to connect a [NixOS-WSL](https://github.com/nix-community/NixOS-WSL) host. However, by default the VSCode Windows client uses `wsl.exe --exec` to start the code server, which bypasses NixOS environment variables required by `nix-ld`, resulting in failures.

As a workaround, search for the following text in all files under the directory `$HOME\.vscode\extensions\`

Replace it with

Then restart VS Code and your VS Code client should be able to connect to NixOS host

See <https://github.com/nix-community/NixOS-WSL/issues/222> for the discussion about `wsl --exec` issue on NixOS-WSL. See <https://github.com/microsoft/vscode-remote-release/issues/8305#issuecomment-1661396267> about the workaround.

## Troubleshooting

### Writing login information to the keychain failed

If you get an error similar to the following, enable a <a href="Secret_Service" class="wikilink" title="Secret Service">Secret Service</a> provider.

    Writing login information to the keychain failed with error 'The name org.freedesktop.secret was not provided by any .service files'.

### Server did not start successfully

> Server did not start successfully. Full server log at /home/user/.vscode-server/.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.log  
>   
> server log:  
> /home/user/.vscode-server/bin/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/bin/code-server: line 12: /home/user/.vscode-server/bin/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/node: No such file or directory

"No such file or directory" means that libc is not found, see

    ldd ~/.vscode-server/bin/*/node

try to run the node binary on the server

    ~/.vscode-server/bin/*/node

if this fails, install node version 16, and try to patch the node binary

    nix-env -iA nixos.nodejs-16_x

``` bash
#! /bin/sh
# fix-vscode-server-node.sh
# https://github.com/microsoft/vscode-remote-release/issues/648#issuecomment-503148523
cd ~/.vscode-server/bin/*
if ! ./node -e "require('process').exit(0)"
then
  echo patching node binary $(readlink -f node)
  rm node
  ln -s $(which node)
else
  echo node is working $(readlink -f node)
fi
```

### Timeout

If you're using fish or other shell, set this in the user settings JSON on the client machine:

``` bash
"remote.SSH.useLocalServer": false
```

See <https://github.com/microsoft/vscode-remote-release/issues/2509> and <https://github.com/nix-community/nixos-vscode-server/issues/18>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:IDE" class="wikilink" title="Category:IDE">Category:IDE</a>
