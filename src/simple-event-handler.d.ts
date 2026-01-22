/**
 * Event handler callback function
 */
export type EventCallback<T = any> = (data?: T) => void;

/**
 * AngularJS scope interface (for auto-cleanup)
 */
export interface AngularScope {
  $on(event: string, callback: Function): void;
}

/**
 * Event handler library for managing pub/sub pattern
 * Supports method chaining for all operations
 */
declare class EventHandler {
  /**
   * Subscribe to an event or multiple events
   * @param events - Event name(s) to subscribe to
   * @param handler - Callback function to execute when event is fired
   * @param $scope - Optional AngularJS $scope for auto-cleanup on $destroy
   * @returns The EventHandler instance for method chaining
   * @example
   * eventHandler.subscribe('user:login', (user) => console.log(user));
   * eventHandler.subscribe(['event1', 'event2'], (data) => console.log(data));
   */
  subscribe<T = any>(
    events: string | string[],
    handler: EventCallback<T>,
    $scope?: AngularScope
  ): this;

  /**
   * Alias for subscribe
   */
  on<T = any>(
    events: string | string[],
    handler: EventCallback<T>,
    $scope?: AngularScope
  ): this;

  /**
   * Subscribe to event(s) that will fire only once and then auto-unsubscribe
   * @param events - Event name(s) to subscribe to
   * @param handler - Callback function to execute when event is fired
   * @param $scope - Optional AngularJS $scope for auto-cleanup
   * @returns The EventHandler instance for method chaining
   * @example
   * eventHandler.once('app:ready', () => console.log('App initialized'));
   */
  once<T = any>(
    events: string | string[],
    handler: EventCallback<T>,
    $scope?: AngularScope
  ): this;

  /**
   * Fire an event with optional data
   * @param name - Event name to fire
   * @param args - Data to pass to event handlers
   * @returns The EventHandler instance for method chaining
   * @example
   * eventHandler.fire('user:login', { id: 1, name: 'John' });
   */
  fire<T = any>(name: string, args?: T): this;

  /**
   * Alias for fire
   */
  emit<T = any>(name: string, args?: T): this;

  /**
   * Unsubscribe a specific handler from an event
   * @param name - Event name to unsubscribe from
   * @param handler - Handler function to remove
   * @returns The EventHandler instance for method chaining
   * @example
   * eventHandler.unsubscribe('user:login', loginHandler);
   */
  unsubscribe(name: string, handler: EventCallback): this;

  /**
   * Alias for unsubscribe
   */
  off(name: string, handler: EventCallback): this;

  /**
   * Remove all handlers for an event
   * @param name - Event name to clear all handlers from
   * @returns The EventHandler instance for method chaining
   * @example
   * eventHandler.unsubscribeAll('user:login');
   */
  unsubscribeAll(name: string): this;

  /**
   * Alias for unsubscribeAll
   */
  offAll(name: string): this;
}

/**
 * Default export - singleton instance for CommonJS/Node.js
 */
declare const eventHandler: EventHandler;
export default eventHandler;

/**
 * Named export of EventHandler class for creating custom instances
 */
export { EventHandler };

/**
 * Global window.EventHandler constructor (browser environment)
 */
declare global {
  interface Window {
    EventHandler: typeof EventHandler;
  }
}
