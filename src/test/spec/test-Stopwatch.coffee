describe 'Stopwatch', ->
  it 'should be cross-platform', ->
    expect(new Stopwatch).to.be.instanceOf Stopwatch
    expect(new module.exports).to.be.instanceOf Stopwatch
    expect(defined).to.contain 'Stopwatch'

  describe '#start()', ->
    now =
    timer =

    beforeEach ->
      timer = new Stopwatch()
      now = new Date().valueOf()
      timer.start()

    it 'should be properly initialized', ->
      expect(timer.started).to.be.true
      expect(timer.previousElapsed).to.equal 0
      expect(timer.running).to.true
      expect(timer.startTime).to.be.a 'number'

    it 'should be keeping track of time', ->
      expect(Math.abs(timer.startTime - now)).to.be.within 0, 50

  describe '#pause()', ->
    timer =

    beforeEach ->
      timer = new Stopwatch()

    it 'should not pause if not running', ->
      expect(timer.pause).to.throw Error

    it 'should no longer be running', ->
      timer.start()
      timer.pause()
      expect(timer.running).to.be.false

  describe '#stop()', ->
    it 'should not stop if not running', ->
      timer = new Stopwatch()
      expect(timer.stop).to.throw(Error)

    it 'should no longer be running', ->
      timer = new Stopwatch()
      timer.start()
      timer.stop()
      expect(timer.running).to.be.false

    it 'should no longer be started', ->
      timer = new Stopwatch()
      timer.start()
      timer.stop()
      expect(timer.started).to.be.false

    it 'should re-initialize when re-started', (done) ->
      timer = new Stopwatch()
      timer.start()
      _checkExpected = ->
        timer.stop()
        timer.start()

        expect(timer.previousElapsed).to.equal 0
        expect(Math.abs(timer.startTime - new Date().valueOf())).to.be.within 0, 50
        done()

      setTimeout _checkExpected, 51

  describe '#elapsed()', ->
    it 'should keep track of time', (done) ->
      timer = new Stopwatch()
      timer.start()
      _checkExpected = ->
        expect(timer.elapsed()).to.be.within 950, 1050
        done()

      setTimeout _checkExpected, 1000

  describe '#onTick()', ->
    it 'should tick once a second by default', (done) ->
      this.timeout 5000
      timer = new Stopwatch()
      timer.start()

      timer.onTick ->
        expect(timer.elapsed()).to.be.within 950, 1050
        timer.stop()
        done()

    it 'should allow multiple handlers', (done) ->
      this.timeout 5000
      timer = new Stopwatch()
      timer.start()

      a = b = false
      _checkDone = ->
          if a && b && timer.running
            timer.stop()
            done()

      timer.onTick ->
          a = true
          _checkDone()
      timer.onTick ->
          b = true
          _checkDone()

    it 'should be self-adjusting', (done) ->
      timer = new Stopwatch()
      timer.start()
      now = timer.startTime
      adjusted = false

      timer.onTick ->
        if adjusted
          expect(new Date().valueOf() - now).to.be.within 1550, 1650
          timer.stop()
          done()
        else
          timer.startTime = timer.startTime - 400
          adjusted = true

