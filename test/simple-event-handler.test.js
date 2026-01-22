/**
 * @fileoverview Test suite for EventHandler library
 * Tests all core functionality including subscribe, fire, unsubscribe, once,
 * method chaining, and Angular $scope integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import '../src/simple-event-handler.js';
import eventHandlerModule from '../src/simple-event-handler.js';

/**
 * Test suite for Node.js module.exports
 */
describe('Node.js module.exports', () => {
    /**
     * Tests that EventHandler is exported correctly via module.exports
     * This tests line 144: module.exports = new EventHandler();
     */
    it('should export EventHandler instance via module.exports', () => {
        // given: Import the module
        const eventHandler = eventHandlerModule;

        // then: Should have EventHandler methods
        expect(eventHandler).toBeDefined();
        expect(typeof eventHandler.subscribe).toBe('function');
        expect(typeof eventHandler.fire).toBe('function');
        expect(typeof eventHandler.unsubscribe).toBe('function');

        // Test basic functionality
        let result = false;
        const handler = () => {
            result = true;
        };

        eventHandler.subscribe('test-event', handler);
        eventHandler.fire('test-event');
        expect(result).toBe(true);

        eventHandler.unsubscribe('test-event', handler);
        result = false;
        eventHandler.fire('test-event');
        expect(result).toBe(false);
    });
});

/**
 * Main test suite for EventHandler functionality
 */
describe('EventHandler', () => {
    const EVENT_NAME = 'ev1';
    const EVENT_NAME_2 = 'ev2';
    const user = { id: 1, name: 'John' };

    let eventHandler;

    beforeEach(() => {
        // Create a fresh instance for each test
        eventHandler = new window.EventHandler();
    });

    /**
     * Basic smoke tests to verify core functionality works
     */
    describe('smoke tests', () => {
        /**
         * Tests basic subscribe/fire/unsubscribe workflow
         */
        it('subscribe, fire, and unsubscribe', () => {
            // given:
            let result = false;
            const handler = () => {
                result = true;
            };

            // when:
            eventHandler.subscribe(EVENT_NAME, handler);
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(true);

            // when:
            eventHandler.unsubscribe(EVENT_NAME, handler);
            result = false;
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(false);
        });

        /**
         * Tests that on/emit/off aliases work the same as subscribe/fire/unsubscribe
         */
        it('on, emit, and off aliases', () => {
            // given:
            let result = false;
            const handler = () => {
                result = true;
            };

            // when:
            eventHandler.on(EVENT_NAME, handler);
            eventHandler.emit(EVENT_NAME);

            // then:
            expect(result).toBe(true);

            // when:
            eventHandler.off(EVENT_NAME, handler);
            result = false;
            eventHandler.emit(EVENT_NAME);

            // then:
            expect(result).toBe(false);
        });

        /**
         * Tests that multiple handlers can be registered for the same event
         */
        it('two handlers for same event', () => {
            // given:
            let result = 0;

            eventHandler.subscribe(EVENT_NAME, () => {
                result++;
            });

            eventHandler.subscribe(EVENT_NAME, () => {
                result += 2;
            });

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(3);
        });

        /**
         * Tests that handlers execute in the order they were registered
         */
        it('two handlers: execution queue', () => {
            // given:
            let result;

            eventHandler.subscribe(EVENT_NAME, () => {
                result = 10;
            });

            eventHandler.subscribe(EVENT_NAME, () => {
                result = 20;
            });

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(20);
        });

        /**
         * Tests that different events can be handled independently
         */
        it('two different events', () => {
            // given:
            let ev1Called = false;
            let ev2Called = false;

            eventHandler.subscribe(EVENT_NAME, () => {
                ev1Called = true;
            });

            eventHandler.subscribe(EVENT_NAME_2, () => {
                ev2Called = true;
            });

            // when:
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(ev1Called).toBe(true);
            expect(ev2Called).toBe(true);
        });
    });

    /**
     * Tests for the subscribe method including validation and multi-subscribe
     */
    describe('subscribe', () => {
        /**
         * Tests that subscribe throws when called without parameters
         */
        it('without parameters', () => {
            expect(() => {
                eventHandler.subscribe();
            }).toThrow();
        });

        /**
         * Tests that subscribe throws when event name is null
         */
        it('without event name', () => {
            expect(() => {
                eventHandler.subscribe(null, () => {});
            }).toThrow();
        });

        /**
         * Tests that subscribe throws when event name is an object instead of string
         */
        it('object instead of event name', () => {
            expect(() => {
                eventHandler.subscribe(user, () => {});
            }).toThrow();
        });

        /**
         * Tests that subscribe throws when callback function is missing
         */
        it('without callback function', () => {
            expect(() => {
                eventHandler.subscribe(EVENT_NAME);
            }).toThrow();
        });

        /**
         * Tests that subscribe throws when callback is an object instead of function
         */
        it('object instead of callback function', () => {
            expect(() => {
                eventHandler.subscribe(EVENT_NAME, user);
            }).toThrow();
        });

        /**
         * Tests that subscribing to multiple events with an array works correctly
         */
        it('multi-subscribe: success', () => {
            // given:
            let result = false;
            const handler = () => {
                result = true;
            };

            // when:
            eventHandler.subscribe([EVENT_NAME, EVENT_NAME_2], handler);

            // then: default state
            expect(result).toBe(false);

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(true);

            // when: reset result and fire second event
            result = false;
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(result).toBe(true);

            // when:
            result = false;
            eventHandler.unsubscribe(EVENT_NAME, handler);
            eventHandler.unsubscribe(EVENT_NAME_2, handler);
            // and:
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(result).toBe(false);
        });

        /**
         * Tests that multi-subscribe validation catches invalid event names
         */
        it('multi-subscribe: fail', () => {
            // given:
            const handler = () => {};

            // when: incorrect name
            expect(() => {
                eventHandler.subscribe([EVENT_NAME, null], handler);
            }).toThrow();

            expect(() => {
                eventHandler.subscribe([EVENT_NAME, ''], handler);
            }).toThrow();

            expect(() => {
                eventHandler.subscribe([EVENT_NAME, 1], handler);
            }).toThrow();

            expect(() => {
                eventHandler.subscribe([EVENT_NAME, 0], handler);
            }).toThrow();

            // when: empty array
            expect(() => {
                eventHandler.subscribe([], handler);
            }).toThrow();
        });
    });

    /**
     * Tests for the once method which executes handlers only once
     */
    describe('once', () => {
        /**
         * Tests that once handlers execute only one time and then auto-unsubscribe
         */
        it('should be executed only one time', () => {
            // given:
            let result = 0;

            eventHandler.once(EVENT_NAME, () => {
                result++;
            });

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(1);

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(1);
        });

        /**
         * Tests that once handlers unsubscribe even when they throw an error
         */
        it('should unsubscribe even on fail', () => {
            // given:
            eventHandler.once(EVENT_NAME, () => {
                throw new Error('error');
            });

            // when:
            expect(() => {
                eventHandler.fire(EVENT_NAME);
            }).toThrow();

            expect(() => {
                eventHandler.fire(EVENT_NAME);
            }).not.toThrow();
        });

        it('without parameters', () => {
            expect(() => {
                eventHandler.once();
            }).toThrow();
        });

        it('without event name', () => {
            expect(() => {
                eventHandler.once(null, () => {});
            }).toThrow();
        });

        it('object instead of event name', () => {
            expect(() => {
                eventHandler.once(user, () => {});
            }).toThrow();
        });

        it('without callback function', () => {
            expect(() => {
                eventHandler.once(EVENT_NAME);
            }).toThrow();
        });

        it('object instead of callback function', () => {
            expect(() => {
                eventHandler.once(EVENT_NAME, user);
            }).toThrow();
        });

        it('multi-subscribe: success', () => {
            // given:
            let result = false;
            const handler = () => {
                result = true;
            };

            // when:
            eventHandler.once([EVENT_NAME, EVENT_NAME_2], handler);

            // then: default state
            expect(result).toBe(false);

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(true);

            // when: reset result and fire second event
            result = false;
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(result).toBe(true);

            // when:
            result = false;
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(result).toBe(false);
        });

        it('multi-subscribe: fail', () => {
            // given:
            const handler = () => {
                throw new Error('error');
            };

            // when: incorrect name
            expect(() => {
                eventHandler.once([EVENT_NAME, null], handler);
            }).toThrow();

            expect(() => {
                eventHandler.once([EVENT_NAME, ''], handler);
            }).toThrow();

            expect(() => {
                eventHandler.once([EVENT_NAME, 1], handler);
            }).toThrow();

            expect(() => {
                eventHandler.once([EVENT_NAME, 0], handler);
            }).toThrow();

            // when: empty array
            expect(() => {
                eventHandler.once([], handler);
            }).toThrow();

            eventHandler.once([EVENT_NAME, EVENT_NAME_2], handler);
            expect(() => {
                eventHandler.fire(EVENT_NAME);
            }).toThrow();

            expect(() => {
                eventHandler.fire(EVENT_NAME);
            }).not.toThrow();

            expect(() => {
                eventHandler.fire(EVENT_NAME_2);
            }).toThrow();

            expect(() => {
                eventHandler.fire(EVENT_NAME_2);
            }).not.toThrow();
        });
    });

    /**
     * Tests for Angular $scope integration and automatic cleanup
     */
    describe('$scope integration', () => {
        /**
         * Tests that handlers registered with $scope automatically unsubscribe on $destroy
         */
        it('auto subscribe and auto unsubscribe', () => {
            // given:
            let savedDestroyCallback = null;
            const $scope = {
                $on: (eventName, callback) => {
                    if (eventName === '$destroy') {
                        savedDestroyCallback = callback;
                    }
                },
            };

            expect(savedDestroyCallback).toBe(null);

            // when: subscribe with $scope
            let result = false;
            eventHandler.subscribe(
                'test-event',
                () => {
                    result = true;
                },
                $scope
            );

            // then:
            expect(result).toBe(false);
            expect(savedDestroyCallback).not.toBe(null);

            // when:
            eventHandler.fire('test-event');

            // then:
            expect(result).toBe(true);

            // when:
            const newResult = 'test';
            result = newResult;

            // then:
            expect(result).toBe(newResult);

            // when: emulating $destroy action of angular $scope
            savedDestroyCallback();
            result = false;
            eventHandler.fire('test-event');

            // then: nothing happens
            expect(result).toBe(false);
        });
    });

    /**
     * Tests for the unsubscribe method
     */
    describe('unsubscribe', () => {
        /**
         * Tests that unsubscribing from non-existent events doesn't throw errors
         */
        it('unsubscribe from event without subscriptions', () => {
            expect(() => {
                eventHandler.unsubscribe(EVENT_NAME, () => {});
            }).not.toThrow();

            expect(() => {
                eventHandler.off(EVENT_NAME, () => {});
            }).not.toThrow();
        });
    });

    /**
     * Tests for the unsubscribeAll/offAll methods
     */
    describe('unsubscribeAll / offAll', () => {
        /**
         * Tests that unsubscribeAll on non-existent events doesn't throw errors
         */
        it('unsubscribe from event without subscriptions', () => {
            expect(() => {
                eventHandler.unsubscribeAll(EVENT_NAME);
            }).not.toThrow();

            expect(() => {
                eventHandler.offAll(EVENT_NAME);
            }).not.toThrow();
        });

        /**
         * Tests that unsubscribeAll removes all handlers for an event
         */
        it('multi-subscribe and unsubscribe all', () => {
            // given:
            let result = 0;
            const handler = () => {
                result = 1;
            };
            const handler2 = () => {
                result = 2;
            };

            // when:
            eventHandler.subscribe([EVENT_NAME, EVENT_NAME_2], handler);
            eventHandler.subscribe([EVENT_NAME, EVENT_NAME_2], handler2);

            // then: default state
            expect(result).toBe(0);

            // when:
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(2);

            // when: reset result and fire second event
            result = 0;
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(result).toBe(2);

            // when:
            result = 0;
            eventHandler.unsubscribeAll(EVENT_NAME);
            eventHandler.offAll(EVENT_NAME_2);
            // and:
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME_2);

            // then:
            expect(result).toBe(0);
        });
    });

    /**
     * Tests for the fire/emit methods that trigger event handlers
     */
    describe('fire', () => {
        /**
         * Tests that firing an event multiple times executes the handler each time
         */
        it('5 times', () => {
            // given:
            let result = 0;

            eventHandler.subscribe(EVENT_NAME, () => {
                result++;
            });

            // when:
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME);
            eventHandler.fire(EVENT_NAME);

            // then:
            expect(result).toBe(5);
        });

        /**
         * Tests that numeric data is passed correctly to handlers
         */
        it('with data: number', () => {
            // given:
            let result = null;

            eventHandler.subscribe(EVENT_NAME, (data) => {
                result = data;
            });

            // when:
            eventHandler.fire(EVENT_NAME, 22);

            // then:
            expect(result).toBe(22);
        });

        /**
         * Tests that zero (falsy value) is passed correctly to handlers
         */
        it('with data: 0 number', () => {
            // given:
            let result = null;

            eventHandler.subscribe(EVENT_NAME, (data) => {
                result = data;
            });

            // when:
            eventHandler.fire(EVENT_NAME, 0);

            // then:
            expect(result).toBe(0);
        });

        /**
         * Tests that empty string (falsy value) is passed correctly to handlers
         */
        it('with data: empty string', () => {
            // given:
            let result = null;

            eventHandler.subscribe(EVENT_NAME, (data) => {
                result = data;
            });

            // when:
            eventHandler.fire(EVENT_NAME, '');

            // then:
            expect(result).toBe('');
        });

        /**
         * Tests that object data is passed correctly to handlers
         */
        it('with data: object', () => {
            // given:
            let result = null;

            eventHandler.subscribe(EVENT_NAME, (data) => {
                result = data;
            });

            // when:
            eventHandler.fire(EVENT_NAME, user);

            // then:
            expect(result).toBe(user);
            expect(result.id).toBe(1);
            expect(result.name).toBe('John');
        });

        /**
         * Tests that data objects are shared between all subscribers (by reference)
         */
        it('with data: shared between subscribers', () => {
            // given:
            const data = {
                counter: 0,
            };

            eventHandler.subscribe(EVENT_NAME, (data) => {
                data.counter++;
            });

            // when:
            eventHandler.fire(EVENT_NAME, data);
            eventHandler.fire(EVENT_NAME, data);
            eventHandler.fire(EVENT_NAME, data);

            // then:
            expect(data.counter).toBe(3);
        });

        /**
         * Tests that exceptions in one handler don't prevent others from executing
         */
        it('if one of the callbacks throws the exception', () => {
            // given:
            const data = {
                counter: 0,
            };

            // when:
            eventHandler.subscribe(EVENT_NAME, (data) => {
                data.counter++;
            });

            eventHandler.subscribe(EVENT_NAME, (_data) => {
                throw new Error('something went wrong inside one of the subscribers');
            });

            // when:
            expect(() => {
                eventHandler.fire(EVENT_NAME, data);
            }).toThrow();

            // then:
            expect(data.counter).toBe(1);
        });

        /**
         * Tests that firing events with no handlers doesn't throw errors
         */
        it('if nothing to fire', () => {
            expect(() => {
                eventHandler.fire(EVENT_NAME);
            }).not.toThrow();
        });
    });

    /**
     * Tests for method chaining functionality
     */
    describe('method chaining', () => {
        /**
         * Tests that all EventHandler methods return this for method chaining
         */
        it('should support method chaining', () => {
            // given:
            let result = 0;
            const handler = (data) => {
                result = result + data;
            };

            // when:
            expect(() => {
                eventHandler
                    .once(EVENT_NAME, () => {
                        result++;
                    })
                    .fire(EVENT_NAME) // result = 1
                    .fire(EVENT_NAME) // result = 1
                    .subscribe(EVENT_NAME, handler)
                    .emit(EVENT_NAME, 10) // result = 11
                    .on(EVENT_NAME, (data) => {
                        result = result * 2 - data;
                    })
                    .fire(EVENT_NAME, 5) // result = ((11 + 5) * 2) - 5 = 27
                    .offAll(EVENT_NAME) // removes everything
                    .emit(EVENT_NAME) // no handlers to execute
                    .fire(EVENT_NAME) // no handlers to execute
                    .on(EVENT_NAME_2, handler)
                    .fire(EVENT_NAME_2, 3) // result = 27 + 3 = 30
                    .unsubscribe(EVENT_NAME_2, handler)
                    .fire(EVENT_NAME_2, 20); // no handlers to execute
            }).not.toThrow();

            // then:
            expect(result).toBe(30);
        });
    });
});
