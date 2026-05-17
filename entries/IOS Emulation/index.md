<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: IOS Emulation -->

Following guide describes how to setup iOS emulation using the project [QEMU-AppleSilicon](https://github.com/ChefKissInc/QEMUAppleSilicon). Currently emulation iPhone 11 with iOS 14.0 beta 5 is supported.

## Setup

Add `qemu-applesilicon` package to your `environment.systemPackages` set and apply it.

``` nix
environment.systemPackages = with pkgs; [
  img4
  qemu-applesilicon
];
```

#### Create disks

Run following command to create required disks

``` bash
qemu-img create -f raw root 16G
qemu-img create -f raw firmware 8M
qemu-img create -f raw syscfg 128K
qemu-img create -f raw ctrl_bits 8K
qemu-img create -f raw nvram  8K
qemu-img create -f raw effaceable 4K
qemu-img create -f raw panic_log 1M
qemu-img create -f raw sep_nvram 2K
qemu-img create -f raw sep_ssc 128K
```

#### Prepare firmware images

Download iOS 14.0 beta 5 ipsw firmware file for `iPhone12,1` and extract required files

``` bash
wget https://updates.cdn-apple.com/2020SummerSeed/fullrestores/001-35886/5FE9BE2E-17F8-41C8-96BB-B76E2B225888/iPhone11,8,iPhone12,1_14.0_18A5351d_Restore.ipsw
mkdir iPhone11_8_iPhone12_1_14.0_18A5351d_Restore
unzip iPhone11,8,iPhone12,1_14.0_18A5351d_Restore.ipsw -d iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/
```

Forge a ticket since the iOS version we're using is not signed

``` bash
wget https://github.com/ChefKissInc/QEMUAppleSiliconTools/raw/refs/heads/master/ticket.shsh2
create_apticket n104ap iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/BuildManifest.plist ticket.shsh2 root_ticket.der
```

For preparing the SEP firmware, run following commands

``` bash
create_septicket n104ap iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/BuildManifest.plist ticket.shsh2 sep_root_ticket.der
img4 -i iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/Firmware/all_flash/sep-firmware.n104.RELEASE.im4p -o sep-firmware.n104.RELEASE -k THE_SEP_FW_IV_AND_THE_SEP_FW_KEY_CONCATENATED
img4 -A -F -o sep-firmware.n104.RELEASE.new.img4 -i sep-firmware.n104.RELEASE -M sep_root_ticket.der -T rsep -V ff86cbb5e06c820266308202621604696d706c31820258ff87a3e8e0730e300c1604747a3073020407d98000ff868bc9da730e300c160461726d73020400d20000ff87a389da7382010e3082010a160474626d730482010039643535663434646630353239653731343134656461653733396135313135323233363864626361653434386632333132313634356261323237326537366136633434643037386439313434626564383530616136353131343863663363356365343365656536653566326364636666336664313532316232623062376464353461303436633165366432643436623534323537666531623633326661653738313933326562383838366339313537623963613863366331653137373730336531373735616663613265313637626365353435626635346366653432356432653134653734336232303661386337373234386661323534663439643532636435ff87a389da7282010e3082010a160474626d720482010064643434643762663039626238333965353763383037303431326562353636343131643837386536383635343337613861303266363464383431346664343764383634336530313335633135396531393062656535643435333133363838653063323535373435333533326563303163363530386265383236333738353065623761333036343162353464313236306663313434306562663862343063306632646262616437343964643461656339376534656238646532346330663265613432346161613438366664663631363961613865616331313865383839383566343138643263366437363364303434363063393531386164353766316235636664
```

You can find the keys by googling "iOS firmware keys".

#### Starting restore

Prepare and run the companion VM, required for the restore process. Create the file `configuration.nix`

``` nix
{ config, pkgs, ... }:

{
  imports = [ <nixpkgs/nixos/modules/virtualisation/qemu-vm.nix> ];

  boot.loader.grub.device = "/dev/vda";
  fileSystems."/" = {
    device = "/dev/vda1";
    fsType = "ext4";
  };

  networking.hostName = "nixos-companionvm";
  services.openssh.enable = true;

  users.users.root.initialPassword = "root";

  environment.systemPackages = [ pkgs.idevicerestore ];

  documentation.enable = false;
}
```

Build the VM image

``` bash
nix-build '<nixpkgs/nixos>' -A config.system.build.qcow2Image -I nixos-config=./configuration.nix
```

Run the companion VM

``` bash
qemu-system-x86_64 -m 2024 -nic user -hda ./result/nixos.qcow2 -nographic -usb -device usb-ehci,id=ehci -device usb-tcp-remote,conn-type=ipv4,conn-addr=127.0.0.1,conn-port=8030,bus=ehci.0 -nic user,model=virtio-net-pci,hostfwd=tcp::32222-:22
```

Some parts in this documentation is missing, so please consult [upstream documentation](https://github.com/ChefKissInc/QEMUAppleSilicon/wiki/Running-&-Restoring).The companion VM must always be started before the emulated iPhone otherwise no USB connection is established.

Now run the iOS emulator on your host

``` bash
qemu-system-aarch64 -M t8030,trustcache=iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/Firmware/038-44135-124.dmg.trustcache,ticket=root_ticket.der,sep-fw=sep-firmware.n104.RELEASE.new.img4,sep-rom=AppleSEPROM-Cebu-B1,kaslr-off=true \
-kernel iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/kernelcache.research.iphone12b -dtb iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/Firmware/all_flash/DeviceTree.n104ap.im4p \
-append "tlto_us=-1 mtxspin=-1 agm-genuine=1 agm-authentic=1 agm-trusted=1 serial=3 launchd_unsecure_cache=1 wdt=-1 -vm_compressor_wk_sw" \
-smp 7 -m 4G -serial mon:stdio \
-drive file=sep_nvram,if=pflash,format=raw \
-drive file=sep_ssc,if=pflash,format=raw \
-drive file=root,format=raw,if=none,id=root -device nvme-ns,drive=root,bus=nvme-bus.0,nsid=1,nstype=1,logical_block_size=4096,physical_block_size=4096 \
-drive file=firmware,format=raw,if=none,id=firmware -device nvme-ns,drive=firmware,bus=nvme-bus.0,nsid=2,nstype=2,logical_block_size=4096,physical_block_size=4096 \
-drive file=syscfg,format=raw,if=none,id=syscfg -device nvme-ns,drive=syscfg,bus=nvme-bus.0,nsid=3,nstype=3,logical_block_size=4096,physical_block_size=4096 \
-drive file=ctrl_bits,format=raw,if=none,id=ctrl_bits -device nvme-ns,drive=ctrl_bits,bus=nvme-bus.0,nsid=4,nstype=4,logical_block_size=4096,physical_block_size=4096 \
-drive file=nvram,if=none,format=raw,id=nvram -device apple-nvram,drive=nvram,bus=nvme-bus.0,nsid=5,nstype=5,id=nvram,logical_block_size=4096,physical_block_size=4096 \
-drive file=effaceable,format=raw,if=none,id=effaceable -device nvme-ns,drive=effaceable,bus=nvme-bus.0,nsid=6,nstype=6,logical_block_size=4096,physical_block_size=4096 \
-drive file=panic_log,format=raw,if=none,id=panic_log -device nvme-ns,drive=panic_log,bus=nvme-bus.0,nsid=7,nstype=8,logical_block_size=4096,physical_block_size=4096 \
-initrd iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/038-44135-124.dmg \
-M t8030,usb-conn-type=ipv4,usb-conn-addr=127.0.0.1,usb-conn-port=8030 \
-display gtk,zoom-to-fit=on,show-cursor=on
```

On the companion VM, start recovery with following command as soon the iOS device is ready to receive images

``` bash
idevicerestore --erase --restore-mode -i 0x1122334455667788 iPhone11,8,iPhone12,1_14.0_18A5351d_Restore.ipsw -T root_ticket.der
```

To complete data migration, the iOS VM must currently be closed after first stage restore is complete, and have filesystem patches applied. You must close it in time to ensure data migration will be able to finish properly with the workarounds applied. You will know that restore has been completed from idevicerestore finishing and the screen of the iOS VM going blank.

#### Patch filesystem

To be done, see [upstream documentation](https://github.com/ChefKissInc/QEMUAppleSilicon/wiki/Filesystem-Patches) on how to continue.

## Usage

To start the iOS emulator, run

``` bash
QEMUAppleSilicon/build/qemu-system-aarch64 -M t8030,trustcache=iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/Firmware/038-44135-124.dmg.trustcache,ticket=root_ticket.der,sep-fw=sep-firmware.n104.RELEASE.new.img4,sep-rom=AppleSEPROM-Cebu-B1,kaslr-off=true \
-kernel iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/kernelcache.research.iphone12b -dtb iPhone11_8_iPhone12_1_14.0_18A5351d_Restore/Firmware/all_flash/DeviceTree.n104ap.im4p \
-append "tlto_us=-1 mtxspin=-1 agm-genuine=1 agm-authentic=1 agm-trusted=1 serial=3 launchd_unsecure_cache=1 wdt=-1 -vm_compressor_wk_sw" \
-smp 7 -m 4G -serial mon:stdio \
-drive file=sep_nvram,if=pflash,format=raw \
-drive file=sep_ssc,if=pflash,format=raw \
-drive file=root,format=raw,if=none,id=root -device nvme-ns,drive=root,bus=nvme-bus.0,nsid=1,nstype=1,logical_block_size=4096,physical_block_size=4096 \
-drive file=firmware,format=raw,if=none,id=firmware -device nvme-ns,drive=firmware,bus=nvme-bus.0,nsid=2,nstype=2,logical_block_size=4096,physical_block_size=4096 \
-drive file=syscfg,format=raw,if=none,id=syscfg -device nvme-ns,drive=syscfg,bus=nvme-bus.0,nsid=3,nstype=3,logical_block_size=4096,physical_block_size=4096 \
-drive file=ctrl_bits,format=raw,if=none,id=ctrl_bits -device nvme-ns,drive=ctrl_bits,bus=nvme-bus.0,nsid=4,nstype=4,logical_block_size=4096,physical_block_size=4096 \
-drive file=nvram,if=none,format=raw,id=nvram -device apple-nvram,drive=nvram,bus=nvme-bus.0,nsid=5,nstype=5,id=nvram,logical_block_size=4096,physical_block_size=4096 \
-drive file=effaceable,format=raw,if=none,id=effaceable -device nvme-ns,drive=effaceable,bus=nvme-bus.0,nsid=6,nstype=6,logical_block_size=4096,physical_block_size=4096 \
-drive file=panic_log,format=raw,if=none,id=panic_log -device nvme-ns,drive=panic_log,bus=nvme-bus.0,nsid=7,nstype=8,logical_block_size=4096,physical_block_size=4096 \
-display gtk,zoom-to-fit=on,show-cursor=on
```

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
