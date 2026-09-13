<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Discord -->

Discord is an instant messaging and VoIP application with lots of functionality. It provides a web interface, though most users would prefer to use a client for interoperability with their system.

## Installation

### Official Clients

Nixpkgs provides all three of Discord's release channels: `pkgs.discord`, `pkgs.discord-ptb`, and `pkgs.discord-canary`. Add any of these packages in `environment.systemPackages` or `users.users.`<name>`.packages`.

### Unofficial Clients

Nixpkgs also provides a vast variety of community developed/modded Discord clients, which can usually serve as drop-in replacements for the official discord client with an extended set of features.

**Legcord[^1]** is a lightweight alternative desktop client featuring built-in modding extensibility via Vencord and Equicord. Provided via `pkgs.legcord`.

**GoofCord[^2]** is a security oriented fork of Legcord. Provided via `pkgs.goofcord`.

**BetterDiscord[^3]** enhances Discord desktop app with new features. Installer provided via `pkgs.betterdiscordctl`, but users may prefer to instead run it one-off via cli:

``` console
$ nix-shell -p betterdiscordctl --command 'betterdiscordctl install' # nix-legacy
$ nix run nixpkgs#betterdiscordctl -- install # nix3

$ nix-shell -p betterdiscordctl --command 'betterdiscordctl self-upgrade' # nix-legacy
$ nix run nixpkgs#betterdiscordctl -- self-upgrade # nix3
```

**OpenAsar[^4]** is an open-source alternative to Discord's `app.asar`. Provided via `pkgs.openasar` without usable client. Users should instead prefer to override the official discord package and add `withOpenASAR = true`:

**Vencord[^5]**, the cutest Discord client mod. Provided via `pkgs.vencord`. Standalone can be installed by overriding the official Discord package via `withVencord = true`:

**Vesktop[^6]** is a customizable and privacy friendly desktop app by the developers of Discord's cutest client mod. Provided via `pkgs.vesktop`. Can be configured in <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

**Equicord[^7]**, other cutest Discord client mod. Provided via `pkgs.equicord`.

**Equibop[^8]**, a Vesktop fork by Equicord developers. Provided via `pkgs.equibop`.

**Dissent[^9]** is a simple, practical Discord client prioritizing speed over feature completeness. Provided via `pkgs.dissent`.

**Discordo[^10]** is a TUI Discord client provided via `pkgs.discordo`. *Development in progress, possible crashes and breaking changes.*

**Webcord[^11]** is a Discord and [Spacebar](https://spacebar.chat/) client implemented without using official Discord API. Provided via `pkgs.webcord`.

**Ripcord[^12]** is an unfree client for Discord and [Slack](https://slack.com/intl/) with a traditional compact interface for power users. Provided via `pkgs.ripcord`.

## Troubleshooting

### Wayland screen sharing

Since December 2024, Discord Canary supports screen sharing on Wayland. Alternatively, you can use the web version on a browser that supports screen sharing on Wayland, or an <a href="Discord#Unofficial_Clients" class="wikilink" title="unofficial client">unofficial client</a> like *Webcord* or *Vesktop*, both of which have fixed this issue in their own ways.

### Notifications-related crash

Discord will crash if there is no compatible notification daemon running. This issue is only prevalent in custom desktop environments, such as <a href="Sway" class="wikilink" title="Sway">Sway</a> or <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a>. Comprehensive documentation usually exists for most window managers/compositors and can be found on their respective wikis. Nixpkgs provides a few standalone notification daemons such as `pkgs.dunst` and `pkgs.mako`. You may optionally use a notification daemon from a larger DE, such as `pkgs.lxqt.lxqt-notificationd`, however it is unclear how effective these will be outside of their normal environment.

### Start-up crash

Occasionally, Discord's code can become corrupted, causing it to crash on start-up. You can force it to re-download the latest version by deleting the `~/.config/discord/1.0.138`directory, where `1.0.138` is replaced with Discord's current version number (the second line of output when running `discord` from a terminal).

### "Must be your lucky day"

Although Nixpkgs is usually very fast with updates (if you use *nixos-unstable*), you may still run into this issue intermittently. You may override the discord package with a more up-to-date source, or you may disable this popup entirely by adding `"SKIP_HOST_UPDATE": true` to `~/.config/discord/settings.json`:

### Krisp noise suppression

The Krisp noise suppression option will not work on NixOS because the Discord binary is patched before installation, and there is a DRM-style integrity check in the Krisp binary which prevents Krisp from working if the Discord binary is modified. See <https://github.com/NixOS/nixpkgs/issues/195512> for details.

#### Python script workaround

One way to enable Krisp noise suppression is by patching the `discord_krisp.node` binary to bypass its DRM verification. Below is a Nix configuration that creates a Python script that patches the binary by modifying specific bytes to bypass the license check:

``` nixos
{ pkgs, ... }:
let
  krisp-patcher =
    pkgs.writers.writePython3Bin "krisp-patcher"
      {
        libraries = with pkgs.python3Packages; [
          capstone
          pyelftools
        ];
        flakeIgnore = [
          "E501" # line too long (82 > 79 characters)
          "F403" # 'from module import *' used; unable to detect undefined names
          "F405" # name may be undefined, or defined from star imports: module
        ];
      }
      (
        builtins.readFile (
          pkgs.fetchurl {
            url = "https://pastebin.com/raw/8tQDsMVd";
            sha256 = "sha256-IdXv0MfRG1/1pAAwHLS2+1NESFEz2uXrbSdvU9OvdJ8=";
          }
        )
      );
in
{
  environment.systemPackages = [
    krisp-patcher
  ];
}
```

After adding this to your Nix configuration and rebuilding, make sure Discord is completely closed, and then run:

``` console
$ krisp-patcher ~/.config/discord/0.0.76/modules/discord_krisp/discord_krisp.node
```

Once you restart Discord and join a VC, you should see a sound wave icon to the left of the hangup icon.

### Text-to-Speech

TTS is disabled by default; you may enable it via an override:

``` nix
(pkgs.discord.override { withTTS = true; })
```

### Discord RPC not functioning

Install **arRPC**[^13]:

Or add the following to your Home Manager configuration:

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>

[^1]: <https://github.com/Legcord/Legcord>

[^2]: <https://github.com/Milkshiift/GoofCord>

[^3]: <https://github.com/BetterDiscord/BetterDiscord>

[^4]: <https://github.com/GooseMod/OpenAsar>

[^5]: <https://github.com/Vendicated/Vencord>

[^6]: <https://github.com/Vencord/Vesktop>

[^7]: <https://github.com/equicord/equicord>

[^8]: <https://github.com/Equicord/equibop>

[^9]: <https://github.com/diamondburned/dissent>

[^10]: <https://github.com/ayn2op/discordo>

[^11]: <https://github.com/SpacingBat3/WebCord>

[^12]: <https://cancel.fm/ripcord/>

[^13]: <https://github.com/OpenAsar/arrpc>
