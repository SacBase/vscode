# Change Log

All notable changes to the "sac-language-support" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Added a minimal SaC language server that publishes compiler diagnostics.
- Added configurable diagnostics modes (`onSave`, `onType`, `manual`).
- Added compiler resolution strategy with `system`, `stable`, and `develop` channels.
- Added machine-readable diagnostics parsing support via configurable messaging arguments.
- Added bundled compiler folder conventions under `vendor/sac2c/`.