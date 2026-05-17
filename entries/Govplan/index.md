<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Govplan -->

[Govplan](https://github.com/okfde/froide-govplan) is a web-app for tracking government plans. It is developed by the [Open Knowledge Foundation Germany e.V.](https://okfn.de/) and used by the project [Koalitionstracker](https://fragdenstaat.de/koalitionstracker/) of FragDenStaat.de.

## Setup

To enable and run Govplan add following line to your system configuration and apply it

``` nix
services.froide-govplan.enable = true;
```

As soon the Django web app is started and provisioned, you can access it on <http://localhost> . Create a administration account by executing following command

``` shell
froide-govplan createsuperuser
```

Bootstrap the Govplan app with following steps

- Login and access the backend site <http://localhost:80/admin/cms/page/>
- Create a new (home) page
- Access advanced settings of the new page (burger menu right side in the table row) and define "Govplan" as application for that page
- Open the new home page <http://localhost/>, click on "Edit" in the admin menu
- The right button in the admin panel opens the page structure menu. You can place single block elements such as the overview of government plans, categories, etc. By doing this you can also create a government entity.

## Usage

Access the administration backend <http://localhost/admin/> to add government entities, government plans, categories, etc.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Django" class="wikilink" title="Category:Django">Category:Django</a>
