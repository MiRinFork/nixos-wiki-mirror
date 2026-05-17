<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Out-of-tree build -->

By default, `stdenv.mkDerivation` will run `configure` and `make` in the source root,  
but some projects require an out-of-tree build

Example: the build script

``` bash
./autogen.sh

# out-of-tree build
mkdir build
cd build

../configure --enable-feature-a

make

make install
```

can be translated to the Nix expression

``` nix
stdenv.mkDerivation {

  preConfigure = ''
    patchShebangs .
    ./autogen.sh

    mkdir build
    cd build
  '';

  configureScript = "../configure";

  configureFlags = [
    "--enable-feature-a"
  ];
}
```
