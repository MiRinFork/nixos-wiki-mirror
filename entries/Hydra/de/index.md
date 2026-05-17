<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hydra/de -->

<languages />

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

Hydra ist ein Werkzeug für kontinuierliche Integrationstests und Softwarefreigabe, das eine rein funktionale Sprache zur Beschreibung von Build-Jobs und deren Abhängigkeiten verwendet. Kontinuierliche Integration ist eine einfache Technik zur Verbesserung der Qualität des Softwareentwicklungsprozesses. Ein automatisiertes System prüft kontinuierlich oder periodisch den Quellcode eines Projekts, baut ihn, führt Tests durch und erstellt Berichte für die Entwickler. Auf diese Weise werden verschiedene Fehler, die versehentlich in die Codebasis aufgenommen werden könnten, automatisch erkannt.

<div class="mw-translate-fuzzy">

Die offiziellen Hydra-Server bieten vorgefertigte Binärpakete an, um die Aktualisierungszeit für Nixpgs zu verkürzen: Die Benutzer müssen sie nicht auf ihren eigenen Computern kompilieren.

</div>

Das [Hydra Handbuch](https://nixos.org/hydra/manual/) bietet eine Übersicht der Funktionalität und Funktionen von Hydra sowohl als auch eine aktuelle Installationsanleitung.

<div lang="en" dir="ltr" class="mw-content-ltr">

## Installation

</div>

Eine vollständige Installation kann wie folgt konfiguriert werden:

``` nix
  services.hydra = {
    enable = true;
    hydraURL = "http://localhost:3000"; # externally visible URL
    notificationSender = "hydra@localhost"; # e-mail of Hydra service
    # a standalone Hydra will require you to unset the buildMachinesFiles list to avoid using a nonexistant /etc/nix/machines
    buildMachinesFiles = [];
    # you will probably also want this, otherwise *everything* will be built from scratch
    useSubstitutes = true;
  };
```

Dieses Modul aktiviert <a href="PostgreSQL" class="wikilink" title="PostgreSQL">PostgreSQL</a> automatisch, außer die `services.hydra.dbi` wird geändert. Das Datenbanklayout wird automatisch erstellt vom Hydra-Service. Allerdings ist anzumerken, das zusätzliche Daten in der Datenbank gespeichert werden, was eine vollständige deklarative Konfiguration unmöglich macht. Daher sind Backups erforderlich.

- Siehe `nixos-option` oder die [Nixos Optionsseite](https://search.nixos.org/options?query=services.hydra) für eine Liste aller Optionen.

<span id="Web_Configuration"></span>

### Webserverkonfiguration

<div lang="en" dir="ltr" class="mw-content-ltr">

Hydra will provide the web interface [at localhost](http://localhost:3000/) port 3000. However you need to create a new admin user (as UNIX user `hydra`) before being able to perform any changes:

</div>

``` bash
# su - hydra
$ hydra-create-user alice --full-name 'Alice Q. User' \
    --email-address 'alice@example.org' --password-prompt --role admin
```

<span id="Virtual_machine"></span>

### Virtuelle Maschinen

Hydra benutzt localhost als Standardbuildmaschine, wenn nichts anderes konfiguriert ist. Standardmäßig sind die Systemfunktionen <code>kvm\> und `nixos-test` in Nix, zum benutzen von Virtuellen Maschinen nicht aktiviert. Jobs, die dies Funktionen benötigen werden daraufhin auf unbestimmte Zeit in die Warteschlange gestellt. Die folgenden Optionen aktieren diese Systemfeature:

``` nix
{
  nix.buildMachines = [
    { hostName = "localhost";
      protocol = null;
      system = "x86_64-linux";
      supportedFeatures = ["kvm" "nixos-test" "big-parallel" "benchmark"];
      maxJobs = 8;
    }
  ];
}
```

Diese Konfiguration erzeugt die Datei /etc/nix/machines. Falls die Hydra-option `buildMachinesFiles` immer noch auf eine leere Liste gesetzt ist, wird diese Einstellung ignoriert. Deswegen muss diese Option wieder entfernt werden oder `/etc/nix/machines` hinzugefügt werden.

<span id="Flake_jobset"></span>

## Flake-Jobset

Ein Jobset kann wie folgt konfiguriert werden.

- Type: <a href="Flakes" class="wikilink" title="Flake">Flake</a>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Flake URI: an URI to a repo containing a Flake like git+https://git.myserver.net/user/repo.git

</div>

Der Flake-Output sollte das Attribut `hydraJobs` enthalten. `hydraJobs` ist ein Attributset, das verschachtelt sein kann und auf Derivations verweist.

Ein Beispiel für ein Flake-Output, das Hydra veranlasst, alle Pakete zu bauen, könnte wie folgt aussehen:

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  outputs = { self, nixpkgs, ... }: {
    packages.x86_64-linux = {
      ...
    };

    hydraJobs = {
      inherit (self)
        packages;
    };
  };
}
```

<span id="Restricted_Mode"></span>

### Eingeschränkter Modus (Restricted mode)

<div lang="en" dir="ltr" class="mw-content-ltr">

Hydra evaluates flakes in [restricted mode](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-restrict-eval). This prevents access to files outside of the nix store, including those fetched as flake inputs. Update your `nix.settings.allowed-uris` to include URI prefixes from which you expect flake inputs to be fetched:

</div>

``` nix
nix.settings.allowed-uris = [
  "github:"
  "git+https://github.com/"
  "git+ssh://github.com/"
];
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## Build a single Package from nixpkgs

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Right now it is not possible to build a single package from nixpkgs with just that input. You will need to provide a supplementary repository which defines what to build. For examples you can check the [hydra-example by makefu](https://github.com/makefu/hydra-example) and in the [Hydra Manual](https://nixos.org/hydra/manual/#idm140737315920320).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Imperative Building

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

These steps are required to build the `hello` package.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  log into Hydra after creating a user with `hydra-create-user`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  create new project

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- identifier: example-hello

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- display name: example-hello

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  Actions -\> Create jobset

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- identifier: hello

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Nix expression: `release.nix` in `hydra-example` -\> will evaluate the file release.nix in the given input

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- check interval: 60

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- scheduling shares: 1

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Inputs:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

| Input Name | Type | Value | Note |
|----|----|----|----|
| nixpkgs | git checkout | <https://github.com/nixos/nixpkgs> nixos-21.11 | will check out branch nixos-21.11, will be made available to the nix expression via <nixpkgs>. |
| hydra-example | git checkout | <https://github.com/makefu/hydra-example> | hydra-example is used by the jobset as input, `release.nix` is in the root directory |

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

After creation, the jobset should be in the **evaluation phase** where inputs will be fetched. This phase may take some time as the complete `nixpkgs` repository needs to be downloaded before continuing. The result of the evaluation should be a single job which will get built.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Declarative Building

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Since 2016, Hydra supports declarative creation of jobsets. Check out the [example repository and description by Shea Levy](https://github.com/shlevy/declarative-hydra-example).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Hydra Internals

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Definitions

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This subsection provides an overview of the Hydra-specific definitions and how to configure them.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Project

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A cluster of Jobs which are all coming from a single input (like a git checkout), the first thing you will need to create. Every Job should be able to be built independently from another. Most of the time the project maps to a single repository like `nixpkgs`. It is comparable to the project definition in Jenkins.

</div>

<span id="Jobsets"></span>

#### Jobset

Eine Liste von Jobs, die ausgeführt werden sollen. Oft passt ein Jobset zu einem bestimmten Branch (master, staging, stable). Ein Jobset wird durch seine Eingaben definiert und wird ausgelöst, wenn sich diese Eingaben ändern, z.B. wenn ein neuer Commit zu einem Branch hinzugefügt wird. Jobsets können voneinander abhängen.

#### Job

Ein Closure, welches als Teil eines Jobsatzes erstellt wird (wie ein einzelnes Paket, ISO-Image oder Tarball).

#### Release Set

Definiert alle Jobs, die in Ihrem Release beschrieben sind. Konventionell wird eine Datei namens `release.nix` verwendet. Eine ausführliche Beschreibung der Struktur finden Sie im [Hydra Handbuch für Build Recipes](https://nixos.org/hydra/manual/#idm140737315920320).

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Evaluation

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The process of interpreting nix code into a list of `.drv files`. These files are the build recipes for all related outputs. You can introspect these files by running `nix show-derivation nixpkgs.hello`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Build

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Instantiation of a Job which is being triggered by being part of the release set.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Known Issues

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- hydra-queue-runner sometimes gets stuck even with builds are in the queue, and the builds are not scheduled. The issue is being tracked [here](https://github.com/NixOS/hydra/issues/366). In the meantime, a workaround is to add a cron job that regularly restarts the hydra-queue-runner systemd service. Possible fix: [1](https://github.com/NixOS/hydra/commit/73ca325d1c0f7914640a63764c9a6d448fde5bd0)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- If you see `error: unexpected end-of-file` it can mean multiple things, some of them are:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  You have a miss-match between nix versions on the Hydra server and the builder

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  It can also mean that `hydra-queue-runner` needs privileges on the build server. Reference: [2](https://github.com/NixOS/nix/issues/2789)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- The default timeout for git operations is 600 seconds [3](https://github.com/NixOS/hydra/issues/1181), which might cause fetches of large repositories like [nixos/nixpkgs](https://github.com/NixOS/nixpkgs) to fail: `` error fetching latest change from git repo at `https://github.com/nixos/nixpkgs': timeout ``. The timeout can be increased with the following configuration.nix snippet:

</div>

``` nix
{
  services.hydra.extraConfig = ''
    <git-input>
      timeout = 3600
    </git-input>
  '';
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## Hydra for NixOS releases

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Hydra is used for managing official Nix project releases. The project Hydra server: <https://hydra.nixos.org/>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Some Hydra trackers for Nix projects:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nixpkgs](https://hydra.nixos.org/project/nixpkgs)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [NixOS](https://hydra.nixos.org/project/nixos)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Resources

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Video: Setting up a Hydra Build Farm by Peter Simons (2016)](https://www.youtube.com/watch?v=RXV0Y5Bn-QQ)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Hydra Caveats by Joepie91](https://gist.github.com/joepie91/c26f01a787af87a96f967219234a8723)

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Hydra" class="wikilink" title="Category:Hydra">Category:Hydra</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
