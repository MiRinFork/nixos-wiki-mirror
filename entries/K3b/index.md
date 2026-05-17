<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: K3b -->

From Wikipedia:

> **K3b** (from **KDE Burn Baby Burn**) is a CD, DVD and Blu-ray authoring application by KDE for Unix-like computer operating systems. It provides a graphical user interface to perform most CD/DVD burning tasks like creating an Audio CD from a set of audio files or copying a CD/DVD, as well as more advanced tasks such as burning eMoviX CD/DVDs. It can also perform direct disc-to-disc copies.

<a href="wikipedia:K3b" class="wikilink" title="K3b Wikipedia article">K3b Wikipedia article</a>

## Installation

Add following to your configuration:

``` nix
programs.k3b.enable = true;
```

This will effectively install the software, but there are further configuration changes required before any disc burning can take place.

### `cdrom` group

To allow K3b and the disc writing tools appropriate permissions to the optical drive, the user(s) need to be in the `cdrom` group, as well as the optical drive itself.

#### Adding a user to the `cdrom` group

In your configuration, add `cdrom` to the `extraGroups` of the user:

``` nix
users.users.YourUserHere.extraGroups = [ ... "cdrom" ]
```

#### Adding the optical drive(s) to the `cdrom` group

For the group to have any meaning, the group (and subsequently the users within it will be given the permissions to access the drive.

Add the following to your configuration:

``` nix
services.udev.extraRules = ''
  # Optical Drive access for K3b
  KERNEL=="sr[0-9]*", GROUP="cdrom", MODE="0660"
'';
```

*▶ Tip: This is a multi-line string, which allows for more udev rules down the line.*

`KERNEL=="sr[0-9]*"` matches the device files `sr0` up to `sr9` if you have more than one optical drive to work with.

`GROUP="cdrom"` assigns the device to the group, allowing unprivileged access.

`MODE="0660"` sets read/write permissions to the device for the owner and `cdrom` group

**<u>For the udev rules to apply, your computer needs to be reboot.</u>**

## Post-Installation

After the reboot, open K3b for post installation configuration within the software. ----Within the K3b settings, paths to the external programs have to be tweaked to the ones that work with K3b out of the box in case that hasn't been the case after the installation.

First, navigate to the settings via the toolbar by clicking *"Settings"*, and on the bottom of the list *"Configure K3b..."*.

Alternatively, you can use the shortcut: `Ctrl + Shift + ,`<img src="K3b_Post-Installation_-_Opening_K3b_Configuration_dialog.png" title="1. Open the K3b Configuration dialog|none" width="468" height="468" alt="1. Open the K3b Configuration dialog|none" /> ----Within the settings, the paths for each path must be set in a following priority depending on if they're present:

1.  `/run/wrappers/`
2.  `/run/current-system/`
3.  `/nix/store/`

Under `/run/wrappers/`, the executables have all the permissions necessary to run under K3b. Using paths other than that may cause errors, such as *"**cdrecord has no permission to open the device**"*.

There isn't much difference between using `/run/current-system/` and `/nix/store/`, except that `/run/current-system/` is a link to the current version of the executable and `/nix/store/` directly points to a specific version installed.

Seeing programs that don't have a wrapper or a `current-system` link doesn't necessarily mean that there's something wrong however. Everything should work fine regardless. <img src="K3b_Post-Installation_-_Setup_External_Programs.png" title="2. Set the paths to the proper programs |none" width="564" height="564" alt="2. Set the paths to the proper programs |none" /> ----The permissions the external programs have are very important, as they may not have the access to the optical drive(s) to perform the operations.

If there are any programs listed under the *"Permissions"* tab that have *"New permissions"* listed that aren't *"no change"*, it may be wise to remount `/nix/store/` to change the permissions to make sure that things are set.

Run this line in your shell to remount `/nix/store/` with read/write permissions so that K3b can change these if necessary:

``` bash
sudo mount -o remount,rw /nix/store
```

Then click *"Change Permissions..."*. A dialog for the superuser password will open, and after entering it, the permissions to the programs will be set to the correct values.

In case of any permission issues later on, this step can be done more than once.<img src="K3b_Post-Installation_-_Setting_external_program_permissons.png" title="3. Check and set the permissions of the external programs as necessary|none" width="564" height="564" alt="3. Check and set the permissions of the external programs as necessary|none" />

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:KDE" class="wikilink" title="Category:KDE">Category:KDE</a>
