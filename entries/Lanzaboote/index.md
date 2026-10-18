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

Follow the instructions in the [Quick Start guide](https://nix-community.github.io/lanzaboote/getting-started/prepare-your-system.html).

### Key management

At the time of writing, Lanzaboote offers only local storage of the keyring, otherwise, it is not possible to rebuild the system and sign the new resulting files.

1.  In the future, Lanzaboote will offer two new signature backends: remote signing (an HTTP server which receives signature requests and answers with signatures) and PKCS#11-based signing (that is, bringing an HSM-like device, e.g. YubiKey, NitroKey, etc.).

### Differences with `systemd-stub`

systemd and distribution upstream have an existing solution called `systemd-stub` but this is not a realistic solution for NixOS as there's too many generations on a system.

Using `systemd-stub`, a kernel and an initrd has to be duplicated for **each generation**, using Lanzaboote's stub, a kernel and initrd can be **deduplicated** without compromising on the security.

Tracking the feature parity with `systemd-stub` can be done in this issue:

## Environments

### Virtualbox

In order to setup lanzaboote in virtualbox, there are manual steps required outside of the official guide. An overview of the steps are:

1.  Enabe the Secure Boot feature for the VM's BIOS (this makes it possible to enable or disable Secure Boot when the VM has booted).
2.  Disable Secure Boot in the BIOS
3.  Setup lanzaboote (See "Setup" in previous sections) with automatic enrollment (it will fail but the keys will be in /boot)
4.  Reboot into BIOS
5.  Enable Secure Boot
6.  Manually enroll keys
7.  Reboot into NixOS

Once you're done, you should be able to boot into NixOS and verify that Secure Boot is actually enabled with `bootctl`

It should have the line `Secure Boot: enabled`

#### 1. Enabling Secure Boot feature for VM

In order for the BIOS to even have a Secure Boot option to enable, the feature has to be activated. See the official virtualbox documentation [here](https://www.virtualbox.org/manual/topics/working-with-vms.html#settings-motherboard) ([archive](https://web.archive.org/web/20260922014503/https://www.virtualbox.org/manual/topics/working-with-vms.html#settings-motherboard)) ![Virtual Box VM System Settings with Secure Boot. It should be ticked](Virtualbox_VM_System_Settings.png "Virtual Box VM System Settings with Secure Boot. It should be ticked")

#### 2. Disable Secure Boot in machine BIOS

This should be the default after the feature is enabled, but just to be sure, enter the BIOS and check.

``` xpp
                                                                                
                                                                                
                                                                                
                                                     0 MB RAM                   
                                                                                
                                                                                
                                                                                
   Select Language            <Standard English>         This is the option     
                                                         one adjusts to change  
 ► **Device Manager**                                    the language for the   
 ► Boot Manager                                          current system         
 ► Boot Maintenance Manager                                                     
                                                                                
   Continue                                                                     
   Reset                                                                        
```

Enter **Device Manager**

``` xpp
──────────────────────────────────────────────────────────────────────────────┐
│                               Device Manager                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                                                                
   Devices List                                          Press <Enter> to       
 ► **Secure Boot Configuration**                         select Secure Boot     
 ► Driver Health Manager                                 options.               
 ► RAM Disk Configuration                                                       
 ► OVMF Platform Configuration                                                  
                                                                                
                                                                                
   Press ESC to exit.                                                           
```

Enter **Secure Boot Configuration**

    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                          Secure Boot Configuration                           │
    └──────────────────────────────────────────────────────────────────────────────┘
                                                                                    
                                                             Secure Boot Mode:      
       Current Secure Boot State  Enabled                    Custom Mode or         
       Attempt Secure Boot        [ ]                        Standard Mode          
       Secure Boot Mode           <Standard Mode>                                   
       Reset Secure Boot Keys                                                       

Ensure "Attempt Secure Boot" is unchecked

#### 3. Setup lanzaboot

You can follow the quick start guide for this. This is my config after having run \`sbctl create-keys\` as root.

``` nixos
{
  boot.lanzaboote = {
    enable = true;
    pkiBundle = "/var/lib/sbctl";
  };
  boot.loader = {
    systemd-boot.enable = lib.mkForce false;
    efi = {
      canTouchEfiVariables = true;
      efiSysMountPoint = "/boot/efi";
    };
  };
}
```

#### 4. Reboot into BIOS

After rebooting, select "Reboot Into Firmware Interface" in the systemd boot manager.

#### 5. Enable Secure Boot

Navigate to the Secure Boot section as in Step 2. to set "Attempt Secure Boot \[X\]"

    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                          Secure Boot Configuration                           │
    └──────────────────────────────────────────────────────────────────────────────┘
                                                                                    
                                                             Secure Boot Mode:      
       Current Secure Boot State  Enabled                    Custom Mode or         
       Attempt Secure Boot        [X]                        Standard Mode          
       Secure Boot Mode           <Standard Mode>                                   
       Reset Secure Boot Keys                                                       

#### 6. Manually enroll keys

``` xpp
┌──────────────────────────────────────────────────────────────────────────────┐
│                          Secure Boot Configuration                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                                                                
                                                         Secure Boot Mode:      
   Current Secure Boot State  Disabled                   Custom Mode or         
   Attempt Secure Boot        [ ]                        Standard Mode          
   Secure Boot Mode           <Standard Mode>                                   
   Reset Secure Boot Keys                                                       
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                              ┌──────────────────┐                              
                              │ Standard Mode    │                              
                              │ **Custom Mode**  │                              
                              └──────────────────┘                              
```

Enable the "**Custom Mode**"

    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                          Secure Boot Configuration                           │
    └──────────────────────────────────────────────────────────────────────────────┘
                                                                                    
                                                             Secure Boot Mode:      
       Current Secure Boot State  Disabled                   Custom Mode or         
       Attempt Secure Boot        [ ]                        Standard Mode          
       Secure Boot Mode           <Standard Mode>                                   
     ► Custom Secure Boot Options                                                   
       Reset Secure Boot Keys                                                       

Enter the **Custom Secure Boot Options** \> **DB Options** \> **Enroll Signature** \> **Enroll Signature Using File** You should be greeted with your ESP partition

``` xpp
┌──────────────────────────────────────────────────────────────────────────────┐
│                                File Explorer                                 │└──────────────────────────────────────────────────────────────────────────────┘
                                                                                
 ► ESP,                                                                         
   [PciRoot(0x0)/Pci(0x1,0x1)/Ata(Primary,Master,0x0)/H                         
   D(1,GPT,EC8AAB64-9B56-426C-9148-B88B9CE3CB9B,0x800,0                         
   x200000)]    
```

Navigate into l`oader/keys/auto` and select `db.auth`. After which your signature should be ready for enrollment.

``` xpp
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Enroll Signature                                │
└──────────────────────────────────────────────────────────────────────────────┘
                                                                                
                                                         Enroll Signature       
 ► Enroll Signature Using File                           Using File             
                                                                                
   db.auth                                                                      
                                                                                
   Signature GUID             _                                                 
                                                                                
                                                                                
 ► **Commit Changes and Exit**                                                      
 ► Discard Changes and Exit                                                     
```

Commit your changes and Exit. You can then Hit "Esc" until you reach the Secure Boot Configuration and hit `F10` to save.

#### 7. Reboot into NixOS

If you're still in the BIOS, select **Continue** to then boot into NixOS

``` xpp
                                                                                
                                                                                
                                                                                
                                                     0 MB RAM                   
                                                                                
                                                                                
                                                                                
   Select Language            <Standard English>         This is the option     
                                                         one adjusts to change  
 ► Device Manager                                        the language for the   
 ► Boot Manager                                          current system         
 ► Boot Maintenance Manager                                                     
                                                                                
   **Continue**                                                                     
   Reset                                                                        
```

</translate>

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>
