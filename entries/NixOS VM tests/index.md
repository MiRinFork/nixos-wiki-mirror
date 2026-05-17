<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS VM tests -->

WARNING: this page is mostly outdated as <https://nixos.org/manual/nixos/stable/#chap-developing-the-test-driver> mentions that `pkgs.nixosTest`, `testing-python.nix` and `make-test-python.nix` are outdated. Beside the documentation, you may also like <https://nix.dev/tutorials/nixos/integration-testing-using-virtual-machines.html>

The primary documentation for the [NixOS VM testing framework](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests) is in [the NixOS manual](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests), and in [the Nixpkgs manual](https://nixos.org/manual/nixpkgs/unstable/#tester-runNixOSTest). A tutorial can be found at [1](https://nix.dev/tutorials/nixos/integration-testing-using-virtual-machines).

The test infrastructure entry point is nixos/lib/testing.nix. Alternatively, for out-of-tree tests you can invoke it via Nixpkgs as the nixosTest function, which reuses your already evaluated Nixpkgs to generate your node configurations. The test infra relies on the qemu build-vm code to generate virtual machines.

It will generate a test driver (a wrapper of nixos/lib/test-driver/test-driver.py) in charge of creating the network. It will start one vde-switch and its associated socket per vlan (defined in virtualisation.vlans). IPs are assigned declaratively according to the number of vlan via the function \`assignIPAddresses\`.

The driver (of the form /nix/store/668bqxvsv6rn9hy8n4nmaps9ma2i5k4r-nixos-test-driver-<TESTNAME>) will launch the different vms passed as arguments. The wrapper \`bin/nixos-run-vms\` is in charge to start the driver with the correct VM script as arguments.

Once the driver is loaded, depending on the environment variables \`tests\` it will run in an interactive mode or run some python code (\`test_script()\`). In interactive mode, you can run \`start_all()\` to start and keep the VM alive

## Connecting to an interactive VM via SSH

Add this to your test config:

`interactive.sshBackdoor.enable = true;`

Now you can connect to this VM via (on linux):

`ssh -o User=root vsock/3`

If you are on MacOS or have multiple VMs look at the shell output that do run the interactive tests: <img src="Screenshot_of_interactive_test_just_started.png" title="Screenshot of just started nixos test for meilisearch (interactive)" width="444" height="444" alt="Screenshot of just started nixos test for meilisearch (interactive)" />

## How to debug tests ?

You can run the tests interactively as described in [2](https://nixos.org/manual/nixos/stable/index.html#sec-running-nixos-tests-interactively). When you run \`nix-build ./nixos/tests/login.nix\`, the resulting output gives you a summary of the results, but to gain access to the VM, you can run

`nix repl ./nixos/tests/login.nix`

and see the ran VM via \`driver.outPath\`.

## I don't see any prompt ? (qemu window pitch black)

Check the output for

`` malformed JSON string, neither array, object, number, string or atom, at character offset 0 (before "\x{0}\x{0}\x{0}\x{0}...") at /nix/store/1hkp2n6hz3ybf2rvkjkwrzgbjkrrakzl-update-users-groups.pl line 11` ``

You should purge the state present in rm -rf /tmp/vm-state-<VM_NAME>

## Setting \`virtualisation.vlans\` does not create the expected interfaces

There are two sides to the problem: 1. By default the qemu-vm setups a \`user\` based nic: virtualisation.qemu.networkingOptions. You need to override the option to get rid of this interface. 2. As of this writing nixpkgs will generate interfaces starting from \`eth1\` (instead of \`eth0\`).

Keys: <https://en.wikibooks.org/wiki/QEMU/Monitor#sendkey_keys>

## home-manager example

It is possible to use home-manager to manage packages per user. This example shows how to add home-manager to a single file configuration.

The complete \`hmtest.nix\` file content looks like the following:

` let`  
`   nixpkgs = builtins.fetchTarball "`[`https://github.com/nixOS/nixpkgs/archive/22.05.tar.gz`](https://github.com/nixOS/nixpkgs/archive/22.05.tar.gz)`";`  
`   pkgs = import nixpkgs {};`  
`   home-manager = builtins.fetchTarball "`[`https://github.com/nix-community/home-manager/archive/release-22.05.tar.gz`](https://github.com/nix-community/home-manager/archive/release-22.05.tar.gz)`";`  
` in`  
`   pkgs.nixosTest {`  
`     nodes.machine = { config, pkgs, ... }: {`  
`       imports = [`  
`         (import "${home-manager}/nixos")`  
`       ];`  
` `  
`       boot.loader.systemd-boot.enable = true;`  
`       boot.loader.efi.canTouchEfiVariables = true;`  
` `  
`       services.xserver.enable = true;`  
`       services.xserver.displayManager.gdm.enable = true;`  
`       services.xserver.desktopManager.gnome.enable = true;`  
` `  
`       users.users.alice = {`  
`         isNormalUser = true;`  
`         extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.`  
`       };`  
` `  
`       home-manager.users.alice = {`  
`         home.packages = [`  
`           pkgs.firefox`  
`           pkgs.thunderbird`  
`         ];`  
`       };`  
` `  
`       system.stateVersion = "22.05";`  
`     };`  
`     testScript = {nodes, ...}: ''`  
`       machine.wait_for_unit("default.target")`  
`       machine.succeed("su -- alice -c 'which firefox'")`  
`       machine.fail("su -- root -c 'which firefox'")`  
`     '';`  
`   }`

## wayland application example

The configuration we are using is starting the gnome desktop manager using wayland. To test if a wayland application is working is more complicated because we need to automate the login into gnome and automated startup of the application. Additionally we need to enable access to gnome dbus interface. To do this we need to modify the configuration the automated start of the application including automated login to gnome/wayland

In the machine configuration we need to enable autologin for the user alice.

`     services.xserver.displayManager.autoLogin.enable = true;`  
`     services.xserver.displayManager.autoLogin.user = "alice";`

To simplify our script we pin the uid of the user to 1000.

`       uid = 1000;`

We specify a service that auto start firefox after login, which is easier than doing this in the test script.

`     environment.systemPackages = [`  
`       (pkgs.makeAutostartItem {`  
`         name = "firefox";`  
`         package = pkgs.firefox;`  
`       })`  
`     ];`

Because gnome doesn't allow the evaluation of javascript to get information about open windows we need to override the gnome-shell startup service to start gnome-shell in unsafe mode:

`     systemd.user.services = {`  
`       "org.gnome.Shell@wayland" = {`  
`         serviceConfig = {`  
`           ExecStart = [`  
`             # Clear the list before overriding it.`  
`             ""`  
`             # Eval API is now internal so Shell needs to run in unsafe mode.`  
`             "${pkgs.gnome.gnome-shell}/bin/gnome-shell --unsafe-mode"`  
`           ];`  
`         };`  
`       };`

The test script utilizes the gnome dbus interface to get a list of open wayland windows. we wait until firefox appear to be started and make a screenshot that will be found in the result folder.

`   testScript = {nodes, ...}: let`  
`     user = nodes.machine.config.users.users.alice;`  
`     bus = "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/${toString user.uid}/bus";`  
`     gdbus = "${bus} gdbus";`  
`     su = command: "su - ${user.name} -c '${command}'";`  
`     gseval = "call --session -d org.gnome.Shell -o /org/gnome/Shell -m org.gnome.Shell.Eval";`  
`     wmClass = su "${gdbus} ${gseval} global.display.focus_window.wm_class";`  
`   in ''`  
`     machine.wait_until_succeeds("${wmClass} | grep -q 'firefox'")`  
`     machine.sleep(20)`  
`     machine.screenshot("screen")`  
`   '';`

The complete \`firefoxtest.nix\` file looks like the following:

` let`  
`   nixpkgs = builtins.fetchTarball "`[`https://github.com/nixOS/nixpkgs/archive/22.05.tar.gz`](https://github.com/nixOS/nixpkgs/archive/22.05.tar.gz)`";`  
`   pkgs = import nixpkgs {};`  
`   home-manager = builtins.fetchTarball "`[`https://github.com/nix-community/home-manager/archive/release-22.05.tar.gz`](https://github.com/nix-community/home-manager/archive/release-22.05.tar.gz)`";`  
` in`  
`   pkgs.nixosTest {`  
`     nodes.machine = {...}: {`  
`       imports = [`  
`         (import "${home-manager}/nixos")`  
`       ];`  
`       boot.loader.systemd-boot.enable = true;`  
`       boot.loader.efi.canTouchEfiVariables = true;`  
` `  
`       services.xserver.enable = true;`  
`       services.xserver.displayManager.gdm.enable = true;`  
`       services.xserver.desktopManager.gnome.enable = true;`  
`       services.xserver.displayManager.autoLogin.enable = true;`  
`       services.xserver.displayManager.autoLogin.user = "alice";`  
` `  
`       users.users.alice = {`  
`         isNormalUser = true;`  
`         extraGroups = ["wheel"]; # Enable ‘sudo’ for the user.`  
`         uid = 1000;`  
`       };`  
` `  
`       home-manager.users.alice = {`  
`         home.packages = [`  
`           pkgs.firefox`  
`           pkgs.thunderbird`  
`         ];`  
`       };`  
` `  
`       system.stateVersion = "22.05";`  
` `  
`       environment.systemPackages = [`  
`         (pkgs.makeAutostartItem {`  
`           name = "firefox";`  
`           package = pkgs.firefox;`  
`         })`  
`       ];`  
` `  
`       systemd.user.services = {`  
`         "org.gnome.Shell@wayland" = {`  
`           serviceConfig = {`  
`             ExecStart = [`  
`               # Clear the list before overriding it.`  
`               ""`  
`               # Eval API is now internal so Shell needs to run in unsafe mode.`  
`               "${pkgs.gnome.gnome-shell}/bin/gnome-shell --unsafe-mode"`  
`             ];`  
`           };`  
`         };`  
`       };`  
`     };`  
` `  
`     testScript = {nodes, ...}: let`  
`       user = nodes.machine.config.users.users.alice;`  
`       #uid = toString user.uid;`  
`       bus = "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/${toString user.uid}/bus";`  
`       gdbus = "${bus} gdbus";`  
`       su = command: "su - ${user.name} -c '${command}'";`  
`       gseval = "call --session -d org.gnome.Shell -o /org/gnome/Shell -m org.gnome.Shell.Eval";`  
`       wmClass = su "${gdbus} ${gseval} global.display.focus_window.wm_class";`  
`     in ''`  
`       machine.wait_until_succeeds("${wmClass} | grep -q 'firefox'")`  
`       machine.sleep(20)`  
`       machine.screenshot("screen")`  
`     '';`  
`   }`

## Tests that need multiple virtual machines

Tests can involve multiple virtual machines.

This example uses the use-case of a [REST](https://en.m.wikipedia.org/wiki/REST) interface to a [PostgreSQL](https://www.postgresql.org/) database. The following example Nix expression is adapted from [How to use NixOS for lightweight integration tests](https://www.haskellforall.com/2020/11/how-to-use-nixos-for-lightweight.html).

This tutorial follows [PostgREST tutorial](https://postgrest.org/en/stable/tutorials/tut0.html), a generic [RESTful API](https://restfulapi.net/) for PostgreSQL.

If you skim over the official tutorial, you'll notice there's quite a bit of setup in order to test if all the steps work.

The setup includes:

\- A virtual machine named \`server\` running PostgreSQL and PostgREST.

\- A virtual machine named \`client\` running HTTP client queries using \`curl\`.

\- A \`testScript\` orchestrating testing logic between \`client\` and \`server\`.

The complete \`postgrest.nix\` file looks like the following:

` let`  
`   # Pin Nixpkgs, as some packages are broken in the 22.11 release`  
`   nixpkgs = fetchTarball "`[`https://github.com/NixOS/nixpkgs/archive/0f8f64b54ed07966b83db2f20c888d5e035012ef.tar.gz`](https://github.com/NixOS/nixpkgs/archive/0f8f64b54ed07966b83db2f20c888d5e035012ef.tar.gz)`";`  
`   pkgs = import nixpkgs { config = {}; overlays = []; };`  
` `  
`   # Single source of truth for all tutorial constants`  
`   database = "postgres";`  
`   schema        = "api";`  
`   table         = "todos";`  
`   username      = "authenticator";`  
`   password      = "mysecretpassword";`  
`   webRole       = "web_anon";`  
`   postgrestPort = 3000;`  
` `  
`   # NixOS module shared between server and client`  
`   sharedModule = {`  
`     # Since it's common for CI not to have $DISPLAY available, explicitly disable graphics support`  
`     virtualisation.graphics = false;`  
`   };`  
` `  
` in `  
`   pkgs.nixosTest {`  
`     # NixOS tests are run inside a virtual machine, and here you specify its system type`  
`     system = "x86_64-linux";`  
`     name = "postgres-test";`  
`     nodes = {`  
`       server = { config, pkgs, ... }: {`  
`         imports = [ sharedModule ];`  
` `  
`         networking.firewall.allowedTCPPorts = [ postgrestPort ];`  
` `  
`         services.postgresql = {`  
`           enable = true;`  
` `  
`           initialScript = pkgs.writeText "initialScript.sql" ''`  
`             create schema ${schema};`  
` `  
`             create table ${schema}.${table} (`  
`                 id serial primary key,`  
`                 done boolean not null default false,`  
`                 task text not null,`  
`                 due timestamptz`  
`             );`  
` `  
`             insert into ${schema}.${table} (task) values ('finish tutorial 0'), ('pat self on back');`  
` `  
`             create role ${webRole} nologin;`  
`             grant usage on schema ${schema} to ${webRole};`  
`             grant select on ${schema}.${table} to ${webRole};`  
` `  
`             create role ${username} inherit login password '${password}';`  
`             grant ${webRole} to ${username};`  
`           '';`  
`         };`  
` `  
`         users = {`  
`           mutableUsers = false;`  
`           users = {`  
``              # For ease of debugging the VM as the `root` user ``  
`             root.password = "";`  
` `  
`             # Create a system user that matches the database user so that you`  
`             # can use peer authentication. The tutorial defines a password,`  
`             # but it's not necessary.`  
`             "${username}".isSystemUser = true;`  
`           };`  
`         };`  
` `  
`         systemd.services.postgrest = {`  
`           wantedBy = [ "multi-user.target" ];`  
`           after = [ "postgresql.service" ];`  
`           script =`  
`             let`  
`               configuration = pkgs.writeText "tutorial.conf" ''`  
`                   db-uri = "postgres://${username}:${password}@localhost:${toString config.services.postgresql.port}/${database}"`  
`                   db-schema = "${schema}"`  
`                   db-anon-role = "${username}"`  
`               '';`  
`             in "${pkgs.haskellPackages.postgrest}/bin/postgrest ${configuration}";`  
`           serviceConfig.User = username;`  
`         };`  
`       };`  
` `  
`       client = {`  
`         imports = [ sharedModule ];`  
`       };`  
`     };`  
` `  
`     # Disable linting for simpler debugging of the testScript`  
`     skipLint = true;`  
` `  
`     testScript = ''`  
`       import json`  
`       import sys`  
` `  
`       start_all()`  
` `  
`       server.wait_for_open_port(${toString postgrestPort})`  
` `  
`       expected = [`  
`           {"id": 1, "done": False, "task": "finish tutorial 0", "due": None},`  
`           {"id": 2, "done": False, "task": "pat self on back", "due": None},`  
`       ]`  
` `  
`       actual = json.loads(`  
`           client.succeed(`  
`               "${pkgs.curl}/bin/curl `[`http://server:${toString`](http://server:$%7BtoString)` postgrestPort}/${table}"`  
`           )`  
`       )`  
` `  
`       assert expected == actual, "table query returns expected content"`  
`     '';`  
` }`

Unlike the previous example, the virtual machines need an expressive name to distinguish them. For this example we choose \`client\` and \`server\`.

Set up all machines and run the test script:

` nix-build postgrest.nix`

` ...`  
` test script finished in 10.96s`  
` cleaning up`  
` killing client (pid 10)`  
` killing server (pid 22)`  
` (0.00 seconds)`  
` /nix/store/bx7z3imvxxpwkkza10vb23czhw7873w2-vm-test-run-unnamed`

## Further reading

- [Run NixOS Integration Tests on macOS, Nixcademy](https://nixcademy.com/posts/running-nixos-integration-tests-on-macos/)
- [Unveiling the Power of the NixOS Integration Test Driver (Part 1), Nixcademy](https://nixcademy.com/posts/nixos-integration-tests/)
- [Unveiling the Power of the NixOS Integration Test Driver (Part 2), Nixcademy](https://nixcademy.com/posts/nixos-integration-tests-part-2/)

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
