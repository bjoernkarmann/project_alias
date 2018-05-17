function io() {

  //=====================//
  //       RGB LED       //
  //=====================//

  var Apa102spi = require('apa102-spi');
  var LedDriver = new Apa102spi(3, 100);
  this.setRGB = function(r,g,b){
    // setLedColor(n, brightness 0-31, red 0-255, green 0-255, blue 0-255)
    var brightness = 3;
    LedDriver.setLedColor(0, brightness, r,g,b);
    LedDriver.setLedColor(1, brightness, r,g,b);
    LedDriver.setLedColor(2, brightness, r,g,b);
    // send data to led
    LedDriver.sendLeds();
  }

  this.wakeUp = function(){
    brightness = 30;
    // create animation here
    LedDriver.setLedColor(0, 3, r,g,b);
    LedDriver.setLedColor(1, 3, r,g,b);
    LedDriver.setLedColor(2, 3, r,g,b);
    // send data to led
    LedDriver.sendLeds();
  }

  //=====================//
  //        BUTTON       //
  //=====================//


}

module.exports = io;
