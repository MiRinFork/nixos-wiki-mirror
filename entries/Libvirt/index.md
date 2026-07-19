<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Libvirt -->

[libvirt](https://libvirt.org) is a toolkit to interact with the virtualization capabilities of recent versions of Linux (and other OSes). It does so by providing a common API to different virtualization backends.

## Setup

Enable libvirt daemon

To enable local user access to libvirt, for example by using <a href="virt-manager" class="wikilink" title="virt-manager"><code>virt-manager</code></a> or `gnome-boxes`, add yourself to the `libvirtd` group

## Configuration

### UEFI with OVMF

See [this tutorial](https://ostechnix.com/enable-uefi-support-for-kvm-virtual-machines-in-linux/) on how to run a guest machine in UEFI mode using `virt-manager`.

### Nested virtualization

If you would like to enable nested virtualization for your guests to run KVM hypervisors inside them, you should enable it as follows: , for example:

### Networking

#### Default networking

Enable and start the default network using the following commands:

``` console
# virsh net-autostart default
# virsh net-start default
```

This will configure the default network to start automatically on boot and immediately activate it. You may need to whitelist the interface for the firewall like so:

#### Bridge networking

Create a XML file called `virbr0.xml` with the definition of the bridge interface.

``` xml
<network>
  <name>virbr0</name>
  <forward mode='bridge'/>
  <bridge name='virbr0'/>
</network>
```

Add and enable bridge interface.

``` console
# virsh net-define virbr0.xml
# virsh net-start virbr0
# ip link add virbr0 type bridge
# ip address ad dev virbr0 10.25.0.1/24
# ip link set dev virbr0 up
```

Edit the libvirt guest `my_guest` XML file and add the bridge interface to it.

``` console
$ virsh edit my_guest
```

Add:

``` xml
<devices>
  [...]
  <interface type='bridge'>
    <mac address='52:54:00:12:34:56'/>
    <source bridge='virbr0'/>
    <model type='virtio'/>
    <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
  </interface>
  [...]
</devices>
```

Inside the guest configure networking for the interface `enp1s0` (name may differ).

The host should now be able to reach the guest via the bridge interface and vice versa.

### File sharing via virtiofs mount

One of the best ways to share a host directory with the guest OS is with [virtiofs](https://virtio-fs.gitlab.io/). On the host system, install the `virtiofsd` package:

``` nix
environment.systemPackages = with pkgs; [
  guestfs-tools
  virtiofsd
];
```

Next, a few sections of the XML must be edited, which can be done manually or via virt-manager in the guest configuration GUI. If using virt-manager, first navigate on the toolbar to Edit \> Preferences \> General, and click "Enable XML Editing". Next, open the virtual machine and under the hardware configuration, navigate to Memory and check the box "Enable shared memory". This will add an "access" block to the XML for you, similar to this:

``` xml
<memory unit="KiB">1638400</memory>
<currentMemory unit="KiB">1638400</currentMemory>
<memoryBacking>
  <source type="memfd"/>
  <access mode="shared"/>
</memoryBacking>
```

While still in the hardware configuration, click "Add Hardware" and select "Filesystem". For driver, select "virtiofs". For source path, input the folder on the host machine you wish to share, no trailing slash. For target path, don't put a path but instead a tag/label that is easily identifiable. It will be used in the mount options in the guest OS setup shortly. Once done, you should have a new Filesystem device configuration similar to this:

``` xml
<filesystem type="mount" accessmode="passthrough">
  <driver type="virtiofs"/>
  <binary path="/run/current-system/sw/bin/virtiofsd"/>
  <source dir="/media"/>
  <target dir="my_host_media_share"/>
  <alias name="fs0"/>
  <address type="pci" domain="0x0000" bus="0x07" slot="0x00" function="0x0"/>
</filesystem>
```

If your guest system is using NixOS, you can boot the system and add the new filesystem entry to auto-mount on boot and you're done:

``` nix
fileSystems."/media" = {
  device = "my_host_media_share";
  fsType = "virtiofs";
};
```

If the system fails to fully reboot after applying the changes, ensure the filesystem device matches the "Target path" in your XML exactly.

#### Error starting domain: internal error: Child process (/run/current-system/sw/bin/virtiofsd --print-capabilities) unexpected exit status 127: libvirt:  error : cannot execute binary /run/current-system/sw/bin/virtiofsd: No such file or directory

This error means virtiofsd was not installed on the host system. Ensure the system package was installed before making changes in virt-manager.

#### Error starting domain: operation failed: Unable to find a satisfying virtiofsd

The virtiofsd binary path needs to be specified in the filesystem configuration. virt-manager doesn't add this by default and instead assumes a default path that doesn't exist under NixOS. Open the guest machine's hardware details page, click on the passthrough filesystem created earlier, open the XML tab and inside the \`<filesystem>...</filesystem>\` add the following element to tell virtio where to find the virtiofsd binary:

``` xml
<binary path="/run/current-system/sw/bin/virtiofsd"/>
```

### File sharing via WebDAV

Another recommended way to share files between host and guest is to use `spice-webdavd`.

Shutdown the client, in this example named `my_guest`, and edit the libvirt XML file.

``` console
$ virsh edit my_guest
```

Add the following snippet after <channel type='unix'>`[...]`</channel> part inside the devices subsection:

``` xml
<channel type='spiceport'>
  <source channel='org.spice-space.webdav.0'/>
  <target type='virtio' name='org.spice-space.webdav.0'/>
  <address type='virtio-serial' controller='0' bus='0' port='3'/>
</channel>
```

Start the guest machine. Inside the guest, add following part to your system configuration and apply it.

List available shares for the guest.

``` console
$ curl localhost:9843
```

Mount an example share called `myshare` to the mountpoint `myshare.`

### Hooks

Libvirt allows the use of hooks to run custom scripts during specific events, such as daemon lifecycle events, domain lifecycle events, and network events. On NixOS, you can configure hooks via the NixOS module to automate the placement of hook scripts in the appropriate directories.

The following directories are used for placing hook scripts:

- **`/var/lib/libvirt/hooks/daemon.d/`** Scripts here are triggered by daemon events like start, shutdown, and SIGHUP.
- **`/var/lib/libvirt/hooks/qemu.d/`** Scripts for handling QEMU domain events such as begin, end, and migration.
- **`/var/lib/libvirt/hooks/lxc.d/`** Scripts for LXC container events like begin and end.
- **`/var/lib/libvirt/hooks/libxl.d/`** Scripts for Xen domains managed by `libxl` (begin/end events).
- **`/var/lib/libvirt/hooks/network.d/`** Scripts triggered by network events such as begin and end.

See the [libvirt documentation](https://libvirt.org/hooks.html) for more information.

An example config would be:

``` nix
{
  virtualisation.libvirtd.hooks = {
    daemon = {
      "example" = ./scripts/daemon-example.sh;
    };
    qemu = {
      "example" = ./scripts/qemu-example.sh;
    };
    network = {
      "example" = ./scripts/network-example.sh;
    };
  };
}
```

Note that after you added the configuration and switch, you'll have the following command to setup the hooks.

``` console
$ systemctl start libvirtd-config.service
```

### PCI Passthrough

For detailed instructions on configuring PCI passthrough with libvirt, refer to the <a href="PCI_passthrough" class="wikilink" title="PCI passthrough">PCI passthrough</a> page.

## Clients

NixOS provides some packages that can make use of libvirt or are useful with libvirt.

### libguestfs

[libguestfs](http://libguestfs.org/) is a set of tools for accessing and modifying virtual machines disk images.

Following are notes regarding the use of some of those tools

#### error: cannot find any suitable libguestfs supermin

Use use the package libguestfs-with-appliance. See <https://github.com/NixOS/nixpkgs/issues/37540>

### guestfs-tools

Includes virt-sysprep, used to prepare a VM image for use. Review the manpage of virt-sysprep, virt-clone, and virt-builder.

#### `virt-builder`

virt-builder is installed with `guestfs-tools`, but has some issues from its packaging.

It is possible to work around those issues without modifying the package (when a pristine nixpkgs is needed).

``` shell-session
$ mkdir -p ~/.config/virt-builder
$ cd ~/.config/virt-builder
$ ln -s /run/current-system/sw/etc/xdg/virt-builder/repos.d
$ cd ~/.config
$ ln -s virt-builder/ .virt-builder-wrapped
```

This will make your user use the shipped repo configurations, and works around the fact that virt-builder reads its executable name to build its configuration path. The executable being wrapped, it is named differently.

### NixVirt

[NixVirt](https://github.com/AshleyYakeley/NixVirt) is a flake that provides NixOS and Home Manager modules for setting up libvirt domains, networks and pools declaratively.

### Accessing QEMU VMs through Webbrowser

I have a need that I can access some created VMs through a web browser. There's several SPICE html5 clients out there one from EyeOS works the best in my opinon.

In order to access the VM in a browser, we need to do several things.

#### Make VM SPICE accessible

In virt-manager (or whatever tool you use) you can add the Spice server as display. In virt-manager it's the `Graphics` new hardware. However - at least in virt-manager - you can't set everything as it needs to be. So after adding the Spice server through virt-manager, fire up your console and edit the xml file using `virsh edit {vmname}`.

Go to the graphics section and edit your you entry to something like this:

``` xml
<graphics type='spice' port='5900' autoport='no' listen='0.0.0.0' keymap='de-ch' defaultMode='insecure'>
  <listen type='address' address='0.0.0.0'/>
  <image compression='auto_lz'/>
</graphics>
```

#### Add Websockify

Since libvirt doesn't support websockets on its own, we'll need to add `websockify` to your configuration.nix

``` nix
services.networking.websockify = {
  enable = true;
  sslCert = "/https-cert.pem";
  sslKey = "/https-key.pem";
  portMap = {
    "5959" = 5900;
  };
};
```

The port mapping 5959 -\> 5900 is the websocket forward from nginx 5959 to the spice server. If you used another port for the spice server, then adjust accordingly.

Also, I use letsencrypt dns mode to get https cert and key. Nginx i nixos can get the certs on its own. Since I use the same certs also for other things, I just put them in the root (/) folder. Use what is best for you.

#### Get EyeOS Spice Web Client

As said, the experience with the EyeOS Spice Web Client has been the best so far. Another client would be the [spice-html5](https://gitlab.freedesktop.org/spice/spice-html5/) from freedesktop.org.

1\. Download the [EyeOS Spice Web Client](https://github.com/eyeos/spice-web-client/) and unpack it (if necessary) or , as example, just `git clone `[`https://github.com/eyeos/spice-web-client/`](https://github.com/eyeos/spice-web-client/)` /var/www/spice`

2\. Once downloaded (and unpacked), edit the run.js file and search for `'ws'` (around line 213) and change it to `'wss'`

#### Setup nginx for access

As last part, you'll need to setup nginx so serve files from the EyeOS Spice Web Client and use websockify to communicate with the VM.

``` nix
services.nginx = {
  enable = true;
  virtualHosts."mydomain.tld" = {
    forceSSL = true;
    root = "/var/www/";
    locations."/spice/" = {
      index = "index.html index.htm";
    };
    locations."/websockify/" = {
      proxyWebsockets = true;
      proxyPass = "https://127.0.0.1:5959";
      extraConfig = ''
        proxy_read_timeout 61s;
        proxy_buffering off;
      '';
    };
    sslCertificate = "/https-cert.pem";
    sslCertificateKey = "/https-key.pem";
    listen = [ { addr = "*"; port = 45000; ssl = true; } ];
  };
};
```

So, in the above example we access the nginx installation on port 45000 (use whatever you want, you could also just use normal ports like 80/445). We tell it to use port 5959 for websockify which is mapped to port 5900. And we tell it to access the mydomain.tld/spice folder as `/var/www/spice` (where we did download the EyeOS Spice Web Client to).

#### Access the VM through the browser

In order to access the VM through the browser, you'll also need to open ports in your firewall (port for nginx, websockify and spice; 4500, 5959, 5900 in the example).

Then you'll need to start the vm, you can do it by sshing into the computer and run `virsh start {vmname}`.

And finally you can access the VMs GUI through [`https://mydomain.tld:4500/spice/index.html?host=mydomain.tld&port=5959`](https://mydomain.tld:4500/spice/index.html?host=mydomain.tld&port=5959)

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
