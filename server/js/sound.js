
function sound() {

  //=====================//
  //       SPEAKER       //
  //=====================//

  var cmd = require('node-cmd'); //https://www.npmjs.com/package/node-cmd
  var Sound = require('aplay'); //https://www.npmjs.com/package/aplay
  var music = new Sound();

  this.noise = false; // Public toogle for noise

  // Public function to controle the volume
  this.setVolume = function(n){
    cmd.run('amixer -c 1 sset Speaker '+n);
  }
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
  //Decoder dependecies
  var header = require("waveheader"); //https://www.npmjs.com/package/waveheader
  //For calculations
  var math = require('mathjs');
  // wav file encoder
  var wav = require('node-wav');

  //mic config object
  const config = {
    rate: 42100, // 4096 44100 2048 4000
    channels: 2,
    debug: false
  };

  var size = 512; // size to slice

  this.startRecord = function(callback){
    var buffers = [];
    var micInstance =  mic(config);
    var stream = micInstance.getAudioStream();

    stream.on('data', buffer => {
      if(config.debug) console.time("bufferTime");
      buffers.push(buffer); // -> save previous recorded data
      var headerBuf = header(config.rate, config); // ->  create wav header
      buffers.unshift(headerBuf); // -> set header in top of buffers
      var length = math.sum(buffers.map(b => b.length));
      try{
        var result = wav.decode(Buffer.concat(buffers, length)) // -> decode buffers to float array
        var wave = result.channelData[0];
        var slice = wave.slice(0,size);
        var fftValues = makeFFT(slice);
        callback(fftValues);
        if(config.debug) {
          console.timeEnd("bufferTime");
          console.log("Max: "+ math.max(fftValues));
        }
      }catch(err){
        console.error(err);
      }
      buffers = []; // free recorded data
    });
    micInstance.start();
  }

  //=====================//
  //   SOUND ANALYTICS   //
  //=====================//

  var ft = require('fourier-transform');
  // Private function for Fast Fourier Transformation
  function makeFFT(dataStream){
    try{
      var spectrum = ft(dataStream);
    }catch(err){
      console.error(err);
    }
    //Convert from Object to Array
    var arr = [];
    var i = 0;
    Object.keys(spectrum).map(function(key){
      arr[i] = math.round(spectrum[key]*100, 4);
      i++;
    })
    //console.log("Max: "+math.max(arr));
    return arr; // --> Return array of FFT values
  }
}

module.exports = sound;
