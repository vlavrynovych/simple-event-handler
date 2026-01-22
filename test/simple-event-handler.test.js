import { describe, it, expect, beforeEach } from 'vitest';
import '../src/simple-event-handler.js';

describe('EventHandler', () => {
    const EVENT_NAME = 'ev1';
    const EVENT_NAME_2 = 'ev2';
    const user = { id: 1, name: 'John' };

    let eventHandler;

    beforeEach(() => {
        // Create a fresh instance for each test
        eventHandler = new window.EventHandler();
    });

    describe('smoke tests', () => {
        it('subscribe, fire, and unsubscribe', () => {
            // given:
            let result = false;
            const handler = () => { result = true; };

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

        it('on, emit, and off aliases', () => {
            // given:
            let result = false;
            const handler = () => { result = true; };

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

    describe('subscribe', () => {
        it('without parameters', () => {
            expect(() => {
                eventHandler.subscribe();
            }).toThrow();
        });

        it('without event name', () => {
            expect(() => {
                eventHandler.subscribe(null, () => {});
            }).toThrow();
        });

        it('object instead of event name', () => {
            expect(() => {
                eventHandler.subscribe(user, () => {});
            }).toThrow();
        });

        it('without callback function', () => {
            expect(() => {
                eventHandler.subscribe(EVENT_NAME);
            }).toThrow();
        });

        it('object instead of callback function', () => {
            expect(() => {
                eventHandler.subscribe(EVENT_NAME, user);
            }).toThrow();
        });

        it('multi-subscribe: success', () => {
            // given:
            let result = false;
            const handler = () => { result = true; };

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

        it('multi-subscribe: fail', () => {
            // given:
            let result = false;
            const handler = () => { result = true; };

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

    describe('once', () => {
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
            const handler = () => { result = true; };

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

    describe('$scope integration', () => {
        it('auto subscribe and auto unsubscribe', () => {
            // given:
            let savedDestroyCallback = null;
            const $scope = {
                $on: (eventName, callback) => {
                    if (eventName === '$destroy') {
                        savedDestroyCallback = callback;
                    }
                }
            };

            expect(savedDestroyCallback).toBe(null);

            // when: subscribe with $scope
            let result = false;
            eventHandler.subscribe('test-event', () => {
                result = true;
            }, $scope);

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

    describe('unsubscribe', () => {
        it('unsubscribe from event without subscriptions', () => {
            expect(() => {
                eventHandler.unsubscribe(EVENT_NAME, () => {});
            }).not.toThrow();

            expect(() => {
                eventHandler.off(EVENT_NAME, () => {});
            }).not.toThrow();
        });
    });

    describe('unsubscribeAll / offAll', () => {
        it('unsubscribe from event without subscriptions', () => {
            expect(() => {
                eventHandler.unsubscribeAll(EVENT_NAME);
            }).not.toThrow();

            expect(() => {
                eventHandler.offAll(EVENT_NAME);
            }).not.toThrow();
        });

        it('multi-subscribe and unsubscribe all', () => {
            // given:
            let result = 0;
            const handler = () => { result = 1; };
            const handler2 = () => { result = 2; };

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

    describe('fire', () => {
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

        it('with data: shared between subscribers', () => {
            // given:
            const data = {
                counter: 0
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

        it('if one of the callbacks throws the exception', () => {
            // given:
            const data = {
                counter: 0
            };

            // when:
            eventHandler.subscribe(EVENT_NAME, (data) => {
                data.counter++;
            });

            eventHandler.subscribe(EVENT_NAME, (data) => {
                throw new Error('something went wrong inside one of the subscribers');
            });

            // when:
            expect(() => {
                eventHandler.fire(EVENT_NAME, data);
            }).toThrow();

            // then:
            expect(data.counter).toBe(1);
        });

        it('if nothing to fire', () => {
            expect(() => {
                eventHandler.fire(EVENT_NAME);
            }).not.toThrow();
        });
    });

    describe('method chaining', () => {
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
