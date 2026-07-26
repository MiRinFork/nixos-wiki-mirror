<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cron -->

# Cron

## Deprecated

It is recommended to use <a href="Systemd/Timers" class="wikilink" title="systemd-timers">systemd-timers</a>. A few of many reasons:

- logs are logged to journalctl instead of relying on local mail
- different timers are independent of each other and do not share an environment
- better configurability like random offsets, run missed timers when machine was powered down and full systemd service option

## General

Cron is a very useful tool to run stuff at predefined times. Users, if allowed, can setup their own cron job, while the system crontab can be easily setup from the `configuration.nix`

``` nix
# Enable cron service
services.cron = {
  enable = true;
  systemCronJobs = [
    "*/5 * * * *      root    date >> /tmp/cron.log"
  ];
};
```

The above example would run the command `date >> /tmp/cron.log` as `root` user every `5 minutes` (indicated by `*/5*`. For more information regarding the cronjob entries, see the link below.

## Loading environment

However, sometimes cron won't run because it's missing the according environment (as it is the case for rss2email as example). In that case you just have to source the profile file first before running the desired command, like in the example below:

``` nix
"*/10 * * * *   johndoe   . /etc/profile; ${pkgs.rss2email}/bin/r2e run"
```

The `. /etc/profile;` part first sources the profile file and hence loading the environment. After that, the actual command is being run in the proper environment. The above entry would run the rss2email program every `10 minutes` as user `johndoe`

## Send mail only when error

In case you have set proper sendmail and defined a user where cron should send output to, you might want limit those emails only when cron encounters a problem. This can easily be achieved by storing the output of the command given into a variable and use the `||` control operator to echo this output only when there is a non-zero exit status of the command.

``` nix
"0 * * * *      johndoe   out=$( ${pkgs.pass}/bin/pass git pull 2>&1 ) || echo $out"
```

# See also

- [crontab(5): tables for driving cron](https://linux.die.net/man/5/crontab)

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
