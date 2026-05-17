<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bazel -->

Bazel is a build system for software development that attempts to create a hermetic build by bootstrapping the toolchain from known sources and binaries. Unfortunately, the desire to be hermetic is more aspirational than exact, and can run into some problems.

Bazel downloads binaries (for example, protoc for compiling protocol buffers, or the go sdk) which are dynamically linked, expecting an FHS environment.

The easiest way to use bazel is with nix-shell by creating a file called shell.nix in the root of the project (alongside the WORKSPACE):

` { pkgs ? import `<nixpkgs>` {} }:`  
` `  
` (pkgs.buildFHSEnv {`  
`   name = "bazel-userenv-example";`  
`   targetPkgs = pkgs: [`  
`     pkgs.bazel`  
`     pkgs.glibc`  
`     pkgs.gcc`  
`   ];`  
` }).env`

You can then run \`nix-shell\` from the root of the project before calling bazel.

While there are solutions for simplifying the use of a shell.nix like direnv, lorri, and devenv, they are not compatible with a shell.nix that creates an FHS environment, since the FHS environment requires a sub-shell to properly setup the chroot, and the three tools above only support making changes to environment variables.

## Troubleshooting

In some versions of bazel, the sandboxing does not inherit the FHS environment, and elements of the toolchain (notably ) may fail to run. In that case, switching to should solve the problem.

## See also

- [buildBazelPackage implementation](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/build-bazel-package/default.nix)
- [buildBazelPackage used in nixpkgs](https://sourcegraph.com/search?q=context:global+buildBazelPackage+lang:nix+repo:%5Egithub%5C.com/NixOS/nixpkgs%24+&patternType=standard)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
