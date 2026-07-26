<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Asus -->

## Laptops

### Model number

Asus laptops will often have a Model Name, and a number of Model Numbers for that name. Most of the hardware will be the same between Model Numbers, but sometimes there are important differences, like the display panel used or presence of a discrete GPU.

It is unconfirmed, but highly likely that this command will give the actual Model Number, mapping to a specific sold model.

``` console
# nix-shell -p dmidecode --run "dmidecode -t 11" | grep 'String 4' | sed -e 's/\s//g' | cut -d':' -f2
```

This command looks at *String 4* under the *OEM Strings* section.

## Subpages
