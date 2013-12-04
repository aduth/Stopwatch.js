/*! Stopwatch.js 1.0.0 | (c) 2013 Andrew Duthie <andrew@andrewduthie.com> | MIT License */
(function() {
  var Stopwatch;

  Stopwatch = (function() {
    var previousElapsed;

    function Stopwatch() {}

    Stopwatch.prototype.tickIntervals = {};

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
        return this._updateTickIntervals();
      }
    };

    Stopwatch.prototype.pause = function() {
      var callback, intervalId, _ref;
      if (!(this.running && this.started)) {
        throw new Error('Timer must be running to pause or stop');
      }
      _ref = this.tickIntervals;
      for (intervalId in _ref) {
        callback = _ref[intervalId];
        clearInterval(intervalId);
      }
      this.running = false;
      return this.previousElapsed = this.elapsed();
    };

    Stopwatch.prototype.stop = function() {
      this.pause();
      this.tickIntervals = {};
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
        return this._startTicking(callback, resolution, startImmediate);
      } else {
        nextTick = resolution - (this.elapsed() % resolution);
        startTicking = function() {
          return _this._startTicking(callback, resolution, startImmediate);
        };
        return setTimeout(startTicking, nextTick);
      }
    };

    Stopwatch.prototype._startTicking = function(callback, resolution, startImmediate) {
      if (resolution == null) {
        resolution = 1000;
      }
      if (startImmediate == null) {
        startImmediate = false;
      }
      return this.tickIntervals[setInterval(callback, resolution)] = {
        callback: callback,
        immediate: startImmediate,
        resolution: resolution,
        startTime: new Date().valueOf()
      };
    };

    Stopwatch.prototype._updateTickIntervals = function() {
      var elapsed, intervalId, intervalIds, nextTick, startTicking, ticker, _ref, _results,
        _this = this;
      intervalIds = [];
      _ref = this.tickIntervals;
      for (intervalId in _ref) {
        ticker = _ref[intervalId];
        elapsed = new Date().valueOf() - ticker.startTime;
        nextTick = Math.abs(ticker.resolution - (elapsed % resolution));
        startTicking = function() {
          return _this._startTicking(ticker.callback, ticker.resolution, ticker.startImmediate);
        };
        setTimeout(startTicking, nextTick);
      }
      _results = [];
      for (intervalId in intervalIds) {
        _results.push(delete this.tickIntervals[intervalId]);
      }
      return _results;
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

/*
//@ sourceMappingURL=Stopwatch.js.map
*/