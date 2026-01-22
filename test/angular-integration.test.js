/**
 * @fileoverview Test suite for Angular integration
 * This file must set up Angular BEFORE importing the source to test line 140
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';

describe('Angular integration', () => {
    /**
     * Tests that the Angular module is registered when Angular is present
     */
    it('should register Angular module when angular is available', async () => {
        // given: Mock Angular BEFORE importing source
        const mockModule = {
            service: vi.fn().mockReturnThis()
        };

        window.angular = {
            module: vi.fn().mockReturnValue(mockModule)
        };

        // when: Import the source (this will execute the IIFE)
        await import('../src/simple-event-handler.js');

        // then: Verify Angular module was registered
        expect(window.angular.module).toHaveBeenCalledWith('simple-event-handler', []);
        expect(mockModule.service).toHaveBeenCalledWith('$eventHandler', expect.any(Function));
    });
});
