'use strict';
(function() {
    function EventHandler() {
        var subscriptions = {};

        this.subscribe = subscribe;
        this.on = subscribe;

        this.fire = fire;
        this.emit = fire;

        this.unsubscribe = unsubscribe;
        this.off = unsubscribe;

        this.once = once;

        function subscribe(events, fn, $scope) {
            validateCallback(fn);

            if(events) {
                if(typeof events == 'string') {
                    validateName(events);
                    _subscribe(events, fn, $scope);
                } else if(events instanceof Array) {
                    if(!events.length) {
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
        }

        function _subscribe(name, fn, $scope) {
            if (!subscriptions[name]) {
                subscriptions[name] = [];
            }

            subscriptions[name].push(fn);

            $scope && $scope.$on && $scope.$on('$destroy', function () {
                unsubscribe(name, fn);
            });
        }

        function once(events, fn, $scope) {
            validateCallback(fn);

            if(events) {
                if(typeof events == 'string') {
                    validateName(events);

                    var handler = function () {
                        fn();
                        unsubscribe(events, handler);
                    };
                    _subscribe(events, handler, $scope);
                } else if(events instanceof Array) {
                    if(!events.length) {
                        throwNameError();
                    }

                    events.forEach(validateName);
                    events.forEach(function (eventName) {
                        var handler = function () {
                            fn();
                            unsubscribe(eventName, handler);
                        };

                        _subscribe(eventName, handler, $scope);
                    });
                } else {
                    throwNameError();
                }
            } else {
                throwNameError();
            }
        }

        function fire(name, args) {
            if (!subscriptions[name]) return;

            subscriptions[name].forEach(function (fn) {
                fn(args != undefined ? args : {}); // empty object can be used as a shared storage
            });
        }

        function unsubscribe(name, fn) {
            validateName(name);
            validateCallback(fn);
            if (!subscriptions[name]) return true;
            subscriptions[name].splice(subscriptions[name].indexOf(fn), 1);
        }
        
        function validateName(name) {
            if (!name || typeof name != 'string') {
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

    if(typeof window != "undefined") {
        window.EventHandler = EventHandler;

        if(window.angular) {
            angular.module('simple-event-handler', []).service('$eventHandler', EventHandler);
        }
    }

    if(typeof module != "undefined") {
        module.exports = new EventHandler();
    }
})();