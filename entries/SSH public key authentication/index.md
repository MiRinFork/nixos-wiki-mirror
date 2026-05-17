<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SSH public key authentication -->

SSH key authentication uses a [pair of cryptographic keys](https://en.wikipedia.org/wiki/Public-key_cryptography); a private key stored on the client and a public key placed on the server in order to verify identity without transmitting passwords over the network.

On NixOS, SSH key authentication is typically managed using <a href="SSH" class="wikilink" title="OpenSSH">OpenSSH</a>, which is included by default and can be configured both declaratively in configuration.nix and interactively using standard SSH tools.

## Generating an SSH key pair

To setup a public key based SSH connection from `your-machine` (client) to `another-machine` (server):

``` console
$ ssh-keygen -f ~/.ssh/another-machine
$ ssh-copy-id -i ~/.ssh/another-machine -p22 another-machine-host-or-ip
```

This copies the public key to `another-machine`, placing it in the user’s `~/.ssh/authorized_keys` file.

On `your-machine`, we stored the key file in the non-standard path `~/.ssh/another-machine`, so we must tell the SSH client to use the key file:

``` console
$ ssh -i ~/.ssh/another-machine another-machine-host-or-ip
```

The connection should now succeed without prompting for a password.

To make the SSH client automatically use the key file, add a host entry to your per-user SSH configuration file:

## SSH agent

A ssh private key, for which a phrase is defined, can be clumsy if you use it multiple times. It is possible to store the private key identity in a ssh-agent. The ssh-agent uses the ssh private key identity when you issue a ssh command, for instance when using ssh to connect.

To define NixOS to setup a ssh-agent, add this to your configuration:

``` nix
programs.ssh.startAgent = true;
```

NixOS will start a user systemd service with the ssh-agent at login. You can see the service with the command `systemctl --user status ssh-agent`.

It provides also the environment variable `$SSH_AUTH_SOCK` which refers to `/run/user/1000/ssh-agent` , in this case for user id 1000.

If you want to use a ssh key pair for authenticating, you can add this to the ssh-agent using the command ssh-add entering the phrase only once.

``` console
$ ssh-add ~/.ssh/id_rsa
Enter passphrase for /home/user/.ssh/id_rsa: 
Identity added: /home/user/.ssh/id_rsa (myaccounts@mymachine)
```

If you store the ssh public key with the command ssh-copy-id on `another-machine` as shown above, you can logon without giving a password or phrase.

## SSH server configuration

You can manage SSH authorized public keys declaratively by adding them to your system configuration:

Alternatively, you can reference a custom file containing the authorized keys:

For additional configuration options, see the module documentation.

After configuring user keys, it is recommended to improve server security by disabling password-based authentication and requiring public key authentication. This can be done on a NixOS-based server (e.g. `another-machine`). For additional security measures, see <a href="SSH#Security_hardening" class="wikilink" title="SSH#Security hardening">SSH#Security hardening</a>.

This can be configured in your system configuration:

## Tips and tricks

### KDE

By default, KDE prompts you to enter the passwords for your SSH keys to unlock them across session starts. To avoid being asked to unlock your SSH keys every time a session is restarted (e.g., after logging out or rebooting), you can use `ksshaskpass` to store the passwords. To enable this, make the following changes to your configuration:

``` nix
programs.ssh = {
  startAgent = true;
  enableAskPassword = true;
};

environment.variables = {
  SSH_ASKPASS_REQUIRE = "prefer";
};
```

After applying these changes, either log out (if you used `switch`) or reboot (if you used `boot` for the variables to take effect.

When you use an SSH key for the first time, you will be prompted to enter its passphrase. <strong><em>Be sure to select the "Remember password" checkbox</strong></em> and the passphrase will be securely stored in the KDE Wallet and automatically retrieved across session restarts.

## See also

- <a href="SSH" class="wikilink" title="SSH">SSH</a>
- <a href="Distributed_build" class="wikilink" title="Distributed build">Distributed build</a>

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
