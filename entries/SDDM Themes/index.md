<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SDDM Themes -->

### Install

To use SDDM themes you need them in both \`services.displayManager.sddm.extraPackages\` and in the \`environment.systemPackages\` and set the \`theme\` option to the themes name.

``` nixos
{
  environment.systemPackages = with pkgs; [
    sddm-astronaut
  ];

  services.displayManager.sddm = {
    theme = "sddm-astronaut-theme";
    extraPackages = [ pkgs.sddm-astronaut ];
  };
}
```

### Custom Overridden Theme

When trying to use a SDDM theme and override the background you will need to add the overridden theme package in both \`services.displayManager.sddm.extraPackages\` and in the \`environment.systemPackages\` like before. The theme name would be the same as the normal package.

``` nixos
let
  custom-elegant-sddm = pkgs.elegant-sddm.override {
    themeConfig.General.background = "${pkgs.nixos-artwork.wallpapers.simple-dark-gray-bottom.gnomeFilePath}";
  };
in

{
  environment.systemPackages = with pkgs; [
    custom-elegant-sddm
  ];

  services.displayManager.sddm = {
    theme = "Elegant";
    extraPackages = [ custom-elegant-sddm ];
  };
}
```
