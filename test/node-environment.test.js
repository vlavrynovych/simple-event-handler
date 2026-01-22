/**
 * @fileoverview Test suite for Node.js environment (no window, only module)
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest';

describe('Node.js module.exports', () => {
    /**
     * Tests that EventHandler is exported via module.exports in Node.js environment
     */
    it('should export EventHandler via module.exports when no window exists', async () => {
        // In pure Node environment (no happy-dom), window should be undefined
        // This will test the module.exports branch (line 144) when window is undefined (line 136 false branch)

        // Dynamic import to ensure it loads in this test's environment
        const eventHandlerModule = await import('../src/simple-event-handler.js');

        // In Node.js without happy-dom, the module exports a singleton instance
        // We can access it through the default export or require
        const { default: eventHandler } = eventHandlerModule;

        // Verify it's the EventHandler instance
        expect(eventHandler).toBeDefined();
        expect(typeof eventHandler.subscribe).toBe('function');
        expect(typeof eventHandler.fire).toBe('function');
        expect(typeof eventHandler.unsubscribe).toBe('function');

        // Test basic functionality
        let result = false;
        const handler = () => { result = true; };

        eventHandler.subscribe('test-event', handler);
        eventHandler.fire('test-event');

        expect(result).toBe(true);

        eventHandler.unsubscribe('test-event', handler);
        result = false;
        eventHandler.fire('test-event');

        expect(result).toBe(false);
    });
});
