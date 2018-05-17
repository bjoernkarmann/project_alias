
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

  var Sound = require('aplay');
  var music = new Sound();
  //play a soundfile
  //https://www.npmjs.com/package/aplay
  this.playFile = function(path) {
    music.play(path);
    music.on('complete', function () {
      console.log('Done playing');
    });
  }

  this.loopFile = function(path) {
    music.play(path);
    music.on('complete', function () {
      music.play(path);
    });
  }

  this.pauseFile = function(path) {
    music.pause();
  }

  //=====================//
  //     MICROPHONE      //
  //=====================//

  var fs = require('fs');
  var buffer;
  this.startRecord = function(callback){
    //https://github.com/ashishbajaj99/mic
    var mic = require('mic');
    var fft = require('fft-js').fft;
    var micInstance = mic({
      rate: '16000',
      channels: '1',
      debug: false,
      bitwidth: '16'
    });

    var mic = micInstance.getAudioStream();
    var outputFileStream = fs.WriteStream('server/data/output.wav');
    mic.pipe(outputFileStream);
    mic.on('data', function(data) {
      callback(data);
    });
    micInstance.start();
  }
}

module.exports = sound;
