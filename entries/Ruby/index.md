<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ruby -->

\_\_TOC\_\_

## Troubleshooting

### Trouble with native dependencies

Few gems will force include paths for their native dependencies in the `extconf.rb` describing their native dependencies.

This issue will exhibit symptoms like being unable to find dependencies that are made available through nix when building; either through bundix or simple bundler calls.

A simple fix is to fork the gem into an alternative location, apply the fix that follows, and then reference the new git repository with fix for the gem.

The fix will probably look like this (for `ruby-filemagic`):

``` diff
diff --git a/ext/filemagic/extconf.rb b/ext/filemagic/extconf.rb
index 316e0ab979d243d03a967fda962a43b59a1bbdec..062e91d1023a3363962531fc8a54e7f0feb3bc26 100644
--- a/ext/filemagic/extconf.rb
+++ b/ext/filemagic/extconf.rb
@@ -1,15 +1,11 @@
 require 'mkmf'
 
+# gcc should be able to handle this properly.
 HEADER_DIRS = [
-  '/opt/local/include', # MacPorts
-  '/usr/local/include', # compiled from source and Homebrew
-  '/usr/include',       # system
 ]
 
+# gcc should be able to handle this properly.
 LIB_DIRS = [
-  '/opt/local/lib', # MacPorts
-  '/usr/local/lib', # compiled from source and Homebrew
-  '/usr/lib',       # system
 ]
 
 $CFLAGS << ' -Wall' if ENV['WALL']
```

## See also

- <a href="Packaging/Ruby" class="wikilink" title="Packaging/Ruby">Packaging/Ruby</a>
- [nix-community/bundix](https://github.com/nix-community/bundix) Generates a Nix expression for your Bundler-managed application
- [Chapter 9.14 Ruby of the nixpkgs manual](https://nixos.org/nixpkgs/manual/#sec-language-ruby)
- [nixpkgs ruby](https://github.com/bobvanderlinden/nixpkgs-ruby) A Nix repository with all Ruby versions being kept up-to-date automatically

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:Ruby" class="wikilink" title="Category:Ruby">Category:Ruby</a>
