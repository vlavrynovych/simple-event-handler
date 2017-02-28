'use strict';
(function() {
    function EventHandler() {
        var subscriptions = {};

        this.subscribe = subscribe;
        this.fire = fire;
        this.unsubscribe = unsubscribe;

        function subscribe(eventName, fn, $scope) {
            if (!eventName) {
                console.error('event name is required');
                return;
            }

            //TODO: support of array with names to subscribe on multiple events
            _subscribe(eventName);

            function _subscribe(name) {
                if (!subscriptions[name]) {
                    subscriptions[name] = [];
                }

                subscriptions[name].push(fn);

                $scope && $scope.$on && $scope.$on('$destroy', function () {
                    unsubscribe(name, fn);
                });
            }
        }

        function fire(name, args) {
            if (!subscriptions[name]) return;

            subscriptions[name].forEach(function (fn) {
                fn(args || {}); // empty object can be used as a shared storage
            });
        }

        function unsubscribe(name, fn) {
            if (!subscriptions[name]) return true;

            subscriptions[name].splice(subscriptions[name].indexOf(fn), 1);
        }
    }

    if(angular) {
        angular.module('angular-event-handler', []).service('$eventHandler', function () {
            return new EventHandler();
        });
    }

    if(module) {
        module.exports = new EventHandler();
    }

    if(window) {
        window.EventHandler = EventHandler;
    }
})();