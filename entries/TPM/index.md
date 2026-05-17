<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: TPM -->

TPM (Trusted Platform Module) is a secure microprocessor commonly embedded in modern computers. It can be used for boot chain audit, key storage and random number generation.

## NixOS configuration

A minimal NixOS configuration to be able to use the TPM from userspace can be:

``` nix
security.tpm2.enable = true;
security.tpm2.pkcs11.enable = true;  # expose /run/current-system/sw/lib/libtpm2_pkcs11.so
security.tpm2.tctiEnvironment.enable = true;  # TPM2TOOLS_TCTI and TPM2_PKCS11_TCTI env variables
users.users.YOUR_USER.extraGroups = [ "tss" ];  # tss group has access to TPM devices
```

After rebooting with this configuration, `TPM2TOOLS_TCTI` and `TPM2_PKCS11_TCTI` should point to `device:/dev/tpmrm0` and your user should be able to read and write to `/dev/tpmrm0`.

## Using a TPM2 with OpenSSH

For example, the following commands create a new token associated with PIN-code `YOUR_PIN` (Personal Identification Number) and a recovery SOPIN-code `YOUR_SOPIN` (Security Officer Personal Identification Number) and then a new secp256r1 key:

``` bash
tpm2_ptool init
tpm2_ptool addtoken --pid=1 --label=ssh --userpin=YOUR_PIN --sopin=YOUR_SOPIN
tpm2_ptool addkey --label=ssh --userpin=YOUR_PIN --algorithm=ecc256
```

Now you may show your public key:

``` bash
ssh-keygen -D /run/current-system/sw/lib/libtpm2_pkcs11.so
```

To tell OpenSSH to use the TPM2 during login, you may add the following line to your `~/.ssh/config`:

    PKCS11Provider /run/current-system/sw/lib/libtpm2_pkcs11.so

To load your ssh key into the running `ssh-agent`, use `ssh-add -s`:

``` bash
ssh-add -s /run/current-system/sw/lib/libtpm2_pkcs11.so
```

Note that by default, `ssh-agent` refuses to load PKCS#11 modules outside a whitelist of trusted paths, and `/nix/store` paths are not included in this default list. You may need to start the agent with the `-P` flag to allow the library paths:

``` bash
ssh-agent -P "/run/current-system/sw/lib/*,/nix/store/*/lib/*"
```

For a persistent setup, you can configure the system-wide agent in your `configuration.nix`:

``` nixos
programs.ssh = {
  startAgent = true;
  agentPKCS11Whitelist = "${config.security.tpm2.pkcs11.package}/lib/*,/run/current-system/sw/lib/*";
};
```

## Frequently Asked Questions

### How does the PIN-code bruteforce protection work?

You may run the following command to query the variable properties of your TPM:

``` bash
nix-shell -p tpm2-tools --run "tpm2_getcap properties-variable"
```

- `TPM2_PT_LOCKOUT_COUNTER` is the current number of failed attempts,
- `TPM2_PT_MAX_AUTH_FAIL` is the maximum number of failed attempts before lockdown,
- `TPM2_PT_LOCKOUT_INTERVAL` and `TPM2_PT_LOCKOUT_RECOVERY` are durations in seconds for recovery.

### How to get TPM model information?

The following command will dump found strings from the raw TPM2 certificates:

``` bash
nix-shell -p tpm2-tools --run "tpm2_getekcertificate" | strings
```

Usually, you may find a vendor such as `STMicroelectronics` or `Infineon Technologies` and a model such as `ST33HTPxAHB61`.

To get firmware version information, you might want to look at:

``` bash
nix-shell -p tpm2-tools --run "tpm2_getcap properties-fixed"
```

## References

- <https://wiki.archlinux.org/title/Trusted_Platform_Module>
- <https://learn.microsoft.com/en-us/windows/security/information-protection/tpm/change-the-tpm-owner-password>
- <https://blog.ledger.com/ssh-with-tpm/>
