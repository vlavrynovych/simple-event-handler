'use strict';
(function () {
    function EventHandler() {
        const subscriptions = {};

        this.subscribe = subscribe;
        this.on = subscribe;

        this.once = once;

        this.fire = fire;
        this.emit = fire;

        this.unsubscribe = unsubscribe;
        this.off = unsubscribe;

        this.unsubscribeAll = unsubscribeAll;
        this.offAll = unsubscribeAll;

        function subscribe(events, fn, $scope) {
            validateCallback(fn);

            if (events) {
                if (typeof events === 'string') {
                    validateName(events);
                    _subscribe(events, fn, $scope);
                } else if (events instanceof Array) {
                    if (!events.length) {
                        throwNameError();
                    }

                    events.forEach(validateName);
                    events.forEach(function (eventName) {
                        _subscribe(eventName, fn, $scope);
                    });
                } else {
                    throwNameError();
                }
            } else {
                throwNameError();
            }

            return this;
        }

        function _subscribe(name, fn, $scope) {
            if (!subscriptions[name]) {
                subscriptions[name] = [];
            }

            subscriptions[name].push(fn);

            $scope &&
                $scope.$on &&
                $scope.$on('$destroy', function () {
                    unsubscribe(name, fn);
                });
        }

        function once(events, fn, $scope) {
            validateCallback(fn);

            if (events) {
                if (typeof events === 'string') {
                    validateName(events);

                    const handler = function (data) {
                        unsubscribe(events, handler);
                        fn(data);
                    };
                    _subscribe(events, handler, $scope);
                } else if (events instanceof Array) {
                    if (!events.length) {
                        throwNameError();
                    }

                    events.forEach(validateName);
                    events.forEach(function (eventName) {
                        const handler = function (data) {
                            unsubscribe(eventName, handler);
                            fn(data);
                        };

                        _subscribe(eventName, handler, $scope);
                    });
                } else {
                    throwNameError();
                }
            } else {
                throwNameError();
            }

            return this;
        }

        function fire(name, args) {
            if (!subscriptions[name]) {
                return this;
            }

            subscriptions[name].forEach(function (fn) {
                fn(args !== undefined ? args : {}); // empty object can be used as a shared storage
            });

            return this;
        }

        function unsubscribe(name, fn) {
            validateName(name);
            validateCallback(fn);
            if (!subscriptions[name]) {
                return this;
            }

            const index = subscriptions[name].indexOf(fn);
            if (index !== -1) {
                subscriptions[name].splice(index, 1);
            }
            return this;
        }

        function unsubscribeAll(name) {
            validateName(name);
            if (!subscriptions[name]) {
                return this;
            }
            subscriptions[name] = [];
            return this;
        }

        function validateName(name) {
            if (!name || typeof name !== 'string') {
                throwNameError();
            }
        }

        function validateCallback(fn) {
            if (!fn || !(fn instanceof Function)) {
                throw new Error('callback function is required');
            }
        }

        function throwNameError() {
            throw new Error('event name is required');
        }
    }

    if (typeof window !== 'undefined') {
        window.EventHandler = EventHandler;

        if (window.angular) {
            angular.module('simple-event-handler', []).service('$eventHandler', EventHandler);
        }
    }

    // Export for CommonJS/Node.js (using short-circuit to avoid branch)
    typeof module !== 'undefined' && (module.exports = new EventHandler());
})();
