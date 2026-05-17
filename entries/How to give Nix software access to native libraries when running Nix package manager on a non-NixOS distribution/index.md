<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: How to give Nix software access to native libraries when running Nix package manager on a non-NixOS distribution -->

**This page is currently work-in-progress, this is a draft of what is to come.**

When running the Nix package manager on a Linux distribution that isn't NixOS, you may want to run software installed through the Nix package manager that requires using you Linux distribution's installed libraries in order to function properly on your system.

A commonly required native distribution library is a custom LibGL library packaged with Nvidia's proprietary GPU drivers which is required in order for 3D applications to work with these drivers. Example errors:

`error while loading shared libraries: libGL.so.1: cannot open shared object file: No such file or directory`

    libGL error: unable to load driver: i965_dri.so
    libGL error: driver pointer missing 
    libGL error: failed to load driver: i965 
    libGL error: unable to load driver: i965_dri.so
    libGL error: driver pointer missing 
    libGL error: failed to load driver: i965
    libGL error: unable to load driver: swrast_dri.so
    libGL error: failed to load driver: swrast [glfw error 65543]: 
    GLX: Failed to create context: GLXBadFBConfig Failed to create a window a

To solve this, we make a copy of these needed native system libraries, patch them to look for any libraries \*they\* need in the distribution's native libraries (I assume Nix software then learns to delegate library search locations to the libs), and finally we tell the Nix-packaged software to look for their needed libraries in this folder containing our native libraries (which have in turn been patched to look for their own dependencies in our native distribution's library path).

Solution: <https://github.com/NixOS/nixpkgs/issues/9415#issuecomment-139655485>
