<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: WSL -->

Notes on running NixOS on the Windows Subsystem for Linux (WSL, WSL2).

## Setup

Ensure that WSL is installed and up to date.

``` powershell
wsl --install
wsl --update
```

Sometimes you'll have to install WSL2 manually by [downloading the msi-installation package](https://github.com/microsoft/WSL/releases).

NixOS is [not yet packaged](https://github.com/microsoft/WSL/issues/11206) as a official WSL distribution or on the Microsoft store. Download the latest release of `nixos.wsl` from the [NixOS-WSL Github page](https://github.com/nix-community/NixOS-WSL/releases).

Double-click the file you just downloaded (requires WSL \>= 2.4.4).

## Usage

Start it with PowerShellː

``` powershell
wsl -d NixOS
```

## Tips and tricks

### Run container on startup

To run the distro `NixOS` on Windows startup or user login in the background, use these commands in PowerShellː

``` powershell
echo "" > $HOME\run_wsl2_at_startup.vbs
notepad $HOME\run_wsl2_at_startup.vbs
```

Inside the script we define `NixOS` as the distribution name, as imported in the setup step above.

Open the task schedulerː

``` powershell
taskschd.msc
```

Click on `Create task` on the right pane, set name to `WSL`. On the tab "Triggers" click on "New ..." and select "run task on user login" in the dropdown menu. On the tab "Action" click on "New ..." and insert as command: `%USERPROFILE%\run_wsl2_at_startup.vbs`

<a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>
