<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fsharp -->

[F#](https://fsharp.org/) (F-Sharp) is a .NET language.

# Usage

F# is packaged in the `dotnet-sdk` family of packages (`dotnet-sdk_3`, `dotnet-sdk_5`, and `dotnet-sdk_7` as of Dec 20, 2022).

You can pop into a REPL:

    $ nix-shell -p dotnet-sdk
    warning: unknown setting 'experimental-features'

    [nix-shell:~]$ dotnet fsi

    Microsoft (R) F# Interactive version 12.0.5.0 for F# 6.0
    Copyright (c) Microsoft Corporation. All Rights Reserved.

    For help type #help;;

    > printfn "Hello world from F#!";;
    Hello world from F#!
    val it : unit = ()

To create a project use

    dotnet new console --language F#
    dotnet run

like so!

## See also

- <a href="DotNET" class="wikilink" title="DotNET">DotNET</a>

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
