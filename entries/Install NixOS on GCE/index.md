<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on GCE -->

This is a recipe for creating a NixOS machine on Google Compute Engine (GCE) which is part of [Google Cloud Platform](https://cloud.google.com/).

This tutorial assumes you have already set up and account and project under Google Cloud Platform. We also assume that you have [nix-shell](https://nixos.org/download) and KVM virtualization support, the latter is not available in Google Cloud Shell.

There are no publicly provided images of recent releases of NixOS. There are some old releases at [\<nixpkgs/nixos/modules/virtualisation/gce-images.nix\>](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/gce-images.nix) and in the `gs://nixos-images` and `gs://nixos-cloud-images` public buckets, but these have not been updated in years. Instead, it is recommended you build your own image.

This guide is for people who really need NixOS... not just the Nix package manager. If Nix is all you need, you can install it automatically with a [startup script](https://cloud.google.com/compute/docs/instances/startup-scripts/linux). Debian 12 startup script example:

``` bash
#!/bin/bash
HOME="/root" sh <(curl -L https://nixos.org/nix/install) --daemon --yes
source /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
nix-env -i cowsay
cowsay 'nix is fully operational'
```

## Bootstrapping a NixOS image from the build of your choice

This assumes you have created a Google Cloud project and a Google Cloud Storage bucket that allows public access and uses Fine-grained access control (as opposed to Uniform) in that project. Set them as variables:

``` bash
PROJECT_ID=my-project-id
BUCKET_NAME=my-bucket-name  # Set the bucket name without the gs:// prefix
```

You'll need `gsutil` installed. See the [Google Cloud SDK documentation](https://cloud.google.com/sdk/docs/install-sdk) for full instructions, or simply use:

``` bash
$ nix-shell -p google-cloud-sdk
$ gcloud auth login
[ ... this opens a webpage to authenticate your gcloud SDK, follow the authentication prompt in your browser]
$ gcloud config set project $PROJECT_ID
```

Prepare a local copy of the nixpkgs repository in the state you want to build from. If you want to build a released version, this means checking out one of the release branches from the nixpkgs repository. Make sure you haven't left any unwanted local changes in it. These examples assume you've checked it out at `./nixpkgs`.

``` bash
$ git clone --depth=1 --branch nixos-24.11 https://github.com/NixOS/nixpkgs.git
$ BUCKET_NAME=my_bucket_name nixpkgs/nixos/maintainers/scripts/gce/create-gce.sh
```

This will create an image and upload it to the bucket. It will also create a GCE image that VMs can use.

Warning: this script makes the GCS object and the GCE image world-readable. If you are building from a custom configuration that embeds secrets, you should instead read the contents of the script and build and upload manually, setting your own ACLs.

Note: If you build an image from a commit later then [this one](https://github.com/NixOS/nixpkgs/commit/b894dd8b821d74b25911f63762c24024107d9372), you will need to add `enable-oslogin = "TRUE"` to the instance metadata, to be able to login.

## Create a VM instance

1.  In [the GCE console](https://console.cloud.google.com/compute/instances), select `CREATE INSTANCE`
    1.  <b>Boot disk</b> : <i>Change</i>, then <i>Custom images</i>
        1.  <b>Image</b> : pick the image recently created
    2.  You do not need to add SSH keys, NixOS is set up for [Google OS Login](https://cloud.google.com/compute/docs/instances/managing-instance-access)
    3.  <b>Metadata</b>
        1.  <b>key</b> : <i>enable-oslogin</i>
        2.  <b>value</b> : <i>"TRUE"</i>
2.  Click <b>Create</b>
3.  Wait until your VM instance is ready
4.  Under <i>Connect</i>, click <b>SSH</b>

## Optional: add user account

Once you are logged into your NixOS machine, you can create a user account for yourself with administrator privileges:

1\. chmod u+w /etc/nixos/configuration.nix

2\. nano -w /etc/nixos/configuration.nix

3\. Add the following to the configuration:

``` nix
security.sudo.wheelNeedsPassword = false;
users.extraUsers.<your-username> = {
  createHome = true;
  home = "/home/<your-username>";
  description = "<your-name>";
  group = "users"; 
  extraGroups = [ "wheel" ];
  useDefaultShell = true;
  openssh.authorizedKeys.keys = [ "<contents of your ~/.ssh/id_rsa.pub>" ];
};
```

4\. Save this file and run `nixos-rebuild switch --upgrade`

5\. Reboot and log back in with your user account

## Snapshots

At this point you may want to snapshot this image and use this snapshot to make future VMs.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
