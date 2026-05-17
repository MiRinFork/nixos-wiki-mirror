<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: VSCodium -->

VSCodium is a build of <a href="Visual_Studio_Code" class="wikilink" title="Visual Studio Code">Visual Studio Code</a> without the proprietary bits that are included in the official distribution. See <https://github.com/VSCodium/vscodium#readme> for more background.

## Installation

### NixOS

``` nix
environment.systemPackages = with pkgs; [ vscodium ];
```

Extensions can be managed using the 'vscode-with-extensions' package:

``` nix
environment.systemPackages = with pkgs; [
  (vscode-with-extensions.override {
    vscode = vscodium;
    vscodeExtensions = with vscode-extensions; [
      bbenoist.nix
      ms-python.python
      ms-azuretools.vscode-docker
      ms-vscode-remote.remote-ssh
    ] ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
      {
        name = "dscodegpt";
        publisher = "DanielSanMedium";
        version = "3.4.10";
        hash = "sha256-zjaM9YME0wfBOwhJTacnQbQvw35QL5NvXIBAx5d/bjI=";
      }
    ];
  })
];
```

Some examples here: [GitHub search for "extensionFromVscodeMarketplace"](https://github.com/search?q=extensionFromVscodeMarketplace&type=code)

is a manual way to fetch extensions. However, to keep updated from upstream, [nix-community/nix-vscode-extensions](https://github.com/nix-community/nix-vscode-extensions) provides the Nix expressions for the majority of available extensions from Open VSX and VSCode Marketplace. A GitHub Action updates the extensions daily.

It's also possible to install VSCodium via <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

``` nix
programs.vscode = {
  enable = true;
  package = pkgs.vscodium;
  profiles.default.extensions = with pkgs.vscode-extensions; [
    dracula-theme.theme-dracula
    vscodevim.vim
    yzhang.markdown-all-in-one
  ];
};
```

- See for more options: [Home Manager Manual: Options - programs.vscode](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.vscode.enable)
- Search for extensions with configurations: [NixOS Search: vscode-extensions](https://search.nixos.org/packages?type=packages&query=vscode-extensions)

Please note that some Visual Studio Code extensions have licenses that restrict their use to the official Visual Studio Code builds and therefore do not work with VSCodium. See [this note on the VSCodium docs page](https://github.com/VSCodium/vscodium/blob/master/docs/index.md#proprietary-debugging-tools) for what's been found so far and possible workarounds. In particular, [remote-ssh](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) does not work yet with VSCodium.

### Non-NixOS

``` console
$ nix-env -iA nixos.vscodium
```

### Use VS Code extensions without additional configuration

With the package vscodium.fhs, the editor launches inside a [FHS](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard) compliant chroot environment using buildFHSUserEnv. This reintroduces directories such as /bin, /lib, and /usr, which allows for extensions which ship pre-compiled binaries to work with little to no additional nixification.

Example usage:

``` nix
environment.systemPackages = with pkgs; [ vscodium.fhs ];
```

Home-manager:

``` nix
programs.vscode = {
  enable = true;
  package = pkgs.vscodium.fhs;
};
```

Adding extension-specific dependencies, these will be added to the FHS environment:

``` nix
# needed for rust lang server extension
programs.vscode.package = pkgs.vscodium.fhsWithPackages (ps: with ps; [ rustup zlib ]);
```

## Creating development environments using nix-shell

Instead of using configuration.nix to add packages (e.g. Python or NodeJS) for developing code on VSCode, you can instead use nix-shell. This will allow you to seamlessly create development environments with the correct packages for your project, without rebuilding and restarting NixOS. See <a href="Development_environment_with_nix-shell" class="wikilink" title=" this page"> this page</a> for further instructions in building nix-shell development environments.

The extension [nix-env-selector](https://marketplace.visualstudio.com/items?itemName=arrterian.nix-env-selector) will make switching between different nix-shell environments within VSCode so you can switch between different coding projects easily. It has a guide for setting up nix-shell environments for VSCode.

## Troubleshooting

### Issues running Vscodium on Wayland

In case of a broken graphical interface while running Vscodium on <a href="Wayland" class="wikilink" title="Wayland">Wayland</a>, removing following cache directories might resolve the issues:

``` console
$ rm -r ~/.config/VSCodium/GPUCache ~/.config/VSCodium/Crashpad
```

An other workaround is to run Vscodium without GPU acceleration

``` console
$ codium --disable-gpu
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:IDE" class="wikilink" title="Category:IDE">Category:IDE</a>
