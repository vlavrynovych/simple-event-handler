# API Documentation

Complete API reference for simple-event-handler.

## Table of Contents

- [subscribe(events, handler, $scope?)](#subscribeevents-handler-scope)
- [on(events, handler, $scope?)](#onevents-handler-scope)
- [once(events, handler, $scope?)](#onceevents-handler-scope)
- [fire(name, args?)](#firename-args)
- [emit(name, args?)](#emitname-args)
- [unsubscribe(name, handler)](#unsubscribename-handler)
- [off(name, handler)](#offname-handler)
- [unsubscribeAll(name)](#unsubscribeallname)
- [offAll(name)](#offallname)

---

## subscribe(events, handler, $scope?)

Registers a handler function for one or more events.

**Parameters:**
- `events` *(string | string[])* - Event name(s) to subscribe to
- `handler` *(Function)* - Callback function executed when event fires
- `$scope` *(Object, optional)* - AngularJS $scope for auto-cleanup on $destroy

**Returns:** `this` (for method chaining)

**Example:**
```javascript
// Single event
eventHandler.subscribe('user:login', (user) => {
  console.log(user);
});

// Multiple events
eventHandler.subscribe(['event1', 'event2'], (data) => {
  console.log(data);
});

// With AngularJS $scope (auto-cleanup on $destroy)
eventHandler.subscribe('update', handler, $scope);
```

---

## on(events, handler, $scope?)

Alias for [`subscribe()`](#subscribeevents-handler-scope).

**Example:**
```javascript
eventHandler.on('notification', (message) => {
  console.log(message);
});
```

---

## once(events, handler, $scope?)

Adds a one-time handler that auto-unsubscribes after first execution.

**Parameters:**
- `events` *(string | string[])* - Event name(s) to subscribe to
- `handler` *(Function)* - Callback function executed once
- `$scope` *(Object, optional)* - AngularJS $scope for auto-cleanup

**Returns:** `this`

**Example:**
```javascript
// Single use handler
eventHandler.once('app:ready', () => {
  console.log('Application initialized');
});

// Multiple events - fires once per event
eventHandler.once(['load', 'init'], () => {
  console.log('Triggered');
});
```

---

## fire(name, args?)

Synchronously calls all handlers registered for an event.

**Parameters:**
- `name` *(string)* - Event name to fire
- `args` *(any, optional)* - Data to pass to handlers (default: `{}`)

**Returns:** `this`

**Example:**
```javascript
// Fire with data
eventHandler.fire('user:login', { id: 1, name: 'John' });

// Fire without data (handlers receive {})
eventHandler.fire('ready');

// Data is shared between handlers (by reference)
const sharedData = { count: 0 };
eventHandler.fire('increment', sharedData);
```

---

## emit(name, args?)

Alias for [`fire()`](#firename-args).

**Example:**
```javascript
eventHandler.emit('message', { text: 'Hello!' });
```

---

## unsubscribe(name, handler)

Removes a specific handler from an event.

**Parameters:**
- `name` *(string)* - Event name
- `handler` *(Function)* - Handler function to remove (must be the same reference)

**Returns:** `this`

**Example:**
```javascript
const handler = (data) => console.log(data);

// Subscribe
eventHandler.subscribe('event', handler);

// Later, unsubscribe
eventHandler.unsubscribe('event', handler);
```

**Important:** You must pass the same function reference that was used to subscribe. Arrow functions and anonymous functions cannot be unsubscribed unless you store a reference to them.

---

## off(name, handler)

Alias for [`unsubscribe()`](#unsubscribename-handler).

**Example:**
```javascript
eventHandler.off('event', handler);
```

---

## unsubscribeAll(name)

Removes all handlers for an event.

**Parameters:**
- `name` *(string)* - Event name to clear

**Returns:** `this`

**Example:**
```javascript
// Add multiple handlers
eventHandler.subscribe('event', handler1);
eventHandler.subscribe('event', handler2);
eventHandler.subscribe('event', handler3);

// Remove all at once
eventHandler.unsubscribeAll('event');
```

---

## offAll(name)

Alias for [`unsubscribeAll()`](#unsubscribeallname).

**Example:**
```javascript
eventHandler.offAll('event');
```

---

## Method Chaining

All methods return `this`, enabling fluent API chaining:

```javascript
eventHandler
  .subscribe('event1', handler1)
  .once('event2', handler2)
  .fire('event1', { data: 'value' })
  .unsubscribe('event1', handler1)
  .offAll('event2');
```

---

## TypeScript Support

All methods support generic types for type-safe event data:

```typescript
import eventHandler from 'simple-event-handler';

interface User {
  id: number;
  name: string;
}

// Type-safe subscription
eventHandler.subscribe<User>('user:login', (user) => {
  // user is typed as User
  console.log(user.name);
});

// Type-safe firing
eventHandler.fire<User>('user:login', { id: 1, name: 'Alice' });
```

---

## Notes

- **Event names**: Can be any non-empty string. Common convention is to use colon-separated namespaces (e.g., `'user:login'`, `'data:update'`)
- **Execution order**: Handlers execute in the order they were registered
- **Error handling**: If a handler throws an error, subsequent handlers will not execute
- **Data sharing**: Event data is passed by reference, allowing handlers to mutate shared state
- **AngularJS integration**: Pass `$scope` as the third parameter for automatic cleanup when scope is destroyed
