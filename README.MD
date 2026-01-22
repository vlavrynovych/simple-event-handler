# simple-event-handler

A lightweight, framework-agnostic event handler library for both **front-end** and **back-end** JavaScript applications. Implement the pub/sub (publisher-subscriber) pattern to decouple your code and enable event-driven architecture. Works seamlessly in browsers, Node.js, and modern JavaScript frameworks like React, Vue, and Angular.

Perfect for managing application-wide events, component communication, real-time updates, and building loosely coupled, maintainable codebases.

[![Test](https://github.com/vlavrynovych/simple-event-handler/actions/workflows/test.yml/badge.svg)](https://github.com/vlavrynovych/simple-event-handler/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/vlavrynovych/simple-event-handler/badge.svg?branch=develop)](https://coveralls.io/github/vlavrynovych/simple-event-handler?branch=develop)
[![NPM Version](https://img.shields.io/npm/v/simple-event-handler.svg)](https://npmjs.org/package/simple-event-handler)
[![NPM Downloads](https://img.shields.io/npm/dm/simple-event-handler.svg)](https://npmjs.org/package/simple-event-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/simple-event-handler)](https://bundlephobia.com/package/simple-event-handler)

## Features

- 🚀 **Lightweight** - Less than 2KB minified
- 🔧 **Zero Dependencies** - No external requirements
- 💪 **TypeScript** - Full type definitions included
- 🌐 **Universal** - Works in browser and Node.js
- ⚡ **Fast** - Optimized for performance
- 🔗 **Method Chaining** - Fluent API support
- 📦 **Multiple Formats** - UMD, CommonJS, ES Module
- ✅ **100% Test Coverage** - Thoroughly tested

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](EXAMPLES.md) 📚
- [API Documentation](API.md) 📖
- [Changelog](CHANGELOG.md) 📝
- [License](#license)

## Installation

### npm

```bash
npm install simple-event-handler
```

### yarn

```bash
yarn add simple-event-handler
```

### pnpm

```bash
pnpm add simple-event-handler
```

### CDN

```html
<script src="https://unpkg.com/simple-event-handler/dist/simple-event-handler.min.js"></script>
```

## Quick Start

```javascript
import eventHandler from 'simple-event-handler';

// Subscribe to an event
eventHandler.subscribe('user:login', (user) => {
  console.log('User logged in:', user.name);
});

// Fire the event
eventHandler.fire('user:login', { name: 'John Doe' });
```

## Examples

For comprehensive usage examples including React, Vue, TypeScript, and more, see [EXAMPLES.md](EXAMPLES.md).

**Quick examples:**

```javascript
// Node.js / CommonJS
const eventHandler = require('simple-event-handler');
eventHandler.subscribe('event', (data) => console.log(data));
eventHandler.fire('event', { message: 'Hello!' });

// ES Modules / TypeScript
import eventHandler from 'simple-event-handler';
eventHandler.on('notification', (msg) => console.log(msg));
eventHandler.emit('notification', 'Hello from ESM!');

// Method chaining
eventHandler
  .subscribe('update', (data) => console.log(data))
  .fire('update', { value: 42 })
  .unsubscribeAll('update');
```

## API Documentation

For complete API reference, see [API.md](API.md).

**Quick Reference:**
- [`subscribe(events, handler, $scope?)`](API.md#subscribeevents-handler-scope) / [`on()`](API.md#onevents-handler-scope) - Register event handler(s)
- [`once(events, handler, $scope?)`](API.md#onceevents-handler-scope) - Register one-time handler
- [`fire(name, args?)`](API.md#firename-args) / [`emit()`](API.md#emitname-args) - Trigger event
- [`unsubscribe(name, handler)`](API.md#unsubscribename-handler) / [`off()`](API.md#offname-handler) - Remove specific handler
- [`unsubscribeAll(name)`](API.md#unsubscribeallname) / [`offAll()`](API.md#offallname) - Remove all handlers

## License

MIT - See [LICENSE](LICENSE) file for details.
