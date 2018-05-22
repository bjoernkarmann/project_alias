
function sound() {

  //=====================//
  //       SPEAKER       //
  //=====================//

  // Public function to controle the volume
  var cmd = require('node-cmd'); //https://www.npmjs.com/package/node-cmd
  this.setVolume = function(n){
    cmd.run('amixer -c 1 sset Speaker '+n);
  }

  var Sound = require('aplay'); //https://www.npmjs.com/package/aplay
  var music = new Sound();

  // Public functions to play and pause soundfiles
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

  // Public function start recording from the microphone
  // For debugging use on mac use sox
  this.startRecord = function(callback){
    var mic = micInstance.getAudioStream();
    var outputFileStream = fs.WriteStream('server/data/output.wav'); // temp file
    mic.pipe(outputFileStream);
    mic.on('data', function(data) {
      var arr = Array.prototype.slice.call(data, 0); // convert buffer array to num array
      var fft = makeFFT(data);
      callback(fft);
    });
    micInstance.start();
  }

  //=====================//
  //  FOURIER TRANSFORM  //
  //=====================//

  // Private function for Fast Fourier Transformation
  var FFT = require('fft.js'); // https://github.com/indutny/fft.js
  function makeFFT(data){
    var f = new FFT(1024);
    var out = new Array(1024);
    f.realTransform(out,data);
    return out;
  }
}

module.exports = sound;
