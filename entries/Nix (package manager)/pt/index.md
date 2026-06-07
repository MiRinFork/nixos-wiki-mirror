<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/pt -->

<languages/>

<div class="mw-translate-fuzzy">

Nix é um gerenciador de pacotes e sistema de construção que analisa instruções de construção reproduzíveis especificadas no <a href="Nix_Expression_Language" class="wikilink" title="Nix Expression Language">Nix Expression Language</a>, Uma linguagem puramente funcional com avaliação preguiçosa. Expressões Nix são funções puras. [^1]tomando dependências como argumentos e produzindo *<a href="Derivations" class="wikilink" title="derivation">derivation</a>* especificando um ambiente de construção reproduzível para o pacote. O Nix armazena os resultados da construção em endereços exclusivos especificados por um hash da árvore de dependência completa, criando um armazenamento de pacotes imutável (também conhecido como <a href="#Nix_store" class="wikilink" title="nix store">nix store</a>) que permite atualizações atômicas, reversões e instalação simultânea de diferentes versões de um pacote, eliminando essencialmente [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell).

</div>

<span id="Usage"></span>

## Uso

<span id="Installation"></span>

<div class="mw-translate-fuzzy">

### Instalação

NixOS: O Nix está sendo instalado enquanto você instala o NixOS.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

On <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, Nix is automatically installed.

</div>

<div class="mw-translate-fuzzy">

Se você pretende utilizar o Nix em uma distribuição Linux diferente ou em um computador Mac, você pode executar uma instalação autônoma: O [installation section of the Nix manual](https://nixos.org/manual/nix/stable/installation/installation) descreve a instalação do Nix autônomo a partir do binário ou do código-fonte.

</div>

<span id="Nix_commands"></span>

### Comandos Nix

<div class="mw-translate-fuzzy">

O <a href="Nix_command" class="wikilink" title="Nix commands">Nix commands</a> esta documentado em [Nix reference manual](https://nixos.org/manual/nix/stable/command-ref/command-ref): Comandos principais, utilitários e comandos experimentais. Antes da versão 2.0 (lançada em fevereiro de 2018), havia comandos diferentes.

</div>

<span id="Configuration"></span>

<div class="mw-translate-fuzzy">

### Configuração

No NixOS, o Nix é configurado através do \[<https://search.nixos.org/options?query=nix>. `nix` option\].

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

On NixOS, Nix can be configured using the [`nix` option](https://search.nixos.org/options?query=nix).

</div>

<div class="mw-translate-fuzzy">

O Nix autônomo é configurado através de `nix.conf` (geralmente encontrado em `/etc/nix/`), que define uma série de configurações relacionadas à avaliação, compilações, coleta de lixo, sandbox e permissões de usuário. Detalhes sobre as opções disponíveis estão disponíveis. Detalhes sobre as opções disponíveis são [found in the Nix reference manual](https://nixos.org/manual/nix/stable/command-ref/conf-file).

</div>

<div class="mw-translate-fuzzy">

É possível uma configuração ainda mais completa com <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> para gerenciar ambientes declarativos para um único usuário. Para configuração de todo o sistema no Linux, você pode usar System Manager. Para configuração de todo o sistema no macOS, \[nix-darwin nix-darwin\] é a solução preferida.

</div>

<span id="Internals"></span>

## Internos

### Nix store

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Packages built by Nix are placed in the read-only *Nix store*, normally found in `/nix/store`. Each package is given a unique address specified by a cryptographic hash followed by the package name and version, for example `/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`. These prefixes hash all the inputs to the build process, including the source files, the full dependency tree, compiler flags, etc. This allows Nix to simultaneously install different versions of the same package, and even different builds of the same version, for example variants built with different compilers. When adding, removing or updating a package, nothing is removed from the store; instead, symlinks to these packages are added, removed or changed in *profiles*.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Cleaning the Nix store

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For information relating to cleaning the Nix store, refer to .

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Nix store corruption

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For information relating to fixing a corrupted Nix store, refer to .

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Valid Nix store names

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<span id="Profiles"></span>

### Perfis

Para construir um ambiente de usuário ou sistema coerente, o Nix cria links simbólicos para entradas do repositório Nix em "perfis". Estes são o front-end pelo qual o Nix permite reversões: como o repositório é imutável e as versões anteriores dos perfis são mantidas, reverter para um estado anterior é simplesmente uma questão de alterar o link simbólico para um perfil anterior. Para ser mais preciso, o Nix cria links simbólicos para binários em entradas do repositório Nix que representam os ambientes do usuário. Esses ambientes do usuário são então criados por links simbólicos para perfis rotulados armazenados em `/nix/var/nix/profiles` que por sua vez são vinculados simbolicamente ao usuário `~/.nix-profile`.

### Sandboxing

<div class="mw-translate-fuzzy">

Quando as compilações em sandbox estão habilitadas, o Nix configura um ambiente isolado para cada processo de compilação. Ele é usado para remover outras dependências ocultas definidas pelo ambiente de compilação para melhorar a reprodutibilidade. Isso inclui acesso à rede durante a compilação fora das funções `fetch*` e arquivos fora do repositório Nix. Dependendo do sistema operacional, o acesso a outros recursos também é bloqueado (por exemplo, a comunicação entre processos é isolada no Linux); veja no manual do Nix para detalhes [nix.conf section](https://nixos.org/nix/manual/#sec-conf-file).

</div>

<div class="mw-translate-fuzzy">

O sandboxing é habilitado por padrão no Linux e desabilitado por padrão no macOS. Em pull requests para \[NixOS/nixpkgs/ Nixpkgs\] as pessoas são solicitadas a testar compilações com sandbox habilitado (consulte `Testado usando sandbox` no modelo de solicitação de pull) porque em [official Hydra builds](https://nixos.org/hydra/)sandboxing é usado também.

</div>

Para configurar o Nix para sandbox, defina `sandbox = true` em `/etc/nix/nix.conf`; para configurar o NixOS para sandbox defina `nix.useSandbox = true;` em `configuration.nix`. O `nix.useSandbox` option is `true` por padrão desde NixOS 17.09.

<span id="Alternative_Interpreters"></span>

### Intérpretes Alternativos

Há um esforço contínuo para reimplementar o Nix, do zero, no Rust.

<div class="mw-translate-fuzzy">

tvix

</div>

Há também uma bifurcação do Nix 2.18 liderada pela comunidade, chamada Lix, focada em correção, usabilidade e crescimento. Embora também tenha portado alguns componentes do Nix para Rust, não é uma reescrita completa como o Tvix.

<div class="mw-translate-fuzzy">

Lix

</div>

<div class="mw-translate-fuzzy">

Tentativas anteriores podem ser encontradas em github

</div>

<span id="Notes"></span>

<div class="mw-translate-fuzzy">

## Notas

<references />

</div>

<references />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: Valores não podem mudar durante a computação. Funções sempre produzem a mesma saída se sua entrada não mudar.
