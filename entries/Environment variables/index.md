<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Environment variables -->

## Configuration of shell environment on NixOS

Environment variables can be set with [environment.variables](https://search.nixos.org/options?channel=unstable&show=environment.variables&from=0&size=50&sort=relevance&type=packages&query=environment.variables), [environment.sessionVariables](https://search.nixos.org/options?channel=unstable&show=environment.sessionVariables&from=0&size=50&sort=relevance&type=packages&query=environment.sessionVariables), and [environment.profileRelativeSessionVariables](https://search.nixos.org/options?channel=unstable&show=environment.profileRelativeSessionVariables&from=0&size=50&sort=relevance&type=packages&query=environment.profileRelativeSessionVariables) . `environment.variables` are global variables set on shell initialization, whereas `environment.sessionVariables` and `environment.profileRelativeSessionVariables` are initialized through PAM (Pluggable Authentication Module).

Session variable sets are merged into their environment variable set counterparts. For example, `environment.sessionVariables` is merged to `environment.variables` so you can just reload your shell to reload changed variables [1](https://github.com/NixOS/nixpkgs/blob/5e4fbfb6b3de1aa2872b76d49fafc942626e2add/nixos/modules/config/shells-environment.nix#L166-L170).

For example, for the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html#variables), the following could be set to `/etc/nixos/configuration.nix`:

``` nix
{
  # ...
  
  # This is using a rec (recursive) expression to set and access XDG_BIN_HOME within the expression
  # For more on rec expressions see https://nix.dev/tutorials/first-steps/nix-language#recursive-attribute-set-rec
  environment.sessionVariables = rec {
    XDG_CACHE_HOME  = "$HOME/.cache";
    XDG_CONFIG_HOME = "$HOME/.config";
    XDG_DATA_HOME   = "$HOME/.local/share";
    XDG_STATE_HOME  = "$HOME/.local/state";

    # Not officially in the specification
    XDG_BIN_HOME    = "$HOME/.local/bin";
    PATH = [ 
      "${XDG_BIN_HOME}"
    ];
  };

 # ...
}
```

## Troubleshooting

### pam_env(sudo:session): Expandable variables must be wrapped in {} \<\$VARIABLE/path/to\>

Error logs may be found with `journalctl -xb -p3` regarding the no presence of curly braces `{}` for variable expansion.

``` shell
sudo[3424]: pam_env(sudo:session): Expandable variables must be wrapped in {} <$VARIABLE/path/to> - ignoring
```

While checking the configuration values, for instance with `nixos-option environment.sessionVariables`, it might be found that Nix is correctly parsing the curly braces.

``` nix
Value:
{
  ...
  VARIABLE = "${VARIABLE}/path/to";
  ...
}
```

This indicates that the curly braces are getting removed at a later stage.

#### Solution or workaround

Using Nix string literals can fix the problem by keeping the curly brackets after the nix evaluation.

``` nix
Value:
{
  ...
  VARIABLE = ''''${VARIABLE}/path/to'';
  ...
}
```

This will result in VARIABLE having the value `${VARIABLE}/path/to`

For example:

``` nix
{
  environment.sessionVariables = rec {
    XDG_CACHE_HOME  = ''''${HOME}/.cache'';
    # ...
  };
 # ...
}
```

## Using variables from a Nix expression

The `builtins.getEnv` function allows for reading the environment of the Nix command which triggered the expression to be evaluated, typically `nix-build`.

## Variables exposed in nix-build sandbox

Compared to a normal shell environment, in a nix-build sandbox, Nix will set some environment variables, for example:

    NIX_BINTOOLS=/nix/store/lvg99f3zni6zw4cvlci6wpmzlls0nsn4-binutils-wrapper-2.38
    NIX_BINTOOLS_WRAPPER_TARGET_HOST_x86_64_unknown_linux_gnu=1
    NIX_BUILD_CORES=3
    NIX_BUILD_TOP=/build
    NIX_CC=/nix/store/61zfi5pmhb0d91422f186x26v7b52y5k-gcc-wrapper-11.3.0
    NIX_CC_WRAPPER_TARGET_HOST_x86_64_unknown_linux_gnu=1
    NIX_CFLAGS_COMPILE= -frandom-seed=8cnrgjjflj
    NIX_ENFORCE_NO_NATIVE=1
    NIX_ENFORCE_PURITY=1
    NIX_HARDENING_ENABLE=fortify stackprotector pic strictoverflow format relro bindnow
    NIX_INDENT_MAKE=1
    NIX_LDFLAGS=-rpath /nix/store/8cnrgjjflj3dyppz299w50l9yydgnqkp-x/lib64 -rpath /nix/store/8cnrgjjflj3dyppz299w50l9yydgnqkp-x/lib 
    NIX_LOG_FD=2
    NIX_SSL_CERT_FILE=/no-cert-file.crt
    NIX_STORE=/nix/store

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
