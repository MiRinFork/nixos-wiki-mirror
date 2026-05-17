<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS modules -->

NixOS produces a full system configuration by combining smaller, more isolated and reusable components: **Modules**. A module is a file containing a Nix expression with a specific structure. It *declares* options for other modules to *define* (give a value). It processes them and defines options declared in other modules.[^1]

For example, is a module. Most other modules are in .

## Structure

Modules have the following syntax:

``` nix
{
  imports = [
    # Paths to other modules.
    # Compose this module out of smaller ones.
  ];

  options = {
    # Option declarations.
    # Declare what settings a user of this module can set.
    # Usually this includes a global "enable" option which defaults to false.
  };

  config = {
    # Option definitions.
    # Define what other settings, services and resources should be active.
    # Usually these depend on whether a user of this module chose to "enable" it
    # using the "option" above. 
    # Options for modules imported in "imports" can be set here.
  };

  meta = {
    # Meta-attributes to provide extra information like documentation or maintainers.
  };
}
```

There is a shorthand for modules without any option declarations:

``` nix
{
  imports = [
    # Paths to other modules.
    ./module.nix
    /path/to/absolute/module.nix
  ];

  # Config definitions.
  services.othermodule.enable = true;
  # ...
  # Notice that you can leave out the "config { }" wrapper.
}
```

Note that despite the name, `imports = [./module.nix]` should not be confused with the Nix [builtins](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-import) function `import module.nix`.

`imports` expects a path to a file containing a NixOS module structured as described here. `import` can load arbitrary Nix expression from provided file with no expectation of structure. (no expected structure). See [this post](https://discourse.nixos.org/t/import-list-in-configuration-nix-vs-import-function/11372/8) for more details.

Note: `imports` provides the same behavior as the obsolete `require`. There is no reason to use `require` anymore, however it may still linger in some legacy code.

### Function

A module may be a function accepting an attribute set.

``` nix
{ config, pkgs, ... }:
{
  imports = [];
  # ...
}
```

Following arguments are available in NixOS modules by default:

<dl>

<dt>

<a href="NixOS:config_argument" class="wikilink" title="config"><code>config</code></a>

</dt>

<dd>

The configuration of the entire system.

</dd>

<dt>

`options`

</dt>

<dd>

All option declarations refined with all definition and declaration references.

</dd>

<dt>

`lib`

</dt>

<dd>

An instance of the nixpkgs "standard library", providing what usually is in `pkgs.lib`.

</dd>

<dt>

`pkgs`

</dt>

<dd>

The attribute set extracted from the Nix package collection and enhanced with the `nixpkgs.config` option.

</dd>

<dt>

`modulesPath`

</dt>

<dd>

The location of the `module` directory of NixOS.

</dd>

</dl>

The "`...`" part of the argument attribute set indicates that this module does not depend on the rest of the arguments. When the module is defined as a function, this pattern is typically required, otherwise the evaluation will fail citing unexpected arguments.

#### Passing custom values to modules

The <a href="NixOS:config_argument" class="wikilink" title="config"><code>config</code></a>, `options`, `lib`, `pkgs`, and `modulesPath` arguments are passed automatically to modules, when the module is imported.

For example, in the following Nix flake, the \`./configuration.nix\` file will be provided with the default set of arguments listed above, plus \`extraArg\`, which was set in the \`specialArgs\` argument to the \`nixosGenerate\` function.

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixos-generators = {
      url = "github:nix-community/nixos-generators";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    xc = {
      url = "github:joerdav/xc";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, nixos-generators, xc, ... }:
    let
      pkgsForSystem = system: import nixpkgs {
        inherit system;
        overlays = [
          (final: prev: { xc = xc.packages.${system}.xc; })
        ];
      };
      allVMs = [ "x86_64-linux" "aarch64-linux" ];
      forAllVMs = f: nixpkgs.lib.genAttrs allVMs (system: f {
        inherit system;
        pkgs = pkgsForSystem system;
      });
    in
    {
      packages = forAllVMs ({ system, pkgs }: {
        vm = nixos-generators.nixosGenerate {
          system = system;
          specialArgs = { 
            extraArg = "foobar";
          };
          modules = [
            ./configuration.nix
          ];
          format = "raw";
        };
      });
    };
}
```

#### modulesPath

Some modules use `modulesPath` to import nixos libraries

For example `nixos/modules/virtualisation/digital-ocean-config.nix`

    { config, pkgs, lib, modulesPath, ... }:
      imports = [
        (modulesPath + "/profiles/qemu-guest.nix")
        (modulesPath + "/virtualisation/digital-ocean-init.nix")
      ];

The Nix variable `modulesPath` is parsed from the environment variable `NIX_PATH`

When `NIX_PATH` is empty, Nix can throw the error `undefined variable 'modulesPath'`

`NIX_PATH` should look something like this:

    echo $NIX_PATH | tr : '\n' 
    nixpkgs=/nix/var/nix/profiles/per-user/root/channels/nixos
    nixos-config=/etc/nixos/configuration.nix
    /nix/var/nix/profiles/per-user/root/channels

Here, the `modulesPath` is `/nix/var/nix/profiles/per-user/root/channels`

When a Nix expression calls `import `<nixpkgs>,  
then Nix will load `/nix/var/nix/profiles/per-user/root/channels/nixos`

### Imports

Imports are paths to other NixOS modules that should be included in the evaluation of the system configuration. A default set of modules is defined in . These don't need to be added in the import list.

### Option Declarations

Declarations specify a module's external interfaces.

``` nix
options = {
  optionName = lib.options.mkOption {
    # ...
  };
}
```

They are created with , a function in `lib`.[^2][^3]

#### Examples

<img src="NixOS_Search_-_Options.png" title="For even more examples you can browse NixOS/nixpkgs: Search a similar option on NixOS Search - Options and click on the link beside &quot;Declared in&quot; and studding the option declarations." width="270" height="270" alt="For even more examples you can browse NixOS/nixpkgs: Search a similar option on NixOS Search - Options and click on the link beside &quot;Declared in&quot; and studding the option declarations." /> Some useful option examples:

``` nixos
{ lib, pkgs, ... }: {
  options.examples = {
    enable = lib.options.mkEnableOption "showcasing of options";
    # type = lib.types.bool;

    package = lib.options.mkPackageOption pkgs "bash" { };
    # type = lib.types.package;

    numberOfTheDay = lib.options.mkOption {
      type = lib.types.ints.between 50 100;
      default = 61;
    };

    groceries = lib.options.mkOption {
      type = lib.types.listOf lib.types.strMatching "^[a-z]*$";
      default = [];
      description = "Showcase `listOf` and `strMatching`".
      example = [
        "bananas"
        "cherrys"
        "Throws an error at evaluation beause of regex not matching."
      ];
    };

    settings = lib.options.mkOption {
      type = lib.types.toml;
      default = {};
      description = ''
        Showcase the possible option for settings of a configuration
        file.
        Always document, where you can find possible options e.g.: 
          Refer <https://example.com/> for possible options.
      '';
      example = {
        global = {
          log_format = "-";
          log_filter = "^$";
        };
      };
    };
   
    units = lib.options.mkOption {
      type = lib.types.attrsOf (lib.types.submodule (
        { name, ... }:
        {
          options = {
            name = lib.options.mkOption {
              type = lib.types.str;
              default = name;
              defaultText = "<name>";
              description = "Name of the unit";
            };
            unit = lib.options.mkOption {
              type = lib.types.str;
              defaultText = ''
                Default will be set in the `config` block
                of the `submodule` (see down below)
              '';
              description = "A unit of measurement";
            };
          };
          config = {
            unit = lib.mkDefault "kg";
          };
        }
      ));
      default = {};
      description = "Showcase the combination `attrsOf` and `submodule`";
      example = {
        "unit1" = { unit = "m" };
        "unit2".unit = "cm";
        "unit3" = {}; # kg
      };
    };
  };
}
```

## Rationale

Modules were introduced to allow extending NixOS without modifying its source code.[^4] They also allow splitting up `configuration.nix`, making the system configuration easier to maintain and to reuse.

## Example

To see how modules are setup and reuse other modules in practice put `hello.nix` in the same folder as your `configuration.nix`:

``` nix
{ lib, pkgs, config, ... }:
with lib;                      
let
  # Shorter name to access final settings a 
  # user of hello.nix module HAS ACTUALLY SET.
  # cfg is a typical convention.
  cfg = config.services.hello;
in {
  meta.doc = "Says hello every time you login.";

  # Declare what settings a user of this "hello.nix" module CAN SET.
  options.services.hello = {
    enable = mkEnableOption "hello service";
    greeter = mkOption {
      type = types.str;
      default = "world";
    };
  };

  # Define what other settings, services and resources should be active IF
  # a user of this "hello.nix" module ENABLED this module 
  # by setting "services.hello.enable = true;".
  config = mkIf cfg.enable {
    systemd.services.hello = {
      wantedBy = [ "multi-user.target" ];
      serviceConfig.ExecStart = "${pkgs.hello}/bin/hello -g'Hello, ${escapeShellArg cfg.greeter}!'";
    };
  };
}
```

The other `configuration.nix` module can then import this `hello.nix` module and decide to enable it (and optionally set other allowed settings) as follows:

``` nix
{
  imports = [ ./hello.nix ];
  ...
  services.hello = {
    enable = true;
    greeter = "Bob";
  };
}
```

## Advanced Use Cases

### Compatibility Issues with Different Nixpkgs Versions

Module options between Nixpkgs revisions can sometimes change in incompatible ways.

For example, the option `services.nginx.virtualHosts.*.port` in nixpkgs-17.03 was replaced by `services.nginx.virtualHosts.*.listen` in nixpkgs-17.09. If configuration.nix has to accommodate both variants, `options` can be inspected:

``` nix
{ options, ... }: {
  services.nginx.virtualHosts.somehost = { /* common configuration */ }
    // (if builtins.hasAttr "port" (builtins.head options.services.nginx.virtualHosts.type.getSubModules).submodule.options
          then { port = 8000; }
          else { listen = [ { addr = "0.0.0.0"; port = 8000; } ]; });
}
```

### Abstract imports

To import a module that's stored *somewhere* (but for which you have neither an absolute nor a relative path), you can use [NIX_PATH elements](https://github.com/musnix/musnix#basic-usage) or `specialArgs` from `nixos/lib/eval-config.nix`.

This is useful for e.g. pulling modules from a git repository without adding it as a channel, or if you just prefer using paths relative to a root you can change (as opposed to the current file, which could move in the future).

``` nix
let
  inherit (import <nixpkgs> {}) writeShellScriptBin fetchgit;
  yourModules = fetchgit { ... };
in rec {
  nixos = import <nixpkgs/nixos/lib/eval-config.nix> {
    modules = [ ./configuration.nix ];
    specialArgs.mod = name: "${yourModules}/${name}";
  };

  /* use nixos here, e.g. for deployment or building an image */
}
```

``` nix
{ config, lib, pkgs, mod, ... }: {
  imports = [
    (mod "foo.nix")
  ];

  ...
}
```

### Using external NixOS modules

Some external modules provide extra functionality to the NixOS module system. You can include these modules, after making them available as a file system path (e.g. through `builtins.fetchTarball`), by using `` imports = [ `path to module`] `` in your `configuration.nix`.

- [Nixsap](https://github.com/ip1981/nixsap) - allows to run multiple instances of a service without containers.
- [musnix](https://github.com/musnix/musnix) - real-time audio in NixOS.
- [nixos-mailserver](https://gitlab.com/simple-nixos-mailserver/nixos-mailserver) - full-featured mail server module
- [X-Truder Nix-profiles](https://github.com/xtruder/nix-profiles) - modules for Nix to quickly configure your system based on application profiles.

### Disabling modules

In some cases, you may wish to override or disable modules previously imported, for example by NixOS. This can be achieved using the top-level attribute `disabledModules`[^5]. It prevents that module, as well as any module it imports itself, from being imported into the current config scope. This means that neither the options it declares nor the configuration it might set are actually imported. This can be particularly useful to override or debug the implementation of a certain module, for example to use a module from an unstable NixOS channel while using the stable version of every other module in the system.

To disable a given module, you must refer to it based on either:

- the full, absolute path of the module: `/mnt/dev/foo/my-modules/services/thingy.nix`

{ ... }: {

` imports = [ `<jade-nur/modules>` ];`

` disabledModules = [`  
`   # make sure that the GL module is never imported`  
`   "/home/xia/custom-modules/gl.nix"`

`   # prevent the tilix module from 'jade-nur' being imported`  
`   # note that this doesn't disable the rest of 'jade-nur/modules'`  
`   <jade-nur/modules/programs/tilix.nix>`  
` ];`

}

</syntaxhighlight>

- the path relative to the value of `modulesPath`: `"programs/hello.nix"`

{ ... }: {

` disabledModules = [`  
`   # prevent NixOS's immich module from being imported`  
`   "services/web-apps/immich.nix"`  
` ];`

` imports = [`  
`   # ...and then import a replacement of it from somewhere else`  
`   `<hotnix/services/immich>  
` ];`

}

</syntaxhighlight>

- an attribute set containing a `key` attribute, which should be a unique identity declared by the module you're trying to disable: `{ key = "my-super-unique-module"; }`. This is most useful for modules you have control over, as modules from NixOS and home-manager do not generally have specific keys.

1.  in file foo.nix

{ ... }: {

` disabledModules = [`  
`   # disable the module with the exact`  
`   # key "staple-battery-horse", as well`  
`   # as any module it imports itself`  
`   { key = "staple-battery-horse"; }`  
` ];`  
` ...`

}

1.  in file horse.nix, which could be imported
2.  from somewhere else in the config

{ ... }: {

` # this key should be globally unique, it is`  
` # the unique ID by which this module is tracked`  
` # by the module system, and thus how it can`  
` # be precisely disabled`  
` key = "stable-battery-horse";`

` imports = [ ./impl.nix ];`  
` options = { ... };`

}

</syntaxhighlight>

Note that keys and paths (whether absolute or relative) must be exact. For example, `disabledModules = [ "services/web-apps" ]` won't have any effect, because the files inside that folder are imported individually; however, `disabledModules = [ "services/web-apps/akkoma.nix" "services/web-apps/immich.nix" ... ];` will disable every module specified.

More examples are available in the ["Replace modules" section of the NixOS manual](https://nixos.org/manual/nixos/unstable/#sec-replace-modules) .

## Under the hood

The following was taken from a comment by Infinisil on reddit [^6].

A NixOS system is described by a single system derivation. builds this derivation with and then switches to that system with .

The entrypoint is the file at , which defines the attribute to be the NixOS option . This option is the topmost level of the NixOS evaluation and it's what almost all options eventually end up influencing through potentially a number of intermediate options.

As an example:

- The high-level option services.nginx.enable uses the lower-level option systemd.services.nginx
- Which in turn uses the even-lower-level option systemd.units."nginx.service"
- Which in turn uses environment.etc."systemd/system"
- Which then ends up as result/etc/systemd/system/nginx.service in the toplevel derivation

So high-level options use lower-level ones, eventually ending up at .

How do these options get evaluated though? That's what the NixOS module system does, which lives in the directory (in , and ). The module system can even be used without NixOS, allowing you to use it for your own option sets. Here's a simple example of this, whose option you can evaluate with :

``` nix
let
  systemModule = { lib, config, ... }: {
    options.toplevel = lib.mkOption {
      type = lib.types.str;
    };

    options.enableFoo = lib.mkOption {
      type = lib.types.bool;
      default = false;
    };

    config.toplevel = ''
      Is foo enabled? ${lib.boolToString config.enableFoo}
    '';
  };

  userModule = {
    enableFoo = true;
  };

in (import <nixpkgs/lib>).evalModules {
  modules = [ systemModule userModule ];
}
```

The module system itself is rather complex, but here's a short overview. A module evaluation consists of a set of "modules", which can do three things:

- Import other modules (through `imports = [ ./other-module.nix ]`)
- Declare options (through `options = { ... }`)
- Define option values (through `config = { ... }`, or without the config key as a shorthand if you don't have imports or options)

To do the actual evaluation, there's these rough steps:

- Recursively collect all modules by looking at all statements
- Collect all option declarations (with ) of all modules and merge them together if necessary
- For each option, evaluate it by collecting all its definitions (with ) from all modules and merging them together according to the options type.

Note that the last step is lazy (only the options you need are evaluated) and depends on other options itself (all the ones that influence it)

## More complex usages

The examples below contain:

- a child \`mkOption\` inherits their default from a parent \`mkOption\`
- reading default values from neighbouring \`mkOption\`(s) for conditional defaults
- passing in the config, to read the hostName from a submodule (email system)
- setting default values from attrset (email system)
- generating documentation for custom modules (outside of nixpkgs). [See here](https://discourse.nixos.org/t/franken-script-to-generate-nixos-options-docs-with-custom-modules/1674)

Source:

- <https://github.com/nixcloud/nixcloud-webservices/blob/master/modules/services/reverse-proxy/default.nix>
- <https://github.com/nixcloud/nixcloud-webservices/blob/master/modules/services/reverse-proxy/options.nix>
- <https://github.com/nixcloud/nixcloud-webservices/blob/master/modules/services/TLS/default.nix>
- <https://github.com/nixcloud/nixcloud-webservices/blob/master/modules/services/email/nixcloud-email.nix#L114>

(sorry, dont' have more time to make this into a nice little guide yet, but this links should be pretty good introductions into more advanced module system usages) qknight

## Developing modules

To test your module out, you can run the following from a local checkout of nixpkgs with a copy of a `configuration.nix`:

``` bash
nixos-rebuild build-vm --fast -I nixos-config=./configuration.nix -I nixpkgs=.
```

If you're developing on top of master, this will potentially cause the compilation of lots of packages, since changes on master might not cached on cache.nixos.org yet. To avoid that, you can develop your module on top of the `nixos-unstable` <a href="Channel_branches" class="wikilink" title="channel branch">channel branch</a>, tracked by the eponymous branch in <https://github.com/NixOS/nixpkgs>:

``` bash
git checkout -b mymodule upstream/nixos-unstable
```

### With Flakes

If you're developing a module from nixpkgs, you can try and follow the directions here: <https://github.com/Misterio77/nix-starter-configs/issues/28>.

If you want to develop a module from a git repo, you can use \`--override-input\`. For example, if you have an input in your flake called ,, you can use

``` bash
nixos-rebuild switch --override-input jovian <path-to-url> --flake <uri>
```

Of course, it doesn't have to <a href="nixos-rebuild" class="wikilink" title="nixos-rebuild"><code>nixos-rebuild</code></a> in particular.

## References

<references />

## See also

- <a href="NixOS:extend_NixOS" class="wikilink" title="NixOS:extend_NixOS">NixOS:extend_NixOS</a>
- <a href="NixOS:Properties" class="wikilink" title="NixOS:Properties">NixOS:Properties</a>
- [NixOS discourse, "Best resources for learning about the NixOS module system?"](https://discourse.nixos.org/t/best-resources-for-learning-about-the-nixos-module-system)
- Debian [Config::Model](http://wiki.debian.org/PackageConfigUpgrade): target configuration upgrades by abstracting the option of the configuration. Each file is a tree structure where leaves are values defined with an interpreted type. The interpreters are defined for each meta-configuration files name \*.conf. Configuration files does not seems to interact with each other to make consistent configuration. They provide an UI for editing their configuration file.

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:Reference" class="wikilink" title="Category:Reference">Category:Reference</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>

[^1]:

[^2]:

[^3]:

[^4]: [\[Nix-dev\] NixOS: New scheme](https://nixos.org/nix-dev/2008-November/001467.html)

[^5]: ["Replace Modules" section, NixOS manual](https://github.com/NixOS/nixpkgs/blob/master/nixos/doc/manual/development/replace-modules.section.md)

[^6]: Infinisil, <https://www.reddit.com/r/NixOS/comments/gdnzhy/question_how_nixos_options_works_underthehood/>
