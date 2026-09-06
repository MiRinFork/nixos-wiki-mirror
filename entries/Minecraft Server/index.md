<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Minecraft Server -->

[Minecraft Server](https://minecraft.wiki/w/Server) is a server for the sandbox game <a href="Minecraft" class="wikilink" title="Minecraft">Minecraft</a>. Currently, only servers for the [Java Edition](https://www.minecraft.net/en-us/article/java-or-bedrock-edition) of Minecraft are supported.

## Setup

The minimum example to have a Minecraft server running on localhost at the default port of `25565`. By setting the `eula` option to `true`, you are agreeing to the [Minecraft EULA](https://www.minecraft.net/en-us/eula).

## Configuration

This example is a more thorough declarative configuration that sets a few options including opening the firewall, restricting the server to only whitelisted users and setting the port to `43000`.

You might want to view the [list of all available server properties for the vanilla server](https://minecraft.wiki/w/Server.properties#Keys).

See <a href="#See_also" class="wikilink" title="#See also">#See also</a> for recommended JVM flags for the `jvmOpts` option. These primarily depend on your <a href="Java" class="wikilink" title="Java">Java</a> version.

## Tips and tricks

### Accessing the Minecraft server console

The Minecraft server console allows you to view server logs and issue [commands](https://minecraft.wiki/w/Commands) to the server interactively. The Minecraft server console is <strong>not</strong> directly accessible on NixOS—unlike on non-declarative systems, where running the server through a shell command provides the interactive console to the current terminal.

#### Accessing logs

Since the Minecraft server runs as a systemd service, you can access its stdout through the systemd journal:

`journalctl -eu minecraft-server.service`

The logs are also available in the `logs` subdirectory of the server's data directory, which is configured via `services.minecraft-server.dataDir`. The default value for this option is `/var/lib/minecraft`.

#### Issuing commands

There are two ways to issue commands to the Minecraft server:

1\. Writing to the server’s stdin via its named pipe at `/run/minecraft-server.stdin`:

`echo "say Removed Herobrine" > /run/minecraft-server.stdin`

2\. Using the [server's provided RCON feature](https://minecraft.wiki/w/RCON).

Example minimal configuration:

### Use a different server

To use a specific server version, or another Minecraft server—such as [PaperMC](https://papermc.io/)—change `services.minecraft-server.package` to a nix package that represents your desired server.

For example:

``` nix
services.minecraft-server.package = pkgs.minecraftServers.vanilla-1-12;
```

or

``` nix
services.minecraft-server.package = pkgs.papermc;
```

### Prefer IPv4

To use IPv4 by default, add `-Djava.net.preferIPv4Stack=true` to `jvmOpts`.

## Server.jar

Some mods like [Fabric](https://fabricmc.net/use/server/) or [BTA!](https://www.betterthanadventure.net/installation-guide/), that might not be available through nixpkgs, provide their own `server.jar` files.

*<sup>Make sure to move the `server.jar` file inside a separate directory, or else it might spawn server files where you don't want them.</sup>*

### Server.jar dependencies

In order to run `server.jar` (or any jar file in general), you will need to install *[the appropriate version of Java](https://minecraft.wiki/w/Tutorial:Setting_up_a_Java_Edition_server#Version_requirements) .*

``` nixos
pkgs.jdkX # replace the 'X' with the correct java version number here
```

Now the `server.jar` file is ready to be run :) Add/remove any extra JVM flags as you see fit

``` nixos
java -Xmx4G -jar /path/to/server.jar -nogui
```

*The `-Xmx` flag sets the max memory allocation (here 4GB). The `-nogui` flag disables the minecraft server gui*

## See also

- [nix-minecraft](https://github.com/Infinidoge/nix-minecraft), a <a href="flake" class="wikilink" title="flake">flake</a> based attempt to better support Minecraft related content for the Nix ecosystem. It can be used for more complex server setups, including mods and plugins.
- <https://exa.y2k.diy/garden/jvm-args> for setting additional JVM flags in the `jvmOpts` option. Some server-related software—like the Velocity proxy—have their own recommended JVM flags list.
- <https://mcuuid.net> to get a player's UUID from their current username or vice versa.

<a href="Category:_Applications" class="wikilink" title="Category: Applications">Category: Applications</a> <a href="Category:_Gaming" class="wikilink" title="Category: Gaming">Category: Gaming</a>
