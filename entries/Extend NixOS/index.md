<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Extend NixOS -->

This tutorial shows how to extend a NixOS configuration to include custom <a href="systemd" class="wikilink" title="systemd">systemd</a> units, by creating a <a href="systemd" class="wikilink" title="systemd">systemd</a> unit that initializes IRC client every time a system session starts. Beginning by adding functionality directly to a file, it then shows how to abstract the functionality into a separate NixOS <a href="module" class="wikilink" title="module">module</a>.

# The Problem

We want to start up an IRC client whenever a user logs into/starts their session.

It is possible to find a variety of different ways to do this, but a simple modern approach that fits well within NixOS's <a href="Declarative_model" class="wikilink" title="Declarative model">Declarative model</a> is to declare a unit which initializes the IRC client upon session login by a user.

Assume that our IRC client is as the IRC client. We'll run it inside a [screen](https://wiki.archlinux.org/title/GNU_Screen) daemon, which apart from allowing us to [multiplex](https://en.wikipedia.org/wiki/Terminal_multiplexer) our terminal sessions, also enables the IRC session to continue even after we log out of our shell session.

Note that due to the details of systemd, the service we create will run \*per user\*, not \*per session\*.

# Some helpful links

This article assumes some familiarity with <a href="systemd" class="wikilink" title="systemd">systemd</a>, and <a href="NixOS_options" class="wikilink" title="NixOS options">NixOS options</a>. The following links will be helpful for providing this background:

- General overviews of : [from RedHat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/chap-managing_services_with_systemd), [the Arch Linux Wiki](https://wiki.archlinux.org/title/Systemd), [tutorial from Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units)
- [systemd man pages](https://www.freedesktop.org/software/systemd/man/latest/systemd.html#)
- NixOS <a href="modules" class="wikilink" title="modules">modules</a>
- use <a href="NixOS_search" class="wikilink" title="NixOS Search">NixOS Search</a> and [NixOS Manual: List of Options](https://nixos.org/nixos/manual/options.html) to look up more information about specific module options that we use

# Implementations

## Quick Implementation

NixOS provides [a systemd module](https://search.nixos.org/options?show=systemd) with a wide variety of configuration options. A small number of those (which you can check out on <a href="NixOS_search" class="wikilink" title="NixOS search">NixOS search</a>) allows us to implement this little snippet within our :

``` nix
 # pkgs is used to fetch screen & irssi.
 {pkgs, ...}: 
 {
   # ircSession is the name of the new service we'll be creating
   systemd.services.ircSession = {
      # this service is "wanted by" (see systemd man pages, or other tutorials) the system 
      # level that allows multiple users to login and interact with the machine non-graphically 
      # (see the Red Hat tutorial or Arch Linux Wiki for more information on what each target means) 
      # this is the "node" in the systemd dependency graph that will run the service
      wantedBy = [ "multi-user.target" ];
      # systemd service unit declarations involve specifying dependencies and order of execution
      # of systemd nodes; here we are saying that we want our service to start after the network has 
      # set up (as our IRC client needs to relay over the network)
      after = [ "network.target" ];
      description = "Start the irc client of username.";
      serviceConfig = {
        # see systemd man pages for more information on the various options for "Type": "notify"
        # specifies that this is a service that waits for notification from its predecessor (declared in
        # `after=`) before starting
        Type = "notify";
        # username that systemd will look for; if it exists, it will start a service associated with that user
        User = "username";
        # the command to execute when the service starts up 
        ExecStart = ''${pkgs.screen}/bin/screen -dmS irc ${pkgs.irssi}/bin/irssi''; 
        # and the command to execute         
        ExecStop = ''${pkgs.screen}/bin/screen -S irc -X quit'';
      };
   };
 
   environment.systemPackages = [ pkgs.screen ];
 
   # ... usual configuration ...
 }
```

What does this do?

- `systemd.services.ircSession` option adds our new service to the module's [attribute set](https://search.nixos.org/options?channel=unstable&show=systemd.services&from=0&size=50&sort=relevance&type=packages&query=systemd.service).

<!-- -->

- The comments explain the various configuration steps declaring the definition of the new service. As you can see, we configure it to start when the network connects, and to execute a shell command.

After rebuilding the NixOS configuration with this file, our IRC session should start when our network connects. The IRC session is started as a child to the screen daemon, which is independent of any user's session and will continue running when we log out. To connect to the IRC session, we SSH into the system, reconnect to the screen session, and choose the IRC window. Here's the command:

{{ ic \| \# ssh username@my-server -t screen -d -R irc }}

## Conditional Implementation

Suppose we want to share this functionality with your second computer, which is a similar NixOS system. The computers are very similar, so we can reuse most of the configuration file. How do we use the same configuration file, but change behavior depending on the host system? One way is to assume the "hostname" of each system is unique. If the hostname is X, we enable the service, and if it is Y, we disable it.

We can use the `mkIf` function in the `configuration.nix` file to add conditional behavior. Here's the new implementation:

``` nix
 {config, pkgs, lib, ...}:
 
 {
   systemd.services = lib.mkIf (config.networking.hostName == "my-server") {
      ircSession = {
        wantedBy = [ "multi-user.target" ]; 
        after = [ "network.target" ];
        description = "Start the irc client of username.";
        serviceConfig = {
          Type = "forking";
          User = "username";
          ExecStart = ''${pkgs.screen}/bin/screen -dmS irc ${pkgs.irssi}/bin/irssi'';         
          ExecStop = ''${pkgs.screen}/bin/screen -S irc -X quit'';
        };
      };
   };
 
   environment.systemPackages = lib.mkIf (config.networking.hostName == "my-server") [ pkgs.screen ];
 
   # ... usual configuration ...
 }
```

This works, but if we use too many conditionals, our code will become difficult to read and modify. For example, what do we do when we want to change the hostname?

## Modular Configuration

To avoid using conditional expressions in our `configuration.nix` file, we can separate these properties into units and blend them together differently for each host. Nix allows us to do this with the `imports` attribute (see [NixOS Manual: Modularity](https://nixos.org/nixos/manual/index.html#sec-modularity)) to separate each concern into its own file. One way to organize this is to place common properties in the `configuration.nix` file and move the the IRC-related properties into an `irc-client.nix` file.

If we move the IRC stuff into the `irc-client.nix` file, we change the `configuration.nix` file like this:

``` nix
 {
   imports = [
     ./irc-client.nix
   ];
 
   # ... usual configuration ...
 }
```

The `irc-client.nix` file will, of course, look like this:

``` nix
 {config, pkgs, lib, ...}:
 
 lib.mkIf (config.networking.hostName == "my-server") {
   systemd.services.ircSession = {
      wantedBy = [ "multi-user.target" ]; 
      after = [ "network.target" ];
      description = "Start the irc client of username.";
      serviceConfig = {
        Type = "forking";
        User = "username";
        ExecStart = ''${pkgs.screen}/bin/screen -dmS irc ${pkgs.irssi}/bin/irssi'';         
        ExecStop = ''${pkgs.screen}/bin/screen -S irc -X quit'';
      };
   };
 
   environment.systemPackages = [ pkgs.screen ];
}
```

If we organize our configuration like this, sharing it across machines is easier. In addition, our IRC client can be consistent across machines that choose to use it.

## Generic Module Configuration

Our IRC module is pretty useful, so we tell our friends on IRC about it. Now, they want to use our module. We still have our hostname hard-coded in our module, which isn't useful to our friends. We should remove stuff like this from our module before we distribute it to our friends. We should add a parameter so a user can pass their hostname to our module. How do we add a parameter to a module?

NixOS supports this idea, but it is called "options". We can add options to our module for both the condition and the username. Here is what a `irc-client.nix` module with parameters/options looks like:

``` nix
 {config, pkgs, lib, ...}:
 
 let
   cfg = config.services.ircClient;
 in
 
 with lib;
 
 {
   options = {
     services.ircClient = {
       enable = mkOption {
         default = false;
         type = with types; bool;
         description = ''
           Start an irc client for a user.
         '';
       };
 
       user = mkOption {
         default = "username";
         type = with types; uniq string;
         description = ''
           Name of the user.
         '';
       };
     };
   };
 
   config = mkIf cfg.enable {
     systemd.services.ircSession = {
       wantedBy = [ "multi-user.target" ]; 
       after = [ "network.target" ];
       description = "Start the irc client of username.";
       serviceConfig = {
         Type = "forking";
         User = "${cfg.user}";
         ExecStart = ''${pkgs.screen}/bin/screen -dmS irc ${pkgs.irssi}/bin/irssi'';         
         ExecStop = ''${pkgs.screen}/bin/screen -S irc -X quit'';
       };
     };
 
     environment.systemPackages = [ pkgs.screen ];
   };
 }
```

This module is now independent of the system. Now, we must update our `configuration.nix` file to pass our condition and hostname into our new module.

``` nix
{config, ...}:

 {
   imports = [
     ./irc-client.nix
   ];
 
   services.ircClient.enable = config.networking.hostName == "my-server";
   services.ircClient.user = "username";
 
   # ... usual configuration ...
 }
```

# Testing Configuration Changes in a VM

Creating or modifying a NixOS configuration can be trial-and-error. Rather than change our working system on each configuration change, we can build it completely inside a VM, which is much safer.

To see how this works, create a file like this:

``` nix
 {config, pkgs, ...}:
 {
   # You need to configure a root filesytem
   fileSystems."/".label = "vmdisk";
 
   # The test vm name is based on the hostname, so it's nice to set one
   networking.hostName = "vmhost"; 
 
   # Add a test user who can sudo to the root account for debugging
   users.extraUsers.vm = {
     password = "vm";
     shell = "${pkgs.bash}/bin/bash";
     group = "wheel";
   };
   security.sudo = {
     enable = true;
     wheelNeedsPassword = false;
   };
 
   # Enable your new service!
   services =  {
     myNewService = {
       enable = true;
     };
   };
 }
```

Then, we build the new configuration inside a VM. If we named the above file `vmtest.nix`, we can use these commands:

``` console
 # Create a VM from the new configuration.
 $ NIXOS_CONFIG=`pwd`/vmtest.nix nixos-rebuild  -I nixos=/path/to/nixos/ build-vm
 # Then start it.
 $ ./result/bin/run-vmhost-vm
```

# What Next?

This tutorial follows the evolution of NixOS configuration modification, which ends in creating distributable modules.

If you have another tutorial about extending NixOS, add a link below.

- [System Services on NixOS: larrythecow.org (archived)](https://web.archive.org/web/20150331124128/http://larrythecow.org/archives/2011-10-11.html)

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a> <a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
