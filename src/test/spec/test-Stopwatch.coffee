timer =

beforeEach ->
  timer = new Stopwatch()

describe '#start()', ->
  now = new Date().valueOf()

  beforeEach ->
    timer.start()

  it 'should be properly initialized', ->
    expect(timer.started).to.be.true
    expect(timer.previousElapsed).to.equal 0
    expect(timer.running).to.true
    expect(timer.startTime).to.be.a 'number'

  it 'should be keeping track of time', ->
    expect(Math.abs(timer.startTime - now)).to.be.within 0, 50

describe '#pause()', ->
  it 'should not pause if not running', ->
    expect(timer.pause).to.throw Error

  it 'should no longer be running', ->
    timer.start()
    timer.pause()
    expect(timer.running).to.be.false

describe '#stop()', ->
  it 'should not stop if not running', ->
    expect(timer.stop).to.throw(Error)

  it 'should no longer be running', ->
    timer.start()
    timer.stop()
    expect(timer.running).to.be.false

  it 'should no longer be started', ->
    timer.start()
    timer.stop()
    expect(timer.started).to.be.false

  it 'should re-initialize when re-started', (done) ->
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
    timer.start()
    _checkExpected = ->
      expect(timer.elapsed()).to.be.within 1000, 1050
      done()

    setTimeout _checkExpected, 1000

describe '#onTick()', ->
  beforeEach ->
    timer = new Stopwatch()

  it 'should tick once a second by default', (done) ->
    timer.start()

    timer.onTick ->
      expect(timer.elapsed()).to.be.within 1000, 1050
      timer.stop()
      done()

  it 'should allow multiple handlers', (done) ->
    this.timeout 3000
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