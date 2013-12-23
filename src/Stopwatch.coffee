class Stopwatch
  constructor: ->
    @tickIntervals = []
    @started = false
    @running = false
    @previousElapsed = 0

  start: ->
    @startTime = new Date().valueOf()
    @_updateTickIntervals()
    @running = true

    if !@started
      @started = true

  pause: ->
    throw new Error('Timer must be running to pause or stop') unless @running and @started
    clearCorrectingInterval(+tick.intervalId) for tick in @tickIntervals when tick.intervalId?
    @running = false
    @previousElapsed = @elapsed()
    @startTime = null

  stop: ->
    @pause()
    @tickIntervals = []
    @previousElapsed = 0
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

  toString: ->
    duration = @elapsed()
    ms = duration % 1000
    duration = (duration - ms) / 1000
    sec = duration % 60
    duration = (duration - sec) / 60;
    min = duration % 60
    hr = (duration - min) / 60

    return ('0' + hr).slice(-2) + ':' +
      ('0' + min).slice(-2) + ':' +
      ('0' + sec).slice(-2) + '.' +
      ('00' + ms).slice(-3)

  _startTicking: (callback, resolution, startImmediate) ->
    tick = @_setTick callback, resolution, startImmediate
    tick.intervalId = setCorrectingInterval callback, resolution

  _setTick: (callback, resolution, startImmediate) ->
    tick =
      callback: callback
      immediate: startImmediate
      resolution: resolution
      startTime: new Date().valueOf()

    @tickIntervals.push tick
    tick

  _updateTickIntervals: ->
    intervalIds = []

    for intervalId, ticker of @tickIntervals
      elapsed = new Date().valueOf() - ticker.startTime
      _this = @
      startTicking = (-> _this._startTicking @callback, @resolution, @startImmediate).bind(ticker)
      nextTick = Math.abs ticker.resolution - (elapsed % ticker.resolution)
      if not @running or nextTick % ticker.resolution is 0
        startTicking()
      else
        setTimeout startTicking, nextTick

    delete @tickIntervals[intervalId] for intervalId of intervalIds

@Stopwatch = Stopwatch
module.exports = Stopwatch if module?.exports?
if typeof define is 'function' and define.amd?
  define 'Stopwatch', -> Stopwatch
