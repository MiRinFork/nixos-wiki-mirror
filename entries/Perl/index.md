<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Perl -->

## Running a Perl script

### Replacing \#! with nix-shell

Perl scripts normally start something like this:

``` shell
#!/usr/bin/env perl
```

In Nix, we often make isolated environments using [nix-shell](https://nixos.org/manual/nix/unstable/command-ref/nix-shell.html). You can do this in the `#!` (shabang) section directly in the script too. Here is an example from the manual — a Perl script that specifies that it requires Perl and the HTML::TokeParser::Simple and LWP packages:

``` perl
#! /usr/bin/env nix-shell
#! nix-shell -i perl -p perl perlPackages.HTMLTokeParserSimple perlPackages.LWP

use HTML::TokeParser::Simple;

# Fetch nixos.org and print all hrefs.
my $p = HTML::TokeParser::Simple->new(url => 'http://nixos.org/');

while (my $token = $p->get_tag("a")) {
    my $href = $token->get_attr("href");
    print "$href\n" if $href;
}
```

### Invoking nix-shell on command-line

If you run a perl script and encounter a dependency error like this: `Can't locate DB_File.pm in @INC (you may need to install the DB_File module)`

... use `nix-shell` to create a shell environment which includes the dependency. Here we searched NixOS packages and found an existing perl package which suits, [like so](https://search.nixos.org/packages?channel=unstable&from=0&size=30&sort=relevance&type=packages&query=dbfile).

``` console
$ nix-shell -p perl perl534Packages.DBFile --run ./myscript.pl
```

### There is no /usr/bin/perl

By design, there is no `/usr/bin/perl` in Nix. So you may encounter messages like:

`./myscript.pl: bad interpreter: /usr/bin/perl: no such file or directory` Change the first line of the script to

``` shell
#!/usr/bin/env -S perl
```

or start it with `perl ./myscript.pl`

## Adding something from CPAN to nixpkgs

1.  Enter a `nix-shell` that provides the necessary dependencies:
    ``` console
    $ nix-shell -p perl perlPackages.CPANPLUS perlPackages.GetoptLongDescriptive perlPackages.LogLog4perl perlPackages.Readonly
    ```
2.  Use the `nix-generate-from-cpan.pl` script (see `nixpkgs/maintainers/scripts/`) to generate something appropriate.  
    Example usage:
    ``` console
    $ nix-generate-from-cpan.pl Devel::REPL
    ```
3.  After reviewing the result from the previous step and making appropriate modifications, add it to `pkgs/top-level/perl-packages.nix`. Note that some things use `buildPerlPackage` while some use `buildPerlModule`. Also note the mostly-followed naming convention as well as the mostly-followed alphabetical ordering. There are plenty of examples in `perl-packages.nix` — use the source, Luke!
4.  Build and test.

## Adding something without a Makefile.PL

The perlPackages.buildPerlPackage assumes a Makefile.PL to exist as part of the configurePhase. If no such file is present in the project you are building, it is easiest to add a Makefile.PL into the source yourself.

The example below does so by adding it using the postPatch hook:

``` nix
postPatch = ''
  cat <<EOF > Makefile.PL
    use v5.10;
    use ExtUtils::MakeMaker;
    WriteMakefile(
        NAME          => 'RevBank',
        VERSION_FROM  => 'revbank',
        ABSTRACT_FROM => 'lib/RevBank.pod',
        EXE_FILES     => [ 'revbank' ],
    );
  EOF
'';
```

The documentation for ExtUtils::MakeMaker can be found \[<https://perldoc.perl.org/ExtUtils>::MakeMaker here\].

## Wrappers for installed programs

To make perl modules available to a program in your derivation:

1.  Add `makeWrapper` to `nativeBuildInputs`
2.  Add

postFixup = ''

` wrapProgram $out/bin/something \`  
`   --prefix PERL5LIB : "${with perlPackages; makePerlPath [ something ]}"`

'';

</syntaxhighlight>

Also keep in mind that `makePerlPath` would not resolve transitive dependencies of Perl packages. Hence if you want to just reference top-level packages, then use `makeFullPerlPath` which would recursively resolve dependency graph for you.

## See also

- [Nixpkgs Manual - Perl section](https://nixos.org/manual/nixpkgs/stable/#sec-language-perl)
- [Overriding an existing Perl package in NixOS](https://blog.stigok.com/2020/04/16/building-a-custom-perl-package-for-nixos.html)

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:Perl" class="wikilink" title="Category:Perl">Category:Perl</a>
