/**
 * TypeScript type definition test file
 * This file tests that all type definitions work correctly
 * Run: npx tsc test-types.ts --noEmit
 */

import eventHandler, { EventHandler, EventCallback } from './src/simple-event-handler';

// Test 1: Singleton usage with typed data
eventHandler.subscribe<string>('message', (data) => {
  if (data) {
    console.log(data.toUpperCase());
  }
});

eventHandler.fire('message', 'hello typescript');

// Test 2: Create custom EventHandler instance
const customHandler = new EventHandler();

// Test 3: Typed event data
interface User {
  id: number;
  name: string;
  email?: string;
}

customHandler.on<User>('user:login', (user) => {
  if (user) {
    console.log(user.id, user.name);
    // Type safety - email is optional
    if (user.email) {
      console.log(user.email);
    }
  }
});

customHandler.emit('user:login', { id: 1, name: 'John', email: 'john@example.com' });

// Test 4: Method chaining
customHandler
  .subscribe('event1', () => console.log('event1'))
  .once('event2', () => console.log('event2'))
  .fire('event1')
  .fire('event2')
  .off('event1', () => {})
  .offAll('event2');

// Test 5: Multiple event subscription
const multiHandler: EventCallback<string> = (data) => {
  if (data) console.log(data);
};

customHandler.on(['event1', 'event2', 'event3'], multiHandler);

// Test 6: Unsubscribe
customHandler.unsubscribe('event1', multiHandler);
customHandler.unsubscribeAll('event2');

// Test 7: once with auto-unsubscribe
customHandler.once<{ count: number }>('init', (data) => {
  if (data) {
    console.log('Initialized with count:', data.count);
  }
});

// Test 8: Fire without data
customHandler.fire('no-data-event');

// Test 9: AngularJS $scope integration (optional parameter)
const mockScope = {
  $on: (event: string, callback: Function) => {
    console.log('Angular scope:', event);
  }
};

customHandler.subscribe('angular-event', () => {
  console.log('Angular handler');
}, mockScope);

// Test 10: Generic type inference
eventHandler.on('inferred', (data) => {
  // data is inferred as 'any' without explicit type
  console.log(data);
});

// Test 11: Array of events
const events = ['start', 'stop', 'restart'];
customHandler.subscribe(events, () => {
  console.log('Multi-event handler');
});

// Test 12: Complex nested data types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

customHandler.on<ApiResponse<User>>('api:response', (response) => {
  if (response && response.success) {
    console.log(response.data.name);
  } else if (response && response.error) {
    console.error(response.error);
  }
});

// Test 13: Aliases
customHandler.on('alias-test', () => {}); // alias for subscribe
customHandler.emit('alias-test'); // alias for fire
customHandler.off('alias-test', () => {}); // alias for unsubscribe
customHandler.offAll('alias-test'); // alias for unsubscribeAll

console.log('All type definitions verified!');
