<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ALSA -->

ALSA is the kernel-level sound API for Linux. On modern systems, it is usually used via a sound server like <a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a>.

## Save volume state on shutdown

In order to save the sound card state on shutdown sound must be enabled in `configuration.nix`

``` nix
hardware.alsa.enablePersistence = true;
```

## Troubleshooting ALSA

- on a console launch <a href="wikipedia:Alsamixer" class="wikilink" title="alsamixer">alsamixer</a>.

` alsamixer`

- If you see plenty of vertical bars:
  - You should be okay

<!-- -->

- If you see very few vertical bars and the sound card (top-left) is "PC Speaker" or similar:
  - Hit the 'S' key, you should be able to switch to the "real" audio card (if not your audio card is likely to not being supported yet).
  - When the real audio card is selected you should be viewing the "plenty vertical bars" thing.
    - First thing to do is to disable PC speaker (kernel module "snd-pcsp", see below.

### Make your audio card the default ALSA card

Occasionally the PC-speaker is the default audio card for ALSA. You can make your real sound card default instead. For example, if your sound card is "hda-intel" then you would add the following to your configuration.

``` nix
boot.extraModprobeConfig = ''
  options snd slots=snd-hda-intel
'';
```

At times, you may wish to disable one of multiple Intel cards. Here is how to disable the first card, but enable a second one.

``` nix
boot.extraModprobeConfig = ''
  options snd_hda_intel enable=0,1
'';
```

### Disable PC Speaker "audio card"

Add "snd_pcsp" to the `boot.blacklistedKernelModules` option:

``` nix
boot.blacklistedKernelModules = [ "snd_pcsp" ];
```

Now reboot and retry from the beginning (i.e. check that your real card is shown by alsamixer without using the 'S' key).

### Other hardware specific problems

Some hardware specific problems can be resolved by adjusting the options for the sound module. For example, the microphone may be stuck on a very low volume. First you should be sure that you have already checked the settings in alsamixer to make sure nothing is muted, and also any physical buttons on your computer.

You should be able to look up the available options for model in [models.rst](https://www.kernel.org/doc/Documentation/sound/hd-audio/models.rst). You can try them out interactively as follows:

1.  Close any applications using the sound card
    1.  See if any applications are using the sound card
          
    2.  Kill any processes
          
        for any process apart from pulseaudio you could just do:

        \$ kill -9 14080

        but in the case of pulseaudio you have to prevent it from respawning itself automatically

        \$ systemctl --user mask pulseaudio.socket && systemctl --user stop pulseaudio

        you can then stop pulseaudio with:

        \$ pulseaudio -k \# or kill it by process id
2.  Unload the snd-hda-intel module
      
    rmmod snd-hda-intel
3.  Find your model
      
    grep Codec /proc/asound/card0/codec\*
4.  [Look up the model options for your card](https://www.kernel.org/doc/Documentation/sound/hd-audio/models.rst)
5.  Try each one
      
    modprobe snd-hda-intel model=3stack-6ch
6.  Test if this has fixed your problem (tip: aplay and arecord are alsa based command line tools you can use to quickly check)
7.  Repeat until you have exhausted all the options or have fixed your problem
8.  TIDY UP!
      
    Don't forget to re-enable pulse autospawning: systemctl --user unmask pulseaudio.socket

Once you have found a setting that works, you can add it to your configuration file:

``` nix
boot.extraModprobeConfig = ''
  options snd-hda-intel model=YOUR_MODEL 
'';
```

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a>
