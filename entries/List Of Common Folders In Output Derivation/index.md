<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: List Of Common Folders In Output Derivation -->

## Goal of this page

**IMPORTANT: this page is under development, and was created to support [this thread](https://discourse.nixos.org/t/list-and-role-of-all-special-folders-in-out/12292).**

When creating a package, one need to copy stuff in various subfolders in the `$out` directory. The most useful subfolder is certainly `$out/bin` in which all executable must stay. However, there is many more such folders: `$out/share`, `$out/lib`... and some folders are also quite specific to some programs (python, emacs, ...).

This page is an attempt to give a (a non-exhaustive) list of these "special" folders: they could be here either because they receive a special treatment by nix or by any famous program, or because the name is a well used convention.

## How to add a new entry

To add a new entry, you can start by copy pasting an existing entry. Ideally, each folder in this page would come with

- a very short description that says who consider this folder as special (nix, python, or just a convention), what kind of people can be interested by that folder (everybody, kernel developpers, python developpers...), how popular this folder is among these users (let's say 3 is "much nix packager will need to write into that folder at some point", 2 is "quite useful, but only if you create special derivations, like graphical programs, python...", 1 is "used in very specialized application", 0 is "very rare and specialized") and if we usually expect the user to directly write manually into that folder or if it will be done automatically by some helpers.
- a description of why it is useful
- an example of a file that could be put here (for instance, one can put a library in `$out/lib/mylib.so`)
- a description of the special treatment they receive by nix or by the software, and if possible a link to the code that is doing this treatment. The treatment could be to be linked in some `/run/` folders, if the files are read recursively or not (for example can I put an executable in `$out/bin/myprogram/myexec`), and if the files are expected to live in `$out/subfolder` directly or in some sub-subfolders like `$out/subfolder/myprogram` (or if it does not matter)...
- typical way to populate that folder (copy or helpers LIKE `makeWrapper`, `makeDesktopItem`... Put most common first.)
- a simple example or a link to a (if possible simple) derivation in nixpkgs that uses this folder.

In order to keep the list ordered, we try to put the group these folder in different sections. If you add a folder, try to put it in a meaningful section, and put the most important ones first. If you describe a folder and its children, like `$out/share` and `$out/share/applications`, put the two next to each other.

## Generic Nix-related folders

### Folder `$out/bin`

- **Name of the folder**: `$out/bin`
- **Handled by:** nix, **Concerning:** everybody, **Popularity:** 3, **How to populate**: manually (often) or via helpers (often)
- **Description:** It contains all the executables of a given software that will be included in the `PATH`. Executables are put directly at the root of the `$out/bin` folder.
- **Example of a filename**: `$out/bin/mysoftware` where `mysoftware` is usually a script (bash...) or a binary.
- **Treatment**: Nix will add the `$out/bin` folder of the installed packaged in the `PATH` variable environment. TODO: check Nix is not doing anything else, and link to code.
- **How to populate**:
  - Manually: after a build succeed, you can usually just copy the executables via `cp yourbinary $out/yourbinary` (or using the `install -Dm755 -t $out/bin yourbinary` program; if you use the `cp` version, just ensure the program is executable. Nix should automatically setup the permission propertly for read and write part.). Note that if you choose to follow the more standard `configure`/`make install` scheme, then the `configure` file will be run with `--prefix=$out` by default. You can read how to change the default flags in configure and Makefile [here](https://nixos.org/manual/nixpkgs/stable/#ssec-configure-phase).
  - `writeShellScriptBin "my-file" `*`echo 'my bash code';`* to create quickly a whole derivation with a simple bash script. See more [in the manual](https://nixos.org/manual/nixpkgs/stable/#chap-trivial-builders), and see variants/source/examples [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/trivial-builders.nix) (you have for example `writeCBin` if you want to compile a C code).
  - `wrapProgram $out/bin/MYPROGRAM --set FOOBAR baz` or `makeWrapper`to wrap a given binary in order to add some environment variables. See more [here](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-functions) and in the [source code](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/setup-hooks/make-wrapper.sh).
  - `symlinkJoin { name = "myexample"; paths = [ pkgs.hello pkgs.stack ];}` will merge both derivations `pkgs.hello` and `pkgs.stack` into a single derivation using symlinks (practical to combine it with `writeShellScriptBin` in order to quickly add a script to an existing derivation). See more [in the manual](https://nixos.org/manual/nixpkgs/stable/#chap-trivial-builders) or longer description and examples [in the source](https://github.com/NixOS/nixpkgs/blob/de78745bddf32e69db0bdc2fb30fd282eaaeff3c/pkgs/build-support/trivial-builders.nix#L273).
  - Usual bash commands, like
    ``` bash
    cat > $out/yourcode <<EOF
    your code
    EOF
    ```

    can be useful to add a script to an existing derivation.
- **Example of use**:
  To create a simple derivation with a bash script in `$out/myprogram`:

  ``` bash
  { pkgs ? import <nixpkgs> {} }:
  pkgs.writeShellScriptBin "myprogram" ''
    echo "Hello world"
  ''
  ```

  To see example of use with `install`, see for instance the [qcad derivation](https://github.com/NixOS/nixpkgs/blob/7d0ba0850fe9f0a520c6c8fb2f5db8f71f323627/pkgs/applications/misc/qcad/default.nix#L50).

## For some specific language

### Python

## Specific to Kernel development
