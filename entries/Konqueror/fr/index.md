<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Konqueror/fr -->

<languages/> Konqueror est un gestionnaire de fichier pré-installé sur les environnements de bureau KDE/Plasma.

## Utilisation sans KDE

Étant donné que NixOS permet l'installation d'application KDE en dehors de l'environnement de bureau KDE Plasma, il est très simple d'installer Konqueror en tant que gestionnaire de fichier. Cependant les vignettes (appelées icônes de prévisualisation) ne seront pas affichées (au moins sur NixOS stable 22.11).

La solution (pour NixOS stable 22.11) est d'installer ces paquets dans environment.systemPackages, en plus de libsForQt5.konqueror:

- ffmpegthumbnailer
- libsForQt5.kdegraphics-thumbnailers
- libsForQt5.ffmpegthumbs
- libsForQt5.kio-extras

<div class="mw-translate-fuzzy">

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
