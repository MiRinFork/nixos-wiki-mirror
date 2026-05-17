<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mosh -->

[Mosh](https://mosh.org/) is an alternative SSH terminal. It has support for roaming, local echo and uses UDP for transport. It also aims to improve responsiveness on intermittent, and high latency connections.

See the [mosh Package](https://search.nixos.org/packages?show=mosh&query=mosh) and [mosh Options](https://search.nixos.org/options?query=programs.mosh)

## Installation

### Client

Install the [`mosh`](https://search.nixos.org/packages?show=mosh&query=mosh) package.

### Server

Enable the [`programs.mosh`](https://search.nixos.org/options?query=programs.mosh) module. You can simply add the following into your `/etc/nixos/configuration.nix`:

``` nix
# Enable mosh, the ssh alternative when client has bad connection
# Opens UDP ports 60000 ... 61000
programs.mosh.enable = true;
```

## Usage

With mosh installed on both the client and server, connect by running:

``` console
$ mosh user@server
```

Note that mosh uses SSH for authentication and initialization, so it will respect aliases and other options in `.ssh/config`. You can also specify SSH options using the `--ssh` argument. For example, to use port 1122 instead of 22, you can either use `Port 1122` in SSH config, or use mosh with the `--ssh` argument:

``` console
$ mosh --ssh='ssh -p 1122' user@server
```

More information is available at [mosh.org](https://mosh.org/#usage) or using [`man mosh`](https://manpages.debian.org/bullseye/mosh/mosh.1.en.html)

## Troubleshooting

### Missing `/run/user/1000`

Using a mosh session, `$XDG_RUNTIME_DIR` (/run/user/1000) doesn't exist and causes issues such as:

- nix-shell failing with `Error in tempdir() using /run/user/1000/nix-shell.XXXXX`

This is caused by the way `mosh` handles logging-in to the system, the login is actually handled by a short `ssh` session, which ends immediately. `logind`, as it is used, closes the user's session and cleans up behind, since there is no lingering configured by default.

To enable lingering use:

``` console
$ loginctl enable-linger $USER
```

Then reconnect with mosh. Note that lingering is enabled by default in NixOS \>= 16.09.

As a workaround, it is also possible to set an alias in the user's shell on the server wrapping `mosh-server` to keep the session around. [^1]

``` bash
alias mosh-server = "systemd-run --user --scope mosh-server"
```

See also <https://github.com/NixOS/nixpkgs/issues/3702#issue-40762878>

=== The locale requested by LANG=\*\*\* isn't available here. ===

This error occurs when trying to connect to a linux server (non-NixOS distribution) on which mosh-server has been installed via nix. The easy solution is to set LOCALE_ARCHIVE to your OS locale-archive in your .profile or .zshenv:

``` bash
export LOCALE_ARCHIVE=/usr/lib/locale/locale-archive
```

<hr />

## References

<references />

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>

[^1]: [issue#29234](https://github.com/NixOS/nixpkgs/issues/29234)
