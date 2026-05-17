<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Packaging/Ruby -->

See [Packaging Ruby programs](https://nixos.org/manual/nixpkgs/stable/#packaging-applications) in the nixpkgs manual

Ruby projects are generally packaged with [bundix](https://github.com/manveru/bundix). This guide will show how to package a ruby project

See

## Building **BeEF**

``` console
$ git clone https://github.com/beefproject/beef/
```

### Create shell.nix with all dependencies

we create a `shell.nix` in the project directory:

``` nix
with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "env";
  buildInputs = [
    ruby.devEnv
    git
    sqlite
    libpcap
    postgresql
    libxml2
    libxslt
    pkg-config
    bundix
    gnumake
  ];
}
```

### Build Gemfile.lock and gemset.nix

``` console
$ nix-shell
$ bundle lock      # generates Gemfile.lock
$ bundix              # generates gemset.nix
```

## Build default.nix

This will be the package configuration:

``` nix
{ stdenv, bundlerEnv, ruby }:
let
  # the magic which will include gemset.nix
  gems = bundlerEnv {
    name = "beef-env";
    inherit ruby;
    gemdir  = ./.;
  };
in stdenv.mkDerivation {
  name = "beef";
  src = ./.;
  buildInputs = [gems ruby];
  installPhase = ''
    mkdir -p $out/{bin,share/beef}
    cp -r * $out/share/beef
    bin=$out/bin/beef
# we are using bundle exec to start in the bundled environment
    cat > $bin <<EOF
#!/bin/sh -e
exec ${gems}/bin/bundle exec ${ruby}/bin/ruby $out/share/beef/beef "\$@"
EOF
    chmod +x $bin
  '';
}
```

### Build the package

``` console
$ nix-build -E '((import <nixpkgs> {}).callPackage (import ./default.nix) { })' --keep-failed
....
do_sqlite3 build FAILED!
```

Our Problem is that `do_sqlite3` wants to build native extensions and requires `sqlite` as dependency. There are two ways to solve this issue:

1.  add a global override to your nixpkgs
2.  set the gemConfig for the bundleEnv manually

### Adding a global override for a gem

We edit: `<nixpkgs/pkgs/development/ruby-modules/gem-config/default.nix`:

``` nix
{
   ...
   do_sqlite3 = attrs: {
     buildInputs = [ sqlite ];
   };
   ...
}
```

### Override gemConfig locally

``` nix
gems = bundlerEnv {
    name = "beef-env";
    inherit ruby;
    gemdir  = ./.;
    gemConfig = pkgs.defaultGemConfig // {
        do_sqlite3 = attrs: {
            buildInputs = [ sqlite ];
        };
    };
};
```

After this change we build the package again.

### Defining groups

Sophisticated applications use groups to organize their gems like `development`, `test` and `production`. `bundlerEnv` only makes the `default` group available in the environment, that is all gems which are **not** in a group. To make other groups available, they need to be provided as an array. Don't forget to include the `default` group.

Example:

``` nix
  gems = pkgs.bundlerEnv {
    name = "exampleApp";
    inherit ruby;
    gemfile = ./Gemfile;
    lockfile = ./Gemfile.lock;
    gemset = ./gemset.nix;
    groups = [ "default" "production" "development" "test" ];
  };
```

## Using Bundler 2

Bundler 2 comes included with Ruby, so instead of importing `ruby.devEnv` import Ruby and Bundix separately.

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:Ruby" class="wikilink" title="Category:Ruby">Category:Ruby</a>
