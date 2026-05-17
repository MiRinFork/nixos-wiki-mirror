<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SDDM -->

[Simple Desktop Display Manager (SDDM)](https://github.com/sddm/sddm) is a modern display manager for X11 and Wayland sessions.

## Installation

SDDM can be enabled as the display manager with these lines.

## Configuration

### Wayland

### Autologin

### Disable/Enable fprint

With fprint enabled on the system, SDDM will expect a fingerprint after entering any password. SDDM does not show any prompt for this and this will time out after some time and SDDM will attempt to use your entered password. If you have your fingerprints enrolled, you can press enter and use your fingerprint reader. You may find additional options for fprint as well as information on enrolling fingerprints on the <a href="Fingerprint_scanner" class="wikilink" title="Fingerprint scanner">Fingerprint scanner</a> page.

KWallet cannot be unlocked using fprint.

#### Enable fprint system wide

You can enable this behavior by enabling fprint.

#### Disable fprint for login

Stops SDDM from prompting for fingerprint.

## Troubleshooting

### SDDM Hangs after entering password

With fprint enabled, SDDM will expect a fingerprint after entering any password. SDDM is likely waiting for a fingerprint without a prompt. You can disable this behavior by seeing the fprint configuration section of this article.

### SDDM does not unlock KWallet on KDE

This may be related to fprint. Using fprint to login cannot unlock KWallet since KWallet unlocks using the same password as your user, and does not support fingerprints to do so.

### Session freezes/leads to black screen after logging out

Some Desktop Sessions may rely on <a href="Systemd/logind" class="wikilink" title="logind">logind</a> to terminate themselves (e.g.: <a href="UWSM" class="wikilink" title="UWSM">UWSM</a>, `loginctl`, …), but SDDM currently fails at correctly handling signals from <a href="Systemd/logind" class="wikilink" title="logind">logind</a>, leaving it in a limbo state where it can't restart the greeter[1](https://github.com/sddm/sddm/issues/1908). If it ever happens, SDDM can be manually restarted by logging into another TTY, and restarting the `display-manager.service` system service.

However, there are workarounds to avoid doing this altogether.

#### Killing the session instead of terminating

If you are using `loginctl` to log out, use the `kill-session` command instead of the `terminate-session`. This will force the greeter to restart. Some reports[2](https://github.com/Vladimir-csp/uwsm/issues/194#issue-3779478721) say that `uwsm stop` may work as well.

#### Patch SDDM to correctly handle signals from `logind`

An [upstream PR](https://patch-diff.githubusercontent.com/raw/sddm/sddm/pull/2103.patch) fixing this issue is currently pending review. You can apply it by overriding SDDM to include the PR as a patch:

## Installing themes

You can install and configure a theme like so

<a href="Category:Display_Manager" class="wikilink" title="Category:Display Manager">Category:Display Manager</a>
