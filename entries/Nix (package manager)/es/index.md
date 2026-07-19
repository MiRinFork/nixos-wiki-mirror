<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/es -->

<languages/>

Nix es un gestor de paquetes y un sistema de construcción que analiza instrucciones de compilación reproducibles especificadas en el <a href="Nix_(language)" class="wikilink" title="lenguaje de expresiones de Nix">lenguaje de expresiones de Nix</a>, un lenguaje funcional puro con evaluación diferida.  
Las expresiones de Nix son funciones puras[^1] que toman las dependencias como argumentos y producen una *<a href="Derivations" class="wikilink" title="derivación">derivación</a>* que especifica un entorno de construcción reproducible para el paquete.  
Nix almacena los resultados de la construcción en direcciones únicas especificadas mediante un hash del árbol completo de dependencias, creando un almacén de paquetes inmutable (también conocido como <a href="#Nix_store" class="wikilink" title="Nix store">Nix store</a>) que permite actualizaciones atómicas, retrocesos e instalación simultánea de diferentes versiones de un paquete, eliminando prácticamente el <a href="Wikipedia:Dependency_hell" class="wikilink" title="infierno de dependencias">infierno de dependencias</a>.

<span id="Usage"></span>

## Uso

<span id="Installation"></span>

### Instalación

En <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, Nix se instala automáticamente.

En otras distribuciones Linux o en macOS, puedes instalar Nix siguiendo la sección de instalación del [manual de Nix](https://nix.dev/manual/nix/stable/installation/).

<span id="Nix_commands"></span>

### Comandos Nix

Los <a href="Nix_(command_line_utilities)" class="wikilink" title="comandos Nix">comandos Nix</a> estan documentados en el [manual de referencia de Nix](https://nix.dev/manual/nix/stable/command-ref/): comandos principales, utilidades y comandos experimentales. Previo a la version 2.0 (lanzada en Febrero del 2018) Nix utilizaba comandos diferentes.

<span id="Configuration"></span>

### Configuracion

En NixOS, Nix se puede configurar mediante la [opción `nix`](https://search.nixos.org/options?query=nix).

Una instalación standalone de Nix se configura mediante `nix.conf` (normalmente ubicado en `/etc/nix/`). Los detalles sobre las opciones disponibles se encuentran en el [manual de referencia de Nix](https://nix.dev/manual/nix/stable/command-ref/conf-file).

También puedes configurar Nix mediante <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, que gestiona entornos declarativos para un único usuario. Para la configuración a nivel de sistema, puedes utilizar [System Manager](https://github.com/numtide/system-manager) en Linux y [nix-darwin](https://github.com/nix-darwin/nix-darwin) en macOS.

<span id="Internals"></span>

## Funcionamiento interno

### Nix store

Los paquetes construidos por Nix se almacenan en el Nix store, que es de solo lectura y normalmente se encuentra en `/nix/store`. A cada paquete se le asigna una dirección única especificada por un hash criptográfico seguido del nombre y la versión del paquete, por ejemplo `/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`. Estos prefijos contienen el hash de todas las entradas utilizadas durante el proceso de construcción, incluidos los archivos fuente, el árbol completo de dependencias, las opciones del compilador, etc. Esto permite que Nix instale simultáneamente diferentes versiones del mismo paquete e incluso distintas compilaciones de una misma versión, por ejemplo variantes construidas con diferentes compiladores. Al añadir, eliminar o actualizar un paquete, nada se elimina del store; en su lugar, los enlaces simbólicos a estos paquetes se agregan, eliminan o modifican en los perfiles.

<span id="Cleaning_the_Nix_store"></span>

#### Limpiando Nix store

Para obtener información sobre la limpieza de Nix store, consulta .

<span id="Nix_store_corruption"></span>

#### Corrupción de datos en Nix store

Para obtener información sobre cómo reparar un Nix store corrupto, consulta .

<span id="Valid_Nix_store_names"></span>

#### Nombres válidos en Nix store

<span id="Profiles"></span>

### Perfiles

Para construir un entorno de usuario o de sistema coherente, Nix crea enlaces simbólicos desde las entradas del Nix store hacia los perfiles. Estos son la interfaz mediante la cual Nix permite realizar retrocesos (rollbacks): como el store es inmutable y se conservan versiones anteriores de los perfiles, volver a un estado anterior simplemente consiste en cambiar el enlace simbólico para que apunte a un perfil previo. Más precisamente, Nix crea enlaces simbólicos a los binarios dentro de las entradas del Nix store que representan los entornos de usuario. Estos entornos de usuario se enlazan posteriormente mediante enlaces simbólicos a perfiles con etiquetas almacenados en `/nix/var/nix/profiles`, que a su vez están enlazados simbólicamente al archivo `~/.nix-profile` del usuario.

### Sandboxing

Cuando las compilaciones en entornos aislados están habilitadas, Nix configura un entorno aislado para cada proceso de construcción. Esto se utiliza para eliminar dependencias ocultas adicionales establecidas por el entorno de compilación y mejorar la reproducibilidad. Esto incluye el acceso a la red durante la compilación, excepto mediante las funciones `fetch*`, y el acceso a archivos fuera del Nix store. Dependiendo del sistema operativo, también se bloquea el acceso a otros recursos (por ejemplo, en Linux se aísla la comunicación entre procesos).

El sanboxing está habilitado de forma predeterminada en Linux y deshabilitado de forma predeterminada en macOS. En las pull requests de [Nixpkgs](https://github.com/NixOS/nixpkgs/), se solicita a los usuarios probar las compilaciones con el sandboxing habilitado (véase `Tested using sandboxing` en la plantilla de pull requests), ya que en [compilaciones oficiales de Hydra](https://nixos.org/hydra/) también se utiliza el aislamiento.

Para habilitar el sandboxing en Nix, establece `sandbox = true` en `/etc/nix/nix.conf`. En NixOS, establece `nix.useSandbox = true;` en `configuration.nix`. La opción `nix.useSandbox` está habilitada de forma predeterminada desde NixOS 17.09.

<span id="Alternative_Interpreters"></span>

### Intérpretes alternativos

Actualmente hay un proyecto para reimplementar Nix desde cero utilizando Rust.

- [tvix](https://code.tvl.fyi/tree/tvix)

También existe un fork de Nix 2.18 impulsado por la comunidad llamado Lix, centrado en la corrección, la facilidad de uso y el crecimiento del proyecto. Aunque ha migrado algunos componentes de Nix a Rust, no está reescrito desde cero como Tvix.

- [lix](https://lix.systems/)

Puedes encontrar iniciativas anteriores en [riir-nix](https://riir-nix.github.io/)

<span id="Notes"></span>

## Notas

<references />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: Los valores no pueden cambiar durante el cálculo. Las funciones siempre producen la misma salida si su entrada no cambia.
