<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Network Simulator - ns-3 -->

This is for discrete-event network simulator [ns-3](https://www.nsnam.org/).

## Developing with ns-3

ns-3 heavily relies on way for running simulations (examples, tutorials, etc.), but we can start developing using a simple Makefile and a shell.nix. We will use [hello-simulator.cc](https://www.nsnam.org/docs/release/3.43/doxygen/d4/d87/hello-simulator_8cc_source.html) for this example.

First create a `shell.nix`, with the requirements to compile our simulation.

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
pkgs.callPackage (
  {
    mkShell,
    pkg-config,
    ns-3,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [ pkg-config ];
    buildInputs = [ ns-3 ];
  }
) { }
```

Then we can create our `Makefile`, do note the LIBS argument, which is the modules required (not all are build by default, might have to override some settings in ns-3).

``` make
CC ?= gcc
CXX ?= g++
PKG_CONFIG ?= pkg-config

DEBUG=-DNS3_LOG_ENABLE

LIBS = ns3-core

# compiler flags:
#  -g    adds debugging information to the executable file
#  -Wall turns on most, but not all, compiler warnings
CFLAGS  = -g -Wall -Wextra $(shell $(PKG_CONFIG) --cflags $(LIBS))
LDFLAGS=$(shell $(PKG_CONFIG) --libs $(LIBS))

# the build target executable:
TARGET = hello-simulator

all: $(TARGET)

$(TARGET): $(TARGET).cc
    $(CXX) $(DEBUG) $(CFLAGS) $(LDFLAGS) -o $(TARGET) $(TARGET).cc

clean:
    $(RM) $(TARGET)
```

Then just place `hello-simulator.cc` in the same directory as the other files, then run the following commands.

Please keep in mind our flag when we compile, regarding debug `NS3_LOG_ENABLE`.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
