<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix Installation Guide -->

This guide describes various **more advanced** methods for installing <a href="Nix" class="wikilink" title="Nix">Nix</a> on an *existing* operating system. For installation of <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, see <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a>.

Please take a look at <https://nixos.org/download.html> first for basic installation instructions and read the relevant section in the Nix manual if you want to know more about how the install process works: <https://nixos.org/manual/nix/stable/#ch-installing-binary>.

## Installation

Nix package manager can be installed as either:

- Multi User Installation (recommended)
- Single User Installation

### Multi User Installation

``` console
$ bash <(curl -L https://nixos.org/nix/install) --daemon
```

### Single User Installation

``` console
$ bash <(curl -L https://nixos.org/nix/install) --no-daemon
```

### Stable Nix

By default, the rolling Nix package manager will be installed using one of the above commands and thus the `nixpkgs-unstable` <a href="Channel_Branches" class="wikilink" title="channel">channel</a> will be used.

Follow the below to switch to the stable channel:

``` console
$ sudo su
$ nix-channel --remove nixpkgs
$ nix-channel --add https://nixos.org/channel/nixos-25.11 nixpkgs
$ nix-channel --update
```

Then run the following command to verify that you are using the stable channel:

``` console
$ nix-shell -p nix-info --run "nix-info -m"
```

#### Troubleshooting

##### User namespaces

If the installation fails with the following error:

    installing 'nix-2.2.2'
    error: cloning builder process: Invalid argument
    error: unable to start build process

it is possible that user namepaces are disabled by your distribution. Since Nix 2.2, the sandbox is enabled by default on Linux which requires user namespaces. If possible enable them; the procedure depends on the distribution. In last resort, you can disable the sandbox: create the file `~/.config/nix/nix.conf` and include the line `sandbox = false`.

## Nix store on an unusual filesystem

### Case insensitive filesystem on Linux

Most Linux filesystems are case sensitive. If your nix store is on a case insensitive filesystem like CIFS on Linux, derivation outputs cannot contain two files differing only in case in the same directory. Nix can work around this by adding `use-case-hack = true` to your nix configuration (`/etc/nix/nix.conf` for a multi-user-install or `~/.config/nix/nix.conf` otherwise). Unfortunately, this will change the hash of some derivations and thus make the binary cache useless.

### NFS

With a Nix store residing on an NFS filesystem, concurrent use of Nix may corrupt Nix's sqlite database. To prevent this, set `use-sqlite-wal = false`. Since [nix/pull/5475 nix/pull/5475](https://github.com/NixOS/nix/pull/5475) and it's backports to the stable branches, a patch that was previously described in this wiki is no longer needed for using Nix on WSL (Windows' Subsystem for Linux) and NFS filesystems.

## Installing without root permissions

By using [nix-user-chroot](https://github.com/nix-community/nix-user-chroot) or [PRoot](https://github.com/proot-me/PRoot), you can use Nix on systems where you have no permission to create the \`/nix\` directory. nix-user-chroot is the preferred option. However, it might not run on older Linux kernels, or kernels without user namespace support. With the following command, you can test whether your system supports user namespaces for unprivileged users:

``` console
$ unshare --user --pid echo YES
YES
```

The output should be `YES`. If the command is absent, an alternative is to check the kernel compile options:

``` console
$ zgrep CONFIG_USER_NS /proc/config.gz
CONFIG_USER_NS=y
```

On some systems, like Debian or Ubuntu, the kernel configuration is in a different place, so instead use:

``` console
$ grep CONFIG_USER_NS /boot/config-$(uname -r)
CONFIG_USER_NS=y
```

If the output of this command is `CONFIG_USER_NS=y`, then your system supports user namespaces.

### nix-user-chroot

[nix-user-chroot](https://github.com/nix-community/nix-user-chroot) is the preferred method to install use nix on systems without `/nix`. It also requires user namespaces to be enabled on the system. `nix-user-chroot` will create an environment in which you can bind mount a directory to `/nix`. The mountpoint will be only visible within this environment.

There are [pre-build static binaries](https://github.com/nix-community/nix-user-chroot/releases) and the readme also contains the instructions to build from [source](https://github.com/nix-community/nix-user-chroot#build-from-source) (assuming rustc and cargo to be installed).

In this example, the Nix store will be installed to `~/.nix`.

``` console
$ mkdir -m 0755 ~/.nix
$ nix-user-chroot ~/.nix bash -c 'curl -L https://nixos.org/nix/install | sh'
```

Note that you can only use Nix and the installed programs within the shell started by `nix-user-chroot`:

``` console
$ nix-user-chroot ~/.nix bash
```

### PRoot

#### Obtaining PRoot

Precompiled PRoot binaries for every commit can be downloaded from [here](https://gitlab.com/proot/proot/pipelines) under the job artifacts. Make sure you set the executable bit of binaries you download.

Alternatively, if you have another machine with nix installed, you can build static binaries as follows:

- create a file `proot.nix`:

``` nix
with import <nixpkgs> {}; 
pkgsStatic.proot.override { enablePython = false; }
```

- build it:

``` console
$ nix-build proot.nix
```

The executable is to be found in `result/bin/proot`.

If nix builds within proot fail with something like "no such file or directory" while the files referenced do exist, you can set `PROOT_NO_SECCOMP=1` in your environment or try termux's [fork](https://github.com/termux/proot) of PRoot.

#### Installing nix

- If you have user namespaces enabled, you should prefer using nix-user-choot to PRoot. So we can safely assume that if you got to this point in the page, you don't have user namespaces. Therefore you must disable the sandbox. Add the line

to `~/.config/nix/nix.conf`.

- Create the folder where the nix store is to be located: in this example `~/.nix`:

``` console
$ mkdir ~/.nix
```

- Make sure PRoot is in PATH and use is to obtain a shell where `/nix` exists:

``` console
$ proot -b ~/.nix:/nix
```

- In this new shell, Nix can be installed:

``` console
$ curl -L https://nixos.org/nix/install | sh
```

Note that you can only use Nix and the installed programs within the shell started by PRoot.

#### Troubleshooting

PRoot uses ptrace to capture and modify system calls. It happens that new system calls are created which proot does not shim yet. If you run into issues, check if:

- you have the latest proot

<!-- -->

- the system calls being used are supported by proot (TODO: how to list and diff with sysnums.list?)

Since ptrace only allows one tracer to attach to a process at a time, you cant strace your process while in proot. One suggestion is to strace your application outside of proot to find what system calls are used. Alternatives may be tracing with bpftrace or trace-cmd/ftrace. (This is not elaborated on here because the author doesn't know how to do it.)

A table of system calls supported by proot-rs, which is not the same as proot, can be found at <https://github.com/proot-me/proot-rs/wiki/Translation-of-system-calls> .

As of PRoot 5.3.1 and 2022-Oct-24, PRoot doesn't support faccess2, which is invoked in glibc by bash through coreutils test. This makes the \`\[ -w /nix \]\` expression fail incorrectly in the nix installer script. This can be worked around with this patch: <https://github.com/proot-me/proot/pull/338> or `nix-shell -I nixpkgs=channel:nixos-unstable -p '(proot.overrideAttrs (o: { patches = [ (builtins.fetchurl "`[`https://patch-diff.githubusercontent.com/raw/proot-me/proot/pull/338.patch`](https://patch-diff.githubusercontent.com/raw/proot-me/proot/pull/338.patch)`" ) ]; }))'`

### nix 2.0's native method

If nix is already installed on the system i.e. a self-compiled nix itself can also create a nix store in an alternative user-writable locations. The following command will create a nix store in `~/my-nix` and spawn a shell, where `~/my-nix` be mounted to `/nix`.

``` console
$ nix run --store ~/my-nix nixpkgs.nix nixpkgs.bashInteractive
```

You can make all nix commands use the alternate store by specifying it in \`~/.config/nix/nix.conf\` as `store = /home/USERNAME/my-nix`.

## Installing on Debian Using APT

If you are using Debian (or a Debian-based distro) you can install Nix with the APT package manager. Some users may prefer using APT when modifying their system. The package named `nix-setup-systemd` will set up a multi-user Nix installation and run `nix-daemon` via `systemd`. To install:

``` console
$ sudo apt install nix-setup-systemd
```

After installing, you should read `/usr/share/doc/nix-bin/README.Debian`. In particular, you will need to add your user to the `nix-users` group in order to use the daemon:

``` console
$ sudo /sbin/adduser $USER nix-users
```

Note that in Debian [Bookworm](https://packages.debian.org/bookworm/nix-setup-systemd) `/etc/nix/nix.conf` will contain `sandbox = false`, but in Debian [Trixie](https://packages.debian.org/trixie/nix-setup-systemd), sandbox mode is enabled by default. (See the Changelog for details.)

### Configure user and/or desktop

To start installed nix applications from the command line, add the `~/.nix-profile/bin` to `PATH`. To give the Desktop access the nix application data add the `~/.nix-profile/share` to `XDG_DATA_DIRS`.

For example include the following snippet in `~/.profile` of the user:

``` console
### set PATH so it includes user's nix bin if it exists
if [ -d "$HOME/.nix-profile/bin" ] ; then
    PATH="$HOME/.nix-profile/bin:$PATH"
fi

### set XDG_DATA_DIR so it includes user's nix share if it exists
if [ -d "$HOME/.nix-profile/share" ] ; then
    XDG_DATA_DIRS="$HOME/.nix-profile/share:$XDG_DATA_DIRS"
fi
```

Used source: <https://imranmustafa.net/nix-on-debian/>

### Troubleshooting

During the `nix-build` command following the <https://nix.dev/tutorials/nixos/nixos-configuration-on-vm#creating-a-qemu-based-virtual-machine-from-a-nixos-configuration> an error could occur like:

`...linux-6.12.39-modules-shrunk/lib' is not in the Nix store` whilst the directory is present in the `/nix/store/` directory.

A possible solution is to upgrade nix and nix-daemon applications because the distributed nix version is older, quite older with Debian [Bookworm](https://packages.debian.org/bookworm/nix-setup-systemd), than the current nix version:

1\) Define the config at `~/.config/nixpkgs/config.nix`:

``` console
with (import <nixpkgs> {});
{
  packageOverrides = pkgs: with pkgs; {
    userPackages = buildEnv {
      extraOutputsToInstall = [ "doc" "info" "man" ];
      name = "user-packages";
      paths = [
        nix
      ];
    };
  };
}
```

To upgrade nix:

``` console
nix-env --install --attr nixpkgs.userPackages --remove-all
```

Logout and login the user to see the effects.

2\) To use the upgraded `nix-daemon` application from the previous step in the `nix-daemon.service`, add a drop-in config file `override.conf` in `/etc/systemd/system/nix-daemon.service.d/`:

``` console
[Service]
ExecStart=
ExecStart=@/home/myuser/.nix-profile/bin/nix-daemon nix-daemon --daemon
```

Restart the `nix-daemon.service` Used source: <https://blog.koch.ro/posts/2024-01-16-using-nix-package-manager-in-debian.html>

## Windows Subsystem for Linux (WSL)

As of Windows 10, Microsoft supports running Linux and Linux programs on the Windows OS. Installation instructions can be found at <https://docs.microsoft.com/en-us/windows/wsl/install-win10>. If you follow those instructions for using WSL2 (post-Windows 10 2004 build 19041), you can install Nix normally as described in <a href="Nix_Installation_Guide#Single-user_install" class="wikilink" title="Single-user install">Single-user install</a>. You can check what version of WSL you are using by running `wsl --list --verbose` from the Windows command line.

### WSL1 (pre-Windows 10 2004 build 19041)

Running Nix is much simpler on WSL2, so we recommend that if at all possible. If WSL2 is not available, then Nix can be installed and run from WSL1 with a few workarounds.

If you perform no workarounds, you will see that `busybox` doesn't work in Nix due to WSL1 not handling 32-bit binaries. This can be remedied by following the solution laid out in [nixpkgs issue#24954](https://github.com/NixOS/nixpkgs/issues/24954#issuecomment-399614154):

- Install and configure QEMU and binfmt-support

``` console
$ sudo apt install qemu-user-static
$ sudo update-binfmts --install i386 /usr/bin/qemu-i386-static --magic '\x7fELF\x01\x01\x01\x03\x00\x00\x00\x00\x00\x00\x00\x00\x03\x00\x03\x00\x01\x00\x00\x00' --mask '\xff\xff\xff\xff\xff\xff\xff\xfc\xff\xff\xff\xff\xff\xff\xff\xff\xf8\xff\xff\xff\xff\xff\xff\xff'
```

- Start the `binfmt-support` service every WSL1 login:

``` console
$ sudo service binfmt-support start
```

- Continue installing Nix as described in <a href="Nix_Installation_Guide#Single-user_install" class="wikilink" title="Single-user install">Single-user install</a>

## ARMv7l

Because there is no officially produced ARMv7l installer, this page describes how to build your own: <a href="Nix_on_ARM" class="wikilink" title="Nix_on_ARM">Nix_on_ARM</a>.

## Further reading

- [Setting up Nix on macOS, Nixcademy](https://nixcademy.com/posts/nix-on-macos/)

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
