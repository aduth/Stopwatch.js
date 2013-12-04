(function() {
  var timer;

  timer = beforeEach(function() {
    return timer = new Stopwatch();
  });

  describe('#start()', function() {
    var now;
    now = new Date().valueOf();
    beforeEach(function() {
      return timer.start();
    });
    it('should be properly initialized', function() {
      expect(timer.started).to.be["true"];
      expect(timer.previousElapsed).to.equal(0);
      expect(timer.running).to["true"];
      return expect(timer.startTime).to.be.a('number');
    });
    return it('should be keeping track of time', function() {
      return expect(Math.abs(timer.startTime - now)).to.be.within(0, 50);
    });
  });

  describe('#pause()', function() {
    it('should not pause if not running', function() {
      return expect(timer.pause).to["throw"](Error);
    });
    return it('should no longer be running', function() {
      timer.start();
      timer.pause();
      return expect(timer.running).to.be["false"];
    });
  });

  describe('#stop()', function() {
    it('should not stop if not running', function() {
      return expect(timer.stop).to["throw"](Error);
    });
    it('should no longer be running', function() {
      timer.start();
      timer.stop();
      return expect(timer.running).to.be["false"];
    });
    it('should no longer be started', function() {
      timer.start();
      timer.stop();
      return expect(timer.started).to.be["false"];
    });
    return it('should re-initialize when re-started', function(done) {
      var _checkExpected;
      timer.start();
      _checkExpected = function() {
        timer.stop();
        timer.start();
        expect(timer.previousElapsed).to.equal(0);
        expect(Math.abs(timer.startTime - new Date().valueOf())).to.be.within(0, 50);
        return done();
      };
      return setTimeout(_checkExpected, 51);
    });
  });

  describe('#elapsed()', function() {
    return it('should keep track of time', function(done) {
      var _checkExpected;
      timer.start();
      _checkExpected = function() {
        expect(timer.elapsed()).to.be.within(1000, 1050);
        return done();
      };
      return setTimeout(_checkExpected, 1000);
    });
  });

  describe('#onTick()', function() {
    beforeEach(function() {
      return timer = new Stopwatch();
    });
    it('should tick once a second by default', function(done) {
      timer.start();
      return timer.onTick(function() {
        expect(timer.elapsed()).to.be.within(1000, 1050);
        timer.stop();
        return done();
      });
    });
    return it('should allow multiple handlers', function(done) {
      var a, b, _checkDone;
      this.timeout(3000);
      timer.start();
      a = b = false;
      _checkDone = function() {
        if (a && b && timer.running) {
          timer.stop();
          return done();
        }
      };
      timer.onTick(function() {
        a = true;
        return _checkDone();
      });
      return timer.onTick(function() {
        b = true;
        return _checkDone();
      });
    });
  });

}).call(this);
