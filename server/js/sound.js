
function sound() {

  //=====================//
  //       SPEAKER       //
  //=====================//


  // volume controle
  //https://www.npmjs.com/package/node-cmd
  var cmd = require('node-cmd');
  this.setVolume = function(n){
    cmd.run('amixer -c 1 sset Speaker '+n);
  }

  //play a soundfile
  //https://www.npmjs.com/package/aplay
  var Sound = require('aplay');
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
  var mic = require('mic');
  var micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: false
  });
  this.startRecord = function(callback){
    //https://github.com/ashishbajaj99/mic
    var mic = micInstance.getAudioStream();
    var outputFileStream = fs.WriteStream('server/data/output.wav');
    mic.pipe(outputFileStream);
    mic.on('data', function(data) {
      var arr = Array.prototype.slice.call(data, 0);
      callback(arr);
    });
    micInstance.start();
  }

  //=====================//
  //  FOURIER TRANSFORM  //
  //=====================//

  var fft = require('fft-js').fft;
  this.makeFFT = function(data,callback){
    console.log(Object.values(data));
    // var phasors = fft(data);
    // var frequencies = fftUtil.fftFreq(phasors, 16000);
    // console.log(frequencies);
  }
}

module.exports = sound;
