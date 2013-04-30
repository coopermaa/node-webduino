# node-webduino

A web FrontEnd for Arduino. Real-time I/O monitoring and controlling in your browser.

![arduino](http://arduino.cc/en/uploads/Main/ArduinoUno_R3_Front_450px.jpg)

## Installation

See <http://nodejs.org> on how to setup Node, NPM and CoffeeScript, then clone 
this repository and prepare it for use with:

    $ git clone https://github.com/coopermaa/node-webduino
    $ cd node-webduino
    $ npm install

## Usage

Upload Standard Firmata to your Arduino. Better to change samplingInterval from 
19ms to larger, for example 50ms. For Arduino Mega, 100ms is sugggested.

    int samplingInterval = 50;

You'll need to adjust the name of the serial port to match your setup in the
file `app.coffee`, then start the server using either of these:

    $ coffee app.coffee
    $ nodemon app.coffee

Then point your browser at <http://localhost:3000/>.    

Here is a screencut of node-webduino for Arduino UNO:

![screencut](http://bit.ly/XHta3m)
    
## License

[The MIT License](http://opensource.org/licenses/MIT)

Credits: Developers of node.js, Arduino, SocketStream, AngularJS, firmata and 
people who involved in improving Web technologies.
