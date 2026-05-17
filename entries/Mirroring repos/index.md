<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mirroring repos -->

Many software platforms provide their own package management tools and maintain their own public software repositories.

This is helpful for Nixpkgs, because it means that discrete units of code are already available. They're often versioned, and sometimes already have digests attached.

This is a challenge for Nixpkgs, because Nix needs to adapt the conventions of these foreign systems to its own.

It's preferable for a particular foreign repository to be adapted in one way.

There are also general best practices we'd like to promote in the development of these adapters.

Ideally, a new contributor should be able to consult the Nixpkgs manual regarding their language, and be able to determine precisely what they need to do to add their package in a consistent way.

<h2>

Goals for Adapters

</h2>

<dl>

<dt>

Reproducibility

<dd>

This is the usual Nix requirement: a particular expression should produce the same output if it's re-run. At the bare minimum, two productions of an expression should be functionally indistinguishable, but this is a degraded case of operation.

</dd>

</dl>

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
