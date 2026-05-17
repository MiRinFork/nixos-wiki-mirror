<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MultiMC -->

## NOTE

Nixpkgs currently packages PrismLauncher, a fork of MultiMC, which currently does not require you, but does allow you, to obtain your own client ID. This information is provided mainly for historical interest.

### Using a Microsoft account

Microsoft authentication requires a client ID, which the package in Nixpkgs does not currently contain.

[The MultiMC source contains instructions to create one:](https://github.com/MultiMC/MultiMC5/blob/master/notsecrets/Secrets.cpp)

1.  Register an app, following the instructions at <https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app> (make sure that you've set up a tenant as mentioned in the prerequisites)
2.  Restrict it to personal accounts
3.  Do \*not\* add a redirect URI, platform, credentials, certificates, or client secrets
4.  Enable public client flows
5.  Enable Live SDK support (under authentication)

You can then override the MultiMC package to include your client ID:

``` nix
(multimc.override { msaClientID = "00000000-0000-0000-0000-000000000000"; })
```

If you use home-manager, you can use the following snippet in your home-manager config:

``` nix
  nixpkgs.overlays = [ (self: super: {
    multimc = super.multimc.override {
      msaClientID = "<your application id>";
   };
 }
 ) ];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
