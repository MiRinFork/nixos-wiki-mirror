<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Java -->

This article is about <a href="Wikipedia:Java_(programming_language)" class="wikilink" title="Java">Java</a>, the programming language.

\_\_TOC\_\_

## Java Web Start

Available as `javaws` in package `adoptopenjdk-icedtea-web`.

## JDK options

Your default choice should probably be to install `jdk`, which is an alias to the latest <a href="Wikipedia:Long-term_support" class="wikilink" title="LTS">LTS</a>. If you're in a server environment, go for `jdk21_headless`. Java 21 is the currently-maintained LTS version of OpenJDK as of April 2024.

As you might expect, though, many flavors of Java are available in NixOS.

- OpenJDK, by far the most popular non-Oracle JVM implementation
  - `jdk8[_headless]` for a legacy Java 8 VM required by some older apps
  - `jdk21[_headless]`, the currently-supported LTS version of OpenJDK
  - `jdk22[_headless]`, the current version of OpenJDK
- Temurin, formerly AdoptOpenJDK, prebuilt binaries for OpenJDK
  - `temurin-bin` points to the latest version of Temurin, which is version 21 at the time of writing.
  - `temurin-jre-bin` is available if you want to avoid downloading the compiler and only require the runtime environment.
- JetBrains JDK (`jetbrains.jdk`), a fork of OpenJDK with modifications made by JetBrains
- Oracle's JDK (`oraclejdk`), only version 8 is available.

## VSCode + Language Support for Java (TM) by Red Hat extension

Unfortunately the extension contains and uses a version of the JRE which makes use of dynamically loaded libraries, which nix cannot accomodate out-of-the-box. Fortunately there's a simple solution in the use of [nix-ld](https://github.com/nix-community/nix-ld). Here's a simple `flake.nix` snippet to get you started (I'll focus on the `devShell` part for brevity):

``` nix
# flake.nix
devShell = pkgs.mkShell {
  buildInputs = [
    pkgs.gradle
    pkgs.jdk17
  ];
  NIX_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
    pkgs.stdenv.cc.cc
    pkgs.openssl
  ];
  NIX_LD = pkgs.lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker"; 
  # ^--- when using direnv, this line will require the 'use flake --impure' option.
};
```

The important lines above are the two starting with `NIX_LD...`. They will let nix-ld wrap the required, dynamically loaded libraries so that they are found when building the `devShell`.

Another solution is to use the [`java.jdt.ls.java.home`](https://github.com/redhat-developer/vscode-java?tab=readme-ov-file#supported-vs-code-settings) VSCode setting to point to a nix-built Java 17. For example, using home-manager's settings:

``` nix
programs.vscode.enable = true;

programs.vscode.extensions = [ pkgs.vscode-extensions.redhat.java ];

programs.vscode.userSettings = {
  "java.jdt.ls.java.home" = "${pkgs.jdk17}/lib/openjdk";
};
```

Note that this will still result in the extension downloading its own JRE, it just will not be used.

## Using Oracle JDK instead of Open JDK

Almost all Java packages in nixpkgs use Open JDK in form of a **jre** dependency. If you use Oracle JDK and also want other applications to use it, you can simply tweak your `nixpkgs/config.nix` so that your desired application uses Oracles JDK or JRE.

Example with UMLet with JRE

``` nix
{
  allowUnfree = true;
  packageOverrides = pkgs: rec {
    umlet = pkgs.umlet.override {
      jre = pkgs.oraclejre8;
    };
  };
}
```

To install the Oracle JRE system-wide, you need to explicitly accept the license in addition to allowing unfree modules:

``` nix
# /etc/nixos/configuration.nix
{
  nixpkgs.config.allowUnfree = true;
  programs.java = { enable = true; package = pkgs.oraclejre8; };
}
```

Working with `requireFile` (manual downloading the tarballs and manual adding in to the nix store) might be annoying and nixops-unfriendly, so it can be overridden in overlays

``` nix
nixpkgs.overlays = let
  files = {
    "jdk-8u241-linux-linux-arm32-vfp-hflt.tar.gz" = /home/user/blobs/java/jdk-8u241-linux-linux-arm32-vfp-hflt.tar.gz;
    "jdk-8u241-linux-linux-arm64-vfp-hflt.tar.gz" = /home/user/blobs/java/jdk-8u241-linux-linux-arm64-vfp-hflt.tar.gz;
    "jdk-8u241-linux-i586.tar.gz"                 = /home/user/blobs/java/jdk-8u241-linux-i586.tar.gz;
    "jdk-8u241-linux-x64.tar.gz"                  = /home/user/blobs/java/jdk-8u241-linux-x64.tar.gz;
  };
in [
  (self: super: {
    requireFile = args @ {name, url, sha1 ? null, sha256 ? null}:
      if files?${name} then
        self.stdenvNoCC.mkDerivation {
          inherit name;
          outputHashMode = "flat";
          outputHashAlgo = if sha256 != null then "sha256" else "sha1";
          outputHash     = if sha256 != null then  sha256  else  sha1 ;
          buildCommand   = "cp ${files.${name}} $out";
        }
      else
        super.requireFile args;
  })
];
```

## Better font rendering

By default java does not enable anti-aliasing for font rendering. By exporting environment variables, this can be fixed:

``` console
$ export _JAVA_OPTIONS='-Dawt.useSystemAAFontSettings=lcd'
```

More options can be found in the [ArchWiki](https://wiki.archlinux.org/title/Java_Runtime_Environment_fonts)

## Overriding java jks Certificate Store

Overriding the java certificate store may be required for adding your own Root certificates in case your company uses an internal PKI or the company utilizes an intercepting proxy.

### jdk8

Overriding the jdk8 certificate store is possible by overriding the **cacert** parameter of the package:

``` nix
{ pkgs, ... }:
let 
  myjdk = pkgs.jdk8.override {
    cacert = pkgs.runCommand "mycacert" {} ''
      mkdir -p $out/etc/ssl/certs
      cat ${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt \
        ${./my-company-root-certificate.crt} > $out/etc/ssl/certs/ca-bundle.crt
    '';
  };
in {
  programs.java = {
    enable = true;
    package = myjdk
  };
}
```

the java package build will use the **ca-bundle** to run keytool and transform it into **jks** format.

you could also use

``` nix
{
  nixpkgs.overlays = [(self: super: {jdk = super.jdk8.override { };} )];
}
```

to override the default jdk so all packages use the patched java version.

### jdk11

JDK11 does not provide the cacert overridable and therefore it is not possible to use the same technique to override the truststore.

As an alternative solution you can either set an environment variable, `JAVAX_NET_SSL_TRUSTSTORE`, or pass an argument to your program, `-Djavax.net.ssl.trustStore`, with the location of your cacert. See [discussion](https://discourse.nixos.org/t/custom-ssl-certificates-for-jdk/18297/9).

## Building and Packaging

See the [Java section in the Nixpkgs manual](https://nixos.org/manual/nixpkgs/#sec-language-java).

### Maven

[Maven](https://maven.apache.org/run.html) is a build tool for Java. The typical build command is

    mvn verify

[mvn2nix](https://github.com/fzakaria/mvn2nix), [buildMavenPackage](https://nixos.org/manual/nixpkgs/stable/#maven-buildmavenpackage) (recommended) can be used to build Maven projects with Nix

See also: [Packaging a Maven application with Nix](https://fzakaria.com/2020/07/20/packaging-a-maven-application-with-nix.html) and [buildMavenPackage source](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/ma/maven/build-maven-package.nix)

### Ant

[Ant](https://ant.apache.org/manual/running.html) is a build tool for Java. To build the `compile` target, run

    ant compile

To list available build targets, run

    ant -p

#### Ivy

[Ivy](https://ant.apache.org/ivy/) is a package manager for Ant, not to be confused with [ivy](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/iv/ivy/package.nix) - an APL-like calculator

To fetch ivy sources manually, see for example [pkgs/applications/editors/jedit](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/je/jedit/package.nix)

To fetch ivy sources in a fixed-output-derivation, see for example [yacy.nix](https://github.com/milahu/nur-packages/blob/master/pkgs/yacy/yacy.nix)

## JavaFX and Webkit support

To include support for JavaFX and Webkit, use the `enableJavaFX` and `withWebKit` options:

``` nix
{ pkgs, ... }:
let
  jdkWithFX = pkgs.openjdk.override {
    enableJavaFX = true; # for JavaFX
    # include following line if JavaFX with Webkit is needed
    openjfx_jdk = pkgs.openjfx.override { withWebKit = true; };
  };
in
...
```

## Further reading

  
  
  
  
  

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
