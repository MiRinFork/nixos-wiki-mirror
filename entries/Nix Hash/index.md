<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix Hash -->

[Cryptographic hashes](https://en.wikipedia.org/wiki/Cryptographic_hash_function) play an essential role in a lot of places in the Nix ecosystem. When using a hash somewhere, two criteria are essential to do so properly: the **algorithm** used and the **encoding** (and, to some extent, *what* is hashed).

Supported algorithms are `md5`, `sha1`, `sha256`, `sha512`, `BLAKE3`. The first two are deprecated and should not be used anymore, but you may still stumble upon them in existing code.

A hash – which is simply a sequence of bytes – is usually encoded in order to be representable as string. Common encodings are `base16` (commonly called "hex"), `base32` and `base64`. Note that the base32 is a [**custom one**](https://github.com/NixOS/nix/blob/c70e1433abb61012dffdcd4559ec2aa87672e15c/src/libutil/hash.cc#L91-L112) that is not documented nor standardized in any way! If possible, use the provided hashing tools to convert hashes to it (see below). base32 is used by Nix in a lot of places because it is shorter than hex but can still safely be part of a file path (as it contains no slashes).

## Usage

Many derivations are so-called *fixed-output* derivations, meaning that you need to know and specify the hash of the output in advance. As an example, let's look at nixpkgs function `fetchurl`:

``` nix
src = fetchurl {
  url = "https://example.org/downloads/source-code.zip";
  hash = "sha256-IdU23rswdtT26QRL2e8VyMWLKfnL1K1AawWDEKVl3rw=";
};
```

The format of the hash follows the [SRI (Subresource Integrity)](https://www.w3.org/TR/SRI/#introduction) specification.

### Updating packages

[Using TOFU to get the new hash](https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers-caveats)

## What exactly is hashed

Some content can either be hashed "flat" or "recursively". "flat" (sometimes also called "file") is simply taking the hash of the file, byte by byte, and will give you the same result as for example \`sha256sum -b myfile.zip\`. "recursive" (or sometimes "path") hashing takes multiple files, path names and metadata (attributes) into consideration. It works by <abbr title="nix archive (file format)">NAR</abbr>ing the input before hashing.

For `fetchurl`, the option to switch between both is called `recursiveHash` and defaults to `false`.

`fetchzip` on the other hand will download the file, unzip it and then recursively hash the output. There's no option. The motivation behind this is that sometimes, the content is always the same, but the archive may change. This is because zip files are inherently non-deterministic, and might be generated automatically. If they are regenerated, they'll have a different hash, although the content is the same. `recursiveHash` works around that.

## Tools

- [nix-hash](https://nixos.org/manual/nix/stable/command-ref/nix-hash.html)
- [nix hash](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-hash) (<a href="nix_command" class="wikilink" title="nix command">nix command</a>)

When dealing with remote files, `nix-prefetch-url` offers a handy shortcut for downloading the file into the Nix store and printing out its hash. (`nix-prefetch-url --unpack` is its `fetchzip` equivalent.)

To get an SRI hash, which isn't supported by `nix-prefetch-url`, use `nix store prefetch-file `[`https://`](https://)`...` instead.

## Libraries

- [Original C++ implementation](https://github.com/NixOS/nix/blob/master/src/libutil/hash.cc#L83)
- [Rust implementation](https://github.com/kolloch/nix-base32)
- [Go implementation](https://gist.github.com/colemickens/27ad622adfaf8c980f3b5066b21604ba)
- [PHP Implementation](https://github.com/dritter/nix-hasher/blob/master/src/Hasher.php#L18-L49)
- [PHP Implementation (NAR serialization + Hash)](https://github.com/loophp/path-hasher)

## Further reading

- Eelco Dolstra's [PhD thesis](https://edolstra.github.io/pubs/phd-thesis.pdf), section 5.1.
- [Github Issue](https://github.com/NixOS/nix/issues/806) about which encoding is used where, and what pitfalls can arise from it.

<a href="Category:_Nix" class="wikilink" title="Category: Nix">Category: Nix</a>
