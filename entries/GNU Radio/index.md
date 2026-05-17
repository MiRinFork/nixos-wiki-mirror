<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: GNU Radio -->

[GNU Radio](https://www.gnuradio.org/) is a free and opensource Software Defined Radio platform. NixOS supports currently maintained versions 3.10, 3.9, 3.8.

``` nix
{
  environment.systemPackages = with pkgs; [
    (gnuradio3_8.override {
      extraPackages = with gnuradio3_8Packages; [
        osmosdr
        limesdr
      ];
      extraPythonPackages = with gnuradio3_8.python.pkgs; [
        numpy
      ];
    })
  ];
}
```

To directly run generated Python programs, you can use . For example:

``` bash
$ nix-shell -p '(gnuradio.override { extraPackages = [ gnuradioPackages.osmosdr ]; }).pythonEnv' qt5.qtwayland
[nix-shell:~]$ ./default.py
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
