<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Modular Services -->

Modular services are an experimental feature added to NixOS between the 25.05 and 25.11 releases.

For official documentation see the [NixOS Manual](https://nixos.org/manual/nixos/unstable/#modular-services).

This page exists to used to collect experiences and recommendations for using this feature that would not fit well in the NixOS manual.

## Do's

## Do not's

### Depend on anything already being in \$PATH

Don't expect any programs to be available, not even GNU coreutils.

Start the services program using a full path and if you need to write a script then set PATH there.

Setting a \$PATH with a shell script:

``` nix
{
  process.argv = [
    (pkgs.writeShellScript "foo.sh" ''
      PATH="${lib.makeBinPath [ pkgs.foo pkgs.bar pkgs.coreutils ]}"

      mkdir /var/lib/foo
      foo …
    '')
  ];
}
```

Or set PATH without a script using <a href="execline" class="wikilink" title="execline">execline</a>:

``` nix
{
  process.argv = [
    "${pkgs.execline}/bin/export" "PATH" (lib.makeBinPath [ pkgs.foo pkgs.bar ])
    "foo" "…"
  ];
}
```

## Research Topics

### "One-shot" services

Some services run to completion and should not be restarted.

Should these services we be wrapped in scripts that never return?

### Secrets management

How to load secrets without depending on specific service managers?

### User management

How to create new users?

### Security hardening

Best practices for privilege de-escalation?

### Intra-service dependencies

How should dependencies within a collection of services be expressed?

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
