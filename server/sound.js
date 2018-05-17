
function sound() {

  //=====================//
  //       SPEAKER       //
  //=====================//

  // volume controle
  var cmd = require('node-cmd');
  //https://www.npmjs.com/package/node-cmd
  this.setVolume = function(n){
    cmd.run('amixer -c 1 sset Speaker '+n);
  }

  //play a soundfile
  //https://www.npmjs.com/package/aplay
  this.playFile = function(path) {
    var Sound = require('aplay');
    var music = new Sound();
    music.play(path);
    music.on('complete', function () {
      console.log('Done playing');
    });
  }

  this.loopFile = function(path) {
    var Sound = require('aplay');
    var music = new Sound();
    music.play(path);
    music.on('complete', function () {
      music.play(path);
    });
  }

  //=====================//
  //     MICROPHONE      //
  //=====================//

  var mic = require('mic');
  var fs = require('fs');

  this.record = function(){
    //https://github.com/ashishbajaj99/mic
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
