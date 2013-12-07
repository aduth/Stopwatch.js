/*! Stopwatch.js 1.0.0 | (c) 2013 Andrew Duthie <andrew@andrewduthie.com> | MIT License */
(function() {
  var Stopwatch;

  Stopwatch = (function() {
    var previousElapsed;

    function Stopwatch() {}

    Stopwatch.prototype.tickTimeouts = {};

    Stopwatch.prototype.started = false;

    Stopwatch.prototype.running = false;

    previousElapsed = 0;

    Stopwatch.prototype.start = function() {
      this.startTime = new Date().valueOf();
      this.running = true;
      if (!this.started) {
        this.started = true;
        return this.previousElapsed = 0;
      } else {
        return this._updateTickTimeouts();
      }
    };

    Stopwatch.prototype.pause = function() {
      var callback, timeoutId, _ref;
      if (!(this.running && this.started)) {
        throw new Error('Timer must be running to pause or stop');
      }
      _ref = this.tickTimeouts;
      for (timeoutId in _ref) {
        callback = _ref[timeoutId];
        clearTimeout(timeoutId);
      }
      this.running = false;
      return this.previousElapsed = this.elapsed();
    };

    Stopwatch.prototype.stop = function() {
      this.pause();
      this.tickTimeouts = {};
      return this.started = false;
    };

    Stopwatch.prototype.elapsed = function() {
      return new Date().valueOf() - this.startTime + this.previousElapsed;
    };

    Stopwatch.prototype.onTick = function(callback, resolution, startImmediate) {
      var nextTick, startTicking,
        _this = this;
      if (resolution == null) {
        resolution = 1000;
      }
      if (startImmediate == null) {
        startImmediate = false;
      }
      if (typeof callback !== 'function') {
        throw new TypeError('Must provide a valid callback function');
      }
      if (!(this.running && this.started)) {
        throw Error('Timer must be running to add tick callback');
      }
      if (startImmediate || this.elapsed() === 0) {
        return this._startTicking(callback, resolution, true);
      } else {
        nextTick = resolution - (this.elapsed() % resolution);
        startTicking = function() {
          return _this._startTicking(callback, resolution, startImmediate);
        };
        return setTimeout(startTicking, nextTick);
      }
    };

    Stopwatch.prototype._startTicking = function(callback, resolution, startImmediate, originalResolution) {
      var timeoutId;
      if (resolution == null) {
        resolution = 1000;
      }
      if (startImmediate == null) {
        startImmediate = false;
      }
      timeoutId = setTimeout(this._adjustingTick(callback, resolution, startImmediate, originalResolution), resolution);
      return this.tickTimeouts[timeoutId] = {
        callback: callback,
        immediate: startImmediate,
        resolution: resolution,
        startTime: new Date().valueOf()
      };
    };

    Stopwatch.prototype._adjustingTick = function(callback, resolution, startImmediate, originalResolution) {
      var intendedResolution, started,
        _this = this;
      if (resolution == null) {
        resolution = 1000;
      }
      if (startImmediate == null) {
        startImmediate = false;
      }
      started = new Date().valueOf();
      intendedResolution = originalResolution || resolution;
      return function() {
        var adjust, elapsed, target;
        callback(_this);
        if (_this.running) {
          elapsed = _this.elapsed();
          target = _this._roundToNearest(elapsed, intendedResolution);
          adjust = target - elapsed;
          return _this._startTicking(callback, intendedResolution + adjust, startImmediate, intendedResolution);
        }
      };
    };

    Stopwatch.prototype._updateTickTimeouts = function() {
      var elapsed, nextTick, startTicking, ticker, timeoutId, timeoutIds, _ref, _results,
        _this = this;
      timeoutIds = [];
      _ref = this.tickTimeouts;
      for (timeoutId in _ref) {
        ticker = _ref[timeoutId];
        elapsed = new Date().valueOf() - ticker.startTime;
        nextTick = Math.abs(ticker.resolution - (elapsed % resolution));
        startTicking = function() {
          return _this._startTicking(ticker.callback, ticker.resolution, ticker.startImmediate);
        };
        setTimeout(startTicking, nextTick);
      }
      _results = [];
      for (timeoutId in timeoutIds) {
        _results.push(delete this.tickTimeouts[timeoutId]);
      }
      return _results;
    };

    Stopwatch.prototype._roundToNearest = function(number, multiple) {
      var half;
      half = multiple / 2;
      return number + half - (number + half) % multiple;
    };

    return Stopwatch;

  })();

  this.Stopwatch = Stopwatch;

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = Stopwatch;
  }

  if (typeof define === 'function' && (define.amd != null)) {
    define('Stopwatch', function() {
      return Stopwatch;
    });
  }

}).call(this);
