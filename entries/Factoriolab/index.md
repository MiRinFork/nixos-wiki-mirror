<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Factoriolab -->

[Factoriolab](https://github.com/factoriolab/factoriolab) is an Angular-based calculator for factory games like Factorio and Dyson Sphere Program. It determines resource and machine requirements for your desired objectives.

## Installing on NixOS

Factoriolab is a web-based calculator. Therefore, the Nix package provides only the static files needed to run the application, which you then access via a web server.

For the following examples we will use Python's built-in HTTP server, if you prefer to have it always available you can skip installing python and follow the Nginx example.

To install Factoriolab on NixOS, add the following to your configuration.nix file. This adds the factoriolab and python packages to your system's global environment.

After rebuilding your system with nixos-rebuild switch, proceed to the Usage section.

#### Temporary Installation

If you only need to use it temporarily, you can install the packages and enter a shell with them using nix-shell:

``` bash
nix-shell -p factoriolab python3
```

Once you are inside the shell, proceed to the Usage section.

## Usage

You must serve the Factoriolab files using a web server. Here are two recommended methods.

#### Using Python's HTTP Server (Recommended for temporary use)

First, locate the Factoriolab files within the Nix store and start Python's built-in HTTP server from that directory.

``` bash
cd $(nix-build "<nixpkgs>" -A factoriolab)/share/factoriolab && python3 -m http.server
```

This command will start the server, and you'll see a message like: "Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ..."

To use the calculator, navigate to <http://localhost:8000/> in your web browser. It will be available until you close your terminal.

#### Using Nginx (Permanent Installation)

For a permanent, always-available installation, you can set up Nginx to serve the static files.

Add the following to your NixOS configuration to enable Nginx and configure a virtual host for Factoriolab:

After rebuilding your system with nixos-rebuild switch, you will be able to access Factoriolab via <http://localhost/>.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
