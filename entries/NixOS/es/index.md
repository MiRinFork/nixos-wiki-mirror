<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS/es -->

<languages/>

[NixOS](https://nixos.org/) es una distribución de Linux basada en el gestor de paquetes y sistema de construcción <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a>. Admite la <a href="Wikipedia:Declarative_programming" class="wikilink" title="gestión declarativa">gestión declarativa</a> de la <a href="Wikipedia:Configuration_management" class="wikilink" title="configuración">configuración</a> de todo el sistema, así como actualizaciones y reversiones <a href="Wikipedia:Atomicity_(database_systems)" class="wikilink" title="atómicas">atómicas</a>, aunque también puede admitir la gestión <a href="Wikipedia:Imperative_programming" class="wikilink" title="imperativa">imperativa</a> de paquetes y usuarios. En NixOS, todos los componentes de la distribución; incluido el <a href="Wikipedia:Linux_kernel" class="wikilink" title="kernel">kernel</a>, los <a href="Wikipedia:Package_manager" class="wikilink" title="paquetes">paquetes</a> instalados y los archivos de configuración del sistema; son construidos por <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> a partir de <a href="Wikipedia:Pure_function" class="wikilink" title="funciones puras">funciones puras</a> llamadas <a href="Special:MyLanguage/Nix_(language)" class="wikilink" title="expresiones Nix">expresiones Nix</a>.

Dado que Nix utiliza caché de <a href="Wikipedia:Executable" class="wikilink" title="binarios">binarios</a>, esto proporciona un equilibrio único entre el enfoque orientado a binarios utilizado por distribuciones como Debian y el enfoque orientado al <a href="Wikipedia:Source_code" class="wikilink" title="código fuente">código fuente</a> utilizado por distribuciones como Gentoo. Los binarios pueden utilizarse para componentes estándar, y los paquetes y módulos personalizados pueden utilizarse automáticamente cuando no hay disponible un binario precompilado.

<div class="mw-translate-fuzzy">

Las versiones estables de NixOS se publican dos veces al año (alrededor de finales de mayo y finales de noviembre). NixOS fue creado por Eelco Dolstra y <a href="Wikipedia:Armijn_Hemel" class="wikilink" title="Armijn Hemel">Armijn Hemel</a>, y publicado inicialmente en 2003. Es desarrollado y mantenido por la comunidad bajo la supervisión de la <a href="Special:MyLanguage/Nix_Community#NixOS_Foundation" class="wikilink" title="Fundación NixOS">Fundación NixOS</a>.

</div>

<span id="Installation"></span>

## Instalación

Para obtener una guía de instalación completa, consulta el [capítulo de instalación del manual de NixOS](https://nixos.org/nixos/manual/index.html#ch-installation). Esta wiki también incluye guías alternativas o complementarias, como <a href="Special:MyLanguage/NixOS_as_a_desktop" class="wikilink" title="NixOS como escritorio">NixOS como escritorio</a>.

La mayoría de los usuarios instalarán NixOS mediante [una de las imágenes ISO](https://nixos.org/download/#nixos-iso). Hay disponibles variantes ISO "gráfica" y "mínima" para cada arquitectura compatible; las imágenes "gráficas" son adecuadas para usuarios que planean instalar un entorno de escritorio, mientras que las imágenes "mínimas" son adecuadas para usuarios que desean instalar NixOS como servidor o prefieren una imagen ISO más pequeña.

Las imágenes ISO son imágenes híbridas que pueden grabarse en medios ópticos o copiarse directamente a una unidad USB y arrancarse tal cual. Consulta la guía de instalación para obtener más detalles.

Además de las imágenes ISO, la [página de descarga](https://nixos.org/download/#nixos-iso) ofrece varios métodos alternativos para instalar NixOS. Estos incluyen:

- Dispositivos virtuales en formato OVA (compatibles con VirtualBox);
- AMI de Amazon EC2;

<div lang="en" dir="ltr" class="mw-content-ltr">

Additionally, many existing Linux installations can be converted into NixOS installations using [nixos-infect](https://github.com/elitak/nixos-infect) or [nixos-in-place](https://github.com/jeaye/nixos-in-place); this is particularly useful for installing NixOS on hosting providers which do not natively support NixOS.

</div>

<span id="System_architectures"></span>

### Arquitecturas del sistema

NixOS ofrece soporte integrado para la mayoría de dispositivos x86_64 y dispositivos ARM64 genéricos.

<span id="32-bit_x86_architectures"></span>

#### Arquitecturas 32-bit x86

El soporte para arquitecturas x86 de 32 bits (es decir, `i686`) ha ido disminuyendo. Aunque la mayoría de los paquetes todavía deberían compilarse y ejecutarse, su disponibilidad en caché se ha reducido considerablemente[^1]. La ISO de x86 de 32 bits ya no se ofrece como una imagen preconstruida, pero todavía puede generarse manualmente.

<span id="64-bit_x86_architectures"></span>

#### Arquitecturas 64-bit x86

La mayoria de los dispositivos `x86_64` deberian ejecutar NixOS sin ningun problema.

<span id="32-bit_ARM_architectures"></span>

#### Arquitecturas 32-bit ARM

NixOS no tiene soporte oficial para dispositivos ARM32 (por ejemplo, `armv6` y `armv7l`); sin embargo, para algunos de estos dispositivos puede existir soporte por parte de la comunidad.

<span id="64-bit_ARM_architectures"></span>

#### Arquitecturas ARM de 64 bits

Siempre que un dispositivo sea compatible con el proceso de arranque genérico de systemd, NixOS debería funcionar sin configuración adicional. Sin embargo, algunos dispositivos específicos con cargadores de arranque propietarios pueden presentar problemas al ejecutarlo.

<span id="MIPS_architectures"></span>

#### Arquitecturas MIPS

En el pasado hubo soporte limitado para arquitecturas MIPS en NixOS, y aún pueden encontrarse vestigios de ese soporte en Nixpkgs. Sin embargo, actualmente no existe soporte oficial.

<span id="RISC-V_architectures"></span>

#### Arquitecturas RISC-V

NixOS no ofrece soporte oficial para dispositivos RISC-V. Sin embargo, algunos dispositivos pueden contar con soporte de la comunidad.

<span id="Usage"></span>

## Uso

<span id="declarative-configuration"></span>

<span id="Declarative_Configuration"></span>

### Configuración Declarativa

Una de las características distintivas de NixOS es su modelo de configuración declarativa, donde todo el estado del sistema, incluidos los paquetes instalados, los servicios del sistema y la configuración, se describe en archivos de configuración. El archivo principal suele estar ubicado en `/etc/nixos/configuration.nix`.

Los cambios en la configuración se aplican de forma atómica mediante `nixos-rebuild switch`, garantizando la reproducibilidad y la posibilidad de volver a estados anteriores. La mayoría de los usuarios mantienen sus archivos de configuración en un sistema de control de versiones, lo que permite configuraciones del sistema coherentes y portables.

Estas deficiencias suelen corregirse posteriormente, si es que se corrigen, mediante soluciones de gestión de configuración como Puppet, Ansible o Chef. Estas herramientas sincronizan la configuración del sistema con una descripción del estado esperado. Sin embargo, estas herramientas no están integradas en el diseño del sistema operativo, sino que simplemente se superponen sobre él, y la configuración del sistema operativo aún puede variar cuando algún aspecto de dicha configuración no ha sido especificado en la descripción del estado esperado.

A diferencia de las distribuciones convencionales, donde la configuración del sistema suele estar repartida entre archivos editados manualmente, NixOS integra la gestión de configuración directamente en el sistema operativo. Esto elimina las inconcistencias de configuración y hace que NixOS sea especialmente adecuado para despliegues automatizados y reproducibles.

Para obtener más detalles y ejemplos sobre las configuraciones de NixOS, consulta <a href="Special:MyLanguage/NixOS_system_configuration" class="wikilink" title="Configuración del sistema NixOS">Configuración del sistema NixOS</a>.

<span id="Imperative_Operations"></span>

### Operaciones Imperativas

Aunque NixOS normalmente se configura de forma declarativa siempre que sea posible, hay algunos ámbitos en los que las operaciones imperativas siguen siendo necesarias, como la gestión del entorno de usuario y la gestión de canales.

<span id="User_Environments"></span>

#### Entornos de usuario

Además de la configuración declarativa del sistema, los usuarios de NixOS pueden utilizar el comando imperativo `nix-env` de Nix para instalar paquetes a nivel de usuario, sin modificar el estado del sistema. Consulta la <a href="Special:MyLanguage/Nix#User_Environments" class="wikilink" title="sección de entornos de usuario del artículo sobre Nix">sección de entornos de usuario del artículo sobre Nix</a> para obtener más información.

<span id="Channels"></span>

#### Canales (Channels)

En el <a href="Special:MyLanguage/Nix_ecosystem" class="wikilink" title="ecosistema Nix">ecosistema Nix</a>, los <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="canales">canales</a> son un mecanismo para distribuir colecciones de <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="paquetes de Nix">paquetes de Nix</a> y definiciones de módulos de <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>. Un canal representa un conjunto seleccionado y versionado de definiciones de paquetes y configuraciones del sistema, que normalmente corresponde a una versión específica o al estado de desarrollo más reciente disponible.

Al utilizar canales, tu sistema o <a href="Special:MyLanguage/User_Environment" class="wikilink" title="entorno de usuario">entorno de usuario</a> obtiene definiciones de paquetes y opciones desde una URL que apunta a una instantánea (snapshot) específica de la colección de paquetes de Nix (Nixpkgs) y los módulos de NixOS asociados.

Para obtener más información sobre el uso y la configuración de los canales de Nix, consulta <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="ramas de canales">ramas de canales</a> (channel branches).

<span id="Internals"></span>

## Funcionamiento interno

<span id="Comparison_with_traditional_Linux_Distributions"></span>

### Comparación con las distribuciones Linux tradicionales

*Articulo principal: <a href="Special:MyLanguage/Nix_vs._Linux_Standard_Base" class="wikilink" title="Nix vs. Linux Standard Base">Nix vs. Linux Standard Base</a>*

La principal diferencia entre NixOS y otras distribuciones Linux es que NixOS no sigue la estructura del sistema de archivos de la <a href="Wikipedia:Linux_Standard_Base" class="wikilink" title="Linux Standard Base">Linux Standard Base</a>. En los sistemas compatibles con LSB, el software se almacena en `/{,usr}/{bin,lib,share}` y la configuración generalmente se almacena en `/etc`. Los binarios del software están disponibles en el entorno de usuario si se ubican en uno de los directorios `/bin` definidos por la LSB. Cuando un programa hace referencia a bibliotecas dinámicas, buscará las bibliotecas necesarias en las carpetas de la LSB (`/lib`, `/usr/lib`).

En NixOS, sin embargo, `/lib` y `/usr/lib` no existen. En su lugar, todas las bibliotecas del sistema, binarios, kernels, firmware y archivos de configuración se colocan en el <a href="Special:MyLanguage/Nix_(package_manager)#Nix_store" class="wikilink" title="Nix store">Nix store</a>. Los archivos y directorios dentro de `/nix/store` reciben nombres basados en hashes de la información que describe los datos construidos. Todos los archivos y directorios almacenados en el Nix store son inmutables. `/bin` y `/usr/bin` están prácticamente ausentes: solo contienen `/bin/sh` y `/usr/bin/env`, respectivamente, para proporcionar compatibilidad mínima con scripts existentes que utilizan líneas shebang. Los entornos a nivel de usuario se implementan mediante una gran cantidad de enlaces simbólicos a todos los paquetes necesarios y archivos auxiliares. Estos entornos se denominan <a href="Special:MyLanguage/Nix#Profiles" class="wikilink" title="perfiles">perfiles</a> y se almacenan en `/nix/var/nix/profiles`, teniendo cada usuario sus propios perfiles. La estructuración del sistema de esta manera es lo que permite a NixOS obtener sus ventajas principales frente a las distribuciones Linux convencionales, como la atomicidad y la compatibilidad con retrocesos.

<span id="Usage_of_the_Nix_store"></span>

### Uso de Nix store

Gran parte de la confusión entre los nuevos usuarios surge del hecho de que la configuración se almacena en el árbol de solo lectura `/nix/store` junto con todos los paquetes instalados. Esto hace imposible editar manualmente la configuración del sistema; todos los cambios de configuración deben realizarse modificando el archivo `/etc/nixos/configuration.nix` y ejecutando `nixos-rebuild switch`. NixOS proporciona el <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="sistema de módulos">sistema de módulos</a> para editar todas las configuraciones necesarias. Los usuarios deberían utilizar primero [la herramienta de búsqueda de opciones](https://search.nixos.org/options) para comprobar si existe la opción que necesitan antes de intentar añadir manualmente archivos o configuración mediante características de bajo nivel de NixOS, como los scripts de activación.

La pureza del sistema permite mantener la configuración del sistema en un lugar centralizado, sin necesidad de editar múltiples archivos. Esta configuración puede distribuirse o mantenerse bajo control de versiones según sea necesario. También proporciona determinismo; si se proporcionan las mismas entradas, la misma versión de Nixpkgs y el mismo archivo `/etc/nixos/configuration.nix`, se obtiene exactamente el mismo estado del sistema.

<span id="Modules"></span>

### Modulos

El <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="sistema de módulos de NixOS">sistema de módulos de NixOS</a>, definido en <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, proporciona las herramientas necesarias para personalizar la configuración del sistema operativo. Se utiliza para habilitar y configurar servicios como nginx, habilitar firmware y personalizar el kernel.

Por lo general, toda la configuración de los módulos se realiza añadiendo opciones al archivo `/etc/nixos/configuration.nix`. La mayoría de los ejemplos de la wiki muestran cómo utilizar este archivo para configurar el sistema operativo.

El sistema de módulos de NixOS implementa un sistema de tipos que permite la verificación de tipos de las opciones configuradas. También permite combinar automáticamente opciones definidas en múltiples lugares. Esto permite distribuir la configuración en varios archivos, y las opciones establecidas en todos ellos se combinarán entre sí:

Para obtener más detalles, consulta la sección [Módulos del Manual de NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules).

<span id="Generations"></span>

### Generaciones

Cada vez que se reconstruye el estado del sistema mediante `nixos-rebuild switch`, se crea una nueva generación. Puedes volver a una generación anterior en cualquier momento, lo que resulta útil si un cambio en la configuración (o una actualización del sistema) causa problemas.

Puedes volver atrás (roll back) mediante:

``` console
$ nix-env --rollback               # roll back a user environment
$ nixos-rebuild switch --rollback  # roll back a system environment
```

NixOS también incluye entradas de generaciones anteriores en el menú del cargador de arranque, por lo que, como último recurso, siempre puedes volver a una configuración anterior simplemente reiniciando. Para establecer la generación actualmente arrancada como predeterminada, ejecuta:

``` console
$ /run/current-system/bin/switch-to-configuration boot
```

Como NixOS conserva generaciones anteriores del estado del sistema para permitir retrocesos, las versiones antiguas de los paquetes no se eliminan inmediatamente después de una actualización. Puedes eliminar generaciones antiguas manualmente:

``` console
$ # delete generations older than 30 days
$ nix-collect-garbage --delete-older-than 30d

$ # delete ALL previous generations - you can no longer rollback after running this
$ nix-collect-garbage -d                       
```

Listar generaciones:

``` console
$ # as root
$ nix-env --list-generations --profile /nix/var/nix/profiles/system
```

Cambiar entre generaciones:

``` console
$ # as root switch to generation 204
$ nix-env --profile /nix/var/nix/profiles/system --switch-generation 204
```

Eliminar generacion(es) dañada(s):

``` console
$ # as root delete broken generations 205 and 206 
$ nix-env --profile /nix/var/nix/profiles/system --delete-generations 205 206
```

Puedes configurar la "recolección de basura" (garbage collection GC) automática definiendo las opciones de [`nix.gc`](https://search.nixos.org/options?query=nix.gc) en `/etc/nixos/configuration.nix`. Esto es recomendable, ya que ayuda a mantener reducido el tamaño del Nix store.

<span id="See_also"></span>

## Véase también

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS modules">NixOS modules</a>, a library for modular <a href="Special:MyLanguage/Overview_of_the_Nix_Expression_Language#Expressions" class="wikilink" title="Nix expressions">Nix expressions</a> which powers <a href="#declarative-configuration" class="wikilink" title="the declarative configuration of NixOS">the declarative configuration of NixOS</a>.
- <a href="Special:MyLanguage/NixOS_VM_tests" class="wikilink" title="NixOS VM tests">NixOS VM tests</a>, a library for creating reproducible infrastructure tests, based on <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>, QEMU and Perl.
- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book) (Ryan4yin, 2023) - 🛠️ ❤️ An unofficial NixOS & Flakes book for beginners.

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>

[^1]: <https://discourse.nixos.org/t/limited-cache-availability-for-i686-32-bits-x86-architecture/37626>
