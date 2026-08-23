<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS friendly hosters -->

<table>
<tbody>
<tr>
<td colspan="2" style="border-top: 0;"><h2>
<p>1st class NixOS support</p>
</h2></td>
</tr>
<tr>
<td><p><a href="https://www.gandi.net/en/cloud/vps">GandiCloud VPS</a></p></td>
<td><p>Start a NixOS server with a single command or by few clicks in the web UI: it is a provided and supported server image.</p></td>
</tr>
<tr>
<td><p><a href="https://rackzar.com">Rackzar.com</a></p></td>
<td><p>South African Hosting Provider offering NixOS on all VPS plans as a drop down OS during checkout.</p></td>
</tr>
<tr>
<td><p><a href="https://servinga.com">servinga</a></p></td>
<td><p>When ordering or configuring, the "Manual Install (Advanced)" option includes NixOS for servers with 4G of ram or more. Installation is done through a web-based console.</p></td>
</tr>
<tr>
<td><p><a href="https://vpsfree.org">vpsFree.cz</a></p></td>
<td><p>A non-profit association providing free as in freedom VPS services for its members. NixOS is available in the registration form and administration interface. See <a href="https://kb.vpsfree.org/manuals/distributions/nixos">NixOS at kb.vpsfree.org</a> for more information. See <a href="https://github.com/vpsfreecz/example-nixops-deployment">nixops example</a> on howto setup a server using nix 2.7 and nixops 2.0.</p></td>
</tr>
<tr>
<td><p><a href="https://crocuda.com">crocuda_vps</a></p></td>
<td><p>Instant NixOs virtual machine delivery with multiple rotating privacy Ipv6. No registration form. You just need a key. Order from your terminal at -&gt; `ssh crocuda.com`.</p></td>
</tr>
<tr>
<td><p><a href="https://www.hostinger.com/vps/nixos-hosting">Hostinger VPS</a></p></td>
<td><p>NixOS is offered as a supported OS template on KVM VPS plans. See the <a href="https://www.hostinger.com/support/1583571-what-are-the-available-operating-systems-for-vps-at-hostinger/">list of available VPS operating systems</a></p></td>
</tr>
<tr>
<td colspan="2"><h2>
<p>Support NixOS via custom ISO</p>
</h2></td>
</tr>
<tr>
<td><p><a href="https://buyvm.net/">BuyVM</a></p></td>
<td><p>BuyVM no longer provides first party support for NixOS. You can install NixOS using the custom ISO functionality, however the resulting install will need some form of static IP configuration.</p></td>
</tr>
<tr>
<td><p><a href="https://www.hetzner.de/">Hetzner Online</a></p></td>
<td><p>From Hetzner's rescue image one can boot into the nixos installer using a custom <a href="https://github.com/nix-community/nixos-images">kexec</a> image. The installation can be fully automated using <a href="https://github.com/numtide/nixos-anywhere">nixos-anywhere</a>. Hetzner also provides an <a href="https://wiki.hetzner.de/index.php/LARA/en#Installing_an_OS">interface</a> to upload your own ISO-images. Also here you may want to build your own iso-image, which has openssh with ssh keys due the lack of a remote console. An easier method to install NixOS on Hetzner, is to use the existing integration into <a href="https://nixos.org/nixops/manual/#idm140737318364240">NixOps</a>. Also see <a href="Install_NixOS_on_Hetzner_Online" class="wikilink" title="Install NixOS on Hetzner Online">Install NixOS on Hetzner Online</a> for future information</p></td>
</tr>
<tr>
<td><p><a href="https://www.hetzner.com/cloud">Hetzner Cloud</a></p></td>
<td><p>Hetzner Cloud has NixOS ISO images that can be mounted on a running instance. When creating the VM, you have to choose a different initial distribution and than select the NixOS under "ISO images" in the VM instance page to reboot into the NixOS installer. An alternative approach is using <a href="https://github.com/numtide/nixos-anywhere">nixos-anywhere</a> than can also use other Linux distributions as a base and convert them into NixOS installation. See also <a href="Install_NixOS_on_Hetzner_Cloud" class="wikilink" title="Install NixOS on Hetzner Cloud">Install NixOS on Hetzner Cloud</a>.</p></td>
</tr>
<tr>
<td><p><a href="https://liteserver.nl/">LiteServer</a></p></td>
<td><p>NixOS ISO is available from the control panel. Also see <a href="Install_NixOS_on_Liteserver" class="wikilink" title="Install NixOS on Liteserver">Install NixOS on Liteserver</a>.</p></td>
</tr>
<tr>
<td><p><a href="https://bandwagonhost.com">BandwagonHost</a></p></td>
<td><p>NixOS ISO is available from the control panel.</p></td>
</tr>
<tr>
<td><p><a href="https://www.netcup.de/">netcup</a></p></td>
<td><p>NixOS ISO can be uploaded via FTP to be available in the server control panel. (in the SCP, navigate to: 'Media' → 'Images') See the <a href="https://www.netcup-wiki.de/wiki/Server_Control_Panel_%28SCP%29#Eigene_DVDs">official netcup documentation</a>. Step-by-step installation instruction can be found here: <a href="https://ersocon.net/articles/setting-up-a-nixos-server-on-netcup~269ec969-fac2-4519-a177-3a79af31948d">NixOS on Netcup</a> (In English). [<a href="https://logs.nix.samueldr.com/nixos/2018-04-13#1523647738-1523650704">https://logs.nix.samueldr.com/nixos/2018-04-13#1523647738-1523650704</a>; It may be necessary] to create a bios-boot partition for grub.</p></td>
</tr>
<tr>
<td><p><a href="https://www.online.net/">Online</a></p></td>
<td><p>A NixOS ISO can be use with iDrac (Dell) or iLo (HP). You can upload your own iso or use <a href="https://virtualmedia.online.net/nixos/">virtualmedia</a>. You must have a Dell or HP server. Here is the <a href="https://documentation.online.net/en/dedicated-server/operating-system/custom-install/start">documentation</a> if you don't know DRAC at Online.</p></td>
</tr>
<tr>
<td><p><a href="https://inceptionhosting.com/">Inception Hosting</a></p></td>
<td><p>Inception hosting no longer provides first party support for NixOS. You can install NixOS using the custom ISO functionality</p></td>
</tr>
<tr>
<td><p><a href="https://www.linode.com/">Linode</a></p></td>
<td><p>no longer provides first party support for NixOS. You can install NixOS using the custom ISO functionality. <a href="https://www.linode.com/docs/tools-reference/custom-kernels-distros/install-nixos-on-linode">Install and Configure NixOS on a Linode</a></p></td>
</tr>
<tr>
<td><p><a href="http://ramnode.com">RamNode</a></p></td>
<td><p>RamNode no longer provides first party support for NixOS. You can install NixOS using the custom ISO functionality.</p></td>
</tr>
<tr>
<td><p><a href="https://www.vultr.com/">Vultr</a></p></td>
<td><p>Vultr no longer provides first party support for NixOS. You can install NixOS using the custom ISO functionality.</p></td>
</tr>
<tr>
<td><p><a href="https://php-friends.de">PHP-Friends</a></p></td>
<td><p>NixOS ISO is available from the control panel.</p></td>
</tr>
<tr>
<td><p><a href="https://cloud.co.za/">Cloud.co.za</a></p></td>
<td><p>NixOS ISO is available from a drop-down menu option when selecting ISO image to mount a image for the CD-ROM device. You may also request their helpful support team to mount a specific ISO image. Using the graphical installation works best as you will need to set the static ip address, gateway and nameserver as provided to gain internet access. During the installation setup and you will configure your login to be password-less in order to access the server via the VNC console. On the first boot, to complete the configuration for the networking (hostname, static ip, gateway, nameservers, etc), the ssh access for your user and lastly remove the password-less login.</p></td>
</tr>
<tr>
<td colspan="2"><h2>
<p>Other means of installation</p>
</h2></td>
</tr>
<tr>
<td><p><a href="https://aws.amazon.com/ec2/">Amazon EC2</a></p></td>
<td><p>See <a href="NixOS_on_Amazon_EC2" class="wikilink" title="NixOS on Amazon EC2">NixOS on Amazon EC2</a></p></td>
</tr>
<tr>
<td><p><a href="https://www.digitalocean.com">DigitalOcean</a></p></td>
<td><p><a href="https://github.com/elitak/nixos-infect">nixos-infect</a> can be used to transform an existing installation into NixOS. This method will be also used in <a href="https://nixos.org/nixops/manual/#sec-deploying-to-digital-ocean">NixOps</a>.</p></td>
</tr>
<tr>
<td><p><a href="https://www.linode.com/">Linode (Akamai Cloud)</a></p></td>
<td><p><a href="https://www.linode.com/docs/guides/install-nixos-on-linode/">Linode Guide</a>.</p></td>
</tr>
<tr>
<td><p><a href="https://www.genesiscloud.com/">Genesis Cloud</a></p></td>
<td><p>After unmounting <code>/boot</code>, <a href="https://github.com/elitak/nixos-infect">nixos-infect</a> can be used to transform an existing Ubuntu 16.04 installation into NixOS. This process can be fully automated (<a href="https://gist.github.com/fadenb/4267f71b858e590a789a1dbaad7b1d09">example</a>) when using the API by supplying the unmount and nixos-infect commands in a custom <a href="https://developers.genesiscloud.com/instances#create-an-instance">startup_script</a>.</p></td>
</tr>
<tr>
<td><p><a href="https://cloud.google.com">Google Cloud Platform</a></p></td>
<td><p>See <a href="Installing_NixOS_on_GCE" class="wikilink" title="Installing NixOS on GCE">Installing NixOS on GCE</a></p></td>
</tr>
<tr>
<td><p><a href="https://www.online.net">Online</a></p></td>
<td><p>See <a href="Install_NixOS_on_Online.Net" class="wikilink" title="Install NixOS on Online.Net">Install NixOS on Online.Net</a></p></td>
</tr>
<tr>
<td><p><a href="https://www.oracle.com/cloud/">Oracle Cloud</a></p></td>
<td><p>See <a href="Install_NixOS_on_Oracle_Cloud" class="wikilink" title="Install NixOS on Oracle Cloud">Install NixOS on Oracle Cloud</a></p></td>
</tr>
<tr>
<td><p><a href="https://www.ovh.com">OVH</a> / <a href="https://www.kimsufi.com">Kimsufi</a> / <a href="https://www.soyoustart.com">So you Start</a></p></td>
<td><p>Blog posts for <a href="https://web.archive.org/web/20210125195352/https://www.srid.ca/137ae172.html">OVH</a> and <a href="https://web.archive.org/web/20160829180041/http://aborsu.github.io/2015/09/26/Install%20NixOS%20on%20So%20You%20Start%20dedicated%20server/">SoYouStart</a></p></td>
</tr>
<tr>
<td><p><a href="https://www.rackspace.com">Rackspace</a></p></td>
<td><p>See <a href="Install_NixOS_on_Rackspace_Cloud_Servers" class="wikilink" title="Install NixOS on Rackspace Cloud Servers">Install NixOS on Rackspace Cloud Servers</a></p></td>
</tr>
<tr>
<td><p><a href="https://www.scaleway.com">Scaleway</a></p></td>
<td><p>The <code>kexec</code> method (see <a href="Install_NixOS_on_Scaleway_X86_Virtual_Cloud_Server" class="wikilink" title="Install NixOS on Scaleway X86 Virtual Cloud Server">Install NixOS on Scaleway X86 Virtual Cloud Server</a>) works well, but bear in mind it only works with the 'virtual' class of servers, as they run under a hypervisor which attaches the disks before the kernel boots. The 'bare-metal' servers rely on a special Linux kernel booting to attach network <code>/dev/nbdX</code> drives which works only with Scaleway supplied images. There is a <a href="https://github.com/scaleway/image-proposals/issues/13">image proposal</a> to add full NixOS support.</p></td>
</tr>
</tbody>
</table>

<h2>

Hoster-agnostic means of installation

</h2>

This section links to or explains methods that can be used on various providers. As always, with unsupported hosts and unsupported distributions, your mileage may vary.

Not all providers allow to upload custom images or provide NixOS images for installation. However there are a few ways to install NixOS anyhow. [nixos-in-place](https://github.com/jeaye/nixos-in-place) and [nixos-infect](https://github.com/elitak/nixos-infect) are generic approaches to install NixOS from an existing Linux. Another approach is to use a kexec-based image as is done with [nixos-anywhere](https://github.com/nix-community/nixos-anywhere). This also allows for changing the underlying filesystem. See <a href="Install_NixOS_on_a_Server_With_a_Different_Filesystem" class="wikilink" title="Install NixOS on a Server With a Different Filesystem">Install NixOS on a Server With a Different Filesystem</a>.

See also the <a href="NixOps" class="wikilink" title="NixOps">NixOps</a> project, which also provides interfaces to different cloud providers.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Community" class="wikilink" title="Category:Community">Category:Community</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Lists" class="wikilink" title="Category:Lists">Category:Lists</a>
