/**
 * @fileoverview Test suite for bug fixes
 * Tests specific bugs that were fixed in the codebase
 */

import { describe, it, expect, afterEach } from 'vitest';
import eventHandler from '../src/simple-event-handler.js';

describe('Bug Fixes', () => {
    const EVENT_NAME = 'bugfix-test-event';
    const EVENT_NAME_2 = 'bugfix-test-event-2';

    // Clean up after each test
    afterEach(() => {
        eventHandler.unsubscribeAll(EVENT_NAME);
        eventHandler.unsubscribeAll(EVENT_NAME_2);
    });

    /**
     * Tests that unsubscribe doesn't fail or remove wrong handler when handler not found
     * Bug: indexOf returns -1 when handler not found, splice(-1, 1) removes last element
     * Fix: Check if index !== -1 before splicing
     */
    it('unsubscribe should not fail when handler not found', () => {
        const handler1 = () => {};
        const handler2 = () => {};
        const handler3 = () => {};

        eventHandler.subscribe(EVENT_NAME, handler1);
        eventHandler.subscribe(EVENT_NAME, handler3);

        // Should not throw or remove wrong handler
        expect(() => {
            eventHandler.unsubscribe(EVENT_NAME, handler2); // handler2 was never subscribed
        }).not.toThrow();

        // handler1 and handler3 should still be there
        let callCount = 0;
        eventHandler.subscribe(EVENT_NAME, () => {
            callCount++;
        });
        eventHandler.fire(EVENT_NAME);
        // handler1, handler3, and our test handler = 3 calls
        expect(callCount).toBe(1);
    });

    /**
     * Tests that once passes arguments to the handler
     * Bug: once() handler calls fn() without passing data
     * Fix: once() handler calls fn(data) to pass arguments
     */
    it('once should pass arguments to handler', () => {
        let receivedData = null;

        eventHandler.once(EVENT_NAME, (data) => {
            receivedData = data;
        });

        eventHandler.fire(EVENT_NAME, { value: 42 });

        expect(receivedData).toEqual({ value: 42 });
    });

    /**
     * Tests that once with multiple events passes arguments correctly
     */
    it('once with multiple events should pass arguments', () => {
        let callCount = 0;
        let lastValue = null;

        eventHandler.once([EVENT_NAME, EVENT_NAME_2], (data) => {
            callCount++;
            lastValue = data?.value;
        });

        eventHandler.fire(EVENT_NAME, { value: 1 });
        expect(callCount).toBe(1);
        expect(lastValue).toBe(1);

        eventHandler.fire(EVENT_NAME_2, { value: 2 });
        expect(callCount).toBe(2);
        expect(lastValue).toBe(2);

        // Should not fire again
        eventHandler.fire(EVENT_NAME, { value: 3 });
        eventHandler.fire(EVENT_NAME_2, { value: 4 });
        expect(callCount).toBe(2);
        expect(lastValue).toBe(2);
    });
});
