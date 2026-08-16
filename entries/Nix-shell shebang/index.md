<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix-shell shebang -->

You can use `nix-shell` as a script interpreter to

- run scripts in arbitrary languages
- provide dependencies with Nix

To do this, start the script with multiple shebang (`#!`) lines.  
The first shebang line is always `#! /usr/bin/env nix-shell`.  
The second shebang line declares the script language and the script dependencies.

As of Nix 2.19.0 you can also use the new CLI `nix shell` and flakes to define shebangs. See [docs](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix.html?highlight=shebang#shebang-interpreter).

## Examples

### Bash

To run bash scripts, set the interpreter with `-i bash`

``` bash
#! /usr/bin/env nix-shell
#! nix-shell -i bash -p bash

echo hello world
```

You can use `nix-shell -p ...` to add dependencies:

``` bash
#! /usr/bin/env nix-shell
#! nix-shell -i bash -p imagemagick cowsay

# scale image by 50%
convert "$1" -scale 50% "$1.s50.jpg" &&
cowsay "done $1.q50.jpg"
```

### C#

Using file-based apps, new in .NET 10:

``` csharp
#!/usr/bin/env nix-shell
/*
#! nix-shell -i dotnet -p dotnetCorePackages.dotnet_10.sdk
*/
#:package Humanizer@2.14.1

using Humanizer;

Environment.CurrentDirectory = (string) AppContext.GetData("EntryPointFileDirectoryPath")!; // equivalent of `cd $(dirname $0)`

var dotNet9Released = DateTimeOffset.Parse("2024-12-03");
var since = DateTimeOffset.Now - dotNet9Released;

Console.WriteLine($"It has been {since.Humanize()} since .NET 9 was released.");
```

### Haskell

``` haskell
#! /usr/bin/env nix-shell
#! nix-shell -p "haskellPackages.ghcWithPackages (p: with p; [turtle])" -i runghc

{-# LANGUAGE OverloadedStrings #-}

import Turtle

main = echo "Hello world!"
```

### Lua

Stable CLI

``` lua
#!/usr/bin/env nix-shell
--[[
#!nix-shell -i lua -p lua5_3
--]]
print("Hello, world!")
```

Pinned and eval-cached

``` lua
#!/usr/bin/env nix
--[[
#!nix shell github:NixOS/nixpkgs?ref=88a6078fc5d104f480d1b4a0b58ffec5de965b1b#lua5_3 -c lua
--]]
print("Hello, world!")
```

### Python

``` python
#! /usr/bin/env nix-shell
#! nix-shell -i python3 -p python3

print("hello world")
```

``` python
#! /usr/bin/env nix-shell
#! nix-shell -i python3 -p python3Packages.pillow python3Packages.ansicolor

# scale image by 50%
import sys, PIL.Image, ansicolor
path = sys.argv[1]
image = PIL.Image.open(path)
factor = 0.5
image = image.resize((round(image.width * factor), round(image.height * factor)))
path = path + ".s50.jpg"
image.save(path)
print(ansicolor.green(f"done {path}"))
```

### Rust

#### No dependencies

``` bash
#!/usr/bin/env nix-shell
#![allow()] /*
#!nix-shell -i bash -p rustc
rsfile="$(readlink -f $0)"
binfile="/tmp/$(basename "$rsfile").bin"
rustc "$rsfile" -o "$binfile" --edition=2021 && exec "$binfile" $@ || exit $?
*/
fn main() {
    for argument in std::env::args().skip(1) {
        println!("{}", argument);
    };
    println!("{}", std::env::var("HOME").expect(""));
}
```

#### With dependencies

uses [rust-script](https://github.com/fornwall/rust-script)

``` bash
#!/usr/bin/env nix-shell
//! ```cargo
//! [dependencies]
//! time = "0.1.25"
//! ```
/*
#!nix-shell -i rust-script -p rustc -p rust-script -p cargo
*/
fn main() {
    for argument in std::env::args().skip(1) {
        println!("{}", argument);
    };
    println!("{}", std::env::var("HOME").expect(""));
    println!("{}", time::now().rfc822z());
}
```

### Wolfram Language

Using [Woxi](https://woxi.ad-si.com/), the Rust reimplementation.

``` mathematica
#!/usr/bin/env nix-shell
(*
#! nix-shell -p woxi -i woxi
*)

RandomInteger[{1, 9}, 5] // Map[#^2&] // Map[Print]
```

## Pinning nixpkgs

To pin nixpkgs to a specific version, add a third shebang line:

``` bash
#! /usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/aed4b19d312525ae7ca9bceb4e1efe3357d0e2eb.tar.gz

echo hello world
```

## Flake

It is also possible to make it work for flake like in:

``` bash
#!/usr/bin/env -S nix shell nixpkgs#bash nixpkgs#hello nixpkgs#cowsay --command bash

hello | cowsay
```

The [doc](https://nix.dev/manual/nix/2.19/command-ref/new-cli/nix3-shell) mentions that it should be possible to run more complex commands using multiple lines, but it does not work for me as reported [here](https://github.com/NixOS/nixpkgs/issues/280033).

## Performance

TODO ... why the startup delay? how to make it faster?

- [Speeding up nix-shell shebang](https://discourse.nixos.org/t/speeding-up-nix-shell-shebang/4048)
- [cached-nix-shell](https://github.com/xzfc/cached-nix-shell) - Instant startup time for nix-shell
- [Nix Flakes, Part 2: Evaluation caching - Tweag](https://www.tweag.io/blog/2020-06-25-eval-cache/)

## See also

- [nix-shell: Use As a \#!-Interpreter](https://nix.dev/manual/nix/stable/command-ref/nix-shell.html?highlight=shebang#use-as-a--interpreter) man page
- [nix-shell and Shebang Lines](https://gist.github.com/travisbhartwell/f972aab227306edfcfea)
- [Spice up with Nix: Scripts with magical dependencies](https://notes.yukiisbo.red/posts/2021/07/Spice_up_with_Nix_Scripts.html)

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
