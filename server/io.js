function io() {

  //=====================//
  //       RGB LED       //
  //=====================//
  var rpio = require('rpio');
  var Apa102spi = require('apa102-spi');

  this.setRGB = function(){
    var LedDriver = new Apa102spi(3, 100);
    // setLedColor(n, brightness 0-31, red 0-255, green 0-255, blue 0-255)
    LedDriver.setLedColor(0, 1, 255, 0, 0);
    // send data to led
    LedDriver.sendLeds();
  }

  //=====================//
  //        BUTTON       //
  //=====================//


}

module.exports = io;
