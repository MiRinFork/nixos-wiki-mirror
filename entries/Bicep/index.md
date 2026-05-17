<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bicep -->

[Bicep](https://github.com/Azure/bicep/) is a Domain Specific Language (DSL) for deploying [Azure](https://azure.microsoft.com/) resources declaratively.

## Installation

Add `pkgs.bicep` to `environment.systemPackages`.

## Configuring VSCode extension for Bicep

``` nixos
 programs.vscode = {
   enable = true;
   package = pkgs.codium;
   profiles.default = {
     "dotnetAcquisitionExtension.sharedExistingDotnetPath" = "${pkgs.dotnet-sdk_8}/bin/dotnet";
     "dotnetAcquisitionExtension.existingDotnetPath" = [
        {
           "extensionId" = "ms-dotnettools.csharp";
           "path" = "${pkgs.dotnet-sdk_8}/bin/dotnet";
        }
        {
           "extensionId" = "ms-dotnettools.csdevkit";
           "path" = "${pkgs.dotnet-sdk_8}/bin/dotnet";
        }
        {
           "extensionId" = "ms-azuretools.vscode-bicep";
           "path" = "${pkgs.dotnet-sdk_8}/bin/dotnet";
        }
     ];
   extensions = with pkgs.vscode-extensions; [
     ms-azuretools.vscode-bicep
     ms-dotnettools.csdevkit
     ms-dotnettools.csharp
     ms-dotnettools.vscode-dotnet-runtime
   ];
 };
```

<a href="Category:Cloud" class="wikilink" title="Category:Cloud">Category:Cloud</a>
