
function sound() {

  //=====================//
  //       SPEAKER       //
  //=====================//

  // volume controle
  var cmd = require('node-cmd'); //https://www.npmjs.com/package/node-cmd
  this.setVolume = function(n){
    cmd.run('amixer -c 1 sset Speaker '+n);
  }

  //play a soundfile
  var Sound = require('aplay'); //https://www.npmjs.com/package/aplay
  var music = new Sound();

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
  var mic = require('mic'); //https://github.com/ashishbajaj99/mic
  var micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: false
  });

  this.startRecord = function(callback){
    var mic = micInstance.getAudioStream();
    var outputFileStream = fs.WriteStream('server/data/output.wav');
    mic.pipe(outputFileStream);
    mic.on('data', function(data) {
      var arr = Array.prototype.slice.call(data, 0);
      callback(makeFFT(data));
    });
    micInstance.start();
  }

  //=====================//
  //  FOURIER TRANSFORM  //
  //=====================//

  var FFT = require('fft.js'); // https://github.com/indutny/fft.js
  function makeFFT(data){
    var f = new FFT(1024);
    const realInput = new Array(1024);
    f.realTransform(realInput,data);
    return realInput;
  }
}

module.exports = sound;
