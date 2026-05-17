<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Django -->

Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It provides built-in components for handling common web-development tasks—such as ORM, templating, authentication, and administration—so developers can focus on writing reusable, maintainable applications.

## Development shell

This example `flake.nix` can be used for Django web app development on NixOS

``` nix
{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-25.05";
    # Required for multi platform support
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        start =
          pkgs.writeShellScriptBin "start" ''
            set -e
            ${pkgs.python3}/bin/python manage.py makemigrations
            ${pkgs.python3}/bin/python manage.py migrate
            ${pkgs.python3}/bin/python manage.py runserver
          '';
      in
      {
        devShell = pkgs.mkShell {
          packages = with pkgs; with python3Packages; [
            python
            django
            requests
            beautifulsoup4
          ];
        };

        packages = { inherit start; };
        defaultPackage = start;
      });
}
```

Adapt the dependencies in the devShell packages part according to your project needs. Run the web app with

``` bash
nix develop
nix run
```

## Packaging

First we create the package derivation for the Django web app, in this example for <a href="Govplan" class="wikilink" title="Froide-Govplan">Froide-Govplan</a>

``` nix
{
  lib,
  python3Packages,
  fetchFromGitHub,
  makeBinaryWrapper,
  froide-govplan,
  gettext,
}:
let
  # Use Django 5 instead of 4
  python = python3Packages.python.override {
    packageOverrides = self: super: {
      django = super.django_5;
    };
  };
in
python.pkgs.buildPythonApplication rec {
  pname = "froide-govplan";
  version = "0-unstable-2025-06-25";
  pyproject = true;

  src = fetchFromGitHub {
    owner = "okfde";
    repo = "froide-govplan";
    rev = "9c325e70a84f26fea37b5a34f24d19fd82ea62ff";
    hash = "sha256-OD4vvKt0FLuiAVGwpspWLB2ZuM1UJkZdv2YcbKKYk9A=";
  };

  build-system = [ python.pkgs.setuptools ];

  nativeBuildInputs = [
    gettext
    makeBinaryWrapper
  ];

  dependencies = with python.pkgs; [
    django
    [...]
  ];

  preBuild = "${python.interpreter} -m django compilemessages";

  postInstall = ''
    cp manage.py $out/${python.sitePackages}/froide_govplan/
    cp -r project $out/${python.sitePackages}/froide_govplan/
    cp -r froide_govplan/locale $out/${python.sitePackages}/froide_govplan/
    makeWrapper $out/${python.sitePackages}/froide_govplan/manage.py $out/bin/froide-govplan \
      --prefix PYTHONPATH : ${passthru.pythonPath}:$out/${python.sitePackages}
  '';

  # Make used Python version and Python path available to the module
  passthru = {
    inherit python;
    pythonPath = "${python.pkgs.makePythonPath dependencies}";
  };

  meta = {
    [...]
    mainProgram = "froide-govplan";
  };

};
```

An example module derivation would look like this

``` nix
{
  config,
  lib,
  pkgs,
  ...
}:
let

  cfg = config.services.froide-govplan;
  pythonFmt = pkgs.formats.pythonVars { };
  settingsFile = pythonFmt.generate "extra_settings.py" cfg.settings;

  # For this project we supply the extra settings as a Python file
  # to a specific path
  pkg = cfg.package.overridePythonAttrs (old: {
    postInstall = old.postInstall + ''
      ln -s ${settingsFile} $out/${pkg.python.sitePackages}/froide_govplan/project/extra_settings.py
    '';
  });

  # Make a wrapper for the main binary (manage.py) to run it
  # for the specific user
  froide-govplan = pkgs.writeShellApplication {
    name = "froide-govplan";
    runtimeInputs = [ pkgs.coreutils ];
    text = ''
      SUDO="exec"
      if [[ "$USER" != govplan ]]; then
        SUDO="exec /run/wrappers/bin/sudo -u govplan"
      fi
      $SUDO env ${lib.getExe pkg} "$@"
    '';
  };

  # Service hardening
  defaultServiceConfig = {
    # Secure the services
    ReadWritePaths = [ cfg.dataDir ];
    CacheDirectory = "froide-govplan";
    CapabilityBoundingSet = "";
    # ProtectClock adds DeviceAllow=char-rtc r
    DeviceAllow = "";
    LockPersonality = true;
    MemoryDenyWriteExecute = true;
    NoNewPrivileges = true;
    PrivateDevices = true;
    PrivateMounts = true;
    PrivateTmp = true;
    PrivateUsers = true;
    ProtectClock = true;
    ProtectHome = true;
    ProtectHostname = true;
    ProtectSystem = "strict";
    ProtectControlGroups = true;
    ProtectKernelLogs = true;
    ProtectKernelModules = true;
    ProtectKernelTunables = true;
    ProtectProc = "invisible";
    ProcSubset = "pid";
    RestrictAddressFamilies = [
      "AF_UNIX"
      "AF_INET"
      "AF_INET6"
    ];
    RestrictNamespaces = true;
    RestrictRealtime = true;
    RestrictSUIDSGID = true;
    SystemCallArchitectures = "native";
    SystemCallFilter = [
      "@system-service"
      "~@privileged @setuid @keyring"
    ];
    UMask = "0066";
  };

in
{
  options.services.froide-govplan = {

    enable = lib.mkEnableOption "Gouvernment planer web app Govplan";

    package = lib.mkPackageOption pkgs "froide-govplan" { };

    hostName = lib.mkOption {
      type = lib.types.str;
      default = "localhost";
      description = "FQDN for the froide-govplan instance.";
    };

    dataDir = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/froide-govplan";
      description = "Directory to store the Froide-Govplan server data.";
    };

    secretKeyFile = lib.mkOption {
      type = lib.types.nullOr lib.types.path;
      default = null;
      description = ''
        Path to a file containing the secret key.
      '';
    };

    settings = lib.mkOption {
      description = ''
        Configuration options to set in `extra_settings.py`.
      '';

      default = { };

      type = lib.types.submodule {
        freeformType = pythonFmt.type;

        options = {
          ALLOWED_HOSTS = lib.mkOption {
            type = with lib.types; listOf str;
            default = [ "*" ];
            description = ''
              A list of valid fully-qualified domain names (FQDNs) and/or IP
              addresses that can be used to reach the Froide-Govplan service.
            '';
          };
        };
      };
    };

  };

  config = lib.mkIf cfg.enable {

    services.froide-govplan = {
      settings = {
        STATIC_ROOT = "${cfg.dataDir}/static";
        DEBUG = false;
        DATABASES.default = {
          ENGINE = "django.contrib.gis.db.backends.postgis";
          NAME = "govplan";
          USER = "govplan";
          HOST = "/run/postgresql";
        };
      };
    };

    services.postgresql = {
      enable = true;
      ensureDatabases = [ "govplan" ];
      ensureUsers = [
        {
          name = "govplan";
          ensureDBOwnership = true;
        }
      ];
    };

    services.nginx = {
      enable = lib.mkDefault true;
      virtualHosts."${cfg.hostName}".locations = {
        "/".extraConfig = "proxy_pass http://unix:/run/froide-govplan/froide-govplan.socket;";
        "/static/".alias = "${cfg.dataDir}/static/";
      };
      proxyTimeout = lib.mkDefault "120s";
    };

    systemd = {
      services = {

        froide-govplan = {
          description = "Gouvernment planer Govplan";
          serviceConfig = defaultServiceConfig // {
            WorkingDirectory = cfg.dataDir;
            StateDirectory = lib.mkIf (cfg.dataDir == "/var/lib/froide-govplan") "froide-govplan";
            User = "govplan";
            Group = "govplan";
            TimeoutStartSec = "5m";
          };
          after = [
            "postgresql.target"
            "network.target"
            "systemd-tmpfiles-setup.service"
          ];
          wantedBy = [ "multi-user.target" ];
          environment = {
            PYTHONPATH = "${pkg.pythonPath}:${pkg}/${pkg.python.sitePackages}";
          }
          // lib.optionalAttrs (cfg.secretKeyFile != null) {
            SECRET_KEY_FILE = cfg.secretKeyFile;
          };
          preStart = ''
            # Auto-migrate on first run or if the package has changed
            versionFile="${cfg.dataDir}/src-version"
            version=$(cat "$versionFile" 2>/dev/null || echo 0)

            if [[ $version != ${pkg.version} ]]; then
              ${lib.getExe pkg} migrate --no-input
              ${lib.getExe pkg} collectstatic --no-input --clear
              echo ${pkg.version} > "$versionFile"
            fi
          '';
          script = ''
            ${pkg.python.pkgs.uvicorn}/bin/uvicorn --uds /run/froide-govplan/froide-govplan.socket \
              --app-dir ${pkg}/${pkg.python.sitePackages}/froide_govplan \
              project.asgi:application
          '';
        };
      };

    };

    systemd.tmpfiles.rules = [ "d /run/froide-govplan - govplan govplan - -" ];

    environment.systemPackages = [ froide-govplan ];

    users.users.govplan = {
      home = "${cfg.dataDir}";
      isSystemUser = true;
      group = "govplan";
    };
    users.groups.govplan = { };

  };

  meta.maintainers = with lib.maintainers; [ onny ];

}
```

<a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a> <a href="Category:Django" class="wikilink" title="Category:Django">Category:Django</a>
