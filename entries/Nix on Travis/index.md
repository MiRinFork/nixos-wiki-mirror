<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix on Travis -->

Travis-CI provides a `language: nix` setting (to put in a *.travis.yml* file) to run continuous integration scripts on a machine with Nix installed.

See [Travis-CI documentation for Nix](https://docs.travis-ci.com/user/languages/nix), [Travis source code for Nix](https://github.com/travis-ci/travis-build/blob/master/lib/travis/build/script/nix.rb).

## Caching dependencies

Build dependencies are usually downloaded from some online public binary cache; but some dependencies are not available on such a cache and must be built on the CI machine on every run. It is however possible to reuse the result of such local builds from one run of the CI script to the next one by means of [Travis CI caching feature](https://docs.travis-ci.com/user/caching/).

A Nix binary cache can be set up in a local directory (say *~/nix.store*) which will be preserved between CI runs:

    cache:
      directories:
      - $HOME/nix.store

Nix must then be configured to read from this local binary cache:

    before_install:
    - sudo mkdir -p /etc/nix
    - echo "substituters = https://cache.nixos.org/ file://$HOME/nix.store" | sudo tee -a /etc/nix/nix.conf > /dev/null
    - echo 'require-sigs = false' | sudo tee -a /etc/nix/nix.conf > /dev/null

The first line ensures the directory holding Nix’s configuration files exists. The second line declares two binary cache: the main only hydra cache and the locally cached directory. The third line declares that cached closures need not be signed; indeed the local directory will not be signed.

Finally, actual data must be stored in the cache:

    before_cache:
    - mkdir -p $HOME/nix.store
    - nix copy --to file://$HOME/nix.store -f default.nix buildInputs

In this example, the *buildInputs* from *default.nix* are added to the binary cache.

NB: in this setting, the cache only grows. It might be manually deleted when it becomes too bloated but smarter eviction strategies can be implemented too!

## Enable sandboxed builds

At the moment travis does not have a sandbox enabled by default. This can lead to non-trivial to reproduce errors, when files from the travis image interfere with the build. Enabling however is straight-forward by using the following little snippet:

``` nix
before_script:
  - sudo mkdir -p /etc/nix && echo 'sandbox = true' | sudo tee /etc/nix/nix.conf
```
