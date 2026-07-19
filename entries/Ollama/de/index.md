<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ollama/de -->

[Ollama](https://ollama.ai) ist ein Open-Source Framework, entwickelt um die Nutzung und Bereitstellung von Large Language Models (LLMs) in einer lokalen Umgebung zu ermöglichen. Es zielt darauf ab, die Komplexität beim Ausführen und Verwalten dieser Modelle zu reduzieren, und bietet eine nahtlose Erfahrung für Nutzer auf verschiedensten Betriebssystemen.

## Einrichtung

Ollama kann auf zwei Wege in deine Systemkonfiguration integriert werden.

Als eigenständiges Paket:

``` nix
environment.systemPackages = [ pkgs.ollama ];
```

Oder als systemd-Dienst:

``` nix
services.ollama = {
  enable = true;
  # Optional: Modelle vorladen, siehe https://ollama.com/library
  loadModels = [ "llama3.2:3b" "deepseek-r1:1.5b"];
};
```

## Konfiguration für GPU-Beschleunigung

Die GPU-Beschleunigung wird mit der Auswahl eines zugehörigen Paketes konfiguriert:

- ollama-cpu: GPU deaktiviert, nur CPU wird genutzt
- ollama-rocm: unterstützt die meisten modernen AMD-GPUs
- ollama-cuda: unterstützt die meisten modernen NVIDIA-GPUs
- ollama-vulkan: unterstützt die meisten modernen GPUs unter Linux

**Hinweis:** Bei der Verwendung des ollama-cuda Paketes, solltest du in Betracht ziehen, den [CUDA Substitute Binary Cache](https://cache.nixos-cuda.org/) hinzuzufügen, da das Kompilieren von CUDA aus dem Quellcode sehr lange dauern kann. (Siehe den <a href="CUDA" class="wikilink" title="CUDA">CUDA</a> Wiki Eintrag für weitere Informationen)

Beispiel: GPU-Beschleunigung für NVIDIA-Grafikkarten aktivieren

Als eigenständiges Paket:

``` nix
environment.systemPackages = [
   (pkgs.ollama.override { 
      acceleration = "cuda";
    })
  ];
```

Oder als systemd-Dienst:

``` nix
services.ollama = {
  enable = true;
  package = pkgs.ollama-cuda;
};
```

Um herauszufinden, ob ein Modell auf deiner CPU, oder der GPU läuft, kannst du entweder die Logs von

``` bash
$ ollama serve 
```

abrufen, und nach "looking for compatible GPUs" oder "new model will fit in available VRAM in single GPU, loading" durchsuchen

oder während ein Modell aktiv läuft, und in einem Terminal antwortet, folgenden Befehl in einem separaten Terminal ausführen

``` bash
$ ollama ps
NAME         ID              SIZE      PROCESSOR    UNTIL
gemma3:4b    c0494fe00251    4.7 GB    100% GPU     4 minutes from now
```

In diesem Beispiel siehst du "100% GPU".

## Nutzung über die Kommandozeile (CLI)

### Modell herunterladen und eine interaktive Prompt starten

Beispiel: Lade ein Mistral Modell herunter, und starte die interaktive Nutzung

``` bash
$ ollama run mistral
```

Für weitere Modelle, siehe die [Ollama Bibliothek](https://ollama.ai/library).

### Prompt an Ollama senden

Beispiel: Codellama (13B, instruct-Variante) herunterladen, und eine Prompt senden:

``` bash
$ ollama run codellama:13b-instruct "Schreibe ein erweitertes Python Programm in einer üblichen Struktur. Dieses Programm soll die Nummern 1 bis 10 in die Standardausgabe schreiben.Write an extended Python program with a typical structure."
```

### Nutzungs- und Geschwindigkeitsstatistiken einsehen

Füge die Flag/Option "--verbose" zu deinem Ollama Befehl hinzu, um die Statistiken nach jeder Prompt zu sehen:

``` bash
$ ollama run codellama:13b-instruct --verbose "Schreibe ein erweitertes Python Programm..."
...
total duration:       50.302071991s
load duration:        50.912267ms
prompt eval count:    49 token(s)
prompt eval duration: 4.654s
prompt eval rate:     10.53 tokens/s <- wie schnell es deinen eingegebenen Prompt verarbeitet hat
eval count:           182 token(s)
eval duration:        45.595s
eval rate:            3.99 tokens/s  <- wie schnell es eine Antwort gesendet hat
```

## Nutzung über die Web-API

Andere Programme können die Web-API (standardmäßig unter: <http://localhost:11434>) nutzen, um Ollama zu nutzen und abzufragen. Dies funktioniert beispielsweise gut in der Intellij Entwicklungsumgebung (IDE), mit den "ProxyAI" und "Ollama Commit Summarizer" Erweiterungen.

Alternativ kannst du auch den "open-webui" Dienst aktivieren, das ein Web-Portal unter <http://localhost:8080/> bereitstellt:

`services.open-webui.enable = true;`

## Fehlersuche

### AMD Grafikkarte mit Open-Source-Treibern

Verwende das ollama-rocm Nix-Paket:

``` nix
environment.systemPackages = [ pkgs.ollama-rocm ];
```

Und stelle sicher, dass der Kernel den amdgpu Treiber lädt:

``` nix
  boot.initrd.kernelModules = [ "amdgpu" ];
```

In manchen Fällen erlaubt Ollama allerdings die GPU-Beschleunigung nicht, wenn es sich nicht sicher über die Kompatibilität von Grafikkarte (GPU) und Treiber ist.

Allerdings kannst du jedoch versuchen, die GPU-Nutzung zu erzwingen, indem du das LLVM-Target überschreibst. [^1]

So findest du die für dich richtige Version für deine Grafikkarte über die Logs für klassische NixOS Konfigurationen und Nix Flakes heraus:

``` bash
# Klassisch
$ nix-shell -p "rocmPackages.rocminfo" --run "rocminfo" | grep "gfx"
Name:                    gfx1031

# Flakes
$ nix run nixpkgs#"rocmPackages.rocminfo" -- --run "rocminfo" | grep "gfx"
Name:                    gfx1031
```

In diesem Beispiel heißt das richtige LLVM-Target "gfx1031", was Version "10.3.1" entspricht. Du kannst diesen Ollama Wert dann wie folgt für den systemd-Dienst überschreiben:

``` nix
services.ollama = {
  enable = true;
  package = pkgs.ollama-rocm;
  environmentVariables = {
    HCC_AMDGPU_TARGET = "gfx1031"; # war eine Zeit lang nötig, doch scheinbar nun nicht mehr
  };
  # resultiert in der Umgebungsvariable "HSA_OVERRIDE_GFX_VERSION=10.3.0"
  rocmOverrideGfx = "10.3.0";
};
```

Oder mit einer Umgebungsvariable direkt vor dem Standalone-Aufruf:

``` bash
HSA_OVERRIDE_GFX_VERSION=10.3.0 ollama serve
```

Bei weiteren Fehlern kannst du versuchen, ähnliche Werte auszuprobieren, welche du [hier](https://github.com/ollama/ollama/blob/main/docs/gpu.md#overrides) finden kannst.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a>

[^1]: <https://github.com/ollama/ollama/blob/main/docs/gpu.mdx#overrides-on-linux>
