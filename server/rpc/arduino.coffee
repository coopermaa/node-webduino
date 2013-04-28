firmata = require "firmata"
board = null

# Export the setup code, to be started from the main app.coffee
exports.start = (serialport, ss) ->
  board = new firmata.Board serialport, ->
    # read all analogPins
    board.addListener 'analog-read', (pinAndValue) ->
      ss.api.publish.all 'analogReadAll', pinAndValue

    # read all digital Pins
    board.addListener 'digital-read', (pinAndValue) ->
      ss.api.publish.all 'digitalReadAll', pinAndValue      
      
# The exported functions can be called from the client as: 
#   ss.rpc('arduino.actionName', args...)
# e.g: ss.rpc('arduino.digitalWrite', 1)      
exports.actions = (req, res, ss) ->

  pinMode: (pin, mode) ->
    board.pinMode pin, parseInt(mode)
    res true

  digitalWrite: (pin, value) ->   
    board.digitalWrite pin, parseInt(value)
    res true
  
  # value range from 0 to 255
  analogWrite: (pin, value) ->
    board.analogWrite pin, parseInt(value)
    res true
  
  # value range from 0 to 180 degrees
  servoWrite: (pin, value) ->
    board.servoWrite pin, parseInt(value)
    res true
  
  queryCapabilities: ->
    res board.pins  
    
  getAnalogPins: ->
    res board.analogPins      