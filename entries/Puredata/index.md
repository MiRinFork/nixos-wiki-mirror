<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Puredata -->

If you want to use packaged plugins, you can use the 'puredata-with-plugins' wrapper:

Create a shell.nix with:

` { pkgs ? import `<nixpkgs>` {} }:`  
` `  
` pkgs.mkShell {`  
`   buildInputs = [`  
`     (pkgs.puredata-with-plugins [ pkgs.zexy ])`  
`   ];`  
` }`

... and you can

``  nix-shell shell.nix --run "pd -lib zexy"` ``

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
