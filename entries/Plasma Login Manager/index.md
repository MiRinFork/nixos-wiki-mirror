<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plasma Login Manager -->

[Plasma Login Manager (PLM)](https://invent.kde.org/plasma/plasma-login-manager) is a fork of <a href="SDDM" class="wikilink" title="SDDM">SDDM</a> for <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a>. PLM is only available in NixOS 26.05 or above.

## Installation

Plasma Login Manager can be enabled as follows:

## Configuration

### Autologin

### fprint

With fprint enabled on the system, PLM will expect a fingerprint after entering any password. PLM does not show any prompt for this and this will time out after some time and PLM will attempt to use your entered password. If you have your fingerprints enrolled, you can press enter and use your fingerprint reader. You may find additional options for fprint as well as information on enrolling fingerprints on the <a href="Fingerprint_scanner" class="wikilink" title="Fingerprint scanner">Fingerprint scanner</a> page.

KDE Wallet cannot be unlocked using fprint.

#### Enable fprint system wide

You can enable this behavior by enabling fprint.

#### Disable fprint for login

Stops PLM from prompting for fingerprint.

## Troubleshooting

### PLM hangs after entering password

If you have fprint enabled, <a href="#Disable_fprint_for_login" class="wikilink" title="disable it for PLM">disable it for PLM</a>.

<a href="Category:Display_Manager" class="wikilink" title="Category:Display Manager">Category:Display Manager</a>
