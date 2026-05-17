<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/timers -->

<translate> Timers are systemd unit files whose name ends in .timer that control .service files or events. Timers can be used as an alternative to `cron`. Timers have built-in support for calendar-based events and monotonic time events, and can be run asynchronously. </translate> <translate>

## Configuration

</translate> <translate> The following example timer runs a systemd unit every 5 minutes which invokes a bash script. </translate>

``` nix
systemd.timers."hello-world" = {
  wantedBy = [ "timers.target" ];
    timerConfig = {
      OnBootSec = "5m";
      OnUnitActiveSec = "5m";
      # Alternatively, if you prefer to specify an exact timestamp
      # like one does in cron, you can use the `OnCalendar` option
      # to specify a calendar event expression.
      # Run every Monday at 10:00 AM in the Asia/Kolkata timezone.
      #OnCalendar = "Mon *-*-* 10:00:00 Asia/Kolkata";
      Unit = "hello-world.service";
    };
};

systemd.services."hello-world" = {
  script = ''
    set -eu
    ${pkgs.coreutils}/bin/echo "Hello World"
  '';
  serviceConfig = {
    Type = "oneshot";
    User = "root";
  };
};
```

Alternatively here, avoid quotes when calling for the binary and its command options:

``` nix
${pkgs.foo}/bin/foo command-options 
```

This will yield the same result as running

``` bash
foo command-options
```

in your terminal.

#### Verifying your timestamp for systemd.time

If you do not understand the format that [systemd.time](https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html) expects, you can use the `systemd-analyze`'s `calendar` sub-command to understand the next *N* times when the timer will get triggered. Following is an example:

``` shell-session
$ systemd-analyze calendar --iterations=5 "10:00:00"
  Original form: 10:00:00
Normalized form: *-*-* 10:00:00
    Next elapse: Sat 2024-12-07 10:00:00 IST
       (in UTC): Sat 2024-12-07 04:30:00 UTC
       From now: 33min left
   Iteration #2: Sun 2024-12-08 10:00:00 IST
       (in UTC): Sun 2024-12-08 04:30:00 UTC
       From now: 24h left
   Iteration #3: Mon 2024-12-09 10:00:00 IST
       (in UTC): Mon 2024-12-09 04:30:00 UTC
       From now: 2 days left
   Iteration #4: Tue 2024-12-10 10:00:00 IST
       (in UTC): Tue 2024-12-10 04:30:00 UTC
       From now: 3 days left
   Iteration #5: Wed 2024-12-11 10:00:00 IST
       (in UTC): Wed 2024-12-11 04:30:00 UTC
       From now: 4 days left
```

#### Using the `systemd.services.<name>.startAt` shorthand

If you only want a service to execute at an interval and don't plan to configure the timer much more, you can use the `systemd.services.<name>.startAt` option. This will have the underlying systemd module in nixpkgs create the timer for you, and set its `OnCalendar` field. Note that the semantics for `OnCalendar` are different to `OnUnitActiveSec`.

This example shows the previous `hello-world` service configured with `startAt`, running every 5 minutes.

``` nix
systemd.services."hello-world" = {
  script = ''
    set -eu
    ${pkgs.coreutils}/bin/echo "Hello World"
  '';
  serviceConfig = {
    Type = "oneshot";
    User = "root";
  };
  startAt = "*:0/5";
};
```

#### Running timer on a schedule

<translate> The following example starts once a day (at 12:00am). When activated, it triggers the service immediately if it missed the last start time (option Persistent=true), for example due to the system being powered off. </translate>

``` nix
...
  timerConfig = {
      OnCalendar = "daily";
      Persistent = true; 
  };
};
```

<translate> More examples can be found at the [Arch Wiki](https://wiki.archlinux.org/title/Systemd/Timers) and at the `systemd.timer` manpage. </translate> <translate>

## Usage

</translate> <translate> List active timers and their current state: </translate>

``` bash
systemctl list-timers
```

<translate> Manually run a service once for testing purposes: </translate>

``` bash
systemctl start hello-world
```

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
