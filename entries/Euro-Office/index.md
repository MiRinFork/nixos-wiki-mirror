<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Euro-Office -->

[Euro-Office](https://github.com/Euro-Office/) can be used as a standalone desktop editor or integrated web application to collaboratively edit documents, presentations, spreadsheets and even PDF files.

### Desktop editor

To install the desktop editor, add following line to your system configuration.

``` nix
environment.systemPackages = [ pkgs.euro-office-desktopeditors ];
```

After this, simply run `euro-office-desktopeditors`.

### Document server

Following snippet runs a Euro-Office-Documentserver instance on localhost. For integration into <a href="Nextcloud" class="wikilink" title="Nextcloud">Nextcloud</a>, see the <a href="Nextcloud#ONLYOFFICE" class="wikilink" title="corresponding section">corresponding section</a>.Note the example above leaks the secret into your nix store - you should review a <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secrets management approach">secrets management approach</a> and make sure you pick a unique secret.

### See also

- <a href="ONLYOFFICE" class="wikilink" title="ONLYOFFICE">ONLYOFFICE</a> and <a href="ONLYOFFICE_DocumentServer" class="wikilink" title="ONLYOFFICE DocumentServer">ONLYOFFICE DocumentServer</a>, the original suite which Euro-Office was forked of. Compared to Euro-Office, the licensing is more strict and the development of the applications less community-driven.
- <a href="Nextcloud#Collabora_Online" class="wikilink" title="Collabora Online">Collabora Online</a>, part of the Nextcloud web-based office suite, based on a LibreOffice engine.
- <a href="LibreOffice" class="wikilink" title="LibreOffice">LibreOffice</a>, a multi-platform office suite. It consists of programs for word processing (Writer); creating and editing spreadsheets (Calc), slideshows (Impress), diagrams and drawings (Draw); working with databases (Base); and composing mathematical formulae (Math).

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
