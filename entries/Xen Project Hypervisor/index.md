<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Xen Project Hypervisor -->

![The Xen Project Logo](Xen-project-logo.png "The Xen Project Logo") The <strong>[Xen Project Hypervisor](https://xenproject.org/)</strong> is an open-source type-1 virtual machine manager, which allows multiple virtual machines, known as domains, to run concurrently with the host on the physical machine. This is unlike a typical type-2 hypervisor, such as <a href="QEMU" class="wikilink" title="QEMU">QEMU</a>, where the virtual machines run as applications on top of the host. NixOS runs as the privileged <b>Domain 0</b>, and can paravirtualise or fully virtualise Unprivileged Domains (`domUs`).

Xen is well-known for its [impeccable security record](https://xenbits.xenproject.org/xsa), and is the go-to solution for hyper-scale cloud infrastructures.

## Installation

Since [NixOS 24.11](https://nixos.org/manual/nixos/unstable/release-notes#sec-release-24.11-highlights), installing the Xen Hypervisor is as simple as adding the following to your <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="NixOS configuration">NixOS configuration</a>:

After a successful reboot, you should now be using a Xen kernel, and Xen's usual commands, such as `xl`, will begin working. Right after a fresh boot, there's usually only a single domain (virtual machine) running: the Domain 0.

### About the Domain 0

The Domain 0, generically known as the <b>host machine</b>, is the most important virtual machine in a Xen system. It is responsible for orchestrating the Unprivileged Domains, and housing the <a href="Linux_kernel" class="wikilink" title="Linux kernel">Linux kernel</a> version that interacts with the bare-metal hardware. Here, you can use `libxenlight`, Xen's main interface system, through the aforementioned `xl` command. See the manual page for usage information.

An important security feature of Xen is the ability to disaggregate the responsibilities given to the Domain 0. While it will normally be responsible for hosting Xen's shared database, the Xen Store, this responsibility can instead be assigned to a stubdomain: a special type of lightweight Xen virtual machine that runs a Domain 0 function in an isolated and secure manner.

## Configuration

There are many options available for configuring the Domain 0. Here is a recommended non-default configuration:

## Running VMs

Currently, unprivileged domains can only be created/destroyed imperatively. See the usual [Xen documentation](https://xenbits.xenproject.org/docs/unstable/) for more specific usage information. To get you started, here's an example Xen configuration file that can produce a fully virtualised domain:

See for more configuration options.

You can then start the domain using the following command:

``` console
# xl create /path/to/example-hvm.cfg -Fc
```

If you are interested in managing Xen domains declaratively, please take a look at pull request and everything else tagged with the `declarative libxenlight` title.

## See also

- The option set.
- The [Matrix Room](https://matrix.to/#/#xen:nixos.org) for further community support.

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
