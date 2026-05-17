<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Lauti -->

[Lauti](https://lauti.org) is a community event calendar for groups and places.

## Setup

A minimal local example setup would look like this

``` nix
environment.etc."lauti-secrets".text = ''
LAUTI_ADMIN_PASSWORD=test123
'';

services.eintopf = {
  enable = true;
  settings = {
    LAUTI_ADMIN_EMAIL = "test@example.org";
    LAUTI_BASE_URL = "http://localhost:3333";
    LAUTI_OSM_TILE_CACHE_DIR = "/var/lib/eintopf/osm";
    LAUTI_OSM_TILE_SERVER = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    LAUTI_TIMEZONE = "Europe/Berlin";
    LAUTI_LANGUAGE = "en";
  };
  secrets = [ /etc/lauti-secrets ];
};
```

The web service will be available at <http://localhost:3333>. The administration login page is available at <http://localhost:3333/backstage> where you can use the credentials specified above.

## Configuration

### Templates

Following example packages the "karlsunruh" template and set it as default for Eintopf.

``` nix
{ pkgs, ... }:
let

  template-karlsunruh = pkgs.stdenv.mkDerivation {
    name = "karlsunruh";
    src = pkgs.fetchFromGitLab {
      domain = "git.project-insanity.org";
      owner = "onny";
      repo = "eintopf-karlsunruh";
      rev = "17622a22234b7eb664436582ee6147070c1b08bb";
      hash = "sha256-cW1Q5clLy8b2/DblKWy5i307inymxuOz6gtY1+iHRKo=";
    };
    makeFlags = [ "DESTDIR=$(out)" ];
  };

in
{

  services.eintopf = {
    enable = true;
    settings = {
      LAUTI_THEME = "karlsunruh";
      LAUTI_THEMES_PATH = "${template-karlsunruh}";
    };
  };

}
```

## Tips and tricks

### Sync events from Radar to Lauti

The following script can be imported into the NixOS system configuration and will runs every half an hour to sync events from a given Radar group id to a specific target Lauti instance.

Import the module and script into your system `flake.nix` file

``` nix
{
  inputs = {
    eintopf-radar-sync.url = "git+https://git.project-insanity.org/onny/eintopf-radar-sync.git";
    [...]
  };

  outputs = {self, nixpkgs, ...}@inputs: {

    nixosConfigurations.my_system = inputs.nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs.inputs = inputs;
      modules = [
        inputs.eintopf-radar-sync.nixosModule

        ({ pkgs, ... }:{

          nixpkgs.overlays = [
            inputs.eintopf-radar-sync.overlay
          ];

        })

        ./configuration.nix

      ];
    };
  };
}
```

Enable the sync service in your system configuration by adding following snippet. Replace the setting variables according to your setup

``` nix
environment.etc."eintopf-radar-sync-secrets".text = ''
EINTOPF_AUTHORIZATION_TOKEN=foobar23
'';

services.eintopf-radar-sync = {
  enable = true;
  settings = {
    EINTOPF_URL = "https://karlsunruh.project-insanity.org";
    RADAR_GROUP_ID = "436012";
  };
  secrets = [ /etc/eintopf-radar-sync-secrets ];
};
```

Get the authorization token through login request in the Lauti Swagger api interface, for example http://localhost:3333/api/v1/swagger#/auth/login

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
