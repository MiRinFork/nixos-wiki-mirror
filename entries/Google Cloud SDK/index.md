<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Google Cloud SDK -->

It it possible to install gcloud and its components using nix. There are two major packages to do so: and {{ ic\|google-cloud-sdk-gce }}, with that later being a version that is optimised to run on Google Cloud itself.

## Components

Since the installation of is managed by nix, it won't be possible to install them using . Use this snippet to create a pseudo-package with your components in them \<ref name="discourseWithExtraComponents /\>:

``` nix
let
  gdk = pkgs.google-cloud-sdk.withExtraComponents( with pkgs.google-cloud-sdk.components; [
    gke-gcloud-auth-plugin
  ]);
in
{
  packages = [
    gdk
  ];
}
```

## References

<references>

[^1]

</references>

<a href="Category:Cloud" class="wikilink" title="Category:Cloud">Category:Cloud</a>

[^1]: [discourse topic](https://discourse.nixos.org/t/google-cloud-sdk-and-installing-extra-components/10319/9)
