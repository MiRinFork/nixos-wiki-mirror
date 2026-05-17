<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: User management -->

On NixOS, system users and their properties are declaratively managed through the and options in the NixOS configuration.

For additional details, refer to .

## User Password

User passwords can be defined declaratively by specifying a hashed password in the system configuration. To generate a password hash, run the following command and enter the desired password when prompted: `mkpasswd`

The resulting hash can then be assigned to options within the user definition. Example:

## User Home Directories

By default, user home directories are created at `/home/`<username> when is true.

Custom home directories can be set via the `home` option: `users.users.alice.home = "/data/alice";`

## User Shell Configuration

Login shells can be customized by setting the option.

## User SSH Authorized Keys

SSH authentication can be customized by setting the option.

## Adding User to a group

Users can be added to a group by setting the option. For example:

## Home Manager

For additional user environment configuration, including management of dotfiles, shell settings, and user-specific packages, consider using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
