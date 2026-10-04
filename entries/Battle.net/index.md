<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Battle.net -->

The [Battle.net launcher](https://www.blizzard.com/apps/battle.net/desktop) is Blizzard's launcher for games including *World of Warcraft*, *Diablo*, *Overwatch*, and *StarCraft*. On NixOS, Battle.net runs smoothly using Wine or Proton, with <a href="Lutris" class="wikilink" title="Lutris">Lutris</a> or <a href="Steam" class="wikilink" title="Steam">Steam</a> being the most common runners.

## System Prerequisites

Battle.net requires 32-bit graphics driver libraries. Ensure 32-bit graphics support is enabled in your `configuration.nix`:

``` nix
# configuration.nix
hardware.graphics.enable32Bit = true;

# Optional, but recommended for gaming performance:
programs.gamemode.enable = true;
```

## Installation Methods

### Method 1: Lutris (Recommended)

The easiest and most reliable way to manage Battle.net is through <a href="Lutris" class="wikilink" title="Lutris">Lutris</a> using a Wine-GE or Proton-GE runner.

1\. Add Lutris and Wine tools to your configuration:

``` nix
environment.systemPackages = with pkgs; [
  lutris
  wineWow64Packages.staging
  winetricks
];
```

2\. Open Lutris, search for **Battle.net**, and run the community install script. 3. Once installation completes, log in and install your games.

### Method 2: Steam (Proton)

You can also run Battle.net through Steam:

1\. Download `Battle.net-Setup.exe` from the official website. 2. In Steam, click **Add a Game** \> **Add a Non-Steam Game...** and select the installer. 3. Open the game properties in Steam, go to **Compatibility**, check **Force the use of a specific Steam Play compatibility tool**, and select a recent **GE-Proton** version. 4. Run the installer to set up Battle.net inside Steam's `compatdata` prefix. 5. After installation, update the shortcut target to point to the installed `Battle.net Launcher.exe` inside `~/.local/share/Steam/steamapps/compatdata/<appid>/pfx/drive_c/Program Files (x86)/Battle.net/`.

### Method 3: Standalone Wine

To run Battle.net using standalone Wine-staging without external managers:

``` nix
environment.systemPackages = with pkgs; [
  wineWow64Packages.staging
  winetricks
];
```

Create a 64-bit Wine prefix and launch the installer:

``` bash
export WINEARCH=win64
export WINEPREFIX=$HOME/.wine-battlenet
wine64 Battle.net-Setup.exe
```

## Troubleshooting & Known Issues

### Blank or Missing Login Buttons (WINE_SIMULATE_WRITECOPY)

If the Battle.net login window opens but shows a blank, black, or unresponsive dialog where login fields/buttons are missing, launch with the `WINE_SIMULATE_WRITECOPY=1` environment variable:

``` bash
WINE_SIMULATE_WRITECOPY=1 wine64 "Battle.net Launcher.exe"
```

(In Lutris or Steam, add `WINE_SIMULATE_WRITECOPY=1` under the game's Environment Variables).

### Repairing Client After System / Wine Updates

If a Wine or system update causes Battle.net or its Agent update helper to throw DLL or startup errors, you do not need to delete your prefix or re-download games. Simply download a fresh `Battle.net-Setup.exe` and run it inside your existing prefix to repair the launcher files and registry in-place.

## World of Warcraft Companion Tools

For players running *World of Warcraft*, several companion applications have dedicated NixOS packages and configuration guides:

- <a href="Raider.IO" class="wikilink" title="Raider.IO">Raider.IO</a> — Mythic+ and raid progression tracking and addon synchronization.
- <a href="Archon" class="wikilink" title="Archon">Archon</a> — Official Warcraft Logs companion for combat log recording and uploading.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
