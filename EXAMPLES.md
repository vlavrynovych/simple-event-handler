# Usage Examples

Comprehensive examples of using simple-event-handler in different environments and frameworks.

## Table of Contents

- [Node.js / CommonJS](#nodejs--commonjs)
- [ES Modules](#es-modules)
- [TypeScript](#typescript)
- [React](#react)
- [Vue](#vue)
- [Method Chaining](#method-chaining)

---

## Node.js / CommonJS

```javascript
const eventHandler = require('simple-event-handler');

eventHandler.subscribe('data:updated', (data) => {
    console.log('Data updated:', data);
});

eventHandler.fire('data:updated', { id: 123, value: 'New Value' });
```

---

## ES Modules

```javascript
import eventHandler from 'simple-event-handler';

eventHandler.on('notification', (message) => {
    console.log(message);
});

eventHandler.emit('notification', 'Hello from ES modules!');
```

---

## TypeScript

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

---

## React

### Basic Usage with Hooks

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

### Advanced Example with State

```jsx
import { useEffect, useState } from 'react';
import eventHandler from 'simple-event-handler';

function MessageList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handler = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        eventHandler.subscribe('message:received', handler);

        return () => {
            eventHandler.unsubscribe('message:received', handler);
        };
    }, []);

    return (
        <div>
            <h2>Messages</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.text}</li>
                ))}
            </ul>
        </div>
    );
}

function MessageSender() {
    const sendMessage = () => {
        eventHandler.fire('message:received', {
            text: 'Hello!',
            timestamp: new Date().toISOString(),
        });
    };

    return <button onClick={sendMessage}>Send Message</button>;
}
```

### Custom Hook

```jsx
import { useEffect, useCallback } from 'react';
import eventHandler from 'simple-event-handler';

function useEventHandler(eventName, handler) {
    useEffect(() => {
        eventHandler.subscribe(eventName, handler);
        return () => {
            eventHandler.unsubscribe(eventName, handler);
        };
    }, [eventName, handler]);

    const fire = useCallback(
        (data) => {
            eventHandler.fire(eventName, data);
        },
        [eventName]
    );

    return fire;
}

// Usage
function App() {
    const fireUpdate = useEventHandler('app:update', (data) => {
        console.log('Update:', data);
    });

    return <button onClick={() => fireUpdate({ status: 'active' })}>Update</button>;
}
```

---

## Vue

### Composition API (Vue 3)

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

### Advanced Example with Reactive State

```vue
<template>
    <div>
        <h2>Notifications</h2>
        <ul>
            <li v-for="(notification, index) in notifications" :key="index">
                {{ notification.message }}
            </li>
        </ul>
        <button @click="sendNotification">Send Notification</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import eventHandler from 'simple-event-handler';

const notifications = ref([]);

const handleNotification = (notification) => {
    notifications.value.push(notification);
};

onMounted(() => {
    eventHandler.subscribe('notification', handleNotification);
});

onUnmounted(() => {
    eventHandler.unsubscribe('notification', handleNotification);
});

const sendNotification = () => {
    eventHandler.fire('notification', {
        message: 'Hello from Vue!',
        timestamp: new Date().toISOString(),
    });
};
</script>
```

### Options API (Vue 2/3)

```vue
<template>
    <button @click="sendUpdate">Send Update</button>
</template>

<script>
import eventHandler from 'simple-event-handler';

export default {
    data() {
        return {
            updates: [],
        };
    },
    mounted() {
        this.handleUpdate = (data) => {
            this.updates.push(data);
        };
        eventHandler.subscribe('data:update', this.handleUpdate);
    },
    beforeUnmount() {
        eventHandler.unsubscribe('data:update', this.handleUpdate);
    },
    methods: {
        sendUpdate() {
            eventHandler.fire('data:update', { timestamp: Date.now() });
        },
    },
};
</script>
```

---

## Method Chaining

All methods return `this` for fluent API chaining:

```javascript
import { EventHandler } from 'simple-event-handler';

const handler = new EventHandler();

handler
    .once('init', () => console.log('Initialized'))
    .subscribe('update', (data) => console.log(data))
    .fire('init')
    .fire('update', { value: 42 })
    .unsubscribeAll('init');
```

### Complex Chaining Example

```javascript
const handler = new EventHandler();
let result = 0;

handler
    .subscribe('add', (data) => {
        result += data.value;
    })
    .subscribe('multiply', (data) => {
        result *= data.value;
    })
    .subscribe('subtract', (data) => {
        result -= data.value;
    })
    .fire('add', { value: 10 }) // result = 10
    .fire('multiply', { value: 3 }) // result = 30
    .fire('subtract', { value: 5 }) // result = 25
    .unsubscribeAll('add')
    .unsubscribeAll('multiply')
    .unsubscribeAll('subtract');

console.log(result); // 25
```

---

## Cross-Component Communication

### React Example

```jsx
// EventBus.js
import eventHandler from 'simple-event-handler';

export const EventBus = {
    on: (event, callback) => eventHandler.subscribe(event, callback),
    off: (event, callback) => eventHandler.unsubscribe(event, callback),
    emit: (event, data) => eventHandler.fire(event, data),
};

// Component A
import { useEffect } from 'react';
import { EventBus } from './EventBus';

function ComponentA() {
    useEffect(() => {
        const handler = (data) => console.log('Received:', data);
        EventBus.on('user:login', handler);
        return () => EventBus.off('user:login', handler);
    }, []);

    return <div>Component A</div>;
}

// Component B
import { EventBus } from './EventBus';

function ComponentB() {
    const login = () => {
        EventBus.emit('user:login', { username: 'Alice' });
    };

    return <button onClick={login}>Login</button>;
}
```

---

## Node.js Server Example

```javascript
const eventHandler = require('simple-event-handler');

// Setup event handlers
eventHandler.subscribe('user:login', (user) => {
    console.log(`User ${user.name} logged in`);
    eventHandler.fire('log:info', `Login: ${user.name}`);
});

eventHandler.subscribe('user:logout', (user) => {
    console.log(`User ${user.name} logged out`);
    eventHandler.fire('log:info', `Logout: ${user.name}`);
});

eventHandler.subscribe('log:info', (message) => {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`);
});

// Simulate user actions
setTimeout(() => {
    eventHandler.fire('user:login', { name: 'Alice', id: 1 });
}, 1000);

setTimeout(() => {
    eventHandler.fire('user:logout', { name: 'Alice', id: 1 });
}, 3000);
```

---

## Best Practices

### 1. Always Cleanup Subscriptions

**React:**

```jsx
useEffect(() => {
    const handler = (data) => {
        /* ... */
    };
    eventHandler.subscribe('event', handler);
    return () => eventHandler.unsubscribe('event', handler); // Cleanup
}, []);
```

**Vue:**

```javascript
onUnmounted(() => {
    eventHandler.unsubscribe('event', handleEvent); // Cleanup
});
```

### 2. Use Specific Event Names

```javascript
// Good - descriptive namespaced events
eventHandler.fire('user:login', user);
eventHandler.fire('cart:item:added', item);

// Bad - generic names
eventHandler.fire('update', data);
eventHandler.fire('action', payload);
```

### 3. Pass Meaningful Data

```javascript
// Good - structured data with context
eventHandler.fire('order:completed', {
    orderId: 123,
    userId: 456,
    total: 99.99,
    timestamp: Date.now(),
});

// Bad - primitive values without context
eventHandler.fire('done', 123);
```

### 4. Store Handler References

```javascript
// Good - can unsubscribe later
const handler = (data) => console.log(data);
eventHandler.subscribe('event', handler);
// ... later
eventHandler.unsubscribe('event', handler);

// Bad - arrow function created inline, can't unsubscribe
eventHandler.subscribe('event', (data) => console.log(data));
// ... can't unsubscribe this specific handler
```
