<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Lanzaboote -->

<translate>

The Lanzaboote project allows <a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a> to be enabled on NixOS with relative ease.

It has two main components: `lzbt` and `stub`.

`lzbt` is the command line that signs and installs the boot files on the ESP.

`stub` is a UEFI application that loads the kernel and initrd from the ESP, it's different from systemd-stub, see <a href="Lanzaboote#Differences_with_`systemd-stub`" class="wikilink" title="below">below</a> to see precise differences.

### Requirements

The Secure Boot implementation of Lanzaboote requires a system installed in UEFI mode together with systemd-boot enabled. This can be checked by running `bootctl status`:

``` console
$ bootctl status
System:
     Firmware: UEFI 2.70 (Lenovo 0.4720)
  Secure Boot: disabled (disabled)
 TPM2 Support: yes
 Boot into FW: supported

Current Boot Loader:
      Product: systemd-boot 251.7
...
```

### Setup

Follow the instructions in the [Quick Start guide](https://github.com/nix-community/lanzaboote/blob/master/docs/getting-started/prepare-your-system.md).

### Key management

At the time of writing, Lanzaboote offers only local storage of the keyring, otherwise, it is not possible to rebuild the system and sign the new resulting files.

In the future, Lanzaboote will offer two new signature backends: remote signing (an HTTP server which receives signature requests and answers with signatures) and PKCS#11-based signing (that is, bringing an HSM-like device, e.g. YubiKey, NitroKey, etc.).

### Differences with \`systemd-stub\`

systemd and distribution upstream have an existing solution called \`systemd-stub\` but this is not a realistic solution for NixOS as there's too many generations on a system.

Using \`systemd-stub\`, a kernel and an initrd has to be duplicated for **each generation**, using Lanzaboote's stub, a kernel and initrd can be **deduplicated** without compromising on the security.

Tracking the feature parity with \`systemd-stub\` can be done in this issue: <https://github.com/nix-community/lanzaboote/issues/94>. </translate>

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>
