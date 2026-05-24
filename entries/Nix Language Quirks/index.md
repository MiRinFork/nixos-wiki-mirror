<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix Language Quirks -->

## `with` and `let`

`with` gets less priority than `let`. This can lead to confusions, especially if you like to write `with pkgs;`:

``` nix
nix-repl> pkgs = { x = 1; }

nix-repl> with pkgs; x
1

nix-repl> with pkgs; let x = 2; in x
2
```

So we see, that `let` binding overrides `with` binding. But what about this?

``` nix
nix-repl> let x = 2; in with pkgs; x
2 
```

In this case, `with` and `let` have different priority when resolving names.

[Good discussion on this topic](https://github.com/NixOS/nix/issues/1361)

Generally the use of `with` is discouraged. See the [best practices guide](https://nix.dev/guides/best-practices#with-scopes) for how best to use `inherit` as an alternative.

## Old `let` syntax

This is an [old](https://github.com/NixOS/nix/issues/1361#issuecomment-323050690) Nix syntax, that probably isn't used much

``` nix
nix-repl> let { x = 1; y = x + 1; body = y; }
2 
```

It is equivalent to modern syntax expression `let x = 1; y = x + 1; in y`. Note, that it doesn't require `rec` keyword.

Note, that it isn't equivalent to `with rec { x = 1; y = x + 1; body = y; }; body` because of mentioned `with` and `let` quirk, but is same as `rec { x = 1; y = x + 1; body = y; }.body`

## Default values are not bound in `@` syntax

Destructured arguments can have default values, but those default values are part of the full function argument.

In the following example, calling the function that binds a default value `"a"` to the argument's attribute `a` with an empty attribute set as an argument will produce an empty attribute set `args` instead of `{ a = "a"; }`:

``` nix
(args@{a ? "a"}: args) {}
```

`{ }`

Related: [GitHub issue filed 2017](https://github.com/NixOS/nix/issues/1461)

## Something that looks like both record attribute and `let`-binding

Destructuring function argument - is a great feature of Nix.

``` nix
nix-repl> f = { x ? 1, y ? 2 }: x + y

nix-repl> f { }
3 
```

The fact that we can add `@args` argument assignment is also cool

``` nix
nix-repl> f = { x ? 1, y ? 2, ... }@args: with args; x + y + z

nix-repl> f { z = 3; }
6 
```

But don't be fooled, `args` doesn't necessarily contain `x` and `y`:

``` nix
nix-repl> f = { x ? 1, y ? 2, ... }@args: args.x + args.y + args.z

nix-repl> f { z = 3;}
error: attribute ‘x’ missing, at (string):1:30 
```

These `x` and `y` are in fact `let`-bindings, but overridable ones.

## Imports and namespaces

Nix includes a keyword `import`, but it's equivalent in other languages is `eval`.

It is typically be used for namespacing:

``` nix
let
  pkgs = import <nixpkgs> {};
  lib = import <nixpkgs/lib>;
in
  pkgs.runCommand (lib.strings.removePrefix ".... 
```

consider the use of `import` here similar to using `qualified import ...` in Haskell or `import ...` in Python. Another (discouraged and increasingly uncommon) way of importing is [`with import ...;`](https://nix.dev/manual/nix/2.24/language/syntax#with-expressions), which corresponds to Python `from ... import *`. This use of `with` imports everything from the target into scope, which has numerous potential gotchas and problems, and so using [`inherit`](https://nix.dev/guides/best-practices#with-scopes) instead is encouraged and preferred.

## `builtins.replaceStrings` key match on ""

Syntax:

``` nix
builtins.replaceStrings [match] [replace] string
```

The [`builtins.replaceStrings`](https://noogle.dev/f/builtins/replaceStrings) function allows matching `""` in `string`. `[match]` gets checked sequentially, and when `""` is checked - it *always* matches. And so - when `""` is checked it *always* inserts the corresponding replacement from `[replace]`, then the next char in `string` gets inserted, and then the next char after that from `string` gets processed.

``` nix
nix-repl> builtins.replaceStrings ["" "e"] [" " "i"] "Hello world"
" H e l l o   w o r l d "
nix-repl> builtins.replaceStrings ["ll" ""] [" " "i"] "Hello world"
"iHie ioi iwioirilidi"
```

## Indented strings trim leading whitespace

Leading spaces are removed from both single-line and multi-line <strong>indented strings</strong>.

``` nix
''  s  '' == "s  "
```

Usually, indented strings have multiple lines:

``` nix
''
  s
'' == "s\n"
```

Though note that [tab characters](https://en.wikipedia.org/wiki/Tab_key#Tab_characters) are *not* stripped:

``` nix
''
    s
'' ==  "    s\n"
```

This is documented in more detail in the [String section](https://nix.dev/manual/nix/2.24/language/syntax#string-literal) of the Nix reference manual. Also see [NixOS/nix#7834](https://github.com/NixOS/nix/issues/7834) and [NixOS/nix#9971](https://github.com/NixOS/nix/pull/9971) for more information.

## Integer precision

Integer precision is limited to [64-bit](https://en.m.wikipedia.org/wiki/64-bit_computing) in the original Nix interpreter.

So the valid integer range is from -2\*\*63 to 2\*\*63-1 = from -9223372036854775808 to 9223372036854775807

Integer overflow is not an error

``` nix
nix-repl> 9223372036854775807 + 1
-9223372036854775808
```

Invalid integer literals throw

``` nix
nix-repl> 9223372036854775808  
error: invalid integer '9223372036854775808'
```

## No negative number literals

Negative numbers are parsed as "zero minus positive"

``` console
$ nix-instantiate --parse --expr '(-1)'
  (__sub 0 1)
```

So this throws, because the positive number is out of range

``` nix
nix-repl> -9223372036854775808
error: invalid integer '9223372036854775808'
```

but this works

``` nix
nix-repl> -9223372036854775807 - 1
-9223372036854775808
```

## Attribute set entries with a name that evaluates to null will not be added to the set

From [this](https://nix.dev/manual/nix/2.24/language/syntax#attrs-literal) section of the Nix Reference Manual:

> In the special case where an attribute name inside of a set declaration evaluates to null (which is normally an error, as null cannot be coerced to a string), that attribute is simply not added to the set:
>
> { \${if foo then "bar" else null} = true; }
>
> This will evaluate to {} if foo evaluates to false.

The relevant source can be found [here](https://github.com/NixOS/nix/blob/26c3fc11eada3fa7df0284190095868a947fefe2/src/libexpr/eval.cc#L1249-L1250).

This feature can be used to conditionally include or exclude attribute set entries, for example:

``` nix
nix-repl> { ${if true then "foo" else null} = "bar"; }      
{ foo = "bar"; }

nix-repl> { ${if false then "foo" else null} = "bar"; }
{ }
```

This might be used as an alternative to conditionally merging attribute sets using `//` like the following:

``` nix
{ a = "b"; } // (if true then { foo = "bar"; } else { } )
```

## Hexadecimal, octal, and binary

As of late 2024, Nix doesn't contain builtin support for parsing many number formats like hexadecimal, octal, and binary. It *does*, however, support the [`builtins.fromTOML`](https://noogle.dev/f/builtins/fromTOML) function, which [can be used](https://github.com/NixOS/nix/issues/7578#issuecomment-1955985859) to parse these number formats.

``` nix
nix-repl> (builtins.fromTOML "octal = 0o11").octal
9

nix-repl> (builtins.fromTOML "binary = 0b1001").binary
9

nix-repl> (builtins.fromTOML "hex = 0x09").hex         
9
```

## Mimicking case statements with attribute sets

Nix doesn't include native support for case statements, however when dealing with string types it's possible to use some string interpolation behavior to achieve something similar to case statement behavior, as described in this [thread](https://discourse.nixos.org/t/case-statement-expr/27741/12).

In the example from the thread, given some string argument `x`, the following code would place different values into a text file depending on it's value:

``` nix
environment.etc."just/for/test".text = {
  "a" = "hello";
  "b" = "hi";
  "c" = "ciao";
}."${x}";
```

So if `x` is set to the string `"a"` then the `just/for/test` file contents would be set to the string `"hello"`. The code above is the same in behavior to the following, more common, if-else-style construct:

``` nix
environment.etc."just/for/test".text =
  if x == "a" then
    "hello"
  else if x == "b" then
    "hi"
  else if x == "c" then
    "ciao"
  else
    abort "x is invalid";
```

There is an example in `coq` package code [here](https://github.com/NixOS/nixpkgs/blob/5185539c51ba658e70b29e01c0c320a85f4e2098/pkgs/build-support/coq/extra-lib.nix#L98) where someone used this behavior to build a reusable function `switch`.

## `builtins.toString` handling of `true` and `false` is inconsistent

``` nix
nix-repl> builtins.toString true
"1"

nix-repl> builtins.toString false
""
```

## Nix Language FAQ

### Q: What is the shortest `id` function definition?

A: `x: x`

### Q: Why not `x:x`?

A:

``` nix
nix-repl> builtins.typeOf (x: x)
"lambda"
nix-repl> builtins.typeOf (x:x)
"string" 
```

! [Can you figure out how can this happens before reading explanation?](https://github.com/NixOS/nix/issues/836)

### Q: Can Nix code be interpolated?

No, only attribute names can.

``` nix
nix-repl> let ${"x"} = 2; in x
2

nix-repl> with { ${"x"} = 2; }; x
2

nix-repl> let x = 1; y = ${x}; in y
error: syntax error, unexpected DOLLAR_CURLY, at (string):1:16
```

### Q: Can it be `eval`-ed from string?

A: Yes, but it is not recommended as "eval" is generally regarded as an easy to abuse language feature. It is possible but only via the store (not as bad as "import from derivation", but still not suitable for hot code paths):

``` nix
nix-repl> let code = "(x: x) ''id function was called''"; in import (builtins.toFile "eval" code)
"id function was called"
```

# Resources

- [A separately maintained list of Nix language quirks](https://md.darmstadt.ccc.de/xtNP7JuIQ5iNW1FjuhUccw#)

<a href="Category:Nix_Language" class="wikilink" title="Category:Nix Language">Category:Nix Language</a>
