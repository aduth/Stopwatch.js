class Stopwatch
  tickTimeouts: {}
  started: false
  running: false
  previousElapsed = 0

  start: ->
    @startTime = new Date().valueOf()
    @running = true

    if !@started
      @started = true
      @previousElapsed = 0
    else
      @_updateTickTimeouts()

  pause: ->
    throw new Error('Timer must be running to pause or stop') unless @running and @started
    clearTimeout(timeoutId) for timeoutId, callback of @tickTimeouts
    @running = false
    @previousElapsed = @elapsed()

  stop: ->
    @pause()
    @tickTimeouts = {}
    @started = false

  elapsed: ->
    return new Date().valueOf() - @startTime + @previousElapsed

  onTick: (callback, resolution = 1000, startImmediate = false) ->
    throw new TypeError('Must provide a valid callback function') unless typeof callback is 'function'
    throw Error('Timer must be running to add tick callback') unless @running and @started

    if startImmediate or @elapsed() is 0
      @_startTicking callback, resolution, true
    else
      nextTick = resolution - (@elapsed() % resolution)
      startTicking = => @_startTicking callback, resolution, startImmediate
      setTimeout startTicking, nextTick

  _startTicking: (callback, resolution = 1000, startImmediate = false, originalResolution) ->
    timeoutId = setTimeout(@_adjustingTick(callback, resolution, startImmediate, originalResolution), resolution)
    @tickTimeouts[timeoutId] =
      callback: callback
      immediate: startImmediate
      resolution: resolution
      startTime: new Date().valueOf()

  _adjustingTick: (callback, resolution = 1000, startImmediate = false, originalResolution) ->
    started = new Date().valueOf()
    intendedResolution = originalResolution or resolution

    =>
      callback @
      if @.running
        elapsed = @elapsed()
        target = @_roundToNearest elapsed, intendedResolution
        adjust = target - elapsed
        @_startTicking(callback, intendedResolution + adjust, startImmediate, intendedResolution)

  _updateTickTimeouts: ->
    timeoutIds = []

    for timeoutId, ticker of @tickTimeouts
      elapsed = new Date().valueOf() - ticker.startTime
      nextTick = Math.abs ticker.resolution - (elapsed % resolution)
      startTicking = => @_startTicking ticker.callback, ticker.resolution, ticker.startImmediate
      setTimeout startTicking, nextTick

    delete @tickTimeouts[timeoutId] for timeoutId of timeoutIds

  _roundToNearest: (number, multiple) ->
    half = multiple / 2
    number + half - (number + half) % multiple

@Stopwatch = Stopwatch
module.exports = Stopwatch if module?.exports?
if typeof define is 'function' and define.amd?
  define 'Stopwatch', -> Stopwatch
