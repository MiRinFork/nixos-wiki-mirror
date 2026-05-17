<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: The Nix Language versus the NixOS Module System -->

If you are configuring NixOS, it behooves you to understand the difference between the <a href="Overview_of_the_Nix_Language" class="wikilink" title="Nix language">Nix language</a> (hereafter: Nix) and the <a href="NixOS_modules" class="wikilink" title="NixOS module system">NixOS module system</a> (hereafter: module system). The module system is implemented and configured using Nix.

Generally the module system way of doing things is preferred as it properly merges values, allows for overrides using `lib.mkForce`, and supports recursion in ways that would loop infinitely in plain Nix. Using constructs from the Nix side of the below table will frequently get you into trouble in NixOS configurations, for various reasons.

(Exception: some options in a NixOS configuration expect a function value. For the body of those functions, stick to the Nix side of the table. The module system is ‘finished’ before those functions are invoked, so not only do you not have to worry about infinite recursion and the like, but also the things you get out of the module system API are ‘too late’ to be interpreted the way you probably intend.)

Here is a cheat sheet, with explanations below:

<table>
<thead>
<tr>
<th><p>Feature</p></th>
<th><p>In Nix</p></th>
<th><p>In the module system</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Recursive references</p></td>
<td><div class="sourceCode" id="cb1"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a><span class="kw">rec</span> <span class="op">{</span></span>
<span id="cb1-2"><a href="#cb1-2" aria-hidden="true" tabindex="-1"></a>  <span class="va">foo</span> <span class="op">=</span> <span class="dv">1</span><span class="op">;</span></span>
<span id="cb1-3"><a href="#cb1-3" aria-hidden="true" tabindex="-1"></a>  <span class="va">bar</span> <span class="op">=</span> foo<span class="op">;</span></span>
<span id="cb1-4"><a href="#cb1-4" aria-hidden="true" tabindex="-1"></a><span class="op">}</span></span></code></pre></div></td>
<td><div class="sourceCode" id="cb2"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb2-1"><a href="#cb2-1" aria-hidden="true" tabindex="-1"></a><span class="op">{</span> <span class="va">config</span><span class="op">,</span> <span class="op">...</span> <span class="op">}</span>:</span>
<span id="cb2-2"><a href="#cb2-2" aria-hidden="true" tabindex="-1"></a><span class="op">{</span></span>
<span id="cb2-3"><a href="#cb2-3" aria-hidden="true" tabindex="-1"></a>  <span class="va">foo</span> <span class="op">=</span> <span class="dv">1</span><span class="op">;</span></span>
<span id="cb2-4"><a href="#cb2-4" aria-hidden="true" tabindex="-1"></a>  <span class="va">bar</span> <span class="op">=</span> config<span class="op">.</span>foo<span class="op">;</span></span>
<span id="cb2-5"><a href="#cb2-5" aria-hidden="true" tabindex="-1"></a><span class="op">}</span></span></code></pre></div></td>
</tr>
<tr>
<td><p>Deep merging two attrsets</p></td>
<td><p><code>lib.recursiveUpdate attrs1 attrs2</code></p></td>
<td><p><code>lib.mkMerge [ attrs1 attrs2 ]</code></p></td>
</tr>
<tr>
<td><p>If-then</p></td>
<td><p><code>if cond then values else { }</code><br />
</p></td>
<td><p><code>lib.mkIf cond values</code></p></td>
</tr>
<tr>
<td><p>Imports</p></td>
<td><p><code>import ./file.nix</code></p></td>
<td><div class="sourceCode" id="cb3"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb3-1"><a href="#cb3-1" aria-hidden="true" tabindex="-1"></a><span class="op">{</span></span>
<span id="cb3-2"><a href="#cb3-2" aria-hidden="true" tabindex="-1"></a>  <span class="va">imports</span> <span class="op">=</span> <span class="op">[</span> <span class="ss">./file.nix</span> <span class="op">];</span></span>
<span id="cb3-3"><a href="#cb3-3" aria-hidden="true" tabindex="-1"></a><span class="op">}</span></span></code></pre></div></td>
</tr>
</tbody>
</table>

## Recursive references

You may have learned about the Nix keyword `rec`. I try to avoid this keyword even in non-module Nix programming, but some people like it. It is absolutely a recipe for confusion to use it in a module, however. You may think that you can do something clever like this:

``` nix
rec {
  services.foobar.enabled = true;
  services.bazqux.allowedPorts = [ services.foobar.port ];
}
```

That will get you an error complaining that the `port` attribute can't be found, even though you know that `services.foobar.port` is a valid NixOS option. This is because the `rec` keyword does not care about defined NixOS options. It only lets you access what you have defined in the attrset on which you have used it, and in this example, the only attribute defined on `services.foobar` is `enabled`.

Don't be tempted to be even cleverer and say that it's okay to use `rec` references when you know they've been defined in this attrset, like `services.foobar.enabled` is. That will still prevent overrides of that value in other modules from propagating to your use site. It will also fail if you have used any module system API to define the value you want, like `lib.mkIf` or `lib.mkForce`.

Instead, what you should always do is access configuration values from the `config` parameter that should be part of the parameter list at the top of your config file:

``` nix
{ config, ... }:
{
  services.bazqux.allowedPorts = [ config.services.foobar.port ];
}
```

It is okay, and often advised, to use let-bound aliases for repeated `config` paths:

``` nix
{ config, ... }:
let
  inherit (config.services) foobar;
  # equivalently: foobar = config.services.foobar;
in
{
  services.bazqux.allowedPorts = [ foobar.port ];
}
```

Let-bound variables are always an acceptable substitute for `rec` in other circumstances as well, and I **rec**ommend using them instead in general.

## Deep merging two attrsets

If you have used any module system API to construct a config, you don't want to pass the result of that to `lib.recursiveUpdate` (or the `//` operator, for that matter). This is because everything special about the module system is encoded as plain Nix attrsets, and `lib.recursiveUpdate` doesn't know about that encoding and will mangle it.

For example: the result of `lib.mkIf enabled { foo = bar; }` is just the following attrset (don't worry, you don't need to remember the details):

``` nix
{
  _type = "if";
  condition = enabled;
  content = {
    foo = bar;
  };
}
```

If you try to merge that with `{ baz = "qux"; }`, you will of course get the following mishmash:

``` nix
{
  _type = "if";
  condition = enabled;
  content = {
    foo = bar;
  };
  baz = "qux";
}
```

This is definitely not what you want; the `baz` attribute will be ignored because the module system doesn't expect to look for it on a special `_type = "if"` node! Using `lib.mkMerge` instead results in the right thing. (‘The right thing’ is another complicated special node that represents a merge to be done dynamically.)

## If-then

When your condition only references local values, it is okay to use native Nix if-then expressions. But if your condition references any part of the configuration tree, it is best to use `lib.mkIf`. (Note that a let-bound variable whose definition references the configuration tree counts!) Suppose, for example, your config were to contain this:

``` nix
services.foobar =
  if config.services.foobar.enabled then { ... } else { };
```

This will cause an infinite recursion as soon as anything under `services.foobar` is accessed, because in order to determine that value, first `services.foobar.enabled` must be accessed, which is itself under `services.foobar`.

The alternative avoids this difficulty:

``` nix
services.foobar =
  lib.mkIf config.services.foobar.enabled { ... };
```

Because the result of `lib.mkIf` is a plain Nix attrset, the module system can skip it when looking for definitions of `services.foobar.enabled`, avoiding the circularity.

## Imports

Nix imports and module system imports are completely different things. Module system imports form a graph of modules, all of which are loaded up front when your configuration is evaluated. *They must be unconditional;* you cannot use a configuration value to affect which or whether any module is imported via the module system, or you will get an infinite recursion. Passing data between modules can only be done via defined options, either those that have been defined for you in NixOS or those that you define yourself.

These limitations aside, importing modules via the module system is almost always the better way to break a large configuration into smaller units. Using Nix imports in module configurations is useful for referencing function libraries or plain data files that have been encoded in Nix.

(Note the extra ‘s’: it's `import` in Nix, and `imports` in the module system!)

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
