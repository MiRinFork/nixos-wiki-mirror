<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hydra/ru -->

<languages />

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

Hydra - это инструмент для непрерывного интеграционного тестирования и выпуска программного обеспечения, который использует чисто функциональный язык для описания заданий сборки и их зависимостей. Непрерывная интеграция - это простая техника, позволяющая повысить качество процесса разработки программного обеспечения. Автоматизированная система постоянно или периодически проверяет исходный код проекта, собирает его, запускает тесты и готовит отчеты для разработчиков. Таким образом, автоматически отлавливаются различные ошибки, которые могут быть случайно зафиксированы в кодовой базе.

<div class="mw-translate-fuzzy">

Официальные серверы Hydra предоставляют готовые бинарные пакеты для ускорения процесса обновления Nixpgs: Пользователям не нужно компилировать их на своих компьютерах.

</div>

Руководство [Hydra](https://nixos.org/hydra/manual/) содержит обзор функциональности и возможностей Hydra, а также актуальное руководство по установке.

<span id="Installation"></span>

## Установка

Полное развертывание может быть осуществлено так:

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

<div class="mw-translate-fuzzy">

Модуль автоматически включит postgresql, если вы не измените опцию `services.hydra.dbi`. Схема базы данных будет создана автоматически службой Hydra, однако имейте в виду, что в базе данных будет храниться некоторое состояние, и полная stateless-конфигурация в настоящее время невозможна - делайте резервные копии.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- See nixos-option or the [Nixos Options page](https://search.nixos.org/options?query=services.hydra) for all options

</div>

<span id="Web_Configuration"></span>

### Веб-настройка

<div lang="en" dir="ltr" class="mw-content-ltr">

Hydra will provide the web interface [at localhost](http://localhost:3000/) port 3000. However you need to create a new admin user (as UNIX user `hydra`) before being able to perform any changes:

</div>

``` bash
# su - hydra
$ hydra-create-user alice --full-name 'Alice Q. User' \
    --email-address 'alice@example.org' --password-prompt --role admin
```

<span id="Virtual_machine"></span>

### Виртуальная машина

<div lang="en" dir="ltr" class="mw-content-ltr">

If not configured explicitly to do otherwise, Hydra will specify localhost as the default build machine. By default, system features enabling builds to be performed in virtual machines like "kvm" or "nixos-test" are not enabled. Such jobs will be queued indefinitely. Those options can be activated as follows:

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

This option leads to the file /etc/nix/machines being created. If the hydra service config is still set to buildMachinesFiles = \[\], then it will be ignored, so remove this option again or add `/etc/nix/machines` to it.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Flake jobset

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Configure jobset to the following:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Type: <a href="Flakes" class="wikilink" title="Flake">Flake</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Flake URI: an URI to a repo containing a Flake like git+https://git.myserver.net/user/repo.git

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The Flake output should have the attribute `hydraJobs` containing an attribute set that may be nested and reference derivations.

</div>

Пример вывода Flake, который заставляет Hydra собирать все пакеты, может выглядеть следующим образом:

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

<div lang="en" dir="ltr" class="mw-content-ltr">

### Restricted Mode

</div>

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

<span id="Imperative_Building"></span>

### Императивная Сборка

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

<span id="Declarative_Building"></span>

### Декларативная Сборка

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

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Jobsets

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A Jobset is a list of jobs which will be run. Often a jobset fits to a certain branch (master, staging, stable). A Jobset is defined by its inputs and will trigger if these inputs change. For example when a new commit onto a branch is added. Jobsets may depend on each other.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Job

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A closure which will be built as part of a job set (like a single package, iso image or tarball).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Release Set

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Defines all the jobs which are described in your release. By convention a file called`release.nix` is being used. See the [Hydra manual for Build Recipes](https://nixos.org/hydra/manual/#idm140737315920320) for a thorough description of the structure.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Evaluation

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The process of interpreting nix code into a list of `.drv files`. These files are the build recipes for all related outputs. You can introspect these files by running `nix show-derivation nixpkgs.hello`.

</div>

<span id="Build"></span>

#### Сборка

<div lang="en" dir="ltr" class="mw-content-ltr">

Instantiation of a Job which is being triggered by being part of the release set.

</div>

<span id="Known_Issues"></span>

## Известные Проблемы

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

<span id="Hydra_for_NixOS_releases"></span>

## Hydra для релизов NixOS

<div lang="en" dir="ltr" class="mw-content-ltr">

Hydra is used for managing official Nix project releases. The project Hydra server: <https://hydra.nixos.org/>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Some Hydra trackers for Nix projects:

</div>

- [Nixpkgs](https://hydra.nixos.org/project/nixpkgs)

<!-- -->

- [NixOS](https://hydra.nixos.org/project/nixos)

<span id="Resources"></span>

## Источники

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Video: Setting up a Hydra Build Farm by Peter Simons (2016)](https://www.youtube.com/watch?v=RXV0Y5Bn-QQ)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Hydra Caveats by Joepie91](https://gist.github.com/joepie91/c26f01a787af87a96f967219234a8723)

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Hydra" class="wikilink" title="Category:Hydra">Category:Hydra</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
