<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: HMCL/en -->

[Hello Minecraft! Launcher](https://hmcl.net/) (HMCL) is a free, open-source, and cross-platform [Minecraft](https://www.minecraft.net) launcher.

## Installation

#### Using nix-shell

``` shell
$ nix-shell -p hmcl
```

#### Using global configuration

``` nix
environment.systemPackages = with pkgs; [ hmcl ];
```

#### Using home configuration

``` nix
home.packages = with pkgs; [ hmcl ];
```

## Configuration

#### Basic

At present, configuration can be performed through the HMCL interface; however, declarative configuration is not currently supported.

#### Wayland support

Starting with Minecraft 26.1, Wayland support can be enabled by adding the JDK arguments `-DMC_DEBUG_ENABLED` and `-DMC_DEBUG_PREFER_WAYLAND`. In HMCL, these can be configured under `Advanced Settings -> JVM Options -> JVM Arguments`.

For older Minecraft versions, users who want to use Wayland should enable `Advanced Settings -> Workaround -> Use System GLFW`. Otherwise, this option should remain disabled.

#### Advanced

You can override the JDK with one that is not included by default, such as `jdk8_headless`, or use alternative builds like `zulu17`, in order to support older versions of Minecraft.

``` nix
environment.systemPackages = with pkgs; [
  (hmcl.override {
    minecraftJdks = [
      jdk8_headless
      zulu17
    ];
  })
];
```

## References

- [HMCL documentation](https://docs.hmcl.net/)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
