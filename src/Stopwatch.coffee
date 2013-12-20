class Stopwatch
  constructor: ->
    @tickIntervals = []
    @started = false
    @running = false
    @previousElapsed = 0

  start: ->
    @startTime = new Date().valueOf()
    @running = true

    if !@started
      @started = true
      @previousElapsed = 0
    else
      @_updateTickIntervals()

  pause: ->
    throw new Error('Timer must be running to pause or stop') unless @running and @started
    clearCorrectingInterval(+intervalId) for tick in @tickIntervals when tick.intervalId?
    @running = false
    @previousElapsed = @elapsed()

  stop: ->
    @pause()
    @tickIntervals = []
    @started = false

  elapsed: ->
    now = new Date().valueOf()
    startTime = @startTime or now
    return now - startTime + @previousElapsed

  onTick: (callback, resolution = 1000, startImmediate = false) ->
    throw new TypeError('Must provide a valid callback function') unless typeof callback is 'function'

    unless @running
      @_setTick callback, resolution, true
    else if startImmediate or @elapsed() is 0
      @_startTicking callback, resolution, true
    else
      nextTick = resolution - (@elapsed() % resolution)
      startTicking = => @_startTicking callback, resolution, startImmediate
      setTimeout startTicking, nextTick

  _startTicking: (callback, resolution = 1000, startImmediate = false) ->
    tick = @_setTick callback, resolution, startImmediate
    tick.intervalId = setCorrectingInterval callback, resolution

  _setTick: (callback, resolution = 1000, startImmediate = false) ->
    tick =
      callback: callback
      immediate: startImmediate
      resolution: resolution
      startTime: new Date().valueOf()

    @tickIntervals.push tick

  _updateTickIntervals: ->
    intervalIds = []

    for intervalId, ticker of @tickIntervals
      elapsed = new Date().valueOf() - ticker.startTime
      nextTick = Math.abs ticker.resolution - (elapsed % resolution)
      startTicking = => @_startTicking ticker.callback, ticker.resolution, ticker.startImmediate
      setTimeout startTicking, nextTick

    delete @tickIntervals[intervalId] for intervalId of intervalIds

@Stopwatch = Stopwatch
module.exports = Stopwatch if module?.exports?
if typeof define is 'function' and define.amd?
  define 'Stopwatch', -> Stopwatch
