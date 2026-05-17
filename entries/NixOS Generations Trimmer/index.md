<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Generations Trimmer -->

## Overview

The normal options available in NixOS to cleanup old <a href="Generation" class="wikilink" title="generations">generations</a> might be too limiting. The script below is interactive and smart.

By default (run with no arguments), the script keeps the last 7 days of generations and will prompt you to remove older generations if they are more than 10 generations behind the current one. So it always keeps at least 10 generations and always preserves generations from the last week.

You can specify the number of *days* to always keep generations, and you can specify the number of *generations* to always keep.

By default, it works on the *default* profile for the user running it.

Other profile options:

- If you are root, you can run on the `system` profile
- If you are a normal user, you can run on either the `home-manager` or `channels` profiles too.

## Script (trim-generations.sh)

The script is available here: [Github Gist - NixOS: trim-generations.sh](https://gist.github.com/MaxwellDupre/3077cd229490cf93ecab08ef2a79c852)

## Example script output

### Without parameters (defaults)

``` bash
❯ ./trim-generations.sh    

The current defaults are:
 Keep-Gens=30 Keep-Days=30 

Keep these defaults? (y/n):y
Using defaults..
Keeping default: 30 generations OR 30 days, whichever is more
Operating on profile:    /nix/var/nix/profiles/per-user/dougal/profile

oldest generation:             75
oldest generation created:     2023-08-05
minutes before now:            46740
hours before now:              779
days before now:               32

current generation:            217
current generation created:    2023-09-06
minutes before now:            660
hours before now:              11
days before now:               0

        Something to do...

Found the following generation(s) to delete:
generation 75    2023-08-05, 32 day(s) old
generation 76    2023-08-05, 32 day(s) old
generation 77    2023-08-05, 32 day(s) old
generation 78    2023-08-05, 32 day(s) old
generation 79    2023-08-05, 32 day(s) old
generation 80    2023-08-05, 32 day(s) old
generation 81    2023-08-05, 32 day(s) old
generation 82    2023-08-05, 32 day(s) old
generation 83    2023-08-05, 32 day(s) old
generation 84    2023-08-05, 32 day(s) old
generation 85    2023-08-05, 32 day(s) old
generation 86    2023-08-05, 32 day(s) old

Do you want to delete these? [Y/n]: 
```

### With parameters

``` bash
❯ ./trim-generations.sh 3 0 home-manager
OK!      Keep Gens = 3   Keep Days = 0

Operating on profile:    /nix/var/nix/profiles/per-user/user/home-manager

oldest generation:             58
oldest generation created:     2021-09-24
minutes before now:            3922
hours before now:              65
days before now:               2

current generation:            65
current generation created:    2021-09-25

    Something to do...

Found the following generation(s) to delete:
generation 58    2021-09-24, 2 day(s) old
generation 59    2021-09-25, 1 day(s) old
generation 60    2021-09-25, 1 day(s) old
generation 61    2021-09-25, 1 day(s) old
generation 62    2021-09-25, 1 day(s) old

Do you want to delete these? [Y/n]: 
```

### With parameters (not enough though)

Example if you accidentally don't specify all parameters / arguments.

``` bash
❯ sudo ./trim-generations.sh 2 0

Error: Not enough arguments.

Usage:
         ./trim-generations.sh <keep-gernerations> <keep-days> <profile> 


(defaults are: Keep-Gens=30 Keep-Days=30 Profile=user)

If you enter any parameters, you must enter all three, or none to use defaults.
Example:
         trim-generations.sh 15 10 home-manager
  this will work on the home-manager profile and keep all generations from the
last 10 days, and keep at least 15 generations no matter how old.

Profiles available are: user, home-manager, channels, system (root)

-h or --help prints this help text.
```

### Run as root (default)

``` bash
❯ sudo ./trim-generations.sh                 
The current defaults are:
 Keep-Gens=30 Keep-Days=30 

Keep these defaults? (y/n):y
Using defaults..
Keeping default: 30 generations OR 30 days, whichever is more
Operating on profile:    /nix/var/nix/profiles/system

oldest generation:             65
oldest generation created:     2023-08-05
minutes before now:            46727
hours before now:              778
days before now:               32

current generation:            102
current generation created:    2023-09-04
minutes before now:            3527
hours before now:              58
days before now:               2

All generations are no more than 30 days older than current generation. 
Oldest gen days difference from current gen: 30 

        Nothing to do!
```

### Run as root (on system profile)

``` bash
❯ sudo ./trim-generations.sh 2 0 system
OK!      Keep Gens = 2   Keep Days = 0

Operating on profile:    /nix/var/nix/profiles/system

oldest generation:             11
oldest generation created:     2021-09-22
minutes before now:            6807
hours before now:              113
days before now:               4

current generation:            12
current generation created:    2021-09-26

Oldest generation (11) is only 1 generations behind current (12).    Nothing to do!
```

### Run as root (wrong profile)

Example if you accidentally give wrong profile (no home-manager on root):

``` bash
❯ sudo ./trim-generations.sh 3 0 home-manager

Error: Do not understand your third argument. Should be one of: (user / system)

Usage:
         ./trim-generations.sh <keep-gernerations> <keep-days> <profile> 


(defaults are: Keep-Gens=30 Keep-Days=30 Profile=user)

If you enter any parameters, you must enter all three, or none to use defaults.
Example:
         trim-generations.sh 15 10 home-manager
  this will work on the home-manager profile and keep all generations from the
last 10 days, and keep at least 15 generations no matter how old.

Profiles available are: user, home-manager, channels, system (root)

-h or --help prints this help text.
```

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a>
