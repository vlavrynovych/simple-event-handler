# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-22

### Added

- ES Module build for modern bundlers
- TypeScript type definitions
- ESLint and Prettier for code quality
- GitHub Actions CI/CD pipeline
- Comprehensive examples (React, Vue, TypeScript)

### Changed

- Migrated from Karma to Vitest (100% test coverage)
- Replaced Gulp with Rollup
- Moved examples to EXAMPLES.md and API docs to API.md
- Updated all dependencies

### Fixed

- **Bug**: `unsubscribe()` now checks if handler exists before removing
- **Bug**: `once()` method now properly passes arguments to handlers
- Replaced all `==` with `===` for strict equality
- Security vulnerabilities

### Removed

- Bower, PhantomJS, Karma, Gulp, Travis CI (all deprecated)

## [1.0.0] - 2017-03-09

### Added

- Initial stable release
- Core event handler functionality
- Method chaining support
- AngularJS integration
- Browser and Node.js support

[1.1.0]: https://github.com/vlavrynovych/simple-event-handler/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vlavrynovych/simple-event-handler/releases/tag/v1.0.0
