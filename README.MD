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
- [Usage Examples](#usage-examples)
  - [Node.js / CommonJS](#nodejs--commonjs)
  - [ES Modules](#es-modules)
  - [TypeScript](#typescript)
  - [React](#react)
  - [Vue](#vue)
- [Method Chaining](#method-chaining)
- [API Documentation](API.md) 📖
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

## Usage Examples

### Node.js / CommonJS

```javascript
const eventHandler = require('simple-event-handler');

eventHandler.subscribe('data:updated', (data) => {
  console.log('Data updated:', data);
});

eventHandler.fire('data:updated', { id: 123, value: 'New Value' });
```

### ES Modules

```javascript
import eventHandler from 'simple-event-handler';

eventHandler.on('notification', (message) => {
  console.log(message);
});

eventHandler.emit('notification', 'Hello from ES modules!');
```

### TypeScript

```typescript
import eventHandler, { EventHandler } from 'simple-event-handler';

interface User {
  id: number;
  name: string;
}

// Type-safe event handling
eventHandler.subscribe<User>('user:created', (user) => {
  console.log(`User ${user.name} created with ID ${user.id}`);
});

eventHandler.fire<User>('user:created', { id: 1, name: 'Alice' });

// Create custom instance
const customHandler = new EventHandler();
customHandler.on<string>('message', (msg) => {
  console.log(msg.toUpperCase());
});
```

### React

```jsx
import { useEffect } from 'react';
import eventHandler from 'simple-event-handler';

function NotificationComponent() {
  useEffect(() => {
    const handler = (notification) => {
      console.log('Notification:', notification);
    };

    eventHandler.subscribe('notification', handler);

    // Cleanup on unmount
    return () => {
      eventHandler.unsubscribe('notification', handler);
    };
  }, []);

  const sendNotification = () => {
    eventHandler.fire('notification', { message: 'Hello from React!' });
  };

  return <button onClick={sendNotification}>Send Notification</button>;
}
```

### Vue

```vue
<template>
  <button @click="sendUpdate">Send Update</button>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import eventHandler from 'simple-event-handler';

const handleUpdate = (data) => {
  console.log('Update received:', data);
};

onMounted(() => {
  eventHandler.subscribe('data:update', handleUpdate);
});

onUnmounted(() => {
  eventHandler.unsubscribe('data:update', handleUpdate);
});

const sendUpdate = () => {
  eventHandler.fire('data:update', { timestamp: Date.now() });
};
</script>
```

## Method Chaining

All methods return `this` for fluent API chaining:

```javascript
const handler = new EventHandler();

handler
  .once('init', () => console.log('Initialized'))
  .subscribe('update', (data) => console.log(data))
  .fire('init')
  .fire('update', { value: 42 })
  .unsubscribeAll('init');
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
