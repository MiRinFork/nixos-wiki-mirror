<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Playwright -->

Playwright Test is an end-to-end test framework for modern web apps. It bundles test runner, assertions, isolation, parallelization and rich tooling.

## Installing browsers for Playwright under NixOS

At first run, Playwright will prompt the user to run `playwright install` to install browsers. However, the browsers will not function due to missing dependencies.

The nixpkgs package `playwright-driver.browsers` provides a packaged form of the browsers that can be assigned to the PLAYWRIGHT_BROWSERS_PATH environment variable.

An example `shell.nix` that installs <a href="Visual_Studio_Code" class="wikilink" title="Visual Studio Code">Visual Studio Code</a> and Playwright.

``` nix
{ pkgs ? import <nixpkgs> { config.allowUnfree = true; } }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      vscode # if you want vscode
      nodejs_latest
      playwright-driver.browsers # !!! Make sure it has the same version as npm's version!!
    ];

    shellHook = ''
      export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
      export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
      export PLAYWRIGHT_HOST_PLATFORM_OVERRIDE="ubuntu-24.04" # Seems like it is not needed?
    '';
}
```

## Using flake

This can easily be adapted within a flake like:

``` nix
{
  description = "A very basic flake";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:nixos/nixpkgs";
  };
  
  outputs = { flake-parts, ... } @ inputs: flake-parts.lib.mkFlake { inherit inputs; } {
    perSystem = { config, self', inputs', pkgs, system, ... }: {
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          nodejs_latest
          playwright-driver.browsers
        ];

        shellHook = ''
          export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
          export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true;
        '';
      };
    };
    # Declared systems that your flake supports. These will be enumerated in perSystem
    systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
  };
}
```

## Using Devenv

With [Devenv](https://devenv.sh/) you can also set certain environment variables and pin packages to make playwright work. Again, make sure to pin to the same version of playwright in `devenv.yaml` and `package.json`!

### devenv.nix

``` nix
{ pkgs, lib, config, inputs, ... }:

let
  pkgs-playwright = import inputs.nixpkgs-playwright { system = pkgs.stdenv.system; };
  browsers = (builtins.fromJSON (builtins.readFile "${pkgs-playwright.playwright-driver}/browsers.json")).browsers;
  chromium-rev = (builtins.head (builtins.filter (x: x.name == "chromium") browsers)).revision;
in
{
  # https://devenv.sh/basics/
  env = {
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs-playwright.playwright.browsers}";
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
    PLAYWRIGHT_NODEJS_PATH = "${pkgs.nodejs}/bin/node";
    PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH = "${pkgs-playwright.playwright.browsers}/chromium-${chromium-rev}/chrome-linux/chrome";
  };

  # https://devenv.sh/packages/
  packages = with pkgs; [
    just
    nodejs
  ];

  # https://devenv.sh/languages/
  languages.javascript.enable = true;

  dotenv.disableHint = true;
  cachix.enable = false;

  # https://devenv.sh/scripts/
  scripts.intro.exec = ''
    playwrightNpmVersion="$(npm show @playwright/test version)"
    echo "❄️ Playwright nix version: ${pkgs-playwright.playwright.version}"
    echo "📦 Playwright npm version: $playwrightNpmVersion"

    if [ "${pkgs-playwright.playwright.version}" != "$playwrightNpmVersion" ]; then
        echo "❌ Playwright versions in nix (in devenv.yaml) and npm (in package.json) are not the same! Please adapt the configuration."
    else
        echo "✅ Playwright versions in nix and npm are the same"
    fi

    echo
    env | grep ^PLAYWRIGHT
  '';

  enterShell = ''
    intro
  '';

  # See full reference at https://devenv.sh/reference/options/
}
```

### devenv.yaml

``` yaml
# yaml-language-server: $schema=https://devenv.sh/devenv.schema.json
inputs:
  nixpkgs:
    url: github:NixOS/nixpkgs/nixos-unstable
  # Currently pinned to: playwright@1.52.0
  # See https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=playwright
  nixpkgs-playwright:
      url: github:NixOS/nixpkgs/979daf34c8cacebcd917d540070b52a3c2b9b16e
```

### package.json

``` json
{
  "name": "e2e-tests-ng",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "@playwright/test": "1.52.0",
    "eslint": "^8.41.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "playwright:test": "playwright test",
    "playwright:test:ui": "playwright test --ui",
    "playwright:install": "playwright install",
    "lint": "eslint ."
  },
  "dependencies": {
    "dotenv": "^16.0.3",
    "jsrsasign": "^11.0.0"
  }
}
```

## Bun + Playwright

Here is a `flake.nix` that is working with bun instead of nodejs (working today 2026-01-23). Put `flake.nix`, `playwright.config.ts`, `package.json` and `tests/example.spec.ts` in the root directory of your project and run

- `nix develop` to install packages and enter the devShell
- `bun install` to download playwright dependencies to node_modules
- `bun --bun playwright test --headed` to test the setup
- `bun playwright test --headed` to verify that without `--bun` flag the nodejs version is run and bun library is not available.

#### flake.nix

``` nix
{
  description = "Bun + Playwright dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        browsers =
          (builtins.fromJSON (builtins.readFile "${pkgs.playwright-driver}/browsers.json")).browsers;
        chromium-rev = (builtins.head (builtins.filter (x: x.name == "chromium") browsers)).revision;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            playwright-driver.browsers
          ];

          shellHook = ''
            export PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH="${pkgs.playwright-driver.browsers}/chromium-${chromium-rev}/chrome-linux64/chrome";
          '';
        };
      }
    );
}
```

#### playwright.config.ts

``` typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH,
        },
      },
    },
  ],
});
```

#### package.json

``` json
{
  "$schema": "https://json.schemastore.org/package.json",
  "name": "playwright_with_bun",
  "version": "1.0.0",
  "description": "Playwright tests with Bun",
  "scripts": {
    "test": "bun --bun playwright test"
  },
  "dependencies": {
    "@playwright/test": "^1.58.0",
    "playwright-core": "^1.58.0"
  },
  "devDependencies": {
    "@types/bun": "^1.3.6"
  }
}
```

#### tests/example.spec.ts

``` typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('Bun.stripANSI available', async () => {
  expect(typeof Bun.stripANSI).toBe('function');
});
```

#### test output

``` shell-session

[michi@nixos:~/dev/playwright_with_bun]$ bun --bun playwright test --headed

Running 2 tests using 1 worker

  ✓  1 [chromium] › tests/example.spec.ts:3:0 › basic test (1.1s)
  ✓  2 [chromium] › tests/example.spec.ts:8:0 › Bun.stripANSI available (3ms)

  2 passed (2.9s)

[michi@nixos:~/dev/playwright_with_bun]$ bun playwright test --headed
ReferenceError: Bun is not defined
    at Object.<anonymous> (/home/michi/dev/playwright_with_bun/playwright.config.ts:10:27)
    at Module._compile (node:internal/modules/cjs/loader:1706:14)
    at Module.newCompile2 (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/third_party/pirates.js:46:29)
    at Object.<anonymous> (node:internal/modules/cjs/loader:1839:10)
    at Object.newLoader2 [as .ts] (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/third_party/pirates.js:52:22)
    at Module.load (node:internal/modules/cjs/loader:1441:32)
    at Function._load (node:internal/modules/cjs/loader:1263:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
    at Module.require (node:internal/modules/cjs/loader:1463:12)
    at require (node:internal/modules/helpers:147:16)
    at requireOrImport (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/transform/transform.js:225:18)
    at loadUserConfig (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/common/configLoader.js:107:89)
    at loadConfig (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/common/configLoader.js:119:28)
    at loadConfigFromFile (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/common/configLoader.js:331:10)
    at runTests (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/program.js:197:18)
    at i.<anonymous> (/home/michi/dev/playwright_with_bun/node_modules/playwright/lib/program.js:70:7)
error: "playwright" exited with code 1
```

### Notes

- The [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension does not currently support Bun. The Node.js runtime may be used instead.
- Playwright version 1.58 is the first version where the command `bun --bun playwright test` works.
- see also <https://github.com/MBanucu/bun-playwright-nix>
