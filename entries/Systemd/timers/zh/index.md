<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/timers/zh -->

定时器是 systemd 中名称以 .timer 结尾的单元文件，用于控制 .service 文件或事件。定时器可以用作 `cron` 的替代方案。定时器内置对基于日历的事件和普通时间事件的支持，并且可以异步运行。 <span id="Configuration"></span>

## 配置

以下示例定时器每 5 分钟运行一次 systemd 单元以调用 bash 脚本。

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
    RemainAfterExit = true; # Prevents the service from automatically starting on rebuild. See https://discourse.nixos.org/t/how-to-prevent-custom-systemd-service-from-restarting-on-nixos-rebuild-switch/43431
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

以下示例每天启动一次（凌晨 12:00）。激活后，例如如果由于系统关闭错过了上次启动时间（同时设置选项 Persistent=true），，则会立即触发服务。

``` nix
...
  timerConfig = {
      OnCalendar = "daily";
      Persistent = true; 
  };
};
```

更多示例可以在 [Arch Wiki](https://wiki.archlinux.org/title/Systemd/Timers) 和 `systemd.timer` 手册页中找到。 <span id="Usage"></span>

## 用法

列出活跃定时器及其当前状态：

``` bash
systemctl list-timers
```

为了测试目的，手动运行一次服务：

``` bash
systemctl start hello-world
```

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
