<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Invoiceplane -->

[Invoiceplane](https://www.invoiceplane.com) is a web application for managing invoices, clients and payments.

## Installation

To setup Invoiceplane locally, this is the most minimal configuration to get started

After that Invoiceplane will be available at <http://localhost> . Complete the setup by choosing your default language and setting up your user profile.

It is recommended to disable the setup wizard after installation is complete. Add following arguments to the settings option:

## Configuration

### Invoice templates

Invoiceplane will render and export invoices as PDF. You can create your own invoice templates or reuse existing ones. The following example fetches an invoice template and makes it available to your running Invoiceplane instance

### Invoice mail delivery

There are several methods to automatically deliver invoices via mail. First we have to configure which mail backend to use. One method which is confirmed to work on NixOS is to use `sendmail`. Using a configured program like <a href="Msmtp" class="wikilink" title="Msmtp">Msmtp</a> to relay mails from your server using your existing mail provider. Unfortunately it is [not yet possible](https://github.com/InvoicePlane/InvoicePlane/issues/845) to configure the mail backend with *extraSettings*. In this case navigate in the web interface to: *Settings → System settings → E-Mail* and set mail delivery method to *Sendmail*.

Invoices can be send directly while editing them. It is also possible to create a common mail template which can be reused. Go to *Settings → Mail templates*. To configure a default mail template, go to *Settings → System settings → Invoices*.

### Recurring invoices

See [upstream documentation](https://wiki.invoiceplane.com/en/1.5/modules/recurring-invoices) on how to configure recurring. invoices. This feature requires a cron task setup which queries the Invoiceplane backend every few minutes. This can be configured with the Invoiceplane module as follows

Replace the cron key value with the one given in the Invoiceplane administration web interface.

### Electronic invoice

To enable electronic invoicing using the [standard ZUGFeRD](http://zugferd.org), we can hardcode the activation into the InvoicePlane source code. Otherwise it has to be manually enabled in the settings menu of the web app.

Enabling this via `settings` option is [not yet possible](https://github.com/InvoicePlane/InvoicePlane/issues/999).

## Maintenance

### Upgrading to new versions

After upgrading to a new version of Invoiceplane, change following two lines of your Invoiceplane config to re-enable the setup wizard, required for database upgrades.

Access your Invoiceplane instance again in your browser and rerun the setup. After upgrading the tables you can login as usual. It is now recommended to change both variables in the config file above back to `true`.

## Tips and tricks

### Invoice template development

Following `flake.nix` file helps you spawning a virtual machine running a development environment of Invoiceplane. The local directory `/home/user/my_invoiceplane_template` containing a modified invoice or quote template will be mounted into the Invoiceplane web app, allowing to change the template and directly render the invoice PDF in the local web server at <http://localhost:8080>

``` nix
{
  description = "Invoiceplane invoice template development shell";

  inputs.nixpkgs.url = "nixpkgs/nixos-24.11";

  outputs = { self, nixpkgs, ... }@inputs:
  let
    pkgs = nixpkgs.legacyPackages.x86_64-linux;
    start =
      pkgs.writeShellScriptBin "start" ''
        set -e
        export QEMU_NET_OPTS="hostfwd=tcp::8080-:80"
        ${pkgs.nixos-shell}/bin/nixos-shell --flake .
       '';
  in {
    nixosConfigurations.vm = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs.inputs = inputs;
      pkgs = import nixpkgs {
    overlays = [
          (self: super: {
            invoiceplane = super.invoiceplane.overrideAttrs (oldAttrs: rec {
              installPhase = oldAttrs.installPhase + ''
                rm -r $out/application/views/invoice_templates/pdf
                ln -sf /var/lib/invoiceplane/localhost/pdf $out/application/views/invoice_templates/pdf
              '';
            });
          })
        ];
      };
      modules = [
        ({ lib, config, pkgs, ... }: {

      services.invoiceplane.sites."localhost" = {
        enable = true;
        settings.IP_URL = "http://localhost:8080";
      };

          nixos-shell.mounts.extraMounts = {
            "/var/lib/invoiceplane/localhost/pdf" = {
               target = /home/user/my_invoiceplane_template;
               cache = "none";
            };
          };

          system.stateVersion = "24.11";
          services.getty.autologinUser = "root";
        })
      ];
    };

    packages = { inherit start; };
    defaultPackage.x86_64-linux = start;

  };
}
```

To run the web server simply execute following command in the same directory as the `flake.nix` file

``` shell
nix run
```

## See also

- <a href="Crater" class="wikilink" title="Crater">Crater</a>, alternative self-hosted invoicing application

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
