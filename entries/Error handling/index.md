<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Error handling -->

This page is a collection of facilities and tools from nix, nixpkgs and NixOS for error handling and debugging. You can use them to convey configuration errors to users or to debug nix expressions trough interactive or print debugging.

In most cases you will want to stick to the highest level abstraction: `config.warnings` or `lib.warn` and its relatives.

``` nix
{ config, lib, ... }: 
# in any nix code:
lib.warn "This is a sample warning message."
{
    config.warnings = (
      # Some NixOS module: throw error, if services.foo.bar == true
      lib.optionals config.services.foo.bar "This is also a sample warning message, but invoked differently."
    );
}
```

## Nix

The nix language has a construct to help with printing messages.

- **assert**: throw an error (see [Nix manual: Assertions](https://nixos.org/manual/nix/stable/language/syntax.html?highlight=assert#assertions))

The nix language also comes with some related [builtin functions](https://nixos.org/manual/nix/stable/language/builtins.html):

- **throw**: throw an error with a message
- **abort**: same as throw, but always stop evaluation
- **trace**: print to stderr
- **traceVerbose**: print, but only when in `--trace-verbose` mode
- **break**: breakpoint when in `--debugger` mode
- **tryEval**: catch throws and asserts

Most of those functions (nix builtins as well as nixpkgs lib functions) take an expression `e` as their last argument which they return unmodified. Thus they are chained in front of some expression:

``` nix
a = builtins.trace "trace message" {
   # what should be assigned to a
};
```

Commonly, assert is combined with throw to generate meaningful error messages: `assert condition || throw "message";`. This pattern is essentially how `lib.assertMsg` works (see Sec. nixpkgs). [^1]

## nixpkgs

There are three main facilities for printing errors and do print debugging in nixpkgs:

- lib.trivial.\* (see [nixpkgs manual: lib.trivial](https://nixos.org/manual/nixpkgs/stable/#sec-functions-library-trivial))
  - lib.**throwIf** and throwIfNot
  - lib.**warn**, **warnIf** and warnIfNot
- [lib.**debug**.\*](https://nixos.org/manual/nixpkgs/stable/#sec-functions-library-debug): tracing functions with some pretty printing (e.g. `lib.debug.traceIf`) [^2]
- [lib.**asserts**.\*](https://nixos.org/manual/nixpkgs/stable/#sec-functions-library-asserts): assert functions (e.g. `lib.asserts.assertMsg`)

These facilities also expose their attributes directly via `lib.*` (e.g. `lib.throwIf`).

Nixpkgs also has a debugging facility like nix's `break`: the [breakpointHook](https://nixos.org/manual/nixpkgs/stable/#breakpointhook).

## NixOS

The NixOS module system again wraps these library functions and makes them available via module options (see [NixOS manual: Assertions/Warnings](https://nixos.org/manual/nixos/stable/index.html#sec-assertions-warnings)): [^3]

- `config.warnings = [];`
- `config.assertions = [];`

An example for a debugging facility in NixOS is running [NixOS tests interactively](https://nixos.org/manual/nixos/stable/index.html#sec-running-nixos-tests-interactively).

## Debugging

To summarise debugging approaches discussed in this article, you can use `break` to debug nix code, `breakpointHook` to debug nix builds and interactive tools to debug NixOS tests.

To find the location where variables get defined, you can use the following tools:

For bare nix code, use `builtins.unsafeGetAttrPos` ([example](https://github.com/NixOS/nix/blob/b17c4290cf61d8a0386817b87231762c175097c5/tests/lang/eval-okay-getattrpos.nix)) which returns the line and column of where an attribute is defined. It is undocumented and considered bad practice.

(soon to come [github PR](https://github.com/NixOS/nixpkgs/pull/249243)): For NixOS options unsafeGetAttrPos doesn't work, but the module system itself records that information: to find the location of `config.networking.hostName`, use `:p options.networking.hostName.declarationPositions`.

## References

[^1]: [throw vs assert discussion](https://github.com/NixOS/nixpkgs/issues/154292)

[^2]: [Nixpkgs/docs: lib.debug](http://ryantm.github.io/nixpkgs/functions/library/debug/#sec-functions-library-debug)

[^3]: [Nixpkgs/docs: Assertions](https://github.com/NixOS/nixpkgs/blob/nixos-22.11/nixos/doc/manual/development/assertions.section.md)
