<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Minecraft -->

[Minecraft](https://www.minecraft.net/about-minecraft) is a sandbox game about building, surviving, fighting, and being creative, developed by Mojang Studios.[^1] [Minecraft](https://www.minecraft.net/about-minecraft) currently has two supported variants known as:

- **Minecraft: Java Edition**, which is only available on Windows, MacOS, and Linux, and is known for modding.
- **Minecraft: Bedrock Edition**, which is available on Windows, Xbox One, Xbox Series S and X, PlayStation 4 and 5, Nintendo Switch, Android, and iOS. Bedrock is not playable on Linux due to UWP applications not being supported on Linux.[^2][^3]

## Launchers

**Official Minecraft Launcher:** [Website](https://www.minecraft.net/download) —

**<a href="Prism_Launcher" class="wikilink" title="Prism Launcher">Prism Launcher</a>:** A free, open source launcher. [Website](https://prismlauncher.org/) —

**ATLauncher:** A simple and easy to use Minecraft launcher which contains many different modpacks for you to choose from and play. [Website](https://atlauncher.com/about) —

**Badlion Client:** A closed source PvP modpack. [Website](https://www.badlion.net/) —

**Lunar Client:** A free Minecraft client with mods, cosmetics, and performance boost. [Website](https://www.lunarclient.com/) —

**<a href="HMCL" class="wikilink" title="HMCL">HMCL</a>:** A Minecraft Launcher which is multi-functional, cross-platform and popular. [Website](https://hmcl.huangyuhui.net/) —

## Installation

Your preferred client can be installed by adding the package to your configuration:

``` nix
environment.systemPackages = [
  pkgs.<LAUNCHER>
];
```

Alternatively, the package can be installed per-user with `users.users.`<USER>`.packages` or <a href="Home_Manager" class="wikilink" title="home-manager">home-manager</a>.

For a NixOS configuration, use:

``` nix
users.users.<USER>.packages = [
  pkgs.<LAUNCHER>
];
```

For <a href="Home_Manager" class="wikilink" title="home-manager">home-manager</a>, use:

``` nix
home.packages = [
  pkgs.<LAUNCHER>
];
```

Alternatively, it can be imperatively installed by running `nix-env -iA nixos.`<LAUNCHER> or `nix profile install nixpkgs#`<LAUNCHER> if <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> are enabled.

## Troubleshooting

### ATlauncher can't start instance

By default, ATlauncher installs its own Java runtime in `**USERSDIR**/runtimes/minecraft`, which gets selected in the settings' `Java Path`.

To fix this, make sure to select the java version installed in the system store from the `Settings > Java/Minecraft > Java Path` menu and also disable the `Use Java Provided By Minecraft?` option.

If your instance still doesn't start, check the instance settings and apply the same changes there.

### Prism Launcher doesn't have Java Version XX.

The <a href="Prism_Launcher" class="wikilink" title="Prism Launcher">Prism Launcher</a> package can be overridden to add additional <a href="Java" class="wikilink" title="Java">Java</a> runtimes. Check <a href="Prism_Launcher#Advanced" class="wikilink" title="Prism_Launcher#Advanced">Prism_Launcher#Advanced</a> to see an example.

### Minecraft Launch Error with NVIDIA Graphics and System GLFW.

When using the system GLFW together with an NVIDIA graphics card in the launcher, Minecraft may fail to start and display the following error message: `GLFW error 65544: EGL: Failed to clear current context: An EGLDisplay argument does not name a valid EGL display connection`.

In this case, setting the environment variable `__GL_THREADED_OPTIMIZATIONS` to `0` resolves the issue.

### Minecraft can’t start without Java Version XX.

Different Minecraft versions need different <a href="Java" class="wikilink" title="Java">Java</a> versions

| Minecraft Version | Minimum Compatible JRE Version |
|-------------------|--------------------------------|
| \< 1.17           | 8                              |
| 1.17              | 16                             |
| \>= 1.18          | 17                             |
| \>= 1.20.5        | 21                             |

### Official Minecraft Launcher fails to start the game.

It is possible that you are attempting to start a version of Minecraft that is 1.19 or higher. **Unfortunately, this is broken on NixOS**. It is strongly recommended to use alternative launchers.'''

## See Also

- [Minecraft on Arch Wiki](https://wiki.archlinux.org/title/Minecraft)

## References

<a href="Category:_Applications" class="wikilink" title="Category: Applications">Category: Applications</a> <a href="Category:_Gaming" class="wikilink" title="Category: Gaming">Category: Gaming</a>

[^1]: [<https://www.minecraft.net/about-minecraft>](https://www.minecraft.net/en-us/about-minecraft)

[^2]: <https://www.minecraft.net/article/java-or-bedrock-edition>

[^3]: [<https://learn.microsoft.com/windows/uwp/get-started/universal-application-platform-guide>](https://learn.microsoft.com/en-us/windows/uwp/get-started/universal-application-platform-guide)
