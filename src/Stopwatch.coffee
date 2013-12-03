do ->
    class Stopwatch
      tickIntervals: {}
      started: false
      running: false
      previousElapsed = 0

      start: ->
        @start = new Date().valueOf()
        @running = true

        if !@started
          @started = true
          @previousElapsed = 0
        else
          @_updateTickIntervals()

      pause: ->
        throw new Error('Timer must be running to pause or stop') unless @running and @started
        clearInterval(interval) for interval in @tickIntervals
        @running = false
        @previousElapsed = @elapsed()

      stop: ->
        @pause()
        @tickIntervals = {}
        @started = false

      elapsed: ->
        return new Date().valueOf() - @start + @previousElapsed

      onTick: (callback, resolution = 1000, startImmediate = false) ->
        throw new TypeError('Must provide a valid callback function') unless typeof callback is 'function'
        throw Error('Timer must be running to add tick callback') unless @running and @started

        if startImmediate
          startTicking()
        else
          nextTick = resolution - (@elapsed() % resolution)
          startTicking = => @_startTicking callback, resolution, startImmediate
          setTimeout startTicking, nextTick

      _startTicking: (callback, resolution = 1000, startImmediate = false) ->
        @tickIntervals[setInterval(callback, resolution)] =
          callback: callback
          immediate: startImmediate
          resolution: resolution
          start: new Date().valueOf()

      _updateTickIntervals: ->
        intervalIds = []

        for intervalId, ticker of @tickIntervals
          elapsed = new Date().valueOf() - ticker.start
          nextTick = Math.abs ticker.resolution - (elapsed % resolution)
          startTicking = => @_startTicking ticker.callback, ticker.resolution, ticker.startImmediate
          setTimeout startTicking, nextTick

        delete @tickIntervals[intervalId] for intervalId of intervalIds

    @Stopwatch = Stopwatch
    module.exports = Stopwatch if module?.exports?
    if typeof define is 'function' and define.amd?
        define 'Stopwatch', -> Stopwatch
