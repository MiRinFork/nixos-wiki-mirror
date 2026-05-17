<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OfBorg -->

[**OfBorg**](https://github.com/NixOS/ofborg) is the primary [CI](https://en.wikipedia.org/wiki/Continuous_integration) service on <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>.

## Checks

This section outlines the various checks which OfBorg performs.

### ofborg-eval

Checks that the changed <a href="Nix_Expression_Language" class="wikilink" title="Nix Expression Language">Nix Expression Language</a> files are valid.

### ofborg-eval-check-maintainers

Checks that the changed package's maintainers are added to `maintainers/maintainer-list.nix`.

This action returns a GitHub Gist with all maintainers found for a package.

### ofborg-eval-check-meta

Checks that modified packages have an associated `meta` table inside of derivations.

### ofborg-eval-darwin

Checks that the modified packages build correctly on Darwin (macOS) systems.

### ofborg-eval-nixos

Checks that the modified packages build correctly on <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>.

## Commands

See [1](https://github.com/NixOS/ofborg#commands).

## Status

To see live logs from ofborg for a pull request, you can go to `https://logs.ofborg.org/?attempt_id=-ofborg-&key=nixos%2Fnixpkgs.&lt;PR NUMBER>`. Replace `<PR NUMBER>` with the number of your pr, e.g `123456`

To see the queue status for the builders, you can use [the ofborg prometheus instance](https://ofborg.org/prometheus/graph?g0.expr=ofborg_queue_builder_waiting%7Barch!%3D%22aarch64-darwin-lowprior%22%2Carch!%3D%22x86_64-darwin-lowprior%22%7D%20or%20ofborg_queue_evaluator_waiting&g0.tab=0&g0.stacked=0&g0.show_exemplars=0&g0.range_input=3d).

You can also find [alerts](https://ofborg.org/prometheus/alerts) on this prometheus instance.

Additionally, statistics about the size of the various build queues are available at [stats.php](https://events.ofborg.org/stats.php).

## Trivia

The name "Of Borg" is in reference to an American TV series called Star Trek, where a prominent character was [assimilated](https://en.wikipedia.org/wiki/Borg#Assimilation) into an alien group and his name changed to "Locutus Of Borg". Further information can be found in the ofborg [issues](https://github.com/NixOS/ofborg/issues/689#issuecomment-2295416227) tracker.

## Links

- [OfBorg's source](https://github.com/NixOS/ofborg)
- [OfBorg's documentation](https://github.com/NixOS/ofborg/wiki): Has instructions for operating a builder (as well as setting it up on MacOS).

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a>
