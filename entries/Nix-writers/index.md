<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix-writers -->

Nix-writers are a way to write other programming languages inline in nix-code. They are like writeScript/writeScriptBin but for other languages.

Every writer has a ...Bin variant which can be used inside environment.systemPackages. Most of the writers take an attrributeset where one can add libraries.

These are declared in [`/pkgs/build-support/writers/scripts.nix`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/writers/scripts.nix).

## Languages

### bash

This is basically writeScript but with the shebang to bash already included.

``` nix
pkgs.writers.writeBash "hello_world" ''
  echo 'hello world!'
''
```

### dash

``` nix
pkgs.writers.writeDash "hello_world" ''
  echo 'hello world!'
''
```

### Haskell

``` nix
writeHaskell "missiles" {
  libraries = [ pkgs.haskellPackages.acme-missiles ];
} ''
  import Acme.Missiles

  main = launchMissiles
''
```

### JavaScript

``` nix
writeJS "example" {
  libraries = [ pkgs.nodePackages.uglify-js ];
} ''
  var UglifyJS = require("uglify-js");
  var code = "function add(first, second) { return first + second; }";
  var result = UglifyJS.minify(code);
  console.log(result.code);
''
```

### Perl

``` nix
writePerl "example" {
  libraries = [ pkgs.perlPackages.boolean ];
} ''
  use boolean;
  print "Howdy!\n" if true;
''
```

### Python2

``` nix
writePython2 "test_python2" {
  deps = [ pkgs.python2Packages.enum ];
} ''
  from enum import Enum

  class Test(Enum):
      a = "success"

  print Test.a
''
```

### Python3

``` nix
writePython3 "test_python3" {
  libraries = [ pkgs.python3Packages.pyyaml ];
} ''
  import yaml

  y = yaml.load("""
    - test: success
  """)
  print(y[0]['test'])
''
```

To disable errors use 'flakeIgnore' like this:

``` nix
writePython3 "test_python3" {
  libraries = [ pkgs.python3Packages.pyyaml ];
  flakeIgnore = [ "E265" "E225" ];
} ''
  import yaml

  y = yaml.load("""
    - test: success
  """)
  print(y[0]['test'])
''
```

<a href="Category:Nix_Language" class="wikilink" title="Category:Nix Language">Category:Nix Language</a>
