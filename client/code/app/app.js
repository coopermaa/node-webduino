MODES = {
    INPUT: 0x00,
    OUTPUT: 0x01,
    ANALOG: 0x02,
    PWM: 0x03,
    SERVO: 0x04
};

// Create a 'slider' directive with jquery-ui slider
//   http://jqueryui.com/slider/
angular.module('myApp', [])
  .directive('slider', function() {
  return {
    restrict:'A',           // Attribute
    require: '?',           // Don't raise error if no controller
    link:function(scope, element, attrs, ctrl){
      element.slider({
        min: 0,
        max: attrs.max,
        value: 0,
        range: 'min',
        animate: true,
        slide: function( event, ui ) {          
          // update slider label
          $(this).find('.ui-slider-handle').text(ui.value);          
          
          if (attrs.ngModel) {
            var express = attrs.ngModel + ' = ' + ui.value;  
            scope.$apply(express); 
            if (attrs.ngChange) {
              scope.$eval(attrs.ngChange);
            }
          }  
        },
        create: function(event, ui) {
          // add a label to slider, see: 
          //   http://stackoverflow.com/questions/13033710/jquery-ui-slider-styling
          $(this).find('.ui-slider-handle').width(26);
          $(this).find('.ui-slider-handle').text(0); 
        }
      });
    }
  };
});

// Controller for the app
arduinoCtrl = function($scope) {  
  pinsObject = null;
  $scope.STATES = {0: "Low", 1: "High"};
  $scope.pins = [];
  $scope.availablePins = 0;
  $scope.analogPins = [];

  // init pins capabilities of arduino board
  function queryCapabilitiesCallBack(result) {
     pinsObject = result;     
     
     pin = 0;
     while (pin < pinsObject.length) {
       _supportedModes = [];              
       // skip pin 0 & 1, they are TX/RX pins
       if (pin != 0 && pin != 1) {
         for (var i in pinsObject[pin].supportedModes) {
           mode = pinsObject[pin].supportedModes[i];       
           Object.keys(MODES).forEach(function(key) {                   
             if (mode == MODES[key]) {
               _supportedModes.push({
                 value: mode,
                 name: key
               });  
               return;
             }           
           });
         }
       }              
       
       mode = pinsObject[pin].mode;       // default OUTPUT mode
       if (pinsObject[pin].analogChannel != 127)
          mode = MODES['ANALOG'];
       
       $scope.pins.push({
         pinNO: pin,
         value: 0,
         mode: mode,
         supportedModes: _supportedModes
       });
       pin++;              
     }
     
     $scope.availablePins = $scope.pins.length - 2;
     // console.log('board.pins.length = ' + pinsObject.length);
     // console.log(JSON.stringify($scope.pins));
  };  
  
  $scope.init = function() {    
    ss.rpc('arduino.getAnalogPins', function (value) {
      $scope.analogPins = value;
    });
    ss.rpc('arduino.queryCapabilities', queryCapabilitiesCallBack);
    
    // Listen out for digitalReadAll events coming from the server
    ss.event.on('digitalReadAll', function (pinAndValue) {
      pin = pinAndValue.pin;  
      
      if (typeof($scope.pins[pin]) != 'undefined')
        $scope.pins[pin].value = pinAndValue.value;
    });  
     
    // Listen out for analogReadAll events coming from the server
    ss.event.on('analogReadAll', function (pinAndValue) {
      pin = $scope.analogPins[pinAndValue.pin];  
      
      if (typeof($scope.pins[pin]) != 'undefined') {
        $scope.pins[pin].value = pinAndValue.value; 
        $scope.$apply();  // NOTICE: without this NG will not work, why?
      }  
    });      
  };
           
  $scope.pinMode = function(pin) {
    ss.rpc('arduino.pinMode', pin.pinNO, pin.mode);
    
    // change from ANALOG/PWM to OUTPUT mode, need to validate pin.value
    if (pin.mode == MODES['OUTPUT']) {
      if (pin.value > 1) pin.value = 0;
    }
  };

  // Toggle specified pin
  $scope.digitalToggle = function(pin) {         
    // console.log(pin);
    
    pin.value = (pin.value == 0) ? 1: 0;
    ss.rpc('arduino.digitalWrite', pin.pinNO, pin.value);
  };     
  
  $scope.analogWrite = function(pin) {
    ss.rpc('arduino.analogWrite', pin.pinNO, pin.value);
  };  
  
  $scope.servoWrite = function(pin) {
    ss.rpc('arduino.servoWrite', pin.pinNO, pin.value);
  };    
}

// For client-side debug
listPins = function() {
  txtMode = 'Modes - ';
  Object.keys(MODES).forEach(function(mode) {
    txtMode += MODES[mode] + ':' + mode + ' ';
  });
  console.log(txtMode);

  pin = 0;  
  while (pin < pinsObject.length) {      
    console.log(pin +':' + pinsObject[pin].supportedModes);  
    pin++;
  }  
}  
