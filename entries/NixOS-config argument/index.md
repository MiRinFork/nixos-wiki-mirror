<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS:config argument -->

This argument gives access to the entire configuration of the system. It is computed from option declarations and option definitions defined inside all modules used for the system.

## Simple Case

The following code is used to support the explanation.

``` nix
{config, pkgs, lib ...}:

{
  options = {
    foo = lib.mkOption {
      description = "...";
    };
  };

  config = {
    bar = config.foo;
  };
}
```

This snippet of code is a module which declare the option "`foo`" and define the option "`bar`". The option "`bar`" is defined with the value `config.foo`. This attribute `foo` of the `config` argument, is the result of the <a href="NixOS:Declaration#Evaluation" class="wikilink" title="evaluation">evaluation</a> of the definitions and the declarations of the option "`foo`". Definitions of the option "`foo`" may exists in other module used by the system.

Adding additional modules to the system may change the value of `config.foo` and may change the behavior of the previous module.

## Conditional Statements

The process of module computation is highly recursive and may cause trouble when you want to add control flow statements. A common mistake is to use "`if`" or "`assert`" statements in the computation of a module.

``` nix
{config, pkgs, lib, ...}:

{
  options = {
    foo = lib.mkOption {
      default = false;
      type = with lib.types; bool;
      description = "foo boolean option";
    };
  };

  config =
    if config.foo then
      { bar = 42; }
    else
      {};
}
```

The previous module cause an infinite recursion:

- The `config` attribute is evaluated. This evaluation needs the result of the `if` statement.
- The `if` statement is evaluated. This evaluation needs the result of the condition.
- The condition (`config.foo`) is evaluated. This evaluation needs the result of the `config` argument.
- The `config` argument is evaluated. This evaluation needs the result of merging of all modules.
- The merge function of the modules is evaluated. This evaluation needs the evaluation of each module `config` attribute.

To avoid such infinite recursion, <a href="NixOS:Properties" class="wikilink" title="properties">properties</a> have been introduced, thus the previous code should be rewritten in:

``` nix
{config, pkgs, lib, ...}:

{
  options = {
    foo = lib.mkOption {
      default = false;
      type = with lib.types; bool;
      description = "foo boolean";
    };
  };

  config = lib.mkIf config.foo {
    bar = 42;
  };
}
```

## Common Pattern

Often, the module declare options embedded inside an attribute set. To access these options, we add an attribute `cfg` as a shortcut notation.

``` nix
{config, pkgs, lib, ...}:

let
  cfg = config.foo.bar.baz;

  # ...
in

with lib; {
  options = {
    foo.bar.baz = {
      enable = mkOption { /* ... */ };
      option1 = mkOption { /* ... */ };
      option2 = mkOption { /* ... */ };
      option3 = mkOption { /* ... */ }; 
    };
  };

  config = mkIf cfg.enable {
    # ...
  };
}
```

<a href="Category:Reference" class="wikilink" title="Category:Reference">Category:Reference</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
