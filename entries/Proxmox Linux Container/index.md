<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Proxmox Linux Container -->

# Building Proxmox Linux Containers with Nix

You can use 'make-system-tarball' to create a Linux Container that can run on Proxmox, for example like <https://codeberg.org/raboof/nix-mastodon-bot/src/branch/main/default.nix#L31>

# NixOS

With a small amount of work, it is possible to use NixOS as a LXC container under Proxmox.

## Generate a container tarball

A better way to deploy a NixOS container tarball on Proxmox is described at <a href="Proxmox_Virtual_Environment#LXC" class="wikilink" title="Proxmox Virtual Environment#LXC">Proxmox Virtual Environment#LXC</a>.

## Finding a container tarball

Go to <https://hydra.nixos.org/project/nixos>, choose a release (small ones don't have the tarball we need), and open its Jobs tab. On that page, search for <strong>nixos.containerTarball</strong>, open the link corresponding to your architecture (probably x86_64). Choose the latest success and click on the number. That is the ID of the result. Under <em>Build products</em>, download the <strong>system-tarball</strong>, which will be named `nixos-system-x86_64-linux.tar.xz`.

Note the Build ID, it will be used when renaming the tarball... right when it's downloaded:

    mv nixos-system-x86_64-linux.tar.xz nixos-${RELEASE}-default_${BUILDID}_amd64.tar.xz

This is a proxmox convention, and is useful to follow.

## Preparing the container

But first, you will need to upload the container tarball to the storage.

Then, once this is done, you will need to access the CLI for the proxmox host. SSH or the web CLI will be fine.

### CLI operations

In the CLI, create a container using the following command. If created as a template, I recommend setting a memorable ID.

    pct create 99999 \
      --description nixos-template \
      local:vztmpl/nixos-${RELEASE}-default_${BUILDID}_amd64.tar.xz \
      -ostype unmanaged \
      -net0 name=eth0 \
      -storage local-lvm

Note that in the previous command, the `-ostype` option is necessary; this way Proxmox will not try to do <em>fancy stuff</em> to the system.

The last step using the CLI, edit `/etc/pve/lxc/99999.conf` to add this line:

    lxc.init.cmd: /sbin/init

Before NixOS version 21.11 it was

    lxc.init.cmd: /init

.

### Creating a template

It is not be possible to use the facilities to create a NixOS container under Proxmox. It is possible, though, to create a template that may be cloned as a base. In the GUI, with the container selected, click the <em>More</em> menu at the top, then <em>Convert to template</em>. Accept.

To create a new NixOS container, you can then clone the template instead of doing the preceding steps.

## Expected issues

### Entering the container by `pct enter`

enter a (nixos) container from the proxmox host

  
``` shell
[root@proxmox:~]# pct enter <vmid>
```

``` shell
sh-5.2#
```

<!-- -->

  
<s>set (missing) environment variables</s>

  
<s>

``` shell
sh-5.2# source /etc/set-environment
```

</s>

<s>

``` shell
sh-5.2#
```

</s>

or

  
set (missing) environment variables with <a href="wikipedia:en:dot_(command)#source" class="wikilink" title="."><code>.</code></a>

  
``` shell
sh-5.2# . /etc/profile
```

``` bash
[root@nixos:~]#
```

If commands (like ls) still can't be found, try running:

::

``` shell
[root@nixos:~] /run/current-system/activate
```

### nixos-rebuild switch

`nixos-rebuild switch` may fail with errors for special mount points. This does not look like it affects the container.

    [root@nixos:/]# nixos-rebuild switch
    building Nix...
    building the system configuration...
    activating the configuration...
    setting up /etc...
    mount: /dev: cannot remount devtmpfs read-write, is write-protected.
    mount: /dev/pts: cannot remount devpts read-write, is write-protected.
    mount: /dev/shm: cannot remount tmpfs read-write, is write-protected.
    mount: /proc: cannot remount proc read-write, is write-protected.
    mount: /run: cannot remount tmpfs read-write, is write-protected.
    mount: /run/keys: cannot mount ramfs read-only.
    mount: /run/wrappers: cannot remount tmpfs read-write, is write-protected.
    setting up tmpfiles
    warning: error(s) occurred while switching to the new configuration

### Black Console in Proxmox

The Proxmox console may appear black when launched. It is at the login prompt but no existing text is rendered. Just type "root" and hit enter and new text will get rendered just fine. If you are still unable to get the console to render, you can try changing the console to \`/dev/console\` instead of the standard tty.
