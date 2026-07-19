<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: DotNET -->

From <a href="Wikipedia:.NET" class="wikilink" title="Wikipedia">Wikipedia</a>

> The .NET platform (formerly named .NET Core) is a free and open-source, managed computer software framework for Windows, Linux, and macOS operating systems. It is a cross-platform successor to the .NET Framework. The project is mainly developed by Microsoft employees by way of the .NET Foundation and is today released under an MIT License.

## NativeAOT

This is relevant for NixOS only.

[nix-ld](https://github.com/nix-community/nix-ld) is needed:

``` nix
{
  programs.nix-ld.enable = true;
}
```

Now we will need a bunch of native dependencies. Here's an example of a shell:

``` nix
with import <nixpkgs> {};
pkgs.mkShell rec {

  dotnetPkg = 
    (with dotnetCorePackages; combinePackages [
      sdk_7_0
    ]);

  deps = [
    zlib
    zlib.dev
    openssl
    dotnetPkg
  ];

  NIX_LD_LIBRARY_PATH = lib.makeLibraryPath ([
    stdenv.cc.cc
  ] ++ deps);
  NIX_LD = "${pkgs.stdenv.cc.libc_bin}/bin/ld.so";
  nativeBuildInputs = [ 
  ] ++ deps;

  shellHook = ''
    DOTNET_ROOT="${dotnetPkg}";
  '';
}
```

## Global Tools

Local installation of .NET global tools is fully supported and preferred when possible - more info [in the Microsoft docs](https://learn.microsoft.com/en-us/dotnet/core/tools/global-tools#install-a-local-tool).

For globally installing .NET tools, search if they are available as Nix packages - they are packaged as any other normal .NET binary, using `buildDotnetModule`. For .NET tools with no source available, or those hard to build from source, `buildDotnetGlobalTool` is available. See [dotnet nixpkgs manual](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/dotnet.section.md#dotnet-global-tools-dotnet-global-tools) for more info.

Note that Nix-packaged .NET tools use a special wrapper (toggled by `useDotnetFromEnv` option in `buildDotnetModule`) that automatically picks up .NET install from the user environment. If you want to use a different SDK version with a Nix-packaged .NET tools than the default, make sure the `dotnet` CLI of your wanted SDK version is installed and available.

## Packaging

.NET packages can be built with `buildDotnetModule`

More information about `buildDotnetModule` can be found in the [nixpkgs manual](https://nixos.org/manual/nixpkgs/unstable/#dotnet) Example build file:

``` nix
{
  buildDotnetModule,
  dotnetCorePackages,
}:

buildDotnetModule {
  pname = "hello";
  version = "0.1";

  src = ./.;

  projectFile = "Hello/Hello.csproj";
  dotnet-sdk = dotnetCorePackages.sdk_8_0;
  dotnet-runtime = dotnetCorePackages.runtime_8_0;
  nugetDeps = ./deps.json;
}
```

If the `fetch-deps` script isn't working for whatever reason, you can manually run `nuget-to-json`:

``` shell-session
$ dotnet restore --packages=packageDir ./SomeProject.csproj
$ nuget-to-json packageDir > deps.json
$ rm -r packageDir
```

Remember to build and run the `fetch-deps` script after NuGet packages are updated, or building the derivation will fail.

### Building non-.NET Core packages

Keep in mind that building projects which don't use the .NET SDK (formerly the .NET Core SDK) and its `dotnet` CLI tool isn't supported. For those projects, you'll have to heavily customise the `buildDotnetModule` build steps, or write a custom derivation.

Projects which target .NET Standard or .NET Framework (incl. Mono), but still use the new project structure and SDK, work as expected. Just remember to add \`mono\` to \`buildInputs\` and generate a wrapper script in \`postInstall\`.

### Packaging ASP.NET projects

Currently building ASP.NET project as Nix package produces a website that does not work correctly out of the box because the executable can not find `wwwroot`, so all the static assets won't load with 404.

> Request finished HTTP/2 GET <https://my.app/css/site.css> - 404 0

The situation can be fixed by setting `WEBROOT` environment variable to the package path.

An example of systemd + ASP.NET 8 service:

``` nix
# myapp package needs to be imported; and added to `environment.systemPackages`
# the variable myapp is used below

systemd.services.my-app = {
  enable = true;
  description = "Runs my.app";
  wantedBy = [ "multi-user.target" ];
  after = [ "network-online.target" ];
  wants = [ "network-online.target" ];
  serviceConfig = {
    # allow binding to privileged ports - when you want to expose Kestrel directly without reverse proxy
    AmbientCapabilities = "CAP_NET_BIND_SERVICE";
    User = "myapp"; # must be created using users.users.myapp = { isSystemUser = true; group = "myapp"; };
    Group = "myapp"; # must be created using users.groups.myapp = {};
    Restart = "always";
    ExecStart = "${myapp}/bin/myapp";
    StateDirectory = "myapp";
    StateDirectoryMode = "0750";
    WorkingDirectory = "/var/lib/myapp";
    # EnvironmentFile = "/var/lib/myapp/env";
  };
  environment = {
    WEBROOT = "${myapp}/lib/myapp/wwwroot"; # IMPORTANT, required to pick up static assets

    DOTNET_ENVIRONMENT = "Production";

    # the following are examples
    ConnectionStrings__DefaultConnection = "Host=/var/run/postgresql;Database=myapp";

    # Kestrel + HTTPS; must setup https://wiki.nixos.org/wiki/ACME
    Kestrel__Endpoints__Https__Url = "https://my.app";
    Kestrel__Endpoints__Https__Certificate__Path = "/var/lib/acme/my.app/cert.pem";
    Kestrel__Endpoints__Https__Certificate__KeyPath = "/var/lib/acme/my.app/key.pem";

    Logging__LogLevel__Default = "Information";
    Logging__LogLevel__Microsoft__AspNetCore = "Warning"; # this does not actually work, not sure how to fix

    Authentication__Google__ClientId = "xxxyyyzzz.apps.googleusercontent.com";
    Authentication__Microsoft__ClientId = "aaaaaa-0000-aaaa-0000-aaaaaaaaaa";
    # secrets must be placed in /var/lib/myapp/appsettings.json

    # TODO email

    # TODO Stripe
    Stripe__Currency = "USD";
  };
};
```

See also: setting up SSL certificates using <a href="ACME" class="wikilink" title="ACME">ACME</a>

### Packaging Test projects

If you use MSBuild SDKs for test projects, then you have to manually copy of the Nuget package to pkg folder, since MSBuild SDK are not saved during \`dotnet restore --packages pkg\` process.

## Examples

### Running Rider with dotnet & PowerShell

Rider has better compatibility when run in FHS mode

Rider package

``` nix
pkgs.jetbrains.rider
```

rider-fhs.nix

``` nix
{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSEnv {
  name = "rider-env";
  targetPkgs = pkgs: (with pkgs; [
    dotnetCorePackages.dotnet_8.sdk
    dotnetCorePackages.dotnet_8.aspnetcore
    powershell
  ]);
  multiPkgs = pkgs: (with pkgs; [
  ]);
  runScript = "nohup rider &";
}).env
```

``` console
$ nix-shell ./rider-fhs.nix
```

This can be added as an alias to your shell if you update the reference to an absolute address, such as location within your home directory.

    run-rider = "nix-shell ~/nix/rider-fhs.nix";

### Multi-SDK installation with local workload installation enabled

By default, workload installation will fail on NixOS, as dotnet will attempt to save it to \$DOTNET_ROOT, which is inside the read-only Nix store.

Please visit the [forum](https://discourse.nixos.org/t/dotnet-maui-workload/20370/10) for an example of a multi-SDK installation with workload changed to install to home directory.

## Troubleshooting

### .NET location: Not found

If running a .NET-build executable you get the above error, make sure the DOTNET_ROOT environment variable is set:

``` nix
environment.sessionVariables = {
  DOTNET_ROOT = "${pkgs.dotnet-sdk}/share/dotnet/";
};
```

See : <https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-environment-variables#net-sdk-and-cli-environment-variables>

### TargetFramework value was not recognized

> error NETSDK1013: The TargetFramework value 'net6.0-windows' was not recognized. It may be misspelled. If not, then the TargetFrameworkIdentifier and/or TargetFrameworkVersion properties must be specified explicitly.

Wontfix: The project will build only on Windows.

### Unable to find package

> error NU1101: Unable to find package runtime.any.System.Collections. No packages exist with this id in source(s): nugetSource

Unsure what specific situations cause this, probably has something to do with .NET Standard libraries.

The workaround is modifying the bits that generate nuget-deps.nix:

``` console
$ dotnet restore --packages=packageDir --use-current-runtime ./SomeProject.csproj
$ nuget-to-nix packageDir >deps.nix
$ rm -r packageDir
```

The new parameter `--use-current-runtime` requires .NET SDK 8+. I believe what it does is explicitly adding packages missing in this runtime vs .NET Standard to packageDir.

If this still does not work, it might indicate a good time to update target frameworks and dependencies.

## See also

- [NixOS GitHub dotnet docs](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/dotnet.section.md)
- [dotnet in the nixpkgs manual](https://nixos.org/manual/nixpkgs/unstable/#dotnet)
- [buildDotnetModule references in nixpkgs](https://github.com/search?q=repo%3ANixOS%2Fnixpkgs%20buildDotnetModule&type=code)
- [NixOS.NET community on Reddit](https://www.reddit.com/r/NixOS_dotnet)
- [NixOS.NET community on Discord](https://discord.gg/pTpq7Qfs)
- [The journey of packaging a .NET app on Nix](https://sgt.hootr.club/blog/dotnet-on-nix/)
- <a href="Wikipedia:.NET_Framework" class="wikilink" title=".NET Framework">.NET Framework</a> - The old, windows-only version of .NET. Newer versions (ie. .NET Core) are multiplatform.
  - <a href="Wikipedia:Mono_(software)" class="wikilink" title="Mono">Mono</a> is the open source reimplementation of .NET Framework. Its runtime/JIT has been merged into .NET Core, and now it only receives bugfixes.
- <https://learn.microsoft.com/en-us/dotnet/core/introduction>

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
