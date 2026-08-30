<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenID Connect (OIDC) -->

[OpenID Connect](https://openid.net/) (OIDC) is a standard for authentication and authorization built on top of [OAuth](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1).

It allows for <a href="wikipedia:Single_sign-on" class="wikilink" title="Single Sign On">Single Sign On</a> (SSO) and it consolidate users in a single place, similar to LDAP. Unlike LDAP, you can have SSO, Multi-Factor Authentication, Passkeys, and more.

Nowadays, it's the industry standard.

[Review the specification](https://openid.net/specs/openid-connect-core-1_0-final.html)

OIDC can be divided in 2 parts

1.  **Identity Providers (IdP)**: Servers that hold the users. For example: Google or Github are IdPs, which you can use to log-in into an app. At the same time, you can run your own IdP, and connect your applications to it.
2.  **OIDC Client**: Services that speak the protocol, and once configured, they can connect to an IdP.

#### Identity Providers

This is a list of some of the open source IdP available in nixos. If listed, then it's available, at least, as a package.

| Name | nixos module | Language | Wiki | TOTP | Passkeys | LDAP | PAM |
|----|----|----|----|----|----|----|----|
| [Zitadel](https://zitadel.com/) | `services.zitadel` | Go | <a href="Zitadel" class="wikilink" title="Zitadel">Zitadel</a> | ✅ | ✅ | ✅ | ❌ |
| [Kanidm](https://kanidm.com/) | `services.kanidm` | Rust |  | ✅ | ✅ | ✅ | ✅ |
| [Dex](https://dexidp.io/) | `services.dex` | Go |  | ❌\* | ❌\* | ✅ | ❌ |
| [Tinyauth](https://tinyauth.app/) | `services.tinyauth` | Go |  | ✅ | ❌ | ❌ | ❌ |
| [Rauthy](https://sebadob.github.io/rauthy/) |  | Rust |  | ❌ | ✅ | ❌ | ✅ |
| [Authentik](https://goauthentik.io/) | [nix-community/authentik-nix](https://github.com/nix-community/authentik-nix) | Go |  | ✅ | ✅ | ✅ | ✅ |

TODO: Complete unknowns❓

\\ Dex is more like an OIDC proxy, it can support if you configure other provider, but the built in doesn't seem to support
