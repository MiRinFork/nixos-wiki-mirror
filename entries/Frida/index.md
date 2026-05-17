<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Frida -->

[Frida](https://www.frida.re) is a dynamic binary instrumentation framework.

## Using the genesis's NUR package

Setup [NUR](https://github.com/nix-community/NUR) as described. Then install frida from genesis's repository:

``` console
$ nix-shell -p nur.repos.genesis.frida-tools
nix-shell> frida-trace -i "recv*" firefox
```

The python bindings are available via `nur.repos.genesis.python3Packages.frida` Both frida and frida-tools packages are based on pypi, feel free to post a PR to add support for your platform to them.

## Using frida's own binaries

The project provides pre-compiled binaries that almost work out of the box (when installed via `pip install frida-tools`) However at runtime it unpacks a helper called `frida-helper-64` that uses `/lib64/ld-linux-x86-64.so.2` as its link-loader. The error message will be similar to this one:

``` console
$ frida-trace -i "recv*" 1
"/run/user/1000/frida-ea4a59ca62f7c8d1d49bd898ec313eeb/frida-helper-64": No such file or directory (os error 2)
```

Since the helper is not accessible on the filesystem it cannot patched with patchelf. A simple hack is to symlink an arbitrary link loader to this directory:

``` console
$ ldd /bin/sh
...
/nix/store/83lrbvbmxrgv7iz49mgd42yvhi473xp6-glibc-2.27/lib/ld-linux-x86-64.so.2 => /nix/store/83lrbvbmxrgv7iz49mgd42yvhi473xp6-glibc-2.27/lib64/ld-linux-x86-64.so.2 (0x00007fa78b289000)
$ ln -s /nix/store/83lrbvbmxrgv7iz49mgd42yvhi473xp6-glibc-2.27/lib/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2
```

## Compile from source

Frida provides a pre-compiled SDK. Since it assumes many binaries in `/usr/bin/`, the best option is to use `buildFHSUserEnv`:

``` nix
with import <nixpkgs> {};
let
  fhs = pkgs.buildFHSUserEnv {
    name = "frida-env";
    targetPkgs = pkgs: with pkgs; [
      gcc_multi
      binutils
      gnumake
      which
      git
      (python3.withPackages (p: [ p.setuptools p.wheel ]))
      nodejs
      perl
      curl
      glibc_multi
      yarn
    ];
    profile = ''
      export hardeningDisable=all
      export SSL_CERT_FILE="${cacert}/etc/ssl/certs/ca-bundle.crt"
      # initialize sdk
      make
      # npm does not frida-gum/bindings/gumjs/node_modules -> bug?
      (cd frida-gum/bindings/gumjs && yarn install)

      # for frida-python wheel
      export FRIDA_VERSION=$(git describe --tags)
      export FRIDA_EXTENSION=$(realpath build/frida-linux-x86_64/${python3.sitePackages}/_frida.so)
      export SOURCE_DATE_EPOCH="315532800"
    '';
  };
in fhs.env
```

Afterwards the build system can be used as documented:

``` console
$  make python-linux-x86_64
```

The python egg can be build then like this:

``` console
$ cd frida-python
$ python setup.py bdist_wheel
$ pip install dist/frida-*.whl
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
