<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Poezio OTR -->

As of now (2017-07-01) the OTR plugin in Poezio is broken due to `pythonPackages.pycrypto` being replaced by `pythonPackages.pycryptodome`: <https://github.com/NixOS/nixpkgs/issues/21671>

## Workaround

Provide original `pycrypto` under a new name `pycrypto-original` and provide this new `pycrypto-original` dependency to `pythonPackags.potr` instead of `pycrypto`: <https://github.com/fadenb/nixpkgs/commit/30eb00638ff021803e9ef1afcb22f35636644599>

``` diff
From 30eb00638ff021803e9ef1afcb22f35636644599 Mon Sep 17 00:00:00 2001
From: Tristan Helmich <tristan.helmich@gmail.com>
Date: Mon, 27 Feb 2017 15:13:16 +0100
Subject: [PATCH] pycrypto-original: Init at 2.6.1

---
 .../python-modules/pycrypto-original/default.nix   | 37 ++++++++++++++++++++++
 pkgs/top-level/python-packages.nix                 |  4 ++-
 2 files changed, 40 insertions(+), 1 deletion(-)
 create mode 100644 pkgs/development/python-modules/pycrypto-original/default.nix

diff --git a/pkgs/development/python-modules/pycrypto-original/default.nix b/pkgs/development/python-modules/pycrypto-original/default.nix
new file mode 100644
index 000000000000..b04251385a60
--- /dev/null
+++ b/pkgs/development/python-modules/pycrypto-original/default.nix
@@ -0,0 +1,37 @@
+{ stdenv, fetchurl, fetchpatch, python, buildPythonPackage, gmp }:
+
+buildPythonPackage rec {
+  name = "pycrypto-original-2.6.1";
+  namePrefix = "";
+
+  src = fetchurl {
+    url = "mirror://pypi/p/pycrypto/${name}.tar.gz";
+    sha256 = "0g0ayql5b9mkjam8hym6zyg6bv77lbh66rv1fyvgqb17kfc1xkpj";
+  };
+
+  patches = [
+    (fetchpatch {
+      name = "CVE-2013-7459.patch";
+      url = "https://anonscm.debian.org/cgit/collab-maint/python-crypto.git/plain/debian/patches/CVE-2013-7459.patch?h=debian/2.6.1-7";
+      sha256 = "01r7aghnchc1bpxgdv58qyi2085gh34bxini973xhy3ks7fq3ir9";
+    })
+  ];
+
+  preConfigure = ''
+    sed -i 's,/usr/include,/no-such-dir,' configure
+    sed -i "s!,'/usr/include/'!!" setup.py
+  '';
+
+  buildInputs = stdenv.lib.optional (!python.isPypy or false) gmp; # optional for pypy
+
+  doCheck = !(python.isPypy or stdenv.isDarwin); # error: AF_UNIX path too long
+
+  meta = {
+    homepage = "http://www.pycrypto.org/";
+    description = "Python Cryptography Toolkit";
+    platforms = stdenv.lib.platforms.unix;
+    knownVulnerabilities = [
+      "Unmaintained for several years"
+    ];
+  };
+}
diff --git a/pkgs/top-level/python-packages.nix b/pkgs/top-level/python-packages.nix
index 906f9b6b3919..d5b643d47140 100644
--- a/pkgs/top-level/python-packages.nix
+++ b/pkgs/top-level/python-packages.nix
@@ -256,6 +256,8 @@ in {
 
   pycrypto = callPackage ../development/python-modules/pycrypto { };
 
+  pycrypto-original = callPackage ../development/python-modules/pycrypto-original { };
+
   pycryptodome = callPackage ../development/python-modules/pycryptodome { };
 
   pyexiv2 = if (!isPy3k) then callPackage ../development/python-modules/pyexiv2 {} else throw "pyexiv2 not supported for interpreter ${python.executable}";
@@ -28731,7 +28733,7 @@ EOF
       sha256 = "1b3vjbv8hvynwj6amw3rg5zj8bagynbj0ipy09xwksf1mb0kz8m8";
     };
 
-    propagatedBuildInputs = with self ; [ pycrypto ];
+    propagatedBuildInputs = with self ; [ pycrypto-original ];
 
     meta = {
       description = "A pure Python OTR implementation";
```

With this patch you will need to whitelist pycrypto-original as it is marked as insecure. See the [manual on "Installing insecure packages"](https://nixos.org/nixpkgs/manual/#sec-allow-insecure) for details.
