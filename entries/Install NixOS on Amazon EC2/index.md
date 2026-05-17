<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Amazon EC2 -->

<languages /> <translate> Amazon EC2 is a widely used cloud deployment platform that is part of Amazon Web Services (AWS). NixOS largely supports the platform through AMIs and the [nixos-generators](https://github.com/nix-community/nixos-generators) project.

## Public NixOS AMIs

A list of NixOS AMI's available on AWS is located [here](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/amazon-ec2-amis.nix) and for a more up to date list: [here](https://nixos.github.io/amis/) (cf. [this discourse thread](https://discourse.nixos.org/t/ami-for-nixos-23-11/36860/7)).

The default user for these AMI's is `root`. There isn't a default password, instead authentication is done by using the SSH key selected during the EC2 creation process.

## Creating a NixOS AMI

The [nixos-generators](https://github.com/nix-community/nixos-generators) project is currently the best method to create your own NixOS AMI. Follow the directions provided by `nixos-generators` & then follow the [instructions provided by AWS](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html).

## Additional Resources

[Building and Importing NixOS AMIs on EC2](http://jackkelly.name/blog/archives/2020/08/30/building_and_importing_nixos_amis_on_ec2/) by Jack Kelly

## Troubleshooting

### SSH Asks For Password

When connecting to a newly launched EC2 instance via SSH, it may ask for a password. This seems to be because the `amazon-init` systemd service is still reading user data. Back out of the current SSH attempt and try again in a few minutes. </translate>

<a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
