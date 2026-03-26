# Support

Need help with SaC Language Support for VS Code? This document lists the best ways to get assistance and report issues.

## Before You Open an Issue

Please check the following first:

- Review the extension configuration in README.md
- Confirm your `sac2c` setup and selected backend (`local`, `wsl`, or `docker`)
- Reproduce the issue with a minimal `.sac` file if possible
- Check existing GitHub issues to avoid duplicates

## Get Help

- GitHub Issues (bug reports and feature requests):
  - https://github.com/SacBase/vscode/issues
- Maintainer profile:
  - https://github.com/LuckyLuuk12

## Reporting a Bug

When opening a bug report, include:

- VS Code version
- Extension version
- Operating system
- Relevant settings from your VS Code configuration (`sac.*`)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Any relevant output/logs or screenshots

If diagnostics are involved, also include:

- How `sac2c` is resolved (`sac.compiler.path`, bundled, or system PATH)
- Selected execution backend (`local`, `wsl`, `docker`)
- The failing source snippet (minimal repro)

## Feature Requests

Feature requests are welcome. Please include:

- Problem statement
- Proposed behavior
- Alternatives you considered
- Example SaC code or workflow impacted

## Security

If you discover a security issue, please avoid public disclosure details in a regular issue. Open an issue with minimal details and request a private contact channel.

## Contributing

Development and contribution instructions are available in CONTRIBUTING.md.
