<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Node.js -->

\_\_TOC\_\_

[Node.js](https://nodejs.org) is an open-source, cross-platform <a href="JavaScript" class="wikilink" title="JavaScript">JavaScript</a> runtime environment that allows developers to execute JavaScript code on the server side. Built on the V8 JavaScript engine, it enables the creation of scalable and high-performance applications, particularly for real-time web services.

## Setup

Adapt or add following line to your system configuration:\<syntaxhighlight lang="nix\>

` environment.systemPackages = with pkgs; [ nodejs ];`

</syntaxhighlight>

See `nix search nixpkgs nodejs` for additional versions like `nodejs-12_x`, etc.

## Packaging

### Packaging with `buildNpmPackage`

From the [Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#javascript-tool-specific): "`buildNpmPackage` allows you to package npm-based projects in Nixpkgs without the use of an auto-generated dependencies file (as used in node2nix). It works by utilizing npm’s cache functionality – creating a reproducible cache that contains the dependencies of a project, and pointing npm to it."

To better understand what happens under the hood and see the latest features [see the build-npm-package source](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/node/build-npm-package/default.nix).

Here's a `flake.nix` example to build a node package from the current directory.

``` nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
  in {
    packages."x86_64-linux".default = pkgs.buildNpmPackage {
      pname = "my-node-script";
      version = "0.1.0";
      src = ./.;
      npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    };
  };
}
```

By default, the build phase runs the `build` script defined in `package.json`.

``` json
{
  "scripts": {
    "build": "npm install"
  }
}
```

The binaries created in this package are defined by the `bin` key in `package.json`. This example will result in a `my-node-script` binary being created that basically runs `node main.js`.

``` json
{
  "bin": {
    "my-node-script": "main.js"
  }
}
```

#### Packaging electron applications

When trying to `npm i` electron, by default electron will try to download binaries from the internet, which does not work in the Nix sandbox. To stop it from trying to access the internet, set the environment variable `ELECTRON_SKIP_BINARY_DOWNLOAD = "1";`.

For examples of packaging electron applications, search [Nixpkgs](https://github.com/search?q=buildNpmPackage+electron+repo%3ANixOS%2Fnixpkgs&type=code&l=NixOS%2Fnixpkgs) for the terms "buildNpmPackage" and "electron".

### Packaging with `yarn2nix`

yarn2nix uses the yarn nodejs tool to create a file called yarn.lock, which in return can be used by yarn2nix to generate a usable yarn expression. This is what was needed to convert a small application server [shackspace muellshack](https://git.shackspace.de/rz/muellshack/tree/3be09715911628b164fa1cf346387555ca26a5b1):

``` console
$ nix-shell -p yarn yarn2nix
$ yarn install # creates yarn.lock
$ yarn2nix > yarn.nix
$ vim package.json # add:  "bin": "app.js",
$ cat > default.nix <<EOF
with (import <nixpkgs> {});
rec {
  muellshack = mkYarnPackage {
    name = "muellshack";
    src = ./.;
    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;
    yarnNix = ./yarn.nix;
  };
}
EOF
$ sed -i '1i#!/usr/bin/env node' app.js
$ chmod +x app.js
$ nix-build

$ result/bin/muellshack
```

The complete diff can be found at [the respective diff](https://git.shackspace.de/rz/muellshack/commit/f5e498acd47695c4947dc1b5ddebfad2eee8d653)

## Troubleshooting

### Using `npm install -g` fails

The following errors are to be expected.

    npm ERR! Error: EACCES: permission denied, access '/nix/store/00000000000000000000000000000000-nodejs-6.14.3/lib/node_modules'
    npm ERR!     at Error (native)
    npm ERR!  { Error: EACCES: permission denied, access '/nix/store/00000000000000000000000000000000-nodejs-6.14.3/lib/node_modules'
    npm ERR!     at Error (native)
    npm ERR!   errno: -13,
    npm ERR!   code: 'EACCES',
    npm ERR!   syscall: 'access',
    npm ERR!   path: '/nix/store/00000000000000000000000000000000-nodejs-6.14.3/lib/node_modules' }
    npm ERR!
    npm ERR! Please try running this command again as root/Administrator.

The store is read-only as it should be. Purity in Nix and NixOS makes it <em>right</em> not to allow installation using `-g`.

There are a couple solutions, none of them are strictly wrong. You can either configure `npm` so it installs globally to your home, or avoid using `-g` entirely. It is also possible, for node versions 8 and greater, to use `npx`.

#### Install to your home

This is done through configuring npm and amending your `PATH`.[^1]

``` console
$ npm set prefix ~/.npm-global
```

Then, amend your `PATH` so it looks into `$HOME/.npm-global`.

#### Avoid using `-g`

This is a bit harder to implement, but creates a bit more strictness in your environment; it will be impossible accidentally make use of what would have been a globally installed package. The idea is to install it to either a temporary transitory folder or to the project folder, then run the locally installed instance of the package, the binaries are found under `node_packages/.bin/`.[^2]

``` console
$ npm install uglify-es
[ ... ]

$ ls -l node_modules/.bin/
total 0
lrwxrwxrwx 1 user users 25 Jul 17 15:34 uglifyjs -> ../uglify-es/bin/uglifyjs

$ node_modules/.bin/uglifyjs --help
  Usage: uglifyjs [options] [files...]
```

##### direnv

If calling the executables with full path is too cumbersome, another elegant solution is to leverage [direnv](https://direnv.net/). Direnv is a shell-hook that can set directory-specific environment-variables. You basically add a file ".envrc" next to your "package.json" with the following content:

    layout node

direnv then adds your "node_modules/.bin" to your path whenever you enter the directory. Please follow direnv's setup instructions on how to activate setup direnv in general.

#### Using `npx`

``` console
$ nix-shell -p nodejs-8_x

$ npx create-react-app --help
npx: installed 67 in 1.671s
  Usage: create-react-app <project-directory> [options]
[...]
```

#### Using `npx` with binaries

Some binaries obtained via npm will not work out of the box with NixOS, as they're dynamically linked to things that don't exist in NixOS (for good reason!)

They'll typically give some kind of `ENOENT` error. For example, `npx cypress open` might give an error like:

``` console
$ npx cypress open

Cypress failed to start.
This is usually caused by a missing library or dependency.
The error below should indicate which dependency is missing.
https://on.cypress.io/required-dependencies
If you are using Docker, we provide containers with all required dependencies installed.
----------
spawn /home/rkb/.cache/Cypress/4.10.0/Cypress/Cypress ENOENT
```

One quick workaround for this is <a href="Steam#FHS_environment_only" class="wikilink" title=" to use steam-run"> to use <code>steam-run</code></a> to provide a placeholder FHS environment that \*should\* work; e.g. for the Cypress example above:

``` console
$ nix-env -iA nixos.steam-run

$ steam-run npx cypress open

-- Cypress opens successfully!
```

(Inspired by [this discussion on discourse.nixos.org](https://discourse.nixos.org/t/how-to-make-nixos-so-easy-that-people-can-be-productive-up-front-without-having-to-first-learn-the-nix-language/5625))

**Google-fonts fetch failure with NextJS**

Nextjs is a popular React framework and comes with built-in support with support for Google fonts. If a NPM project uses it,

``` console
$ npm run build # which calls "next build"
```

will try to fetch and optimize the Google fonts during a nix build run, which will fail in Nix's isolated sandbox without internet:

``` shell
...
Running phase: buildPhase
Executing npmBuildHook

> nextjs-ollama-local-ai@0.1.0 build
> next build

   ▲ Next.js 14.1.0

   Creating an optimized production build ...
request to https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap failed, reason: getaddrinfo EAI_AGAIN fonts.googleapis.com
    at ClientRequest.<anonymous> (/build/source/node_modules/next/dist/compiled/node-fetch/index.js:1:66160)
    at ClientRequest.emit (node:events:518:28)
    at TLSSocket.socketErrorListener (node:_http_client:500:9)
    at TLSSocket.emit (node:events:518:28)
    at emitErrorNT (node:internal/streams/destroy:169:8)
    at emitErrorCloseNT (node:internal/streams/destroy:128:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  type: 'system',
  errno: 'EAI_AGAIN',
  code: 'EAI_AGAIN'
}
Failed to compile.

src/app/layout.tsx
`next/font` error:
Failed to fetch `Inter` from Google Fonts.

> Build failed because of webpack errors

ERROR: `npm build` failed
```

You have to patch the Javascript code

``` javascript
// In layout.tsx file replace
//
// import {Inter} from "next/font/google"; // or any other Google font like Inter
// const inter = Inter({ subsets: ["latin"] });
// 
// with ("src:" must be relative to the src/app/layout.tsx file):
import localFont from "next/font/local";
const inter = localFont({ src: './Inter.ttf' });
```

and place the Google fonts from Nixpkgs into the project, e.g. in a `preBuild` phase:

``` nix
buildNpmPackage {
  pname = "myproject";
  version = "1.0.0";
  ...

  # see https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/cr/crabfit-frontend/package.nix
  preBuild = ''
    cp "${
      google-fonts.override { fonts = [ "Inter" ]; }
    }/share/fonts/truetype/Inter[slnt,wght].ttf" src/app/Inter.ttf
  '';

  ...
}
```

You can take a look at what fonts are available in the Nix `google-fonts` package by calling:

``` console
$ ls -ahl $(nix build --no-link --print-out-paths nixpkgs#google-fonts)/share/fonts/truetype/
```

Take a look at [homepage-dashboard package in nixpkgs](https://github.com/NixOS/nixpkgs/blob/8358fd43a66594d8b3445d87006185fa76d4be6e/pkgs/by-name/ho/homepage-dashboard/package.nix) for further workarounds for Nextjs in Nix.

## Tips and tricks

### Example nix flake shell for Node.js development

<a href="Flake" class="wikilink" title="Flake">Flake</a> example: (Note: the \`\${&lt;nixpkgs&gt;}\` needs to be replaced by \`\${<nixpkgs>}\`

### Using nodePackages with a different node version

Packages in are built using , so if you <a href="Overlays" class="wikilink" title="overlay that package">overlay that package</a> to a different version, the will be built using that: \<syntaxhighlight lang="nix\> final: prev: {

` nodejs = prev.nodejs-16_x;`

}

</syntaxhighlight>

``` console
$ pnpm node --version
v16.17.1
```

### Override NodeJS package

Overriding a Nix package which is based on *buildNpmPackage* can be challeging because not only the source hash has to get changed but sometimes also the *package-lock.json* file and the *npmDepsHash*.

Unfortunately it is not possible to directly access and change *npmDepsHash* inside *overrideAttrs*, so this is an example workaround for changing the version, *package-lock.json* and hashes of the package *eslint*:

``` nix
environment.systemPackages = [
  (eslint.overrideAttrs (oldAttrs: rec {
    version = "8.57.0";
    src = fetchFromGitHub {
      owner = "eslint";
      repo = "eslint";
      rev = "refs/tags/v${version}";
      hash = "sha256-nXlS+k8FiN7rbxhMmRPb3OplHpl+8fWdn1nY0cjL75c=";
    };
    postPatch = ''
      cp ${./package-lock.json} package-lock.json
    '';
    npmDepsHash = "sha256-DiXgAD0PvIIBxPAsdU8OOJIyvYI0JyPqu6sj7XN94hE=";
    npmDeps = pkgs.fetchNpmDeps {
      src = lib.fileset.toSource {
        root = ./.;
        fileset = lib.fileset.unions [
          ./package-lock.json
          ./package.json
        ];
      };
      name = "eslint-${version}-npm-deps";
      hash = npmDepsHash;
    };
  }))
];
```

## External Links

- [node2nix](https://github.com/svanderburg/node2nix)

### References

<a href="Category:JavaScript" class="wikilink" title="Category:JavaScript">Category:JavaScript</a>

[^1]: [joepie91 on \#nixos, 2018-07-09](https://logs.nix.samueldr.com/nixos/2018-07-09#1358500)

[^2]: \[<https://logs.nix.samueldr.com/nixos/2018-07-17#1386090>; samueldr on \#nixos, 2018-07-17\]
