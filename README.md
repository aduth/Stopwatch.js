# Stopwatch.js

Stopwatch.js is a JavaScript utility that mimics the functions of a common stopwatch. Specifically, it provides mechanisms to start, pause, and stop, and allows you to execute one or more code snippets at specified time intervals.

Stopwatch.js runs in the browser and on the server using Node.js.

[Demonstration](http://www.andrewduthie.com/demo/stopwatch/)

## Installation

Download Stopwatch.js to your project or install using Bower (`bower install stopwatch`). Then, include the script either through a `<script>` tag in your document, or via RequireJS.

**Script**

```html
<script src="/path/to/libs/Stopwatch.js"></script>
```

**RequireJS**

```js
define([
  'path/to/libs/Stopwatch.js'
], function(Stopwatch) {
  var stopwatch = new Stopwatch();
});
```

## Usage

Create an instance of a Stopwatch using `new`:

```js
var timer = new Stopwatch();
```

Start a Stopwatch using the `start` function:

```js
var timer = new Stopwatch();
timer.start();
```

Pause or stop a Stopwatch using the `pause` or `stop` functions. Paused Stopwatches will maintain the previous elapsed time and will resume from that duration if restarted in the future.

```js
var timer = new Stopwatch();
timer.start();
// ... Later in your script
timer.pause(); // or timer.stop();
```

Get the current elapsed time in milliseconds using the `getElapsed` function, or as a formatted string using `toString`. Thanks to type coersion in JavaScript, you can simply concatenate a Stopwatch instance to a string to invoke the `toString` method.

```js
var timer = new Stopwatch();
var milli = timer.getElapsed();
console.log(milli + ' milliseconds have elapsed.');
console.log('The Stopwatch has been running for ' + timer);
```

Finally, you can execute code at regular intervals using the `onTick` function, passing a function as the first parameter and a delay as the second parameter (in milliseconds). Omitting the second parameter will execute your code at a frequency of once per second.

```js
var timer = new Stopwatch();
timer.onTick(function() {
  console.log('5 seconds have elapsed.');
}, 5000);
```

## Testing

Current build status is available on [Travis CI](https://travis-ci.org/aduth/Stopwatch.js).

To run enclosed unit tests locally, clone the repository and install package dependencies, then run `npm test`:

```bash
$ git clone https://github.com/aduth/correctingInterval.git
$ cd correctingInterval
$ npm install
$ npm test
```

## License

Copyright 2014 Andrew Duthie

Released freely under the MIT license (refer to LICENSE.txt).