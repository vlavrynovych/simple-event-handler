# simple-event-handler

[![GitHub issues](https://img.shields.io/github/issues/vlavrynovych/simple-event-handler.svg)](https://github.com/vlavrynovych/simple-event-handler/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/vlavrynovych/simple-event-handler/develop/LICENSE)
[![NPM Version][npm-image]][npm-url]
[![Bower](https://img.shields.io/bower/v/simple-event-handler.svg)]()
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/vlavrynovych/simple-event-handler.svg?branch=master)](https://travis-ci.org/vlavrynovych/simple-event-handler)

[![NPM](https://nodei.co/npm/simple-event-handler.png?downloads=true)](https://nodei.co/npm/simple-event-handler/)

[npm-image]: https://img.shields.io/npm/v/simple-event-handler.svg?style=flat
[npm-url]: https://npmjs.org/package/simple-event-handler
[downloads-image]: https://img.shields.io/npm/dm/simple-event-handler.svg?style=flat
[downloads-url]: https://npmjs.org/package/simple-event-handler

Event handler library for both: **front-end** and **back-end**

# Table of Contents
- [Installation](#installation)
    - [Bower](#bower)
    - [npm](#npm)
- [Examples](#examples)
- [Documentation](#documentation)
    - [#subscribe(eventName, handler, $scope)](#subscribe)
    - [#fire(eventName, args)](#fire)
    - [#unsubscribe(eventName, handler)](#unsubscribe)
    - [#once(eventName, handler, $scope)](#once)
    - [#on(eventName, handler)](#on)
    - [#emit(eventName)](#emit)
    - [#off(eventName, handler)](#off)

- [License](#license)

# Installation
Include File

```html
<script type="text/javascript" src=".../js/simple-event-handler.min.js"></script>
```


Add simple-event-handler in your angular app to your module.

```js
angular.module('app', ['simple-event-handler']);
```

## Bower
Install via [Bower](https://bower.io/)

`bower install --save simple-event-handler`

## npm
Install via [npm](https://www.npmjs.com/)

`npm install --save simple-event-handler`

# Examples

###### AngularJS Example

**app.run.js**

```js
angular
    .module('app', ['simple-event-handler'])
    .run(['$eventHandler', function ($eventHandler) {
        $eventHandler.subscribe('my-event', function(data) {
            // your logic here
        })
    }]);
```

**app.controller.js**

```js
angular
    .module('app')
    .controller('MainController', ['$eventHandler', function ($eventHandler) {
        var args = {name: 'some name'}
        $eventHandler.fire('my-event', args);
    }]);
```

###### Node.js Example

```js
var eventHandler = require('simple-event-handler');

eventHandler.subscribe('my-event', function(data) {
    // your logic here
})

...

var args = {name: 'some name'}
eventHandler.fire('my-event', args);
```

###### Basic Example

```js
var eventHandler = new EventHandler();

eventHandler.subscribe('my-event', function(data) {
    // your logic here
})

...

var args = {name: 'some name'}
eventHandler.fire('my-event', args);
```

# Documentation

## subscribe

Registers new handler function to subscription list for the event named `eventName`.
The handler will be added to the end of the subscription list.

**Params**

| Name | Type | Description |
|:-----|:----:|:-----|
| eventName | `String|Array<String>` | String or array of strings with event name(s) |
| handler | `Function` | Function with your logic which will be called once event(s) is fired |
| $scope | `Object` | AngularJS $scope object |

Handler function has one input parameter with data object which can be passed via [#fire(eventName, handler)](#fire) method

###### Example

**Basic subscription**

```js
eventHandler.subscribe('my-event', function(data) {
    // your logic here
})
```

**Multi-subscription**

```js
var events = ['ev1', 'ev2', 'custom-event', 'service:update'];

eventHandler.subscribe(events, function(data) {
    // your logic here
})
```


## fire

Synchronously calls each of the handlers registered for the event named `eventName`,
in the order they were registered, passing the supplied arguments to each,
empty object will be passed instead if nothing provided

| Name | Type | Description |
|:-----|:----:|:-----|
| eventName | `String` | Event name to fire |
| args | `*` | args that will be passed to each handler function. Can be used as shared resource if it is not a primitive value. Default: `{}` |

###### Example

```js
eventHandler.subscribe('report:update', function(data) {
    // your logic here
    console.log(data.id); // --> 44
})

var report = {
    id: 44,
    title: 'Cost Report',
    isPrivate: false,
    storeInDB: false
};

eventHandler.fire('report:update', report);
```

## unsubscribe

Removes registered handler function from subscription list

| Name | Type | Description |
|:-----|:----:|:-----|
| eventName | `String` | Event name on which handler was subscribed |
| handler | `Function` | Handler function which should be removed from subscription list |

###### Example

```js
var handler = function(data) {
  // your logic here
}

eventHandler.subscribe('my-event', handler);

eventHandler.fire('my-event');

eventHandler.unsubscribe('my-event', handler)
```

## once

Adds a one time handler function for the event named `eventName`.
Handler will be removed from subscription list after first execution

**Params**

| Name | Type | Description |
|:-----|:----:|:-----|
| eventName | `String|Array<String>` | String or array of strings with event name(s) |
| handler | `Function` | Function with your logic which will be called once event(s) is fired |
| $scope | `Object` | AngularJS $scope object |

Handler function has one input parameter with data object which can be passed via [#fire(eventName, handler)](#fire) method

###### Example

**Basic subscription**

```js
eventHandler.once('my-event', function(data) {
    // your logic here
})
```

**Multi-subscription**

```js
var events = ['ev1', 'ev2', 'custom-event', 'service:update'];

eventHandler.once(events, function(data) {
    // your logic here
})
```

## on

Alias for [#subscribe(eventName, handler)](#subscribe)

## emit

Alias for [#fire(eventName, args)](#fire)

## off

Alias for [#unsubscribe(eventName, handler)](#unsubscribe)

# License

MIT License

Copyright (c) 2017 Volodymyr Lavrynovych

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
