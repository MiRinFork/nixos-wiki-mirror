<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Comparison of secret managing schemes -->

## Introduction

Some NixOS modules require the use of secret information to function correctly. This information can include user[^1] and Wi-Fi passwords[^2], cryptographic private keys[^3] and secret API tokens[^4], among many other examples of secret information. On a standard Linux system, one would store this kind of information in separate files with restricted access rights (only readable by some Unix user) or encrypt them on-disk.

While this paradigm is still available to NixOS users, a Nix-managed system is in an unique position to leverage <b>secret managing schemes</b>: special software capable of deploying secret information securely. Instead of writing the secret information unencrypted to a NixOS configuration, the software described below can decrypt the relevant secrets and deploy them at various stages of the NixOS system deployment process. This advanced form of secrets configuration is even more important for NixOS configurations tracked with Git or <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>, as one will be able to store these encrypted secrets in the Git repository and still be able to upload the repository on the public Internet.

The most popular options for secrets management are <a href="Agenix" class="wikilink" title="Agenix">Agenix</a>, [sops-nix](https://github.com/Mic92/sops-nix) or the secrets management solution native to the deployment tool you chose. Below follows a more in-depth comparison including less well-known solutions.

## Definitions

The properties of the different schemes that are listed in the table below are explained in detail here.

Scheme  
The name of the scheme; if possible also a link to the official website or source.

Pre-build  
Where does the secret reside before the configuration is built? In a file? In a Nix expression? In an external database? Is it encrypted?

Build time  
What happens at build time? Is the secret decrypted or encrypted? Which primary passwords, passphrases or helper programs are needed?

In the store  
Is the data stored in `/nix/store` after the build? Is it encrypted? This has implications for reproducibility: if a secret is not stored in the Nix store it might be more difficult to recreate an old system configuration.

System activation  
What happens to the data at system activation, that is, at boot time or when `nixos-rebuild switch` or `nixos-rebuild switch --rollback` is executed.

Runtime  
Where does the secret reside after system activation? Is it encrypted? Who can read it?

Encryption technology  
Which programs or tools are used for encryption or decryption of secrets? Is `ssh-agent` or `gpg-agent` supported?

Usable project  
Whether this is a published software project (maybe even actively developed) or just usage notes in a forum or a blog entry.

Templating support  
Whether the project supports configuration templates, a way to seamlessly embed secrets in the syntax of a specific configuration file.

## Comparison

| Scheme | Pre-build | Build time | In the store | System activation | Runtime | Encryption technology | Usable project | Templating support | Additional notes |
|----|----|----|----|----|----|----|----|----|----|
| [`deployment.keys.<name>`](https://nixops.readthedocs.io/en/latest/overview.html#managing-keys) option in <a href="NixOps" class="wikilink" title="NixOps">NixOps</a> | Plaintext value in a Nix expression. | N/A | Not stored in the Nix Store. | N/A[^6] | Unencrypted in `/run/keys` or configured path. | N/A | Yes | No | Secret management happens outside of `nixos-rebuild` |
| <a href="Agenix" class="wikilink" title="Agenix">Agenix</a> | Encrypted raw files, `agenix` CLI encrypts with the user and host ssh key | N/A | Encrypted | Decryption with the host SSH key. | Unencrypted in `/run/secrets` or configured path. | Uses [`age`](https://github.com/FiloSottile/age) with SSH user and host keys; does not support `ssh-agent`. | Yes | No |  |
| [`agenix-rekey`](https://github.com/oddlama/agenix-rekey) | Extended `agenix`. | N/A | Encrypted | Decryption with the host SSH key. | Unencrypted in `/run/secrets` or configured path. | Use with `agenix`; provides more convenience. | Yes | No |  |
| [ragenix](https://github.com/yaxitech/ragenix) | Encrypted raw files, `ragenix` CLI encrypts with the user and host SSH keys. | N/A | Encrypted | Decryption with the host SSH key. | Unencrypted in `/run/secrets` or configured path. | Drop-in replacement of `agenix`, written in Rust and based on the `age` crate. | Yes | No |  |
| [sops-nix](https://github.com/Mic92/sops-nix) | Encrypted file with `age`, PGP or SSH key, support yubikey when gnupg is used, can be stored in a Git repository. | N/A | Encrypted | Decryption with GPG or `age` keys. | Stored in `/run/secrets` with configurable permissions. | Uses [SOPS](https://github.com/getsops/sops). | Yes | Yes | Can be used with <a href="NixOps" class="wikilink" title="NixOps">NixOps</a>, `nixos-rebuild`, [krops](https://github.com/krebs/krops/), [morph](https://github.com/DBCDK/morph), [nixus](https://github.com/Infinisil/nixus) and possibly other deployment tools. |
| [krops](https://github.com/krebs/krops) | Stored in [the password store](https://www.passwordstore.org/). |  |  |  |  | Uses [the password store](https://www.passwordstore.org/) (aka `pass`) which uses GPG. | Yes | No |  |
| [terraform-nixos](https://github.com/tweag/terraform-nixos) | Plaintext value in a Nix expression. |  |  |  | Stored in `/var/keys` owned by the `keys` Unix group. |  | Yes | No | See the [`terraform-nixos`](https://github.com/tweag/terraform-nixos/tree/master/deploy_nixos#inputs) documentation. |
| [secrix](https://github.com/platonic-systems/secrix) | Encrypted raw files, like `agenix`. |  | Encrypted | Decryption with the host SSH key. | Unencrypted in configured path in `/run`. | Uses [`age`](https://github.com/FiloSottile/age) by default with SSH user and host keys; does not support `ssh-agent`. | Yes | No | Focuses on trying to keep secrets decrypted for a minimal amount of time. |
| [vaultix](https://github.com/milieuim/vaultix) | Encrypted raw files like agenix |  | Encrypted | Decryption with the host SSH key. | Unencrypted in specific paths. | Powered by the [`age`](https://docs.rs/age/latest/age/) Rust crate. | Yes | Yes |  |
| [brizzbuzz/opnix](https://github.com/brizzbuzz/opnix) |  |  |  |  |  | 1password |  |  |  |
| [Blog Entry](https://elvishjerricco.github.io/2018/06/24/secure-declarative-key-management.html): wrapper around `pass` based on [`nix-plugins`](https://github.com/shlevy/nix-plugins). | Stored in [the password store](https://www.passwordstore.org/). | Data is retrieved/decrypted with `pass` during evaluation time. | Unencrypted in the store. |  |  | Uses [the password store](https://www.passwordstore.org/) (aka `pass`) which uses GPG. | No | No |  |
| `builtins.readfile`, `builtins.exec`[^7] | `builtins.readfile` can read any file, `builtins.exec` can execute commands and thus query any kind of database or password manager. | These functions return values in a Nix expression; it is up to the user what happens to these values in the NixOS configuration. | See "build time" | See "build time" | See "build time" | These functions just read files or execute commands, they do not provide anything inherently "secure" or "cryptographic". | No | No | The referenced NixOS Discourse discussion is about a signing key that is only needed during build time and should not be stored in the nix store at all. |
| [nixos-artifacts](https://mrvandalo.github.io/nixos-artifacts/nixos-artifacts/latest/) | depends on backend | artifacts cli is needed most of the time, but built-time depends on chosen backends | depends on backend | depends on backend | depends on backend | depends on backend | Yes | No (but planed) | Backend agnostic secret manager. Unified secret definition and backend configuration managed differently from another. |
| Scheme | Pre-build | Build time | In the store | System activation | Runtime | Encryption technology | Usable project | Templating support | Additional notes |

Comparison of secret managing schemes[^5]

## Notes

<references group="note" />

## References

<references />

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>

[^1]: The [`users.users.<name>.hashedPasswordFile`](http://search.nixos.org/options?show=users.users.%253Cname%253E.hashedPasswordFile) option.

[^2]: The option.

[^3]: The option.

[^4]: The option. (among many others)

[^5]: [Comparison of different key/secret managing schemes](https://discourse.nixos.org/t/comparison-of-different-key-secret-managing-schemes/12001/1) on the NixOS Discourse

[^6]: The user has to run `nixops send-keys` to create these files after a (manual) reboot. (not required after every reboot if `destDir` is in persistent storage)

[^7]: [Using an external secret file in a Nix sandboxed build](https://discourse.nixos.org/t/using-an-external-secret-file-in-a-nix-sandboxed-build/3274) on the NixOS Discourse
