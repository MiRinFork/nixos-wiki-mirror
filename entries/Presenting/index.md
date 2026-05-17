<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Presenting -->

So you'd like to present Nix or NixOS to a group or organization?

Great, we have put together this page to help you get started!

We considered putting together a canned presentation, and maybe we still will but we think it's more compelling when an individual presents a message that they really own. Ideally, users will see your presentation and leave feeling excited to try NixOS.

## Purpose

Begin by considering the purpose of your presentation:

- Make it personal to you
- Why do you want to give this presentation?
- Why is giving the presentation important?

## Compelling components

Think about how you want to communicate the value or benefits of Nix:

- Telling a story
- Use the following needs-to-features framework:

1.  Situation that leads to a problem
2.  Implications of that problem, pain points
3.  How does Nix or NixOS take care of that problem

- Live demos are exciting and compelling, but also risky, so be sure to practice and have contingency plans!

Bonus idea: fold these ideas together into a single cohesive whole.

## What to focus on

When brainstorming your presentation, consider the following questions:

- What's important about Nix to you?
- What makes you excited about Nix?
- What do you usually show others when showing them Nix?
- When you're showing Nix to others, what gets them excited?
- What do they most like about Nix?

Answers to these questions could include:

- Reproducible Builds
- Managing Dependency Relationships
- Fearlessly making changes
- Constant time rollbacks
- Configuring from a single canonical location
- Being part of something big, early
- Building skills in Nix
- Learning basic semantics of system management on an as-needed basis

## Live demos

The best live demos will be the unique ones you come up with yourself, but to get you started, we have a basic set of examples:

- Vignettes in the [Examples on nixos.org.](https://nixos.org/)

## A Generic Presentation Outline

This is a quick introduction to Nix, NixOS, and the basic Nix ecosystem, suitable for explaining Nix to your local Linux user group or ACM club.

### What is Nix?

- Nix is a functional build system that is both reliable and reproducible.
- Core Features:
  - Declarative language and configuration.
  - Reproducible builds.
  - User-specific environments.

### What are Nix Packages?

- **Overview**:
  - A collection of packages managed by the Nix package manager.
  - Centralized in the Nixpkgs repository.
- Advantages:
  - Multi-user package management.
  - Ability to use multiple versions of the same software side by side.

### What is NixOS?

- Definition: A Linux distribution built on Nix and Nix Packages.
- Key Features:
  - Entire system configuration defined in a single Nix file.
  - Rollbacks for the entire system state.
  - Customizable and reproducible.

### What is Home Manager?

- Definition: A tool for managing user environments with Nix.
- Uses:
  - Manage dotfiles and user applications, declaratively.
  - Works across NixOS and other Linux distributions.
- Advantages:
  - Consistent user environments on any machine.
  - Declarative user environment for when multiple users use one machine.
  - Centralized management of personal configurations.

### What are Nix Flakes?

- Definition: A modern addition to the Nix ecosystem providing a standardized way to manage projects.
- Core Concepts:
  - Reproducible builds for projects.
  - Integration with Git repositories.
  - A clear and portable interface for Nix-based projects.
- Components:
  - \`flake.nix\` file for project definitions.
  - Specify inputs such as unstable/stable nixpkgs or home manager
  - Specify outputs like dev environments, applications, containers, and libraries.

### Summary

- Nix provides a unified way to manage packages, system configurations, and user environments.
- Tools like NixOS, Home Manager, and Flakes extend its power for system and project management.
- The ecosystem is designed for reliability, reproducibility, and flexibility.

Questions?

<a href="Category:Community" class="wikilink" title="Category:Community">Category:Community</a>
