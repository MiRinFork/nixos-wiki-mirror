<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Secret Service -->

**[Secret Service](https://specifications.freedesktop.org/secret-service-spec/latest/)** is an API on D-Bus to allow applications to store secrets securely.

## Providers

Secret Service has many providers. Here's a list of a few of them.

- GNOME Keyring: GNOME-integrated daemon that stores credentials
- KDE Wallet (KWallet): KDE-integrated application that stores credentials
- KeePassXC (): A password manager with optional Secret Service integration
- pass-secret-service: D-Bus service to expose [pass](https://www.passwordstore.org/) to Secret Service

At least GNOME Keyring provides a special collection named `session`, which is not persisted on disk and is deleted when the user logs out.

### GNOME Keyring

Add the following to your <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> configuration: OR

Add the following to your NixOS configuration:

The NixOS module sets up `gnome-keyring-daemon` to run as root [1](https://github.com/NixOS/nixpkgs/blob/10343b095a3f870e6a03f867a6bfb6d12e08e589/nixos/modules/services/desktops/gnome/gnome-keyring.nix#L40), which allows GNOME Keyring to use secure memory (e.g. not <a href="swap" class="wikilink" title="swap">swap</a>), however this is easily mitigated by not using swap or using encrypted swap.

The NixOS module also adds the appropriate D-Bus service definitions to the session bus.

To manage credentials, you can use the Seahorse () application.

### KDE Wallet

When using <a href="KDE" class="wikilink" title="KDE">KDE</a> via , KDE Wallet is enabled automatically.

### KeePassXC

KeePassXC's Secret Service integration can be enabled by going into the **Tools \> Settings**, opening the *Secret Service Integration* tab and enabling it.

This can be configured automatically by <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> configuration:

If not using the one needs to configure for Secret Service integration by opening their settings **Database \> Database Settings...**, opening the *Secret Service Integration* tab and selecting a group for Secret Service entries.

If you see a warning like above, you need to find out which other service is currently registered:

``` shell
busctl --user status org.freedesktop.secrets
```

If it's the Gnome Keyring Daemon, then it can be disabled by this configuration below:

### pass-secret-service

Add the following to your <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> configuration:

OR

Add the following to your NixOS configuration:

## Secret portal

**[Secret portals](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.Secret.html)** are portals in the XDG Desktop Portal specification, which allows applications to get a per-application master secret. I (<a href="User:Axka" class="wikilink" title="axka">axka</a>) don't know of any applications requiring this, and to my knowledge the only provider is GNOME Keyring, which can be added to `xdg.portal.extraPortals` in Home Manager. NixOS enables this automatically when GNOME Keyring is enabled. Adding `gnome-keyring` will also add XDG autostart definitions, but unless you have `gnome-keyring` installed on NixOS, they won't be enabled (i.e. `/run/wrappers/bin/gnome-keyring-daemon` won't work).

## Auto-decrypt on login

The NixOS module for GNOME Keyring enables its PAM module automatically via , however the Home Manager module does not and as such you should add the following code to your NixOS configuration:

The equivalent for KDE Wallet is .

Usually you want to configure the `login` service, but `greetd`, `su` and `sshd` are also available. GDM and LightDM can be configured with `login`, while greetd cannot ().

The login password is used to decrypt the wallet/keyring.

## Troubleshooting

### `gkr-pam: couldn't unlock the login keyring.`

This error happens when the PAM module, for some reason, can't unlock the login keyring. This may be for example because it can't connect to the daemon, which should have been started by the PAM module with the message `gkr-pam: gnome-keyring-daemon started properly`. Try logging out and back in or restarting.

### `gkr-pam: unable to locate daemon control file`

This error happens when the PAM module can't find the daemon's control socket. Very likely it will start a daemon and retry the action which requires a daemon, and stop the daemon when the PAM session closes.

### `gnome-keyring-daemon: couldn't create system prompt: GDBus.Error:org.freedesktop.DBus.Error.Spawn.ChildExited: Process org.gnome.keyring.SystemPrompter exited with status 1`

This error occurs when the GNOME Keyring daemon fails to spawn the SystemPrompter process (provided by the gcr package). This usually occurs due to D-Bus not having knowledge of the user's display environment. To fix this we must update the D-Bus environment once display is available.

On X11 this can be fixed by setting the following option:

OR

Alternatively the following command can be run on display startup:

### `discover_other_daemon: 0` with `--start`

This error happens when a `gnome-keyring-daemon` process with the `--start` flag either could not send `GKD_CONTROL_OP_INITIALIZE` to a control socket or got a failing result.

### `discover_other_daemon: 1` with `--start`

This log message gets printed when a `gnome-keyring-daemon` process with the `--start` flag successfully sent `GKD_CONTROL_OP_INITIALIZE` to a control socket.

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
