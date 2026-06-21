<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: HMCL/zh -->

<div lang="en" dir="ltr" class="mw-content-ltr">

[Hello Minecraft! Launcher](https://hmcl.net/) (HMCL) is a free, open-source, and cross-platform [Minecraft](https://www.minecraft.net) launcher.

</div>

<span id="Installation"></span>

## 安装

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Using nix-shell

``` shell
$ nix-shell -p hmcl
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Using global configuration

``` nix
environment.systemPackages = with pkgs; [ hmcl ];
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Using home configuration

``` nix
home.packages = with pkgs; [ hmcl ];
```

</div>

<span id="Configuration"></span>

## 配置

<span id="Basic"></span>

#### 基础

<div lang="en" dir="ltr" class="mw-content-ltr">

At present, configuration can be performed through the HMCL interface; however, declarative configuration is not currently supported.

</div>

<span id="Wayland_support"></span>

#### Wayland 支持

<div lang="en" dir="ltr" class="mw-content-ltr">

Starting with Minecraft 26.1, Wayland support can be enabled by adding the JDK arguments `-DMC_DEBUG_ENABLED` and `-DMC_DEBUG_PREFER_WAYLAND`. In HMCL, these can be configured under `Advanced Settings -> JVM Options -> JVM Arguments`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For older Minecraft versions, users who want to use Wayland should enable `Advanced Settings -> Workaround -> Use System GLFW`. Otherwise, this option should remain disabled.

</div>

<span id="Advanced"></span>

#### 进阶

<div lang="en" dir="ltr" class="mw-content-ltr">

You can override the JDK with one that is not included by default, such as `jdk8_headless`, or use alternative builds like `zulu17`, in order to support older versions of Minecraft.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

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

</div>

<span id="References"></span>

## 参考

<div lang="en" dir="ltr" class="mw-content-ltr">

- [HMCL documentation](https://docs.hmcl.net/)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
