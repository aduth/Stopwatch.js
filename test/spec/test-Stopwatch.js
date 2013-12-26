(function() {
  describe('Stopwatch', function() {
    it('should be cross-platform', function() {
      expect(new Stopwatch).to.be.instanceOf(Stopwatch);
      expect(new module.exports).to.be.instanceOf(Stopwatch);
      return expect(defined).to.contain('Stopwatch');
    });
    describe('#start()', function() {
      var now, timer;
      now = timer = beforeEach(function() {
        timer = new Stopwatch();
        now = new Date().valueOf();
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
      var timer;
      timer = beforeEach(function() {
        return timer = new Stopwatch();
      });
      it('should no longer be running', function() {
        timer.start();
        timer.pause();
        return expect(timer.running).to.be["false"];
      });
      it('should not reset elapsed', function(done) {
        var _verify;
        timer.start();
        _verify = function() {
          timer.pause();
          expect(timer.getElapsed()).to.be.above(0);
          return done();
        };
        return setTimeout(_verify, 100);
      });
      return it('should resume at previously paused elapsed time', function(done) {
        var elapsed, _pause, _verify;
        timer.start();
        elapsed = 0;
        _pause = function() {
          timer.pause();
          return elapsed = timer.getElapsed();
        };
        _verify = function() {
          timer.start();
          expect(timer.getElapsed() - elapsed).to.be.within(0, 50);
          return done();
        };
        setTimeout(_pause, 150);
        return setTimeout(_verify, 350);
      });
    });
    describe('#stop()', function() {
      it('should no longer be running', function() {
        var timer;
        timer = new Stopwatch();
        timer.start();
        timer.stop();
        return expect(timer.running).to.be["false"];
      });
      it('should no longer be started', function() {
        var timer;
        timer = new Stopwatch();
        timer.start();
        timer.stop();
        return expect(timer.started).to.be["false"];
      });
      it('should re-initialize when re-started', function(done) {
        var timer, _checkExpected;
        timer = new Stopwatch();
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
      it('should reset elapsed', function(done) {
        var timer, _verify;
        timer = new Stopwatch();
        timer.start();
        _verify = function() {
          timer.stop();
          expect(timer.getElapsed()).to.equal(0);
          return done();
        };
        return setTimeout(_verify, 100);
      });
      return it('should be permitted during a pause', function(done) {
        var timer, _verify;
        timer = new Stopwatch();
        timer.start();
        _verify = function() {
          timer.pause();
          timer.stop();
          expect(timer.getElapsed()).to.equal(0);
          return done();
        };
        return setTimeout(_verify, 100);
      });
    });
    describe('#getElapsed()', function() {
      return it('should keep track of time', function(done) {
        var timer, _checkExpected;
        timer = new Stopwatch();
        timer.start();
        _checkExpected = function() {
          expect(timer.getElapsed()).to.be.within(950, 1050);
          return done();
        };
        return setTimeout(_checkExpected, 1000);
      });
    });
    describe('#onTick()', function() {
      it('should tick once a second by default', function(done) {
        var timer;
        timer = new Stopwatch();
        timer.onTick(function() {
          expect(timer.getElapsed()).to.be.within(950, 1050);
          timer.stop();
          return done();
        });
        return timer.start();
      });
      it('should only tick if timer is running', function(done) {
        var timer, _err;
        timer = new Stopwatch();
        _err = function() {
          throw new Error('tick occured when not started');
        };
        timer.onTick(_err, 500);
        return setTimeout(done, 1000);
      });
      return it('should allow multiple handlers', function(done) {
        var a, b, timer, _checkDone,
          _this = this;
        timer = new Stopwatch();
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
        timer.onTick(function() {
          b = true;
          return _checkDone();
        });
        return timer.start();
      });
    });
    return describe('#toString()', function() {
      it('should return value in hh:mm:ss.sss format', function() {
        var timer;
        timer = new Stopwatch();
        return expect('' + timer).to.match(/^\d{2}:\d{2}:\d{2}\.\d{3}$/);
      });
      return it('should return a string representing the current elapsed time', function() {
        var timer;
        timer = new Stopwatch();
        timer.previousElapsed = 671000;
        return expect('' + timer).to.match(/^00:11:11\.\d{3}$/);
      });
    });
  });

}).call(this);
