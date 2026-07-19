<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix ecosystem/es -->

<languages/> El **Núcleo del ecosistema Nix** es un conjunto de tecnologías diseñado para compilar de forma reproducible paquetes y sistemas, así como para configurarlos y administrarlos de manera declarativa junto con sus dependencias. Esto se consigue trasladando el paradigma funcional del ámbito de los programas al de los sistemas mediante un lenguaje específico de dominio (DSL), dinámico, funcional y de evaluación diferida, denominado <a href="Special:MyLanguage/Overview_of_the_Nix_Language" class="wikilink" title="lenguaje Nix">lenguaje Nix</a>, que permite definir compilaciones reproducibles.

Además, existen numerosas <a href="Special:MyLanguage/applications" class="wikilink" title="aplicaciones">aplicaciones</a> (**Ecosistema Extendido Nix**) desarrolladas por la comunidad de Nix que utilizan y respaldan estas tecnologías del nucleo.

<span id="Official_ecosystem"></span>

## Ecosistema Oficial

| Componente | Manual | Descripción | Uso | Licencia |
|----|----|----|----|----|
| <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> | [NixOS Manual](https://nixos.org/nixos/manual/) | Una distribución de Linux cuyos *todos* los componentes se compilan con Nix, lo que permite la gestión declarativa y reproducible de la configuración de todo el sistema, además de actualizaciones y reversiones atómicas. | Configure escritorios, servidores y clústeres de forma declarativa. | MIT |
| <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> | [Nixpkgs Manual](https://nixos.org/nixpkgs/manual/) | El mayor repositorio de paquetes de Nix y módulos de NixOS mantenido por la comunidad; las versiones oficiales de NixOS se publican aquí. | Comparta paquetes de Nix y módulos para NixOS | MIT |
| <a href="Special:MyLanguage/Hydra" class="wikilink" title="Hydra">Hydra</a> | [Hydra Manual](https://nixos.org/hydra/manual/) | Un sistema de compilación continua basado en Nix. | Infraestructura de compilación de integración continua | GPL-3.0 |
| <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> | [Nix Manual](https://nixos.org/nix/manual/) | Un gestor de paquetes que interpreta expresiones de Nix para definir compilaciones reproducibles y almacena el resultado en la store de Nix utilizando una dirección basada en el hash del árbol de dependencias. Esto evita el «infierno de las dependencias» y permite instalar varias versiones de un mismo paquete, así como realizar reversiones. | Compilaciones reproducibles y administración de paquetes en Linux y Darwin. | LGPL-2.1 |

Componentes principales del ecosistema Nix

<table style="width:20%;">
<caption><strong>Principales tecnologías del ecosistema NixOS</strong></caption>
<colgroup>
<col style="width: 20%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>NixOS</p>
</div>
<p>Una distribución de Linux y un sistema de configuración basado en Nixpkgs.</p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nixpkgs</p>
</div>
<p>Un amplio repositorio de paquetes mantenido por la comunidad.</p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nix</p>
</div>
<p>Un sistema de compilación puro y funcional.</p></td>
</tr>
</tbody>
</table>

<span id="Usage_of_NixOS"></span>

## Uso de NixOS

Los usuarios instalan la distribución NixOS en sus equipos como cualquier otra distribución de Linux. Consultan los paquetes disponibles y las opciones de configuración en Nixpkgs a través de <https://search.nixos.org> y de esta wiki. Utilizan el lenguaje Nix para describir de forma declarativa, en un archivo de texto, qué paquetes de software deben instalarse y cómo debe configurarse el sistema. Ejecutan dos programas de línea de comandos en una terminal para transformar el sistema en el sistema descrito. Luego utilizan el sistema como cualquier otro sistema Linux.

<span id="Development_of_NixOS"></span>

## Desarrollo de NixOS

Los desarrolladores de *NixOS* trabajan principalmente en *Nixpkgs*. El desarrollo del propio NixOS abarca tres grandes áreas, además de otras de menor tamaño (aunque no menos importantes). Las áreas principales son el empaquetado, el sistema de módulos y la documentación.

- El empaquetado se realiza en *Nixpkgs* y no es exclusivo de *NixOS* ni siquiera de plataformas basadas en Linux. Los mantenedores de paquetes que no son exclusivos de *NixOS* (como las herramientas necesarias para ejecutar la propia distribución) suelen encargarse de múltiples plataformas, aunque esto no es un requisito estricto.

<!-- -->

- El sistema de módulos es la forma en que se configuran principalmente los servicios que se ejecutan en *NixOS*. Esta área abarca desde configuraciones de "bajo nivel", como archivos de unidades de *systemd* o la provisión de configuraciones personalizadas del kernel, hasta la generación de archivos de configuración para servicios específicos. El sistema de módulos es la principal forma en que los usuarios configuran *NixOS* y se encuentra en el subdirectorio `nixos/` de *Nixpkgs*.

<!-- -->

- La documentación está integrada en gran medida en los datos del sistema de empaquetado y de módulos, aunque también se incluyen archivos Markdown independientes en el repositorio de *Nixpkgs*. La documentación también abarca el mantenimiento del sitio web, la Wiki y otros aspectos del ecosistema más amplio. Las dos primeras categorías consisten casi exclusivamente en código del lenguaje *Nix* escrito en archivos de texto, mientras que la última es una combinación de código *Nix*, archivos Markdown y diversos formatos adicionales.

Todas las contribuciones a *Nixpkgs*, independientemente de si afectan a *NixOS* o no, están sujetas a revisión por pares antes de ser integradas en *Nixpkgs*. Muchos paquetes, junto con documentación y materiales adicionales como imágenes ISO o archivos tar, se compilan previamente en *Hydra* para reducir el tiempo de actualización para los usuarios de *NixOS*.

Esas tres categorías son las más grandes en cuanto a volumen de contribuciones; sin embargo, muchos mantenedores también participan en actividades relacionadas con la fundación de *NixOS*, como el mantenimiento de la infraestructura sobre la que se ejecutan el sitio web, *Hydra* y otras herramientas, o el desarrollo de herramientas necesarias para *NixOS*.

| Tipo de desarrollo | Ubicación del desarrollo | Ejemplos |
|----|----|----|
| Empaquetado independiente de la plataforma | *Nixpkgs* | [paquete coreutils](https://github.com/NixOS/nixpkgs/blob/bf3287dac860542719fe7554e21e686108716879/pkgs/tools/misc/coreutils/default.nix), [*stdenv* framework](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/stdenv), [paquete Libreoffice](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/applications/office/libreoffice/default.nix) |
| Herramientas independientes de la plataforma | *Nixpkgs* y varios repositorios | [implementación upstream/default de Nix (CppNix)](https://github.com/NixOS/nix), [código fuente de *Hydra*](https://github.com/NixOS/hydra), [bot de integración de *Nixpkgs*](https://github.com/NixOS/nixpkgs-merge-bot) |
| Herramientas de *NixOS* | mayormente *Nixpkgs* | [Código fuente de nixos-rebuild-ng](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/by-name/ni/nixos-rebuild-ng), [ISOs de instalación de *NixOS*](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix) |
| *NixOS* Sistema de Módulos | *Nixpkgs* | [Configuración del gestor de pantalla](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/display-managers/default.nix), [configuración de bases de datos MySQL (y derivadas)](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/databases/mysql.nix) |
| Insfraestructura |  | [Infraestructura de esta Wiki](https://github.com/NixOS/nixos-wiki-infra), [infraestructura de *NixOS*](https://github.com/NixOS/infra) |
| Documentación |  | [Esta Wiki](https://wiki.nixos.org), [documentación de *stdenv*](https://github.com/NixOS/nixpkgs/blob/8d92119c540d78599ba208010c722a60958810f4/doc/stdenv/stdenv.chapter.md), [configuración IPv6 de *NixOS*](https://github.com/NixOS/nixpkgs/blob/master/nixos/doc/manual/configuration/ipv6-config.section.md) (visible en la [sección IPv6 del manual de *NixOS*](https://nixos.org/manual/nixos/stable/#sec-ipv6)), [Guía de contribución de *Nixpkgs*](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md) |
| Organización Técnica |  | [*NixOS* RelEng](https://github.com/NixOS/nixpkgs/issues/390768), [*Nix* and *NixOS* RFCs](https://github.com/NixOS/rfcs/) |
| Otros |  | [Ilustraciones de *NixOS*](https://github.com/NixOS/nixos-artwork), [discurso de *NixOS* (y relacionados)](https://discourse.nixos.org/), [Fundación *NixOS*](https://github.com/NixOS/foundation) |

Varios ejemplos de desarrollo de *NixOS* junto con sus enlaces.

Ver también: github.com/NixOS/org Repositorio de la Organización Nix

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
