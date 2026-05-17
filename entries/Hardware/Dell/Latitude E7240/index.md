<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Dell/Latitude E7240 -->

## Booting

If the <a href="NixOS_Installation_Guide#UEFI" class="wikilink" title="UEFI partitioning scheme">UEFI partitioning scheme</a> is used when installing NixOS, the device might throw an `invalid partition table` error when powered on.

To resolve this issue, enter the UEFI settings menu by holding <kbd>F2</kbd>, navigate to the `General > Boot Sequence` section, then change the `Boot List Option` setting from `Legacy` to `UEFI`.

## Fingerprint reader

The device has a built-in fingerprint reader, the BCM5880 Secure Applications Processor with fingerprint swipe sensor.[^1]

Broadcom has not provided Linux drivers for the fingerprint reader as of this writing (2024 July 31).[^2][^3][^4][^5][^6]

## Firmware updates

The device supports firmware updates through <a href="fwupd" class="wikilink" title="fwupd">fwupd</a>.

## S.M.A.R.T. monitoring

The device supports <a href="wikipedia:Self-Monitoring,_Analysis_and_Reporting_Technology" class="wikilink" title="S.M.A.R.T.">S.M.A.R.T.</a> monitoring, but it must be turned on in the <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> settings.

## Smartcard reader

The device has a built-in smartcard reader through BCM5880 Secure Applications Processor with fingerprint swipe sensor.[^7]

The <a href="CCID" class="wikilink" title="CCID">CCID</a> package does not support this reader.[^8]

## External links

- [Dell page for the laptop](https://www.dell.com/support/home/en-us/product-support/product/latitude-e7240-ultrabook/drivers)

## References

<references />

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: \[<https://linux-hardware.org/?id=usb:0a5c-5801>

[^2]: <https://bugs.launchpad.net/ubuntu/+source/libfprint/+bug/602071?comments=all>

[^3]: <https://askubuntu.com/questions/879175/broadcom-bcm5880-ubuntu-compatibility>

[^4]: <https://ubuntuforums.org/showthread.php?t=2274752>

[^5]: <https://forum.level1techs.com/t/looking-for-help-with-linux-and-the-broadcom-bcm5880/111880>

[^6]: <https://www.dell.com/community/en/conversations/latitude/fingerprint-driver-for-gnulinux/647f882ff4ccf8a8de7888c6>

[^7]:

[^8]: <https://ccid.apdu.fr/ccid/section.html#696>
