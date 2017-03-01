var eventHandler = require('../src/event-handler');
var assert = require('assert');

/**
 * Event handler is fully covered in the angular.test.js
 * Here is just a smoke test that event handler is available for importing in the node.js apps
 */
describe('test node.js module', function () {
    it('smoke test', function () {
        //given:
        var result = false;
        var eventName = 'event';
        var handler = function () { result = true; };

        //when:
        eventHandler.subscribe(eventName, handler);
        eventHandler.fire(eventName);

        //then:
        assert.equal(result, true);

        //when:
        eventHandler.unsubscribe(eventName, handler);
        result = false;
        eventHandler.fire(eventName);

        //then:
        assert.equal(result, false);
    });
});