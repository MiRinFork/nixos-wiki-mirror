<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Distributed build -->

When your **local machine** is too slow or doesn't have the right CPU architecture or operating system for the Nix derivation you want to build, you can delegate the build to some other **remote machine**. For this you need

1.  the **Nix package manager installed on both machines**; just follow the [official installation instructions](https://nixos.org/download/) and prefer the normal "multi-user" install. You don't need to run NixOS; any operating system like Debian, Ubuntu, Arch, MacOS or others where the Nix package manager can be installed, should work.
2.  **SSH access from the local to the remote machine**.
3.  **modify the local machine's Nix config to know about the remote machine**.

There is a dedicated chapter in the [Nix Manual](https://nixos.org/manual/nix/stable/advanced-topics/distributed-builds.html) but it may be difficult to follow for beginners.

This is an easier, step-by-step guide to setting up a "**remote builder**" machine to create distributed builds, and includes some SSH tips that are out of scope for the Nix Manual chapter.

## Setting up SSH

The main tool to connect to a remote builder, exchange files and trigger builds is SSH.

Depending on how you installed the [Nix package manager](https://nixos.org/download/),

- **"multi-user"** (system-wide installation; default on NixOS, preferred, normal case for most Linux distro users) or
- **"single-user"** (installed only for a single user on the machine; used when no root/admin rights were available for the user),

on your local and remote machine you need to allow a certain local SSH user (on your local machine) to connect to a certain remote SSH user (on the remote machine):

| Nix Installation Local Machine | Nix Installation Remote Builder | SSH Connection Requirements |
|----|----|----|
| **Multi-user** | **Multi-user** | **Local:**  user ------------SSH----\> **Remote**: *any* user **(most frequent case)** |
| Single-user | Multi-user | **Local:** *Your* single-user -----SSH----\> **Remote**: *any* user |
| Multi-user | Single-user | **Local:**  user ------------SSH----\> **Remote**: *your* single-user for which Nix is installed with their UID (see [Nix manual page](https://nixos.org/manual/nix/stable/installation/single-user.html)). |
| Single-user | Single-user | **Local:** *Your* single-user -----SSH----\> **Remote**: *your single-user* each of which Nix is installed for with their UID (see [Nix manual page](https://nixos.org/manual/nix/stable/installation/single-user.html)). |

The thing to know about the **"Multi-user"** installation is that **Nix is installed with a "nix-daemon" background process that runs as root** and actually manages the builds on your behalf. So when you call **"nix build ..." as a non-root user, this is delegated to the nix-daemon** process, which runs as root. And this process can further delegate the build to a remote builder; that's why the **local machine's root user** needs the SSH access.

An alternative check is:

The following sections guide you how to setup such authentication, with security in mind, and maximal comfort, assuming basic knowledge about SSH authentication keys.

### General best practices

It is recommended to not allow access to the remote machine, even if only via an SSH public/private key pair. Especially because it's not required in any of the 4 scenarios described in the table above.

In all of the cases above it is recommended to create an SSH public / private key pair without a passphrase, so that you won't have to run along with prior to using the remote builder. When the local machine has NixOS / System-wide installation of Nix you'd probably need to spawn while you are logged in as . Not using a passphrase for the SSH key allows other users to enjoy the remote builder.

Since the access to the remote machine doesn't have to be privileged, you can choose to login to a weakly privileged, and password-locked user on the remote machine, which may help you feel comfortable with the fact can access it without a passphrase.

When the remote machine doesn't have NixOS / System-wide Nix installation, the only option is to allow access without passphrase and with an SSH key to the user with Nix installed for them.

### Recommended setup: multi-user Nix local –\> multi-user Nix remote

For the common case where your local Nix is installed system-wide in multi-user mode, create a user on the **remote** machine that will have an unwriteable home directory, with a in it, that will allow SSH access to that user without a passphrase. The steps are:

- to the remote builder.

- Run (requires privileges) ; makes sure a home directory is created for the user.

- Run (requires privileges) ; locks the user such that nobody will be able to to it

- Run (requires privileges) . Make sure to run this command as user or it afterwards

If your **remote builder** has Nix installed system-wide in multi-user mode, but you're not running NixOS, **you may need to add something like the following to your** on this remote machine:

Explanation: This extends the variable on your remote builder for your ssh connection such that the installed Nix tools like can be found on this remote builder when connecting through ssh from your local machine. Otherwise you will get an error on your local machine like "ssh.. nix-store: command not found". The reason is that the Nix ssh connection uses an "non-interactive" shell on the remote builder that doesn't load any files like a normal "interactive" shell would do, when connect manually.

Then, **on your local machine**, create the private / public key pair without a passphrase, as root:

Copy the contents of **from your local machine** to **the remote builder** .

Then to further harden the setup, remove write permissions from everyone **on the remote host**'s home directory:

Now you want to make it easy for on **your local machine** to connect to . You can do that by creating the following on the **local** machine:

You may also want to make nix on **the remote machine** trust that new user by adding it to if it's using NixOS, or by manually adding `trusted-users = nixremote` to .

## Modify the local machine's Nix config to know about the remote machine.

The Nix package manager **on your local machine** **needs to know that the remote builder exists** and what its *supported features* are. See [official supportedFeatures documentation](https://nixos.org/manual/nix/stable/command-ref/conf-file#conf-system-features).

If your **local machine** uses NixOS, you can mention the remote builder within a NixOS [](https://search.nixos.org/options?channel=unstable&from=0&size=15&sort=relevance&type=packages&query=nix.buildmachine) section. For example:

#### Remote builders' features

Each builder is declared with a set of `supportedFeatures`. When a builder lacks one of the `requiredSystemFeatures` of a derivation, it will be ignored. Here are some features used in nixpkgs:

| Feature | Derivations requiring it |
|----|----|
| `kvm` | Everything which builds inside a vm, like NixOS tests |
| `nixos-test` | Machine can run NixOS tests |
| `big-parallel` | kernel config, libreoffice, evolution, llvm and chromium |
| `benchmark` | Machine can generate metrics (means the builds usually takes the same amount of time) |

### Non-standard Nix installations

If you are not root on the remote builder and have used **nix-user-chroot** or **PRoot** to install nix there (see <a href="Nix_Installation_Guide" class="wikilink" title="Nix Installation Guide">Nix Installation Guide</a>) then nix is not available on the PATH of the remote builder. We describe a solution for nix-user-chroot which is easily adapted to PRoot.

- Create a script `~/bin/nix_wrapper.sh` as follows:

``` sh
#!/bin/sh
exec ~/bin/nix-user-chroot ~/.nix bash -c '
. ~/.nix-profile/etc/profile.d/nix.sh
exec $SSH_ORIGINAL_COMMAND
'
```

Of course, adapt this script to the location of the store and nix-user-chroot. Make the script executable.

- In `~/.ssh/authorized_keys`, locate the line corresponding to `~/.ssh/nixremote.pub` and prepend this: `command="/home/something/bin/nix_wrapper.sh"`.

Now ssh will transparently run nix-user-chroot when you connect to the remote builder with the specified ssh key.

## Further use of remote builders

#### Force builds on remote builder

Your local machine is also a builder, so when connecting to remote builders fails, Nix will fall back to building locally. To never use the local machine, set the `--max-jobs `<n>`/-j`<n> Nix option to 0 as follows:

#### Using remote builders as substituters

If you have two remote builders A and B (where A has higher speed than B), if a derivation foo.drv is already built on B, and your local machine needs to build foo.drv, then it will:

- build (possibly remotely) all the build dependencies of foo.drv
- build foo.drv on A

Even if foo.drv is also on A, you will still have to build the build dependencies of foo.drv before sending the build to A, which will build it instantly since it is in cache.

To solve this problem, you can set up your remote builders as substituters. Every time (the local machine's) nix considers building a derivation, it will connect to the remote builders to check whether it is already available there. Here is how to set this up via ssh. See also <a href="Binary_Cache" class="wikilink" title="Binary Cache">Binary Cache</a> for an alternative using http and nix-serve.

1\. On the remote builder, create a binary cache key: The private key must be readable only by the user running the build: ??? on multi-user installs, and the owner of /nix on single-user installs. `builder-name` is only here for your convenience to distinguish several public keys, it has no functional meaning.

2\. On the remote builder, set up nix to sign all store paths it builds: in the nix configuration (`/etc/nix/nix.conf` on multi-user installs and `~/.config/nix/nix.conf` on single user installs), add the following line: If necessary, restart the nix daemon.

3\. The previous point does not retroactively sign existing paths in the store of the builder. To do so, run

4\. In the nix configuration of the local machine, append the content of `cache-pub-key.pem` to the option `trusted-public-keys`. Also append `ssh-ng://builder` to the option `substituters`. If you only want to use the remote builder occasionally as a substituter, use `trusted-substituters` instead of `substituters`. Then, when you want to use the builder, pass `--option extra-substituters ssh-ng://builder` to the nix command you run.

## Troubleshooting

- How do I know if I'm distributing my build at all?
  - Run `nix build` with `--max-jobs 0`.
- How do I know why my builds aren't being distributed?
  - Run `nix build -vvvvvvvvv 2>&1 | less` and search for `decline`.
- I can `nix store ping` but the build doesn't distribute.
  - If on NixOS, Check that `nix store ping` command works when run as root.
  - If you configured builders on the command line (with `--builders`), make sure your account is in `nix.trustedUsers` in `/etc/nixos/configuration.nix`. Only `/etc/nix/nix.conf` is taken into account otherwise.
- I can ping the store as root, but I'm getting "broken pipe" errors when trying to distribute.
  - You may have hit bug . Add `nix.distributedBuilds = true;` to `configuration.nix` and `nixos-rebuild switch`.

## Tips and tricks

### One-time remote build

For a quick, one-time remote build without needing to change any system settings, see <a href="Nixos-rebuild#Deploying_on_other_machines" class="wikilink" title="Nixos-rebuild#Deploying_on_other_machines">Nixos-rebuild#Deploying_on_other_machines</a>.

## See also

- [The NixOS Remote Builds Test Case](https://github.com/NixOS/nix/blob/a6e6da3b0c579fc540acb00748fe3fd1858b9d99/tests/nixos/remote-builds.nix#L11-L21)
- [Mail to nixos-dev about setting up remote builds by Russell O'Connor](https://nixos.org/nix-dev/2015-September/018255.html)
- [A step-by-step guide on remote Firefox building through bastion host](https://gist.github.com/danbst/09c3f6cd235ae11ccd03215d4542f7e7)
- [Offloading NixOS builds to a faster machine](https://sgt.hootr.club/molten-matter/nix-distributed-builds/)
- [Run a qemu Linux builder on macOS](https://nixos.org/manual/nixpkgs/unstable/#sec-darwin-builder)

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>
