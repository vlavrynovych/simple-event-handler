angular
    .module('test-app', ['angular-event-handler'])
    .controller('EventController', ['$scope', '$eventHandler', function ($scope, $eventHandler) {
        var res = false;

        $eventHandler.subscribe('test-event', function () {
            res = true;
        }, $scope);

        this.getResult = function () {
            return res;
        };

        this.setResult = function (value) {
            res = value;
        };
    }]);