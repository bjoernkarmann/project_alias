
function sound() {

  //=====================//
  //      WEBSERVER      //
  //=====================//

  this.setVolume = function(n) {
    //https://www.npmjs.com/package/loudness
    var loudness = require('loudness');
    loudness.setVolume(n, function (err) {});
  }

  this.playFile = function(path) {
    //https://www.npmjs.com/package/aplay
    var Sound = require('aplay');
    var music = new Sound();
    music.play(path);
    music.on('complete', function () {
      console.log('Done playing');
    });
  }

  //=====================//
  //     MICROPHONE      //
  //=====================//

  //https://github.com/ashishbajaj99/mic
  var mic = require('mic');
  var fs = require('fs');

  this.record = function(){
    var micInstance = mic({
        rate: '16000',
        channels: '1',
        debug: true
    });

    var mic = micInstance.getAudioStream();
    var outputFileStream = fs.WriteStream('server/data/output.wav');
    mic.pipe(outputFileStream);
    // mic.on('data', function(data) {
    //     console.log("Recieved Input Stream: " + data.length);
    // });
    micInstance.start();
  }
}

module.exports = sound;
